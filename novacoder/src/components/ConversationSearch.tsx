import { Search } from "lucide-react";

interface ConversationSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export default function ConversationSearch({ value, onChange }: ConversationSearchProps) {
  return (
    <div className="relative px-3 pb-2">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search chats..."
        className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-sidebar-accent/50 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground"
      />
    </div>
  );
}
