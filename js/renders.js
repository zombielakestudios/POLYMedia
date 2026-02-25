/**
 * ═══════════════════════════════════════════════
 * renders.js — Galería Lightbox Engine
 * POLYMedia Apex Architecture
 * ═══════════════════════════════════════════════
 */
document.addEventListener('DOMContentLoaded', () => {

    // ── Datos de imágenes desde los botones del DOM ──
    const zoomBtns = document.querySelectorAll('.gallery-card__zoom');
    const cards    = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('lightbox');
    const lbImg    = document.getElementById('lb-img');
    const lbTitle  = document.getElementById('lb-title');
    const lbMeta   = document.getElementById('lb-meta');
    const lbCounter= document.getElementById('lb-counter');
    const lbClose  = document.getElementById('lb-close');
    const lbPrev   = document.getElementById('lb-prev');
    const lbNext   = document.getElementById('lb-next');

    // Construimos el dataset de imágenes desde botones
    const images = Array.from(zoomBtns).map(btn => ({
        src  : btn.getAttribute('data-src'),
        title: btn.getAttribute('data-title'),
        meta : btn.getAttribute('data-meta'),
    }));

    let currentIndex = 0;

    // ── Abrir lightbox ──
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    // ── Cerrar lightbox ──
    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // ── Actualizar contenido del lightbox ──
    function updateLightbox() {
        const data = images[currentIndex];
        lbImg.style.opacity = '0';
        lbImg.style.transform = 'scale(0.95)';

        setTimeout(() => {
            lbImg.src   = data.src;
            lbImg.alt   = data.title;
            lbTitle.textContent = data.title;
            lbMeta.textContent  = data.meta;
            lbCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;

            lbImg.onload = () => {
                lbImg.style.opacity   = '1';
                lbImg.style.transform = 'scale(1)';
                lbImg.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
            };
        }, 150);
    }

    // ── Navegación ──
    function goNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    }

    function goPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    // ── Event listeners ──

    // Clic en botón zoom
    zoomBtns.forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(i);
        });
    });

    // Clic en cualquier parte de la card también abre el lightbox
    cards.forEach((card, i) => {
        card.addEventListener('click', () => openLightbox(i));
    });

    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', goNext);
    lbPrev.addEventListener('click', goPrev);

    // Clic fuera de la imagen cierra
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowRight')  goNext();
        if (e.key === 'ArrowLeft')   goPrev();
    });

    // Touch swipe para móvil
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) < 40) return; // Ignorar taps accidentales
        delta < 0 ? goNext() : goPrev();
    });

    // ── Reveal de cards al hacer scroll (IntersectionObserver) ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    cards.forEach((card, i) => {
        card.style.opacity         = '0';
        card.style.transform       = 'translateY(30px)';
        card.style.transition      = `opacity 0.7s ease ${i * 0.06}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s`;
        revealObserver.observe(card);
    });

    // Estado visible
    document.querySelectorAll('.gallery-card.is-visible, .gallery-card').forEach(card => {
        card.addEventListener('transitionend', () => {
            if (card.classList.contains('is-visible')) {
                card.style.opacity   = '';
                card.style.transform = '';
            }
        });
    });

    // Disparar visible para las cards ya en viewport
    setTimeout(() => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                card.classList.add('is-visible');
                card.style.opacity   = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }, 100);

    console.log('POLYMedia Renders Engine: Active ✓');
});
