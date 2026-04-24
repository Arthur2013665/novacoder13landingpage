import { X, Sun, Moon, Monitor, Type, AlignJustify, Clock, ArrowDown, Maximize } from "lucide-react";
import type { Theme, FontSize } from "@/hooks/useTheme";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  fontSize: FontSize;
  setFontSize: (fs: FontSize) => void;
  showTimestamps: boolean;
  setShowTimestamps: (v: boolean) => void;
  autoScroll: boolean;
  setAutoScroll: (v: boolean) => void;
  compactMode: boolean;
  setCompactMode: (v: boolean) => void;
  customInstructions: string;
  setCustomInstructions: (v: string) => void;
}

function ToggleRow({ icon: Icon, label, value, onChange }: { icon: any; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4 text-muted-foreground" />
        {label}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
      >
        <div className={`w-4 h-4 rounded-full bg-background shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function SettingsPanel(props: SettingsPanelProps) {
  if (!props.open) return null;

  const themes: { value: Theme; icon: any; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: "small", label: "S" },
    { value: "medium", label: "M" },
    { value: "large", label: "L" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-sm">Settings</h2>
          <button onClick={props.onClose} className="p-1 rounded-lg hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Theme */}
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-2 block">Theme</label>
            <div className="flex gap-2">
              {themes.map(t => (
                <button
                  key={t.value}
                  onClick={() => props.setTheme(t.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-colors ${
                    props.theme === t.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" /> Font Size
            </label>
            <div className="flex gap-2">
              {fontSizes.map(fs => (
                <button
                  key={fs.value}
                  onClick={() => props.setFontSize(fs.value)}
                  className={`flex-1 py-2 rounded-lg text-xs border transition-colors ${
                    props.fontSize === fs.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"
                  }`}
                >
                  {fs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-0.5">
            <ToggleRow icon={Clock} label="Show timestamps" value={props.showTimestamps} onChange={props.setShowTimestamps} />
            <ToggleRow icon={ArrowDown} label="Auto-scroll" value={props.autoScroll} onChange={props.setAutoScroll} />
            <ToggleRow icon={AlignJustify} label="Compact mode" value={props.compactMode} onChange={props.setCompactMode} />
          </div>

          {/* Custom Instructions */}
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-2 block">Custom Instructions</label>
            <textarea
              value={props.customInstructions}
              onChange={(e) => props.setCustomInstructions(e.target.value)}
              placeholder="E.g., 'Always use TypeScript', 'Prefer functional components'..."
              className="w-full h-24 bg-secondary rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:border-primary/50 resize-none"
              maxLength={2000}
            />
            <p className="text-[10px] text-muted-foreground mt-1">{props.customInstructions.length}/2000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
