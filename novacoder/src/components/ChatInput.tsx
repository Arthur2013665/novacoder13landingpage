import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Square, Wand2, X } from "lucide-react";
import FileUploadButton from "@/components/FileUploadButton";
import VoiceInputButton from "@/components/VoiceInputButton";
import PromptTemplates from "@/components/PromptTemplates";
import ModelSelector from "@/components/ModelSelector";
import { countWords, type Attachment, type ModelId } from "@/lib/chat";

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
  userId?: string;
  model: ModelId;
  onModelChange: (m: ModelId) => void;
}

export default function ChatInput({ onSend, onStop, isLoading, disabled, userId, model, onModelChange }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  // Paste image support
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file && userId) {
            import("@/lib/chat").then(({ uploadAttachment }) => {
              uploadAttachment(userId, file).then(a => {
                if (a) setAttachments(prev => [...prev, a]);
              });
            });
          }
        }
      }
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [userId]);

  const handleSubmit = () => {
    if ((!input.trim() && !attachments.length) || disabled) return;
    onSend(input.trim(), attachments.length > 0 ? attachments : undefined);
    setInput("");
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!userId) return;
    const files = Array.from(e.dataTransfer.files);
    const { uploadAttachment } = await import("@/lib/chat");
    for (const file of files) {
      const a = await uploadAttachment(userId, file);
      if (a) setAttachments(prev => [...prev, a]);
    }
  }, [userId]);

  const handleVoiceTranscript = useCallback((text: string) => {
    setInput(text);
  }, []);

  const handleTemplate = useCallback((prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  }, []);

  const [showImageGen, setShowImageGen] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  const handleImageGen = () => {
    if (!imagePrompt.trim()) return;
    onSend(`Generate an image using Nano Banana Pro:\n**Prompt:** ${imagePrompt.trim()}\n\nPlease describe this image in detail and provide the generation parameters.`);
    setImagePrompt("");
    setShowImageGen(false);
  };

  const wordCount = countWords(input);

  return (
    <div
      ref={dropRef}
      className={`border-t border-border bg-background/80 backdrop-blur-xl p-3 sm:p-4 transition-colors ${dragOver ? "bg-primary/5 border-primary/30" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Image generation panel */}
        {showImageGen && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-500/8 border border-purple-500/20 animate-in slide-in-from-bottom-2 duration-200">
            <Wand2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <input
              autoFocus
              value={imagePrompt}
              onChange={e => setImagePrompt(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleImageGen(); if (e.key === "Escape") setShowImageGen(false); }}
              placeholder="Describe the image to generate via Nano Banana Pro…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button onClick={handleImageGen} disabled={!imagePrompt.trim()} className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors disabled:opacity-40">
              <Send className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setShowImageGen(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Attachments preview */}
        {attachments.length > 0 && userId && (
          <FileUploadButton userId={userId} attachments={attachments} setAttachments={setAttachments} disabled={disabled} />
        )}

        <div className="flex gap-2 items-end">
          {/* Left action buttons */}
          <div className="flex items-center gap-0.5 flex-shrink-0 pb-1">
            {userId && (
              <FileUploadButton userId={userId} attachments={attachments} setAttachments={setAttachments} disabled={disabled} />
            )}
            <VoiceInputButton onTranscript={handleVoiceTranscript} disabled={disabled} />
            <PromptTemplates onSelect={handleTemplate} />
            <button
              onClick={() => setShowImageGen(s => !s)}
              className={`p-2 rounded-lg transition-colors ${showImageGen ? "bg-purple-500/15 text-purple-400" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              title="Generate image (Nano Banana Pro)"
              type="button"
            >
              <Wand2 className="w-4 h-4" />
            </button>
          </div>

          {/* Input + bottom bar stacked, aligned to input edges */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="bg-secondary rounded-xl border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={dragOver ? "Drop files here..." : "Ask Nova anything..."}
                rows={1}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none scrollbar-thin"
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <ModelSelector model={model} onChange={onModelChange} />
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                {wordCount > 0 && <span>{wordCount} words</span>}
                {input.length > 0 && <span>{input.length} chars</span>}
              </div>
            </div>
          </div>

          {isLoading ? (
            <button
              onClick={onStop}
              className="flex-shrink-0 w-10 h-10 mb-7 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={(!input.trim() && !attachments.length) || disabled}
              className="flex-shrink-0 w-10 h-10 mb-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
