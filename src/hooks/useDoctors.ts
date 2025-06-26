
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/types/doctor";

export const useDoctors = (specialization?: string, searchTerm?: string) => {
  return useQuery({
    queryKey: ['doctors', specialization, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('doctors')
        .select('*')
        .eq('availability', true);

      if (specialization) {
        query = query.ilike('specialization', `%${specialization}%`);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,specialization.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching doctors:', error);
        throw error;
      }

      return (data || []).map(doctor => ({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        yearsOfExperience: doctor.years_of_experience,
        rating: Number(doctor.rating),
        availability: doctor.availability,
        imageUrl: doctor.image_url,
        keywords: doctor.keywords || []
      })) as Doctor[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (error) {
        console.error('Error fetching doctor:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        specialization: data.specialization,
        yearsOfExperience: data.years_of_experience,
        rating: Number(data.rating),
        availability: data.availability,
        imageUrl: data.image_url,
        keywords: data.keywords || []
      } as Doctor;
    },
    enabled: !!doctorId,
  });
};
