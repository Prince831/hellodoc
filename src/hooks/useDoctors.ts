import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/types/doctor";

export const useDoctors = (specialization?: string, searchTerm?: string) => {
  return useQuery({
    queryKey: ["doctors", specialization, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("doctors_public")
        .select("*")
        .eq("availability", true);


      if (specialization) {
        query = query.ilike("specialization", `%${specialization}%`);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,specialization.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order("rating", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as Doctor[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors_public")
        .select("*")
        .eq("id", doctorId)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Doctor;
    },
    enabled: !!doctorId,
  });
};
