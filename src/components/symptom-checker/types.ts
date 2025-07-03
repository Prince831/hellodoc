
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  availability: boolean;
  keywords: string[];
  image_url?: string;
  phone?: string;
  email?: string;
  bio?: string;
  education?: string;
  languages?: string[];
  consultation_fee?: number;
  hospital?: string;
}

export interface DoctorCardProps {
  doctor: Doctor;
  showBookingButton?: boolean;
  onMessageClick?: () => void;
  onBookAppointment?: (doctorId: string) => void;
  onContactDoctor?: (doctorId: string) => void;
  compact?: boolean;
}
