/* ========================================
   ANIMATION ENGINE
   Framer Motion-style effects, shared
   ======================================== */
'use strict';

const Animations = {
  observer: null,
  mouse: { x: 0, y: 0 },
  cursorPos: { x: 0, y: 0 },

  init() {
    this.initCursor();
    this.initMouseGlow();
    this.observeAll();
    this.initTiltCards();
    this.initMagneticButtons();
    this.initParallaxBlobs();
    this.initFilterButtons();
    this.initTabButtons();
    this.initFormAnimations();
    this.initTestimonialsSlider();
    this.initGitHubGraph();
    this.initEasterEgg();
    this.startCursorRAF();
  },

  // ---- Scroll Reveal Observer ----
  observeAll() {
    if (this.observer) this.observer.disconnect();
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); this.observer.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-animate]:not(.in-view)').forEach(el => this.observer.observe(el));
  },

  // ---- Custom Cursor ----
  initCursor() {
    if ('ontouchstart' in window) return;
    const ring = document.getElementById('cursor-ring');
    const dot = document.getElementById('cursor-dot');
    if (!ring || !dot) return;
    document.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX; this.mouse.y = e.clientY;
      dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
    }, { passive: true });
    const hov = 'a,button,[data-hover],.project-card,.service-card,.skill-card,.tech-item,.blog-card,.filter-btn,.tab-btn,.social-link,.cmd-item,.booking-slot,.testimonial-card,.slider-btn';
    document.addEventListener('mouseover', e => { if (e.target.closest(hov)) ring.classList.add('hovering'); });
    document.addEventListener('mouseout', e => { if (e.target.closest(hov)) ring.classList.remove('hovering'); });
  },

  initMouseGlow() {
    if ('ontouchstart' in window) return;
    const g = document.getElementById('mouse-glow');
    if (!g) return;
    document.addEventListener('mousemove', e => { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }, { passive: true });
  },

  startCursorRAF() {
    if ('ontouchstart' in window) return;
    const ring = document.getElementById('cursor-ring');
    if (!ring) return;
    const loop = () => {
      this.cursorPos.x += (this.mouse.x - this.cursorPos.x) * 0.14;
      this.cursorPos.y += (this.mouse.y - this.cursorPos.y) * 0.14;
      ring.style.left = this.cursorPos.x + 'px'; ring.style.top = this.cursorPos.y + 'px';
      requestAnimationFrame(loop);
    };
    loop();
  },

  // ---- 3D Tilt ----
  initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height/2) / (r.height/2)) * 5;
        const ry = ((r.width/2 - (e.clientX - r.left)) / (r.width/2)) * 5;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  },

  // ---- Magnetic Buttons ----
  initMagneticButtons() {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width/2) * .18}px, ${(e.clientY - r.top - r.height/2) * .18}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  },

  // ---- Parallax Blobs ----
  initParallaxBlobs() {
    const b1 = document.querySelector('.blob-1'), b2 = document.querySelector('.blob-2');
    if (!b1 || !b2) return;
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      b1.style.transform = `translate(${-s*.015}px,${s*.025}px)`;
      b2.style.transform = `translate(${s*.02}px,${-s*.015}px)`;
    }, { passive: true });
  },

  // ---- Filter Buttons ----
  initFilterButtons() {
    document.querySelectorAll('.filter-group').forEach(g => {
      g.querySelectorAll('.filter-btn').forEach(b => {
        b.addEventListener('click', function() {
          g.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
          this.classList.add('active');
        });
      });
    });
  },

  // ---- Tab Buttons ----
  initTabButtons() {
    document.querySelectorAll('.tabs-group').forEach(g => {
      g.querySelectorAll('.tab-btn').forEach(b => {
        b.addEventListener('click', function() {
          g.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
          this.classList.add('active');
        });
      });
    });
  },

  // ---- Form Focus Animations ----
  initFormAnimations() {
    document.querySelectorAll('.form-input').forEach(inp => {
      inp.addEventListener('focus', function() { this.closest('.form-group')?.classList.add('focused'); });
      inp.addEventListener('blur', function() { this.closest('.form-group')?.classList.remove('focused'); });
    });
  },

  // ---- Testimonials Slider ----
  initTestimonialsSlider() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsWrap = document.getElementById('slider-dots');
    
    let current = 0;
    let perView = 3;
    const gap = 22;

    function getPerView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxSlide() {
      return Math.max(0, cards.length - perView);
    }

    function updateSlider() {
      perView = getPerView();
      if (current > getMaxSlide()) current = getMaxSlide();
      const cardWidth = track.parentElement.offsetWidth / perView - gap * (perView - 1) / perView;
      const offset = current * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      
      // Update dots
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    // Create dots
    if (dotsWrap) {
      for (let i = 0; i <= getMaxSlide(); i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => { current = i; updateSlider(); });
        dotsWrap.appendChild(dot);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) { current--; updateSlider(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (current < getMaxSlide()) { current++; updateSlider(); } });
    
    window.addEventListener('resize', updateSlider);
    updateSlider();

    // Auto-slide
    let autoSlide = setInterval(() => {
      current = current >= getMaxSlide() ? 0 : current + 1;
      updateSlider();
    }, 5000);

    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.parentElement.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        current = current >= getMaxSlide() ? 0 : current + 1;
        updateSlider();
      }, 5000);
    });
  },

  // ---- GitHub Graph ----
  initGitHubGraph() {
    const c = document.getElementById('github-graph');
    if (!c || c.children.length > 0) return;
    for (let i = 0; i < 364; i++) {
      const d = document.createElement('div');
      d.className = 'gh-cell';
      const r = Math.random();
      if (r > .65) d.classList.add('l1');
      if (r > .78) d.classList.add('l2');
      if (r > .87) d.classList.add('l3');
      if (r > .94) d.classList.add('l4');
      c.appendChild(d);
    }
  },

  // ---- Konami Easter Egg ----
  initEasterEgg() {
    let s = [];
    const k = [38,38,40,40,37,39,37,39,66,65];
    document.addEventListener('keydown', e => {
      s.push(e.keyCode); if (s.length > 10) s.shift();
      if (s.join() === k.join()) { document.body.style.filter = 'hue-rotate(90deg)'; setTimeout(() => document.body.style.filter = '', 3000); }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Animations.init());
