import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Wrench, Power, RotateCcw, ShieldAlert, Database, Globe,
  ToggleLeft, ToggleRight, Activity, Gauge, Server
} from "lucide-react";

interface SiteSetting {
  key: string;
  value: Record<string, any>;
}

export default function AdminSiteControl() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceMsg, setMaintenanceMsg] = useState("");
  const [rpsLimit, setRpsLimit] = useState("100");
  const [shutdownConfirm, setShutdownConfirm] = useState("");

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("key, value");
    if (data) {
      setSettings(data as SiteSetting[]);
      const maint = data.find(d => d.key === "maintenance_mode");
      if (maint) setMaintenanceMsg((maint.value as any)?.message || "");
      const rl = data.find(d => d.key === "global_rate_limit");
      if (rl) setRpsLimit(String((rl.value as any)?.rps || 100));
    }
    setLoading(false);
  };

  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || {};

  const toggleSetting = async (key: string, field: string) => {
    const current = getSetting(key);
    const newVal = { ...current, [field]: !(current as any)[field] };

    const { error } = await supabase
      .from("site_settings")
      .update({ value: newVal, updated_by: user!.id, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (error) {
      toast.error(`Failed to update ${key}`);
    } else {
      await supabase.from("audit_log").insert({
        action: `toggle_${key}_${field}`,
        performed_by: user!.id,
        target_type: "setting",
        target_id: key,
        details: newVal,
      });
      toast.success(`${key} ${field} ${(newVal as any)[field] ? "enabled" : "disabled"}`);
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newVal } : s));
    }
  };

  const updateMaintenanceMessage = async () => {
    const current = getSetting("maintenance_mode");
    const newVal = { ...current, message: maintenanceMsg };
    await supabase.from("site_settings")
      .update({ value: newVal, updated_by: user!.id, updated_at: new Date().toISOString() })
      .eq("key", "maintenance_mode");
    toast.success("Maintenance message updated");
  };

  const updateRateLimit = async () => {
    const current = getSetting("global_rate_limit");
    const newVal = { ...current, rps: parseInt(rpsLimit) };
    await supabase.from("site_settings")
      .update({ value: newVal, updated_by: user!.id, updated_at: new Date().toISOString() })
      .eq("key", "global_rate_limit");
    toast.success("Rate limit updated");
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>;

  const maint = getSetting("maintenance_mode") as any;
  const aiMode = getSetting("ai_mode") as any;
  const rateLimit = getSetting("global_rate_limit") as any;
  const ddos = getSetting("ddos_lockdown") as any;

  return (
    <div className="space-y-4">
      {/* Quick toggles */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "maintenance_mode", field: "enabled", label: "Maintenance Mode", icon: Wrench, enabled: maint?.enabled, color: "amber" },
          { key: "ddos_lockdown", field: "enabled", label: "DDoS Lockdown", icon: ShieldAlert, enabled: ddos?.enabled, color: "red" },
          { key: "global_rate_limit", field: "enabled", label: "Global Rate Limit", icon: Gauge, enabled: rateLimit?.enabled, color: "blue" },
          { key: "ai_mode", field: "enabled", label: "AI System", icon: Activity, enabled: aiMode?.enabled, color: "green" },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => toggleSetting(item.key, item.field)}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
              item.enabled
                ? `bg-${item.color}-500/10 border-${item.color}-500/20`
                : "bg-card border-border"
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.enabled ? `text-${item.color}-400` : "text-muted-foreground"}`} />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{item.label}</div>
              <div className={`text-xs ${item.enabled ? `text-${item.color}-400` : "text-muted-foreground"}`}>
                {item.enabled ? "Enabled" : "Disabled"}
              </div>
            </div>
            {item.enabled ? (
              <ToggleRight className={`w-6 h-6 text-${item.color}-400`} />
            ) : (
              <ToggleLeft className="w-6 h-6 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Maintenance message */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-400" /> Maintenance Message
        </h3>
        <textarea
          value={maintenanceMsg}
          onChange={e => setMaintenanceMsg(e.target.value)}
          className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button onClick={updateMaintenanceMessage}
          className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm hover:bg-primary/20">
          Save Message
        </button>
      </div>

      {/* Rate limit config */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Gauge className="w-4 h-4 text-blue-400" /> Rate Limit (req/sec)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={rpsLimit}
            onChange={e => setRpsLimit(e.target.value)}
            className="w-32 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm"
          />
          <button onClick={updateRateLimit}
            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm hover:bg-primary/20">
            Update
          </button>
        </div>
      </div>

      {/* AI mode */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" /> AI Response Mode
        </h3>
        <div className="flex gap-1.5">
          {["standard", "strict", "minimal", "offline"].map(mode => (
            <button
              key={mode}
              onClick={async () => {
                const newVal = { ...aiMode, mode };
                await supabase.from("site_settings")
                  .update({ value: newVal, updated_by: user!.id, updated_at: new Date().toISOString() })
                  .eq("key", "ai_mode");
                setSettings(prev => prev.map(s => s.key === "ai_mode" ? { ...s, value: newVal } : s));
                toast.success(`AI mode set to ${mode}`);
              }}
              className={`px-3 py-1.5 text-xs rounded-lg border capitalize ${
                aiMode?.mode === mode
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-secondary/50 border-border hover:bg-secondary"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency shutdown */}
      <div className="bg-card border border-red-500/20 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
          <Power className="w-4 h-4" /> Emergency Actions
        </h3>
        <p className="text-xs text-muted-foreground">These actions are destructive. Type the confirmation phrase to proceed.</p>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <input
              value={shutdownConfirm}
              onChange={e => setShutdownConfirm(e.target.value)}
              placeholder='Type "CONFIRM SHUTDOWN"'
              className="w-full px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg text-sm"
            />
          </div>
          <button
            disabled={shutdownConfirm !== "CONFIRM SHUTDOWN"}
            onClick={async () => {
              await supabase.from("audit_log").insert({
                action: "site_shutdown",
                performed_by: user!.id,
                target_type: "system",
                reason: "Emergency shutdown initiated",
              });
              toast.success("Shutdown logged (simulated)");
              setShutdownConfirm("");
            }}
            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm hover:bg-red-500/20 disabled:opacity-30"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
