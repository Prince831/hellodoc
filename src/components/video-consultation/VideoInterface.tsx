
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoInterfaceProps {
  doctorName: string;
  onEndCall: () => void;
}

const VideoInterface = ({ doctorName, onEndCall }: VideoInterfaceProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [messages, setMessages] = useState<{sender: string; message: string; time: Date}[]>([
    { sender: doctorName, message: "Hello, how are you feeling today?", time: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState("");
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { sender: "You", message: newMessage, time: new Date() }
      ]);
      setNewMessage("");
      
      // Simulate doctor response after a short delay
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            sender: doctorName, 
            message: "Thank you for sharing that information. Let me take a look at your records.", 
            time: new Date() 
          }
        ]);
      }, 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
      <div className="md:col-span-2 flex flex-col">
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
        
        {/* Call controls */}
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
            <Card className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.sender === "You" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}
                      >
                        <div className="font-medium text-sm">{msg.sender}</div>
                        <div>{msg.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {msg.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button onClick={sendMessage}>Send</Button>
              </div>
            </Card>
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
