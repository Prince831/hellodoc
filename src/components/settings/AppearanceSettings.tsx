
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ThemeSelector from "./appearance/ThemeSelector";
import ColorSchemeSelector from "./appearance/ColorSchemeSelector";
import AccessibilitySettings from "./appearance/AccessibilitySettings";
import LayoutPreferences from "./appearance/LayoutPreferences";

const AppearanceSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Customize the appearance of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThemeSelector />
          <Separator />
          <ColorSchemeSelector />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>
            Customize accessibility settings for a better experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AccessibilitySettings />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Preferences</CardTitle>
          <CardDescription>
            Customize how information is displayed to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LayoutPreferences />
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
