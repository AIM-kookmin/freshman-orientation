// Slide Management
let currentSlide = 1;
const totalSlides = 9;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSlides();
    initNavigation();
    initKeyboardControls();
    initTouchControls();
    initWheelControl();
});

function initSlides() {
    // Create slide dots
    const dotsContainer = document.querySelector('.slide-dots');
    for (let i = 1; i <= totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'slide-dot';
        if (i === 1) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    // Show first slide
    showSlide(1);
}

function initNavigation() {
    updateSlideCounter();
}

function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(1);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides);
        } else if (e.key >= '1' && e.key <= '9') {
            const slideNum = parseInt(e.key);
            if (slideNum <= totalSlides) {
                goToSlide(slideNum);
            }
        }
    });
}

function initTouchControls() {
    let touchStartY = 0;
    let touchStartX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const diffY = touchStartY - touchEndY;
        const diffX = touchStartX - touchEndX;

        // Vertical swipe
        if (Math.abs(diffY) > Math.abs(diffX)) {
            if (Math.abs(diffY) > 50) {
                if (diffY > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        // Horizontal swipe
        else {
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    });
}

function initWheelControl() {
    let isScrolling = false;

    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;

        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, 800);

        if (e.deltaY > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }, { passive: true });
}

function showSlide(n) {
    // Bounds check
    if (n < 1) n = 1;
    if (n > totalSlides) n = totalSlides;

    currentSlide = n;

    // Update slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (index + 1 === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Update dots
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update counter
    updateSlideCounter();

    // Update navigation color based on slide background
    updateNavColor();
}

function updateSlideCounter() {
    const currentSlideEl = document.querySelector('.current-slide');
    currentSlideEl.textContent = String(currentSlide).padStart(2, '0');
}

function updateNavColor() {
    const currentSlideEl = document.querySelector('.slide.active');
    const nav = document.querySelector('.slide-nav');

    if (currentSlideEl.classList.contains('dark')) {
        nav.style.color = '#ffffff';
    } else {
        nav.style.color = '#000000';
    }

    // Update dots color
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach(dot => {
        if (currentSlideEl.classList.contains('dark')) {
            if (!dot.classList.contains('active')) {
                dot.style.background = '#ffffff';
            }
        } else {
            if (!dot.classList.contains('active')) {
                dot.style.background = '#000000';
            }
        }
    });
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        showSlide(currentSlide - 1);
    }
}

function goToSlide(n) {
    showSlide(n);
}

// Prevent default scroll behavior
window.addEventListener('scroll', (e) => {
    window.scrollTo(0, 0);
});

// Update navigation on page load
window.addEventListener('load', () => {
    updateNavColor();
});

// Animation triggers
function animateSlideContent() {
    const activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) return;

    const elements = activeSlide.querySelectorAll('.slide-content > *');
    elements.forEach((el, index) => {
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = '';
        }, 10);
    });
}

// Re-trigger animations on slide change
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            const target = mutation.target;
            if (target.classList.contains('active') && target.classList.contains('slide')) {
                animateSlideContent();
            }
        }
    });
});

document.querySelectorAll('.slide').forEach(slide => {
    observer.observe(slide, { attributes: true });
});

// Preload next slide images (if any)
function preloadNextSlide() {
    if (currentSlide < totalSlides) {
        const nextSlide = document.querySelector(`.slide[data-slide="${currentSlide + 1}"]`);
        if (nextSlide) {
            const images = nextSlide.querySelectorAll('img');
            images.forEach(img => {
                const src = img.getAttribute('src');
                if (src) {
                    const preloadImg = new Image();
                    preloadImg.src = src;
                }
            });
        }
    }
}

// Call preload on slide change
document.addEventListener('DOMContentLoaded', () => {
    setInterval(preloadNextSlide, 1000);
});

// Fullscreen toggle (F key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

// ESC to exit fullscreen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
    }
});

// Add presentation mode info
console.log(`
╔══════════════════════════════════════╗
║   AIM 2026 Presentation Controls    ║
╠══════════════════════════════════════╣
║  Arrow Keys / Space  : Navigate      ║
║  1-9                 : Jump to slide ║
║  Home / End          : First / Last  ║
║  F                   : Fullscreen    ║
║  ESC                 : Exit          ║
╚══════════════════════════════════════╝
`);
