/* landing.js – cinematic scroll + star canvas animations */
'use strict';

/* ── NAV scroll state ─────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Reveal on scroll ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

/* ── Star field canvas (hero) ─────────────────────────────── */
(function initStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], dpr = window.devicePixelRatio || 1;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.min(Math.floor(W * H / 2200), 520);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1.15 + 0.2,
        a:     Math.random(),
        speed: Math.random() * 0.0004 + 0.0001,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  let raf, t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* deep-space radial gradient */
    const grad = ctx.createRadialGradient(W / 2, H * 0.38, 0, W / 2, H * 0.38, H * 0.72);
    grad.addColorStop(0,   'rgba(20, 30, 70,  0.55)');
    grad.addColorStop(0.6, 'rgba(5,  8, 20,  0.80)');
    grad.addColorStop(1,   'rgba(3,  4, 10,  1.00)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* nebula smears */
    const n1 = ctx.createRadialGradient(W * 0.28, H * 0.35, 0, W * 0.28, H * 0.35, W * 0.38);
    n1.addColorStop(0,   'rgba(74, 124, 255, 0.10)');
    n1.addColorStop(1,   'transparent');
    ctx.fillStyle = n1;
    ctx.fillRect(0, 0, W, H);

    const n2 = ctx.createRadialGradient(W * 0.72, H * 0.6, 0, W * 0.72, H * 0.6, W * 0.3);
    n2.addColorStop(0,   'rgba(167, 139, 250, 0.08)');
    n2.addColorStop(1,   'transparent');
    ctx.fillStyle = n2;
    ctx.fillRect(0, 0, W, H);

    /* stars */
    t += 0.016;
    stars.forEach((s) => {
      const alpha = s.a * (0.55 + 0.45 * Math.sin(t * s.speed * 400 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 230, 255, ${alpha})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  }, { passive: true });
})();

/* ── CTA mini star canvas ─────────────────────────────────── */
(function initCtaCanvas() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [], dpr = window.devicePixelRatio || 1;

  function resize() {
    W = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
    H = canvas.offsetHeight || canvas.parentElement.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    pts = [];
    const n = Math.min(Math.floor(W * H / 3200), 260);
    for (let i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.0 + 0.15,
        a: Math.random() * 0.7 + 0.15,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * 0.0003 + 0.0001,
      });
    }
  }

  let raf2, t2 = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.65);
    g.addColorStop(0,   'rgba(10, 18, 50, 0.92)');
    g.addColorStop(1,   'rgba(3,  4, 10,  1.00)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    t2 += 0.016;
    pts.forEach((p) => {
      const a = p.a * (0.5 + 0.5 * Math.sin(t2 * p.s * 400 + p.p));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${a})`;
      ctx.fill();
    });

    raf2 = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf2);
    resize();
    draw();
  }, { passive: true });
})();

/* ── Subtle hero parallax ─────────────────────────────────── */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  let lastY = 0, ticking = false;

  function update() {
    const ratio = Math.min(lastY / window.innerHeight, 1);
    heroContent.style.transform = `translateY(${ratio * 40}px)`;
    heroContent.style.opacity   = `${Math.max(0, 1 - ratio * 1.2)}`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();
