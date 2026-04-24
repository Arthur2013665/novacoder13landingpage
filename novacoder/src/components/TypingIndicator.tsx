import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      <div className="bg-chat-assistant rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot [animation-delay:0.2s]" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
