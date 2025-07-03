
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle, Calendar } from "lucide-react";
import { Doctor } from "./types";

interface CompactDoctorCardProps {
  doctor: Doctor;
  onMessageClick: () => void;
  onBookAppointment: () => void;
}

const CompactDoctorCard: React.FC<CompactDoctorCardProps> = ({
  doctor,
  onMessageClick,
  onBookAppointment
}) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={doctor.image_url} alt={doctor.name} />
            <AvatarFallback className="text-sm">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{doctor.name}</h3>
            <p className="text-xs text-primary">{doctor.specialization}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs">{doctor.rating}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={onMessageClick}>
              <MessageCircle className="h-3 w-3" />
            </Button>
            <Button size="sm" onClick={onBookAppointment} disabled={!doctor.availability}>
              <Calendar className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactDoctorCard;
