/**
 * Navigation Module
 * Handles navbar functionality, mobile menu, and scroll behavior
 */

const Navigation = {
    /**
     * Initialize navigation
     */
    init() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.backToTop = document.getElementById('back-to-top');
        
        this.bindEvents();
        this.handleScroll();
        this.highlightActiveSection();
    },
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.closeMobileMenu();
                this.handleNavClick(e);
            });
        });
        
        // Scroll events
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
            this.highlightActiveSection();
        }, 100));
        
        // Back to top button
        if (this.backToTop) {
            this.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });
    },
    
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    },
    
    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    /**
     * Handle scroll effects
     */
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add scrolled class to navbar
        if (this.navbar) {
            if (scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }
        
        // Show/hide back to top button
        if (this.backToTop) {
            if (scrollY > 500) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        }
    },
    
    /**
     * Highlight active section in navbar
     */
    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        const offset = 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    },
    
    /**
     * Handle navigation link click
     * @param {Event} e - Click event
     */
    handleNavClick(e) {
        const href = e.target.getAttribute('href');
        
        // Only handle internal links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                Utils.scrollTo(target);
            }
        }
    },
    
    /**
     * Set active link by href
     * @param {string} href - Link href to activate
     */
    setActiveLink(href) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}
