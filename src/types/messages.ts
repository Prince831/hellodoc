export interface AppointmentRequest {
  date: string;
  reason: string;
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
}

export const mockDoctors = [
  {
    id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
    name: "John Smith",
  },
  {
    id: "d2c892e6-4073-4f47-8c5f-9b035bdb77f4",
    name: "Sarah Johnson",
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
    notification_type: "appointment_confirmed"
  }
];
