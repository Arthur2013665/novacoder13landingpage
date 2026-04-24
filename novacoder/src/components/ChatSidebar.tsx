import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Trash2, Edit2, Check, X, LogOut, Code2, Shield, Pin, Archive } from "lucide-react";
import type { Conversation } from "@/hooks/useConversations";
import { useUserRole } from "@/hooks/useUserRole";
import ConversationSearch from "@/components/ConversationSearch";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onSignOut: () => void;
  userName?: string;
}

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onRename,
  onSignOut,
  userName,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [search, setSearch] = useState("");
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("nova-pinned");
    return new Set(stored ? JSON.parse(stored) : []);
  });
  const [archivedIds, setArchivedIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("nova-archived");
    return new Set(stored ? JSON.parse(stored) : []);
  });
  const [showArchived, setShowArchived] = useState(false);
  const { isAdmin, role } = useUserRole();
  const navigate = useNavigate();

  const togglePin = (id: string) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("nova-pinned", JSON.stringify([...next]));
      return next;
    });
  };

  const toggleArchive = (id: string) => {
    setArchivedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("nova-archived", JSON.stringify([...next]));
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = conversations;
    if (!showArchived) {
      list = list.filter(c => !archivedIds.has(c.id));
    } else {
      list = list.filter(c => archivedIds.has(c.id));
    }
    if (search) {
      list = list.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    }
    // Sort: pinned first, then by date
    return [...list].sort((a, b) => {
      const aPin = pinnedIds.has(a.id) ? 1 : 0;
      const bPin = pinnedIds.has(b.id) ? 1 : 0;
      if (aPin !== bPin) return bPin - aPin;
      return 0;
    });
  }, [conversations, search, pinnedIds, archivedIds, showArchived]);

  const startEdit = (c: Conversation) => {
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const archivedCount = conversations.filter(c => archivedIds.has(c.id)).length;

  return (
    <div className="flex flex-col h-full bg-sidebar-background text-sidebar-foreground">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Nova AI</span>
        </div>
        <button
          onClick={onCreate}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="pt-2">
        <ConversationSearch value={search} onChange={setSearch} />
      </div>

      {/* Archive toggle */}
      {archivedCount > 0 && (
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="mx-3 mb-1 flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground"
        >
          <Archive className="w-3 h-3" />
          {showArchived ? "Show active" : `Archived (${archivedCount})`}
        </button>
      )}

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
              activeId === c.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50"
            }`}
            onClick={() => onSelect(c.id)}
          >
            {pinnedIds.has(c.id) ? (
              <Pin className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
            ) : (
              <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
            )}
            {editingId === c.id ? (
              <div className="flex-1 flex items-center gap-1">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  className="flex-1 bg-transparent border-b border-primary text-sm focus:outline-none"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <button onClick={(e) => { e.stopPropagation(); saveEdit(); }} className="p-0.5">
                  <Check className="w-3 h-3 text-green-400" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 truncate">{c.title}</span>
                <div className="hidden group-hover:flex items-center gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePin(c.id); }}
                    className={`p-1 rounded hover:bg-sidebar-accent ${pinnedIds.has(c.id) ? "text-primary" : ""}`}
                    title={pinnedIds.has(c.id) ? "Unpin" : "Pin"}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleArchive(c.id); }}
                    className="p-1 rounded hover:bg-sidebar-accent"
                    title={archivedIds.has(c.id) ? "Unarchive" : "Archive"}
                  >
                    <Archive className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(c); }}
                    className="p-1 rounded hover:bg-sidebar-accent"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                    className="p-1 rounded hover:bg-destructive/20 text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            {search ? "No matching conversations" : showArchived ? "No archived chats" : "No conversations yet"}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1.5 bg-sidebar-background/60">
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-sidebar-accent/40 hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
          >
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="flex-1 text-left">{role === "owner" ? "Owner Panel" : "Admin Panel"}</span>
          </button>
        )}
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent/40 transition-colors">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">
                {(userName || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-medium truncate text-sidebar-foreground">{userName || "User"}</span>
          </div>
          <button
            onClick={onSignOut}
            className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
