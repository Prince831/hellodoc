
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
    <div className="min-h-screen bg-background">
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
              <Tabs 
                defaultValue="account" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-4 gap-2">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
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
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
