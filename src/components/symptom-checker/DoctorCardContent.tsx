
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, GraduationCap, Languages } from "lucide-react";
import { Doctor } from "./types";

interface DoctorCardContentProps {
  doctor: Doctor;
}

const DoctorCardContent: React.FC<DoctorCardContentProps> = ({ doctor }) => {
  return (
    <CardContent className="space-y-3">
      {doctor.bio && (
        <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>
      )}

      {doctor.hospital && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{doctor.hospital}</span>
        </div>
      )}

      {doctor.education && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed">{doctor.education}</span>
        </div>
      )}

      {doctor.languages && doctor.languages.length > 0 && (
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {doctor.languages.slice(0, 3).map((lang, index) => (
              <Badge key={index} variant="outline" className="text-xs py-0">
                {lang}
              </Badge>
            ))}
            {doctor.languages.length > 3 && (
              <Badge variant="outline" className="text-xs py-0">
                +{doctor.languages.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {doctor.keywords.slice(0, 4).map((keyword, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {keyword}
          </Badge>
        ))}
        {doctor.keywords.length > 4 && (
          <Badge variant="secondary" className="text-xs">
            +{doctor.keywords.length - 4}
          </Badge>
        )}
      </div>
    </CardContent>
  );
};

export default DoctorCardContent;
