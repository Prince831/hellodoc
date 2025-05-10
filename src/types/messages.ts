
// Define the types for our messages system

// Define a single Message type
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  read: boolean;
  attachment_url?: string;
  appointment_id?: string;
  
  // Additional properties used in components
  created_at: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  appointment_request?: {
    date: string;
    reason: string;
  };
  appointment_status?: 'pending' | 'accepted' | 'rejected';
  notification_type?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

// Define a conversation type
export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount: number;
}

// Define a user type for messages
export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'patient' | 'doctor' | 'admin';
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

// Mock doctors for the video consultation feature
export const mockDoctors = [
  {
    id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
    name: "Dr. Sarah Johnson",
    specialization: "General Practitioner",
    yearsExperience: 12,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200",
    education: "Harvard Medical School",
    availability: true,
    languages: ["English", "Spanish"],
  },
  {
    id: "d2c892e6-4073-4f47-8c5f-9b035bdb77f4",
    name: "Dr. Michael Chen",
    specialization: "Cardiologist",
    yearsExperience: 15,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200",
    education: "Johns Hopkins University",
    availability: true,
    languages: ["English", "Mandarin"],
  },
  {
    id: "d3d992e6-4073-4f47-8c5f-9b035bdb77f5",
    name: "Dr. Emily Rodriguez",
    specialization: "Pediatrician",
    yearsExperience: 8,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200",
    education: "Stanford University",
    availability: false,
    languages: ["English", "Spanish"],
  }
];

// Mock messages for testing
export const mockMessages: Message[] = [
  {
    id: "m1",
    content: "Hello, how can I help you today?",
    sender_id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
    receiver_id: "p1",
    timestamp: new Date().toISOString(),
    read: true,
    created_at: new Date().toISOString(),
    sender: {
      id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
      name: "Dr. Sarah Johnson"
    }
  },
  {
    id: "m2",
    content: "I've been having headaches lately. Can we schedule an appointment?",
    sender_id: "p1",
    receiver_id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    sender: {
      id: "p1",
      name: "You"
    },
    appointment_request: {
      date: new Date(Date.now() + 86400000).toISOString(),
      reason: "Recurring headaches"
    },
    appointment_status: "pending",
    notification_type: "appointment_request"
  },
  {
    id: "m3",
    content: "Hi, I'm Dr. Chen. I received your test results and would like to discuss them.",
    sender_id: "d2c892e6-4073-4f47-8c5f-9b035bdb77f4",
    receiver_id: "p1",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    sender: {
      id: "d2c892e6-4073-4f47-8c5f-9b035bdb77f4",
      name: "Dr. Michael Chen"
    },
    attachments: [
      {
        name: "lab_results.pdf",
        url: "#",
        type: "application/pdf"
      }
    ]
  }
];

// Helper function to format messages
export const formatMessages = (messages: Message[]) => {
  return messages;
};
