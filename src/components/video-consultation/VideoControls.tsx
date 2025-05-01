
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOn: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  onEndCall: () => void;
}

const VideoControls = ({ 
  isMuted, 
  isVideoOn, 
  toggleMute, 
  toggleVideo, 
  onEndCall 
}: VideoControlsProps) => {
  return (
    <div className="flex justify-center gap-4 p-4">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full h-12 w-12"
        onClick={toggleMute}
      >
        {isMuted ? <MicOff /> : <Mic />}
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full h-12 w-12"
        onClick={toggleVideo}
      >
        {isVideoOn ? <Video /> : <VideoOff />}
      </Button>
      <Button 
        variant="destructive" 
        size="icon" 
        className="rounded-full h-12 w-12"
        onClick={onEndCall}
      >
        <PhoneOff />
      </Button>
    </div>
  );
};

export default VideoControls;
