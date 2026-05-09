"use strict";

// proxy.js — Scramjet proxy for the static/surge.sh deployment.
// Uses the same element IDs and ScramjetFrame API as the full site's index.js,
// but points at the correct bare server (secure.brightpathlearning.website).

const BARE_SERVER  = "https://secure.brightpathlearning.website/bare/";
const BASE         = new URL("./", location.href).pathname; // e.g. / or /veil-static/

// DOM refs (match full site's index.html IDs exactly)
const form           = document.getElementById("sj-form");
const address        = document.getElementById("sj-address");
const searchEngineEl = document.getElementById("sj-search-engine");
const errorContainer = document.getElementById("error-container");
const errorEl        = document.getElementById("sj-error");
const errorCodeEl    = document.getElementById("sj-error-code");
const submitBtn      = document.getElementById("sj-submit-btn");
const btnLabel       = document.getElementById("sj-btn-label");
const btnSpinner     = document.getElementById("sj-btn-spinner");
const frameContainer = document.getElementById("sj-frame-container");
const frameArea      = document.getElementById("tab-frame-area");
const urlBar         = document.getElementById("sj-url-bar");
const loadBar        = document.getElementById("sj-load-bar");
const btnBack        = document.getElementById("btn-back");
const btnForward     = document.getElementById("btn-forward");
const btnReload      = document.getElementById("btn-reload");
const btnHome        = document.getElementById("btn-home");

// Sync hidden search-engine input when radio changes (index.js normally does this)
document.querySelectorAll("input[name='engine']").forEach((radio) => {
  radio.addEventListener("change", () => {
    if (searchEngineEl) searchEngineEl.value = radio.value;
  });
});

// ── Scramjet / transport state ─────────────────────────────────────────────
let scramjet   = null;
let connection = null;
let _swOk      = null;
let activeFrame = null; // the current ScramjetFrame

const _swBC = new BroadcastChannel("_sw_init");
_swBC.onmessage = (e) => {
  _swOk = e.data.ok ? true : (e.data.message + "\n\n" + (e.data.stack || ""));
};

function waitForSWInit() {
  if (_swOk !== null) return Promise.resolve();
  return new Promise((resolve) => {
    const prev = _swBC.onmessage;
    const t = setTimeout(() => { _swBC.onmessage = prev; resolve(); }, 12000);
    _swBC.onmessage = (e) => {
      clearTimeout(t);
      _swOk = e.data.ok ? true : (e.data.message + "\n\n" + (e.data.stack || ""));
      _swBC.onmessage = prev;
      resolve();
    };
  });
}

// ── URL parsing (mirrors search.js from the full site) ────────────────────
function toUrl(input, engineTemplate) {
  input = (input || "").trim();
  try { return new URL(input).href; } catch {}
  try {
    const u = new URL("https://" + input);
    if (u.hostname.includes(".")) return u.href;
  } catch {}
  const tmpl = engineTemplate || "https://www.google.com/search?q=%s";
  return tmpl.replace("%s", encodeURIComponent(input));
}

// ── Load bar helpers ───────────────────────────────────────────────────────
function startLoadBar() {
  if (!loadBar) return;
  loadBar.className = "";
  loadBar.offsetWidth; // force reflow
  loadBar.className = "loading";
}
function finishLoadBar() {
  if (!loadBar) return;
  loadBar.className = "done";
  setTimeout(() => { if (loadBar) loadBar.className = ""; }, 400);
}

// ── Error helpers ──────────────────────────────────────────────────────────
function showError(msg, detail) {
  if (errorEl)        errorEl.textContent     = msg;
  if (errorCodeEl)    errorCodeEl.textContent = detail || "";
  if (errorContainer) errorContainer.style.display = "block";
}
function clearError() {
  if (errorContainer) errorContainer.style.display = "none";
}

// ── Submit button spinner ─────────────────────────────────────────────────
function setLoading(on) {
  if (submitBtn)   submitBtn.disabled        = on;
  if (btnLabel)    btnLabel.style.display    = on ? "none" : "";
  if (btnSpinner)  btnSpinner.style.display  = on ? "" : "none";
}

