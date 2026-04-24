import { useState, useRef, useEffect, useCallback } from "react";
import { Code2, Trash2, Menu, X, Settings, Keyboard, BarChart3, Search, Maximize, Minimize, Columns2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import ChatSidebar from "@/components/ChatSidebar";
import SearchMessages from "@/components/SearchMessages";
import ExportChat from "@/components/ExportChat";
import SettingsPanel from "@/components/SettingsPanel";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import ConversationStats from "@/components/ConversationStats";
import FollowUpSuggestions from "@/components/FollowUpSuggestions";
import CodeEditorPanel from "@/components/CodeEditorPanel";
import { streamChat, generateId, type Message, type Attachment } from "@/lib/chat";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useTheme } from "@/hooks/useTheme";
import { useChatSettings } from "@/hooks/useChatSettings";

const SUGGESTIONS = [
  "Build a full REST API with Express + TypeScript",
  "Write a React custom hook for infinite scrolling",
  "Create a Python CLI tool with click",
  "Debug this code and fix all issues",
  "Design a PostgreSQL schema for an e-commerce app",
  "Write unit tests for a React component",
];

export default function Index() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [codeMode, setCodeMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const { model, setModel, customInstructions, setCustomInstructions, showTimestamps, setShowTimestamps, autoScroll, setAutoScroll, compactMode, setCompactMode } = useChatSettings();

  const {
    conversations,
    activeId,
    messages,
    setMessages,
    loadMessages,
    createConversation,
    deleteConversation,
    saveMessage,
    renameConversation,
  } = useConversations(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const scrollToBottom = useCallback(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [autoScroll]);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "n") { e.preventDefault(); handleNewChat(); }
      if (e.ctrlKey && e.shiftKey && e.key === "S") { e.preventDefault(); setShowSearch(true); }
      if (e.ctrlKey && e.key === ",") { e.preventDefault(); setShowSettings(true); }
      if (e.ctrlKey && e.shiftKey && e.key === "F") { e.preventDefault(); setFullscreen(f => !f); }
      if (e.ctrlKey && e.key === "e") { e.preventDefault(); setCodeMode(m => !m); }
      if (e.ctrlKey && e.key === "/") { e.preventDefault(); inputRef.current?.focus(); }
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
        if (lastAssistant) {
          navigator.clipboard.writeText(lastAssistant.content);
          toast.success("Copied last response");
        }
      }
      if (e.key === "?" && !(e.target as HTMLElement)?.closest("textarea, input")) {
        setShowShortcuts(true);
      }
      if (e.key === "Escape") {
        if (showSettings) setShowSettings(false);
        else if (showShortcuts) setShowShortcuts(false);
        else if (showStats) setShowStats(false);
        else if (showSearch) setShowSearch(false);
        else if (isLoading) stopGeneration();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [messages, showSettings, showShortcuts, showStats, showSearch, isLoading]);

  // Generate follow-up suggestions from last assistant message
  const generateFollowUps = useCallback((content: string) => {
    const suggestions: string[] = [];
    if (content.includes("```")) suggestions.push("Explain this code line by line");
    if (content.length > 500) suggestions.push("Summarize the key points");
    suggestions.push("Can you give an example?");
    if (content.includes("function") || content.includes("class")) suggestions.push("Write tests for this");
    setFollowUps(suggestions.slice(0, 3));
  }, []);

  const sendMessage = useCallback(
    async (content: string, attachments?: Attachment[]) => {
      let convId = activeId;
      if (!convId) {
        convId = await createConversation(content.slice(0, 50));
        if (!convId) return;
      }

      setFollowUps([]);

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
        attachments,
      };
      const allMessages = [...messages, userMsg];
      setMessages(allMessages);
      setIsLoading(true);
      setStreamingId(null);

      await saveMessage(convId, "user", content);

      const controller = new AbortController();
      abortRef.current = controller;

      let assistantContent = "";
      const assistantId = generateId();
      setStreamingId(assistantId);

      await streamChat({
        messages: allMessages,
        signal: controller.signal,
        model,
        onDelta: (chunk) => {
          assistantContent += chunk;
          const assistantMsg: Message = {
            id: assistantId,
            role: "assistant",
            content: assistantContent,
            timestamp: new Date(),
          };
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.id === assistantId) return [...prev.slice(0, -1), assistantMsg];
            return [...prev, assistantMsg];
          });
        },
        onDone: async () => {
          setIsLoading(false);
          setStreamingId(null);
          if (assistantContent && convId) {
            await saveMessage(convId, "assistant", assistantContent);
            generateFollowUps(assistantContent);
          }
        },
        onError: (error) => {
          setIsLoading(false);
          setStreamingId(null);
          toast.error(error);
        },
      });
    },
    [messages, activeId, createConversation, saveMessage, setMessages, model, generateFollowUps]
  );

  const editMessage = useCallback(
    (index: number, newContent: string) => {
      const trimmed = messages.slice(0, index);
      setMessages(trimmed);
      sendMessage(newContent);
    },
    [messages, setMessages, sendMessage]
  );

  const regenerateLastResponse = useCallback(() => {
    let lastUserIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") { lastUserIdx = i; break; }
    }
    if (lastUserIdx === -1) return;
    const lastUserContent = messages[lastUserIdx].content;
    const trimmedMsgs = messages.slice(0, lastUserIdx);
    setMessages(trimmedMsgs);
    sendMessage(lastUserContent);
  }, [messages, setMessages, sendMessage]);

  const modifyLastResponse = useCallback((instruction: string) => {
    sendMessage(instruction);
  }, [sendMessage]);

  const toggleBookmark = useCallback((index: number) => {
    setMessages(prev => prev.map((m, i) =>
      i === index ? { ...m, bookmarked: !m.bookmarked } : m
    ));
  }, [setMessages]);

  const stopGeneration = () => {
    abortRef.current?.abort();
    setIsLoading(false);
    setStreamingId(null);
  };

  const clearChat = () => {
    setMessages([]);
    setFollowUps([]);
    toast.success("Chat cleared");
  };

  const handleNewChat = async () => {
    await createConversation();
    setFollowUps([]);
    setSidebarOpen(false);
  };

  const handleSelectConv = (id: string) => {
    loadMessages(id);
    setFollowUps([]);
    setSidebarOpen(false);
  };

  const jumpToMessage = (index: number) => {
    const el = document.querySelectorAll("[data-msg-index]")[index];
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const activeConversation = conversations.find(c => c.id === activeId);

  return (
    <div className={`flex h-dvh bg-background ${fullscreen ? "fixed inset-0 z-[100]" : ""}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      {!fullscreen && (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <ChatSidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelectConv}
            onCreate={handleNewChat}
            onDelete={deleteConversation}
            onRename={renameConversation}
            onSignOut={signOut}
            userName={user.user_metadata?.full_name || user.email}
          />
        </div>
      )}

      {/* Main — optionally split with code editor panel (Ctrl+E) */}
      <div className={`flex-1 overflow-hidden flex ${codeMode ? "flex-row" : "flex-col min-w-0 relative"}`}>
        <div
          className={codeMode ? "flex flex-col border-r border-border flex-shrink-0 overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}
          style={codeMode ? { width: "38%", minWidth: "280px" } : undefined}
        >
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            {!fullscreen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors md:hidden"
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Nova AI</h1>
              <p className="text-xs text-muted-foreground">
                {activeConversation?.title || "Elite coding assistant"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <>
                <button onClick={() => setShowSearch(s => !s)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Search (Ctrl+Shift+S)">
                  <Search className="w-4 h-4" />
                </button>
                <ExportChat messages={messages} conversationTitle={activeConversation?.title} />
                <button onClick={() => setShowStats(true)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Stats">
                  <BarChart3 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setCodeMode(m => !m)}
              className={`p-2 rounded-lg transition-colors ${codeMode ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              title="Code Editor (Ctrl+E)"
            >
              <Columns2 className="w-4 h-4" />
            </button>
            <button onClick={() => setFullscreen(f => !f)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Fullscreen (Ctrl+Shift+F)">
              {fullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button onClick={() => setShowShortcuts(true)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Shortcuts (?)">
              <Keyboard className="w-4 h-4" />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Settings (Ctrl+,)">
              <Settings className="w-4 h-4" />
            </button>
            {messages.length > 0 && (
              <button onClick={clearChat} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Clear chat">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Search bar */}
        <SearchMessages messages={messages} open={showSearch} onClose={() => setShowSearch(false)} onJumpTo={jumpToMessage} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Code2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Nova Code Assistant</h2>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                Full code generation, debugging, architecture design, testing, and 30+ capabilities. Upload files, use voice, pick your model.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-sm px-4 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`max-w-3xl mx-auto px-4 py-4 ${compactMode ? "space-y-2" : "space-y-4"}`}>
              {messages.map((msg, idx) => (
                <div key={msg.id} data-msg-index={idx}>
                  <ChatMessage
                    message={msg}
                    isStreaming={streamingId === msg.id}
                    showTimestamp={showTimestamps}
                    compact={compactMode}
                    onEdit={msg.role === "user" ? (newContent) => editMessage(idx, newContent) : undefined}
                    onRegenerate={
                      msg.role === "assistant" && idx === messages.length - 1
                        ? regenerateLastResponse
                        : undefined
                    }
                    onBookmark={() => toggleBookmark(idx)}
                    onModify={modifyLastResponse}
                    isLastAssistant={msg.role === "assistant" && idx === messages.length - 1}
                  />
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}

              {/* Follow-up suggestions */}
              {!isLoading && followUps.length > 0 && (
                <FollowUpSuggestions suggestions={followUps} onSelect={sendMessage} />
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <ChatInput
          onSend={sendMessage}
          onStop={stopGeneration}
          isLoading={isLoading}
          userId={user.id}
          model={model}
          onModelChange={setModel}
        />
        </div>{/* end chat column */}

        {codeMode && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <CodeEditorPanel onSendToChat={(msg) => sendMessage(msg)} isLoading={isLoading} />
          </div>
        )}
      </div>

      {/* Modals */}
      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        showTimestamps={showTimestamps}
        setShowTimestamps={setShowTimestamps}
        autoScroll={autoScroll}
        setAutoScroll={setAutoScroll}
        compactMode={compactMode}
        setCompactMode={setCompactMode}
        customInstructions={customInstructions}
        setCustomInstructions={setCustomInstructions}
      />
      <KeyboardShortcuts open={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <ConversationStats messages={messages} open={showStats} onClose={() => setShowStats(false)} />
    </div>
  );
}
