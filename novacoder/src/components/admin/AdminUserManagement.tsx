import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, type AppRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import {
  Ban, Clock, VolumeX, LogOut, EyeOff, AlertTriangle,
  Gauge, KeyRound, PauseCircle, Trash2, ShieldCheck, Eye,
  Crown, User, ChevronDown, Search, X
} from "lucide-react";

interface UserRow {
  user_id: string;
  role: AppRole;
  display_name: string | null;
}

type ActionType = "ban" | "temp_ban" | "mute" | "kick" | "shadow_ban" | "warning" | "rate_limit" | "force_password_reset" | "suspend" | "delete_account" | "verify_identity";

const ACTION_CONFIG: Record<ActionType, { label: string; icon: typeof Ban; color: string; destructive?: boolean; needsDuration?: boolean }> = {
  ban: { label: "Ban", icon: Ban, color: "text-red-400", destructive: true },
  temp_ban: { label: "Temp Ban", icon: Clock, color: "text-orange-400", needsDuration: true },
  mute: { label: "Mute", icon: VolumeX, color: "text-yellow-400", needsDuration: true },
  kick: { label: "Kick", icon: LogOut, color: "text-orange-400" },
  shadow_ban: { label: "Shadow Ban", icon: EyeOff, color: "text-purple-400" },
  warning: { label: "Warn", icon: AlertTriangle, color: "text-amber-400" },
  rate_limit: { label: "Rate Limit", icon: Gauge, color: "text-blue-400" },
  force_password_reset: { label: "Force Reset", icon: KeyRound, color: "text-cyan-400" },
  suspend: { label: "Suspend", icon: PauseCircle, color: "text-orange-400" },
  delete_account: { label: "Delete", icon: Trash2, color: "text-red-500", destructive: true },
  verify_identity: { label: "Verify ID", icon: ShieldCheck, color: "text-green-400" },
};

const DURATIONS = ["1h", "6h", "24h", "7d", "30d", "permanent"];

function parseDuration(d: string): Date | null {
  const now = new Date();
  const map: Record<string, number> = { "1h": 3600000, "6h": 21600000, "24h": 86400000, "7d": 604800000, "30d": 2592000000 };
  if (d === "permanent") return null;
  return new Date(now.getTime() + (map[d] || 0));
}

export default function AdminUserManagement() {
  const { user } = useAuth();
  const { isOwner } = useUserRole();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("24h");
  const [confirmText, setConfirmText] = useState("");
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const [rolesRes, profilesRes] = await Promise.all([
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("profiles").select("user_id, display_name"),
    ]);
    if (rolesRes.data && profilesRes.data) {
      const profileMap = new Map(profilesRes.data.map((p) => [p.user_id, p.display_name]));
      setUsers(rolesRes.data.map((r) => ({
        user_id: r.user_id,
        role: r.role as AppRole,
        display_name: profileMap.get(r.user_id) || "Unknown",
      })));
    }
    setLoading(false);
  };

  const executeAction = async () => {
    if (!selectedUser || !actionType || !reason.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (ACTION_CONFIG[actionType].destructive && confirmText !== "CONFIRM") {
      toast.error('Type "CONFIRM" to proceed with destructive action');
      return;
    }
    if (selectedUser.user_id === user?.id) {
      toast.error("Cannot perform actions on yourself");
      return;
    }

    setExecuting(true);
    const expiresAt = ACTION_CONFIG[actionType].needsDuration ? parseDuration(duration) : null;

    const { error } = await supabase.from("moderation_actions").insert({
      action_type: actionType,
      target_user_id: selectedUser.user_id,
      performed_by: user!.id,
      reason: reason.trim(),
      duration: ACTION_CONFIG[actionType].needsDuration ? duration : null,
      expires_at: expiresAt?.toISOString() || null,
    });

    if (error) {
      toast.error("Failed to execute action");
    } else {
      // Log to audit
      await supabase.from("audit_log").insert({
        action: `user_${actionType}`,
        performed_by: user!.id,
        target_type: "user",
        target_id: selectedUser.user_id,
        reason: reason.trim(),
        details: { duration, action_type: actionType },
      });
      toast.success(`${ACTION_CONFIG[actionType].label} action executed on ${selectedUser.display_name}`);
      resetForm();
    }
    setExecuting(false);
  };

  const resetForm = () => {
    setSelectedUser(null);
    setActionType(null);
    setReason("");
    setDuration("24h");
    setConfirmText("");
  };

  const filtered = users.filter(u =>
    u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_id.includes(search)
  );

  const getRoleIcon = (r: AppRole) => {
    if (r === "owner") return <Crown className="w-3.5 h-3.5 text-amber-400" />;
    if (r === "admin") return <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />;
    return <User className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Action Modal */}
      {selectedUser && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Action on: {selectedUser.display_name}</h3>
            <button onClick={resetForm} className="p-1 hover:bg-secondary rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(ACTION_CONFIG) as [ActionType, typeof ACTION_CONFIG[ActionType]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setActionType(key)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                  actionType === key
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-secondary/50 border-border hover:bg-secondary"
                }`}
              >
                <cfg.icon className={`w-3 h-3 ${cfg.color}`} />
                {cfg.label}
              </button>
            ))}
          </div>

          {actionType && (
            <>
              {ACTION_CONFIG[actionType].needsDuration && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
                  <div className="flex gap-1.5">
                    {DURATIONS.map(d => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`px-2.5 py-1 text-xs rounded-lg border ${
                          duration === d ? "bg-primary/10 border-primary/30 text-primary" : "bg-secondary/50 border-border"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Reason *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for this action..."
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {ACTION_CONFIG[actionType].destructive && (
                <div>
                  <label className="text-xs text-red-400 mb-1 block">Type "CONFIRM" to proceed</label>
                  <input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              )}

              <button
                onClick={executeAction}
                disabled={executing || !reason.trim()}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  ACTION_CONFIG[actionType].destructive
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                    : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                } disabled:opacity-50`}
              >
                {executing ? "Executing..." : `Execute ${ACTION_CONFIG[actionType].label}`}
              </button>
            </>
          )}
        </div>
      )}

      {/* Users list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h2 className="font-medium text-sm">Users ({filtered.length})</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : (
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {filtered.map((u) => (
              <div
                key={u.user_id}
                className={`px-4 py-3 flex items-center gap-3 hover:bg-secondary/30 cursor-pointer transition-colors ${
                  selectedUser?.user_id === u.user_id ? "bg-primary/5" : ""
                }`}
                onClick={() => { setSelectedUser(u); setActionType(null); setReason(""); }}
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  {getRoleIcon(u.role)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {u.display_name}
                    {u.user_id === user?.id && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{u.user_id.slice(0, 8)}...</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  u.role === "owner" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  u.role === "admin" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  "bg-muted text-muted-foreground border-border"
                }`}>{u.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
