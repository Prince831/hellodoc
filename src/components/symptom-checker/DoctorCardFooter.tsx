
import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Clock } from "lucide-react";
import { Doctor } from "./types";

interface DoctorCardFooterProps {
  doctor: Doctor;
  showBookingButton: boolean;
  onMessageClick: () => void;
  onBookAppointment: () => void;
  onQuickBook: () => void;
  isQuickBookPending: boolean;
}

const DoctorCardFooter: React.FC<DoctorCardFooterProps> = ({
  doctor,
  showBookingButton,
  onMessageClick,
  onBookAppointment,
  onQuickBook,
  isQuickBookPending
}) => {
  return (
    <CardFooter className="pt-4 gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={onMessageClick}
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        Message
      </Button>
      
      {showBookingButton && (
        <>
          <Button
            size="sm"
            className="flex-1"
            onClick={onBookAppointment}
            disabled={!doctor.availability}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Book
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onQuickBook}
            disabled={!doctor.availability || isQuickBookPending}
            className="bg-primary hover:bg-primary/90"
          >
            <Clock className="h-4 w-4 mr-1" />
            Quick Book
          </Button>
        </>
      )}
    </CardFooter>
  );
};

export default DoctorCardFooter;
