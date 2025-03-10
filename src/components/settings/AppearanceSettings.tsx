
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { colorSchemes } from "@/utils/colorSchemes";
import { useToast } from "@/hooks/use-toast";

const AppearanceSettings = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const [fontSize, setFontSize] = useState([16]);
  const { toast } = useToast();
  
  const handleThemeChange = (value: string) => {
    if (value === "light" || value === "dark") {
      setTheme(value);
      toast({
        title: "Theme updated",
        description: `Theme set to ${value} mode`,
      });
    } else if (value === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
      toast({
        title: "Theme updated",
        description: "Using system preference for theme",
      });
    }
  };
  
  const handleColorSchemeChange = (schemeId: string) => {
    setColorScheme(schemeId);
    const schemeName = colorSchemes.find(s => s.id === schemeId)?.name || "Custom";
    toast({
      title: "Color scheme updated",
      description: `Color scheme set to ${schemeName}`,
    });
  };
  
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
          <div className="space-y-2">
            <Label>Color Theme</Label>
            <RadioGroup 
              defaultValue={theme} 
              value={theme}
              onValueChange={handleThemeChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="cursor-pointer">Light Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="cursor-pointer">Dark Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="cursor-pointer">Use System Settings</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <Label htmlFor="color-scheme">Color Scheme</Label>
            <div className="grid grid-cols-3 gap-2">
              {colorSchemes.map((scheme) => (
                <div 
                  key={scheme.id}
                  className={`h-10 rounded-md cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center text-white ${
                    colorScheme === scheme.id ? 'ring-2 ring-ring ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: scheme.primary }}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleColorSchemeChange(scheme.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleColorSchemeChange(scheme.id);
                    }
                  }}
                >
                  {scheme.name}
                </div>
              ))}
            </div>
          </div>
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="font-size" className="mb-2 block">
                Font Size ({fontSize}px)
              </Label>
              <Slider 
                id="font-size"
                value={fontSize} 
                onValueChange={setFontSize} 
                min={12} 
                max={24} 
                step={1}
                className="w-full md:w-[300px]"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduce Animation</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animated effects throughout the application
                </p>
              </div>
              <Switch id="reduced-motion" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better readability
                </p>
              </div>
              <Switch id="high-contrast" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Select defaultValue="system">
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System Default</SelectItem>
                  <SelectItem value="sans">Sans-serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="mono">Monospace</SelectItem>
                  <SelectItem value="dyslexic">OpenDyslexic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Preferences</CardTitle>
          <CardDescription>
            Customize how information is displayed to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-view">Compact View</Label>
              <p className="text-sm text-muted-foreground">
                Display more information with less spacing
              </p>
            </div>
            <Switch id="compact-view" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select defaultValue="mdy">
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time-format">Time Format</Label>
            <Select defaultValue="12h">
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select time format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
