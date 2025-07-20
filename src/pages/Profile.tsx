
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInformation from "@/components/profile/PersonalInformation";
import MedicalInformation from "@/components/profile/MedicalInformation";
import AppointmentHistory from "@/components/profile/AppointmentHistory";
import HealthSummary from "@/components/profile/HealthSummary";
import { User, Heart, Calendar, Activity } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navbar />
      <SideNav />
      
      <main className="pt-16 pl-0 md:pl-64">
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-5xl">
          {/* Clean Profile Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <ProfileHeader 
              onSave={handleSaveProfile} 
              isLoading={isLoading} 
              userData={userData}
            />
          </motion.div>

          {/* Modern Tabs Container */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/95 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 overflow-hidden"
          >
            <Tabs defaultValue="personal" className="w-full">
              {/* Enhanced Tab Navigation */}
              <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 px-6 pt-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-14 p-1 bg-background/80 backdrop-blur-sm rounded-2xl shadow-inner">
                  <TabsTrigger 
                    value="personal" 
                    className="text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Personal</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="medical" 
                    className="text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Medical</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appointments" 
                    className="text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Appointments</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="summary" 
                    className="text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Health</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <TabsContent value="personal" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PersonalInformation 
                      userData={userData}
                      onUpdateUserData={handleUpdateUserData}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="medical" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MedicalInformation />
                  </motion.div>
                </TabsContent>

                <TabsContent value="appointments" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AppointmentHistory />
                  </motion.div>
                </TabsContent>

                <TabsContent value="summary" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HealthSummary />
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
