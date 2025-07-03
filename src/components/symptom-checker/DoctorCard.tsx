
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle, Calendar, MapPin, Languages, GraduationCap, Clock, DollarSign } from "lucide-react";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  availability: boolean;
  keywords: string[];
  image_url?: string;
  phone?: string;
  email?: string;
  bio?: string;
  education?: string;
  languages?: string[];
  consultation_fee?: number;
  hospital?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  showBookingButton?: boolean;
  onMessageClick?: () => void;
  compact?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ 
  doctor, 
  showBookingButton = true,
  onMessageClick,
  compact = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createAppointmentMutation = useCreateAppointment();

  const handleBookAppointment = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    navigate("/appointments", { 
      state: { 
        selectedDoctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialization: doctor.specialization 
      } 
    });
  };

  const handleMessageDoctor = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to message doctors.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    navigate("/messages", { 
      state: { 
        doctorId: doctor.id,
        initiateChat: true 
      } 
    });
  };

  const handleQuickBook = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Quick booking for next available slot (demo purposes)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    createAppointmentMutation.mutate({
      doctor_id: doctor.id,
      date: tomorrow.toISOString(),
      reason: "General consultation",
      notes: "Quick booking from symptom checker"
    });
  };

  if (compact) {
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
              <Button size="sm" variant="outline" onClick={onMessageClick || handleMessageDoctor}>
                <MessageCircle className="h-3 w-3" />
              </Button>
              <Button size="sm" onClick={handleBookAppointment} disabled={!doctor.availability}>
                <Calendar className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
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

      <CardFooter className="pt-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onMessageClick || handleMessageDoctor}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Message
        </Button>
        
        {showBookingButton && (
          <>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleBookAppointment}
              disabled={!doctor.availability}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Book
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleQuickBook}
              disabled={!doctor.availability || createAppointmentMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              <Clock className="h-4 w-4 mr-1" />
              Quick Book
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
