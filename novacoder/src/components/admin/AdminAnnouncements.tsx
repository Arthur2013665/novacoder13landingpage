import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Megaphone, AlertTriangle, AlertOctagon, Clock, Send, X, Trash2 } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  severity: string;
  type: string;
  is_active: boolean;
  scheduled_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const SEVERITY_STYLES: Record<string, string> = {
  normal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [severity, setSeverity] = useState("normal");
  const [type, setType] = useState("banner");
  const [scheduledAt, setScheduledAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [criticalConfirm, setCriticalConfirm] = useState("");

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setAnnouncements(data as Announcement[]);
    setLoading(false);
  };

  const createAnnouncement = async () => {
    if (!title.trim() || !content.trim()) { toast.error("Fill in title and content"); return; }
    if (severity === "critical" && criticalConfirm !== "CONFIRM CRITICAL") {
      toast.error('Type "CONFIRM CRITICAL" to send a critical announcement');
      return;
    }

    const { error } = await supabase.from("announcements").insert({
      title: title.trim(),
      content: content.trim(),
      severity,
      type,
      created_by: user!.id,
      scheduled_at: scheduledAt || null,
      expires_at: expiresAt || null,
    });

    if (error) {
      toast.error("Failed to create announcement");
    } else {
      await supabase.from("audit_log").insert({
        action: "create_announcement",
        performed_by: user!.id,
        target_type: "announcement",
        details: { title, severity, type },
      });
      toast.success("Announcement created");
      setShowForm(false);
      resetForm();
      fetchAnnouncements();
    }
  };

  const dismissAnnouncement = async (id: string) => {
    const { error } = await supabase
      .from("announcements")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) {
      toast.success("Announcement dismissed");
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_active: false } : a));
    }
  };

  const resetForm = () => {
    setTitle(""); setContent(""); setSeverity("normal"); setType("banner");
    setScheduledAt(""); setExpiresAt(""); setCriticalConfirm("");
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20 flex items-center gap-2"
      >
        <Megaphone className="w-4 h-4" /> New Announcement
      </button>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Create Announcement</h3>
            <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1 hover:bg-secondary rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Announcement title"
            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Announcement content..."
            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Severity</label>
              <div className="flex gap-1.5">
                {["normal", "warning", "critical"].map(s => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`flex-1 px-2 py-1.5 text-xs rounded-lg border capitalize ${
                      severity === s ? SEVERITY_STYLES[s] : "bg-secondary/50 border-border"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Type</label>
              <div className="flex gap-1.5">
                {["banner", "modal", "dm_blast"].map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 px-2 py-1.5 text-xs rounded-lg border capitalize ${
                      type === t ? "bg-primary/10 border-primary/30 text-primary" : "bg-secondary/50 border-border"
                    }`}
                  >
                    {t.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Schedule (optional)</label>
              <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-xs" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Expires (optional)</label>
              <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-xs" />
            </div>
          </div>

          {severity === "critical" && (
            <div>
              <label className="text-xs text-red-400 mb-1 block">Type "CONFIRM CRITICAL" to send</label>
              <input value={criticalConfirm} onChange={e => setCriticalConfirm(e.target.value)}
                className="w-full px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg text-sm" />
            </div>
          )}

          <button onClick={createAnnouncement}
            className="w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/20">
            <Send className="w-3.5 h-3.5 inline mr-1.5" /> Send Announcement
          </button>
        </div>
      )}

      {/* Active announcements */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-medium text-sm">Announcements ({announcements.length})</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No announcements</div>
        ) : (
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {announcements.map(a => (
              <div key={a.id} className="px-4 py-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${SEVERITY_STYLES[a.severity] || ""}`}>
                    {a.severity}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">{a.type.replace("_", " ")}</span>
                  <span className={`text-xs ml-auto ${a.is_active ? "text-green-400" : "text-muted-foreground"}`}>
                    {a.is_active ? "Active" : "Dismissed"}
                  </span>
                </div>
                <h3 className="text-sm font-medium">{a.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
                  {a.scheduled_at && <span className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline" /> Scheduled: {new Date(a.scheduled_at).toLocaleString()}</span>}
                  {a.is_active && (
                    <button onClick={() => dismissAnnouncement(a.id)} className="ml-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                      <X className="w-3 h-3" /> Dismiss
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
