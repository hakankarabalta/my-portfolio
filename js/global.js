// ===================================
// GLOBAL JAVASCRIPT
// Shared utilities and scroll handling
// ===================================

// Track last scroll position
let lastScrollTop = 0;

// Handle scroll events for navbar shadow
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    lastScrollTop = scrollTop;
}

// Initialize smooth scrolling for anchor links
function initSmoothScroll() {
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
}

// Utility: Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Load component scripts dynamically (if needed)
function loadComponentScripts() {
    const scripts = [
        'js/navbar.js',
        'js/skills.js'
        // Add other component scripts here as needed
        // 'js/projects.js',
        // 'js/contact.js',
        // etc.
    ];
    
    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
    });
}

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize global features
    initSmoothScroll();
    window.addEventListener('scroll', handleScroll);
    
    // Check scroll position on initial load
    handleScroll();
});

// ===================================
// EXPORTS (For use in other files)
// ===================================

window.GlobalUtils = {
    isElementInViewport,
    handleScroll
};
