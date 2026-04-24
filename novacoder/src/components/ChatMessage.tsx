import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Sparkles, ChevronDown, ChevronUp, Bookmark, FileText, Image, FileCode, File } from "lucide-react";
import type { Message, Attachment } from "@/lib/chat";
import { countWords, formatFileSize } from "@/lib/chat";
import EditableCodeBlock from "@/components/EditableCodeBlock";
import MessageActions from "@/components/MessageActions";
import ResponseModifiers from "@/components/ResponseModifiers";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  showTimestamp?: boolean;
  compact?: boolean;
  onEdit?: (newContent: string) => void;
  onRegenerate?: () => void;
  onBookmark?: () => void;
  onModify?: (instruction: string) => void;
  isLastAssistant?: boolean;
}

const COLLAPSE_THRESHOLD = 800;

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="w-3 h-3" />;
  if (type.includes("pdf")) return <FileText className="w-3 h-3" />;
  if (type.includes("javascript") || type.includes("typescript") || type.includes("json"))
    return <FileCode className="w-3 h-3" />;
  return <File className="w-3 h-3" />;
}

function AttachmentList({ attachments }: { attachments: Attachment[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {attachments.map(a => (
        <a
          key={a.id}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50 border border-border text-[10px] hover:bg-secondary transition-colors"
        >
          {a.type.startsWith("image/") ? (
            <img src={a.url} alt={a.name} className="w-8 h-8 rounded object-cover" />
          ) : (
            getFileIcon(a.type)
          )}
          <span className="truncate max-w-[100px]">{a.name}</span>
          <span className="text-muted-foreground">{formatFileSize(a.size)}</span>
        </a>
      ))}
    </div>
  );
}

const ChatMessage = memo(({ message, isStreaming, showTimestamp = true, compact, onEdit, onRegenerate, onBookmark, onModify, isLastAssistant }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const [collapsed, setCollapsed] = useState(message.content.length > COLLAPSE_THRESHOLD);
  const isLong = message.content.length > COLLAPSE_THRESHOLD;
  const displayContent = collapsed ? message.content.slice(0, COLLAPSE_THRESHOLD) + "..." : message.content;
  const words = countWords(message.content);

  return (
    <div className={`group flex gap-3 animate-fade-in ${isUser ? "justify-end" : "justify-start"} ${compact ? "gap-2" : ""}`}>
      {!isUser && (
        <div className={`flex-shrink-0 ${compact ? "w-6 h-6" : "w-8 h-8"} rounded-lg bg-primary/10 flex items-center justify-center mt-1`}>
          <Sparkles className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-primary`} />
        </div>
      )}
      <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-chat-user text-chat-user-foreground rounded-br-md"
              : "bg-chat-assistant text-chat-assistant-foreground rounded-bl-md"
          } ${compact ? "px-3 py-2" : ""}`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className={`prose prose-sm max-w-none text-chat-assistant-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-pre:p-0 prose-pre:bg-transparent prose-a:text-primary ${isStreaming ? "streaming-text" : ""}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const content = String(children).replace(/\n$/, "");
                    if (match) {
                      return <EditableCodeBlock language={match[1]}>{content}</EditableCodeBlock>;
                    }
                    return <code className={className} {...props}>{children}</code>;
                  },
                }}
              >
                {displayContent}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-[3px] h-4 bg-primary animate-blink-caret ml-0.5 align-text-bottom" />
              )}
            </div>
          )}

          {/* Collapse/Expand for long messages */}
          {isLong && !isStreaming && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-1 mt-2 text-[10px] text-primary hover:underline"
            >
              {collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              {collapsed ? "Show more" : "Show less"}
            </button>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <AttachmentList attachments={message.attachments} />
          )}
        </div>

        {/* Meta row: timestamp, word count, bookmark */}
        <div className="flex items-center gap-2 mt-0.5 px-1">
          {showTimestamp && (
            <span className="text-[10px] text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">{words}w</span>
          {onBookmark && (
            <button
              onClick={onBookmark}
              className={`p-0.5 rounded transition-colors ${message.bookmarked ? "text-amber-400" : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-amber-400"}`}
              title="Bookmark"
            >
              <Bookmark className={`w-3 h-3 ${message.bookmarked ? "fill-current" : ""}`} />
            </button>
          )}
        </div>

        {/* Actions */}
        <MessageActions
          content={message.content}
          isUser={isUser}
          onEdit={onEdit}
          onRegenerate={onRegenerate}
        />

        {/* Response modifiers for last assistant message */}
        {!isUser && isLastAssistant && !isStreaming && onModify && (
          <ResponseModifiers onModify={onModify} />
        )}
      </div>
      {isUser && (
        <div className={`flex-shrink-0 ${compact ? "w-6 h-6" : "w-8 h-8"} rounded-lg bg-primary flex items-center justify-center mt-1`}>
          <User className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-primary-foreground`} />
        </div>
      )}
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";
export default ChatMessage;
