
export interface AppointmentRequest {
  date: string;
  reason: string;
}

export interface Attachment {
  name: string;
  url?: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
  };
  read: boolean;
  appointment_request?: AppointmentRequest | null;
  appointment_status?: 'pending' | 'accepted' | 'rejected' | null;
  notification_type?: string | null;
  attachments?: Attachment[];
}

export const mockDoctors = [
  {
    id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
    name: "Dr. John Smith",
  },
  {
    id: "d2c892e6-4073-4f47-8c5f-9b035bdb77f4",
    name: "Dr. Sarah Johnson",
  }
];

export const mockPatients = [
  {
    id: "p1",
    name: "Michael Johnson",
  },
  {
    id: "p2",
    name: "Emma Rodriguez",
  },
  {
    id: "p3",
    name: "David Kim",
  },
  {
    id: "p4",
    name: "Sophia Martinez",
  }
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    content: "Hello, how are you feeling today?",
    created_at: new Date().toISOString(),
    sender: mockDoctors[0],
    read: false,
  },
  {
    id: "m2",
    content: "Your test results are ready for review.",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    sender: mockDoctors[1],
    read: true,
  },
  {
    id: "m3",
    content: "Appointment request for regular checkup",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    sender: mockDoctors[0],
    read: true,
    appointment_request: {
      date: "2024-03-01 10:00",
      reason: "Regular checkup"
    },
    appointment_status: "pending",
    notification_type: "appointment_request"
  },
  {
    id: "m4",
    content: "Following up on your last visit",
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    sender: mockDoctors[1],
    read: true,
    appointment_request: {
      date: "2024-02-15 14:30",
      reason: "Follow-up consultation"
    },
    appointment_status: "accepted",
    notification_type: "appointment_confirmed",
    attachments: [
      {
        name: "test_results.pdf",
        type: "application/pdf",
        size: 1024000
      }
    ]
  },
  // Patient messages to doctors
  {
    id: "m5",
    content: "I've been experiencing headaches recently.",
    created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    sender: mockPatients[0],
    read: false,
  },
  {
    id: "m6",
    content: "When should I take the new medication?",
    created_at: new Date(Date.now() - 129600000).toISOString(), // 36 hours ago
    sender: mockPatients[1],
    read: true,
  },
  {
    id: "m7",
    content: "My blood sugar readings have improved.",
    created_at: new Date(Date.now() - 216000000).toISOString(), // 60 hours ago
    sender: mockPatients[2],
    read: false,
  }
];
