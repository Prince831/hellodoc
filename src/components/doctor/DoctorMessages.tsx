
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send } from "lucide-react";

interface Message {
  id: string;
  patientId: string;
  patientName: string;
  patientImage?: string;
  messages: {
    id: string;
    content: string;
    sender: "patient" | "doctor";
    timestamp: string;
  }[];
  unread: boolean;
}

// Mock data - would come from Supabase in a real implementation
const mockConversations: Message[] = [
  {
    id: "c1",
    patientId: "p1",
    patientName: "Michael Johnson",
    patientImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    messages: [
      {
        id: "m1",
        content: "Good morning doctor, I wanted to ask about the medication you prescribed.",
        sender: "patient",
        timestamp: "2025-05-03T08:30:00"
      },
      {
        id: "m2",
        content: "Hello Michael, which medication are you asking about?",
        sender: "doctor",
        timestamp: "2025-05-03T08:35:00"
      },
      {
        id: "m3",
        content: "The blood pressure medication. I'm experiencing some side effects.",
        sender: "patient",
        timestamp: "2025-05-03T08:37:00"
      }
    ],
    unread: true
  },
  {
    id: "c2",
    patientId: "p2",
    patientName: "Emma Rodriguez",
    patientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    messages: [
      {
        id: "m4",
        content: "Hi doctor, just checking if my test results are ready?",
        sender: "patient",
        timestamp: "2025-05-02T14:20:00"
      },
      {
        id: "m5",
        content: "Hello Emma, I just received them. Everything looks good!",
        sender: "doctor",
        timestamp: "2025-05-02T15:05:00"
      }
    ],
    unread: false
  },
  {
    id: "c3",
    patientId: "p3",
    patientName: "David Kim",
    messages: [
      {
        id: "m6",
        content: "Doctor, I need to reschedule my appointment for next week.",
        sender: "patient",
        timestamp: "2025-05-01T10:15:00"
      }
    ],
    unread: true
  }
];

const DoctorMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  
  const filteredConversations = mockConversations.filter(conversation => 
    conversation.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    console.log("Sending message:", newMessage);
    // In a real app, we would update the state and send the message to Supabase
    setNewMessage("");
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm grid md:grid-cols-[300px_1fr]">
      {/* Conversation list */}
      <div className="border-r">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="h-[500px] overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 flex items-center gap-3 ${selectedConversation?.id === conversation.id ? 'bg-muted' : ''}`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.patientImage} />
                <AvatarFallback>{conversation.patientName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm truncate">{conversation.patientName}</h3>
                  {conversation.unread && (
                    <Badge variant="default" className="rounded-full h-2 w-2 p-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {conversation.messages[conversation.messages.length - 1].content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Message display */}
      <Card className="border-0 shadow-none">
        <CardContent className="p-0 h-[580px] flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedConversation.patientImage} />
                    <AvatarFallback>{selectedConversation.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="font-semibold">{selectedConversation.patientName}</h2>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        message.sender === 'doctor'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 block text-right mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorMessages;
