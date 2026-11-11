/* Lamitecture & Co | site behaviour
   Footer year, navigation that hides on the way down, bottom dock,
   scroll reveals and image fade in. Motion is skipped when reduced motion is on. */
(function () {
  'use strict';
  window.lamiReady = true;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* navigation: hide while scrolling down, show again on the way up */
  var nav = document.getElementById('nav');
  var lastY = window.pageYOffset;
  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset;
    if (nav) {
      nav.classList.toggle('scrolled', y > 24);
      if (!reduce) {
        if (y > lastY && y > 160) nav.classList.add('is-hidden');
        else if (y < lastY - 4) nav.classList.remove('is-hidden');
      }
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  if (nav) nav.addEventListener('focusin', function () { nav.classList.remove('is-hidden'); });

  /* scroll reveals: each element appears once as it comes into view */
  var items = document.querySelectorAll('.reveal, .reveal-card');
  var cards = document.querySelectorAll('.reveal-card');
  cards.forEach(function (c, i) { c.style.setProperty('--stagger', (i * 180) + 'ms'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* portfolio screenshots fade in sharp once loaded */
  document.querySelectorAll('.project img.shot').forEach(function (img) {
    function done() { img.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth) done();
    else { img.addEventListener('load', done); img.addEventListener('error', done); }
  });

  /* phones: dots under the projects follow the swipe */
  var rail = document.querySelector('.work-rail');
  var dots = document.querySelectorAll('.rail-dots span');
  if (rail && dots.length) {
    var railTick = false;
    rail.addEventListener('scroll', function () {
      if (railTick) return;
      railTick = true;
      window.requestAnimationFrame(function () {
        var card = rail.querySelector('.project');
        var step = card ? card.getBoundingClientRect().width : rail.clientWidth;
        var max = rail.scrollWidth - rail.clientWidth;
        var i = rail.scrollLeft >= max - 4 ? dots.length - 1 : Math.round(rail.scrollLeft / step);
        dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
        railTick = false;
      });
    }, { passive: true });
  }

  /* bottom dock: highlight the section on screen */
  var dock = document.querySelector('.dock');
  if (dock && 'IntersectionObserver' in window) {
    var links = dock.querySelectorAll('a[data-sec]');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('data-sec')] = a; });
    var secs = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (secs.length) {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
          var a = map[e.target.id];
          if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach(function (s) { dio.observe(s); });
    }
  }
})();
