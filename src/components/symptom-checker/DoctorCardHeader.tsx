
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Star, DollarSign } from "lucide-react";
import { Doctor } from "./types";

interface DoctorCardHeaderProps {
  doctor: Doctor;
}

const DoctorCardHeader: React.FC<DoctorCardHeaderProps> = ({ doctor }) => {
  return (
    <CardHeader className="pb-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={doctor.image_url} alt={doctor.name} />
          <AvatarFallback className="text-lg">
            {doctor.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-xl font-semibold text-foreground truncate">
            {doctor.name}
          </CardTitle>
          <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{doctor.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({doctor.years_of_experience} years exp.)
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {doctor.availability ? (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              Available
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
              Busy
            </Badge>
          )}
          {doctor.consultation_fee && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>${doctor.consultation_fee}</span>
            </div>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default DoctorCardHeader;
