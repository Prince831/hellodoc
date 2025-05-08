
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingsPage = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Hello Doc",
    contactEmail: "admin@hellodoc.com",
    maintenanceMode: false,
    registrationEnabled: true,
    allowGuestAppointments: true,
    defaultLanguage: "english",
    sessionTimeout: "30",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    systemAnnouncements: true,
    marketingEmails: false,
    reminderAdvanceTime: "24",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordComplexity: "medium",
    passwordExpiryDays: "90",
    maxLoginAttempts: "5",
    sessionIdleTimeout: "15",
  });

  const handleGeneralSettingsSave = () => {
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };

  const handleNotificationSettingsSave = () => {
    toast({
      title: "Settings Saved",
      description: "Notification settings have been updated successfully.",
    });
  };

  const handleSecuritySettingsSave = () => {
    toast({
      title: "Settings Saved",
      description: "Security settings have been updated successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="backup">Backup & Maintenance</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic system settings and functionality.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <Select
                      value={generalSettings.defaultLanguage}
                      onValueChange={(value) => setGeneralSettings({ ...generalSettings, defaultLanguage: value })}
                    >
                      <SelectTrigger id="defaultLanguage">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={generalSettings.sessionTimeout}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, sessionTimeout: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenanceMode"
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
                    />
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <span className="text-xs text-muted-foreground">(Site will be inaccessible to regular users)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="registrationEnabled"
                      checked={generalSettings.registrationEnabled}
                      onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, registrationEnabled: checked })}
                    />
                    <Label htmlFor="registrationEnabled">User Registration Enabled</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowGuestAppointments"
                      checked={generalSettings.allowGuestAppointments}
                      onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, allowGuestAppointments: checked })}
                    />
                    <Label htmlFor="allowGuestAppointments">Allow Guest Appointments</Label>
                  </div>
                </div>
                
                <Button onClick={handleGeneralSettingsSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when the system sends notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                    />
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="appointmentReminders"
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, appointmentReminders: checked })}
                    />
                    <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="systemAnnouncements"
                      checked={notificationSettings.systemAnnouncements}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, systemAnnouncements: checked })}
                    />
                    <Label htmlFor="systemAnnouncements">System Announcements</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="marketingEmails"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, marketingEmails: checked })}
                    />
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="reminderAdvanceTime">Reminder Advance Time (hours)</Label>
                    <Input
                      id="reminderAdvanceTime"
                      type="number"
                      value={notificationSettings.reminderAdvanceTime}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, reminderAdvanceTime: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      How many hours before an appointment to send a reminder.
                    </p>
                  </div>
                </div>
                
                <Button onClick={handleNotificationSettingsSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and access control settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                    />
                    <Label htmlFor="twoFactorAuth">Require Two-Factor Authentication</Label>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="passwordComplexity">Password Complexity</Label>
                    <Select
                      value={securitySettings.passwordComplexity}
                      onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordComplexity: value })}
                    >
                      <SelectTrigger id="passwordComplexity">
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (minimum 6 characters)</SelectItem>
                        <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                        <SelectItem value="high">High (10+ chars, special symbols)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="passwordExpiryDays">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiryDays"
                      type="number"
                      value={securitySettings.passwordExpiryDays}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiryDays: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Set to 0 for no password expiry.
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="sessionIdleTimeout">Session Idle Timeout (minutes)</Label>
                    <Input
                      id="sessionIdleTimeout"
                      type="number"
                      value={securitySettings.sessionIdleTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionIdleTimeout: e.target.value })}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSecuritySettingsSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Backup & Maintenance */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Maintenance</CardTitle>
                <CardDescription>
                  System maintenance and data backup options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Database Backup</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create and manage backups of the system database.
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline">Download Latest Backup</Button>
                      <Button>Create New Backup</Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium">System Maintenance</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Maintenance operations for improving system performance.
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Optimize Database
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Clean Temporary Files
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium">System Logs</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Access and manage system logs for troubleshooting.
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        View Error Logs
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        View Access Logs
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Download All Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
