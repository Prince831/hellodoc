
import { useRef, useEffect } from "react";

interface VideoDisplayProps {
  doctorName: string;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  isVideoOn: boolean;
}

const VideoDisplay = ({ doctorName, localVideoRef, isVideoOn }: VideoDisplayProps) => {
  return (
    <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
      {/* Main video - would be remote video in a real app */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-4xl mx-auto mb-4">
            {doctorName.charAt(0)}
          </div>
          <p className="text-xl font-medium">Dr. {doctorName}</p>
          <p className="text-sm opacity-70">Connecting video...</p>
        </div>
      </div>
      
      {/* Local video preview */}
      <div className="absolute bottom-4 right-4 w-48 h-32 md:w-64 md:h-48 rounded-lg overflow-hidden border-2 border-background shadow-lg">
        <video 
          ref={localVideoRef}
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
        ></video>
        {!isVideoOn && (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Camera Off</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDisplay;
