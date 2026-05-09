"use strict";

// ── State ────────────────────────────────────────────────────────────────────
let results  = [];
let queue    = [];
let qIdx     = -1;  // current position in queue
let isPlaying = false;
let shuffle  = false;
let repeat   = "off"; // off | all | one
let autoplay = false;
let autoplayFetching = false;
let activeTab = "results";
let currentTrack = null;

const audio = document.getElementById("mp-audio");

// ── Elements ─────────────────────────────────────────────────────────────────
const elBackdrop   = document.getElementById("mp-backdrop");
const elArtWrap    = document.getElementById("mp-art-wrap");
const elArt        = document.getElementById("mp-art");
const elArtPH      = document.getElementById("mp-art-placeholder");
const elTitle      = document.getElementById("mp-title");
const elArtist     = document.getElementById("mp-artist");
const elAlbum      = document.getElementById("mp-album");
const elTime       = document.getElementById("mp-time");
const elTotal      = document.getElementById("mp-total");
const elBarFill    = document.getElementById("mp-bar-fill");
const elBarThumb   = document.getElementById("mp-bar-thumb");
const elBarOuter   = document.getElementById("mp-bar-outer");
const elPlayPause  = document.getElementById("mp-playpause");
const elPlayIcon   = document.getElementById("mp-play-icon");
const elPauseIcon  = document.getElementById("mp-pause-icon");
const elPrev       = document.getElementById("mp-prev");
const elNext       = document.getElementById("mp-next");
const elShuffle    = document.getElementById("mp-shuffle");
const elRepeat     = document.getElementById("mp-repeat");
const elVol        = document.getElementById("mp-vol");
const elAutoplay   = document.getElementById("mp-autoplay");
const elSearch     = document.getElementById("mp-search");
const elSearchBtn  = document.getElementById("mp-search-btn");
const elLoading    = document.getElementById("mp-loading");
const elResultsList = document.getElementById("mp-results-list");
const elQueueList  = document.getElementById("mp-queue-list");
const elQueueCount = document.getElementById("mp-queue-count");
const elEmpty      = document.getElementById("mp-empty");
const elYtLink     = document.getElementById("mp-yt-link");

