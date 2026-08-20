/* =============================================
   ООО «Техносервис» — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ---------- HEADER SCROLL ---------- */
    const header = document.getElementById('header');

    const handleHeaderScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* ---------- BURGER MENU ---------- */
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close button inside mobile menu
    const mobileClose = document.getElementById('mobileClose');
    mobileClose.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    /* ---------- SMOOTH SCROLL ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ---------- SCROLL ANIMATIONS ---------- */
    const animElements = document.querySelectorAll('.anim-fade');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animElements.forEach(el => animObserver.observe(el));

    /* ---------- COUNTER ANIMATION ---------- */
    const statNumbers = document.querySelectorAll('.stat__number');

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const startTime = performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = Math.round(easedProgress * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    /* ---------- TABS ---------- */
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`tab-${targetId}`).classList.add('active');
        });
    });

    /* ---------- PHONE INPUT MASK ---------- */
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 11) {
                value = value.substring(0, 11);
            }

            if (value.length === 0) {
                e.target.value = '';
                return;
            }

            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.substring(1, 4);
            }
            if (value.length > 4) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length > 7) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length > 9) {
                formatted += '-' + value.substring(9, 11);
            }

            e.target.value = formatted;
        });

        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value) {
                phoneInput.value = '+7 ';
            }
        });

        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value === '+7 ' || phoneInput.value === '+7') {
                phoneInput.value = '';
            }
        });
    }

    /* ---------- FORM HANDLING ---------- */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');

            // Basic validation
            if (!name || name.trim().length < 2) {
                shakeField(contactForm.querySelector('#name'));
                return;
            }

            if (!phone || phone.replace(/\D/g, '').length < 11) {
                shakeField(contactForm.querySelector('#phone'));
                return;
            }

            // Success state (replace with actual submission)
            const submitBtn = contactForm.querySelector('.btn[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                Заявка отправлена!
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            submitBtn.style.borderColor = '#10B981';
            submitBtn.disabled = true;

            // Log form data (replace with real backend call)
            console.log('Form submitted:', {
                name: formData.get('name'),
                company: formData.get('company'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                message: formData.get('message')
            });

            // Reset after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }

    const shakeField = (field) => {
        if (!field) return;
        field.style.borderColor = '#EF4444';
        field.style.animation = 'shake 0.4s ease';
        field.focus();

        setTimeout(() => {
            field.style.borderColor = '';
            field.style.animation = '';
        }, 1000);
    };

    // Shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            50% { transform: translateX(8px); }
            75% { transform: translateX(-4px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    /* ---------- PARALLAX BACKGROUND (секция «Станочный парк») ---------- */
    const capSection = document.getElementById('capabilities');
    const capBg = document.querySelector('.capabilities__bg');

    if (capSection && capBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const BG_SPEED = 1.6; // фон движется на 25% скорости контента
        let ticking = false;

        const updateParallax = () => {
            const rect = capSection.getBoundingClientRect();
            const viewportH = window.innerHeight;
            // Смещение = 0, когда центр секции совпадает с центром экрана
            const centerDelta = rect.top + rect.height / 2 - viewportH / 2;
            // Ограничитель: не даём сдвигу выйти за запас фона (55% высоты секции)
            const maxShift = capSection.offsetHeight * 0.45;
            const rawOffset = centerDelta * (1 - BG_SPEED);
            const offset = Math.max(-maxShift, Math.min(maxShift, rawOffset));
            capBg.style.transform = `translate3d(0, ${offset}px, 0)`;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateParallax);
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
        window.addEventListener('resize', requestTick, { passive: true });
        updateParallax();
    }

    /* ---------- CAROUSEL ---------- */
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel__slide');
        const dots = carousel.querySelectorAll('.carousel__dot');
        const prevBtn = carousel.querySelector('.carousel__btn--prev');
        const nextBtn = carousel.querySelector('.carousel__btn--next');
        let currentIndex = 0;
        let autoplayTimer = null;

        const goTo = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const next = () => goTo(currentIndex + 1);
        const prev = () => goTo(currentIndex - 1);

        // Button controls
        nextBtn.addEventListener('click', next);
        prevBtn.addEventListener('click', prev);

        // Dot controls
        dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

        // Autoplay — switches every 4s, pauses on hover
        const startAutoplay = () => {
            stopAutoplay();
            autoplayTimer = setInterval(next, 4000);
        };
        const stopAutoplay = () => {
            if (autoplayTimer) clearInterval(autoplayTimer);
        };

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);

        // Swipe support for touch devices
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoplay();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? prev() : next();
            }
            startAutoplay();
        });

        // Start autoplay only when carousel is visible
        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) startAutoplay();
                else stopAutoplay();
            });
        }, { threshold: 0.5 });

        carouselObserver.observe(carousel);
    });

    /* ---------- INTERACTIVE BACKGROUNDS (canvas) ---------- */
    const bgReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Общая обвязка: canvas на весь блок, указатель, старт/стоп по видимости
    function bgEngine(section, drawFrame, initState) {
        const canvas = section.querySelector('.bgfx');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const pointer = { x: -9999, y: -9999, active: false };
        const state = { w: 0, h: 0 };
        let raf = null;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            state.w = section.clientWidth;
            state.h = section.clientHeight;
            canvas.width = Math.round(state.w * dpr);
            canvas.height = Math.round(state.h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (initState) initState(state);
            if (bgReducedMotion) drawFrame(ctx, state, pointer, 0); // статичный кадр
        };

        const loop = (now) => {
            drawFrame(ctx, state, pointer, now);
            raf = requestAnimationFrame(loop);
        };

        section.addEventListener('pointermove', (e) => {
            const r = canvas.getBoundingClientRect();
            pointer.x = e.clientX - r.left;
            pointer.y = e.clientY - r.top;
            pointer.active = true;
        }, { passive: true });

        section.addEventListener('pointerleave', () => {
            pointer.active = false;
            pointer.x = -9999;
            pointer.y = -9999;
        }, { passive: true });

        window.addEventListener('resize', resize, { passive: true });
        resize();

        if (bgReducedMotion) return; // без анимации

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !raf) {
                    raf = requestAnimationFrame(loop);
                } else if (!entry.isIntersecting && raf) {
                    cancelAnimationFrame(raf);
                    raf = null;
                }
            });
        }, { threshold: 0.05 });
        io.observe(section);
    }

    /* --- Эффект 1: «Чертёжная сетка» (блок «Знакомо?») --- */
    const gridBg = document.querySelector('.bgfx--grid');
    if (gridBg) {
        const STEP = 36;          // мелкий шаг сетки
        const MAJOR = 5;          // каждая 5-я линия — основная (узлы на них)
        const INFLUENCE = 180;    // радиус влияния курсора
        const slate = (a) => `rgba(148, 163, 184, ${a})`;
        const amber = (a) => `rgba(245, 158, 11, ${a})`;

        bgEngine(gridBg.closest('section'), (ctx, s, pointer, now) => {
            const { w, h } = s;
            ctx.clearRect(0, 0, w, h);

            // Линии сетки
            ctx.lineWidth = 1;
            let i = 0;
            for (let x = 0.5; x <= w; x += STEP, i++) {
                ctx.strokeStyle = slate(i % MAJOR === 0 ? 0.11 : 0.05);
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            i = 0;
            for (let y = 0.5; y <= h; y += STEP, i++) {
                ctx.strokeStyle = slate(i % MAJOR === 0 ? 0.11 : 0.05);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Спонтанные волны — сетка живёт даже без курсора
            if (!s.ripples) s.ripples = [];
            if (!s.lastSpawn) s.lastSpawn = 0;
            if (now - s.lastSpawn > 1100) {
                s.lastSpawn = now;
                const gx = Math.round(Math.random() * (w / STEP / MAJOR)) * STEP * MAJOR;
                const gy = Math.round(Math.random() * (h / STEP / MAJOR)) * STEP * MAJOR;
                s.ripples.push({ x: gx, y: gy, born: now });
            }
            s.ripples = s.ripples.filter(r => now - r.born < 1600);

            // Узлы на пересечениях основных линий
            const majorStep = STEP * MAJOR;
            for (let gx = 0; gx <= w + 1; gx += majorStep) {
                for (let gy = 0; gy <= h + 1; gy += majorStep) {
                    // тихая «дышащая» подсветка узлов
                    const hash = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453;
                    const breathe = 0.5 + 0.5 * Math.sin(now / 1600 + hash);
                    ctx.fillStyle = slate(0.18 + breathe * 0.15);
                    ctx.beginPath();
                    ctx.arc(gx, gy, 1.6, 0, Math.PI * 2);
                    ctx.fill();

                    // курсор «будит» ближайшие узлы
                    if (pointer.active) {
                        const d = Math.hypot(pointer.x - gx, pointer.y - gy);
                        if (d < INFLUENCE) {
                            const k = 1 - d / INFLUENCE;
                            ctx.fillStyle = amber(0.25 + k * 0.75);
                            ctx.beginPath();
                            ctx.arc(gx, gy, 2 + k * 1.5, 0, Math.PI * 2);
                            ctx.fill();
                            // засечки по кресту, как на чертеже
                            ctx.strokeStyle = amber(0.3 + k * 0.5);
                            ctx.lineWidth = 1;
                            const tick = 4 + k * 4;
                            ctx.beginPath();
                            ctx.moveTo(gx - tick, gy); ctx.lineTo(gx + tick, gy);
                            ctx.moveTo(gx, gy - tick); ctx.lineTo(gx, gy + tick);
                            ctx.stroke();
                        }
                    }

                    // вспышка узлов от проходящей волны
                    for (const r of s.ripples) {
                        const age = now - r.born;
                        const ring = age * 0.14;
                        const dist = Math.hypot(gx - r.x, gy - r.y);
                        if (Math.abs(dist - ring) < 26) {
                            const fade = 1 - age / 1600;
                            ctx.fillStyle = amber(0.6 * fade);
                            ctx.beginPath();
                            ctx.arc(gx, gy, 2.4, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }

            // сами кольца волн
            for (const r of s.ripples) {
                const age = now - r.born;
                const ring = age * 0.14;
                const fade = 1 - age / 1600;
                ctx.strokeStyle = amber(0.28 * fade);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(r.x, r.y, ring, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
    }

    /* --- Эффект 2: «Сеть как печатная плата» (блок «Как мы работаем») --- */
    const pcbBg = document.querySelector('.bgfx--pcb');
    if (pcbBg) {
        const LINK_D = 150;      // макс. дистанция связи
        const CURSOR_R = 190;    // радиус влияния курсора
        const slate = (a) => `rgba(148, 163, 184, ${a})`;
        const amber = (a) => `rgba(245, 158, 11, ${a})`;

        bgEngine(pcbBg.closest('section'), (ctx, s, pointer, now) => {
            const { w, h } = s;
            ctx.clearRect(0, 0, w, h);
            if (!s.parts) s.parts = [];
            if (!s.pulses) s.pulses = [];

            // медленный дрейф + мягкое притяжение к курсору
            for (const p of s.parts) {
                if (pointer.active) {
                    const dx = pointer.x - p.x;
                    const dy = pointer.y - p.y;
                    const d = Math.hypot(dx, dy);
                    if (d > 40 && d < CURSOR_R) {
                        p.vx += (dx / d) * 0.012;
                        p.vy += (dy / d) * 0.012;
                    }
                }
                p.vx *= 0.985;
                p.vy *= 0.985;
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
                if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
            }

            // связи строго под 90° — дорожки платы с «переходными отверстиями»
            for (let a = 0; a < s.parts.length; a++) {
                for (let b = a + 1; b < s.parts.length; b++) {
                    const A = s.parts[a];
                    const B = s.parts[b];
                    const d = Math.hypot(A.x - B.x, A.y - B.y);
                    if (d > LINK_D) continue;
                    const base = (1 - d / LINK_D) * 0.16;
                    const mx = (A.x + B.x) / 2;
                    const my = (A.y + B.y) / 2;
                    let near = 0;
                    if (pointer.active) {
                        const dm = Math.hypot(pointer.x - mx, pointer.y - my);
                        if (dm < CURSOR_R) near = 1 - dm / CURSOR_R;
                    }
                    ctx.strokeStyle = near > 0
                        ? amber(base + near * 0.3)
                        : slate(base);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(A.x, A.y);
                    ctx.lineTo(B.x, A.y);
                    ctx.lineTo(B.x, B.y);
                    ctx.stroke();
                    if (base > 0.08) {
                        ctx.fillStyle = near > 0 ? amber(base + near * 0.2) : slate(base);
                        ctx.beginPath();
                        ctx.arc(B.x, A.y, 1.3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            // пэды (частицы)
            for (const p of s.parts) {
                let near = 0;
                if (pointer.active) {
                    const d = Math.hypot(pointer.x - p.x, pointer.y - p.y);
                    if (d < CURSOR_R) near = 1 - d / CURSOR_R;
                }
                ctx.fillStyle = near > 0 ? amber(0.35 + near * 0.65) : slate(0.4);
                ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
            }

            // импульсы, бегущие по дорожкам
            if (!s.lastPulse) s.lastPulse = 0;
            if (now - s.lastPulse > 700 && s.parts.length > 1) {
                s.lastPulse = now;
                const A = s.parts[Math.floor(Math.random() * s.parts.length)];
                const B = s.parts[Math.floor(Math.random() * s.parts.length)];
                if (A !== B && Math.hypot(A.x - B.x, A.y - B.y) < LINK_D) {
                    s.pulses.push({ A, B, born: now });
                }
            }
            s.pulses = s.pulses.filter(p => now - p.born < 900);
            for (const p of s.pulses) {
                const t = (now - p.born) / 900;
                const fade = Math.sin(Math.PI * t);
                const seg1 = Math.abs(p.B.x - p.A.x);
                const seg2 = Math.abs(p.B.y - p.A.y);
                const total = seg1 + seg2 || 1;
                const dist = t * total;
                let x, y;
                if (dist <= seg1) {
                    x = p.A.x + (p.B.x - p.A.x) * (seg1 ? dist / seg1 : 0);
                    y = p.A.y;
                } else {
                    x = p.B.x;
                    y = p.A.y + (p.B.y - p.A.y) * (seg2 ? (dist - seg1) / seg2 : 0);
                }
                ctx.fillStyle = amber(0.9 * fade);
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }, (s) => {
            // init / resize: засеять частицы
            const count = Math.max(24, Math.min(64, Math.round(s.w * s.h / 26000)));
            s.parts = Array.from({ length: count }, () => ({
                x: Math.random() * s.w,
                y: Math.random() * s.h,
                vx: (Math.random() - 0.5) * 0.24,
                vy: (Math.random() - 0.5) * 0.24
            }));
            s.pulses = [];
        });
    }
});
