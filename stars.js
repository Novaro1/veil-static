(function () {
  const canvas = document.getElementById("veil-stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0;
  const mouse = { x: 0, y: 0 };
  let t = 0;

  const STAR_COUNT = 220;
  const PALETTE = [
    [185, 180, 255], [205, 200, 255], [165, 205, 255],
    [220, 215, 255], [155, 170, 255], [200, 215, 255],
  ];
  const shooters = [];
  let shooterCooldown = 3200;
  let stars = [];

  function mkStar() {
    const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      z:     Math.random() * 2.0 + 0.2,
      r:     Math.random() * 1.1  + 0.25,
      drift: Math.random() * 0.06  + 0.02,
      op:    Math.random() * 0.60  + 0.20,
      tw:    Math.random() * 2.5   + 0.8,
      ph:    Math.random() * Math.PI * 2,
      col,
    };
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawnShooter() {
    const vx = (Math.random() - 0.35) * 7;
    const vy = Math.random() * 5 + 8;
    shooters.push({
      x: Math.random() * W * 0.8 + W * 0.1,
      y: -10, vx, vy, life: 1,
      tailLen: Math.random() * 120 + 80,
    });
    shooterCooldown = Math.random() * 4000 + 2200;
  }

  function frame() {
    requestAnimationFrame(frame);
    t += 0.016;
    ctx.clearRect(0, 0, W, H);

    const CX = W * 0.5, CY = H * 0.5;
    const mx = (mouse.x - CX) * 0.014;
    const my = (mouse.y - CY) * 0.014;

    shooterCooldown -= 16;
    if (shooterCooldown <= 0) spawnShooter();

    for (const s of stars) {
      s.y += s.drift * s.z;
      if (s.y > H + 4) { s.y = -4; s.x = Math.random() * W; }
      const px = s.x - mx * s.z;
      const py = s.y - my * s.z;
      const tw    = 0.75 + 0.25 * Math.sin(t * s.tw + s.ph);
      const alpha = Math.min(s.op * tw, 1);
      const [r, g, b] = s.col;

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();

      if (s.r > 0.62) {
        const hr = s.r * 4.5;
        const gr = ctx.createRadialGradient(px, py, 0, px, py, hr);
        gr.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.32})`);
        gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(px, py, hr, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();
      }
    }

    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.020;
      if (sh.life <= 0 || sh.y > H + 20) { shooters.splice(i, 1); continue; }
      const spd = Math.sqrt(sh.vx * sh.vx + sh.vy * sh.vy);
      const nx = sh.vx / spd, ny = sh.vy / spd;
      const sg = ctx.createLinearGradient(sh.x - nx * sh.tailLen, sh.y - ny * sh.tailLen, sh.x, sh.y);
      sg.addColorStop(0,    `rgba(200,200,255,0)`);
      sg.addColorStop(0.35, `rgba(210,210,255,${sh.life * 0.28})`);
      sg.addColorStop(1,    `rgba(255,255,255,${sh.life * 0.96})`);
      ctx.beginPath();
      ctx.moveTo(sh.x - nx * sh.tailLen, sh.y - ny * sh.tailLen);
      ctx.lineTo(sh.x, sh.y);
      ctx.strokeStyle = sg; ctx.lineWidth = 1.8; ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sh.x, sh.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${sh.life})`; ctx.fill();
    }
  }

  // Cursor glow
  (function () {
    const el = document.getElementById("cursor-glow");
    if (!el) return;
    let ex = -400, ey = -400, tx = -400, ty = -400;
    window.addEventListener("mousemove", e => {
      tx = e.clientX; ty = e.clientY;
      mouse.x = e.clientX; mouse.y = e.clientY;
    });
    (function tick() {
      ex += (tx - ex) * 0.09;
      ey += (ty - ey) * 0.09;
      el.style.left = ex + "px";
      el.style.top  = ey + "px";
      requestAnimationFrame(tick);
    })();
  })();

  window.addEventListener("resize", () => {
    resize();
    stars = Array.from({ length: STAR_COUNT }, mkStar);
  });

  resize();
  stars = Array.from({ length: STAR_COUNT }, mkStar);
  requestAnimationFrame(frame);
})();
