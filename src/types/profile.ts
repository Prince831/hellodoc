
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  relationship: string;
  preferredLanguage: string;
  preferredContactMethod: string;
  communicationPreferences: string;
  timestamp?: string;
}

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
