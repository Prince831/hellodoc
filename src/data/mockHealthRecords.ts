
export const mockHealthRecords = {
  patient: {
    id: "p123",
    name: "Sarah Johnson",
    dateOfBirth: "1985-06-15",
    gender: "Female",
    bloodType: "A+",
    weight: "65kg",
    height: "170cm",
    allergies: ["Penicillin", "Peanuts"],
    emergencyContact: {
      name: "Michael Johnson",
      relation: "Spouse",
      phone: "(555) 123-4567"
    }
  },
  records: [
    {
      id: "1",
      date: "2024-02-15",
      diagnosis: "Upper Respiratory Infection",
      prescription: "Amoxicillin 500mg, 3x daily for 7 days",
      notes: "Patient presented with fever, cough, and congestion. Follow-up in 1 week if symptoms persist.",
      doctor: {
        name: "Dr. Emily Chen",
        specialization: "Internal Medicine"
      },
      vitals: {
        bloodPressure: "120/80",
        temperature: "38.2°C",
        heartRate: "88 bpm",
        oxygenSaturation: "98%"
      }
    },
    {
      id: "2",
      date: "2024-01-10",
      diagnosis: "Annual Physical Examination",
      prescription: null,
      notes: "All vitals normal. Recommended increased physical activity and reduced sodium intake.",
      doctor: {
        name: "Dr. James Wilson",
        specialization: "Family Medicine"
      },
      vitals: {
        bloodPressure: "118/75",
        temperature: "36.6°C",
        heartRate: "72 bpm",
        oxygenSaturation: "99%"
      }
    },
    {
      id: "3",
      date: "2023-11-28",
      diagnosis: "Migraine",
      prescription: "Sumatriptan 50mg as needed",
      notes: "Patient reports increased frequency of migraines. Recommended keeping a trigger diary.",
      doctor: {
        name: "Dr. Sarah Martinez",
        specialization: "Neurology"
      },
      vitals: {
        bloodPressure: "125/82",
        temperature: "36.8°C",
        heartRate: "76 bpm",
        oxygenSaturation: "98%"
      }
    }
  ]
};
