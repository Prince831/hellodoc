
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";

interface VideoChatProps {
  doctorName: string;
}

const VideoChat = ({ doctorName }: VideoChatProps) => {
  const [messages, setMessages] = useState<{sender: string; message: string; time: Date}[]>([
    { sender: doctorName, message: "Hello, how are you feeling today?", time: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState("");

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
  );
};

export default VideoChat;
