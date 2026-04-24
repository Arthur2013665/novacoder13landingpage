import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";

interface AlertRule {
  id: string;
  name: string;
  description: string | null;
  event_type: string;
  condition: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export default function AdminAlertRules() {
  const { user } = useAuth();
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("reports_threshold");
  const [threshold, setThreshold] = useState("5");
  const [timeWindow, setTimeWindow] = useState("1h");

  useEffect(() => { fetchRules(); }, []);

  const fetchRules = async () => {
    setLoading(true);
    const { data } = await supabase.from("alert_rules").select("*").order("created_at", { ascending: false });
    if (data) setRules(data as AlertRule[]);
    setLoading(false);
  };

  const createRule = async () => {
    if (!name.trim()) { toast.error("Enter a name"); return; }
    const { error } = await supabase.from("alert_rules").insert({
      name: name.trim(),
      description: description.trim() || null,
      event_type: eventType,
      condition: { threshold: parseInt(threshold), time_window: timeWindow },
      created_by: user!.id,
    });
    if (error) toast.error("Failed to create rule");
    else {
      toast.success("Alert rule created");
      setShowForm(false);
      setName(""); setDescription("");
      fetchRules();
    }
  };

  const toggleRule = async (id: string, active: boolean) => {
    await supabase.from("alert_rules").update({ is_active: !active, updated_at: new Date().toISOString() }).eq("id", id);
    setRules(prev => prev.map(r => r.id === id ? { ...r, is_active: !active } : r));
    toast.success(`Rule ${!active ? "enabled" : "disabled"}`);
  };

  const deleteRule = async (id: string) => {
    await supabase.from("alert_rules").delete().eq("id", id);
    setRules(prev => prev.filter(r => r.id !== id));
    toast.success("Rule deleted");
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20"
      >
        <Plus className="w-4 h-4" /> New Alert Rule
      </button>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Create Alert Rule</h3>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-secondary rounded-lg"><X className="w-4 h-4" /></button>
          </div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Rule name"
            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm" />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)"
            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Event Type</label>
              <select value={eventType} onChange={e => setEventType(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-xs">
                <option value="reports_threshold">Reports Threshold</option>
                <option value="login_failures">Login Failures</option>
                <option value="rate_limit_hit">Rate Limit Hit</option>
                <option value="new_signups">New Signups Spike</option>
                <option value="error_rate">Error Rate</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Threshold</label>
              <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-xs" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Time Window</label>
              <select value={timeWindow} onChange={e => setTimeWindow(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-xs">
                <option value="15m">15 minutes</option>
                <option value="1h">1 hour</option>
                <option value="6h">6 hours</option>
                <option value="24h">24 hours</option>
              </select>
            </div>
          </div>
          <button onClick={createRule} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm hover:bg-primary/20">
            Create Rule
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-medium text-sm flex items-center gap-2"><Bell className="w-4 h-4" /> Alert Rules ({rules.length})</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : rules.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No alert rules configured</div>
        ) : (
          <div className="divide-y divide-border">
            {rules.map(rule => (
              <div key={rule.id} className="px-4 py-3 flex items-center gap-3">
                <button onClick={() => toggleRule(rule.id, rule.is_active)}>
                  {rule.is_active
                    ? <ToggleRight className="w-5 h-5 text-green-400" />
                    : <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{rule.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {rule.event_type.replace(/_/g, " ")} • Threshold: {(rule.condition as any)?.threshold} in {(rule.condition as any)?.time_window}
                  </div>
                </div>
                <button onClick={() => deleteRule(rule.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
