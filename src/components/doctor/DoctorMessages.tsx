
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockMessages, messageToRawMessage } from "@/types/messages";
import { PatientConversation, PatientMessage } from "@/types/conversations";
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
    // Transform mockMessages to RawMessage format before deriving conversations
    const rawMessages = mockMessages.map(msg => messageToRawMessage(msg));
    
    // Initialize conversations from mock data
    const derivedConversations = deriveConversationsFromMessages(rawMessages);
    setConversations(derivedConversations);
    
    if (derivedConversations.length > 0) {
      setSelectedConversation(derivedConversations[0]);
    }
  }, []);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Create new message with the correct sender type
    const newMsg: PatientMessage = {
      id: `m-${Date.now()}`,
      content: newMessage,
      sender: "doctor", // Use literal "doctor" value to match the union type
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
