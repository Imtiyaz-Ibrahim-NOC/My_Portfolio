/**
 * Main Module
 * Initializes the application and handles global functionality
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        this.initTheme();
        this.initFooter();
        this.initSmoothScroll();
        this.initRevealAnimations();
    },
    
    /**
     * Initialize theme (dark/light mode)
     */
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        
        // Check for saved theme preference or default to 'light'
        const savedTheme = Utils.storage.get('theme', 'light');
        this.setTheme(savedTheme);
        
        // Theme toggle click handler
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
                Utils.storage.set('theme', newTheme);
            });
        }
        
        // Check for system preference
        if (window.matchMedia && !Utils.storage.get('theme')) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (darkModeQuery.matches) {
                this.setTheme('dark');
            }
            
            // Listen for system theme changes
            darkModeQuery.addEventListener('change', (e) => {
                if (!Utils.storage.get('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    },
    
    /**
     * Set theme
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    },
    
    /**
     * Initialize footer content
     */
    async initFooter() {
        const yearEl = document.getElementById('footer-year');
        const nameEl = document.getElementById('footer-name');
        const linksEl = document.getElementById('footer-links');
        
        // Set current year
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
        
        // Load profile data for name and links
        try {
            const profile = await DataLoader.loadProfile();
            
            if (nameEl) {
                nameEl.textContent = profile.name;
            }
            
            if (linksEl && profile.social) {
                linksEl.innerHTML = Renderer.footerLinks(profile.social);
            }
        } catch (error) {
            console.error('Error loading footer data:', error);
            if (nameEl) {
                nameEl.textContent = 'Portfolio';
            }
        }
    },
    
    /**
     * Initialize smooth scroll for anchor links
     */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    Utils.scrollTo(href);
                }
            });
        });
    },
    
    /**
     * Initialize reveal animations for sections
     */
    initRevealAnimations() {
        // Add reveal class to sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('reveal');
        });
        
        // Observe sections for reveal animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    },
    
    /**
     * Show loading state
     * @param {Element} element - Element to show loading in
     */
    showLoading(element) {
        if (element) {
            element.innerHTML = Renderer.loadingSpinner();
        }
    },
    
    /**
     * Hide loading state
     * @param {Element} element - Element to clear
     */
    hideLoading(element) {
        if (element) {
            element.innerHTML = '';
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
