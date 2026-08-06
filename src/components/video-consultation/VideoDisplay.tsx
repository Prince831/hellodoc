import { useEffect, useRef } from "react";
import { Loader2, MicOff, VideoOff } from "lucide-react";
import type { CallStatus } from "@/hooks/useWebRTC";

interface VideoDisplayProps {
  peerName: string;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCameraOff: boolean;
  isMuted: boolean;
  status: CallStatus;
}

const STATUS_LABEL: Record<CallStatus, string> = {
  idle: "Preparing…",
  "requesting-media": "Requesting camera and microphone…",
  waiting: "Waiting for the other participant to join…",
  connecting: "Connecting…",
  connected: "Connected",
  failed: "Connection problem",
};

const VideoDisplay = ({
  peerName,
  localStream,
  remoteStream,
  isCameraOff,
  isMuted,
  status,
}: VideoDisplayProps) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const hasRemoteVideo = (remoteStream?.getVideoTracks().length ?? 0) > 0;

  useEffect(() => {
    if (localRef.current) localRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  return (
    <div className="relative flex-1 overflow-hidden rounded-xl border border-border bg-black">
      <video
        ref={remoteRef}
        autoPlay
        playsInline
        className={`h-full w-full object-cover ${hasRemoteVideo ? "" : "invisible"}`}
      />

      {!hasRemoteVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-4xl font-bold">
              {peerName.charAt(0).toUpperCase()}
            </div>
            <p className="text-xl font-medium">{peerName}</p>
            <p className="mt-1 flex items-center justify-center gap-2 text-sm opacity-70">
              {status !== "connected" && status !== "failed" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {STATUS_LABEL[status]}
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 h-32 w-48 overflow-hidden rounded-lg border-2 border-background shadow-lg md:h-44 md:w-64">
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${isCameraOff ? "hidden" : ""}`}
        />
        {isCameraOff && (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <VideoOff className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        {isMuted && (
          <span className="absolute left-2 top-2 rounded-full bg-destructive p-1">
            <MicOff className="h-3 w-3 text-destructive-foreground" />
          </span>
        )}
      </div>
    </div>
  );
};

export default VideoDisplay;
