
import { Message } from "@/types/messages";

export interface PatientMessage {
  id: string;
  content: string;
  sender: "patient" | "doctor";
  timestamp: string;
}

export interface PatientConversation {
  id: string;
  patientId: string;
  patientName: string;
  patientImage?: string;
  messages: PatientMessage[];
  unread: boolean;
}
