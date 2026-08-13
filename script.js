const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
function updateTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
}
updateTheme();
if (themeMediaQuery.addEventListener) {
  themeMediaQuery.addEventListener('change', updateTheme);
} else if (themeMediaQuery.addListener) {
  themeMediaQuery.addListener(updateTheme);
}

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('menu-icon');

  // --- Scroll: navbar state + pause heavy animations while scrolling ---
  let ticking = false;
  let scrollEndTimer = null;
  const root = document.documentElement;

  function updateScrollState() {
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    }

    root.classList.add('is-scrolling');
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      root.classList.remove('is-scrolling');
    }, 120);

    ticking = false;
  }

  updateScrollState();

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  // --- Intersection Observer for Fade-in Animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -5% 0px',
    threshold: 0.08
  });

  document.querySelectorAll('.fade-in-section').forEach((el) => observer.observe(el));

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });

  // --- Mobile Menu ---
  if (menuBtn && menu && icon) {
    function openMenu() {
      menu.classList.add('open');
      icon.textContent = '✕';
    }

    function closeMenu() {
      menu.classList.remove('open');
      icon.textContent = '☰';
    }

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    });
  }
});
