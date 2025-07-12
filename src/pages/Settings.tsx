
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import CollapsibleSidebar from "@/components/messages/CollapsibleSidebar";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  const handleSaveSettings = () => {
    setIsLoading(true);
    // Simulate saving settings
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/3 to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Navbar />
        <div className="flex">
          <CollapsibleSidebar 
            collapsed={isSidebarCollapsed} 
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16`}>
          <motion.div 
            className="container mx-auto py-6 px-4 md:px-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
              variants={itemVariants}
            >
              <div>
                <h1 className="text-3xl font-semibold">Settings</h1>
                <p className="text-muted-foreground">Configure your app preferences and account settings</p>
              </div>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              {/* Floating Tabs Container */}
              <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl shadow-2xl border border-border/20 p-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg opacity-50" />
                
                <div className="relative">
                  <Tabs 
                    defaultValue="account" 
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                  >
                    <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-4 gap-2 bg-muted/50 backdrop-blur-sm">
                      <TabsTrigger value="account" className="data-[state=active]:bg-background/80 data-[state=active]:shadow-md">Account</TabsTrigger>
                      <TabsTrigger value="notifications" className="data-[state=active]:bg-background/80 data-[state=active]:shadow-md">Notifications</TabsTrigger>
                      <TabsTrigger value="privacy" className="data-[state=active]:bg-background/80 data-[state=active]:shadow-md">Privacy & Security</TabsTrigger>
                      <TabsTrigger value="appearance" className="data-[state=active]:bg-background/80 data-[state=active]:shadow-md">Appearance</TabsTrigger>
                    </TabsList>

                <TabsContent value="account" className="space-y-6">
                  <AccountSettings />
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <NotificationSettings />
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <PrivacySettings />
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                  <AppearanceSettings />
                </TabsContent>
                  </Tabs>
                </div>
              </div>
            </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
