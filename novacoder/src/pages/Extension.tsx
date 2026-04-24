import { Download, Code2, Terminal, Zap, Shield } from "lucide-react";

export default function ExtensionPage() {
  const handleDownload = () => {
    fetch("/nova-ai-extension.zip")
      .then((res) => {
        if (!res.ok) throw new Error(`Download failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "nova-ai-extension.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Code2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Nova AI Extension</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get the full power of Nova AI directly in VS Code, Cursor, Kiro, and any VS Code-based IDE.
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Download className="w-5 h-5" />
            Download Extension
          </button>
        </div>

        <div className="grid gap-4">
          {[
            { icon: Terminal, title: "Chat Panel", desc: "Open with Ctrl+Shift+N — ask anything about coding" },
            { icon: Zap, title: "Context Actions", desc: "Right-click code → Explain, Fix, or Generate Tests" },
            { icon: Shield, title: "Works Everywhere", desc: "VS Code, Cursor, Kiro, and any compatible IDE" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Installation</h2>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Download and unzip the extension file</li>
            <li>Open VS Code → Extensions → <code className="text-primary bg-muted px-1.5 py-0.5 rounded text-xs">...</code> menu → "Install from VSIX"</li>
            <li>Or: Open <code className="text-primary bg-muted px-1.5 py-0.5 rounded text-xs">chrome://extensions</code> → Enable Developer Mode → Load unpacked</li>
            <li>Configure <code className="text-primary bg-muted px-1.5 py-0.5 rounded text-xs">nova.apiUrl</code> and <code className="text-primary bg-muted px-1.5 py-0.5 rounded text-xs">nova.apiKey</code> in settings</li>
          </ol>
        </div>

        <div className="text-center">
          <a href="/" className="text-sm text-primary hover:underline">← Back to Nova AI Chat</a>
        </div>
      </div>
    </div>
  );
}
