
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { Doctor } from "@/types/doctor";

interface DoctorStatsProps {
  doctors: Doctor[];
}

const DoctorStats = ({ doctors }: DoctorStatsProps) => {
  // Calculate statistics
  const activeDoctors = doctors.filter(d => d.availability).length;
  const uniqueSpecializations = new Set(doctors.map(d => d.specialization)).size;
  
  // Calculate average rating
  const avgRating = doctors.length ? 
    (doctors.reduce((acc, doc) => acc + doc.rating, 0) / doctors.length).toFixed(1) : 
    "N/A";
    
  // Calculate average experience
  const avgExperience = doctors.length ? 
    Math.round(doctors.reduce((acc, doc) => acc + doc.years_of_experience, 0) / doctors.length) : 
    0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{doctors.length}</div>
          <p className="text-xs text-muted-foreground">
            {activeDoctors} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Specializations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {uniqueSpecializations}
          </div>
          <p className="text-xs text-muted-foreground">
            Unique specialties
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {avgRating}
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-3 w-3 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg. Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {avgExperience}
          </div>
          <p className="text-xs text-muted-foreground">Years</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorStats;
