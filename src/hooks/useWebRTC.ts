import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type CallStatus =
  | "idle"
  | "requesting-media"
  | "waiting"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "failed";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] },
];

/** How long a "disconnected" state may last before we force an ICE restart. */
const DISCONNECT_GRACE_MS = 3000;
/** Maximum automatic recovery attempts before we ask the user to act. */
const MAX_RECONNECT_ATTEMPTS = 6;

interface SignalPayload {
  from: string;
  description?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

interface UseWebRTCOptions {
  /** Stable room identifier shared by both participants. */
  roomId: string | null;
  /** Unique id of this participant (auth user id). */
  peerId: string | null;
  /**
   * Perfect-negotiation politeness. The polite peer rolls back on offer
   * collision. Patients are polite, doctors are impolite.
   */
  polite: boolean;
  /** Devices chosen in the pre-join check. */
  audioDeviceId?: string;
  videoDeviceId?: string;
  /** Join preferences from the pre-join check. */
  startMuted?: boolean;
  startCameraOff?: boolean;
}

/**
 * Peer-to-peer WebRTC call using Supabase Realtime broadcast for signalling.
 * Implements the "perfect negotiation" pattern so either side can join first,
 * plus automatic ICE-restart recovery when the media path drops mid-call.
 */
export function useWebRTC({
  roomId,
  peerId,
  polite,
  audioDeviceId,
  videoDeviceId,
  startMuted = false,
  startCameraOff = false,
}: UseWebRTCOptions) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(startMuted);
  const [isCameraOff, setIsCameraOff] = useState(startCameraOff);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const makingOfferRef = useRef(false);
  const ignoreOfferRef = useRef(false);
  const attemptsRef = useRef(0);
  const graceTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const retryTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const recoverRef = useRef<(immediate?: boolean) => void>(() => undefined);
  const politeRef = useRef(polite);
  politeRef.current = polite;
  const prefsRef = useRef({ audioDeviceId, videoDeviceId, startMuted, startCameraOff });
  prefsRef.current = { audioDeviceId, videoDeviceId, startMuted, startCameraOff };

  const send = useCallback((event: string, payload: SignalPayload) => {
    channelRef.current?.send({ type: "broadcast", event, payload });
  }, []);

  /** Manual retry, exposed to the UI. */
  const reconnect = useCallback(() => {
    attemptsRef.current = 0;
    setReconnectAttempt(0);
    recoverRef.current(true);
  }, []);

  useEffect(() => {
    if (!roomId || !peerId) return;

    let cancelled = false;
    let peerPresent = false;
    const remote = new MediaStream();
    setRemoteStream(remote);

    const clearTimers = () => {
      clearTimeout(graceTimerRef.current);
      clearTimeout(retryTimerRef.current);
    };

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    /**
     * Recover the media path without tearing the call down: restart ICE and
     * re-announce ourselves so the peer restarts too. Backs off between tries.
     */
    const recover = (immediate = false) => {
      if (cancelled || pc.connectionState === "closed") return;
      clearTimers();

      if (attemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        setStatus("failed");
        setError(
          "We could not restore the connection automatically. Check your network, then use Reconnect to try again.",
        );
        return;
      }

      const attempt = attemptsRef.current + 1;
      attemptsRef.current = attempt;
      setReconnectAttempt(attempt);
      setStatus("reconnecting");
      setError(null);

      const delay = immediate ? 0 : Math.min(8000, 1000 * 2 ** (attempt - 1));
      retryTimerRef.current = setTimeout(() => {
        if (cancelled || pc.connectionState === "closed") return;
        try {
          // Let the peer know we are still here and want a fresh media path.
          send("hello", { from: peerId });
          pc.restartIce();
          // The impolite peer drives the renegotiation to avoid glare.
          if (!politeRef.current) {
            makingOfferRef.current = true;
            pc.createOffer({ iceRestart: true })
              .then((offer) => pc.setLocalDescription(offer))
              .then(() => send("signal", { from: peerId, description: pc.localDescription! }))
              .catch((err) => console.error("ICE restart failed", err))
              .finally(() => {
                makingOfferRef.current = false;
              });
          }
        } catch (err) {
          console.error("Recovery failed", err);
        }

        // If nothing improved, escalate to the next attempt.
        retryTimerRef.current = setTimeout(() => {
          if (cancelled) return;
          if (pc.connectionState !== "connected") recover();
        }, 6000);
      }, delay);
    };
    recoverRef.current = recover;

    pc.ontrack = ({ track }) => {
      remote.addTrack(track);
      setRemoteStream(new MediaStream(remote.getTracks()));
    };

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) send("signal", { from: peerId, candidate: candidate.toJSON() });
    };

    pc.onconnectionstatechange = () => {
      if (cancelled) return;
      const state = pc.connectionState;

      if (state === "connected") {
        clearTimers();
        attemptsRef.current = 0;
        setReconnectAttempt(0);
        setError(null);
        setStatus("connected");
        return;
      }

      if (state === "connecting") {
        setStatus((s) => (s === "reconnecting" ? s : "connecting"));
        return;
      }

      if (state === "disconnected") {
        // Transient blips often heal by themselves — give ICE a short grace period.
        setStatus("reconnecting");
        clearTimeout(graceTimerRef.current);
        graceTimerRef.current = setTimeout(() => {
          if (!cancelled && pc.connectionState !== "connected") recover(true);
        }, DISCONNECT_GRACE_MS);
        return;
      }

      if (state === "failed") recover(true);
    };

