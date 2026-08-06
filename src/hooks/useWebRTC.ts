import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type CallStatus = "idle" | "requesting-media" | "waiting" | "connecting" | "connected" | "failed";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] },
];

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
}

/**
 * Peer-to-peer WebRTC call using Supabase Realtime broadcast for signalling.
 * Implements the "perfect negotiation" pattern so either side can join first.
 */
export function useWebRTC({ roomId, peerId, polite }: UseWebRTCOptions) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const makingOfferRef = useRef(false);
  const ignoreOfferRef = useRef(false);
  const politeRef = useRef(polite);
  politeRef.current = polite;

  const send = useCallback((event: string, payload: SignalPayload) => {
    channelRef.current?.send({ type: "broadcast", event, payload });
  }, []);

  useEffect(() => {
    if (!roomId || !peerId) return;

    let cancelled = false;
    const remote = new MediaStream();
    setRemoteStream(remote);

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    pc.ontrack = ({ track }) => {
      remote.addTrack(track);
      setRemoteStream(new MediaStream(remote.getTracks()));
    };

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) send("signal", { from: peerId, candidate: candidate.toJSON() });
    };

    pc.onconnectionstatechange = () => {
      if (cancelled) return;
      if (pc.connectionState === "connected") setStatus("connected");
      else if (pc.connectionState === "connecting") setStatus("connecting");
      else if (pc.connectionState === "failed") {
        setStatus("failed");
        setError("The connection dropped. Check your network and rejoin the call.");
      }
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
        // Answer the greeting so the earlier participant learns we are here.
        send("hello-ack", { from: peerId });
        setStatus((s) => (s === "connected" ? s : "connecting"));
      })
      .on("broadcast", { event: "hello-ack" }, ({ payload }) => {
        const { from } = payload as SignalPayload;
        if (from === peerId) return;
        setStatus((s) => (s === "connected" ? s : "connecting"));
      })
      .on("broadcast", { event: "bye" }, ({ payload }) => {
        const { from } = payload as SignalPayload;
        if (from === peerId) return;
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

    const start = async () => {
      setStatus("requesting-media");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        setLocalStream(stream);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch (err) {
        console.error("Media error", err);
        setError("We could not access your camera or microphone. Check browser permissions.");
        setStatus("failed");
        return;
      }

      channel.subscribe((state) => {
        if (state !== "SUBSCRIBED" || cancelled) return;
        setStatus((s) => (s === "connected" ? s : "waiting"));
        send("hello", { from: peerId });
      });
    };

    start();

    return () => {
      cancelled = true;
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
    toggleMute,
    toggleCamera,
  };
}
