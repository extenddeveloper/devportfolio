/* ========================================
   HIGH-CRAFT INTERACTION ENGINE (UNSLOPPED)
   Number counters, card spotlights, fluid sliders & reveals
   ======================================== */
'use strict';

const Animations = {
  observer: null,

  init() {
    this.observeAll();
    this.initStatCounters();
    this.initCardSpotlight();
    this.initFilterButtons();
    this.initTabButtons();
    this.initFormAnimations();
    this.initTestimonialsSlider();
    this.initGitHubGraph();
    this.initGsapSuite();
  },

  // ---- Scroll Reveal Observer ----
  observeAll() {
    if (this.observer) this.observer.disconnect();
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          this.observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('[data-animate]:not(.in-view)').forEach(el => this.observer.observe(el));
  },

  // ---- Animated Stats Counter ----
  initStatCounters() {
    const stats = document.querySelectorAll('.hero-stat-value, .stat-value, .case-metric-value');
    if (!stats.length) return;

    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const originalText = el.dataset.count || el.textContent.trim();
          const targetNum = parseFloat(originalText);
          const suffix = originalText.replace(/[\d.]/g, '');

          if (!isNaN(targetNum)) {
            const duration = 1400; // ms
            const start = performance.now();
            const isFloat = originalText.includes('.');

            const frame = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              // Smooth quintic out curve
              const ease = 1 - Math.pow(1 - progress, 4);
              const currentVal = (ease * targetNum).toFixed(isFloat ? 1 : 0);
              el.textContent = currentVal + suffix;

              if (progress < 1) {
                requestAnimationFrame(frame);
              } else {
                el.textContent = originalText;
              }
            };
            requestAnimationFrame(frame);
          }
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    stats.forEach(s => countObserver.observe(s));
  },

  // ---- Subtle Mouse Spotlight (Linear / Vercel style) ----
  initCardSpotlight() {
    if ('ontouchstart' in window) return;
    const cards = document.querySelectorAll('.project-card, .service-card, .about-highlight, .tech-item, .workflow-step, .blog-card');
    cards.forEach(card => {
      card.classList.add('spotlight-card');
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
  },

  // ---- Filter Buttons ----
  initFilterButtons() {
    document.querySelectorAll('.filter-group').forEach(g => {
      g.querySelectorAll('.filter-btn').forEach(b => {
        b.addEventListener('click', function() {
          g.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
          this.classList.add('active');
          const filter = this.textContent.trim().toLowerCase();
          
          const grid = document.querySelector('.blog-grid, .projects-grid');
          if (grid) {
            const cards = grid.querySelectorAll('.blog-card-v2, .project-card-v2, .blog-card, .project-card');
            cards.forEach(card => {
              const cat = (card.getAttribute('data-category') || card.textContent || '').toLowerCase();
              if (filter === 'all' || cat.includes(filter)) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              } else {
                card.style.display = 'none';
              }
            });
          }
        });
      });
    });
  },

  // ---- Tab Buttons ----
  initTabButtons() {
    document.querySelectorAll('.tabs-group').forEach(g => {
      const tabs = g.querySelectorAll('.tab-btn');
      tabs.forEach(b => {
        b.addEventListener('click', function() {
          tabs.forEach(x => x.classList.remove('active'));
          this.classList.add('active');
          const targetCategory = this.textContent.trim().toLowerCase();
          
          document.querySelectorAll('.tech-category').forEach(cat => {
            const title = cat.querySelector('.tech-category-title')?.textContent.trim().toLowerCase();
            if (targetCategory === 'all' || title.includes(targetCategory)) {
              cat.style.display = 'block';
            } else {
              cat.style.display = 'none';
            }
          });
        });
      });
    });
  },

  // ---- Form Input Focus Animations ----
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
    const gap = 20;

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
      
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    if (dotsWrap && dotsWrap.children.length === 0) {
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

    // Auto-advance with hover pause
    let autoSlide = setInterval(() => {
      current = current >= getMaxSlide() ? 0 : current + 1;
      updateSlider();
    }, 6000);

    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.parentElement.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        current = current >= getMaxSlide() ? 0 : current + 1;
        updateSlider();
      }, 6000);
    });
  },

  
  // ---- GSAP 3 + ScrollTrigger Suite ($10k Agency Tier) ----
  initGsapSuite() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Hero Stagger Entrance
    const heroElements = document.querySelectorAll('.hero .badge, .hero-title, .hero-desc, .hero-actions, .hero-stats');
    if (heroElements.length) {
      gsap.from(heroElements, {
        opacity: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }

    // 2. Section Header Batch Reveals
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.section-header, .case-metrics, .availability-card').forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 24,
          duration: 0.75,
          ease: 'power2.out'
        });
      });
    }

    // 3. 3D Card Tilt Parallax (Linear / Stripe Standard)
    if (!('ontouchstart' in window)) {
      const tiltCards = document.querySelectorAll('.project-card-v2, .service-card-v2, .testimonial-card');
      tiltCards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.perspective = '1000px';

        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const tiltX = ((y - centerY) / centerY) * -5;
          const tiltY = ((x - centerX) / centerX) * 5;

          gsap.to(card, {
            rotateX: tiltX,
            rotateY: tiltY,
            scale: 1.015,
            duration: 0.35,
            ease: 'power2.out',
            transformPerspective: 1000
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          });
        });
      });
    }

    // 4. Magnetic Buttons (Subtle Cursor Attraction)
    if (!('ontouchstart' in window)) {
      const magneticBtns = document.querySelectorAll('.btn-primary, .nav-cta');
      magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
          const rect = btn.getBoundingClientRect();
          const x = (e.clientX - rect.left) - (rect.width / 2);
          const y = (e.clientY - rect.top) - (rect.height / 2);

          gsap.to(btn, {
            x: x * 0.28,
            y: y * 0.28,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.4)'
          });
        });
      });
    }
  },

  // ---- GitHub Contribution Heatmap ----
  initGitHubGraph() {
    const c = document.getElementById('github-graph');
    if (!c || c.children.length > 0) return;
    for (let i = 0; i < 364; i++) {
      const d = document.createElement('div');
      d.className = 'gh-cell';
      const r = Math.random();
      if (r > 0.65) d.classList.add('l1');
      if (r > 0.8) d.classList.add('l2');
      if (r > 0.9) d.classList.add('l3');
      if (r > 0.96) d.classList.add('l4');
      c.appendChild(d);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Animations.init());
