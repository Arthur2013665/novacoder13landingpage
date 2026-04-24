import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ScrollText, Download, Search, Filter, Clock, User,
  Activity, RefreshCw
} from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  performed_by: string;
  target_type: string | null;
  target_id: string | null;
  reason: string | null;
  details: Record<string, any> | null;
  created_at: string;
}

export default function AdminAuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [profiles, setProfiles] = useState<Map<string, string>>(new Map());

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const [logsRes, profilesRes] = await Promise.all([
      supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("profiles").select("user_id, display_name"),
    ]);
    if (logsRes.data) setEntries(logsRes.data as AuditEntry[]);
    if (profilesRes.data) setProfiles(new Map(profilesRes.data.map(p => [p.user_id, p.display_name || "Unknown"])));
    setLoading(false);
  };

  const exportLogs = () => {
    const csv = [
      "Timestamp,Action,Performed By,Target Type,Target ID,Reason",
      ...entries.map(e =>
        `"${e.created_at}","${e.action}","${profiles.get(e.performed_by) || e.performed_by}","${e.target_type || ""}","${e.target_id || ""}","${e.reason || ""}"`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Audit log exported");
  };

  const actions = ["all", ...new Set(entries.map(e => e.action))];
  const filtered = entries.filter(e => {
    if (filterAction !== "all" && e.action !== filterAction) return false;
    if (search) {
      const s = search.toLowerCase();
      return e.action.includes(s) || e.reason?.toLowerCase().includes(s) || profiles.get(e.performed_by)?.toLowerCase().includes(s);
    }
    return true;
  });

  const getActionColor = (action: string) => {
    if (action.includes("ban") || action.includes("delete") || action.includes("shutdown")) return "text-red-400 bg-red-500/10";
    if (action.includes("warn") || action.includes("mute") || action.includes("suspend")) return "text-amber-400 bg-amber-500/10";
    if (action.includes("role") || action.includes("promote")) return "text-blue-400 bg-blue-500/10";
    if (action.includes("announcement")) return "text-purple-400 bg-purple-500/10";
    return "text-muted-foreground bg-secondary/50";
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button onClick={fetchEntries} className="p-2 bg-card border border-border rounded-xl hover:bg-secondary">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button onClick={exportLogs} className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Action filter */}
      <div className="flex gap-1.5 flex-wrap">
        {actions.slice(0, 10).map(a => (
          <button
            key={a}
            onClick={() => setFilterAction(a)}
            className={`px-2.5 py-1 text-xs rounded-lg border ${
              filterAction === a
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-secondary/50 border-border hover:bg-secondary"
            }`}
          >
            {a === "all" ? "All" : a.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h2 className="font-medium text-sm flex items-center gap-2">
            <ScrollText className="w-4 h-4" /> Audit Log ({filtered.length})
          </h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No log entries</div>
        ) : (
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filtered.map(entry => (
              <div key={entry.id} className="px-4 py-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getActionColor(entry.action)}`}>
                    {entry.action.replace(/_/g, " ")}
                  </span>
                  {entry.target_type && (
                    <span className="text-xs text-muted-foreground">
                      → {entry.target_type} {entry.target_id ? `(${entry.target_id.slice(0, 8)}...)` : ""}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  {profiles.get(entry.performed_by) || entry.performed_by.slice(0, 8) + "..."}
                </div>
                {entry.reason && <p className="text-xs text-muted-foreground/70">{entry.reason}</p>}
                {entry.details && Object.keys(entry.details).length > 0 && (
                  <pre className="text-xs text-muted-foreground/50 bg-secondary/30 rounded p-2 overflow-x-auto">
                    {JSON.stringify(entry.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
