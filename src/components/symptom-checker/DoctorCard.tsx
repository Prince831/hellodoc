
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Phone, Star, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { Doctor } from "@/types/doctor";

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment?: (doctorId: string) => void;
  onContactDoctor?: (doctorId: string) => void;
  compact?: boolean;
}

const DoctorCard = ({ doctor, onBookAppointment, onContactDoctor, compact = false }: DoctorCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-xs font-medium">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const handleBookAppointment = () => {
    if (onBookAppointment) {
      onBookAppointment(doctor.id);
    }
  };

  const handleContactDoctor = () => {
    if (onContactDoctor) {
      onContactDoctor(doctor.id);
    }
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden border-primary/10 transition-all duration-300 hover:shadow-md hover:border-primary/30">
          <div className="flex items-center p-3">
            <Avatar className="h-12 w-12 mr-3 border border-primary/20">
              <AvatarImage src={doctor.image_url || ''} alt={doctor.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{doctor.name}</p>
              <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
              <div className="mt-1">{getRatingStars(doctor.rating)}</div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="ml-auto h-7 w-7 p-0"
              onClick={handleBookAppointment}
            >
              <CalendarDays className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className={`h-full overflow-hidden border-primary/10 transition-all duration-300 ${isHovered ? 'shadow-lg border-primary/30' : 'shadow-sm'}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={doctor.image_url || ''} alt={doctor.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{doctor.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Badge variant="outline" className="font-medium">
                  {doctor.specialization}
                </Badge>
                {doctor.availability && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Available
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-3">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-primary" />
              <span>Experience:</span>
              <span className="font-medium ml-auto">{doctor.years_of_experience} years</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span>Rating:</span>
              <span className="ml-auto">{getRatingStars(doctor.rating)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Availability:</span>
              <span className={`ml-auto ${doctor.availability ? "text-green-500" : "text-red-500"} font-medium`}>
                {doctor.availability ? "Available Today" : "Next Available: Tomorrow"}
              </span>
            </div>
            <div className="flex flex-wrap mt-2 gap-1">
              {doctor.languages && doctor.languages.slice(0, 3).map((language, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleContactDoctor}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleBookAppointment}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Book
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DoctorCard;
export { Doctor };
