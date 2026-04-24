import { useState, useRef, useEffect } from "react";
import { BookTemplate, Code, Bug, FileText, Palette, TestTube, Database, Shield } from "lucide-react";

interface PromptTemplatesProps {
  onSelect: (prompt: string) => void;
}

const templates = [
  { icon: Code, label: "Generate code", prompt: "Write a complete implementation of " },
  { icon: Bug, label: "Debug code", prompt: "Debug this code and fix all issues:\n\n```\n\n```" },
  { icon: FileText, label: "Write docs", prompt: "Write comprehensive documentation for " },
  { icon: TestTube, label: "Write tests", prompt: "Write thorough unit tests for " },
  { icon: Database, label: "Design schema", prompt: "Design a database schema for " },
  { icon: Palette, label: "UI component", prompt: "Create a React component with Tailwind CSS for " },
  { icon: Shield, label: "Code review", prompt: "Review this code for security, performance, and best practices:\n\n```\n\n```" },
  { icon: Code, label: "Explain code", prompt: "Explain this code step by step:\n\n```\n\n```" },
];

export default function PromptTemplates({ onSelect }: PromptTemplatesProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        title="Prompt templates"
      >
        <BookTemplate className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-52 rounded-xl border border-border bg-card shadow-lg z-50 py-1">
          {templates.map(t => (
            <button
              key={t.label}
              onClick={() => { onSelect(t.prompt); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary transition-colors"
            >
              <t.icon className="w-3.5 h-3.5 text-muted-foreground" />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
