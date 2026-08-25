/* ==========================================================
   LAION Big Video Dataset — main.js
   ========================================================== */

/* ── Navbar: add .scrolled on scroll ───────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

/* ── Mobile nav toggle ──────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

/* ── Phrase cycling animation ───────────────────────────── */
const phrases = [
    'models that see',
    'models that hear',
    'multimodal pre-training',
    'video generation',
    'audio generation',
];

const phraseEl = document.getElementById('animPhrase');
let phraseIdx  = 0;
let busy       = false;

function nextPhrase() {
    if (busy) return;
    busy = true;

    phraseEl.classList.add('ph-exit');

    setTimeout(() => {
        phraseIdx = (phraseIdx + 1) % phrases.length;
        phraseEl.textContent = phrases[phraseIdx];
        phraseEl.classList.remove('ph-exit');
        phraseEl.classList.add('ph-reset');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                phraseEl.classList.remove('ph-reset');
                setTimeout(() => { busy = false; }, 360);
            });
        });
    }, 340);
}

if (phraseEl) setInterval(nextPhrase, 2800);

/* ── Scroll-reveal (IntersectionObserver) ───────────────── */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => revealObs.observe(el));

/* ── Stat counter animation ─────────────────────────────── */
function runCounter(el) {
    const target  = parseFloat(el.dataset.val);
    const dec     = parseInt(el.dataset.dec ?? '0', 10);
    const suffix  = el.dataset.suffix ?? '';
    const ms      = 1600;
    const fps     = 60;
    const steps   = Math.round(ms / (1000 / fps));
    let   step    = 0;

    const id = setInterval(() => {
        step++;
        const t = step / steps;
        const eased = 1 - Math.pow(1 - t, 3);
        const cur   = target * eased;
        el.textContent = (dec > 0 ? cur.toFixed(dec) : Math.round(cur)) + suffix;

        if (step >= steps) {
            clearInterval(id);
            el.textContent = (dec > 0 ? target.toFixed(dec) : target) + suffix;
        }
    }, 1000 / fps);
}

const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const num = e.target.querySelector('.stat-number[data-val]');
            if (num) runCounter(num);
            statObs.unobserve(e.target);
        }
    });
}, { threshold: 0.35 });

document.querySelectorAll('.stat-card').forEach(el => statObs.observe(el));

/* ── Citation copy ──────────────────────────────────────── */
const copyBtn = document.getElementById('copyBtn');

if (copyBtn) copyBtn.addEventListener('click', function () {
    const text = document.getElementById('citationCode').textContent;
    const btn  = this;

    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied!`;
        btn.classList.add('copied');

        setTimeout(() => {
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy`;
            btn.classList.remove('copied');
        }, 2200);
    }).catch(() => {
        btn.textContent = 'Failed';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
    });
});
