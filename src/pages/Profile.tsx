
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

const Profile = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
        <div className="container mx-auto py-6 px-4 md:px-6">
          <ProfileHeader onSave={handleSaveProfile} isLoading={isLoading} />

          <Tabs defaultValue="personal" className="mt-8 space-y-6">
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="medical">Medical Info</TabsTrigger>
              <TabsTrigger value="appointments">Appointment History</TabsTrigger>
              <TabsTrigger value="summary">Health Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <PersonalInformation />
            </TabsContent>

            <TabsContent value="medical" className="space-y-6">
              <MedicalInformation />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <AppointmentHistory />
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <HealthSummary />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
