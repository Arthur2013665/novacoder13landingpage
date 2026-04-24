import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Trash2, Edit3, EyeOff, Flag, Lock, Unlock, Pin, PinOff,
  ArrowRight, RotateCcw, ShieldAlert, Search, Eye, CheckCircle
} from "lucide-react";

interface ContentFlag {
  id: string;
  content_type: string;
  content_id: string;
  status: string;
  flagged_by: string | null;
  reviewed_by: string | null;
  reason: string | null;
  original_content: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  flagged: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  quarantined: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  hidden: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  deleted: "bg-red-500/10 text-red-400 border-red-500/20",
  restored: "bg-green-500/10 text-green-400 border-green-500/20",
  approved: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function AdminContentModeration() {
  const { user } = useAuth();
  const [flags, setFlags] = useState<ContentFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [flagReason, setFlagReason] = useState("");
  const [flagContentId, setFlagContentId] = useState("");
  const [flagContentType, setFlagContentType] = useState("message");
  const [showFlagForm, setShowFlagForm] = useState(false);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("content_flags")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setFlags(data as ContentFlag[]);
    setLoading(false);
  };

  const updateStatus = async (flagId: string, newStatus: string) => {
    const { error } = await supabase
      .from("content_flags")
      .update({ status: newStatus, reviewed_by: user!.id, updated_at: new Date().toISOString() })
      .eq("id", flagId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      await supabase.from("audit_log").insert({
        action: `content_${newStatus}`,
        performed_by: user!.id,
        target_type: "content",
        target_id: flagId,
        reason: `Status changed to ${newStatus}`,
      });
      toast.success(`Content marked as ${newStatus}`);
      setFlags(prev => prev.map(f => f.id === flagId ? { ...f, status: newStatus } : f));
    }
  };

  const createFlag = async () => {
    if (!flagContentId.trim() || !flagReason.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    const { error } = await supabase.from("content_flags").insert({
      content_type: flagContentType,
      content_id: flagContentId.trim(),
      reason: flagReason.trim(),
      flagged_by: user!.id,
      status: "flagged",
    });
    if (error) {
      toast.error("Failed to flag content");
    } else {
      toast.success("Content flagged for review");
      setShowFlagForm(false);
      setFlagContentId("");
      setFlagReason("");
      fetchFlags();
    }
  };

  const filtered = filter === "all" ? flags : flags.filter(f => f.status === filter);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "flagged", "quarantined", "hidden", "deleted", "restored", "approved"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-lg border capitalize transition-colors ${
              filter === s
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-secondary/50 border-border hover:bg-secondary"
            }`}
          >
            {s} {s !== "all" && `(${flags.filter(f => f.status === s).length})`}
          </button>
        ))}
        <button
          onClick={() => setShowFlagForm(!showFlagForm)}
          className="ml-auto px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
        >
          <Flag className="w-3 h-3 inline mr-1" /> Flag Content
        </button>
      </div>

      {/* Flag form */}
      {showFlagForm && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Flag Content for Review</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Content Type</label>
              <select
                value={flagContentType}
                onChange={e => setFlagContentType(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm"
              >
                <option value="message">Message</option>
                <option value="post">Post</option>
                <option value="thread">Thread</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Content ID</label>
              <input
                value={flagContentId}
                onChange={e => setFlagContentId(e.target.value)}
                placeholder="UUID of the content"
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Reason</label>
            <textarea
              value={flagReason}
              onChange={e => setFlagReason(e.target.value)}
              placeholder="Why is this being flagged?"
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm resize-none h-16"
            />
          </div>
          <button
            onClick={createFlag}
            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm hover:bg-primary/20"
          >
            Submit Flag
          </button>
        </div>
      )}

      {/* Flags list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-medium text-sm">Content Queue ({filtered.length})</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No content in queue</div>
        ) : (
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {filtered.map(flag => (
              <div key={flag.id} className="px-4 py-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[flag.status] || ""}`}>
                    {flag.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{flag.content_type}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(flag.created_at).toLocaleDateString()}
                  </span>
                </div>
                {flag.reason && <p className="text-xs text-muted-foreground">{flag.reason}</p>}
                <div className="flex gap-1.5">
                  {flag.status !== "approved" && (
                    <button onClick={() => updateStatus(flag.id, "approved")} className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20">
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                  )}
                  {flag.status !== "hidden" && (
                    <button onClick={() => updateStatus(flag.id, "hidden")} className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20">
                      <EyeOff className="w-3 h-3" /> Hide
                    </button>
                  )}
                  {flag.status !== "quarantined" && (
                    <button onClick={() => updateStatus(flag.id, "quarantined")} className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20">
                      <ShieldAlert className="w-3 h-3" /> Quarantine
                    </button>
                  )}
                  {flag.status !== "deleted" && (
                    <button onClick={() => updateStatus(flag.id, "deleted")} className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  )}
                  {(flag.status === "deleted" || flag.status === "hidden") && (
                    <button onClick={() => updateStatus(flag.id, "restored")} className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20">
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
