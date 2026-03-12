"use strict";

// ── Games list ─────────────────────────────────────────────────────────────
const GAMES = [
  // ── Action / Shooting ──────────────────────────────────────────────────
  { name: "Time Shooter 2",        emoji: "🔫", hue: 10,  url: "games/200.html" },
  { name: "Bowmasters",            emoji: "🏹", hue: 30,  url: "games/0.html" },
  { name: "Cluster Rush",          emoji: "🚛", hue: 40,  url: "games/81.html" },
  { name: "Dreadhead Parkour",     emoji: "🤸", hue: 200, url: "games/310.html" },

  // ── Multiplayer / .io ─────────────────────────────────────────────────
  { name: "Paper.io 2",            emoji: "📄", hue: 280, url: "games/102.html" },
  { name: "Basket Random",         emoji: "🏀", hue: 30,  url: "games/66.html" },
  { name: "Boxing Random",         emoji: "🥊", hue: 0,   url: "games/77.html" },
  { name: "Gladihoppers",          emoji: "⚔️",  hue: 350, url: "games/4.html" },

  // ── Platformer ────────────────────────────────────────────────────────
  { name: "OvO",                   emoji: "🏃", hue: 220, url: "games/1-fde.html" },
  { name: "Vex 3",                 emoji: "🤺", hue: 180, url: "games/47.html" },
  { name: "Vex 5",                 emoji: "🤺", hue: 190, url: "games/50.html" },
  { name: "Vex 6",                 emoji: "🤺", hue: 200, url: "games/51.html" },
  { name: "Big Tower Tiny Square", emoji: "🏗️",  hue: 50,  url: "games/170.html" },
  { name: "Bob The Robber 2",      emoji: "🕵️",  hue: 240, url: "games/76.html" },
  { name: "Fireboy & Watergirl 2", emoji: "🔥", hue: 20,  url: "games/88.html" },
  { name: "Fireboy & Watergirl 3", emoji: "❄️",  hue: 190, url: "games/89.html" },

  // ── Racing / Driving ─────────────────────────────────────────────────
  { name: "Moto X3M",              emoji: "🏍️",  hue: 15,  url: "games/55.html" },
  { name: "Moto X3M 2",            emoji: "🏍️",  hue: 20,  url: "games/97.html" },
  { name: "Moto X3M 3",            emoji: "🏍️",  hue: 25,  url: "games/98.html" },
  { name: "Moto X3M Pool Party",   emoji: "🏊", hue: 200, url: "games/124.html" },
  { name: "Moto X3M Spooky Land",  emoji: "🎃", hue: 30,  url: "games/99.html" },
  { name: "Highway Racer 2",       emoji: "🚗", hue: 210, url: "games/92.html" },

  // ── Survival / Horror ────────────────────────────────────────────────
  { name: "FNAF 1",                emoji: "🐻", hue: 20,  url: "games/38.html" },
  { name: "FNAF 2",                emoji: "🐻", hue: 15,  url: "games/39.html" },
  { name: "FNAF 3",                emoji: "🐻", hue: 10,  url: "games/40.html" },
  { name: "FNAF 4",                emoji: "🐻", hue: 5,   url: "games/41.html" },
  { name: "Granny",                emoji: "👵", hue: 40,  url: "games/90.html" },
  { name: "Baldi's Basics",        emoji: "📏", hue: 60,  url: "games/65.html" },

  // ── Casual / Mobile ───────────────────────────────────────────────────
  { name: "Temple Run 2",          emoji: "🏛️",  hue: 30,  url: "games/10.html" },
  { name: "Jetpack Joyride",       emoji: "🚀", hue: 220, url: "games/7.html" },
  { name: "Crossy Road",           emoji: "🐔", hue: 90,  url: "games/24.html" },
  { name: "Retro Bowl",            emoji: "🏈", hue: 35,  url: "games/33.html" },
  { name: "Tiny Fishing",          emoji: "🎣", hue: 190, url: "games/108.html" },
  { name: "BitLife",               emoji: "💬", hue: 240, url: "games/70.html" },
  { name: "Gunspin",               emoji: "🔫", hue: 0,   url: "games/91.html" },

  // ── Rhythm ───────────────────────────────────────────────────────────
  { name: "WebOsu",                emoji: "🎵", hue: 340, url: "games/130.html" },
  { name: "Flappy Bird",           emoji: "🐦", hue: 55,  url: "games/129.html" },

  // ── Minecraft ────────────────────────────────────────────────────────
  { name: "Minecraft Beta 1.7.3",  emoji: "⛏️",  hue: 100, url: "games/300.html" },

  // ── Puzzle / Word ────────────────────────────────────────────────────
  { name: "Wordle",                emoji: "🟩", hue: 130, url: "games/112.html" },

  // ── Classic ──────────────────────────────────────────────────────────
  { name: "Snake",                 emoji: "🐍", hue: 120, url: "games/snake.html" },
  { name: "2048",                  emoji: "🔢", hue: 40,  url: "games/2048.html" },
  { name: "Tetris",                emoji: "🟥", hue: 0,   url: "games/tetris.html" },
  { name: "Breakout",              emoji: "🧱", hue: 210, url: "games/breakout.html" },
  { name: "Pong",                  emoji: "🏓", hue: 260, url: "games/pong.html" },
  { name: "Minesweeper",           emoji: "💣", hue: 80,  url: "games/minesweeper.html" },
];

