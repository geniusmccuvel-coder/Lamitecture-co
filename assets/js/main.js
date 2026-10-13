/* Lamitecture & Co | site behaviour. Small, dependency free. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- navigation ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- scroll: parallax + hero device tilt ---------- */
  var ticking = false;

  function update() {
    var y = window.pageYOffset || root.scrollTop || 0;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (!reduce) {
      root.style.setProperty('--sy', y.toFixed(1));
      /* device starts tilted back and settles flat as the visitor scrolls */
      var t = Math.min(1, Math.max(0, y / 380));
      root.style.setProperty('--tilt', (1 - Math.pow(1 - t, 3)).toFixed(3));
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  if (reduce) {
    root.style.setProperty('--tilt', '1');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  /* ---------- portfolio cards: gentle entrance as they come into view ---------- */
  var cards = document.querySelectorAll('.work-card');
  if ('IntersectionObserver' in window && !reduce) {
    cards.forEach(function (c) {
      c.style.opacity = '0';
      c.style.transform = 'translateY(40px) scale(.985)';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var c = en.target;
        c.style.transition = 'opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1), border-color .5s, box-shadow .6s';
        c.style.opacity = '1';
        c.style.transform = '';
        /* hand control of the transform back to the hover styles once settled */
        window.setTimeout(function () {
          c.style.transition = '';
          c.style.opacity = '';
        }, 1000);
        io.unobserve(c);
      });
    }, { threshold: 0.12 });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- copy email ---------- */
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    var label = copyBtn.querySelector('span');
    var original = label ? label.textContent : '';
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      function done() {
        copyBtn.classList.add('done');
        if (label) label.textContent = 'Email address copied';
        window.setTimeout(function () {
          copyBtn.classList.remove('done');
          if (label) label.textContent = original;
        }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () {
          window.location.href = 'mailto:' + email;
        });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  }
})();
