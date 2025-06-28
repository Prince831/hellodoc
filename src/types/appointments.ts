
export interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  date: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  created_at: string;
  doctor: {
    name: string;
    specialization: string;
    image_url?: string;
  };
}
