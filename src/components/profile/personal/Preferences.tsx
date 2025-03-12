
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/types/profile";
import { Clock, Shield } from "lucide-react";

interface PreferencesProps {
  userData: UserData;
  onUpdateUserData: (field: keyof UserData, value: string) => void;
}

const Preferences = ({ userData, onUpdateUserData }: PreferencesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Your communication preferences and language settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Preferred Language</Label>
            <Select 
              value={userData.preferredLanguage} 
              onValueChange={(value) => onUpdateUserData("preferredLanguage", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="mandarin">Mandarin</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Select 
                value={userData.preferredContactMethod} 
                onValueChange={(value) => onUpdateUserData("preferredContactMethod", value)}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="app">App Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="communicationPreferences">Communication Preferences</Label>
            <Textarea 
              id="communicationPreferences" 
              placeholder="E.g., preferred appointment times, notification preferences"
              className="h-20 resize-none"
              value={userData.communicationPreferences}
              onChange={(e) => onUpdateUserData("communicationPreferences", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              <Shield className="inline h-3 w-3 mr-1" />
              Your privacy is important to us. We'll only use this information to contact you about your health care.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preferences;
