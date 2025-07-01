
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  MessageCircle, 
  Video,
  DollarSign,
  GraduationCap,
  Languages
} from "lucide-react";
import { Doctor } from "@/types/doctor";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment?: (doctorId: string) => void;
  onContactDoctor?: (doctorId: string) => void;
  compact?: boolean;
}

const DoctorCard = ({ 
  doctor, 
  onBookAppointment, 
  onContactDoctor, 
  compact = false 
}: DoctorCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBookAppointment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      if (onBookAppointment) {
        onBookAppointment(doctor.id);
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleContactDoctor = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to contact the doctor.",
        variant: "destructive",
      });
      return;
    }

    setIsMessaging(true);
    try {
      if (onContactDoctor) {
        onContactDoctor(doctor.id);
      }
    } finally {
      setIsMessaging(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="w-full"
      >
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={doctor.image_url || ""} alt={doctor.name} />
                <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{doctor.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{doctor.specialization}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{doctor.rating}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" onClick={handleBookAppointment} disabled={isBooking}>
                  <Calendar className="h-3 w-3 mr-1" />
                  Book
                </Button>
                <Button size="sm" variant="outline" onClick={handleContactDoctor} disabled={isMessaging}>
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="w-full h-full"
    >
      <Card className="hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={doctor.image_url || ""} alt={doctor.name} />
              <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg leading-tight">{doctor.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {doctor.specialization}
              </Badge>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{doctor.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({doctor.years_of_experience} years exp.)
                </span>
              </div>
            </div>
            <div className="text-right">
              {doctor.consultation_fee && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${doctor.consultation_fee}
                </div>
              )}
              <Badge 
                variant={doctor.availability ? "default" : "secondary"}
                className="mt-1"
              >
                {doctor.availability ? "Available" : "Busy"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {doctor.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {doctor.bio}
            </p>
          )}

          <div className="space-y-2">
            {doctor.hospital && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.hospital}</span>
              </div>
            )}
            
            {doctor.education && (
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{doctor.education}</span>
              </div>
            )}

            {doctor.languages && doctor.languages.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.languages.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button 
              onClick={handleBookAppointment} 
              disabled={!doctor.availability || isBooking}
              className="w-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isBooking ? "Booking..." : "Book Appointment"}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleContactDoctor}
                disabled={isMessaging}
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBookAppointment}
                disabled={!doctor.availability}
                size="sm"
              >
                <Video className="h-4 w-4 mr-1" />
                Video Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DoctorCard;
