
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockMessages } from "@/types/messages";
import { PatientConversation } from "@/types/conversations";
import { deriveConversationsFromMessages } from "@/utils/conversationUtils";
import ConversationList from "./conversation/ConversationList";
import MessageView from "./conversation/MessageView";

const DoctorMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<PatientConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<PatientConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize conversations from mock data
    const derivedConversations = deriveConversationsFromMessages(mockMessages);
    setConversations(derivedConversations);
    
    if (derivedConversations.length > 0) {
      setSelectedConversation(derivedConversations[0]);
    }
  }, []);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Create new message with the correct sender type
    const newMsg = {
      id: `m-${Date.now()}`,
      content: newMessage,
      sender: "doctor" as const, // Use a const assertion to ensure TypeScript knows this is specifically "doctor"
      timestamp: new Date().toISOString()
    };
    
    // Update conversations state with properly typed sender
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMsg] }
          : conv
      )
    );
    
    // Update selected conversation with properly typed sender
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
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {/* Message display */}
      <MessageView
        conversation={selectedConversation}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default DoctorMessages;
