
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
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

  return (
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
  );
};

export default ThemeSelector;