// ── Utilities ─────────────────────────────────────────────────────────────────
function fmt(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function setPlayState(playing) {
  isPlaying = playing;
  elPlayIcon.style.display  = playing ? "none"  : "";
  elPauseIcon.style.display = playing ? ""      : "none";
  elArtWrap.classList.toggle("playing", playing);
  document.querySelectorAll(".mp-song.active").forEach(el => el.classList.toggle("paused", !playing));
}

// ── Audio events ──────────────────────────────────────────────────────────────
audio.addEventListener("timeupdate", () => {
  const dur = (audio.duration && isFinite(audio.duration))
    ? audio.duration
    : (currentTrack?.duration / 1000 || 0);
  if (!dur) return;
  const pct = Math.min(100, (audio.currentTime / dur) * 100);
  elBarFill.style.width  = pct + "%";
  elBarThumb.style.left  = pct + "%";
  elTime.textContent = fmt(audio.currentTime * 1000);
});

audio.addEventListener("loadedmetadata", () => {
  elTotal.textContent = fmt(audio.duration * 1000);
});

audio.addEventListener("play",  () => setPlayState(true));
audio.addEventListener("pause", () => setPlayState(false));

audio.addEventListener("ended", () => {
  if (repeat === "one") {
    audio.currentTime = 0;
    audio.play();
    return;
  }
  playNext();
});

audio.volume = 0.8;

// ── Progress bar seek ─────────────────────────────────────────────────────────
elBarOuter.addEventListener("click", (e) => {
  const dur = (audio.duration && isFinite(audio.duration))
    ? audio.duration
    : (currentTrack?.duration / 1000 || 0);
  if (!dur) return;
  const rect = elBarOuter.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * dur;
});

// ── Volume ─────────────────────────────────────────────────────────────────────
elVol.addEventListener("input", () => { audio.volume = parseFloat(elVol.value); });

// ── Load + play a track ───────────────────────────────────────────────────────
const elQuality = document.getElementById("mp-quality");

function setQuality(state, label) {
  elQuality.className = state;
  elQuality.textContent = label;
}

async function loadTrack(track) {
  currentTrack = track;

  if (track.artwork) {
    elArt.src = track.artwork;
    elArt.style.display = "";
    elArtPH.style.display = "none";
    elBackdrop.style.backgroundImage = `url(${track.artwork})`;
  } else {
    elArt.style.display = "none";
    elArtPH.style.display = "";
    elBackdrop.style.backgroundImage = "none";
  }

  elTitle.textContent   = track.title;
  elArtist.textContent  = track.artist;
  elAlbum.textContent   = track.album;
  elTotal.textContent   = fmt(track.duration);
  elTime.textContent    = "0:00";
  elBarFill.style.width = "0%";
  elBarThumb.style.left = "0%";
  document.title        = `${track.title} — Veil Music`;

  document.querySelectorAll(".mp-song").forEach(el => {
    el.classList.toggle("active", el.dataset.id === String(track.id));
    el.classList.remove("paused");
  });

  setQuality("loading", "⏳ Loading...");
  elPlayPause.disabled = true;
  audio.oncanplay = null;
  audio.onerror = null;

  const streamUrl = `https://secure.brightpathlearning.website/api/music/stream?id=${track.id}`;
  fetch(streamUrl).then(r => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.blob();
  }).then(blob => {
    if (currentTrack !== track) return;
    const blobUrl = URL.createObjectURL(blob);
    audio.oncanplay = () => {
      setQuality("full", "● Full Song");
      elPlayPause.disabled = false;
      audio.oncanplay = null;
    };
    audio.onerror = () => {
      setQuality("preview", "✕ Failed to load");
      elPlayPause.disabled = false;
      audio.onerror = null;
      URL.revokeObjectURL(blobUrl);
    };
    audio.src = blobUrl;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }).catch(() => {
    setQuality("preview", "✕ Failed to load");
    elPlayPause.disabled = false;
  });

  elYtLink.textContent = "Open in SoundCloud";
  elYtLink.onclick = () => {
    const w = window.open("about:blank", "_blank");
    if (w) w.location.href = location.origin + "?q=" + encodeURIComponent(track.sourceUrl || "https://soundcloud.com");
  };
}

// ── Playback controls ─────────────────────────────────────────────────────────
elPlayPause.addEventListener("click", () => {
  if (!currentTrack) return;
  if (audio.paused) audio.play();
  else audio.pause();
});

function playNext() {
  if (!queue.length) {
    if (autoplay && currentTrack && !autoplayFetching) triggerAutoplay();
    return;
  }
  if (shuffle) {
    qIdx = Math.floor(Math.random() * queue.length);
  } else {
    qIdx = (qIdx + 1) % queue.length;
    if (qIdx === 0 && repeat === "off") {
      if (autoplay && currentTrack && !autoplayFetching) triggerAutoplay();
      else audio.pause();
      return;
    }
  }
  loadTrack(queue[qIdx]);
  renderQueue();
  if (autoplay && !autoplayFetching && qIdx >= queue.length - 2) triggerAutoplay();
}

async function triggerAutoplay() {
  if (autoplayFetching || !currentTrack) return;
  autoplayFetching = true;
  elAutoplay.classList.add("fetching");

  try {
    const res = await fetch(
      `https://secure.brightpathlearning.website/api/music/related?sourceUrl=${encodeURIComponent(currentTrack.sourceUrl)}`
    );
    const tracks = await res.json();
    const _API2 = "https://secure.brightpathlearning.website";
    tracks.forEach(t => { if (t.artwork && t.artwork.startsWith("/")) t.artwork = _API2 + t.artwork; });
    let added = 0;
    tracks.forEach(t => {
      if (!queue.find(q => q.id === t.id) && t.id !== currentTrack.id) {
        t._autoplay = true;
        queue.push(t);
        added++;
      }
    });
    if (added) {
      elQueueCount.textContent = `(${queue.length})`;
      if (activeTab === "queue") renderQueue();
      if (!isPlaying) {
        qIdx = queue.length - added;
        loadTrack(queue[qIdx]);
        renderQueue();
      }
    }
  } catch (err) {
    console.error("[autoplay]", err);
  }

  autoplayFetching = false;
  elAutoplay.classList.remove("fetching");
}

