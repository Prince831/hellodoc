
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/ThemeProvider";
import { colorSchemes } from "@/utils/colorSchemes";
import { useToast } from "@/hooks/use-toast";

const ColorSchemeSelector = () => {
  const { colorScheme, setColorScheme } = useTheme();
  const { toast } = useToast();

  const handleColorSchemeChange = (schemeId: string) => {
    setColorScheme(schemeId);
    const schemeName = colorSchemes.find(s => s.id === schemeId)?.name || "Custom";
    toast({
      title: "Color scheme updated",
      description: `Color scheme set to ${schemeName}`,
    });
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="color-scheme">Color Scheme</Label>
      <div className="grid grid-cols-3 gap-2">
        {colorSchemes.map((scheme) => (
          <div 
            key={scheme.id}
            className={`h-11 rounded-lg cursor-pointer ring-offset-background transition-transform duration-300 ease-smooth hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center text-sm font-medium text-primary-foreground shadow-soft ${
              colorScheme === scheme.id ? 'ring-2 ring-ring ring-offset-2' : ''
            }`}
            style={{ backgroundImage: `linear-gradient(135deg, hsl(${scheme.primary}), hsl(${scheme.glow}))` }}

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
  );
};

export default ColorSchemeSelector;
