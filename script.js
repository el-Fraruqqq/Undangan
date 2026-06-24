/* ========================================================
   UNDANGAN PERNIKAHAN – script.js
======================================================== */
'use strict';

// ============================================================
// OPENING
// ============================================================
function openInvitation() {
  const opening  = document.getElementById('opening-screen');
  const main     = document.getElementById('main-content');
  const musicBtn = document.getElementById('music-btn');

  opening.classList.add('hide');

  setTimeout(() => {
    opening.style.display = 'none';
    main.classList.remove('hidden');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        main.classList.add('visible');
        musicBtn.style.display = 'flex';
      });
    });

    initNavbar();
    initCountdown();
    initScrollReveal();
    initSmoothScroll();
    spawnPetals();
  }, 800);
}

// ============================================================
// MUSIC
// ============================================================
let musicPlaying = false;

function toggleMusic() {
  const audio     = document.getElementById('background-music');
  const iconPlay  = document.getElementById('music-icon-play');
  const iconPause = document.getElementById('music-icon-pause');

  if (musicPlaying) {
    audio.pause();
    iconPlay.style.display  = 'block';
    iconPause.style.display = 'none';
    musicPlaying = false;
  } else {
    audio.play().then(() => {
      iconPlay.style.display  = 'none';
      iconPause.style.display = 'block';
      musicPlaying = true;
    }).catch(() => {});
  }
}

// ============================================================
// NAVBAR
// ============================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

function toggleNav() {
  document.querySelector('.nav-links').classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('open');
    });
  });
});

// ============================================================
// COUNTDOWN – TARGET: 05 Juli 2026, 11:00 WIB (UTC+7)
// ============================================================
function initCountdown() {
  // UTC+7 → subtract 7hrs from local: set as UTC time 04:00 on July 5
  const weddingDate = new Date('2026-07-05T04:00:00Z').getTime();

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  function updateCountdown() {
    const diff = weddingDate - Date.now();

    if (diff <= 0) {
      cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = '00';
      return;
    }

    const pad = n => String(n).padStart(2, '0');
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    cdSecs.classList.remove('tick');
    void cdSecs.offsetWidth;
    cdSecs.classList.add('tick');

    cdDays.textContent  = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent  = pad(mins);
    cdSecs.textContent  = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      const navH = document.getElementById('navbar').offsetHeight;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
}

// ============================================================
// PETALS
// ============================================================
function spawnPetals() {
  const colors = ['#C8A040','#D4A574','#8B6914','#E8C4A0','#B87333','#DAA520'];
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    const size = 6 + Math.random() * 10;
    const dur  = 8 + Math.random() * 14;
    const del  = (i / 18) * dur + Math.random() * 4;
    petal.style.cssText = `width:${size}px;height:${size*.6}px;left:${Math.random()*100}vw;top:-${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${dur}s;animation-delay:${del}s;`;
    document.body.appendChild(petal);
    petal.addEventListener('animationiteration', () => {
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.animationDuration = (8 + Math.random() * 14) + 's';
    });
  }
}

// ============================================================
// RSVP
// ============================================================
function submitRSVP() {
  const nameEl   = document.getElementById('rsvp-name');
  const addrEl   = document.getElementById('rsvp-address');
  const msgEl    = document.getElementById('rsvp-msg');
  const attendEl = document.querySelector('input[name="attend"]:checked');
  const container = document.getElementById('rsvp-messages');

  const name   = nameEl.value.trim();
  const addr   = addrEl.value.trim();
  const msg    = msgEl.value.trim();
  const attend = attendEl ? attendEl.value : 'hadir';

  if (!name) { shakeInput(nameEl); return; }
  if (!msg)  { shakeInput(msgEl);  return; }

  const card = document.createElement('div');
  card.classList.add('rsvp-msg-item');
  card.innerHTML = `
    <strong>${escapeHtml(name)}</strong>
    <span class="${attend === 'hadir' ? 'rsvp-hadir' : 'rsvp-tidak'}">
      ${attend === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
    </span>
    ${addr ? `<small style="color:var(--gold-dark);font-size:0.75rem;display:block;margin-top:0.2rem;">${escapeHtml(addr)}</small>` : ''}
    <p>${escapeHtml(msg)}</p>
  `;
  container.insertBefore(card, container.firstChild);
  container.scrollTop = 0;
  nameEl.value = addrEl.value = msgEl.value = '';
  showToast(`Terima kasih, ${name}! Pesan Anda telah terkirim 🙏`);
}

