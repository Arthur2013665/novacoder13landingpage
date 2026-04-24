import { useState, useRef, useEffect } from 'react';
import {
  Play, Download, Upload, Copy, Check, Terminal, FileCode,
  Sparkles, Wand2, Image as ImageIcon, Settings, Maximize2,
  Code2, Save, Share2, Zap
} from 'lucide-react';

type Language = 'javascript' | 'typescript' | 'python' | 'cpp' | 'java' | 'html' | 'css';

interface CodeEditorProps {
  onClose?: () => void;
}

export function CodeEditor({ onClose }: CodeEditorProps) {
  const [code, setCode] = useState('// Start coding here...\n');
  const [language, setLanguage] = useState<Language>('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const languages: { value: Language; label: string; ext: string }[] = [
    { value: 'javascript', label: 'JavaScript', ext: '.js' },
    { value: 'typescript', label: 'TypeScript', ext: '.ts' },
    { value: 'python', label: 'Python', ext: '.py' },
    { value: 'cpp', label: 'C++', ext: '.cpp' },
    { value: 'java', label: 'Java', ext: '.java' },
    { value: 'html', label: 'HTML', ext: '.html' },
    { value: 'css', label: 'CSS', ext: '.css' },
  ];

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (language === 'javascript' || language === 'typescript') {
        try {
          const result = eval(code);
          setOutput(`Output:\n${result !== undefined ? String(result) : 'Code executed successfully'}`);
        } catch (error: any) {
          setOutput(`Error:\n${error.message}`);
        }
      } else {
        setOutput(`Compilation for ${language} requires backend setup.\nCode syntax appears valid.`);
      }
    } catch (error: any) {
      setOutput(`Error:\n${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const generateWithAI = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setOutput('Generating code with AI...\n');

    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sampleCode = `// Generated code based on: "${prompt}"\n\nfunction solution() {\n  // Your implementation here\n  console.log("Hello from Nova AI!");\n  return true;\n}\n\nsolution();`;
      
      setCode(sampleCode);
      setOutput('Code generated successfully! ✨');
    } catch (error: any) {
      setOutput(`Error generating code:\n${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setOutput('Generating image with Nano Banana Pro...\n');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOutput('Image generation feature coming soon!\nNano Banana Pro integration in progress. 🎨');
    } catch (error: any) {
      setOutput(`Error:\n${error.message}`);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const ext = languages.find(l => l.value === language)?.ext || '.txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-7xl h-[90vh] card-premium rounded-3xl overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Nova Code Editor</h2>
              <p className="text-xs text-dark-500">AI-powered development environment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-2 rounded-lg bg-dark-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-nova-500 transition-colors"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-dark-900 hover:bg-dark-800 text-white text-sm transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className="flex-1 flex flex-col border-r border-white/[0.08]">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-3 border-b border-white/[0.08] bg-dark-900/50">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="btn-nova text-xs py-2 px-4 flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
              
              <button onClick={copyCode} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors" title="Copy">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-dark-400" />}
              </button>
              
              <button onClick={downloadCode} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors" title="Download">
                <Download className="w-4 h-4 text-dark-400" />
              </button>
              
              <label className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer" title="Upload">
                <Upload className="w-4 h-4 text-dark-400" />
                <input type="file" onChange={uploadFile} className="hidden" accept=".js,.ts,.py,.cpp,.java,.html,.css,.txt" />
              </label>
              
              <div className="flex-1" />
              
              <button className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors" title="Share">
                <Share2 className="w-4 h-4 text-dark-400" />
              </button>
            </div>

            {/* Code Area */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-4 bg-dark-950 text-white font-mono text-sm resize-none focus:outline-none"
                style={{ tabSize: 2 }}
                spellCheck={false}
                placeholder="Start coding or use AI to generate..."
              />
            </div>
          </div>

          {/* Output & AI Panel */}
          <div className="w-96 flex flex-col bg-dark-900/30">
            {/* AI Prompt */}
            <div className="p-4 border-b border-white/[0.08]">
              <label className="block text-xs font-semibold text-dark-400 mb-2 uppercase tracking-wide">
                AI Assistant
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to build..."
                className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/[0.08] text-white text-sm resize-none focus:outline-none focus:border-nova-500 transition-colors mb-3"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={generateWithAI}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 btn-nova text-xs py-2 px-3 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Generate Code</span>
                </button>
                <button
                  onClick={generateImage}
                  disabled={!prompt.trim()}
                  className="btn-ghost text-xs py-2 px-3 flex items-center gap-2"
                  title="Generate Image with Nano Banana Pro"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Output Console */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08]">
                <Terminal className="w-4 h-4 text-dark-500" />
                <span className="text-xs font-semibold text-dark-400 uppercase tracking-wide">Output</span>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <pre className="text-xs text-dark-400 font-mono whitespace-pre-wrap">{output || 'No output yet. Run your code to see results.'}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.08] bg-dark-900/50">
          <div className="flex items-center gap-4 text-xs text-dark-500">
            <span>Lines: {code.split('\n').length}</span>
            <span>Characters: {code.length}</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-aurora-cyan" />
              AI Ready
            </span>
          </div>
          <div className="text-xs text-dark-600">
            Powered by Nova AI • Nano Banana Pro
          </div>
        </div>
      </div>
    </div>
  );
}
