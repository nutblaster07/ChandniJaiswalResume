/**
 * Chandni Jaiswal — Digital Resume
 * script.js  |  Scroll reveal, navbar, counter animations
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Activate animation classes only when JS runs ─────── */
  // Animation classes no longer need js-loaded gate

  /* ── Footer year ─────────────────────────────────────── */
  const fyear = document.getElementById('fyear');
  if (fyear) fyear.textContent = `© ${new Date().getFullYear()}`;

  /* ── Navbar scroll glass effect ──────────────────────── */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    setActiveLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger toggle ──────────────────────────── */
  const toggle  = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');

  function handleToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    const spans = toggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  toggle.addEventListener('click', handleToggle);
  toggle.addEventListener('touchend', handleToggle, { passive: false });

  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navMenu.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    }
  });

  /* ── Active nav link on scroll ───────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  /* ── Scroll reveal ────────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');

  // Mark ALL elements visible immediately — CSS transition handles the animation
  // Elements above fold show instantly; below fold show when scrolled to
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

  fadeEls.forEach(el => revealObs.observe(el));

  // Fallback: if IntersectionObserver never fires (some iframes), show everything after 800ms
  setTimeout(() => {
    fadeEls.forEach(el => el.classList.add('visible'));
  }, 800);

  /* ── Counter animation for stat numbers ──────────────── */
  const statNums = document.querySelectorAll('.stat-n[data-target]');

  function runCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const duration = 1600;
    const start = performance.now();
    el.textContent = '0';

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  }

  // Use IntersectionObserver with very low threshold
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });

  statNums.forEach(el => counterObs.observe(el));

  // Hard fallback: if observer never fires, run all counters after 1.5s
  setTimeout(() => {
    statNums.forEach(el => {
      if (el.textContent === '0' || el.textContent === '') runCounter(el);
    });
  }, 1500);

  // Stagger handled by CSS delay classes

  /* ── Tilt effect on project cards (desktop only) ─────── */
  if (window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches) {
    document.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── Copy email on click ─────────────────────────────── */
  document.querySelectorAll('.contact-tile').forEach(tile => {
    const val = tile.querySelector('.ct-val');
    if (!val || !val.textContent.includes('@')) return;

    tile.addEventListener('click', async e => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(val.textContent.trim());
        const orig = val.textContent;
        val.textContent = 'Copied ✓';
        tile.style.borderColor = 'var(--emerald)';
        setTimeout(() => {
          val.textContent = orig;
          tile.style.borderColor = '';
        }, 1800);
      } catch {
        window.location.href = `mailto:${val.textContent.trim()}`;
      }
    });
  });

  /* ── Geometric rings: subtle parallax on mouse ───────── */
  if (window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches) {
    const rings = document.querySelectorAll('.geo-ring');
    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      rings.forEach((r, i) => {
        const f = (i + 1) * 8;
        r.style.transform = `rotate(${Date.now() / (30000 - i * 8000) * 360}deg) translate(${dx * f}px, ${dy * f}px)`;
      });
    }, { passive: true });
  }

});