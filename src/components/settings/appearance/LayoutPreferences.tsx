
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const LayoutPreferences = () => {
  const { 
    compactView, 
    setCompactView, 
    dateFormat, 
    setDateFormat, 
    timeFormat, 
    setTimeFormat,
    fontSize,
    setFontSize
  } = useTheme();
  
  const { toast } = useToast();
  const [sidebarWidth, setSidebarWidth] = useState(64);

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

  const handleSidebarWidthChange = (value: number[]) => {
    setSidebarWidth(value[0]);
    // This would typically update a global state for sidebar width
    toast({
      title: "Sidebar width updated",
      description: `Sidebar width set to ${value[0]}px`,
    });
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
    toast({
      title: "Font size updated",
      description: `Base font size set to ${value[0]}px`,
    });
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
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
        <Label htmlFor="font-size" className="mb-2 block">
          Base Font Size ({fontSize}px)
        </Label>
        <Slider 
          id="font-size"
          value={[fontSize]} 
          onValueChange={handleFontSizeChange} 
          min={12} 
          max={20} 
          step={1}
          className="w-full md:w-[300px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sidebar-width" className="mb-2 block">
          Sidebar Width ({sidebarWidth}px)
        </Label>
        <Slider 
          id="sidebar-width"
          value={[sidebarWidth]} 
          onValueChange={handleSidebarWidthChange} 
          min={48} 
          max={256} 
          step={8}
          className="w-full md:w-[300px]"
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
    </motion.div>
  );
};

export default LayoutPreferences;
