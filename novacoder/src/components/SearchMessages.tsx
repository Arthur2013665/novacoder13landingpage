import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { Message } from "@/lib/chat";

interface SearchMessagesProps {
  messages: Message[];
  open: boolean;
  onClose: () => void;
  onJumpTo: (index: number) => void;
}

export default function SearchMessages({ messages, open, onClose, onJumpTo }: SearchMessagesProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return messages
      .map((m, i) => ({ message: m, index: i }))
      .filter(({ message }) => message.content.toLowerCase().includes(q));
  }, [messages, query]);

  if (!open) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-card border-b border-border shadow-lg rounded-b-xl">
      <div className="flex items-center gap-2 px-4 py-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search in conversation..."
          className="flex-1 bg-transparent text-sm focus:outline-none"
          autoFocus
        />
        <span className="text-xs text-muted-foreground">{results.length} results</span>
        <button onClick={() => { setQuery(""); onClose(); }} className="p-1 rounded hover:bg-secondary">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {query && results.length > 0 && (
        <div className="max-h-48 overflow-y-auto border-t border-border">
          {results.map(({ message, index }) => (
            <button
              key={message.id}
              onClick={() => { onJumpTo(index); onClose(); setQuery(""); }}
              className="w-full text-left px-4 py-2 hover:bg-secondary text-xs border-b border-border/50 last:border-0"
            >
              <span className="text-muted-foreground">{message.role === "user" ? "You" : "Nova"}:</span>{" "}
              <span className="truncate">{message.content.slice(0, 100)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
