"use strict";

const BARE_SERVER = "https://veilub.mooo.com/bare/";
const BASE = new URL("./", location.href).pathname; // e.g. /veil-static/ or /

let scramjet   = null;
let connection = null;
let _swOk      = null;

const _swBC = new BroadcastChannel("_sw_init");
_swBC.onmessage = (e) => { _swOk = e.data.ok ? true : (e.data.message || "SW init failed"); };

function waitForSWInit() {
  return new Promise((resolve) => {
    if (_swOk !== null) return resolve();
    const prev = _swBC.onmessage;
    _swBC.onmessage = (e) => { prev(e); resolve(); };
    setTimeout(resolve, 12000);
  });
}

// ── Search helper ─────────────────────────────────────────────────────────────
const ENGINES = {
  google:     "https://www.google.com/search?q=%s",
  bing:       "https://www.bing.com/search?q=%s",
  duckduckgo: "https://duckduckgo.com/?q=%s",
};

function toUrl(input, engine) {
  input = input.trim();
  try { return new URL(input).href; } catch {}
  try {
    const u = new URL("https://" + input);
    if (u.hostname.includes(".")) return u.href;
  } catch {}
  return (ENGINES[engine] || ENGINES.google).replace("%s", encodeURIComponent(input));
}

// ── Init scramjet + SW + transport ───────────────────────────────────────────
async function initProxy() {
  if (!scramjet) {
    const { ScramjetController } = $scramjetLoadController();
    scramjet = new ScramjetController({
      prefix: BASE + "sj/",
      files: {
        wasm: BASE + "scramjet/scramjet.wasm.wasm",
        all:  BASE + "scramjet/scramjet.all.js",
        sync: BASE + "scramjet/scramjet.sync.js",
      },
    });
  }

  try {
    await scramjet.init();
  } catch (err) {
    if (err.name !== "NotFoundError") throw err;
    await new Promise((res) => {
      const r = indexedDB.deleteDatabase("$scramjet");
      r.onsuccess = r.onerror = r.onblocked = res;
    });
    const { ScramjetController } = $scramjetLoadController();
    scramjet = new ScramjetController({
      prefix: BASE + "sj/",
      files: {
        wasm: BASE + "scramjet/scramjet.wasm.wasm",
        all:  BASE + "scramjet/scramjet.all.js",
        sync: BASE + "scramjet/scramjet.sync.js",
      },
    });
    await scramjet.init();
  }

  const swAlreadyActive = !!navigator.serviceWorker.controller;
  await navigator.serviceWorker.register("./sw.js");

  if (!swAlreadyActive) {
    await waitForSWInit();
    if (_swOk !== true) throw new Error(typeof _swOk === "string" ? _swOk : "SW init failed");
    if (!navigator.serviceWorker.controller) {
      await new Promise((r) =>
        navigator.serviceWorker.addEventListener("controllerchange", r, { once: true })
      );
    }
  }

  if (!connection) {
    connection = new BareMux.BareMuxConnection(BASE + "baremux/worker.js");
  }
  if ((await connection.getTransport()) !== BASE + "bare-as-module3/index.mjs") {
    await connection.setTransport(BASE + "bare-as-module3/index.mjs", [BARE_SERVER]);
  }
}

// ── Proxy overlay ─────────────────────────────────────────────────────────────
const overlay    = document.getElementById("proxy-overlay");
const frame      = document.getElementById("proxy-frame");
const urlBar     = document.getElementById("proxy-url-bar");
const urlForm    = document.getElementById("proxy-url-form");
const closeBtn   = document.getElementById("proxy-close");
const backBtn    = document.getElementById("proxy-back");
const fwdBtn     = document.getElementById("proxy-forward");
const reloadBtn  = document.getElementById("proxy-reload");
const statusEl   = document.getElementById("proxy-status");
const loadBar    = document.getElementById("proxy-load-bar");

function setStatus(msg) { if (statusEl) { statusEl.textContent = msg; statusEl.style.display = msg ? "" : "none"; } }
function setLoading(on) { loadBar?.classList.toggle("active", on); }

function showProxy(url) {
  const proxied = location.origin + BASE + "sj/" + encodeURIComponent(url);
  frame.src = proxied;
  if (urlBar) urlBar.value = url;
  overlay.classList.add("open");
  document.body.classList.add("proxy-open");
  setLoading(true);
}

closeBtn?.addEventListener("click", () => {
  overlay.classList.remove("open");
  document.body.classList.remove("proxy-open");
  frame.src = "";
});

backBtn?.addEventListener("click",   () => { try { frame.contentWindow.history.back();    } catch {} });
fwdBtn?.addEventListener("click",    () => { try { frame.contentWindow.history.forward(); } catch {} });
reloadBtn?.addEventListener("click", () => { try { frame.contentWindow.location.reload(); } catch {} frame.src = frame.src; });

frame?.addEventListener("load", () => {
  setLoading(false);
  try {
    const href = frame.contentWindow.location.href;
    const prefix = location.origin + BASE + "sj/";
    if (href.startsWith(prefix) && urlBar) urlBar.value = decodeURIComponent(href.slice(prefix.length));
  } catch {}
});

urlForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = toUrl(urlBar.value, "google");
  showProxy(url);
});

// ── Public navigate function ──────────────────────────────────────────────────
async function navigate(input, engine) {
  const url = toUrl(input, engine || "google");

  setStatus("Starting proxy…");
  try {
    await initProxy();
  } catch (err) {
    setStatus("Error: " + (err.message || String(err)));
    return;
  }
  setStatus("");
  showProxy(url);
}

window._veilNavigate = navigate;
