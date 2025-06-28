
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

      return (data || []) as Doctor[];
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

      return data as Doctor;
    },
    enabled: !!doctorId,
  });
};
