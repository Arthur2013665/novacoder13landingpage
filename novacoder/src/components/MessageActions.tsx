import { useState } from "react";
import { Check, Copy, RefreshCw, Pencil, X } from "lucide-react";

interface MessageActionsProps {
  content: string;
  isUser: boolean;
  onEdit?: (newContent: string) => void;
  onRegenerate?: () => void;
}

export default function MessageActions({ content, isUser, onEdit, onRegenerate }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== content) {
      onEdit?.(editValue.trim());
    }
    setEditing(false);
  };

  if (editing && isUser) {
    return (
      <div className="mt-2 flex flex-col gap-2 w-full">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:border-primary/50 resize-none"
          rows={3}
          autoFocus
        />
        <div className="flex gap-1 justify-end">
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-3 py-1 rounded-lg text-xs bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Save & Resend
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
      <button
        onClick={copy}
        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        title="Copy"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      {isUser && onEdit && (
        <button
          onClick={() => { setEditValue(content); setEditing(true); }}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          title="Edit message"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
      {!isUser && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          title="Regenerate"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
