// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Bingo grid interaction
    const bingoGrid = document.getElementById('bingoGrid');
    if (bingoGrid) {
        const bingoCells = bingoGrid.querySelectorAll('.bingo-cell');
        bingoCells.forEach(cell => {
            cell.addEventListener('click', () => {
                cell.classList.toggle('clicked');

                // Check for bingo
                checkBingo();
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / 800);
        }
    });

    // Track card hover effect
    const trackCards = document.querySelectorAll('.track-card, .project-card, .benefit-card');
    trackCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add particle effect to hero (optional)
    createParticles();
});

// Bingo checking function
function checkBingo() {
    const cells = Array.from(document.querySelectorAll('.bingo-cell'));
    const clicked = cells.map(cell => cell.classList.contains('clicked'));

    // Check rows (4x4 grid)
    for (let i = 0; i < 4; i++) {
        const row = clicked.slice(i * 4, (i + 1) * 4);
        if (row.every(val => val)) {
            celebrateBingo();
            return;
        }
    }

    // Check columns
    for (let i = 0; i < 4; i++) {
        const col = [clicked[i], clicked[i + 4], clicked[i + 8], clicked[i + 12]];
        if (col.every(val => val)) {
            celebrateBingo();
            return;
        }
    }

    // Check diagonals
    const diag1 = [clicked[0], clicked[5], clicked[10], clicked[15]];
    const diag2 = [clicked[3], clicked[6], clicked[9], clicked[12]];

    if (diag1.every(val => val) || diag2.every(val => val)) {
        celebrateBingo();
    }
}

function celebrateBingo() {
    // Create confetti effect
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    for (let i = 0; i < 50; i++) {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';

    document.body.appendChild(confetti);

    const fall = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    fall.onfinish = () => confetti.remove();
}

// Particle background effect
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(99, 102, 241, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';

        const duration = 10000 + Math.random() * 20000;
        const delay = Math.random() * 5000;

        particle.animate([
            {
                transform: 'translate(0, 0)',
                opacity: 0
            },
            {
                transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`,
                opacity: 1
            },
            {
                transform: `translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px)`,
                opacity: 0
            }
        ], {
            duration: duration,
            delay: delay,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });

        hero.appendChild(particle);
    }
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// Track scroll progress
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateScrollProgress();
            ticking = false;
        });
        ticking = true;
    }
});

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    // You can use this to show a progress bar if needed
    // console.log('Scroll progress:', scrollPercent);
}

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
        document.body.style.filter = 'none';
    }, 3000);

    alert('🎮 히든 미션 발견! AIM의 숨겨진 재능을 찾았습니다! 🎉');
}
