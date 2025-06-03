
import { PatientConversation, PatientMessage } from "@/types/conversations";

interface RawMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: string;
  receiver_id: string;
  sender_id: string;
}

export const deriveConversationsFromMessages = (messages: RawMessage[]): PatientConversation[] => {
  const conversationsMap = new Map<string, PatientConversation>();
  
  messages.forEach(msg => {
    // Determine if this is a patient or doctor message
    const isFromDoctor = msg.sender.name.includes('Dr.');
    const patientId = isFromDoctor ? msg.receiver_id : msg.sender_id;
    const patientName = isFromDoctor ? 'Patient' : msg.sender.name;
    
    if (!conversationsMap.has(patientId)) {
      conversationsMap.set(patientId, {
        id: patientId,
        patientId,
        patientName,
        messages: [],
        unreadCount: 0
      });
    }
    
    const conversation = conversationsMap.get(patientId)!;
    const patientMessage: PatientMessage = {
      id: msg.id,
      content: msg.content,
      sender: isFromDoctor ? "doctor" : "patient",
      timestamp: msg.timestamp
    };
    
    conversation.messages.push(patientMessage);
    conversation.lastMessage = patientMessage;
    
    if (!isFromDoctor) {
      conversation.unreadCount++;
    }
  });
  
  return Array.from(conversationsMap.values());
};
