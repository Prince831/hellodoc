
// This is a temporary mock file that would be replaced by actual Supabase data in production

export interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  flagged?: boolean;
  sender: {
    id: string;
    name: string;
    role?: string;
  };
  receiver?: {
    id: string;
    name: string;
    role?: string;
  };
  appointment_request?: {
    date: string;
    reason: string;
  };
  appointment_status?: 'pending' | 'accepted' | 'rejected';
  notification_type?: 'appointment_request' | 'appointment_confirmed' | 'appointment_rejected';
  attachments?: Array<{
    name: string;
    url?: string;
  }>;
}

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

export const mockMessages: RawMessage[] = [
  {
    id: "msg1",
    content: "Hello Dr. Johnson, I've been having some concerns about my blood pressure medication.",
    from_user_id: "patient-123",
    to_user_id: "doctor-456",
    timestamp: "2025-05-08T09:30:00",
    patient_id: "patient-123",
    patient_name: "Michael Brown",
    patient_email: "michael.brown@example.com"
  },
  {
    id: "msg2",
    content: "Hi Michael, I'm happy to help. What specific concerns do you have?",
    from_user_id: "doctor-456",
    to_user_id: "patient-123",
    timestamp: "2025-05-08T10:15:00",
    patient_id: "patient-123",
    patient_name: "Michael Brown",
    patient_email: "michael.brown@example.com"
  },
  {
    id: "msg3",
    content: "I've been feeling dizzy sometimes after taking the medication in the morning.",
    from_user_id: "patient-123",
    to_user_id: "doctor-456",
    timestamp: "2025-05-08T10:30:00",
    patient_id: "patient-123",
    patient_name: "Michael Brown",
    patient_email: "michael.brown@example.com"
  },
  {
    id: "msg4",
    content: "That could be due to a drop in blood pressure. Let's schedule a quick appointment to check your readings.",
    from_user_id: "doctor-456",
    to_user_id: "patient-123",
    timestamp: "2025-05-08T10:45:00",
    patient_id: "patient-123",
    patient_name: "Michael Brown",
    patient_email: "michael.brown@example.com"
  },
  {
    id: "msg5",
    content: "Dr. Johnson, my daughter has a fever that hasn't gone down for two days.",
    from_user_id: "patient-456",
    to_user_id: "doctor-456",
    timestamp: "2025-05-08T14:20:00",
    patient_id: "patient-456",
    patient_name: "Emma Rodriguez",
    patient_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    patient_email: "emma.r@example.com"
  },
  {
    id: "msg6",
    content: "Hi Emma, how high is the fever? Has she been taking any medication for it?",
    from_user_id: "doctor-456",
    to_user_id: "patient-456",
    timestamp: "2025-05-08T14:35:00",
    patient_id: "patient-456",
    patient_name: "Emma Rodriguez",
    patient_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    patient_email: "emma.r@example.com"
  },
  {
    id: "msg7",
    content: "It's been around 102°F. I've given her children's Tylenol but it only helps temporarily.",
    from_user_id: "patient-456",
    to_user_id: "doctor-456",
    timestamp: "2025-05-08T14:40:00",
    patient_id: "patient-456",
    patient_name: "Emma Rodriguez",
    patient_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    patient_email: "emma.r@example.com"
  },
  {
    id: "msg8",
    content: "Dr. Johnson, when will my test results be available?",
    from_user_id: "patient-789",
    to_user_id: "doctor-456",
    timestamp: "2025-05-08T16:10:00",
    patient_id: "patient-789",
    patient_name: "David Kim",
    patient_email: "david.k@example.com"
  }
];

// Mock doctors data
export const mockDoctors = [
  {
    id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
    name: "Dr. Sarah Johnson",
    specialty: "Family Medicine",
    rating: 4.8,
    availability: ["Monday", "Wednesday", "Friday"],
    avatar: null
  },
  {
    id: "d2c892e6-4073-4f47-8c5f-9b035bdb77f4",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    rating: 4.9,
    availability: ["Tuesday", "Thursday"],
    avatar: null
  },
  {
    id: "d3d992e6-4073-4f47-8c5f-9b035bdb77f5",
    name: "Dr. Lisa Wong",
    specialty: "Pediatrics",
    rating: 4.7,
    availability: ["Monday", "Tuesday", "Friday"],
    avatar: null
  }
];
