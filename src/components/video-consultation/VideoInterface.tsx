
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MessageSquare, FileText } from "lucide-react";
import VideoDisplay from "./VideoDisplay";
import VideoControls from "./VideoControls";
import VideoChat from "./VideoChat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface VideoInterfaceProps {
  doctorName: string;
  onEndCall: () => void;
}

const VideoInterface = ({ doctorName, onEndCall }: VideoInterfaceProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
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
          
          toast({
            title: "Video connected",
            description: "Your camera and microphone are now active",
          });
          
          // Clean up function to stop all tracks when component unmounts
          return () => {
            stream.getTracks().forEach(track => track.stop());
          };
        } catch (error) {
          console.error("Error accessing media devices:", error);
          toast({
            title: "Camera access error",
            description: "Could not access your camera or microphone",
            variant: "destructive"
          });
        }
      };
      
      const cleanup = getMedia();
      
      return () => {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
        isConnected.current = false;
      };
    }
  }, [toast]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // In a real app, this would actually mute the audio track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
    }
    
    toast({
      title: isMuted ? "Microphone unmuted" : "Microphone muted",
      description: isMuted ? "Others can now hear you" : "Others cannot hear you",
    });
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
    
    toast({
      title: isVideoOn ? "Camera turned off" : "Camera turned on",
      description: isVideoOn ? "Others cannot see you" : "Others can now see you",
    });
  };

  const handleSaveNotes = () => {
    toast({
      title: "Notes saved",
      description: "Your consultation notes have been saved",
    });
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
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 flex flex-col">
            <VideoChat doctorName={doctorName} />
          </TabsContent>
          <TabsContent value="notes" className="flex-1">
            <Card className="h-full p-4 flex flex-col">
              <h3 className="font-medium mb-2">Consultation Notes</h3>
              <Textarea 
                className="flex-1 p-2 mb-4 resize-none" 
                placeholder="Take notes during your consultation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button onClick={handleSaveNotes}>Save Notes</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VideoInterface;
