import { useState, useEffect } from "react";
import { Cookie, X, ChevronDown, ChevronUp, Check } from "lucide-react";

interface CookiePrefs {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
}

const STORAGE_KEY = "novacoder-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    essential: true,
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setTimeout(() => setVisible(true), 900);
  }, []);

  const save = (p: CookiePrefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...p, essential: true, _saved: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  const rows = [
    { key: "essential" as const, label: "Essential", desc: "Login sessions, security tokens. Always active.", locked: true },
    { key: "functional" as const, label: "Functional", desc: "Theme, language, UI preferences.", locked: false },
    { key: "analytics" as const, label: "Analytics", desc: "Anonymous page visits and usage statistics.", locked: false },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[200]"
      style={{ animation: "slide-up 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>
      <style>{`@keyframes slide-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">Cookie Preferences</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                We use cookies to improve your experience and analyze usage. Choose what to allow below.
              </p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <span className="group-hover:underline">Manage preferences</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Preferences detail */}
          {expanded && (
            <div className="space-y-3 mb-4 p-3 rounded-xl bg-secondary/40 border border-border/50">
              {rows.map(({ key, label, desc, locked }) => (
                <div key={key} className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground">{label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</div>
                  </div>
                  <button
                    disabled={locked}
                    onClick={() => !locked && setPrefs(p => ({ ...p, [key]: !p[key] }))}
                    aria-label={`Toggle ${label}`}
                    className={`relative flex-shrink-0 mt-0.5 w-9 h-5 rounded-full transition-all duration-200 ${
                      prefs[key] ? "bg-primary" : "bg-muted border border-border"
                    } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
                      prefs[key] ? "left-4" : "left-0.5"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => save({ essential: true, functional: false, analytics: false })}
              className="flex-1 py-2.5 rounded-xl text-xs font-medium border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              Reject optional
            </button>
            <button
              onClick={() => save(prefs)}
              className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-secondary text-foreground hover:bg-secondary/70 transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3 h-3" />
              Save choices
            </button>
            <button
              onClick={() => save({ essential: true, functional: true, analytics: true })}
              className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
