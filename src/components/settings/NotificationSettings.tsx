
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage what kinds of emails you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive email reminders about upcoming appointments
              </p>
            </div>
            <Switch id="appointment-reminders" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="medication-reminders">Medication Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when it's time to take or refill your medications
              </p>
            </div>
            <Switch id="medication-reminders" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="test-results">Test Results</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new test results are available
              </p>
            </div>
            <Switch id="test-results" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="doctor-messages">Doctor Messages</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails when doctors send you messages
              </p>
            </div>
            <Switch id="doctor-messages" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newsletter">Newsletter</Label>
              <p className="text-sm text-muted-foreground">
                Receive our monthly newsletter with health tips and updates
              </p>
            </div>
            <Switch id="newsletter" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Configure notifications on your mobile device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-appointments">Appointment Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts before your scheduled appointments
              </p>
            </div>
            <Switch id="push-appointments" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-medications">Medication Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded when it's time to take your medications
              </p>
            </div>
            <Switch id="push-medications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-messages">New Messages</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new messages
              </p>
            </div>
            <Switch id="push-messages" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-results">Test Results</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new test results are available
              </p>
            </div>
            <Switch id="push-results" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
          <CardDescription>
            Manage text message alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-appointments">Appointment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive text reminders about upcoming appointments
              </p>
            </div>
            <Switch id="sms-appointments" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-medications">Medication Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get text alerts for medication schedules
              </p>
            </div>
            <Switch id="sms-medications" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-results">Critical Results</Label>
              <p className="text-sm text-muted-foreground">
                Get text notifications for critical test results
              </p>
            </div>
            <Switch id="sms-results" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
