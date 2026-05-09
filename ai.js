"use strict";

const messagesEl  = document.getElementById("messages");
const inputEl     = document.getElementById("chat-input");
const sendBtn     = document.getElementById("send-btn");
const emptyState  = document.getElementById("empty-state");
const modelSelect = document.getElementById("model-select");

const history = []; // { role, content }
let isLoading = false;

// Auto-resize textarea
inputEl.addEventListener("input", () => {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 160) + "px";
  sendBtn.disabled = !inputEl.value.trim() || isLoading;
});

// Send on Enter (Shift+Enter = newline)
inputEl.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
});

sendBtn.addEventListener("click", send);

// Suggestion chips
document.querySelectorAll(".suggestion-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    inputEl.value = chip.dataset.prompt;
    inputEl.dispatchEvent(new Event("input"));
    send();
  });
});

function send() {
  const text = inputEl.value.trim();
  if (!text || isLoading) return;

  if (emptyState) emptyState.remove();

  addMessage("user", text);
  history.push({ role: "user", content: text });

  inputEl.value = "";
  inputEl.style.height = "auto";
  sendBtn.disabled = true;
  isLoading = true;

  const typingEl = addTyping();

  const model = modelSelect.value;

  fetch("https://secure.brightpathlearning.website/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful, friendly assistant built into Veil — a school web proxy. Keep responses clear and concise. Format using markdown where helpful." },
        ...history,
      ],
      model,
    }),
  })
    .then(r => r.json().then(d => ({ ok: r.ok, d })))
    .then(({ ok, d }) => {
      typingEl.remove();
      if (!ok) throw new Error(d.error || "Unknown error");
      const reply = d.content.trim();
      history.push({ role: "assistant", content: reply });
      addMessage("ai", reply);
    })
    .catch(err => {
      typingEl.remove();
      addMessage("ai", `Sorry, something went wrong: ${err.message}. Try again.`);
    })
    .finally(() => {
      isLoading = false;
      sendBtn.disabled = !inputEl.value.trim();
      inputEl.focus();
    });
}

function addMessage(role, content) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.innerHTML = role === "ai"
    ? `<svg width="14" height="14" viewBox="0 0 32 32" fill="none"><line x1="4" y1="21" x2="28" y2="21" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round"/><path d="M8 26 L16 13 L24 26" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.innerHTML = role === "ai" ? renderMarkdown(content) : escHtml(content).replace(/\n/g, "<br>");

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return msg;
}

function addTyping() {
  const msg = document.createElement("div");
  msg.className = "message ai";
  msg.innerHTML = `
    <div class="message-avatar">
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><line x1="4" y1="21" x2="28" y2="21" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round"/><path d="M8 26 L16 13 L24 26" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="message-bubble" style="padding:14px 16px;">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return msg;
}

// Basic markdown renderer
function renderMarkdown(text) {
  return escHtml(text)
    .replace(/```[\w]*\n?([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<strong>$1</strong>")
    .replace(/^## (.+)$/gm, "<strong>$1</strong>")
    .replace(/^# (.+)$/gm, "<strong>$1</strong>")
    .replace(/^[•\-\*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, s => `<ul>${s}</ul>`)
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .split(/\n{2,}/).map(p => {
      if (p.startsWith("<ul>") || p.startsWith("<pre>")) return p;
      return `<p>${p.replace(/\n/g, "<br>")}</p>`;
    }).join("");
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

inputEl.focus();
