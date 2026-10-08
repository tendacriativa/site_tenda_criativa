// ===== Video modal (Google Drive embed) =====
const openVideoBtn = document.getElementById('openVideoBtn');
const videoModal = document.getElementById('videoModal');
const videoModalIframe = document.getElementById('videoModalIframe');
const VIDEO_EMBED_URL = 'https://drive.google.com/file/d/1dcNaoZngzgcnqdMnCIZg9AvHmRgHyw3k/preview';

function openVideoModal() {
  if (!videoModal || !videoModalIframe) return;
  videoModalIframe.src = VIDEO_EMBED_URL;
  videoModal.classList.add('open');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeVideoModal() {
  if (!videoModal || !videoModalIframe) return;
  videoModal.classList.remove('open');
  videoModal.setAttribute('aria-hidden', 'true');
  videoModalIframe.src = '';
  document.body.style.overflow = '';
}
openVideoBtn?.addEventListener('click', openVideoModal);
videoModal?.querySelectorAll('[data-close-video]').forEach(el => el.addEventListener('click', closeVideoModal));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal?.classList.contains('open')) closeVideoModal();
});

// ===== Mobile menu =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
  if (nav.classList.contains('open')) {
    nav.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:calc(100% + 10px);left:0;right:0;background:#fffefb;border-radius:18px;padding:16px 22px;box-shadow:0 20px 40px -12px rgba(36,16,51,.25);gap:4px;';
  } else {
    nav.removeAttribute('style');
  }
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ===== Counter animation for stats =====
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const text = el.textContent;
    const prefix = text.match(/^[^\d]*/)[0];
    const suffix = text.replace(/^[^\d]*\d+/, '');
    let cur = 0;
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      cur = Math.round(target * eased);
      el.textContent = `${prefix}${cur}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterIO.observe(c));

// ===== Subtle tilt (barely-there depth, not a game effect) =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  const inner = card.querySelector('.hero-card') || card;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-y * 2.5).toFixed(2);
    const rotateY = (x * 2.5).toFixed(2);
    inner.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transform = '';
  });
});

// ===== Header shrink on scroll =====
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) header.style.boxShadow = '0 8px 24px rgba(60,20,110,.12)';
    else header.style.boxShadow = 'none';
  });
}


// ===== Course filter tabs (TendaClass) =====
const filterBtns = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    courseCards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

const courseSearch = document.querySelector('.search-mini input');
courseSearch?.addEventListener('input', (e) => {
  const term = e.target.value.trim().toLowerCase();
  filterBtns.forEach(b => b.classList.remove('active'));
  courseCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(term) ? '' : 'none';
  });
});

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ===== CTA floating particles (dynamic 3D dots) =====
const ctaScenes = document.querySelectorAll('.cta-3d');
if (ctaScenes.length) {
  ctaScenes.forEach(ctaScene => {
    const particleCount = 22;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:rgba(255,255,255,${(Math.random() * 0.4 + 0.15).toFixed(2)});
        top:${Math.random() * 100}%;
        left:${Math.random() * 100}%;
        filter:blur(${Math.random() > 0.6 ? 1 : 0}px);
        animation: drift${i % 3} ${8 + Math.random() * 10}s ease-in-out infinite;
        animation-delay:${Math.random() * 5}s;
      `;
      ctaScene.appendChild(p);
    }
  });
  const style = document.createElement('style');
  style.textContent = `
    @keyframes drift0{0%,100%{transform:translate(0,0);}50%{transform:translate(30px,-40px);}}
    @keyframes drift1{0%,100%{transform:translate(0,0);}50%{transform:translate(-40px,30px);}}
    @keyframes drift2{0%,100%{transform:translate(0,0);}50%{transform:translate(20px,40px);}}
  `;
  document.head.appendChild(style);
}
