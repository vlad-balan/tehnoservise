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
});