function playPrev() {
  if (!queue.length) return;
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  if (shuffle) {
    qIdx = Math.floor(Math.random() * queue.length);
  } else {
    qIdx = (qIdx - 1 + queue.length) % queue.length;
  }
  loadTrack(queue[qIdx]);
  renderQueue();
}

elNext.addEventListener("click", playNext);
elPrev.addEventListener("click", playPrev);

elShuffle.addEventListener("click", () => {
  shuffle = !shuffle;
  elShuffle.classList.toggle("active", shuffle);
});

elRepeat.addEventListener("click", () => {
  const modes = ["off", "all", "one"];
  repeat = modes[(modes.indexOf(repeat) + 1) % modes.length];
  elRepeat.classList.toggle("active", repeat !== "off");
  elRepeat.title = repeat === "one" ? "Repeat One" : repeat === "all" ? "Repeat All" : "Repeat";
  elRepeat.style.position = "relative";
  const badge = elRepeat.querySelector(".repeat-badge");
  if (badge) badge.remove();
  if (repeat === "one") {
    const b = document.createElement("span");
    b.className = "repeat-badge";
    b.style.cssText = "position:absolute;top:2px;right:2px;font-size:8px;color:var(--accent);font-weight:700;";
    b.textContent = "1";
    elRepeat.appendChild(b);
  }
});

elAutoplay.addEventListener("click", () => {
  autoplay = !autoplay;
  elAutoplay.classList.toggle("active", autoplay);
  elAutoplay.title = autoplay
    ? "Autoplay ON — AI is finding similar songs"
    : "Autoplay: AI finds similar songs when queue ends";
  if (autoplay && currentTrack && !autoplayFetching && qIdx >= queue.length - 2) {
    triggerAutoplay();
  }
});

// ── Keyboard shortcuts ────────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space")      { e.preventDefault(); elPlayPause.click(); }
  if (e.code === "ArrowRight") { e.preventDefault(); elNext.click(); }
  if (e.code === "ArrowLeft")  { e.preventDefault(); elPrev.click(); }
  if (e.code === "ArrowUp")    { e.preventDefault(); audio.volume = Math.min(1, audio.volume + 0.05); elVol.value = audio.volume; }
  if (e.code === "ArrowDown")  { e.preventDefault(); audio.volume = Math.max(0, audio.volume - 0.05); elVol.value = audio.volume; }
});

// ── Queue management ──────────────────────────────────────────────────────────
function addToQueue(track, playNow = false) {
  if (!queue.find(t => t.id === track.id)) {
    queue.push(track);
  }
  elQueueCount.textContent = `(${queue.length})`;

  if (playNow || !currentTrack) {
    qIdx = queue.findIndex(t => t.id === track.id);
    loadTrack(track);
  }
  renderQueue();
}

function removeFromQueue(id) {
  const idx = queue.findIndex(t => t.id === id);
  if (idx === -1) return;
  if (qIdx > idx) qIdx--;
  queue.splice(idx, 1);
  elQueueCount.textContent = `(${queue.length})`;
  renderQueue();
}

function renderQueue() {
  elQueueList.innerHTML = "";
  if (!queue.length) {
    elQueueList.innerHTML = `<div id="mp-empty" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:200px;gap:12px;color:var(--sub);text-align:center;padding:40px"><div style="width:52px;height:52px;opacity:.4;margin:0 auto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></div><p style="font-size:14px">Queue is empty.<br>Add songs from search results.</p></div>`;
    return;
  }
  let shownDivider = false;
  queue.forEach((track, i) => {
    if (track._autoplay && !shownDivider) {
      shownDivider = true;
      const div = document.createElement("div");
      div.className = "mp-autoplay-divider";
      div.textContent = "✦ AI Suggestions";
      elQueueList.appendChild(div);
    }
    const el = makeSongEl(track, i === qIdx, true);
    el.addEventListener("click", () => { qIdx = i; loadTrack(track); renderQueue(); });
    elQueueList.appendChild(el);
  });
}

