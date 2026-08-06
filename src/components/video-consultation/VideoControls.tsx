import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface VideoControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  toggleMute: () => void;
  toggleCamera: () => void;
  onEndCall: () => void;
}

const VideoControls = ({
  isMuted,
  isCameraOff,
  toggleMute,
  toggleCamera,
  onEndCall,
}: VideoControlsProps) => (
  <div className="flex justify-center gap-4 p-4">
    <Button
      variant={isMuted ? "secondary" : "outline"}
      size="icon"
      className="h-12 w-12 rounded-full"
      aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
      onClick={toggleMute}
    >
      {isMuted ? <MicOff /> : <Mic />}
    </Button>
    <Button
      variant={isCameraOff ? "secondary" : "outline"}
      size="icon"
      className="h-12 w-12 rounded-full"
      aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
      onClick={toggleCamera}
    >
      {isCameraOff ? <VideoOff /> : <Video />}
    </Button>
    <Button
      variant="destructive"
      size="icon"
      className="h-12 w-12 rounded-full"
      aria-label="End call"
      onClick={onEndCall}
    >
      <PhoneOff />
    </Button>
  </div>
);

export default VideoControls;
