import { BarChart3, MessageSquare, Clock, Hash } from "lucide-react";
import { countWords, countTokensEstimate, type Message } from "@/lib/chat";

interface ConversationStatsProps {
  messages: Message[];
  open: boolean;
  onClose: () => void;
}

export default function ConversationStats({ messages, open, onClose }: ConversationStatsProps) {
  if (!open) return null;

  const totalMessages = messages.length;
  const userMessages = messages.filter(m => m.role === "user").length;
  const assistantMessages = messages.filter(m => m.role === "assistant").length;
  const totalWords = messages.reduce((acc, m) => acc + countWords(m.content), 0);
  const totalTokens = messages.reduce((acc, m) => acc + countTokensEstimate(m.content), 0);
  const duration = messages.length >= 2
    ? Math.round((messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / 60000)
    : 0;

  const stats = [
    { icon: MessageSquare, label: "Total messages", value: totalMessages },
    { icon: MessageSquare, label: "Your messages", value: userMessages },
    { icon: MessageSquare, label: "Nova replies", value: assistantMessages },
    { icon: Hash, label: "Total words", value: totalWords.toLocaleString() },
    { icon: Hash, label: "Est. tokens", value: totalTokens.toLocaleString() },
    { icon: Clock, label: "Duration", value: `${duration} min` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xs bg-card border border-border rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Conversation Stats</h2>
        </div>
        <div className="p-3 space-y-1">
          {stats.map(s => (
            <div key={s.label} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-secondary/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </div>
              <span className="text-xs font-medium">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
