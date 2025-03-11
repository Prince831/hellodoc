
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";

const LayoutPreferences = () => {
  const { 
    compactView, 
    setCompactView, 
    dateFormat, 
    setDateFormat, 
    timeFormat, 
    setTimeFormat 
  } = useTheme();
  
  const { toast } = useToast();

  const handleCompactViewChange = (checked: boolean) => {
    setCompactView(checked);
    toast({
      title: "Layout preference updated",
      description: checked ? "Compact view enabled" : "Standard view enabled",
    });
  };

  const handleDateFormatChange = (value: string) => {
    setDateFormat(value as "mdy" | "dmy" | "ymd");
    
    const formatDescriptions = {
      mdy: "MM/DD/YYYY",
      dmy: "DD/MM/YYYY",
      ymd: "YYYY/MM/DD"
    };
    
    toast({
      title: "Date format updated",
      description: `Date format set to ${formatDescriptions[value as keyof typeof formatDescriptions]}`,
    });
  };

  const handleTimeFormatChange = (value: string) => {
    setTimeFormat(value as "12h" | "24h");
    toast({
      title: "Time format updated",
      description: `Time format set to ${value === "12h" ? "12-hour (AM/PM)" : "24-hour"}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="compact-view">Compact View</Label>
          <p className="text-sm text-muted-foreground">
            Display more information with less spacing
          </p>
        </div>
        <Switch 
          id="compact-view" 
          checked={compactView}
          onCheckedChange={handleCompactViewChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date-format">Date Format</Label>
        <Select 
          value={dateFormat}
          onValueChange={handleDateFormatChange}
        >
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
        <Select 
          value={timeFormat}
          onValueChange={handleTimeFormatChange}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select time format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
            <SelectItem value="24h">24-hour</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LayoutPreferences;
