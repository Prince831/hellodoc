
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInformation from "@/components/profile/PersonalInformation";
import MedicalInformation from "@/components/profile/MedicalInformation";
import AppointmentHistory from "@/components/profile/AppointmentHistory";
import HealthSummary from "@/components/profile/HealthSummary";

// Define the user data type for better type safety
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

const Profile = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initial user data - in a real app, this would come from a database
  const [userData, setUserData] = useState<UserData>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 000-0000",
    dateOfBirth: "1985-05-15",
    gender: "male",
    address: "123 Healthcare St",
    city: "Medtown",
    state: "CA",
    zipCode: "90210",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 111-1111",
    relationship: "spouse",
    preferredLanguage: "english",
    preferredContactMethod: "email",
    communicationPreferences: "Prefer morning appointments and email notifications"
  });

  const handleUpdateUserData = (updatedData: UserData) => {
    setUserData(updatedData);
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    // Simulate saving profile data
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SideNav />
      <main className="pt-16 pl-0 md:pl-64">
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-6xl">
          <ProfileHeader 
            onSave={handleSaveProfile} 
            isLoading={isLoading} 
            userData={userData}
          />

          <div className="mt-8">
            <Tabs defaultValue="personal" className="w-full">
              <div className="border-b border-border mb-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50 rounded-lg">
                  <TabsTrigger 
                    value="personal" 
                    className="text-sm font-medium px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="medical" 
                    className="text-sm font-medium px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Medical Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appointments" 
                    className="text-sm font-medium px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="summary" 
                    className="text-sm font-medium px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Health Summary
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="space-y-6">
                <TabsContent value="personal" className="mt-0">
                  <PersonalInformation 
                    userData={userData}
                    onUpdateUserData={handleUpdateUserData}
                  />
                </TabsContent>

                <TabsContent value="medical" className="mt-0">
                  <MedicalInformation />
                </TabsContent>

                <TabsContent value="appointments" className="mt-0">
                  <AppointmentHistory />
                </TabsContent>

                <TabsContent value="summary" className="mt-0">
                  <HealthSummary />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
