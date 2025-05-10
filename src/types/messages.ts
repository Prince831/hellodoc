
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

// Helper function to format messages
export const formatMessages = (messages: Message[]) => {
  return messages;
};
