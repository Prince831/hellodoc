import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useWebRTC } from "@/hooks/useWebRTC";
import type { CallType } from "@/hooks/useCallSignaling";

interface CallInterfaceProps {
  isActive: boolean;
  callType: CallType;
  /** Shared room id — both participants must use the same value. */
  roomId: string;
  /** Auth user id of the local participant. */
  peerId: string;
  /** Callee is the polite peer in perfect negotiation. */
  polite: boolean;
  doctorName: string;
  doctorAvatar?: string;
  /** True while we are ringing the other side and they have not answered. */
  ringing?: boolean;
  onEndCall: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const CallInterface = ({
  isActive,
  callType,
  roomId,
  peerId,
  polite,
  doctorName,
  doctorAvatar,
  ringing = false,
  onEndCall,
}: CallInterfaceProps) => {
  const [duration, setDuration] = useState(0);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const {
    status,
    error,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    reconnectAttempt,
    maxReconnectAttempts,
    reconnect,
    toggleMute,
    toggleCamera,
  } = useWebRTC({
    roomId: isActive ? roomId : null,
    peerId: isActive ? peerId : null,
    polite,
    audioOnly: callType === "voice",
  });

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (status !== "connected") return;
    const id = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  if (!isActive) return null;

  const hasRemoteVideo = (remoteStream?.getVideoTracks().length ?? 0) > 0;
  const statusLabel =
    status === "connected"
      ? formatDuration(duration)
      : ringing || status === "waiting"
        ? "Ringing…"
        : status === "reconnecting"
          ? `Reconnecting (${reconnectAttempt}/${maxReconnectAttempts})`
          : status === "requesting-media"
            ? "Preparing your devices…"
            : status === "failed"
              ? "Call problem"
              : "Connecting…";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl overflow-hidden rounded-2xl border border-border/40 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={doctorAvatar} alt={doctorName} />
              <AvatarFallback>{doctorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold leading-tight">{doctorName}</p>
              <p className="text-xs text-muted-foreground">{statusLabel}</p>
            </div>
          </div>
          <Badge variant={callType === "video" ? "default" : "secondary"}>
            {callType === "video" ? (
              <Video className="mr-1 h-3 w-3" />
            ) : (
              <Phone className="mr-1 h-3 w-3" />
            )}
            {callType === "video" ? "Video call" : "Voice call"}
          </Badge>
        </div>

        {error && (
          <Alert variant={status === "failed" ? "destructive" : "default"} className="m-4 mb-0">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
              <span>{error}</span>
              <Button size="sm" variant="outline" onClick={reconnect}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="p-4">
          {callType === "video" ? (
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`h-full w-full object-cover ${hasRemoteVideo ? "" : "invisible"}`}
              />
              {!hasRemoteVideo && (
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <Avatar className="mx-auto h-20 w-20">
                      <AvatarImage src={doctorAvatar} alt={doctorName} />
                      <AvatarFallback className="text-2xl">{doctorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="mt-3 flex items-center justify-center gap-2 text-sm text-white/80">
                      {status !== "failed" && <Loader2 className="h-4 w-4 animate-spin" />}
                      {statusLabel}
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 right-3 h-24 w-36 overflow-hidden rounded-lg border-2 border-background shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${isCameraOff ? "hidden" : ""}`}
                />
                {isCameraOff && (
                  <div className="grid h-full w-full place-items-center bg-muted">
                    <VideoOff className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid place-items-center rounded-xl bg-muted/40 py-10 text-center">
              <Avatar className="h-24 w-24 animate-pulse-soft">
                <AvatarImage src={doctorAvatar} alt={doctorName} />
                <AvatarFallback className="text-3xl">{doctorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="mt-4 text-lg font-medium">{doctorName}</p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                {status !== "connected" && status !== "failed" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {statusLabel}
              </p>
            </div>
          )}

          {/* Remote audio always plays, including in voice-only calls. */}
          <audio ref={remoteAudioRef} autoPlay className="hidden" />

          <div className="mt-5 flex justify-center gap-4">
            <Button
              size="icon"
              variant={isMuted ? "destructive" : "outline"}
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
              className="h-12 w-12 rounded-full"
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {callType === "video" && (
              <Button
                size="icon"
                variant={isCameraOff ? "destructive" : "outline"}
                onClick={toggleCamera}
                aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
                className="h-12 w-12 rounded-full"
              >
                {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </Button>
            )}

            <Button
              size="icon"
              variant="destructive"
              onClick={onEndCall}
              aria-label="End call"
              className="h-12 w-12 rounded-full"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
