const vscode = require('vscode');

let chatPanel = null;

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('nova.openChat', () => openChatPanel(context)),
    vscode.commands.registerCommand('nova.explainCode', () => sendSelectedCode('Explain this code in detail:\n\n')),
    vscode.commands.registerCommand('nova.fixCode', () => sendSelectedCode('Find and fix all bugs in this code:\n\n')),
    vscode.commands.registerCommand('nova.generateTests', () => sendSelectedCode('Write comprehensive unit tests for this code:\n\n'))
  );
}

function getConfig() {
  const config = vscode.workspace.getConfiguration('nova');
  return {
    apiUrl: config.get('apiUrl') || '',
    apiKey: config.get('apiKey') || ''
  };
}

function openChatPanel(context) {
  if (chatPanel) { chatPanel.reveal(); return; }

  chatPanel = vscode.window.createWebviewPanel('novaChat', 'Nova AI', vscode.ViewColumn.Beside, {
    enableScripts: true, retainContextWhenHidden: true
  });

  chatPanel.webview.html = getChatHTML();
  chatPanel.onDidDispose(() => { chatPanel = null; });

  chatPanel.webview.onDidReceiveMessage(async (msg) => {
    if (msg.type === 'send') {
      const { apiUrl, apiKey } = getConfig();
      if (!apiUrl || !apiKey) {
        chatPanel.webview.postMessage({ type: 'error', value: 'Please configure nova.apiUrl and nova.apiKey in VS Code settings.' });
        return;
      }
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
          body: JSON.stringify({ messages: msg.messages })
        });
        const text = await response.text();
        let content = '';
        for (const line of text.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) content += delta;
          } catch {}
        }
        chatPanel.webview.postMessage({ type: 'response', value: content });
      } catch (err) {
        chatPanel.webview.postMessage({ type: 'error', value: err.message });
      }
    }
    if (msg.type === 'insertCode') {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit(b => b.insert(editor.selection.active, msg.code));
      }
    }
  });
}

function sendSelectedCode(prefix) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const selection = editor.document.getText(editor.selection);
  if (!selection) { vscode.window.showWarningMessage('No code selected'); return; }
  const lang = editor.document.languageId;
  openChatPanel({ subscriptions: [] });
  setTimeout(() => {
    chatPanel?.webview.postMessage({
      type: 'prefill',
      value: `${prefix}\`\`\`${lang}\n${selection}\n\`\`\``
    });
  }, 500);
}

function getChatHTML() {
  return `<!DOCTYPE html>
<html><head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: var(--vscode-font-family); background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); display: flex; flex-direction: column; height: 100vh; }
  #messages { flex: 1; overflow-y: auto; padding: 16px; }
  .msg { margin-bottom: 12px; padding: 10px 14px; border-radius: 12px; max-width: 90%; font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; }
  .user { background: var(--vscode-button-background); color: var(--vscode-button-foreground); margin-left: auto; }
  .assistant { background: var(--vscode-editor-inactiveSelectionBackground); }
  pre { background: var(--vscode-textCodeBlock-background); padding: 8px; border-radius: 6px; overflow-x: auto; margin: 8px 0; font-family: var(--vscode-editor-font-family); font-size: 12px; }
  #input-area { padding: 12px; border-top: 1px solid var(--vscode-panel-border); display: flex; gap: 8px; }
  textarea { flex: 1; resize: none; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); border-radius: 8px; padding: 8px 12px; font-size: 13px; font-family: var(--vscode-font-family); }
  textarea:focus { outline: none; border-color: var(--vscode-focusBorder); }
  button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 13px; }
  button:hover { background: var(--vscode-button-hoverBackground); }
  .typing { opacity: 0.6; font-style: italic; }
</style>
</head><body>
<div id="messages"><div class="msg assistant">👋 Hi! I'm Nova AI. Ask me anything about coding.</div></div>
<div id="input-area">
  <textarea id="input" rows="2" placeholder="Ask Nova anything..."></textarea>
  <button id="send">Send</button>
</div>
<script>
  const vscode = acquireVsCodeApi();
  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  let history = [];

  sendBtn.onclick = send;
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

  function send() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage('user', text);
    history.push({ role: 'user', content: text });
    inputEl.value = '';
    addMessage('assistant', 'Thinking...', 'typing');
    vscode.postMessage({ type: 'send', messages: history });
  }

  function addMessage(role, text, cls) {
    const el = document.createElement('div');
    el.className = 'msg ' + role + (cls ? ' ' + cls : '');
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  window.addEventListener('message', e => {
    const msg = e.data;
    const typing = messagesEl.querySelector('.typing');
    if (typing) typing.remove();
    if (msg.type === 'response') {
      addMessage('assistant', msg.value);
      history.push({ role: 'assistant', content: msg.value });
    }
    if (msg.type === 'error') addMessage('assistant', '❌ ' + msg.value);
    if (msg.type === 'prefill') { inputEl.value = msg.value; inputEl.focus(); }
  });
</script>
</body></html>`;
}

function deactivate() {}
module.exports = { activate, deactivate };
