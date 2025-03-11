
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";

const AccessibilitySettings = () => {
  const { 
    fontSize, 
    setFontSize, 
    reducedMotion, 
    setReducedMotion, 
    highContrast, 
    setHighContrast, 
    fontFamily, 
    setFontFamily 
  } = useTheme();
  
  const { toast } = useToast();

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
    toast({
      title: "Font size updated",
      description: `Font size set to ${value[0]}px`,
    });
  };

  const handleReducedMotionChange = (checked: boolean) => {
    setReducedMotion(checked);
    toast({
      title: "Animation preference updated",
      description: checked ? "Reduced animations enabled" : "Standard animations enabled",
    });
  };

  const handleHighContrastChange = (checked: boolean) => {
    setHighContrast(checked);
    toast({
      title: "Contrast setting updated",
      description: checked ? "High contrast mode enabled" : "Standard contrast mode enabled",
    });
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value as "system" | "sans" | "serif" | "mono" | "dyslexic");
    toast({
      title: "Font family updated",
      description: `Font family set to ${value}`,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="font-size" className="mb-2 block">
          Font Size ({fontSize}px)
        </Label>
        <Slider 
          id="font-size"
          value={[fontSize]} 
          onValueChange={handleFontSizeChange} 
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
        <Switch 
          id="reduced-motion" 
          checked={reducedMotion}
          onCheckedChange={handleReducedMotionChange}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="high-contrast">High Contrast Mode</Label>
          <p className="text-sm text-muted-foreground">
            Increase contrast for better readability
          </p>
        </div>
        <Switch 
          id="high-contrast" 
          checked={highContrast}
          onCheckedChange={handleHighContrastChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="font-family">Font Family</Label>
        <Select 
          value={fontFamily}
          onValueChange={handleFontFamilyChange}
        >
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
  );
};

export default AccessibilitySettings;
