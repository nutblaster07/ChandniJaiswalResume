document.addEventListener('DOMContentLoaded', () => {

  /* ── Footer year ─────────────────────────────────────── */
  const fyear = document.getElementById('fyear');
  if (fyear) fyear.textContent = `© ${new Date().getFullYear()}`;

  /* ── Navbar ─────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  /* ✅ FIX: define BEFORE using */
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

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    setActiveLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Hamburger Menu ─────────────────────────────────── */
  const toggle  = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');

  function handleToggle(e) {
    e.preventDefault();
    const isOpen = navMenu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);

    const spans = toggle.querySelectorAll('span');

    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    }
  }

  /* ✅ IMPORTANT: only click (no touchend) */
  toggle.addEventListener('click', handleToggle);

  /* Close menu on link click */
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);

      toggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });

  /* Close on ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navMenu.classList.remove('open');
    }
  });

  /* ── Scroll Reveal ───────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  fadeEls.forEach(el => revealObs.observe(el));

  setTimeout(() => {
    fadeEls.forEach(el => el.classList.add('visible'));
  }, 800);

  /* ── Counter Animation ─────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-n[data-target]');

  function runCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const duration = 1600;
    const start = performance.now();
    el.textContent = '0';

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };

    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.05 });

  statNums.forEach(el => counterObs.observe(el));

});
/* ── Resume Download ───────────────────── */
const downloadBtn = document.getElementById('downloadResume');

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {

    const link = document.createElement('a');
    link.href = 'resume.pdf';   // 🔥 file must be in same folder
    link.download = 'Chandni_Jaiswal_Resume.pdf';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    /* Optional feedback */
    downloadBtn.innerHTML = '<i class="ph ph-check"></i> Downloaded';
    
    setTimeout(() => {
      downloadBtn.innerHTML = '<i class="ph ph-download-simple"></i> Download';
    }, 2000);
  });
}