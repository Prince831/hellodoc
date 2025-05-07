
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message, mockMessages } from "@/types/messages";

interface PatientConversation {
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

// Derive patient conversations from mock messages
const deriveConversationsFromMessages = (): PatientConversation[] => {
  // Group messages by sender
  const conversations: { [key: string]: PatientConversation } = {};
  
  mockMessages.forEach(message => {
    // Skip messages sent by the doctor/current user
    if (message.sender.id === '00000000-0000-0000-0000-000000000000') return;
    
    const senderId = message.sender.id;
    const senderName = message.sender.name;
    
    if (!conversations[senderId]) {
      conversations[senderId] = {
        id: `c-${senderId}`,
        patientId: senderId,
        patientName: senderName,
        messages: [],
        unread: false
      };
    }
    
    // Convert to the conversation message format
    conversations[senderId].messages.push({
      id: message.id,
      content: message.content,
      sender: "patient",
      timestamp: message.created_at
    });
    
    // Mark conversation as unread if any message is unread
    if (!message.read) {
      conversations[senderId].unread = true;
    }
  });
  
  // Add doctor's sent messages
  mockMessages.forEach(message => {
    if (message.sender.id === '00000000-0000-0000-0000-000000000000' && message.content) {
      // Find the conversation this message belongs to
      const recipientId = Object.keys(conversations).find(id => 
        conversations[id].messages.some(m => m.timestamp < message.created_at)
      );
      
      if (recipientId) {
        conversations[recipientId].messages.push({
          id: message.id,
          content: message.content,
          sender: "doctor",
          timestamp: message.created_at
        });
      }
    }
  });
  
  // Sort messages in each conversation by timestamp
  Object.values(conversations).forEach(conversation => {
    conversation.messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });
  
  return Object.values(conversations);
};

const DoctorMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<PatientConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<PatientConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize conversations from mock data
    const derivedConversations = deriveConversationsFromMessages();
    setConversations(derivedConversations);
    
    if (derivedConversations.length > 0) {
      setSelectedConversation(derivedConversations[0]);
    }
  }, []);
  
  const filteredConversations = conversations.filter(conversation => 
    conversation.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Create new message
    const newMsg = {
      id: `m-${Date.now()}`,
      content: newMessage,
      sender: "doctor",
      timestamp: new Date().toISOString()
    };
    
    // Update conversations state
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMsg] }
          : conv
      )
    );
    
    // Update selected conversation
    setSelectedConversation(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newMsg]
      };
    });
    
    // In a real app, this would send the message to the patient via Supabase
    console.log("Sending message to patient:", {
      patientId: selectedConversation.patientId,
      content: newMessage,
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the patient."
    });
    
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
              placeholder="Search patients..."
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
                  {conversation.messages.length > 0 
                    ? conversation.messages[conversation.messages.length - 1].content 
                    : "No messages yet"}
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
