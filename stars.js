const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function init() {
  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.3,
    o: Math.random() * 0.5 + 0.2,
    speed: Math.random() * 0.3 + 0.05,
    dir: Math.random() > 0.5 ? 1 : -1,
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.o += s.speed * 0.01 * s.dir;
    if (s.o > 0.7 || s.o < 0.1) s.dir *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,170,255,${s.o})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

resize();
init();
draw();
window.addEventListener("resize", () => { resize(); init(); });