function shakeInput(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'shakeInput 0.4s ease';
  el.style.borderColor = '#BF6D6D';
  setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 800);
  el.focus();
}

function showToast(message) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#2A1A08,#1A1005);border:1px solid var(--gold);color:var(--gold-light);padding:0.9rem 1.8rem;border-radius:4px;font-family:var(--font-body);font-size:0.95rem;z-index:9000;animation:toastIn 0.4s ease forwards;box-shadow:0 8px 32px rgba(0,0,0,0.6);max-width:90vw;text-align:center;`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

// Inject helper keyframes
(function() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shakeInput { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
    @keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes toastOut { from{opacity:1;transform:translateX(-50%) translateY(0)} to{opacity:0;transform:translateX(-50%) translateY(20px)} }
    @keyframes shimmer  { from{background-position:0% center} to{background-position:200% center} }
  `;
  document.head.appendChild(s);
})();

// PARALLAX hero
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const bgPhoto = hero.querySelector('.hero-bg-photo');
  if (bgPhoto && window.scrollY < hero.offsetHeight) {
    bgPhoto.style.transform = `scale(1.05) translateY(${window.scrollY * 0.1}px)`;
  }
}, { passive: true });

// Section title shimmer on hover
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section-title').forEach(el => {
    el.addEventListener('mouseover', () => {
      el.style.backgroundImage = 'linear-gradient(90deg,#C8A040,#F5EDD8,#C8A040)';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor  = 'transparent';
      el.style.backgroundSize = '200% auto';
      el.style.animation = 'shimmer 1.5s linear infinite';
    });
    el.addEventListener('mouseleave', () => {
      el.style.backgroundImage = el.style.webkitBackgroundClip = el.style.webkitTextFillColor = el.style.animation = '';
    });
  });
});
/* ============================================================
   SEJARAH PERTEMUAN – Tambahan script.js
   Tidak perlu fungsi baru — section ini sudah ditangani
   oleh initScrollReveal() yang sudah ada.

   Namun jika Anda ingin efek khusus pada titik timeline,
   tambahkan blok opsional di bawah ini ke dalam
   fungsi initScrollReveal() yang sudah ada, SETELAH
   baris: document.querySelectorAll('.reveal').forEach(...)
   ============================================================ */

// ── OPSIONAL: Animasi titik timeline saat muncul ──
// Tempel ini di dalam initScrollReveal(), tepat setelah
// observer.observe(el) loop yang sudah ada:

  /* --- LOVE STORY dot pulse on reveal --- */
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const dot = e.target.querySelector('.ls-dot');
        if (dot) {
          dot.style.animation = 'lsDotPop 0.5s cubic-bezier(.34,1.56,.64,1) forwards';
        }
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.ls-item').forEach(el => dotObserver.observe(el));

/* ── TAMBAHKAN KEYFRAME INI ke dalam IIFE inject keyframes yang sudah ada ──
   Cari blok: s.textContent = `...` di script.js
   dan tambahkan @keyframes lsDotPop di dalamnya:

    @keyframes lsDotPop {
      0%   { transform: translateX(-50%) scale(0); opacity: 0; }
      60%  { transform: translateX(-50%) scale(1.4); opacity: 1; }
      100% { transform: translateX(-50%) scale(1);   opacity: 1; }
    }

   Atau Anda bisa menambahkannya ke style.css secara langsung.
*/