"use strict";

// static-compat.js
// Bridges the gap between the full server version and the static/surge.sh deployment.
// Must load BEFORE settings.js, share.js, and proxy.js.

const VEIL_FULL = "https://secure.brightpathlearning.website";

// ── 1. Route relative /api/ calls to the full backend ──────────────────────
// settings.js calls /api/leaderboard, /api/verify-token, /api/beta-features
// share.js calls /api/share
// index.js calls /api/report-bug
// All of these work cross-origin since CORS is already open on the full server.
const _origFetch = window.fetch.bind(window);
window.fetch = function (url, opts) {
  if (typeof url === "string" && url.startsWith("/api/")) {
    return _origFetch(VEIL_FULL + url, opts);
  }
  return _origFetch(url, opts);
};

// ── 2. Multi-tab stubs (used by tabs.js, shortcuts.js, history.js) ──────────
// The static site is single-tab only. These stubs prevent errors.
// proxy.js will override _veilCreateTab and _veilNavigate after it loads.
window._veilGetTabs        = () => [];
window._veilGetActiveTabId = () => null;
window._veilSwitchTab      = () => {};
window._veilCloseTab       = () => {};
window._veilCreateTab      = (url) => { if (url && window._veilNavigate) window._veilNavigate(url); };
window._veilRefreshTabBar  = () => {};
window._veilIdleWake       = () => {};
window._veilIdleReset      = () => {};

// ── 3. Fix paths and nav links after DOM is ready ───────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // Page nav: full site uses absolute paths (/music.html, /ai.html, /remote.html)
  document.querySelectorAll(".page-nav-link").forEach((a) => {
    const h = a.getAttribute("href");
    if      (h === "/")            { a.href = "go.html"; a.classList.add("active"); }
    else if (h === "/music.html")  { a.href = "music.html"; }
    else if (h === "/ai.html")     { a.href = "ai.html"; }
    else if (h === "/remote.html") {
      a.href   = VEIL_FULL + "/remote.html";
      a.target = "_blank";
      a.title  = "Remote Desktop — use full site";
    }
  });

  // AI banner "Try AI" button
  const aiBannerBtn = document.querySelector("#ai-banner .community-banner-btn");
  if (aiBannerBtn) aiBannerBtn.setAttribute("href", "ai.html");

  // Partner logo (served from full site since the static repo doesn't host it at /ink-network-logo.png)
  document.querySelectorAll("img[src='/ink-network-logo.png']").forEach((img) => {
    img.src = VEIL_FULL + "/ink-network-logo.png";
  });

  // Favicon: full site serves /favicon.ico from backend — use inline SVG instead
  const favicon = document.querySelector("link[rel='icon']");
  if (favicon && favicon.href.includes("/favicon.ico")) {
    favicon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%236366f1'/%3E%3Cline x1='4' y1='21' x2='28' y2='21' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M8 26 L16 13 L24 26' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
  }

  // Tab bar: hide it since static is single-tab only
  const tabBar = document.getElementById("tab-bar");
  if (tabBar) tabBar.style.display = "none";
});
