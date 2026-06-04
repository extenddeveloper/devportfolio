/* ========================================
   MAIN APPLICATION CONTROLLER
   Shared across all pages
   ======================================== */
'use strict';

const App = {
  init() {
    this.initLoader();
    this.initScrollProgress();
    this.initBackToTop();
    this.initMobileMenu();
    this.initCommandPalette();
    this.setActiveNav();
    if ('ontouchstart' in window) document.body.classList.add('touch-device');
  },

  // ---- Loader ----
  initLoader() {
    const loader = document.getElementById('loader');
    const pct = document.getElementById('loader-percent');
    if (!loader) return;
    let c = 0;
    const iv = setInterval(() => {
      c += Math.random() * 18 + 3;
      if (c >= 100) {
        c = 100; clearInterval(iv);
        setTimeout(() => { loader.classList.add('hidden'); Animations.observeAll(); }, 300);
      }
      if (pct) pct.textContent = Math.floor(c) + '%';
    }, 70);
  },

  // ---- Active Nav ----
  setActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.remove('active');
      const href = l.getAttribute('href');
      if (href === '/' || href === '/index.html' || href === 'index.html') {
        if (path === '/' || path.endsWith('index.html')) l.classList.add('active');
      } else if (path.includes(href.replace('.html','').replace('./','').split('/').pop())) {
        l.classList.add('active');
      }
    });
  },

  // ---- Scroll Progress ----
  initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0';
    }, { passive: true });
  },

  // ---- Back to Top ----
  initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => { btn.classList.toggle('visible', window.scrollY > 400); }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  },

  // ---- Mobile Menu ----
  initMobileMenu() {
    const openBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-close-btn');
    const menu = document.getElementById('mobile-menu');
    if (openBtn) openBtn.addEventListener('click', () => { menu?.classList.add('open'); document.body.style.overflow='hidden'; });
    if (closeBtn) closeBtn.addEventListener('click', () => { menu?.classList.remove('open'); document.body.style.overflow=''; });
  },

  // ---- Command Palette ----
  initCommandPalette() {
    const p = document.getElementById('cmd-palette');
    const inp = document.getElementById('cmd-input');
    const res = document.getElementById('cmd-results');
    if (!p) return;

    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); p.classList.toggle('open'); if (p.classList.contains('open')) setTimeout(() => inp?.focus(), 120); }
      if (e.key === 'Escape') p.classList.remove('open');
    });
    p.addEventListener('click', e => { if (e.target === p) p.classList.remove('open'); });

    res?.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        window.location.href = item.dataset.href;
        p.classList.remove('open');
      });
    });

    inp?.addEventListener('input', () => {
      const q = inp.value.toLowerCase();
      res?.querySelectorAll('.cmd-item').forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
