
import { PatientMessage, PatientConversation } from "@/types/conversations";

interface RawMessage {
  id: string;
  content: string;
  from_user_id: string;
  to_user_id: string;
  timestamp: string;
  patient_id: string;
  patient_name: string;
  patient_avatar?: string;
  patient_email?: string;
}

/**
 * Derive conversation objects from flat message arrays
 */
export const deriveConversationsFromMessages = (messages: RawMessage[]): PatientConversation[] => {
  const conversationMap = new Map<string, PatientConversation>();
  
  // Group messages by patient
  messages.forEach(message => {
    if (!conversationMap.has(message.patient_id)) {
      conversationMap.set(message.patient_id, {
        id: `conv-${message.patient_id}`,
        patientId: message.patient_id,
        patientName: message.patient_name,
        patientAvatar: message.patient_avatar,
        patientEmail: message.patient_email,
        messages: []
      });
    }
    
    const messageObj: PatientMessage = {
      id: message.id,
      content: message.content,
      sender: message.from_user_id === message.patient_id ? "patient" : "doctor",
      timestamp: message.timestamp
    };
    
    const conversation = conversationMap.get(message.patient_id);
    if (conversation) {
      conversation.messages.push(messageObj);
    }
  });
  
  // Sort each conversation's messages by timestamp
  const conversations = Array.from(conversationMap.values());
  conversations.forEach(conv => {
    conv.messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });
  
  return conversations;
};
