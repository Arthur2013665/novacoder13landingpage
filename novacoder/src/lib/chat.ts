export type Attachment = {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  bookmarked?: boolean;
};

import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
  signal,
  model,
}: {
  messages: Pick<Message, "role" | "content" | "attachments">[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
  signal?: AbortSignal;
  model?: string;
}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      onError("Not authenticated");
      return;
    }

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.attachments?.length
            ? `${m.content}\n\n[Attached files: ${m.attachments.map(a => `${a.name} (${a.type})`).join(", ")}]`
            : m.content,
        })),
        model,
      }),
      signal,
    });

    if (!resp.ok) {
      const data = await resp.json().catch(() => null);
      const errorMsg = data?.error || `Error ${resp.status}`;
      onError(errorMsg);
      return;
    }

    if (!resp.body) {
      onError("No response stream");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // Smooth streaming: emit large chunks character-by-character for typewriter effect
    const emitSmooth = async (text: string) => {
      // If chunk is small, emit as-is (already smooth)
      if (text.length <= 8) {
        onDelta(text);
        return;
      }
      // For larger chunks (common with Gemini), split into smaller bursts
      const burstSize = Math.max(2, Math.ceil(text.length / 20));
      for (let i = 0; i < text.length; i += burstSize) {
        onDelta(text.slice(i, i + burstSize));
        // Tiny delay so React can paint between bursts
        await new Promise((r) => setTimeout(r, 8));
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) await emitSmooth(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone();
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    onError((err as Error).message || "Connection failed");
  }
}

export function generateId(): string {
  return crypto.randomUUID();
}

export async function uploadAttachment(userId: string, file: File): Promise<Attachment | null> {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${generateId()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from("chat-attachments")
    .upload(filePath, file);

  if (error) return null;

  const { data: { publicUrl } } = supabase.storage
    .from("chat-attachments")
    .getPublicUrl(filePath);

  return {
    id: generateId(),
    name: file.name,
    type: file.type,
    url: publicUrl,
    size: file.size,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function countTokensEstimate(text: string): number {
  return Math.ceil(text.length / 4);
}

export const AVAILABLE_MODELS = [
  { id: "google/gemini-3-flash-preview", name: "Gemini 3 Flash", description: "Fast & capable" },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Balanced speed & quality" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Most capable" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini", description: "Fast reasoning" },
  { id: "openai/gpt-5", name: "GPT-5", description: "Top-tier reasoning" },
] as const;

export type ModelId = typeof AVAILABLE_MODELS[number]["id"];
