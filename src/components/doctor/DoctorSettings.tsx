
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Shield, 
  Smartphone,
  Mail,
  Lock,
} from "lucide-react";

const DoctorSettings = () => {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };
  
  const handleResetPassword = () => {
    toast({
      title: "Password reset link sent",
      description: "Check your email for instructions to reset your password",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive notifications about appointments and messages
              </div>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive notifications via email
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              disabled={!notificationsEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive notifications via SMS
              </div>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
              disabled={!notificationsEnabled}
            />
          </div>
          
          <Button onClick={handleSaveSettings}>Save Notification Settings</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <div className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </div>
            </div>
            <Switch
              id="two-factor"
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
            />
          </div>
          
          <div>
            <Button variant="outline" onClick={handleResetPassword}>
              <Lock className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground self-center" />
                <Input
                  id="email"
                  placeholder="doctor@example.com"
                  defaultValue="dr.sarah@healthcare.com"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex">
                <Smartphone className="mr-2 h-4 w-4 text-muted-foreground self-center" />
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  defaultValue="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Your professional bio"
                rows={4}
                defaultValue="Board-certified general practitioner with 12 years of experience specializing in preventive care and chronic disease management. Graduated from Harvard Medical School."
              />
            </div>
            
            <Button onClick={handleSaveSettings}>Update Contact Information</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorSettings;