// ── URL poll: keep url bar in sync while proxy is browsing ─────────────────
let _lastUrl = "";
setInterval(() => {
  if (!activeFrame || !frameContainer || frameContainer.style.display === "none") return;
  if (urlBar && document.activeElement === urlBar) return; // don't clobber while user is typing
  try {
    const href   = activeFrame.frame.contentWindow.location.href;
    const prefix = location.origin + BASE + "sj/";
    if (href.startsWith(prefix)) {
      const decoded = decodeURIComponent(href.slice(prefix.length));
      if (decoded && decoded !== _lastUrl) {
        _lastUrl = decoded;
        if (urlBar) urlBar.value = decoded;
      }
    }
  } catch {}
}, 600);

// ── Proxy init (Scramjet + SW + BareMux) ──────────────────────────────────
async function initProxy() {
  // Init Scramjet controller
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

  // Expose createTab so tabs.js / shortcuts.js work
  window._veilCreateTab = (url) => navigate(url);

  // Register service worker
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

  // Set up BareMux transport pointing at the REAL bare server
  if (!connection) {
    connection = new BareMux.BareMuxConnection(BASE + "baremux/worker.js");
  }
  const expectedTransport = BASE + "bare-as-module3/index.mjs";
  if ((await connection.getTransport()) !== expectedTransport) {
    await connection.setTransport(expectedTransport, [BARE_SERVER]);
  }
}

// ── Open proxy frame with a URL ────────────────────────────────────────────
function openProxy(url) {
  if (!frameArea || !frameContainer) return;

  if (!activeFrame) {
    // Create a ScramjetFrame (mirrors full site's createTab)
    activeFrame = scramjet.createFrame();
    activeFrame.frame.className = "sj-tab-frame sj-tab-active";
    frameArea.appendChild(activeFrame.frame);

    activeFrame.frame.addEventListener("load", () => {
      finishLoadBar();
      try {
        const href   = activeFrame.frame.contentWindow.location.href;
        const prefix = location.origin + BASE + "sj/";
        if (href.startsWith(prefix)) {
          const decoded = decodeURIComponent(href.slice(prefix.length));
          _lastUrl = decoded;
          if (urlBar && document.activeElement !== urlBar) urlBar.value = decoded;
        }
      } catch {}
      if (btnBack)    btnBack.disabled    = false;
      if (btnForward) btnForward.disabled = false;
    });
  }

  if (urlBar)   urlBar.value = url;
  _lastUrl = url;
  startLoadBar();
  frameContainer.style.display = "flex";
  activeFrame.frame.focus();
  activeFrame.go(url);
}

// ── Form submit ────────────────────────────────────────────────────────────
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();
  setLoading(true);

  try {
    await initProxy();
  } catch (err) {
    showError("Failed to initialize proxy.", err.message || String(err));
    setLoading(false);
    return;
  }

  try {
    const engine = searchEngineEl?.value || document.querySelector("input[name='engine']:checked")?.value;
    const url = (typeof search === "function")
      ? search(address?.value || "", engine)
      : toUrl(address?.value || "", engine);
    openProxy(url);
  } catch (err) {
    showError("Failed to load page.", err.message || String(err));
  } finally {
    setLoading(false);
  }
});

// ── URL bar navigation ─────────────────────────────────────────────────────
urlBar?.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const engine = searchEngineEl?.value || document.querySelector("input[name='engine']:checked")?.value;
  const url = (typeof search === "function")
    ? search(urlBar.value, engine)
    : toUrl(urlBar.value, engine);
  urlBar.value = url;
  _lastUrl = url;
  if (activeFrame) {
    startLoadBar();
    activeFrame.go(url);
  }
  urlBar.blur();
});
urlBar?.addEventListener("focus", () => urlBar.select());

// ── Toolbar buttons ────────────────────────────────────────────────────────
btnBack?.addEventListener("click", () => {
  startLoadBar();
  try { activeFrame?.frame.contentWindow.history.back(); } catch {}
});
btnForward?.addEventListener("click", () => {
  startLoadBar();
  try { activeFrame?.frame.contentWindow.history.forward(); } catch {}
});
btnReload?.addEventListener("click", () => {
  startLoadBar();
  try { activeFrame?.frame.contentWindow.location.reload(); } catch {}
});
btnHome?.addEventListener("click", () => {
  if (frameContainer) frameContainer.style.display = "none";
  document.title = "Veil";
});

// ── Public navigate function (used by shortcuts.js, games, etc.) ──────────
async function navigate(url) {
  if (typeof url !== "string") return;
  clearError();
  setLoading(true);
  try {
    await initProxy();
    openProxy(url);
  } catch (err) {
    showError("Failed to initialize proxy.", err.message || String(err));
  } finally {
    setLoading(false);
  }
}

window._veilNavigate = navigate;
