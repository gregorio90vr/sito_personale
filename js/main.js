/* ===== LANGUAGE SYSTEM ===== */
let currentLang = 'it';
 
function setLang(lang) {
  currentLang = lang;
  // Simple text swaps
  document.querySelectorAll('[data-it]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.textContent = val;
  });
  // Language-specific blocks
  document.querySelectorAll('.lang-it').forEach(el => { el.style.display = lang === 'it' ? '' : 'none'; });
  document.querySelectorAll('.lang-en').forEach(el => { el.style.display = lang === 'en' ? '' : 'none'; });
  // Toggle buttons
  document.getElementById('btn-it').classList.toggle('active', lang === 'it');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  // Publications toggle label (respect expanded state)
  updatePubToggleLabel();
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
}

/* ===== PUBLICATIONS TOGGLE ===== */
function updatePubToggleLabel() {
  const btn = document.getElementById('pub-toggle');
  if (!btn) return;
  const hidden = document.getElementById('pub-hidden');
  const expanded = hidden.classList.contains('show');
  const key = expanded ? 'data-hide-' : 'data-show-';
  btn.textContent = btn.getAttribute(key + currentLang);
}

function initPubToggle() {
  const btn = document.getElementById('pub-toggle');
  const hidden = document.getElementById('pub-hidden');
  if (!btn || !hidden) return;
  btn.addEventListener('click', () => {
    hidden.classList.toggle('show');
    updatePubToggleLabel();
    // Reveal hidden fade-in items immediately
    hidden.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  });
  updatePubToggleLabel();
}

/* ===== FADE IN ON SCROLL ===== */
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ===== ACTIVE NAV ===== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ===== SMOOTH SCROLL (centrato) ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = 66;
      const breathing = window.innerHeight * 0.08;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - breathing;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      // chiudi menu mobile se aperto
      document.getElementById('nav-links')?.classList.remove('open');
    });
  });
}

/* ===== NAVBAR SHADOW ===== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.4)' : '';
  }, { passive: true });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'it';

  document.getElementById('btn-it').addEventListener('click', () => setLang('it'));
  document.getElementById('btn-en').addEventListener('click', () => setLang('en'));

  initFadeIn();
  initActiveNav();
  initMobileMenu();
  initNavbarScroll();
  initPubToggle();
  initSmoothScroll();

  if (savedLang !== 'it') setLang(savedLang);
});
