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
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentPage || currentPage.toLowerCase() === 'apex1080') {
    currentPage = 'index.html';
  }
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

  /* ── Waitlist Form ── */
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = waitlistForm.querySelector('input[type="email"]');
      const submitBtn = waitlistForm.querySelector('button[type="submit"]');
      if (!emailInput?.value) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining…';
      }

      if (!window.ApexDB?.isConfigured()) {
        alert('Waitlist is not connected yet. Email ceo@apex1080.com to join.');
        return;
      }

      const result = await window.ApexDB.addWaitlistEmail(emailInput.value);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join Waitlist';
      }

      if (result && !result.ok) {
        alert('Could not join waitlist. Please try again or email ceo@apex1080.com');
        return;
      }

      waitlistForm.style.display = 'none';
      const success = document.getElementById('waitlist-success');
      if (success) {
        success.textContent = result?.duplicate
          ? "You're already on the list. We'll be in touch when Heimdall is ready to ship."
          : "You're on the list. We'll be in touch when Heimdall is ready to ship.";
        success.classList.add('show');
      }
    });
  }

  /* ── Contact Form ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const data = {
        name: contactForm.querySelector('#name')?.value || '',
        email: contactForm.querySelector('#email')?.value || '',
        subject: contactForm.querySelector('#subject')?.value || '',
        message: contactForm.querySelector('#message')?.value || ''
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      if (!window.ApexDB?.isConfigured()) {
        alert('Contact form is not connected yet. Email ceo@apex1080.com directly.');
        return;
      }

      const result = await window.ApexDB.addContactSubmission(data);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }

      if (result && !result.ok) {
        alert('Could not send message. Please email ceo@apex1080.com directly.');
        return;
      }

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

})();