    pc.onnegotiationneeded = async () => {
      try {
        makingOfferRef.current = true;
        await pc.setLocalDescription();
        send("signal", { from: peerId, description: pc.localDescription! });
      } catch (err) {
        console.error("Negotiation failed", err);
      } finally {
        makingOfferRef.current = false;
      }
    };

    const channel = supabase.channel(`webrtc:${roomId}`, {
      config: { broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "hello" }, ({ payload }) => {
        const { from } = payload as SignalPayload;
        if (from === peerId) return;
        peerPresent = true;
        // Answer the greeting so the earlier participant learns we are here.
        send("hello-ack", { from: peerId });
        setStatus((s) => (s === "connected" ? s : s === "reconnecting" ? s : "connecting"));
      })
      .on("broadcast", { event: "hello-ack" }, ({ payload }) => {
        const { from } = payload as SignalPayload;
        if (from === peerId) return;
        peerPresent = true;
        setStatus((s) => (s === "connected" || s === "reconnecting" ? s : "connecting"));
      })
      .on("broadcast", { event: "bye" }, ({ payload }) => {
        const { from } = payload as SignalPayload;
        if (from === peerId) return;
        // A deliberate hang-up — do not try to recover.
        peerPresent = false;
        clearTimers();
        attemptsRef.current = 0;
        setReconnectAttempt(0);
        setError(null);
        remote.getTracks().forEach((t) => remote.removeTrack(t));
        setRemoteStream(new MediaStream());
        setStatus("waiting");
      })
      .on("broadcast", { event: "signal" }, async ({ payload }) => {
        const { from, description, candidate } = payload as SignalPayload;
        if (from === peerId) return;

        try {
          if (description) {
            const offerCollision =
              description.type === "offer" &&
              (makingOfferRef.current || pc.signalingState !== "stable");

            ignoreOfferRef.current = !politeRef.current && offerCollision;
            if (ignoreOfferRef.current) return;

            if (offerCollision) await pc.setLocalDescription({ type: "rollback" });
            await pc.setRemoteDescription(description);
            if (description.type === "offer") {
              await pc.setLocalDescription();
              send("signal", { from: peerId, description: pc.localDescription! });
            }
          } else if (candidate) {
            try {
              await pc.addIceCandidate(candidate);
            } catch (err) {
              if (!ignoreOfferRef.current) throw err;
            }
          }
        } catch (err) {
          console.error("Signalling error", err);
        }
      });

    const subscribe = () => {
      channel.subscribe((state) => {
        if (cancelled) return;
        if (state === "SUBSCRIBED") {
          setStatus((s) =>
            s === "connected" || s === "reconnecting" ? s : peerPresent ? "connecting" : "waiting",
          );
          send("hello", { from: peerId });
          return;
        }
        if (state === "CHANNEL_ERROR" || state === "TIMED_OUT" || state === "CLOSED") {
          // Signalling dropped: without it we cannot renegotiate, so retry it.
          if (pc.connectionState !== "connected") setStatus("reconnecting");
        }
      });
    };

    const start = async () => {
      setStatus("requesting-media");
      const prefs = prefsRef.current;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            ...(prefs.videoDeviceId ? { deviceId: { exact: prefs.videoDeviceId } } : {}),
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            ...(prefs.audioDeviceId ? { deviceId: { exact: prefs.audioDeviceId } } : {}),
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        // Apply the pre-join preferences before publishing the tracks.
        if (prefs.startMuted) stream.getAudioTracks().forEach((t) => (t.enabled = false));
        if (prefs.startCameraOff) stream.getVideoTracks().forEach((t) => (t.enabled = false));
        setIsMuted(prefs.startMuted);
        setIsCameraOff(prefs.startCameraOff);
        localStreamRef.current = stream;
        setLocalStream(stream);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch (err) {
        console.error("Media error", err);
        setError("We could not access your camera or microphone. Check browser permissions.");
        setStatus("failed");
        return;
      }

      subscribe();
    };

    // Network came back (Wi-Fi switch, tunnel, sleep) — recover straight away.
    const handleOnline = () => {
      if (cancelled || pc.connectionState === "connected") return;
      attemptsRef.current = 0;
      setReconnectAttempt(0);
      recover(true);
    };
    const handleOffline = () => {
      if (cancelled || pc.connectionState === "closed") return;
      setStatus("reconnecting");
      setError("You are offline. We will restore the call as soon as your network is back.");
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && pc.connectionState === "disconnected") {
        recover(true);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibility);

    start();

    return () => {
      cancelled = true;
      clearTimers();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibility);
      send("bye", { from: peerId });
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      pc.getSenders().forEach((sender) => sender.track?.stop());
      pc.close();
      pcRef.current = null;
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [roomId, peerId, send]);

  const toggleMute = useCallback(() => {
    const tracks = localStreamRef.current?.getAudioTracks() ?? [];
    const next = !tracks.every((t) => !t.enabled);
    tracks.forEach((t) => (t.enabled = !next));
    setIsMuted(next);
  }, []);

  const toggleCamera = useCallback(() => {
    const tracks = localStreamRef.current?.getVideoTracks() ?? [];
    const next = !tracks.every((t) => !t.enabled);
    tracks.forEach((t) => (t.enabled = !next));
    setIsCameraOff(next);
  }, []);

  return {
    status,
    error,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    reconnectAttempt,
    maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnect,
    toggleMute,
    toggleCamera,
  };
}
