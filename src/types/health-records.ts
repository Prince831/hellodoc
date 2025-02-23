
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  weight: string;
  height: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  prescription: string | null;
  notes: string;
  doctor: {
    name: string;
    specialization: string;
  };
  vitals: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    oxygenSaturation: string;
  };
}

export interface HealthRecords {
  patient: Patient;
  records: MedicalRecord[];
}
