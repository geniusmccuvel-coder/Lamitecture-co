// header scroll state
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', ()=>{
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  // mobile menu
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', ()=>{
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    burger.classList.remove('open'); mobileMenu.classList.remove('open');
  }));

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold:0.15 });
  revealEls.forEach(el=>io.observe(el));

  // contact form -> mailto fallback (static site, no backend)
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const subject = encodeURIComponent('New project enquiry from ' + name);
    const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:info@lamitecture.co.za?subject=' + subject + '&body=' + body;
  });

  document.getElementById('year').textContent = new Date().getFullYear();