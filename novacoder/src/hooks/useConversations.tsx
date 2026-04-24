import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/lib/chat";

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchConversations = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at, updated_at")
      .order("updated_at", { ascending: false });
    if (data) setConversations(data);
  }, [userId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const loadMessages = useCallback(async (conversationId: string) => {
    setActiveId(conversationId);
    const { data } = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (data) {
      setMessages(
        data.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: new Date(m.created_at),
        }))
      );
    }
  }, []);

  const createConversation = useCallback(async (title: string = "New Chat") => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: userId, title })
      .select("id, title, created_at, updated_at")
      .single();
    if (error || !data) return null;
    setConversations((prev) => [data, ...prev]);
    setActiveId(data.id);
    setMessages([]);
    return data.id;
  }, [userId]);

  const deleteConversation = useCallback(async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
  }, [activeId]);

  const saveMessage = useCallback(async (conversationId: string, role: "user" | "assistant", content: string) => {
    if (!userId) return;
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: userId,
      role,
      content,
    });
    // Update conversation title from first user message
    if (role === "user") {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv?.title === "New Chat") {
        const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
        await supabase.from("conversations").update({ title }).eq("id", conversationId);
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, title } : c))
        );
      }
    }
  }, [userId, conversations]);

  const renameConversation = useCallback(async (id: string, title: string) => {
    await supabase.from("conversations").update({ title }).eq("id", id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }, []);

  return {
    conversations,
    activeId,
    messages,
    setMessages,
    setActiveId,
    loadMessages,
    createConversation,
    deleteConversation,
    saveMessage,
    renameConversation,
    fetchConversations,
  };
}
