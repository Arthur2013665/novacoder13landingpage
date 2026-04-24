import { useState, useRef, useCallback } from "react";
import {
  FileCode, Plus, X, Play, Globe, Terminal as TerminalIcon,
  Eye, Send, RotateCcw, Download, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import CodeRunner from "@/components/CodeRunner";

interface EditorFile {
  name: string;
  content: string;
  lang: string;
}

interface CodeEditorPanelProps {
  onSendToChat: (message: string) => void;
  isLoading?: boolean;
}

const LANG_BY_EXT: Record<string, string> = {
  ts: "typescript", tsx: "tsx", js: "javascript", jsx: "jsx",
  py: "python", rs: "rust", go: "go", java: "java",
  c: "c", cpp: "cpp", cs: "csharp", html: "html",
  css: "css", json: "json", md: "markdown", sql: "sql", sh: "bash",
};

function getLang(name: string): string {
  const ext = name.split(".").pop() || "ts";
  return LANG_BY_EXT[ext] || "text";
}

const COMPILABLE = ["c", "cpp", "cs", "java", "rs", "go"];
const RUNNABLE   = ["javascript", "js", "typescript", "ts", "jsx", "tsx", "python", "py"];
const PREVIEW    = ["html"];

const DEFAULT_FILE: EditorFile = {
  name: "main.ts",
  lang: "typescript",
  content: `// Nova AI Code Editor
// Ask AI below or type freely — full compilation supported

interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

export { fetchUser };
export type { User };
`,
};

export default function CodeEditorPanel({ onSendToChat, isLoading }: CodeEditorPanelProps) {
  const [files, setFiles] = useState<EditorFile[]>([DEFAULT_FILE]);
  const [activeFile, setActiveFile] = useState(0);
  const [tab, setTab] = useState<"editor" | "preview" | "terminal">("editor");
  const [previewHtml, setPreviewHtml] = useState("");
  const [prompt, setPrompt] = useState("");
  const [runKey, setRunKey] = useState(0);
  const [renaming, setRenaming] = useState<number | null>(null);
  const [renamingVal, setRenamingVal] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef  = useRef<HTMLDivElement>(null);

  const current = files[activeFile] ?? files[0];

  const handleScroll = () => {
    if (lineNumRef.current && textareaRef.current)
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  const updateContent = (content: string) =>
    setFiles(prev => prev.map((f, i) => (i === activeFile ? { ...f, content } : f)));

  const addFile = () => {
    const name = `file${files.length + 1}.ts`;
    setFiles(prev => [...prev, { name, lang: "typescript", content: "" }]);
    setActiveFile(files.length);
  };

  const closeFile = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    if (files.length === 1) return;
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setActiveFile(prev => Math.max(0, i <= prev ? prev - 1 : prev));
  };

  const startRename = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    setRenaming(i);
    setRenamingVal(files[i].name);
  };

  const commitRename = () => {
    if (renaming === null) return;
    const name = renamingVal.trim() || files[renaming].name;
    setFiles(prev => prev.map((f, i) => i === renaming ? { ...f, name, lang: getLang(name) } : f));
    setRenaming(null);
  };

  const runCode = () => {
    setTab("terminal");
    setRunKey(k => k + 1);
  };

  const runPreview = () => {
    setPreviewHtml(current.content);
    setTab("preview");
  };

  const deploy = () => {
    toast.success("Deployment started", {
      description: "Pushing to Vercel… your site will be live in moments.",
      duration: 4000,
    });
  };

  const downloadFile = () => {
    const blob = new Blob([current.content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = current.name; a.click();
    URL.revokeObjectURL(url);
  };

  const sendPrompt = useCallback(() => {
    if (!prompt.trim()) return;
    const msg =
      `Regarding \`${current.name}\` (${current.lang}):\n${prompt.trim()}` +
      `\n\nCurrent code:\n\`\`\`${current.lang}\n${current.content}\n\`\`\``;
    onSendToChat(msg);
    setPrompt("");
    toast.info("Sent to AI", { description: "Response will appear in the chat panel." });
  }, [prompt, current, onSendToChat]);

  const lineCount  = (current.content.match(/\n/g) || []).length + 1;
  const isRunnable = RUNNABLE.includes(current.lang) || RUNNABLE.includes(current.name.split(".").pop() || "");
  const isCompilable = COMPILABLE.includes(current.lang) || COMPILABLE.includes(current.name.split(".").pop() || "");
  const isPreview  = PREVIEW.includes(current.lang);

  return (
    <div className="flex flex-col h-full bg-[#0a0a10] text-white font-mono overflow-hidden">

      {/* ── File tab bar ─────────────────────────────────────── */}
      <div className="flex items-center bg-[#111118] border-b border-white/[0.06] overflow-x-auto scrollbar-none flex-shrink-0 min-h-[38px]">
        <div className="flex items-center">
          {files.map((f, i) => (
            <div
              key={i}
              onClick={() => setActiveFile(i)}
              className={`group relative flex items-center gap-1.5 px-3.5 py-2 text-[11px] border-r border-white/[0.05] whitespace-nowrap transition-all duration-150 cursor-pointer flex-shrink-0 select-none ${
                i === activeFile
                  ? "bg-[#1c1c2a] text-white border-t-[2px] border-t-indigo-500/80 -mt-[1px]"
                  : "text-white/35 hover:text-white/65 hover:bg-white/[0.03]"
              }`}
            >
              <FileCode className="w-3 h-3 flex-shrink-0 opacity-60" />
              {renaming === i ? (
                <input
                  autoFocus
                  value={renamingVal}
                  onChange={e => setRenamingVal(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenaming(null); }}
                  className="bg-transparent outline-none w-24 text-white text-[11px]"
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span onDoubleClick={e => startRename(e, i)}>{f.name}</span>
              )}
              {files.length > 1 && (
                <span
                  onClick={e => closeFile(e, i)}
                  className="ml-0.5 opacity-0 group-hover:opacity-60 hover:!opacity-100 cursor-pointer transition-opacity"
                >
                  <X className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addFile}
          className="px-2.5 py-2 text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-colors flex-shrink-0"
          title="New file"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 pr-2.5 flex-shrink-0">
          <button
            onClick={downloadFile}
            className="p-1.5 rounded text-white/25 hover:text-white/65 hover:bg-white/[0.06] transition-colors"
            title="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {(isRunnable || isCompilable) && (
            <button
              onClick={runCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-sans font-medium bg-emerald-500/12 text-emerald-400 hover:bg-emerald-500/22 border border-emerald-500/18 transition-colors"
            >
              <Play className="w-3 h-3" />
              {isCompilable ? "Compile & Run" : "Run"}
            </button>
          )}
          {isPreview && (
            <button
              onClick={runPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-sans font-medium bg-sky-500/12 text-sky-400 hover:bg-sky-500/22 border border-sky-500/18 transition-colors"
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
          )}
          <button
            onClick={deploy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-sans font-medium bg-indigo-500/12 text-indigo-400 hover:bg-indigo-500/22 border border-indigo-500/18 transition-colors"
          >
            <Globe className="w-3 h-3" />
            Deploy
          </button>
        </div>
      </div>

      {/* ── View-mode tab bar ──────────────────────────────── */}
      <div className="flex items-center gap-1 px-3 py-1 bg-[#0e0e18] border-b border-white/[0.04] flex-shrink-0">
        {(["editor", "preview", "terminal"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-sans transition-colors cursor-pointer ${
              tab === t ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
            }`}
          >
            {t === "editor"   && <FileCode       className="w-3 h-3" />}
            {t === "preview"  && <Eye            className="w-3 h-3" />}
            {t === "terminal" && <TerminalIcon   className="w-3 h-3" />}
            <span className="capitalize">{t}</span>
          </button>
        ))}
        <span className="ml-auto text-[10px] text-white/20 pr-1">
          {current.lang} · {lineCount} lines
        </span>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden min-h-0">

        {tab === "editor" && (
          <div className="flex h-full">
            {/* Line numbers */}
            <div
              ref={lineNumRef}
              className="w-11 flex-shrink-0 bg-[#0a0a10] text-white/18 text-[12px] pt-4 pb-4 text-right pr-3 select-none overflow-hidden pointer-events-none leading-[21px]"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="leading-[21px]">{i + 1}</div>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={current.content}
              onChange={e => updateContent(e.target.value)}
              onScroll={handleScroll}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              className="flex-1 bg-transparent text-[#dde2f0] text-[13px] pt-4 pb-10 px-3 resize-none outline-none caret-indigo-400 overflow-auto w-full leading-[21px]"
              style={{ tabSize: 2 }}
            />
          </div>
        )}

        {tab === "preview" && (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111118] border-b border-white/[0.04] flex-shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/55" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/55" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/55" />
              </div>
              <span className="text-[10px] text-white/25 font-sans mx-auto">live preview</span>
              <button onClick={runPreview} className="text-white/25 hover:text-white/60 transition-colors">
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
            <iframe
              key={previewHtml}
              srcDoc={
                previewHtml ||
                `<div style="display:flex;align-items:center;justify-content:center;height:100vh;
                  font-family:system-ui;color:#666;font-size:14px">
                  Click Run → Preview to render output
                </div>`
              }
              className="flex-1 w-full bg-white"
              sandbox="allow-scripts"
              title="Preview"
            />
          </div>
        )}

        {tab === "terminal" && (
          <div className="h-full overflow-y-auto bg-[#0d0d14] p-3">
            <CodeRunner key={runKey} code={current.content} language={current.lang} />
          </div>
        )}
      </div>

      {/* ── AI prompt bar (the most important feature) ─────── */}
      <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#0e0e1a] p-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-[#18182a] rounded-xl border border-white/[0.08] focus-within:border-indigo-500/45 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all overflow-hidden">
            <textarea
              rows={1}
              value={prompt}
              onChange={e => {
                setPrompt(e.target.value);
                const el = e.target;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendPrompt(); }
              }}
              placeholder={`Ask AI about ${current.name}… (Enter to send)`}
              className="w-full bg-transparent text-white/80 text-xs font-sans placeholder:text-white/22 px-3 py-2.5 resize-none outline-none max-h-28 overflow-y-auto leading-relaxed"
            />
          </div>
          <button
            onClick={sendPrompt}
            disabled={!prompt.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-35 disabled:cursor-not-allowed flex-shrink-0"
            title="Send to AI"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-white/18 font-sans mt-1.5 px-0.5">
          AI response appears in the chat panel · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
