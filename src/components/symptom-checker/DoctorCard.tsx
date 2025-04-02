
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  keywords: string[];
  image_url: string | null;
  availability: boolean | null;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={doctor.image_url || ''} alt={doctor.name} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{doctor.name}</CardTitle>
            <CardDescription>{doctor.specialization}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Experience:</span>
            <span className="font-medium">{doctor.years_of_experience} years</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Rating:</span>
            <span>{getRatingStars(doctor.rating)} ({doctor.rating})</span>
          </div>
          <div className="flex justify-between">
            <span>Availability:</span>
            <span className={doctor.availability ? "text-green-500" : "text-red-500"}>
              {doctor.availability ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Badge variant="outline" className="mr-2">
          {doctor.specialization}
        </Badge>
        <Button size="sm" variant="outline">
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
