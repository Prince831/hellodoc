
export interface Appointment {
  id: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes: string | null;
  doctor: {
    name: string;
    specialization: string;
  };
}
