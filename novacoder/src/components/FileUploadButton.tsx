import { useRef, useState } from "react";
import { Paperclip, X, FileText, Image, FileCode, File } from "lucide-react";
import { uploadAttachment, formatFileSize, type Attachment } from "@/lib/chat";
import { toast } from "sonner";

interface FileUploadButtonProps {
  userId: string;
  attachments: Attachment[];
  setAttachments: (a: Attachment[]) => void;
  disabled?: boolean;
}

const MAX_FILES = 10;
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="w-3.5 h-3.5" />;
  if (type.includes("pdf")) return <FileText className="w-3.5 h-3.5" />;
  if (type.includes("javascript") || type.includes("typescript") || type.includes("json") || type.includes("html") || type.includes("css"))
    return <FileCode className="w-3.5 h-3.5" />;
  return <File className="w-3.5 h-3.5" />;
}

export default function FileUploadButton({ userId, attachments, setAttachments, disabled }: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (attachments.length + fileArr.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    for (const file of fileArr) {
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} exceeds 20MB limit`);
        continue;
      }

      setUploading(true);
      const attachment = await uploadAttachment(userId, file);
      if (attachment) {
        setAttachments([...attachments, attachment]);
      } else {
        toast.error(`Failed to upload ${file.name}`);
      }
      setUploading(false);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {attachments.map(a => (
            <div key={a.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted border border-border text-xs">
              {getFileIcon(a.type)}
              <span className="truncate max-w-[120px]">{a.name}</span>
              <span className="text-muted-foreground">{formatFileSize(a.size)}</span>
              <button onClick={() => removeAttachment(a.id)} className="p-0.5 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        accept="*/*"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading || attachments.length >= MAX_FILES}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40"
        title="Attach files"
      >
        <Paperclip className={`w-4 h-4 ${uploading ? "animate-pulse" : ""}`} />
      </button>
    </div>
  );
}
