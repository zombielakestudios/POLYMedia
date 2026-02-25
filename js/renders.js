/**
 * ═══════════════════════════════════════════════════════════
 *  renders.js — Galería Lightbox Engine v2.0 (Apex Mobile)
 *  POLYMedia — AURA Architecture
 *  Fix: imágenes visibles desde el primer frame, sin necesitar
 *       scroll ni touch. Lazy-load real con pre-fetch anticipado.
 * ═══════════════════════════════════════════════════════════
 */
document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────────────────
    // 1. HERO BG — Carga inmediata, sin esperar nada
    // ─────────────────────────────────────────────────────────
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        const heroSrc = heroBg.getAttribute('data-bg');
        if (heroSrc) {
            heroBg.style.backgroundImage = `url('${heroSrc}')`;
            heroBg.removeAttribute('data-bg');
        }
    }

    // ─────────────────────────────────────────────────────────
    // 2. LAZY-BG LOADER — Carga imágenes de tarjetas al entrar
    //    al viewport. rootMargin de 300px para pre-cargar ANTES
    //    de que sean visibles (anticipación real).
    // ─────────────────────────────────────────────────────────
    const bgObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const imgDiv = entry.target.querySelector('[data-bg]');
            if (imgDiv) {
                imgDiv.style.backgroundImage = `url('${imgDiv.getAttribute('data-bg')}')`;
                imgDiv.removeAttribute('data-bg');
            }
            obs.unobserve(entry.target);
        });
    }, {
        rootMargin: '300px 0px 300px 0px', // Pre-carga 300px ANTES de ser visible
        threshold: 0
    });

    // ─────────────────────────────────────────────────────────
    // 3. REVEAL ANIMATION — Aparece con fade+slide al entrar
    //    Sin tocar, sin scroll extra. Se dispara en el primer
    //    frame si ya están en pantalla.
    // ─────────────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const card = entry.target;
            const index = parseInt(card.getAttribute('data-index') ?? '0', 10);
            // Stagger suave: máx 0.3s de delay para no hacer esperar
            const delay = Math.min(index * 0.06, 0.3);
            card.style.transitionDelay = `${delay}s`;
            card.classList.add('is-visible');
            obs.unobserve(card);
        });
    }, {
        rootMargin: '0px 0px -20px 0px', // Umbral mínimo: aparece casi de inmediato
        threshold: 0
    });

    const cards = document.querySelectorAll('.gallery-card');

    cards.forEach(card => {
        bgObserver.observe(card);
        revealObserver.observe(card);
    });

    // ─────────────────────────────────────────────────────────
    // 4. FORCE REVEAL — Polyfill para el primer frame en móvil.
    //    Algunos browsers móviles no disparan el Observer hasta
    //    el primer scroll. Esto lo resuelve sin necesitar touch.
    // ─────────────────────────────────────────────────────────
    function forceRevealVisible() {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Si está dentro del viewport + margen de 300px
            if (rect.top < window.innerHeight + 300) {
                // Cargar imagen si aún tiene data-bg
                const imgDiv = card.querySelector('[data-bg]');
                if (imgDiv) {
                    imgDiv.style.backgroundImage = `url('${imgDiv.getAttribute('data-bg')}')`;
                    imgDiv.removeAttribute('data-bg');
                }
                // Revelar tarjeta
                const index = parseInt(card.getAttribute('data-index') ?? '0', 10);
                const delay = Math.min(index * 0.06, 0.3);
                card.style.transitionDelay = `${delay}s`;
                card.classList.add('is-visible');
            }
        });
    }

    // Disparar en el primer frame disponible (antes de cualquier interacción)
    requestAnimationFrame(() => {
        forceRevealVisible();
        // Segundo frame como seguro adicional (algunos móviles son lentos en el primer rAF)
        requestAnimationFrame(forceRevealVisible);
    });

    // ─────────────────────────────────────────────────────────
    // 5. LIGHTBOX ENGINE
    // ─────────────────────────────────────────────────────────
    const zoomBtns = document.querySelectorAll('.gallery-card__zoom');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbTitle = document.getElementById('lb-title');
    const lbMeta = document.getElementById('lb-meta');
    const lbCounter = document.getElementById('lb-counter');
    const lbClose = document.getElementById('lb-close');
    const lbPrev = document.getElementById('lb-prev');
    const lbNext = document.getElementById('lb-next');

    // Dataset de imágenes desde los botones del DOM
    const images = Array.from(zoomBtns).map(btn => ({
        src: btn.getAttribute('data-src'),
        title: btn.getAttribute('data-title'),
        meta: btn.getAttribute('data-meta'),
    }));

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const data = images[currentIndex];
        lbImg.style.opacity = '0';
        lbImg.style.transform = 'scale(0.95)';

        setTimeout(() => {
            lbImg.src = data.src;
            lbImg.alt = data.title;
            lbTitle.textContent = data.title;
            lbMeta.textContent = data.meta;
            lbCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;

            lbImg.onload = () => {
                lbImg.style.opacity = '1';
                lbImg.style.transform = 'scale(1)';
                lbImg.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
            };
        }, 150);
    }

    function goNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    }

    function goPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    // Botón zoom
    zoomBtns.forEach((btn, i) => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            openLightbox(i);
        });
    });

    // Clic en card abre lightbox
    cards.forEach((card, i) => {
        card.addEventListener('click', () => openLightbox(i));
    });

    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', goNext);
    lbPrev.addEventListener('click', goPrev);

    // Clic fuera cierra
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    // Teclado
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    });

    // Swipe táctil en el lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', e => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) < 40) return;
        delta < 0 ? goNext() : goPrev();
    });

    console.log('POLYMedia Renders Engine v2.0: Active ✓');
});
