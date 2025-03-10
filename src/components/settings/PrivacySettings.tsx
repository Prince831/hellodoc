
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const PrivacySettings = () => {
  const { toast } = useToast();

  const handleDataExport = () => {
    toast({
      title: "Data export started",
      description: "We'll email you when your data is ready to download",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Preferences</CardTitle>
          <CardDescription>
            Control who can see your information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-visibility">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Allow healthcare providers to see your basic profile information
              </p>
            </div>
            <Switch id="profile-visibility" defaultChecked />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medical-record-sharing">Medical Record Sharing</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Choose who can access your medical records
            </p>
            <Select defaultValue="primary-care">
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Select permission level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary-care">Primary Care Doctor Only</SelectItem>
                <SelectItem value="care-team">My Care Team</SelectItem>
                <SelectItem value="all-providers">All My Providers</SelectItem>
                <SelectItem value="emergency">Emergency Access Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="research-participation">Research Participation</Label>
              <p className="text-sm text-muted-foreground">
                Allow your anonymized data to be used for medical research
              </p>
            </div>
            <Switch id="research-participation" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="third-party-sharing">Third-Party Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Allow sharing of your data with third-party services
              </p>
            </div>
            <Switch id="third-party-sharing" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch id="two-factor" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after period of inactivity
              </p>
            </div>
            <Select defaultValue="30">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2">
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Control your personal data and privacy rights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
            <div className="space-y-0.5">
              <Label>Export Your Data</Label>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your personal data
              </p>
            </div>
            <Button variant="outline" onClick={handleDataExport}>Request Data Export</Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between pt-2">
            <div className="space-y-0.5">
              <Label>Cookie Preferences</Label>
              <p className="text-sm text-muted-foreground">
                Manage how we use cookies on this site
              </p>
            </div>
            <Button variant="outline">Manage Cookies</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettings;
