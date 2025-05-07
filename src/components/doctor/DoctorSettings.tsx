
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const DoctorSettings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "Dr. Sarah Johnson",
    email: "dr.sarah@example.com",
    phone: "(555) 123-4567",
    specialization: "General Practitioner",
    education: "Harvard Medical School",
    bio: "Board-certified general practitioner with over 12 years of experience in family medicine, preventive care, and chronic disease management.",
    officeHours: "Monday - Friday, 9:00 AM - 5:00 PM",
    notifyAppointments: true,
    notifyMessages: true,
    notifyReminders: false,
    timeZone: "America/New_York",
    language: "en",
    theme: "system",
  });
  
  useEffect(() => {
    // In a real app, this would fetch the doctor's settings from Supabase
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved successfully",
    });
  };
  
  const handleSavePreferences = () => {
    toast({
      title: "Preferences updated",
      description: "Your application preferences have been saved successfully",
    });
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-6">
                <Avatar className="w-24 h-24 border-2 border-primary/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="text-lg font-semibold">Profile Photo</div>
                  <div className="text-sm text-muted-foreground">This will be displayed on your public profile.</div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">Upload New</Button>
                    <Button size="sm" variant="outline">Remove</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Dr. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    placeholder="Cardiology"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="doctor@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    name="education"
                    placeholder="Harvard Medical School"
                    value={formData.education}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="officeHours">Office Hours</Label>
                  <Input
                    id="officeHours"
                    name="officeHours"
                    placeholder="Monday - Friday, 9:00 AM - 5:00 PM"
                    value={formData.officeHours}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Write a brief bio about your medical experience and expertise."
                    className="min-h-[120px]"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure how and when you'll receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-appointments">Appointment Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications about new and updated appointments
                  </div>
                </div>
                <Switch
                  id="notify-appointments"
                  checked={formData.notifyAppointments}
                  onCheckedChange={(checked) => handleSwitchChange("notifyAppointments", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-messages">Message Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications when patients send you messages
                  </div>
                </div>
                <Switch
                  id="notify-messages"
                  checked={formData.notifyMessages}
                  onCheckedChange={(checked) => handleSwitchChange("notifyMessages", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-reminders">Daily Summary</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive a daily summary of your schedule and tasks
                  </div>
                </div>
                <Switch
                  id="notify-reminders"
                  checked={formData.notifyReminders}
                  onCheckedChange={(checked) => handleSwitchChange("notifyReminders", checked)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Application Preferences</CardTitle>
            <CardDescription>Customize your application experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select 
                  value={formData.timeZone}
                  onValueChange={(value) => handleSelectChange("timeZone", value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={formData.language}
                  onValueChange={(value) => handleSelectChange("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme Preference</Label>
                <Select 
                  value={formData.theme}
                  onValueChange={(value) => handleSelectChange("theme", value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DoctorSettings;
