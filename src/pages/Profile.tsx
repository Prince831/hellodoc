
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-muted/20">
      <Navbar />
      
      <main className="pt-16">
        <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">
          {/* Hero Profile Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mb-8 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-8 text-primary-foreground overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <ProfileHeader 
                onSave={handleSaveProfile} 
                isLoading={isLoading} 
                userData={userData}
              />
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Navigation Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-3">
                <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-lg">
                  <h3 className="font-semibold text-lg mb-4 text-foreground">Profile Sections</h3>
                  <Tabs defaultValue="personal" className="w-full" orientation="vertical">
                    <TabsList className="grid w-full grid-rows-4 h-auto p-1 bg-muted/50 rounded-xl">
                      <TabsTrigger 
                        value="personal" 
                        className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Personal Details
                      </TabsTrigger>
                      <TabsTrigger 
                        value="medical" 
                        className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                      >
                        <Heart className="w-4 h-4 mr-3" />
                        Medical History
                      </TabsTrigger>
                      <TabsTrigger 
                        value="appointments" 
                        className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        Appointments
                      </TabsTrigger>
                      <TabsTrigger 
                        value="summary" 
                        className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                      >
                        <Activity className="w-4 h-4 mr-3" />
                        Health Overview
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Tabs defaultValue="personal" className="w-full">
                <div className="space-y-6">
                  <TabsContent value="personal" className="mt-0">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                        <h2 className="text-xl font-bold text-foreground flex items-center">
                          <User className="w-5 h-5 mr-3 text-primary" />
                          Personal Information
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">Manage your personal details and contact information</p>
                      </div>
                      <div className="p-6">
                        <PersonalInformation 
                          userData={userData}
                          onUpdateUserData={handleUpdateUserData}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medical" className="mt-0">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                        <h2 className="text-xl font-bold text-foreground flex items-center">
                          <Heart className="w-5 h-5 mr-3 text-red-500" />
                          Medical Information
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">Your medical history and health records</p>
                      </div>
                      <div className="p-6">
                        <MedicalInformation />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="appointments" className="mt-0">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                        <h2 className="text-xl font-bold text-foreground flex items-center">
                          <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                          Appointment History
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">View and manage your past and upcoming appointments</p>
                      </div>
                      <div className="p-6">
                        <AppointmentHistory />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary" className="mt-0">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                        <h2 className="text-xl font-bold text-foreground flex items-center">
                          <Activity className="w-5 h-5 mr-3 text-green-500" />
                          Health Summary
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">Overview of your health metrics and wellness data</p>
                      </div>
                      <div className="p-6">
                        <HealthSummary />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
