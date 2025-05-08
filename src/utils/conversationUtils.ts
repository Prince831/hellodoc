
import { Message } from "@/types/messages";
import { PatientConversation, PatientMessage } from "@/types/conversations";

export const deriveConversationsFromMessages = (mockMessages: Message[]): PatientConversation[] => {
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
    
    // Convert to the conversation message format with explicit typing
    const patientMessage: PatientMessage = {
      id: message.id,
      content: message.content,
      sender: "patient", // Use the literal "patient" value to match the union type
      timestamp: message.created_at
    };
    
    conversations[senderId].messages.push(patientMessage);
    
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
        // Create doctor message with correct typing
        const doctorMessage: PatientMessage = {
          id: message.id,
          content: message.content,
          sender: "doctor", // Use the literal "doctor" value to match the union type
          timestamp: message.created_at
        };
        
        conversations[recipientId].messages.push(doctorMessage);
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
