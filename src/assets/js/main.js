// Language auto-redirect
(function () {
  // Skip if user has already chosen a language manually
  if (sessionStorage.getItem("nain-lang-choice")) return;
  // Only redirect on Japanese pages (not already on /en/)
  if (location.pathname.indexOf("/en/") !== -1) return;
  var lang = navigator.language || navigator.userLanguage || "";
  if (lang.substring(0, 2) !== "ja") {
    // Build the English URL
    var path = location.pathname;
    // Find the base (e.g., /index.html, /about.html, or /)
    var base = path.replace(/\/$/, "/index.html");
    var enPath = base.replace(/\/([^/]*)$/, "/en/$1");
    // For root: / -> /en/
    if (path === "/" || path.endsWith("/index.html")) {
      enPath = path.replace(/\/(?:index\.html)?$/, "/en/");
    }
    location.replace(enPath + location.search + location.hash);
  }
})();

// Record manual language choice when clicking lang-switch
document.addEventListener("click", function (e) {
  if (e.target.closest(".lang-switch")) {
    sessionStorage.setItem("nain-lang-choice", "1");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Hero particles
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const canvas = document.createElement("canvas");
  canvas.className = "hero-particles";
  hero.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let w, h, particles;
  const COUNT = 60;

  function resize() {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.06,
      dy: -Math.random() * 0.04 - 0.01,
      opacity: Math.random() * 0.3 + 0.05,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      p.pulse += 0.003;
      const glow = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 184, 200, ${glow})`;
      ctx.shadowColor = "rgba(240, 184, 200, 0.3)";
      ctx.shadowBlur = p.r * 4;
      ctx.fill();
      ctx.shadowBlur = 0;

      // wrap around
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
    }
    requestAnimationFrame(draw);
  }

  // Pause when hero is not visible
  let running = true;
  const observer = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
  }, { threshold: 0 });
  observer.observe(hero);

  function loop() {
    if (running) draw();
    requestAnimationFrame(loop);
  }

  init();
  loop();
  window.addEventListener("resize", resize);
});
