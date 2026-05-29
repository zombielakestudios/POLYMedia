document.addEventListener('DOMContentLoaded', () => {
    console.log('POLYMedia Engine: Active');

    /**
     * ═══════════════════════════════════════════════
     * APP MENU — Full Screen Overlay Controller
     * Hamburger Toggle: AURA Apex Architecture
     * ═══════════════════════════════════════════════
     */
    const hamBtn = document.getElementById('ham-btn');
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
                        asset.removeAttribute('data-bg');
                    }
                });

                // Lazy CSS injection (AURA Architecture - Fallo Cero)
                const cssSrc = entry.target.getAttribute('data-css-src');
                if (cssSrc && !document.querySelector(`link[href="${cssSrc}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = cssSrc;
                    document.head.appendChild(link);
                }

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
    const ctx = canvas ? canvas.getContext('2d') : null;

    // POLYMedia brand colors palette
    const POLY_COLORS = [
        '#e82d2d', // Primary Red
        '#eeb428', // Vibrant Yellow (Old Blue)
        '#379aba', // Vibrant Cyan (Old Orange)
        '#ccff00', // Vibrant Green
        '#4637d7', // Vibrant Deep Blue/Purple (Old Purple)
    ];

    let particles = [];
    let mouseX = -100;
    let mouseY = -100;
    let isMouseOnPage = false;
    let animationId = null;

    // Detección de dispositivo táctil — desactivar cursor trail en móvil (M1)
    const isTouchDevice = !window.matchMedia('(hover: hover)').matches;

    // Resize canvas to full window
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    if (canvas && !isTouchDevice) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

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
        if (!isMouseOnPage || !canvas) return;
        // Solo instanciamos 1 partícula a la vez para que no se sature tan rápido
        particles.push(new Particle(mouseX, mouseY));
    }

    // Animation loop — 60fps target
    function animate() {
        if (!ctx || !canvas) return;
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

    /**
     * ═══════════════════════════════════════════════
     * CONTACT MODAL (Glassmorphism)
     * ═══════════════════════════════════════════════
     */
    const contactModal = document.getElementById('contactModal');
    const openContactModalBtn = document.getElementById('openContactModalBtn');
    const openContactModalMenuBtn = document.getElementById('openContactModalMenuBtn');

    // Flag para cargar modals.css solo una vez (A5: Lazy CSS)
    let modalsCssLoaded = false;
    function ensureModalsCss() {
        if (modalsCssLoaded) return;
        if (!document.querySelector('link[href="css/modals.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/modals.css';
            document.head.appendChild(link);
        }
        modalsCssLoaded = true;
    }

    // Función para abrir modal
    function openContactModal() {
        if (!contactModal) return;
        ensureModalsCss();
        contactModal.classList.add('is-open');
        contactModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Bloquear scroll
    }

    // Función para cerrar modal
    function closeContactModal() {
        if (!contactModal) return;
        contactModal.classList.remove('is-open');
        contactModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // Event listener para abrir
    if (openContactModalBtn) {
        openContactModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openContactModal();
        });
    }

    if (openContactModalMenuBtn) {
        openContactModalMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openContactModal();
        });
    }

    // Event listeners para cerrar
    if (contactModal) {
        const closeTriggers = contactModal.querySelectorAll('[data-close-modal]');
        closeTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                // Al validar con e.target === trigger evitábamos que cerrara si se daba click al <span class="icon"> dentro del botón. 
                // Usando e.currentTarget en su lugar permitimos que todo el botón (incluyendo sus hijos) dispare el cierre.
                // Sin embargo, si es el overlay, sí queremos que sea estricto para no cerrar el modal al hacer click en el contenido del modal.
                if (trigger.classList.contains('contact-modal-overlay')) {
                    if (e.target === trigger) {
                        closeContactModal();
                    }
                } else {
                    // Es el botón de cerrar (la X)
                    closeContactModal();
                }
            });
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal.classList.contains('is-open')) {
                closeContactModal();
            }
        });
    }

    /**
     * ═══════════════════════════════════════════════
     * FORM VALIDATION & PREMIUM ALERTS
     * ═══════════════════════════════════════════════
     */
    const contactForm = document.getElementById('projectContactForm');
    const premiumAlertModal = document.getElementById('premiumAlertModal');
    const premiumAlertMessage = document.getElementById('premiumAlertMessage');
    const successAlertModal = document.getElementById('successAlertModal');

    function openPremiumAlert(message) {
        if (!premiumAlertModal || !premiumAlertMessage) return;
        premiumAlertMessage.textContent = message;
        premiumAlertModal.classList.add('is-open');
        premiumAlertModal.setAttribute('aria-hidden', 'false');
    }

    function closePremiumAlert() {
        if (!premiumAlertModal) return;
        premiumAlertModal.classList.remove('is-open');
        premiumAlertModal.setAttribute('aria-hidden', 'true');
    }

    function openSuccessAlert() {
        if (!successAlertModal) return;
        successAlertModal.classList.add('is-open');
        successAlertModal.setAttribute('aria-hidden', 'false');
    }

    function closeSuccessAlert() {
        if (!successAlertModal) return;
        successAlertModal.classList.remove('is-open');
        successAlertModal.setAttribute('aria-hidden', 'true');
    }

    if (premiumAlertModal) {
        // Cierra la alerta con cualquier click en el overlay o el botón "Entendido"
        const alertCloseTriggers = premiumAlertModal.querySelectorAll('[data-close-alert]');
        alertCloseTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                if (e.target === trigger) {
                    closePremiumAlert();
                }
            });
        });

        // Cierra alerta con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && premiumAlertModal.classList.contains('is-open')) {
                closePremiumAlert();
            }
        });
    }

    // Listeners Alerta de Éxito
    if (successAlertModal) {
        const successCloseTriggers = successAlertModal.querySelectorAll('[data-close-success]');
        successCloseTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                if (trigger.classList.contains('premium-alert-overlay')) {
                    if (e.target === trigger) {
                        closeSuccessAlert();
                    }
                } else {
                    closeSuccessAlert();
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && successAlertModal.classList.contains('is-open')) {
                closeSuccessAlert();
            }
        });
    }

    if (contactForm) {
        // --- Country Selector y Validación de Teléfono Numérico ---
        const telefonoInput = document.getElementById('contactTelefono');
        const selectedCountry = document.getElementById('selectedCountry');
        const countryDropdown = document.getElementById('countryDropdown');
        const countrySelect = document.getElementById('countrySelectContainer');
        const countryCodeInput = document.getElementById('countryCodeInput');

        if (telefonoInput) {
            // Validar que solo se ingresen números y controlar longitud base a E.164 (15 máx)
            telefonoInput.addEventListener('input', function (e) {
                let value = this.value.replace(/[^0-9]/g, '');
                if (value.length > 15) {
                    value = value.slice(0, 15);
                }
                this.value = value;
            });
        }

        if (selectedCountry && countrySelect && countryDropdown) {
            // Abrir/cerrar dropdown
            selectedCountry.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que burbujeé al documento inmediatamente
                countrySelect.classList.toggle('is-active');
            });

            // Cerrar si se da click afuera
            document.addEventListener('click', (e) => {
                if (!countrySelect.contains(e.target)) {
                    countrySelect.classList.remove('is-active');
                }
            });

            // Cambiar país seleccionado
            const countryOptions = countryDropdown.querySelectorAll('li');
            countryOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const code = option.getAttribute('data-code');
                    const flag = option.getAttribute('data-flag');

                    if (countryCodeInput) countryCodeInput.value = code;

                    // Solo actualizamos el interior, manteniendo la estructura
                    selectedCountry.innerHTML = `
                        <img src="assets/svg/flags/${flag}" alt="Selected Flag" class="flag-icon">
                        <span class="country-code">${code}</span>
                        <span class="icon" style="font-size: 1rem;">expand_more</span>
                    `;

                    countrySelect.classList.remove('is-active');
                });
            });
        }

        // Remover clases de error (-invalid) tan pronto el usuario interactúe con el field
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('input-invalid', 'checkbox-invalid');
            });
            input.addEventListener('change', () => {
                input.classList.remove('input-invalid', 'checkbox-invalid');
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Detenemos el envío nativo HTML

            let hasFieldErrors = false;
            let hasPrivacyError = false;

            // Recabamos todos los campos que tengan atributo "[required]"
            const requiredFields = contactForm.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (field.type === 'checkbox') {
                    if (!field.checked) {
                        field.classList.add('checkbox-invalid');
                        hasPrivacyError = true;
                    } else {
                        field.classList.remove('checkbox-invalid');
                    }
                } else {
                    if (!field.value.trim()) {
                        field.classList.add('input-invalid');
                        hasFieldErrors = true;
                    } else {
                        field.classList.remove('input-invalid');
                    }
                }
            });

            if (hasFieldErrors || hasPrivacyError) {
                // Mensaje dinámico según lo que falte, priorizando los datos
                if (hasFieldErrors) {
                    openPremiumAlert('Ups! te hace falta llenar unos datos para tu misión.');
                } else if (hasPrivacyError) {
                    openPremiumAlert('Ups! No has aceptado nuestro acuerdo de privacidad.');
                }
                return; // Cortamos el flujo
            }

            // Si llegamos aquí, la validación fue un éxito "Fallo Cero"
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalHTML = submitBtn.innerHTML;

            // Simulación de envío premium (Feedback al usuario)
            submitBtn.innerHTML = 'Enviando... <span class="icon">sync</span>';
            submitBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                submitBtn.innerHTML = 'Misión Exitosa <span class="icon">check_circle</span>';
                submitBtn.style.background = '#00e5ff'; // Cambio radical azul turquesa
                submitBtn.style.color = '#000';

                setTimeout(() => {
                    closeContactModal();
                    contactForm.reset();
                    // Restaurar botón al estado original
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style = '';

                    // Disparamos la ventana de Misión Cumplida justo aquí!
                    openSuccessAlert();
                }, 2000); // 2 segundos antes de cerrar modal general y resetear
            }, 1500); // 1.5s simulación de respuesta del server
        });
    }

    // Mouse event listeners & Drag-to-scroll (Apex Touch Simulation)
    // M2: Scoped to .site-wrapper to avoid conflict with forms and interactive elements
    const siteWrapper = document.querySelector('.site-wrapper');
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

    if (siteWrapper) {
        siteWrapper.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Solo clic izquierdo
            // No arrastrar si hay un modal abierto
            if (document.querySelector('.contact-modal.is-open')) return;
            // No arrastrar si el target es interactivo (links, buttons, inputs)
            const tag = e.target.tagName.toLowerCase();
            if (['a', 'button', 'input', 'textarea', 'select', 'label'].includes(tag) || e.target.closest('a, button, input, textarea, select, label')) return;
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
    }

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
    // Touch — solo escuchamos touch si hay canvas y NO es dispositivo táctil puro
    if (!isTouchDevice) {
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
    }

    // Run animation loop ONLY on non-touch devices with canvas
    if (canvas && !isTouchDevice) {
        animate();
    }

    /**
     * ═══════════════════════════════════════════════
     * ONLINE QUOTE MODAL (Glassmorphism & WhatsApp)
     * ═══════════════════════════════════════════════
     */
    const quoteModal = document.getElementById('quoteModal');
    const openQuoteModalBtn = document.getElementById('openQuoteModalBtn');
    const openQuoteModalMenuBtn = document.getElementById('openQuoteModalMenuBtn');
    const quoteForm = document.getElementById('onlineQuoteForm');

    // Phone config
    const POLYMEDIA_WHATSAPP_PHONE = '529983431102'; // Configurable WhatsApp receiver phone number

    function openQuoteModal() {
        if (!quoteModal) return;
        ensureModalsCss();
        quoteModal.classList.add('is-open');
        quoteModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Block scroll
    }

    function closeQuoteModal() {
        if (!quoteModal) return;
        quoteModal.classList.remove('is-open');
        quoteModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scroll
    }

    if (openQuoteModalBtn) {
        openQuoteModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openQuoteModal();
        });
    }

    if (openQuoteModalMenuBtn) {
        openQuoteModalMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openQuoteModal();
        });
    }

    if (quoteModal) {
        const closeTriggers = quoteModal.querySelectorAll('[data-close-modal]');
        closeTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                if (trigger.classList.contains('contact-modal-overlay')) {
                    if (e.target === trigger) {
                        closeQuoteModal();
                    }
                } else {
                    closeQuoteModal();
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && quoteModal.classList.contains('is-open')) {
                closeQuoteModal();
            }
        });
    }

    // Dynamic styling for checked cards, quantity toggle, and real-time total in Cotizador
    if (quoteForm) {
        const quoteCards = quoteForm.querySelectorAll('.quote-card');
        const checkboxes = quoteForm.querySelectorAll('input[type="checkbox"]:not(#quotePrivacidad)');
        
        // Function to update the estimated total in real time
        function updateQuoteTotal() {
            let total = 0;
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    const price = parseFloat(cb.getAttribute('data-price')) || 0;
                    const isVariable = cb.getAttribute('data-is-variable') === 'true';
                    if (isVariable) {
                        const qtyInput = document.getElementById(cb.id + '_qty');
                        const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
                        total += price * qty;
                    } else {
                        total += price;
                    }
                }
            });
            
            const totalDisplay = document.getElementById('quoteTotalPrice');
            if (totalDisplay) {
                totalDisplay.textContent = total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        }

        // Initialize checkbox event listeners and state
        checkboxes.forEach(cb => {
            const isVariable = cb.getAttribute('data-is-variable') === 'true';
            if (isVariable) {
                const qtyInput = document.getElementById(cb.id + '_qty');
                if (qtyInput && !cb.checked) {
                    qtyInput.setAttribute('disabled', 'true');
                }
            }

            cb.addEventListener('change', () => {
                // Toggle quantity control visibility if variable
                const isVariable = cb.getAttribute('data-is-variable') === 'true';
                if (isVariable) {
                    const qtyControl = document.getElementById(`ctrl_${cb.id}`);
                    if (qtyControl) {
                        if (cb.checked) {
                            qtyControl.classList.add('is-visible');
                            const qtyInput = document.getElementById(cb.id + '_qty');
                            if (qtyInput) qtyInput.removeAttribute('disabled');
                        } else {
                            qtyControl.classList.remove('is-visible');
                            const qtyInput = document.getElementById(cb.id + '_qty');
                            if (qtyInput) qtyInput.setAttribute('disabled', 'true');
                        }
                    }
                }

                // Check card activation state (at least one checked)
                const card = cb.closest('.quote-card');
                if (card) {
                    const cardCheckboxes = card.querySelectorAll('input[type="checkbox"]');
                    const anyChecked = Array.from(cardCheckboxes).some(input => input.checked);
                    if (anyChecked) {
                        card.classList.add('is-active');
                    } else {
                        card.classList.remove('is-active');
                    }
                }

                updateQuoteTotal();
            });
        });

        // Set up plus/minus buttons for quantity controls
        const qtyButtons = quoteForm.querySelectorAll('.qty-btn');
        qtyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                const targetId = btn.getAttribute('data-target');
                const input = document.getElementById(targetId);
                if (input) {
                    let val = parseInt(input.value) || 0;
                    const min = parseInt(input.min) || 1;
                    const max = parseInt(input.max) || 1000;
                    
                    if (action === 'plus') {
                        val = Math.min(val + 1, max);
                    } else if (action === 'minus') {
                        val = Math.max(val - 1, min);
                    }
                    
                    input.value = val;
                    updateQuoteTotal();
                }
            });
        });

        // Update when user inputs a value manually inside quantity fields
        const qtyInputs = quoteForm.querySelectorAll('.qty-val');
        qtyInputs.forEach(input => {
            input.addEventListener('change', () => {
                let val = parseInt(input.value) || 1;
                const min = parseInt(input.min) || 1;
                const max = parseInt(input.max) || 1000;
                val = Math.max(min, Math.min(val, max));
                input.value = val;
                updateQuoteTotal();
            });
        });

        // --- Country Selector y Validación de Teléfono Numérico ---
        const quoteTelefonoInput = document.getElementById('quoteTelefono');
        const quoteSelectedCountry = document.getElementById('quoteSelectedCountry');
        const quoteCountryDropdown = document.getElementById('quoteCountryDropdown');
        const quoteCountrySelect = document.getElementById('quoteCountrySelectContainer');
        const quoteCountryCodeInput = document.getElementById('quoteCountryCodeInput');

        if (quoteTelefonoInput) {
            quoteTelefonoInput.addEventListener('input', function () {
                let value = this.value.replace(/[^0-9]/g, '');
                if (value.length > 15) {
                    value = value.slice(0, 15);
                }
                this.value = value;
            });
        }

        if (quoteSelectedCountry && quoteCountrySelect && quoteCountryDropdown) {
            quoteSelectedCountry.addEventListener('click', (e) => {
                e.stopPropagation();
                quoteCountrySelect.classList.toggle('is-active');
            });

            document.addEventListener('click', (e) => {
                if (!quoteCountrySelect.contains(e.target)) {
                    quoteCountrySelect.classList.remove('is-active');
                }
            });

            const countryOptions = quoteCountryDropdown.querySelectorAll('li');
            countryOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const code = option.getAttribute('data-code');
                    const flag = option.getAttribute('data-flag');

                    if (quoteCountryCodeInput) quoteCountryCodeInput.value = code;

                    quoteSelectedCountry.innerHTML = `
                        <img src="assets/svg/flags/${flag}" alt="Selected Flag" class="flag-icon">
                        <span class="country-code">${code}</span>
                        <span class="icon" style="font-size: 1rem;">expand_more</span>
                    `;

                    quoteCountrySelect.classList.remove('is-active');
                });
            });
        }

        // Remover clases de error al interactuar
        const quoteInputs = quoteForm.querySelectorAll('input, select, textarea');
        quoteInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('input-invalid', 'checkbox-invalid');
            });
            input.addEventListener('change', () => {
                input.classList.remove('input-invalid', 'checkbox-invalid');
            });
        });

        // Form Submit
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let hasFieldErrors = false;
            let hasPrivacyError = false;

            const requiredFields = quoteForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (field.type === 'checkbox') {
                    if (!field.checked) {
                        field.classList.add('checkbox-invalid');
                        hasPrivacyError = true;
                    } else {
                        field.classList.remove('checkbox-invalid');
                    }
                } else {
                    if (!field.value.trim()) {
                        field.classList.add('input-invalid');
                        hasFieldErrors = true;
                    } else {
                        field.classList.remove('input-invalid');
                    }
                }
            });

            if (hasFieldErrors || hasPrivacyError) {
                if (hasFieldErrors) {
                    openPremiumAlert('Ups! Te hace falta llenar algunos datos de contacto.');
                } else if (hasPrivacyError) {
                    openPremiumAlert('Ups! No has aceptado nuestro acuerdo de privacidad.');
                }
                return;
            }

            // Validar que al menos una opción esté seleccionada
            const selectedOptions = quoteForm.querySelectorAll('input[type="checkbox"]:checked:not(#quotePrivacidad)');
            if (selectedOptions.length === 0) {
                openPremiumAlert('Por favor selecciona al menos un servicio o entregable de interés.');
                return;
            }

            // Recopilar selección por servicio con desglose de precios y cantidades
            let brandingSelected = [];
            let webSelected = [];
            let rendersSelected = [];
            let appsSelected = [];
            let grandTotal = 0;

            selectedOptions.forEach(cb => {
                const price = parseFloat(cb.getAttribute('data-price')) || 0;
                const name = cb.value;
                const isVariable = cb.getAttribute('data-is-variable') === 'true';
                let itemTotal = price;
                let detailsText = '';

                if (isVariable) {
                    const qtyInput = document.getElementById(cb.id + '_qty');
                    const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
                    itemTotal = price * qty;
                    
                    let unit = 'seg';
                    if (cb.id.includes('modelado')) unit = 'hrs';
                    if (cb.id.includes('laser')) unit = 'min';
                    if (cb.id.includes('vinil')) unit = 'm';
                    if (cb.id.includes('expres') || cb.id.includes('realista')) unit = 'renders';
                    
                    detailsText = ` (${qty} ${unit} × $${price.toLocaleString('es-MX')})`;
                } else {
                    detailsText = ` ($${price.toLocaleString('es-MX')})`;
                }

                grandTotal += itemTotal;
                const line = `  • ${name}${detailsText} = *$${itemTotal.toLocaleString('es-MX')}*`;

                if (cb.name === 'branding_options') {
                    brandingSelected.push(line);
                } else if (cb.name === 'web_options') {
                    webSelected.push(line);
                } else if (cb.name === 'renders_options') {
                    rendersSelected.push(line);
                } else if (cb.name === 'apps_options') {
                    appsSelected.push(line);
                }
            });

            // Obtener datos del cliente
            const name = document.getElementById('quoteNombre').value.trim();
            const company = document.getElementById('quoteEmpresa').value.trim() || 'No especificada';
            const phoneCode = quoteCountryCodeInput ? quoteCountryCodeInput.value : '+52';
            const phoneNum = document.getElementById('quoteTelefono').value.trim();
            const email = document.getElementById('quoteEmail').value.trim();
            const notes = document.getElementById('quoteMensaje').value.trim() || 'Sin notas adicionales';

            // Formatear mensaje para WhatsApp
            let msg = `🔥 *NUEVA COTIZACIÓN ONLINE* 🔥\n\n`;
            msg += `👤 *Cliente:* ${name}\n`;
            msg += `🏢 *Empresa/Proyecto:* ${company}\n`;
            msg += `📧 *Correo:* ${email}\n`;
            msg += `📱 *Teléfono:* ${phoneCode} ${phoneNum}\n\n`;
            msg += `🛠️ *Desglose de Propuesta:*\n`;

            if (brandingSelected.length > 0) {
                msg += `\n🎨 *BRANDING & IDENTIDAD:*\n` + brandingSelected.join('\n') + `\n`;
            }
            if (webSelected.length > 0) {
                msg += `\n💻 *WEB & MARKETING:*\n` + webSelected.join('\n') + `\n`;
            }
            if (rendersSelected.length > 0) {
                msg += `\n📐 *RENDERS 3D & CGI:*\n` + rendersSelected.join('\n') + `\n`;
            }
            if (appsSelected.length > 0) {
                msg += `\n🤖 *IA 4K & TALLER:*\n` + appsSelected.join('\n') + `\n`;
            }

            msg += `\n💵 *TOTAL ESTIMADO:* *$${grandTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN*\n\n`;
            msg += `💬 *Mensaje del Cliente:*\n_${notes}_\n\n`;
            msg += `--- \n_Generado en Cotizador Online POLYMedia_`;

            // Simulación e interacción con el botón
            const submitBtn = quoteForm.querySelector('.btn-submit');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Conectando a WhatsApp... <span class="icon">sync</span>';
            submitBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                submitBtn.innerHTML = 'Enviado con éxito <span class="icon">check_circle</span>';
                submitBtn.style.background = '#ccff00'; // Lime green
                submitBtn.style.color = '#000';

                // Lanzar enlace de WhatsApp
                const encodedMsg = encodeURIComponent(msg);
                const waUrl = `https://wa.me/${POLYMEDIA_WHATSAPP_PHONE}?text=${encodedMsg}`;
                window.open(waUrl, '_blank');

                setTimeout(() => {
                    closeQuoteModal();
                    quoteForm.reset();
                    
                    // Quitar iluminación a las tarjetas y resetear total a 0
                    const quoteCards = quoteForm.querySelectorAll('.quote-card');
                    quoteCards.forEach(c => c.classList.remove('is-active'));
                    
                    const totalDisplay = document.getElementById('quoteTotalPrice');
                    if (totalDisplay) totalDisplay.textContent = '0.00';

                    // Ocultar sub-controles de cantidad y deshabilitar sus inputs
                    const qtyControls = quoteForm.querySelectorAll('.quote-quantity-control');
                    qtyControls.forEach(ctrl => ctrl.classList.remove('is-visible'));
                    
                    const qtyVals = quoteForm.querySelectorAll('.qty-val');
                    qtyVals.forEach(input => input.setAttribute('disabled', 'true'));

                    // Restaurar flag de país
                    if (quoteSelectedCountry) {
                        quoteSelectedCountry.innerHTML = `
                            <img src="assets/svg/flags/mx.svg" alt="MX" class="flag-icon">
                            <span class="country-code">+52</span>
                            <span class="icon icon--sm">expand_more</span>
                        `;
                    }
                    if (quoteCountryCodeInput) quoteCountryCodeInput.value = '+52';

                    // Restaurar botón
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style = '';
                }, 2000);
            }, 1200);
        });
    }
});
