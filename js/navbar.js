// ===================================
// NAVBAR COMPONENT JAVASCRIPT
// Handles navigation, mobile menu, and active link highlighting
// ===================================

class Navbar {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navOverlay = document.querySelector('.nav-overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        if (!this.hamburger || !this.navMenu) {
            console.warn('Navbar elements not found');
            return;
        }
        
        this.bindEvents();
        this.updateActiveLink();
    }
    
    bindEvents() {
        // Toggle hamburger menu
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking overlay
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => this.closeMenu());
        }
        
        // Close menu when clicking nav link (mobile)
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    }
    
    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        if (this.navOverlay) {
            this.navOverlay.classList.toggle('active');
        }
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        if (this.navOverlay) {
            this.navOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }
}

// ===================================
// INITIALIZE
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});
