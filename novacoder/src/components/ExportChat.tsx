import { Download, FileText, FileJson } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Message } from "@/lib/chat";

interface ExportChatProps {
  messages: Message[];
  conversationTitle?: string;
}

export default function ExportChat({ messages, conversationTitle }: ExportChatProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const exportMarkdown = () => {
    const title = conversationTitle || "Nova AI Chat";
    let md = `# ${title}\n\n`;
    messages.forEach(m => {
      md += `## ${m.role === "user" ? "You" : "Nova"}\n\n${m.content}\n\n---\n\n`;
    });
    downloadFile(md, `${title}.md`, "text/markdown");
    setOpen(false);
  };

  const exportJSON = () => {
    const data = {
      title: conversationTitle || "Nova AI Chat",
      exported_at: new Date().toISOString(),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
    };
    downloadFile(JSON.stringify(data, null, 2), `${conversationTitle || "chat"}.json`, "application/json");
    setOpen(false);
  };

  const copyAll = () => {
    const text = messages.map(m => `${m.role === "user" ? "You" : "Nova"}:\n${m.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        title="Export chat"
      >
        <Download className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-card shadow-lg z-50 py-1">
          <button onClick={exportMarkdown} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary">
            <FileText className="w-3.5 h-3.5" /> Export as Markdown
          </button>
          <button onClick={exportJSON} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary">
            <FileJson className="w-3.5 h-3.5" /> Export as JSON
          </button>
          <button onClick={copyAll} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary">
            <Download className="w-3.5 h-3.5" /> Copy entire chat
          </button>
        </div>
      )}
    </div>
  );
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
