import { X, Keyboard } from "lucide-react";

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ["Enter"], action: "Send message" },
  { keys: ["Shift", "Enter"], action: "New line" },
  { keys: ["Ctrl", "N"], action: "New chat" },
  { keys: ["Ctrl", "Shift", "S"], action: "Search conversations" },
  { keys: ["Ctrl", "/"], action: "Focus input" },
  { keys: ["Ctrl", "Shift", "C"], action: "Copy last response" },
  { keys: ["Ctrl", ","], action: "Open settings" },
  { keys: ["Ctrl", "Shift", "F"], action: "Toggle fullscreen" },
  { keys: ["Escape"], action: "Close panel / Stop generation" },
  { keys: ["?"], action: "Show shortcuts (when input not focused)" },
];

export default function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 space-y-1">
          {shortcuts.map(s => (
            <div key={s.action} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-secondary/50">
              <span className="text-xs text-muted-foreground">{s.action}</span>
              <div className="flex gap-1">
                {s.keys.map(k => (
                  <kbd key={k} className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
