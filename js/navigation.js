/**
 * Navigation Module
 * Handles navbar functionality, mobile menu, scroll behavior, and theme
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
        this.themeToggle = document.getElementById('theme-toggle');

        // ✅ Load saved theme FIRST
        this.loadTheme();

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

        // ✅ Theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
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

        // Navbar shadow
        if (this.navbar) {
            if (scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }

        // Back to top button
        if (this.backToTop) {
            if (scrollY > 500) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        }
    },

    /**
     * Highlight active section
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
     * Handle nav click
     */
    handleNavClick(e) {
        const href = e.target.getAttribute('href');

        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                Utils.scrollTo(target);
            }
        }
    },

    /**
     * Set active link manually
     */
    setActiveLink(href) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    },

    /**
     * ✅ Toggle theme
     */
    toggleTheme() {
        document.body.classList.toggle('dark');

        const isDark = document.body.classList.contains('dark');

        // Save to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    },

    /**
     * ✅ Load theme on page load
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}