
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  relationship: string;
  preferredLanguage: string;
  preferredContactMethod: string;
  communicationPreferences: string;
}

interface ProfileHeaderProps {
  onSave: () => void;
  isLoading: boolean;
  userData: UserData;
}

const ProfileHeader = ({ onSave, isLoading, userData }: ProfileHeaderProps) => {
  const fullName = `${userData.firstName} ${userData.lastName}`;
  
  // Placeholder user data - in a real app, this would come from a database
  const user = {
    name: fullName,
    email: userData.email,
    profileImage: "/placeholder.svg",
    patientId: "PAT-12345",
    memberSince: "January 2023"
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Patient ID: {user.patientId}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>Member since {user.memberSince}</span>
          </div>
        </div>
      </div>
      <Button onClick={onSave} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default ProfileHeader;
