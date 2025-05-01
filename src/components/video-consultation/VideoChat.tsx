
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface VideoChatProps {
  doctorName: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "doctor";
  content: string;
  timestamp: Date;
}

const VideoChat = ({ doctorName }: VideoChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'doctor',
      content: `Hello! I'm Dr. ${doctorName}. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === "") return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage("");
    
    // Simulate doctor response after a short delay
    setTimeout(() => {
      const doctorResponse: ChatMessage = {
        id: `doctor-${Date.now()}`,
        sender: "doctor",
        content: `I understand your concern about "${newMessage}". Let me help you with that.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, doctorResponse]);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start gap-2 max-w-[75%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                {message.sender === "doctor" && (
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {doctorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div 
                    className={`p-3 rounded-lg text-sm ${
                      message.sender === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                  <p className={`text-xs mt-1 text-muted-foreground ${message.sender === "user" ? "text-right" : "text-left"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default VideoChat;
