import { ArrowDownToLine, ArrowUpToLine, Zap, BookOpen } from "lucide-react";

interface ResponseModifiersProps {
  onModify: (instruction: string) => void;
}

const modifiers = [
  { icon: ArrowDownToLine, label: "Shorter", instruction: "Make the previous response shorter and more concise." },
  { icon: ArrowUpToLine, label: "Longer", instruction: "Expand the previous response with more detail and examples." },
  { icon: Zap, label: "Simpler", instruction: "Rewrite the previous response in simpler terms, easy to understand." },
  { icon: BookOpen, label: "More detail", instruction: "Add more technical detail and depth to the previous response." },
];

export default function ResponseModifiers({ onModify }: ResponseModifiersProps) {
  return (
    <div className="flex items-center gap-1 mt-1">
      {modifiers.map(m => (
        <button
          key={m.label}
          onClick={() => onModify(m.instruction)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
          title={m.instruction}
        >
          <m.icon className="w-3 h-3" />
          {m.label}
        </button>
      ))}
    </div>
  );
}