// ── Song element factory ──────────────────────────────────────────────────────
function makeSongEl(track, isActive = false, inQueue = false) {
  const el = document.createElement("div");
  el.className = "mp-song" + (isActive ? " active" : "");
  el.dataset.id = track.id;

  const artEl = track.artwork
    ? `<img class="mp-song-art" src="${track.artwork.replace("600x600bb","60x60bb")}" alt="" loading="lazy">`
    : `<div class="mp-song-art-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;opacity:0.4"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>`;

  el.innerHTML = `
    <div class="mp-eq"><span></span><span></span><span></span></div>
    ${artEl}
    <div class="mp-song-info">
      <div class="mp-song-title">${esc(track.title)}</div>
      <div class="mp-song-artist">${esc(track.artist)}${track.album ? ` · ${esc(track.album)}` : ""}${track._autoplay ? `<span class="mp-autoplay-badge">✦ AI</span>` : ""}</div>
    </div>
    <div class="mp-song-actions">
      ${inQueue
        ? `<button class="mp-queue-btn mp-remove-btn" title="Remove from queue">✕</button>`
        : `<button class="mp-queue-btn mp-add-btn" title="Add to queue">+ Queue</button>`}
    </div>
    <div class="mp-song-dur">${fmt(track.duration)}</div>
  `;

  el.addEventListener("click", (e) => {
    if (e.target.closest(".mp-song-actions")) return;
    if (inQueue) return;
    addToQueue(track, true);
  });

  const addBtn = el.querySelector(".mp-add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToQueue(track, false);
      addBtn.textContent = "✓";
      addBtn.style.color = "var(--green)";
      addBtn.style.borderColor = "var(--green)";
      setTimeout(() => { addBtn.textContent = "+ Queue"; addBtn.style.color = ""; addBtn.style.borderColor = ""; }, 1500);
    });
  }

  const removeBtn = el.querySelector(".mp-remove-btn");
  if (removeBtn) {
    removeBtn.addEventListener("click", (e) => { e.stopPropagation(); removeFromQueue(track.id); });
  }

  return el;
}

function esc(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Search ────────────────────────────────────────────────────────────────────
async function doSearch(q) {
  if (!q.trim()) return;
  elEmpty.style.display        = "none";
  elResultsList.innerHTML      = "";
  elLoading.style.display      = "flex";
  elSearchBtn.disabled         = true;

  let searchError = false;
  try {
    const res  = await fetch(`https://secure.brightpathlearning.website/api/music/search?q=${encodeURIComponent(q)}&limit=24`);
    results    = await res.json();
    const _API = "https://secure.brightpathlearning.website";
    results.forEach(t => { if (t.artwork && t.artwork.startsWith("/")) t.artwork = _API + t.artwork; });
  } catch {
    results = [];
    searchError = true;
  }

  elLoading.style.display  = "none";
  elSearchBtn.disabled     = false;

  if (searchError) {
    elEmpty.innerHTML = `<div class="mp-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><p>Search failed — check your connection and try again.</p>`;
    elEmpty.style.display = "flex";
    return;
  }

  if (!results.length) {
    elEmpty.innerHTML = `<div class="mp-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><p>No results for "<strong>${esc(q)}</strong>".<br>Try a different search.</p>`;
    elEmpty.style.display = "flex";
    return;
  }

  results.forEach(track => {
    const isActive = currentTrack && currentTrack.id === track.id;
    elResultsList.appendChild(makeSongEl(track, isActive));
  });
}

elSearchBtn.addEventListener("click", () => doSearch(elSearch.value));
elSearch.addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(elSearch.value); });

// ── Tabs ──────────────────────────────────────────────────────────────────────
document.querySelectorAll(".mp-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mp-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    document.getElementById("mp-results-panel").style.display = activeTab === "results" ? "" : "none";
    document.getElementById("mp-queue-panel").style.display   = activeTab === "queue"   ? "" : "none";
    if (activeTab === "queue") renderQueue();
  });
});

// ── Initial state ─────────────────────────────────────────────────────────────
const urlQ = new URLSearchParams(location.search).get("q");
if (urlQ) { elSearch.value = urlQ; doSearch(urlQ); }
