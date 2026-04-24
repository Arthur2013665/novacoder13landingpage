import { useState, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Download, FileCode, Pencil, X } from "lucide-react";
import CodeRunner from "@/components/CodeRunner";

const LANG_LABELS: Record<string, string> = {
  js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript",
  tsx: "TSX", jsx: "JSX", py: "Python", python: "Python", rb: "Ruby", ruby: "Ruby",
  go: "Go", rs: "Rust", rust: "Rust", java: "Java", cpp: "C++", c: "C",
  cs: "C#", csharp: "C#", swift: "Swift", kt: "Kotlin", kotlin: "Kotlin",
  php: "PHP", sql: "SQL", html: "HTML", css: "CSS", scss: "SCSS",
  json: "JSON", yaml: "YAML", yml: "YAML", xml: "XML", md: "Markdown",
  sh: "Shell", bash: "Bash", zsh: "Zsh", ps1: "PowerShell",
  dockerfile: "Dockerfile", docker: "Docker", toml: "TOML", ini: "INI",
  graphql: "GraphQL", prisma: "Prisma", sol: "Solidity", dart: "Dart",
  lua: "Lua", r: "R", scala: "Scala", elixir: "Elixir", ex: "Elixir",
  text: "Plain Text",
};

const LANG_EXTENSIONS: Record<string, string> = {
  javascript: "js", typescript: "ts", python: "py", ruby: "rb", rust: "rs",
  csharp: "cs", kotlin: "kt", bash: "sh", yaml: "yml", markdown: "md",
};

export default function EditableCodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(children);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lang = language.toLowerCase();
  const label = LANG_LABELS[lang] || language.toUpperCase();
  const displayCode = editing ? editedCode : (editedCode !== children ? editedCode : children);
  const lines = displayCode.split("\n");
  const lineCount = lines.length;
  const isModified = editedCode !== children;

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [editing]);

  const copy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const ext = LANG_EXTENSIONS[lang] || lang || "txt";
    const blob = new Blob([displayCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRevert = () => {
    setEditedCode(children);
    setEditing(false);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-3 border border-border/40 bg-[#1e1e2e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-border/20">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-mono font-medium text-primary">{label}</span>
          <span className="text-xs text-muted-foreground">{lineCount} lines</span>
          {isModified && (
            <span className="text-xs text-yellow-400 font-medium">• edited</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              {isModified && (
                <button
                  onClick={handleRevert}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  title="Revert changes"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setEditing(false)}
                className="px-2 py-1 rounded text-xs bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                Done
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              title="Edit code"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={download}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            title="Download code"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={copy}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      {editing ? (
        <textarea
          ref={textareaRef}
          value={editedCode}
          onChange={(e) => {
            setEditedCode(e.target.value);
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
            }
          }}
          className="w-full bg-transparent text-[0.82rem] leading-[1.6] font-mono text-code-foreground p-4 focus:outline-none resize-none min-h-[100px]"
          spellCheck={false}
        />
      ) : (
        <SyntaxHighlighter
          language={lang || "text"}
          style={oneDark}
          showLineNumbers
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "#585b70",
            fontSize: "0.75rem",
            userSelect: "none",
          }}
          customStyle={{
            margin: 0,
            padding: "1rem 0.5rem",
            background: "transparent",
            fontSize: "0.82rem",
            lineHeight: "1.6",
          }}
          wrapLongLines
        >
          {displayCode}
        </SyntaxHighlighter>
      )}
      <CodeRunner code={displayCode} language={lang} />
    </div>
  );
}
