
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
  patientAvatar?: string;
  patientEmail?: string;
  messages: PatientMessage[];
}
