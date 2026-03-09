// ── Games list ─────────────────────────────────────────────────────────────
const GAMES = [
  { name: "Slope",            emoji: "🎳", hue: 120, url: "https://slope-game.github.io/" },
  { name: "1v1.LOL",          emoji: "🔫", hue: 30,  url: "https://1v1.lol/" },
  { name: "Krunker",          emoji: "🎯", hue: 200, url: "https://krunker.io/" },
  { name: "Smash Karts",      emoji: "🏎️", hue: 15,  url: "https://smashkarts.io/" },
  { name: "Shell Shockers",   emoji: "🥚", hue: 45,  url: "https://shellshock.io/" },
  { name: "Paper.io 2",       emoji: "📄", hue: 280, url: "https://paper-io.com/" },
  { name: "Slither.io",       emoji: "🐍", hue: 90,  url: "https://slither.io/" },
  { name: "Agar.io",          emoji: "🟢", hue: 150, url: "https://agar.io/" },
  { name: "Cookie Clicker",   emoji: "🍪", hue: 35,  url: "https://orteil.dashnet.org/cookieclicker/" },
  { name: "2048",             emoji: "🔢", hue: 40,  url: "https://play2048.co/" },
  { name: "Minesweeper",      emoji: "💣", hue: 0,   url: "https://minesweeper.online/" },
  { name: "Minecraft Classic",emoji: "⛏️", hue: 100, url: "https://classic.minecraft.net/" },
  { name: "Retro Bowl",       emoji: "🏈", hue: 40,  url: "https://retrobowl.me/" },
  { name: "Bloxorz",          emoji: "🟦", hue: 210, url: "https://bloxorz.io/" },
  { name: "Run 3",            emoji: "🏃", hue: 60,  url: "https://run3.io/" },
  { name: "Drift Boss",       emoji: "🚗", hue: 350, url: "https://driftboss.io/" },
  { name: "Vex 5",            emoji: "🤸", hue: 180, url: "https://vex5.io/" },
  { name: "Geometry Dash",    emoji: "🔺", hue: 25,  url: "https://geometrydash.io/" },
  { name: "Tunnel Rush",      emoji: "🔮", hue: 290, url: "https://tunnelrush.io/" },
  { name: "Stickman Hook",    emoji: "🕹️", hue: 330, url: "https://stickmanhook.com/" },
  { name: "Rocket League",    emoji: "🚀", hue: 220, url: "https://www.crazygames.com/game/rocket-league-sideswipe" },
  { name: "Chess",            emoji: "♟️", hue: 0,   url: "https://www.chess.com/play/computer" },
  { name: "Wordle",           emoji: "🟩", hue: 130, url: "https://www.nytimes.com/games/wordle/index.html" },
  { name: "Sudoku",           emoji: "🔣", hue: 240, url: "https://sudoku.com/" },
  { name: "Flappy Bird",      emoji: "🐦", hue: 60,  url: "https://flappybird.io/" },
  { name: "Dino Run",         emoji: "🦕", hue: 80,  url: "https://chromedino.com/" },
  { name: "Snake",            emoji: "🐍", hue: 110, url: "https://playsnake.org/" },
  { name: "Tetris",           emoji: "🟥", hue: 0,   url: "https://tetris.com/play-tetris" },
  { name: "Pong",             emoji: "🏓", hue: 200, url: "https://www.ponggame.org/" },
  { name: "Among Us Online",  emoji: "👾", hue: 270, url: "https://www.crazygames.com/game/among-us-online" },
];

// ── Tab cloak presets ───────────────────────────────────────────────────────
const CLOAKS = [
  { label: "None (Veil)",          title: "Veil",                  icon: "🌐" },
  { label: "Google Classroom",     title: "Google Classroom",      icon: "https://www.gstatic.com/classroom/favicon.png" },
  { label: "Google Docs",          title: "Untitled document — Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  { label: "Khan Academy",         title: "Khan Academy",          icon: "https://cdn.kastatic.org/images/favicon.ico" },
  { label: "Desmos",               title: "Desmos | Graphing Calculator", icon: "https://www.desmos.com/assets/img/favicon.ico" },
  { label: "Google Slides",        title: "Untitled presentation — Slides", icon: "https://ssl.gstatic.com/docs/presentations/images/favicon5.ico" },
  { label: "Canvas LMS",           title: "Dashboard",             icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" },
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
  if (e.altKey && e.key === "x") {
    window.location.replace("https://classroom.google.com");
  }
  if (e.key === "Escape" && overlay.classList.contains("open")) {
    closeGame();
  }
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
      cloakPanel.classList.remove("open");
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

cloakBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  cloakPanel.classList.toggle("open");
});

document.addEventListener("click", () => cloakPanel.classList.remove("open"));
cloakPanel.addEventListener("click", e => e.stopPropagation());

// ── Init ─────────────────────────────────────────────────────────────────────
renderGames();
renderCloaks();
