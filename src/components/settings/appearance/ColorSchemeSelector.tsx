
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
  );
};

export default ColorSchemeSelector;
