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

// ── Tab cloak presets ───────────────────────────────────────────────────────
const CLOAKS = [
  { label: "None (Veil)",               title: "Veil",                           icon: "🌐" },
  { label: "Google Classroom",          title: "Google Classroom",               icon: "https://www.gstatic.com/classroom/favicon.png" },
  { label: "Google Docs",               title: "Untitled document — Docs",       icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  { label: "Khan Academy",              title: "Khan Academy",                   icon: "https://cdn.kastatic.org/images/favicon.ico" },
  { label: "Desmos",                    title: "Desmos | Graphing Calculator",   icon: "https://www.desmos.com/assets/img/favicon.ico" },
  { label: "Google Slides",             title: "Untitled presentation — Slides", icon: "https://ssl.gstatic.com/docs/presentations/images/favicon5.ico" },
  { label: "Canvas LMS",               title: "Dashboard",                      icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" },
];

// ── DOM refs ────────────────────────────────────────────────────────────────
const gameGrid    = document.getElementById("gameGrid");
const searchInput = document.getElementById("search");
const noResults   = document.getElementById("noResults");
const overlay     = document.getElementById("gameOverlay");
const gameFrame   = document.getElementById("gameFrame");
const gameBarTitle= document.getElementById("gameBarTitle");
const cloakBtn    = document.getElementById("cloakBtn");
const cloakPanel  = document.getElementById("cloakPanel");
const cloakOpts   = document.getElementById("cloakOptions");
const favicon     = document.getElementById("favicon");

// ── Render games ─────────────────────────────────────────────────────────────
function renderGames(filter = "") {
  const q = filter.toLowerCase();
  const filtered = GAMES.filter(g => g.name.toLowerCase().includes(q));
  gameGrid.innerHTML = "";
  noResults.style.display = filtered.length ? "none" : "block";
  filtered.forEach(g => {
    const tile = document.createElement("div");
    tile.className = "game-tile";
    tile.innerHTML = `
      <div class="game-thumb" style="background:linear-gradient(135deg,hsl(${g.hue},40%,12%),hsl(${g.hue},50%,18%))">${g.emoji}</div>
      <div class="game-label">${g.name}</div>
    `;
    tile.addEventListener("click", () => openGame(g));
    gameGrid.appendChild(tile);
  });
}

// ── Open / close game ────────────────────────────────────────────────────────
function openGame(g) {
  gameFrame.src = g.url;
  gameBarTitle.textContent = g.name;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeGame() {
  overlay.classList.remove("open");
  gameFrame.src = "";
  document.body.style.overflow = "";
}

document.getElementById("closeGame").addEventListener("click", closeGame);

document.getElementById("fullscreenBtn").addEventListener("click", () => {
  if (gameFrame.requestFullscreen) gameFrame.requestFullscreen();
});

// ── Search ───────────────────────────────────────────────────────────────────
searchInput.addEventListener("input", () => renderGames(searchInput.value));

// ── Panic key (Alt+X) ────────────────────────────────────────────────────────
document.addEventListener("keydown", e => {
  if (e.altKey && e.key === "x") window.location.replace("https://classroom.google.com");
  if (e.key === "Escape" && overlay.classList.contains("open")) closeGame();
});

// ── Tab cloak ────────────────────────────────────────────────────────────────
let activeCloak = 0;

function renderCloaks() {
  cloakOpts.innerHTML = "";
  CLOAKS.forEach((c, i) => {
    const el = document.createElement("div");
    el.className = "cloak-opt" + (i === activeCloak ? " active" : "");
    el.textContent = c.label;
    el.addEventListener("click", () => {
      activeCloak = i;
      applyCloak(c);
      renderCloaks();
      cloakPanel.style.display = "none";
    });
    cloakOpts.appendChild(el);
  });
}

function applyCloak(c) {
  document.title = c.title;
  if (c.icon.startsWith("http")) {
    favicon.href = c.icon;
  } else {
    favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${c.icon}</text></svg>`;
  }
}

cloakBtn.addEventListener("click", e => {
  e.stopPropagation();
  cloakPanel.style.display = cloakPanel.style.display === "none" ? "block" : "none";
});

document.addEventListener("click", () => { cloakPanel.style.display = "none"; });
cloakPanel.addEventListener("click", e => e.stopPropagation());

// ── Init ─────────────────────────────────────────────────────────────────────
renderGames();
renderCloaks();
