/* Apex 1080 — Shared JavaScript */

(function () {
  'use strict';

  /* ── Mobile Navigation ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.querySelector('.menu-overlay');

  function closeMenu() {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('open');
    menuOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    hamburger?.classList.add('active');
    mobileMenu?.classList.add('open');
    menuOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  hamburger?.addEventListener('click', () => {
    if (mobileMenu?.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuOverlay?.addEventListener('click', closeMenu);

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ── Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Intersection Observer Fade-Up ── */
  const fadeElements = document.querySelectorAll('.fade-up');
  if (fadeElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeElements.forEach(el => observer.observe(el));
  }

  /* ── Page Transitions ── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const isInternal =
      !href.startsWith('http') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !href.startsWith('#') &&
      !href.startsWith('javascript:') &&
      !link.hasAttribute('target') &&
      !href.includes('#');

    if (isInternal) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    }
  });

  /* ── Waitlist Form ── */
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = waitlistForm.querySelector('input[type="email"]');
      if (!email?.value) return;

      /* TODO: Insert Mailchimp/ConvertKit endpoint here
         Example:
         fetch('https://YOUR-PROVIDER-ENDPOINT', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email: email.value })
         });
      */

      waitlistForm.style.display = 'none';
      const success = document.getElementById('waitlist-success');
      if (success) success.classList.add('show');
    });
  }

  /* ── Contact Form ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      /* TODO: Connect to Formspree or Netlify Forms for free form handling
         Example (Formspree):
         fetch('https://formspree.io/f/YOUR-FORM-ID', {
           method: 'POST',
           body: new FormData(contactForm),
           headers: { 'Accept': 'application/json' }
         });
      */

      contactForm.style.display = 'none';
      const success = document.getElementById('contact-success');
      if (success) success.classList.add('show');
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Carousel mobile stack class ── */
  function handleCarouselResponsive() {
    document.querySelectorAll('.carousel').forEach(carousel => {
      if (window.innerWidth <= 768) {
        carousel.classList.add('carousel-mobile-stack');
      } else {
        carousel.classList.remove('carousel-mobile-stack');
      }
    });
  }

  handleCarouselResponsive();
  window.addEventListener('resize', handleCarouselResponsive);

  /* ── Analytics placeholder ── */
  /* TODO: Insert Google Analytics or Plausible tracking code here */

})();
