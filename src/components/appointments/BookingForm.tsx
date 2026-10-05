import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { format, parseISO, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useDoctors } from "@/hooks/useDoctors";
import { useCreateAppointment } from "@/hooks/useAppointments";
import AvailableTimeSlots from "./AvailableTimeSlots";
import VisitPrepAssistant, { CONSULTATION_LABELS, type VisitPrepResult } from "./VisitPrepAssistant";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedDoctorId?: string;
  preSelectedDate?: Date;
}

interface FormData {
  doctorId: string;
  reason: string;
  notes?: string;
}

interface Confirmation {
  doctorName: string;
  date: string;
  consultationType?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose, preSelectedDoctorId, preSelectedDate }) => {
  const { data: doctors = [] } = useDoctors();
  const createAppointment = useCreateAppointment();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(preSelectedDate);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [prep, setPrep] = useState<{ result: VisitPrepResult | null; note: string; urgentAcknowledged: boolean }>({
    result: null,
    note: "",
    urgentAcknowledged: false,
  });
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: { doctorId: preSelectedDoctorId || "" },
  });

  const doctorId = watch("doctorId");
  const doctor = doctors.find((d) => d.id === doctorId);

  useEffect(() => {
    if (preSelectedDoctorId) setValue("doctorId", preSelectedDoctorId);
  }, [preSelectedDoctorId, setValue]);

  useEffect(() => setSelectedSlot(""), [doctorId, selectedDate]);

  const urgentBlocked =
    !!prep.result &&
    (prep.result.consultation_type === "urgent_care" || prep.result.red_flags.length > 0) &&
    !prep.urgentAcknowledged;

  const onSubmit = (data: FormData) => {
    if (!selectedSlot || urgentBlocked) return;
    createAppointment.mutate(
      {
        doctor_id: data.doctorId,
        date: selectedSlot,
        reason: data.reason,
        notes: data.notes,
        consultation_type: prep.result?.consultation_type ?? null,
        ai_visit_note: prep.note.trim() || null,
      },
      {
        onSuccess: () =>
          setConfirmation({
            doctorName: doctor?.name ?? "your doctor",
            date: selectedSlot,
            consultationType: prep.result ? CONSULTATION_LABELS[prep.result.consultation_type] : undefined,
          }),
      },
    );
  };

  const close = () => {
    reset({ doctorId: preSelectedDoctorId || "", reason: "", notes: "" });
    setSelectedSlot("");
    setSelectedDate(undefined);
    setPrep({ result: null, note: "", urgentAcknowledged: false });
    setConfirmation(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        {confirmation ? (
          <div className="space-y-4 py-6 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
            <DialogTitle className="text-2xl">Booking received</DialogTitle>
            <DialogDescription className="text-base">
              {confirmation.doctorName} · {format(parseISO(confirmation.date), "EEEE, MMMM d 'at' h:mm a")}
              {confirmation.consultationType ? ` · ${confirmation.consultationType}` : ""}
            </DialogDescription>
            <p className="text-sm text-muted-foreground">
              Your doctor has been notified and will confirm shortly. You'll get a reminder 24 hours and 1 hour before.
            </p>
            <Button onClick={close}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book an appointment</DialogTitle>
              <DialogDescription>Only times the doctor is actually free are shown, and they update live.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select value={doctorId} onValueChange={(v) => setValue("doctorId", v)} disabled={!!preSelectedDoctorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} — {d.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("doctorId", { required: true })} />
                {errors.doctorId && <p className="text-sm text-destructive">Please select a doctor</p>}
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(d) => d < startOfDay(new Date())}
                      initialFocus
                      className={cn("pointer-events-auto p-3")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {doctorId && selectedDate && (
                <AvailableTimeSlots
                  doctorId={doctorId}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onSlotSelect={setSelectedSlot}
                />
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for visit</Label>
                <Input
                  id="reason"
                  maxLength={500}
                  placeholder="e.g. Skin rash, follow-up, prescription review"
                  {...register("reason", { required: "Please give a reason for your visit", maxLength: 500 })}
                />
                {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
              </div>

              <VisitPrepAssistant onChange={setPrep} />

              <div className="space-y-2">
                <Label htmlFor="notes">Other notes (optional)</Label>
                <Textarea id="notes" maxLength={1000} {...register("notes", { maxLength: 1000 })} />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={close} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createAppointment.isPending || !selectedSlot || urgentBlocked}
                >
                  {createAppointment.isPending ? "Booking…" : "Book appointment"}
                </Button>
              </div>
              {urgentBlocked && (
                <p className="text-center text-sm text-destructive">Please read the urgent-care warning above before booking.</p>
              )}
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
