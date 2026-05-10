/**
 * Main JavaScript File
 * Laser & Photonics Engineering Platform
 */

// ============================================
// Notification System
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Contact Form Handler
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelectorAll('input[type="text"]')[1].value;
        const message = this.querySelector('textarea').value;

        // Validate
        if (!name || !email || !subject || !message) {
            showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('البريد الإلكتروني غير صحيح', 'error');
            return;
        }

        // Show success message
        showNotification('تم إرسال رسالتك بنجاح! شكراً لك 🎉', 'success');

        // Log form data (in real app, send to server)
        console.log({
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });

        // Reset form
        this.reset();
    });
}

// ============================================
// Smooth Scroll Navigation
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ============================================
// Navbar Active Link
// ============================================

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============================================
// Particles Background Animation
// ============================================

function createParticlesAnimation() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;

    const particlesCount = 50;
    const particles = [];

    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            background: ${Math.random() > 0.5 ? '#e74c3c' : '#3498db'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: float ${Math.random() * 20 + 10}s linear infinite;
            box-shadow: 0 0 ${Math.random() * 15}px currentColor;
        `;
        heroParticles.appendChild(particle);
        particles.push({
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }
}

// ============================================
// Intersection Observer for Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards
document.querySelectorAll('.theory-card, .app-card, .visualization-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ============================================
// Add CSS Animations to Document
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100px);
            opacity: 0;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    .nav-link.active {
        color: #e74c3c;
        border-bottom: 3px solid #e74c3c;
    }

    .notification-success {
        background: #2ecc71 !important;
    }

    .notification-error {
        background: #e74c3c !important;
    }
`;
document.head.appendChild(style);

// ============================================
// Initialize on Page Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 منصة هندسة الليزر والإلكترونيات البصرية');
    console.log('📡 تم تحميل جميع المكونات بنجاح');
    
    createParticlesAnimation();
    updateActiveNav();
    
    // Show welcome message
    showNotification('🎉 أهلاً وسهلاً بك في منصة الليزر والإلكترونيات البصرية!', 'success');
});

// ============================================
// Performance Optimization
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for focus on first form input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const firstInput = document.querySelector('input');
        if (firstInput) firstInput.focus();
    }

    // Escape to close any modals or notifications
    if (e.key === 'Escape') {
        document.querySelectorAll('.notification').forEach(n => n.remove());
    }
});

// ============================================
// Mobile Menu Toggle (for future expansion)
// ============================================

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// ============================================
// Dark Mode / Light Mode (Future Feature)
// ============================================

function toggleTheme() {
    document.documentElement.style.colorScheme = 
        document.documentElement.style.colorScheme === 'dark' ? 'light' : 'dark';
}

// ============================================
// Scroll to Top Button (Future Feature)
// ============================================

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show scroll to top button when scrolling down
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        // Scroll to top button visible
    } else {
        // Scroll to top button hidden
    }
});

// ============================================
// Console Easter Egg
// ============================================

console.log('%c🔴 هندسة الليزر والإلكترونيات البصرية', 
    'color: #e74c3c; font-size: 20px; font-weight: bold;');
console.log('%cمنصة تعليمية متقدمة لدراسة الانتشار الضوئي', 
    'color: #3498db; font-size: 14px;');
console.log('%c📡 شكراً لاستخدامك هذه المنصة!', 
    'color: #f39c12; font-size: 12px;');
