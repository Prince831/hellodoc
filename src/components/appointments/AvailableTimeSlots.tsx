import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Clock, CalendarCheck, Radio } from "lucide-react";
import { useAvailableSlots } from "@/hooks/useAppointments";

interface AvailableTimeSlotsProps {
  doctorId: string;
  selectedDate: Date;
  /** ISO timestamp of the chosen slot. */
  selectedSlot?: string;
  onSlotSelect: (iso: string) => void;
}

/** Live list of a doctor's free start times for one day. */
const AvailableTimeSlots: React.FC<AvailableTimeSlotsProps> = ({
  doctorId,
  selectedDate,
  selectedSlot,
  onSlotSelect,
}) => {
  const { data: slots = [], isLoading, isError } = useAvailableSlots(doctorId, selectedDate);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-5 w-5" />
          Free times — {format(selectedDate, "EEE, MMM d")}
          <span className="ml-auto flex items-center gap-1 text-xs font-normal text-muted-foreground">
            <Radio className="h-3 w-3 text-primary" /> Live
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Could not load free times. Please try again.</p>
        ) : slots.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <CalendarCheck className="mx-auto mb-2 h-10 w-10 opacity-50" />
            <p>No free times on this day. Try another date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {slots.map((iso) => (
              <Button
                key={iso}
                type="button"
                size="sm"
                variant={selectedSlot === iso ? "default" : "outline"}
                className={cn(selectedSlot === iso && "ring-2 ring-primary")}
                onClick={() => onSlotSelect(iso)}
              >
                {format(parseISO(iso), "h:mm a")}
              </Button>
            ))}
          </div>
        )}
        {selectedSlot && !slots.includes(selectedSlot) && !isLoading && (
          <p className="mt-3 text-sm text-destructive">That time was just taken — please choose another.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableTimeSlots;