// ── Cloak presets ───────────────────────────────────────────────────────────
const CLOAK_PRESETS = {
  none:      { title: "Veil",                           icon: null },
  classroom: { title: "Google Classroom",               icon: "https://www.gstatic.com/classroom/favicon.png" },
  docs:      { title: "Untitled document — Docs",       icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  slides:    { title: "Untitled presentation — Slides", icon: "https://ssl.gstatic.com/docs/presentations/images/favicon5.ico" },
  khan:      { title: "Khan Academy",                   icon: "https://cdn.kastatic.org/images/favicon.ico" },
  desmos:    { title: "Desmos | Graphing Calculator",   icon: "https://www.desmos.com/assets/img/favicon.ico" },
};

// ── Panic URLs ──────────────────────────────────────────────────────────────
const PANIC_URLS = {
  classroom: "https://classroom.google.com",
  google:    "https://www.google.com",
  desmos:    "https://www.desmos.com/calculator",
  gmail:     "https://mail.google.com",
  khan:      "https://www.khanacademy.org",
};

// ── Settings panel ──────────────────────────────────────────────────────────
const settingsOverlay = document.getElementById("settings-overlay");
const settingsPanel   = document.getElementById("settings-panel");

function openSettings() {
  settingsPanel.removeAttribute("aria-hidden");
  settingsOverlay.removeAttribute("aria-hidden");
  settingsPanel.classList.add("open");
  settingsOverlay.classList.add("open");
}

function closeSettings() {
  settingsPanel.classList.remove("open");
  settingsOverlay.classList.remove("open");
  settingsPanel.setAttribute("aria-hidden", "true");
  settingsOverlay.setAttribute("aria-hidden", "true");
}

document.getElementById("btn-settings")?.addEventListener("click", openSettings);
document.getElementById("btn-settings-close")?.addEventListener("click", closeSettings);
settingsOverlay?.addEventListener("click", closeSettings);

// ── Tab cloak ────────────────────────────────────────────────────────────────
const favicon       = document.getElementById("favicon");
const cloakSelect   = document.getElementById("cloak-preset");
const VEIL_ICON_HREF = favicon?.href || "";

function applyCloak(key) {
  const preset = CLOAK_PRESETS[key] || CLOAK_PRESETS.none;
  document.title = preset.title;
  if (!favicon) return;
  if (preset.icon) {
    favicon.href = preset.icon;
  } else {
    favicon.href = VEIL_ICON_HREF;
  }
  localStorage.setItem("veil_cloak", key);
}

cloakSelect?.addEventListener("change", () => applyCloak(cloakSelect.value));

// Restore saved cloak
(function () {
  const saved = localStorage.getItem("veil_cloak") || "none";
  if (cloakSelect) cloakSelect.value = saved;
  applyCloak(saved);
})();

// ── Panic key (Alt+X) ────────────────────────────────────────────────────────
const panicSelect = document.getElementById("panic-url");

panicSelect?.addEventListener("change", () => {
  localStorage.setItem("veil_panic", panicSelect.value);
});

// Restore saved panic destination
(function () {
  const saved = localStorage.getItem("veil_panic") || "classroom";
  if (panicSelect) panicSelect.value = saved;
})();

document.addEventListener("keydown", e => {
  if (e.altKey && e.key === "x") {
    const dest = panicSelect?.value || "classroom";
    window.location.replace(PANIC_URLS[dest] || PANIC_URLS.classroom);
  }
  if (e.key === "Escape") {
    const overlay = document.getElementById("gameOverlay");
    if (overlay?.classList.contains("open")) closeGame();
    else closeSettings();
  }
});

// ── Appearance toggles ───────────────────────────────────────────────────────
const scanlinesCb = document.getElementById("fx-scanlines");
const vignetteCb  = document.getElementById("fx-vignette");

const perfToggle  = document.getElementById("perf-mode-toggle");

function applyAppearance() {
  document.body.classList.toggle("no-scanlines", !scanlinesCb?.checked);
  document.body.classList.toggle("no-vignette",  !vignetteCb?.checked);
  document.body.classList.toggle("perf-mode",    !!perfToggle?.checked);
  localStorage.setItem("veil_scanlines", scanlinesCb?.checked ? "1" : "0");
  localStorage.setItem("veil_vignette",  vignetteCb?.checked  ? "1" : "0");
  localStorage.setItem("veil_perf",      perfToggle?.checked  ? "1" : "0");
}

scanlinesCb?.addEventListener("change", applyAppearance);
vignetteCb?.addEventListener("change",  applyAppearance);
perfToggle?.addEventListener("change",  applyAppearance);

// Restore saved appearance
(function () {
  const sl = localStorage.getItem("veil_scanlines");
  const vg = localStorage.getItem("veil_vignette");
  const pf = localStorage.getItem("veil_perf");
  if (scanlinesCb && sl !== null) scanlinesCb.checked = sl === "1";
  if (vignetteCb  && vg !== null) vignetteCb.checked  = vg === "1";
  if (perfToggle  && pf !== null) perfToggle.checked  = pf === "1";
  applyAppearance();
})();

// ── Games collapse ───────────────────────────────────────────────────────────
const COLLAPSE_KEY = "veil_games_collapsed";
const gsGrid   = document.getElementById("gs-grid");
const gsToggle = document.getElementById("gs-toggle");
const gsNoRes  = document.getElementById("gs-no-results");

function setCollapsed(on) {
  if (!gsGrid || !gsToggle) return;
  gsGrid.classList.toggle("collapsed", on);
  gsToggle.classList.toggle("collapsed", on);
  gsToggle.title = on ? "Expand games" : "Collapse games";
  localStorage.setItem(COLLAPSE_KEY, on ? "1" : "0");
}

gsToggle?.addEventListener("click", () => setCollapsed(!gsGrid.classList.contains("collapsed")));

// ── Render games ─────────────────────────────────────────────────────────────
function renderGames(filter) {
  if (!gsGrid) return;
  const q        = (filter || "").toLowerCase();
  const filtered = GAMES.filter(g => g.name.toLowerCase().includes(q));
  gsGrid.innerHTML = "";
  if (gsNoRes) gsNoRes.style.display = filtered.length ? "none" : "block";

  for (const g of filtered) {
    const tile = document.createElement("div");
    tile.className = "ql-tile";
    tile.title = g.name;

    const icon = document.createElement("div");
    icon.className = "gs-tile-icon";
    icon.textContent = g.emoji || "🎮";
    icon.style.background = `hsla(${g.hue ?? 220}, 55%, 20%, 1)`;

    const label = document.createElement("div");
    label.className = "ql-tile-name";
    label.textContent = g.name;

    tile.appendChild(icon);
    tile.appendChild(label);
    tile.addEventListener("click", () => openGame(g));
    gsGrid.appendChild(tile);
  }
}

// ── Search ───────────────────────────────────────────────────────────────────
document.getElementById("gs-search")?.addEventListener("input", function () {
  renderGames(this.value);
});

// ── Game overlay ─────────────────────────────────────────────────────────────
const gameOverlay  = document.getElementById("gameOverlay");
const gameFrame    = document.getElementById("gameFrame");
const gameBarTitle = document.getElementById("gameBarTitle");

function openGame(g) {
  if (!gameFrame || !gameOverlay) return;
  gameFrame.src = g.url;
  if (gameBarTitle) gameBarTitle.textContent = g.name;
  gameOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeGame() {
  if (!gameOverlay) return;
  gameOverlay.classList.remove("open");
  if (gameFrame) gameFrame.src = "";
  document.body.style.overflow = "";
}

document.getElementById("closeGame")?.addEventListener("click", closeGame);

document.getElementById("fullscreenBtn")?.addEventListener("click", () => {
  if (gameFrame?.requestFullscreen) gameFrame.requestFullscreen();
});

// ── Proxy search form ─────────────────────────────────────────────────────────
const proxySearchForm = document.getElementById("proxy-search-form");
const proxyInput      = document.getElementById("proxy-input");

proxySearchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const val    = proxyInput?.value?.trim();
  const engine = document.querySelector("input[name='engine']:checked")?.value || "google";
  if (val && window._veilNavigate) window._veilNavigate(val, engine);
});

// ── Quick access tiles ────────────────────────────────────────────────────────
document.getElementById("ql-grid")?.querySelectorAll(".ql-tile[data-url]").forEach((tile) => {
  tile.addEventListener("click", () => {
    const url = tile.dataset.url;
    if (url && window._veilNavigate) window._veilNavigate(url, "google");
  });
});

// ── Init ─────────────────────────────────────────────────────────────────────
renderGames();
setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
