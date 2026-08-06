
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SearchResult } from "@/types/search";

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Search doctors
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors_public')
        .select('id, name, specialization')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (doctorsError) throw doctorsError;

      // Search appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id, 
          date,
          reason,
          doctor_id
        `)
        .ilike('reason', `%${query}%`)
        .limit(5);

      if (appointmentsError) throw appointmentsError;

      // Search health records
      const { data: records, error: recordsError } = await supabase
        .from('health_records')
        .select(`
          id, 
          diagnosis,
          date
        `)
        .ilike('diagnosis', `%${query}%`)
        .limit(5);

      if (recordsError) throw recordsError;

      // Search for symptoms in symptom checks
      const { data: symptoms, error: symptomsError } = await supabase
        .from('symptom_checks')
        .select('id, symptoms')
        .ilike('symptoms', `%${query}%`)
        .limit(5);

      if (symptomsError) throw symptomsError;

      const formattedResults: SearchResult[] = [
        ...(doctors || []).map((doctor) => ({
          id: doctor.id,
          title: doctor.name,
          description: `${doctor.specialization}`,
          icon: "user-md",
          type: 'doctor' as const,
          url: `/doctors?id=${doctor.id}`
        })),
        ...(appointments || []).map((appointment) => ({
          id: appointment.id,
          title: "Appointment",
          description: `${new Date(appointment.date).toLocaleDateString()} - ${appointment.reason}`,
          icon: "calendar",
          type: 'appointment' as const,
          url: `/appointments?id=${appointment.id}`
        })),
        ...(records || []).map((record) => ({
          id: record.id,
          title: record.diagnosis,
          description: `Record from ${new Date(record.date).toLocaleDateString()}`,
          icon: "file-text",
          type: 'record' as const,
          url: `/health-records?id=${record.id}`
        })),
        ...(symptoms || []).map((symptom) => ({
          id: symptom.id,
          title: "Symptom",
          description: symptom.symptoms,
          icon: "activity",
          type: 'symptom' as const,
          url: `/symptom-checker?symptom=${encodeURIComponent(symptom.symptoms)}`
        }))
      ];

      setResults(formattedResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, performSearch };
}
