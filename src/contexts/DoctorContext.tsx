
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Doctor } from '@/components/symptom-checker/DoctorCard';

interface DoctorContextType {
  currentDoctor: Doctor | null;
  activePatientId: string | null;
  setActivePatientId: (id: string | null) => void;
  unreadMessagesCount: number;
  pendingAppointmentsCount: number;
  refreshCounts: () => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

// Mock doctor data - in a real app this would come from authentication
const mockDoctorData: Doctor = {
  id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
  name: "Dr. Sarah Johnson",
  specialization: "General Practitioner",
  yearsExperience: 12,
  rating: 4.8,
  imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200",
  education: "Harvard Medical School",
  availability: true,
  languages: ["English", "Spanish"],
};

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDoctor] = useState<Doctor>(mockDoctorData);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(7);
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(3);

  const refreshCounts = () => {
    // In a real app, this would fetch from Supabase
    console.log("Refreshing notification counts...");
  };

  useEffect(() => {
    // Initial load of counts
    refreshCounts();
  }, []);

  return (
    <DoctorContext.Provider value={{
      currentDoctor,
      activePatientId,
      setActivePatientId,
      unreadMessagesCount,
      pendingAppointmentsCount,
      refreshCounts
    }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctorContext = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctorContext must be used within a DoctorProvider');
  }
  return context;
};
