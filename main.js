/* =============================================
   MAIN.JS
   ============================================= */

/* ─── NAV SCROLL ─────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── MOBILE MENU ────────────────────────────── */
function toggleMenu() {
  const drawer = document.getElementById('navDrawer');
  const burger = document.getElementById('burger');
  const open   = drawer?.classList.toggle('open');
  burger?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeMenu() {
  document.getElementById('navDrawer')?.classList.remove('open');
  document.getElementById('burger')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const drawer = document.getElementById('navDrawer');
  const burger = document.getElementById('burger');
  if (
    drawer?.classList.contains('open') &&
    !drawer.contains(e.target) &&
    !burger?.contains(e.target)
  ) closeMenu();
});

/* ─── SCROLL REVEAL ──────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.in)')];
        const delay = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in'), Math.min(delay * 90, 360));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ─── COUNTER ANIMATION ──────────────────────── */
function animCount(el, target, duration = 1400) {
  let start = null;
  const suffix = el.dataset.suffix || '';
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const els = document.querySelectorAll('[data-target]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animCount(e.target, +e.target.dataset.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ─── SERVICE CHECKBOXES ─────────────────────── */
function initCheckboxes() {
  document.querySelectorAll('.svc-check').forEach(label => {
    const cb = label.querySelector('input[type="checkbox"]');
    if (!cb) return;
    const toggle = () => label.classList.toggle('on', cb.checked);
    cb.addEventListener('change', toggle);
    label.addEventListener('click', e => {
      if (e.target === label || !cb.contains(e.target)) {
        cb.checked = !cb.checked; toggle(); e.preventDefault();
      }
    });
  });
}

/* ─── FORM SUBMIT ────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn  = e.target.querySelector('button[type="submit"]');
  const ok   = document.getElementById('formOk');
  const orig = btn.innerHTML;
  btn.textContent = 'Отправляем…';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.disabled  = false;
    ok?.classList.add('show');
    e.target.reset();
    document.querySelectorAll('.svc-check').forEach(l => l.classList.remove('on'));
    setTimeout(() => ok?.classList.remove('show'), 6000);
  }, 1200);
}

/* ─── PHONE MASK ─────────────────────────────── */
function initPhoneMask() {
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '');
      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (val.startsWith('7')) {
        const m = val.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
        if (m) {
          this.value = '+7'
            + (m[2] ? ' (' + m[2] : '')
            + (m[3] ? ') ' + m[3] : '')
            + (m[4] ? '-' + m[4] : '')
            + (m[5] ? '-' + m[5] : '');
        }
      } else {
        this.value = val.slice(0, 15);
      }
    });
  });
}

/* ─── LIGHTBOX ───────────────────────────────── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  if (!lightbox) return;

  // Открываем при клике на карточку
  document.querySelectorAll('.work-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      if (!img || !img.src) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Закрываем по кнопке
  closeBtn?.addEventListener('click', closeLightbox);

  // Закрываем по клику на фон
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Закрываем по Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }
}

/* ─── INIT ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initCheckboxes();
  initPhoneMask();
  initLightbox();
});