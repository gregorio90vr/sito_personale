/* ===== LANGUAGE SYSTEM ===== */
let currentLang = 'it';

function setLang(lang) {
  currentLang = lang;
  // Update all simple text elements
  document.querySelectorAll('[data-it]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.textContent = val;
  });
  // Update elements with HTML content
  document.querySelectorAll('[data-it-html]').forEach(el => {
    const val = el.getAttribute('data-' + lang + '-html');
    if (val !== null) el.innerHTML = val;
  });
  // Toggle language-specific blocks
  document.querySelectorAll('.lang-it').forEach(el => {
    el.style.display = lang === 'it' ? '' : 'none';
  });
  document.querySelectorAll('.lang-en').forEach(el => {
    el.style.display = lang === 'en' ? '' : 'none';
  });
  // Update toggle buttons
  document.getElementById('btn-it').classList.toggle('active', lang === 'it');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  // Update typing effect language
  updateTypingLang(lang);
  // Update html lang attribute
  document.documentElement.lang = lang;
  // Store preference
  localStorage.setItem('lang', lang);
}

/* ===== TYPING EFFECT ===== */
const roles = {
  it: ['Matematico', 'Risk Manager', 'Sviluppatore App', 'Speaker & Divulgatore', 'Appassionato di AI'],
  en: ['Mathematician', 'Risk Manager', 'App Developer', 'Speaker & Educator', 'AI Enthusiast']
};
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout = null;
let currentRoles = roles.it;

function updateTypingLang(lang) {
  currentRoles = roles[lang];
  typingIndex = 0;
  charIndex = 0;
  isDeleting = false;
  clearTimeout(typingTimeout);
  const el = document.getElementById('typed-text');
  if (el) el.textContent = '';
  typeEffect();
}

function typeEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const current = currentRoles[typingIndex % currentRoles.length];
  if (isDeleting) {
    el.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    el.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typingIndex++;
    delay = 400;
  }
  typingTimeout = setTimeout(typeEffect, delay);
}

/* ===== INTERSECTION OBSERVER (fade-in) ===== */
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ===== ACTIVE NAV ON SCROLL ===== */
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
  }, { threshold: 0.4 });
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

/* ===== NAVBAR SCROLL SHADOW ===== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 20px rgba(0,0,0,0.4)'
      : '';
  }, { passive: true });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'it';

  // Language toggle buttons
  document.getElementById('btn-it').addEventListener('click', () => setLang('it'));
  document.getElementById('btn-en').addEventListener('click', () => setLang('en'));

  // Initialize
  initFadeIn();
  initActiveNav();
  initMobileMenu();
  initNavbarScroll();
  typeEffect();

  // Apply saved language (after typing starts)
  if (savedLang !== 'it') setTimeout(() => setLang(savedLang), 100);
  else {
    document.getElementById('btn-it').classList.add('active');
  }
});
