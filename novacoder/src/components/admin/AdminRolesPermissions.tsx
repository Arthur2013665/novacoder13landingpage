import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, type AppRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import {
  Crown, ShieldCheck, User, ChevronUp, ChevronDown,
  Key, Shield, Users
} from "lucide-react";

interface UserRow {
  user_id: string;
  role: AppRole;
  display_name: string | null;
}

export default function AdminRolesPermissions() {
  const { user } = useAuth();
  const { isOwner } = useUserRole();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const [rolesRes, profilesRes] = await Promise.all([
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("profiles").select("user_id, display_name"),
    ]);
    if (rolesRes.data && profilesRes.data) {
      const profileMap = new Map(profilesRes.data.map(p => [p.user_id, p.display_name]));
      setUsers(rolesRes.data.map(r => ({
        user_id: r.user_id,
        role: r.role as AppRole,
        display_name: profileMap.get(r.user_id) || "Unknown",
      })));
    }
    setLoading(false);
  };

  const changeRole = async (targetUserId: string, newRole: AppRole) => {
    if (!isOwner) { toast.error("Only the owner can change roles"); return; }
    if (targetUserId === user?.id) { toast.error("Can't change your own role"); return; }
    if (newRole === "owner") { toast.error("There can only be one owner"); return; }

    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", targetUserId);

    if (error) {
      toast.error("Failed to update role");
    } else {
      await supabase.from("audit_log").insert({
        action: "role_change",
        performed_by: user!.id,
        target_type: "user",
        target_id: targetUserId,
        details: { new_role: newRole },
      });
      toast.success(`Role updated to ${newRole}`);
      setUsers(prev => prev.map(u => u.user_id === targetUserId ? { ...u, role: newRole } : u));
    }
  };

  const getRoleIcon = (r: AppRole) => {
    if (r === "owner") return <Crown className="w-4 h-4 text-amber-400" />;
    if (r === "admin") return <ShieldCheck className="w-4 h-4 text-blue-400" />;
    return <User className="w-4 h-4 text-muted-foreground" />;
  };

  const getRoleBadge = (r: AppRole) => {
    if (r === "owner") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (r === "admin") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-muted text-muted-foreground border-border";
  };

  // Role hierarchy: owner > admin > user
  const ROLES: AppRole[] = ["user", "admin"];

  return (
    <div className="space-y-4">
      {/* Role stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Owners", count: users.filter(u => u.role === "owner").length, icon: Crown, color: "text-amber-400" },
          { label: "Admins", count: users.filter(u => u.role === "admin").length, icon: ShieldCheck, color: "text-blue-400" },
          { label: "Users", count: users.filter(u => u.role === "user").length, icon: Users, color: "text-muted-foreground" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} /> {s.label}
            </div>
            <div className="text-2xl font-bold">{s.count}</div>
          </div>
        ))}
      </div>

      {/* Permission matrix */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" /> Permission Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Permission</th>
                <th className="text-center py-2 px-3"><Crown className="w-3.5 h-3.5 text-amber-400 mx-auto" /></th>
                <th className="text-center py-2 px-3"><ShieldCheck className="w-3.5 h-3.5 text-blue-400 mx-auto" /></th>
                <th className="text-center py-2 px-3"><User className="w-3.5 h-3.5 text-muted-foreground mx-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { perm: "Manage roles", owner: true, admin: false, user: false },
                { perm: "Ban/Mute users", owner: true, admin: true, user: false },
                { perm: "Content moderation", owner: true, admin: true, user: false },
                { perm: "Announcements", owner: true, admin: true, user: false },
                { perm: "Site settings", owner: true, admin: true, user: false },
                { perm: "View audit log", owner: true, admin: true, user: false },
                { perm: "AI system control", owner: true, admin: true, user: false },
                { perm: "Emergency shutdown", owner: true, admin: false, user: false },
                { perm: "Delete accounts", owner: true, admin: false, user: false },
                { perm: "Use chat", owner: true, admin: true, user: true },
              ].map(row => (
                <tr key={row.perm}>
                  <td className="py-2 px-3 text-muted-foreground">{row.perm}</td>
                  <td className="text-center py-2">{row.owner ? "✅" : "❌"}</td>
                  <td className="text-center py-2">{row.admin ? "✅" : "❌"}</td>
                  <td className="text-center py-2">{row.user ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users with role management */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-medium text-sm">Role Management</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : (
          <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
            {users.map(u => (
              <div key={u.user_id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  {getRoleIcon(u.role)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {u.display_name}
                    {u.user_id === user?.id && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getRoleBadge(u.role)}`}>
                  {u.role}
                </span>
                {isOwner && u.user_id !== user?.id && u.role !== "owner" && (
                  <div className="flex gap-1">
                    {u.role === "user" && (
                      <button
                        onClick={() => changeRole(u.user_id, "admin")}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"
                      >
                        <ChevronUp className="w-3 h-3" /> Promote
                      </button>
                    )}
                    {u.role === "admin" && (
                      <button
                        onClick={() => changeRole(u.user_id, "user")}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20"
                      >
                        <ChevronDown className="w-3 h-3" /> Demote
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
