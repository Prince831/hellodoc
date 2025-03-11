
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LayoutPreferences = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default LayoutPreferences;
