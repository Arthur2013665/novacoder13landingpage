import { useState, useRef, useEffect } from "react";
import { ChevronDown, Zap, Brain, Sparkles } from "lucide-react";
import { AVAILABLE_MODELS, type ModelId } from "@/lib/chat";

interface ModelSelectorProps {
  model: ModelId;
  onChange: (model: ModelId) => void;
}

const modelIcons: Record<string, any> = {
  "google/gemini-3-flash-preview": Zap,
  "google/gemini-2.5-flash": Zap,
  "google/gemini-2.5-pro": Sparkles,
  "openai/gpt-5-mini": Brain,
  "openai/gpt-5": Brain,
};

export default function ModelSelector({ model, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = AVAILABLE_MODELS.find(m => m.id === model) || AVAILABLE_MODELS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        {current.name}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-56 rounded-xl border border-border bg-card shadow-lg z-50 py-1 overflow-hidden">
          {AVAILABLE_MODELS.map(m => {
            const Icon = modelIcons[m.id] || Sparkles;
            return (
              <button
                key={m.id}
                onClick={() => { onChange(m.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary transition-colors ${
                  m.id === model ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground">{m.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
