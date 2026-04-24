import { Lightbulb } from "lucide-react";

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (s: string) => void;
}

export default function FollowUpSuggestions({ suggestions, onSelect }: FollowUpSuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-secondary text-xs transition-colors"
        >
          <Lightbulb className="w-3 h-3 text-amber-400" />
          {s}
        </button>
      ))}
    </div>
  );
}
