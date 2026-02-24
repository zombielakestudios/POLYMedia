document.addEventListener('DOMContentLoaded', () => {
    console.log('POLYMedia Engine: Active');

    /**
     * ═══════════════════════════════════════════════
     * APP MENU — Full Screen Overlay Controller
     * Hamburger Toggle: AURA Apex Architecture
     * ═══════════════════════════════════════════════
     */
    const hamBtn  = document.getElementById('ham-btn');
    const appMenu = document.getElementById('app-menu');

    function openMenu() {
        appMenu.classList.add('is-open');
        hamBtn.classList.add('is-active');
        appMenu.setAttribute('aria-hidden', 'false');
        hamBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Block page scroll while menu is open
    }

    function closeMenu() {
        appMenu.classList.remove('is-open');
        hamBtn.classList.remove('is-active');
        appMenu.setAttribute('aria-hidden', 'true');
        hamBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore page scroll
    }

    if (hamBtn && appMenu) {
        hamBtn.addEventListener('click', () => {
            const isOpen = appMenu.classList.contains('is-open');
            isOpen ? closeMenu() : openMenu();
        });

        // Close on any menu link click
        appMenu.querySelectorAll('[data-close-menu]').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && appMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }



    /**
     * Apex Lazy Loader: Intersection Observer
     * Optimized for 60fps performance and zero-latency execution.
     */
    const lazySections = document.querySelectorAll('.lazy-section');

    const observerOptions = {
        root: null, // Viewport
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Lazy load background images within the section
                const lazyAssets = entry.target.querySelectorAll('[data-bg]');
                lazyAssets.forEach(asset => {
                    const url = asset.getAttribute('data-bg');
                    if (url) {
                        asset.style.backgroundImage = `url('${url}')`;
                        asset.removeAttribute('data-bg'); // Clean up
                    }
                });

                // Lazy Html injection for dynamic sections (AURA Architecture)
                const htmlSrc = entry.target.getAttribute('data-html-src');
                if (htmlSrc && !entry.target.hasAttribute('data-loaded')) {
                    fetch(htmlSrc)
                        .then(res => res.text())
                        .then(html => {
                            entry.target.innerHTML = html;
                            entry.target.setAttribute('data-loaded', 'true');

                            // Initialize accordions dynamically
                            const accordions = entry.target.querySelectorAll('.faq-accordion');
                            accordions.forEach(acc => {
                                acc.addEventListener('click', () => {
                                    acc.classList.toggle('active');
                                    const panel = acc.nextElementSibling;
                                    if (panel.style.maxHeight) {
                                        panel.style.maxHeight = null;
                                    } else {
                                        panel.style.maxHeight = panel.scrollHeight + "px";
                                    }
                                });
                            });
                        })
                        .catch(err => console.error('Apex Error: Failed loading chunk:', err));
                }

                // Once visible, we can stop observing this specific element
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    lazySections.forEach(section => {
        sectionObserver.observe(section);
    });

    /**
     * ═══════════════════════════════════════════════
     * CURSOR TRAIL - Antigravity Style
     * POLYMedia Brand Colors Particle System
     * ═══════════════════════════════════════════════
     */
    const canvas = document.getElementById('cursor-trail');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // POLYMedia brand colors palette
    const POLY_COLORS = [
        '#cc0d5f', // Primary Pink
        '#2b3de2', // Vibrant Blue
        '#ff5e3a', // Vibrant Orange
        '#ccff00', // Vibrant Green
        '#a855f7', // Vibrant Purple
    ];

    let particles = [];
    let mouseX = -100;
    let mouseY = -100;
    let isMouseOnPage = false;
    let animationId = null;

    // Resize canvas to full window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2; // Más sutiles
            this.life = 1.0;
            this.decay = Math.random() * 0.01 + 0.005; // Decadencia muchísimo más lenta (viven más)
            this.color = POLY_COLORS[Math.floor(Math.random() * POLY_COLORS.length)];
            this.vx = (Math.random() - 0.5) * 0.8; // Velocidad de expansión más lenta
            this.vy = (Math.random() - 0.5) * 0.8;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.98;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life * 0.8;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Ripple class for "Tap" effect
    class Ripple {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.life = 1.0;
            this.decay = 0.02; // Más lento el decaimiento para que crezca más (de 0.03 a 0.02)
            this.color = POLY_COLORS[Math.floor(Math.random() * POLY_COLORS.length)];
        }

        update() {
            this.radius += 4; // Expansión mucho más agresiva (de +2 a +4)
            this.life -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    let ripples = [];

    // Spawn particles at mouse position
    function spawnParticles() {
        if (!isMouseOnPage) return;
        // Solo instanciamos 1 partícula a la vez para que no se sature tan rápido
        particles.push(new Particle(mouseX, mouseY));
    }

    // Animation loop — 60fps target
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        spawnParticles();

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].life <= 0 || particles[i].size <= 0.3) {
                particles.splice(i, 1);
            }
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
            ripples[i].update();
            ripples[i].draw();

            if (ripples[i].life <= 0) {
                ripples.splice(i, 1);
            }
        }

        // Performance cap
        if (particles.length > 150) {
            particles = particles.slice(-150);
        }

        animationId = requestAnimationFrame(animate);
    }

    // Mouse event listeners & Drag-to-scroll (Apex Touch Simulation)
    let isDragging = false;
    let hasDragged = false;
    let startY = 0;

    // Inercia Settings
    let velocityY = 0;
    let lastY = 0;
    let inertiaFrame = null;
    let lastTime = 0;

    // Función de Inercia y Amortiguación (Friction)
    function applyInertia() {
        if (isDragging) return; // Si arrastra de nuevo, cortamos inercia

        // Si la velocidad es ínfima, matamos la inercia (Optimization)
        if (Math.abs(velocityY) < 0.5) {
            document.documentElement.style.scrollBehavior = ''; // Restauramos CSS Default Smooth
            cancelAnimationFrame(inertiaFrame);
            return;
        }

        // Aplicamos fricción del 92% (Mientras más cercano a 1, más resbala)
        velocityY *= 0.92;

        window.scrollBy({ left: 0, top: -velocityY, behavior: 'instant' });

        inertiaFrame = requestAnimationFrame(applyInertia);
    }

    document.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Solo clic izquierdo
        isDragging = true;
        hasDragged = false;
        startY = e.clientY;
        lastY = e.clientY;
        velocityY = 0;
        lastTime = performance.now();

        // Cortamos cualquier inercia previa de tajo si toca pantalla de nuevo
        if (inertiaFrame) cancelAnimationFrame(inertiaFrame);

        // Prevenir selección de texto para mayor sensación de control nativo
        document.body.style.userSelect = 'none';
        // Apagamos el scroll-behavior smooth de CSS que hace la liga (Rubber-banding y lag)
        document.documentElement.style.scrollBehavior = 'auto';

        // Feedback visual instantáneo al tocar cristal (Ripple)
        ripples.push(new Ripple(e.clientX, e.clientY));
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseOnPage = true;

        if (isDragging) {
            const currentTime = performance.now();
            const timeDelta = currentTime - lastTime;

            const deltaY = e.clientY - startY;

            // Si el mouse se mueve lo suficiente, lo consideramos drag
            if (Math.abs(deltaY) > 5) {
                hasDragged = true;
            }

            // Calculamos la velocidad real según el tiempo y pixeles movidos (FPS Independent)
            if (timeDelta > 0) {
                const stepDeltaY = e.clientY - lastY;
                // Sensibilidad multiplicada por un factor de velocidad táctil
                velocityY = (stepDeltaY / timeDelta) * 16;
            }

            // Movemos la ventana instantánemente, brincando CSS
            window.scrollBy({ left: 0, top: -(e.clientY - lastY), behavior: 'instant' });

            lastY = e.clientY;
            lastTime = currentTime;
        }
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';

        // Disparamos la inercia!
        if (hasDragged && Math.abs(velocityY) > 1) {
            inertiaFrame = requestAnimationFrame(applyInertia);
        } else {
            document.documentElement.style.scrollBehavior = ''; // Restauramos si no hubo empuje
        }
    });

    // Filtro Apex: Interceptamos clics falsos tras arrastrar
    document.addEventListener('click', (e) => {
        if (hasDragged) {
            e.preventDefault();
            e.stopPropagation();
            hasDragged = false;
        }
    }, true);

    document.addEventListener('mouseleave', () => {
        isMouseOnPage = false;
        isDragging = false;
        document.body.style.userSelect = '';
        document.documentElement.style.scrollBehavior = ''; // Restaurar a CSS Default
    });

    document.addEventListener('mouseenter', () => {
        isMouseOnPage = true;
    });

    // Touch support mapping for mobile
    document.addEventListener('touchstart', (e) => {
        isMouseOnPage = true;
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        ripples.push(new Ripple(mouseX, mouseY));
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isMouseOnPage = false;
    });

    // Run animation loop regardless of device type (so it works on touch too)
    animate();
});
