/* =============================================
   MAIN.JS
   index.html  → js/main.js
   html/*.html → ../js/main.js
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

/* Close on outside click */
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
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.in)')];
        const delay = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('in');
        }, Math.min(delay * 80, 320));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ─── COUNTER ANIMATION ──────────────────────── */
function animCount(el, target, duration = 1400) {
  let start = null;
  const suffix = el.dataset.suffix || '';
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    el.textContent = val + suffix;
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
      if (e.isIntersecting) {
        animCount(e.target, +e.target.dataset.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ─── SERVICE CHECKBOXES ─────────────────────── */
function initCheckboxes() {
  document.querySelectorAll('.svc-check').forEach(label => {
    const cb = label.querySelector('input[type="checkbox"]');
    if (!cb) return;
    const toggle = () => label.classList.toggle('checked', cb.checked);
    cb.addEventListener('change', toggle);
    label.addEventListener('click', e => {
      // prevent double-fire on label click
      if (e.target === label || e.target.classList.contains('svc-check-box') || e.target.tagName === 'SPAN') {
        cb.checked = !cb.checked;
        toggle();
        e.preventDefault();
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

  // Simulate send (replace with real fetch later)
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.disabled  = false;
    ok?.classList.add('show');
    e.target.reset();
    document.querySelectorAll('.svc-check').forEach(l => l.classList.remove('checked'));
    setTimeout(() => ok?.classList.remove('show'), 6000);
  }, 1200);
}

/* ─── PHONE MASK ─────────────────────────────── */
function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
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

/* ─── INIT ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initCheckboxes();
  initPhoneMask();
});