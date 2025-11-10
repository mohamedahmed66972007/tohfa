import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import { themes, type ThemeId } from "@/lib/themes";

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleThemeSelect = (themeId: ThemeId) => {
    onThemeChange(themeId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          title="اختر التصميم"
        >
          <Palette className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-2">
          <h3 className="font-bold text-lg mb-4 text-center">اختر التصميم</h3>
          <div className="grid gap-2">
            {Object.values(themes).map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors text-right"
                style={{
                  background: currentTheme === theme.id ? `hsl(${theme.colors.card})` : 'transparent',
                  border: `2px solid ${currentTheme === theme.id ? `hsl(${theme.colors.primary})` : 'transparent'}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, hsl(${theme.colors.primary}), hsl(${theme.colors.accent}))`,
                    }}
                  />
                  <span className="font-medium">{theme.nameAr}</span>
                </div>
                {currentTheme === theme.id && (
                  <Check className="h-5 w-5" style={{ color: `hsl(${theme.colors.primary})` }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
