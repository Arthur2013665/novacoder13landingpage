import { useState, useCallback } from "react";
import { Play, Square, Trash2, Terminal } from "lucide-react";

interface CodeRunnerProps {
  code: string;
  language: string;
}

export default function CodeRunner({ code, language }: CodeRunnerProps) {
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const runCode = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setShowOutput(true);
    setOutput([]);

    const lang = language.toLowerCase();

    if (["javascript", "js", "typescript", "ts", "jsx", "tsx"].includes(lang)) {
      // Run JS in a sandboxed iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.sandbox.add("allow-scripts");
      document.body.appendChild(iframe);

      const logs: string[] = [];

      const handleMessage = (e: MessageEvent) => {
        if (e.data?.type === "console") {
          logs.push(e.data.value);
          setOutput([...logs]);
        }
        if (e.data?.type === "done" || e.data?.type === "error") {
          if (e.data.type === "error") {
            logs.push(`❌ Error: ${e.data.value}`);
            setOutput([...logs]);
          }
          setRunning(false);
          window.removeEventListener("message", handleMessage);
          setTimeout(() => document.body.removeChild(iframe), 100);
        }
      };

      window.addEventListener("message", handleMessage);

      const wrappedCode = `
        <script>
          const originalConsole = { log: console.log, error: console.error, warn: console.warn };
          console.log = (...args) => parent.postMessage({ type: "console", value: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }, "*");
          console.error = (...args) => parent.postMessage({ type: "console", value: "❌ " + args.map(a => String(a)).join(' ') }, "*");
          console.warn = (...args) => parent.postMessage({ type: "console", value: "⚠️ " + args.map(a => String(a)).join(' ') }, "*");
          try {
            ${code}
            parent.postMessage({ type: "done" }, "*");
          } catch(e) {
            parent.postMessage({ type: "error", value: e.message }, "*");
          }
        <\/script>
      `;

      iframe.srcdoc = wrappedCode;

      // Timeout after 10s
      setTimeout(() => {
        if (running) {
          logs.push("⏰ Execution timed out (10s)");
          setOutput([...logs]);
          setRunning(false);
          window.removeEventListener("message", handleMessage);
          try { document.body.removeChild(iframe); } catch {}
        }
      }, 10000);
    } else if (["python", "py"].includes(lang)) {
      setOutput(["⚠️ Python execution requires Pyodide. Loading..."]);
      try {
        // @ts-ignore
        if (!window.loadPyodide) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
          document.head.appendChild(script);
          await new Promise((resolve) => (script.onload = resolve));
        }
        // @ts-ignore
        const pyodide = await window.loadPyodide();
        pyodide.setStdout({ batched: (text: string) => {
          setOutput((prev) => [...prev, text]);
        }});
        await pyodide.runPythonAsync(code);
        setOutput((prev) => prev.filter((l) => !l.startsWith("⚠️")));
      } catch (err: any) {
        setOutput((prev) => [...prev.filter((l) => !l.startsWith("⚠️")), `❌ ${err.message}`]);
      }
      setRunning(false);
    } else {
      setOutput([`⚠️ In-browser execution is not supported for ${language}. Supported: JavaScript, TypeScript, Python.`]);
      setRunning(false);
    }
  }, [code, language, running]);

  if (!showOutput && !running) {
    return (
      <button
        onClick={runCode}
        className="flex items-center gap-1.5 px-3 py-1.5 mt-1 rounded-lg text-xs bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors border border-green-500/20"
      >
        <Play className="w-3 h-3" />
        Run Code
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-border/40 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#181825] border-b border-border/20">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-green-400" />
          <span className="text-xs font-mono text-green-400">Output</span>
        </div>
        <div className="flex items-center gap-1">
          {running && (
            <button onClick={() => setRunning(false)} className="p-1 rounded hover:bg-secondary/50">
              <Square className="w-3 h-3 text-destructive" />
            </button>
          )}
          <button
            onClick={() => { setOutput([]); setShowOutput(false); }}
            className="p-1 rounded hover:bg-secondary/50 text-muted-foreground"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="p-3 bg-[#1e1e2e] max-h-48 overflow-y-auto scrollbar-thin">
        {output.length === 0 && !running ? (
          <span className="text-xs text-muted-foreground font-mono">No output</span>
        ) : (
          output.map((line, i) => (
            <pre key={i} className="text-xs font-mono text-code-foreground whitespace-pre-wrap">{line}</pre>
          ))
        )}
        {running && <span className="text-xs text-muted-foreground font-mono animate-pulse">Running...</span>}
      </div>
    </div>
  );
}
