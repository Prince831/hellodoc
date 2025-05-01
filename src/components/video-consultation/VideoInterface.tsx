
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import VideoDisplay from "./VideoDisplay";
import VideoControls from "./VideoControls";
import VideoChat from "./VideoChat";

interface VideoInterfaceProps {
  doctorName: string;
  onEndCall: () => void;
}

const VideoInterface = ({ doctorName, onEndCall }: VideoInterfaceProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  // Simulated remote video feed - in a real app, this would use WebRTC
  const isConnected = useRef<boolean>(false);
  
  useEffect(() => {
    // Simulate setting up a video call
    if (!isConnected.current) {
      isConnected.current = true;
      
      // Access the user's camera for local preview
      const getMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          
          // Clean up function to stop all tracks when component unmounts
          return () => {
            stream.getTracks().forEach(track => track.stop());
          };
        } catch (error) {
          console.error("Error accessing media devices:", error);
        }
      };
      
      const cleanup = getMedia();
      
      return () => {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
        isConnected.current = false;
      };
    }
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // In a real app, this would actually mute the audio track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    
    // In a real app, this would actually disable the video track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
      <div className="md:col-span-2 flex flex-col">
        <VideoDisplay 
          doctorName={doctorName}
          localVideoRef={localVideoRef}
          isVideoOn={isVideoOn}
        />
        
        <VideoControls
          isMuted={isMuted}
          isVideoOn={isVideoOn}
          toggleMute={toggleMute}
          toggleVideo={toggleVideo}
          onEndCall={onEndCall}
        />
      </div>
      
      <div className="md:col-span-1">
        <Tabs defaultValue="chat" className="h-full flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              Notes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 flex flex-col">
            <VideoChat doctorName={doctorName} />
          </TabsContent>
          <TabsContent value="notes" className="flex-1">
            <Card className="h-full p-4">
              <h3 className="font-medium mb-2">Consultation Notes</h3>
              <textarea 
                className="w-full h-[calc(100%-3rem)] p-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-primary" 
                placeholder="Take notes during your consultation..."
              ></textarea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VideoInterface;
