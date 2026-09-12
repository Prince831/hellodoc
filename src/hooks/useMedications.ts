import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface MedicationRecord {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  instructions: string | null;
  active: boolean;
  prescribed_by: string | null;
  doctors?: { id: string; name: string; specialization: string; user_id: string | null } | null;
  prescription_items?: {
    id: string;
    quantity: number | null;
    refills_remaining: number | null;
    pharmacy_notes: string | null;
  }[];
}

const MEDICATION_COLUMNS = `
  id, name, dosage, frequency, start_date, end_date, instructions, active, prescribed_by,
  doctors:prescribed_by ( id, name, specialization, user_id ),
  prescription_items ( id, quantity, refills_remaining, pharmacy_notes )
`;

/** All medications for the signed-in patient, newest first. */
export const useMedications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["medications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medications")
        .select(MEDICATION_COLUMNS)
        .eq("user_id", user!.id)
        .order("active", { ascending: false })
        .order("start_date", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as MedicationRecord[];
    },
  });
};

export interface MedicationInput {
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string | null;
  instructions?: string | null;
}

/** Patient-reported medication. */
export const useAddMedication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MedicationInput) => {
      if (!user) throw new Error("You need to be signed in to add a medication.");
      const { data, error } = await supabase
        .from("medications")
        .insert({ ...input, user_id: user.id, active: true })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast({ title: "Medication added", description: "It now appears in your active list." });
    },
    onError: (error: Error) => {
      toast({ title: "Could not add medication", description: error.message, variant: "destructive" });
    },
  });
};

/** Stop or restart a medication the patient owns. */
export const useSetMedicationActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("medications")
        .update({ active, end_date: active ? null : new Date().toISOString().slice(0, 10) })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast({ title: vars.active ? "Medication restarted" : "Medication marked as finished" });
    },
    onError: (error: Error) => {
      toast({ title: "Could not update medication", description: error.message, variant: "destructive" });
    },
  });
};

/** Ask the prescribing doctor for a refill: sends them a message and a notification. */
export const useRequestRefill = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (medication: MedicationRecord) => {
      if (!user) throw new Error("You need to be signed in to request a refill.");
      const doctorUserId = medication.doctors?.user_id;
      if (!doctorUserId) throw new Error("This medication has no prescribing doctor on file.");

      const content = `Refill request: ${medication.name} (${medication.dosage}, ${medication.frequency}).`;

      const { error: messageError } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: doctorUserId,
        content,
        notification_type: "refill_request",
      });
      if (messageError) throw messageError;

      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: doctorUserId,
        title: "Refill request",
        message: content,
        type: "info",
        action_url: "/messages",
      });
      if (notificationError) throw notificationError;
    },
    onSuccess: () => {
      toast({ title: "Refill requested", description: "Your doctor has been notified." });
    },
    onError: (error: Error) => {
      toast({ title: "Could not request a refill", description: error.message, variant: "destructive" });
    },
  });
};
