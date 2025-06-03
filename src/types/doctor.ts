
export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  education?: string;
  hospital?: string;
  experience?: string;
  languages?: string;
  licenseNumber?: string;
  imageUrl?: string;
  rating?: number;
  availability?: boolean;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  availability: boolean;
  image_url?: string | null;
  keywords: string[];
  created_at: string;
}

export interface DoctorContextType {
  currentDoctor: DoctorProfile | null;
  activePatientId: string | null;
  setActivePatientId: (id: string | null) => void;
  unreadMessagesCount: number;
  pendingAppointmentsCount: number;
  refreshCounts: () => void;
}
