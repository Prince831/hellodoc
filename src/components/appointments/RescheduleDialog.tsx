import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import AvailableTimeSlots from "./AvailableTimeSlots";
import { useRescheduleAppointment } from "@/hooks/useAppointments";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  doctorId: string;
  currentDate: string;
}

/** Pick a new free time for an existing appointment (used by patients and doctors). */
const RescheduleDialog = ({ open, onOpenChange, appointmentId, doctorId, currentDate }: Props) => {
  const [day, setDay] = useState<Date | undefined>();
  const [slot, setSlot] = useState("");
  const reschedule = useRescheduleAppointment();

  const submit = () =>
    reschedule.mutate(
      { id: appointmentId, date: slot },
      {
        onSuccess: () => {
          setDay(undefined);
          setSlot("");
          onOpenChange(false);
        },
      },
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Reschedule appointment</DialogTitle>
          <DialogDescription>Currently {format(parseISO(currentDate), "EEEE, MMM d 'at' h:mm a")}. The video room stays the same.</DialogDescription>
        </DialogHeader>
        <Calendar
          mode="single"
          selected={day}
          onSelect={(d) => {
            setDay(d);
            setSlot("");
          }}
          disabled={(d) => d < startOfDay(new Date())}
          className={cn("pointer-events-auto mx-auto p-3")}
        />
        {day && <AvailableTimeSlots doctorId={doctorId} selectedDate={day} selectedSlot={slot} onSlotSelect={setSlot} />}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Keep current time
          </Button>
          <Button className="flex-1" disabled={!slot || reschedule.isPending} onClick={submit}>
            {reschedule.isPending ? "Saving…" : "Confirm new time"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
