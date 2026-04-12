/**
 * Skills Module
 * Handles skills section content rendering and progress bar animations
 */

const Skills = {
    /**
     * Initialize skills section
     */
    async init() {
        this.container = document.getElementById('skills-content');
        if (!this.container) return;
        
        try {
            const data = await DataLoader.loadSkills();
            this.render(data.categories);
            this.setupAnimations();
        } catch (error) {
            console.error('Error loading skills:', error);
            this.renderError();
        }
    },
    
    /**
     * Render skills content
     * @param {Array} categories - Array of skill categories
     */
    render(categories) {
        if (!categories || categories.length === 0) {
            this.container.innerHTML = Renderer.noResults('No skills found');
            return;
        }
        
        const html = categories
            .map(category => Renderer.skillCategory(category))
            .join('');
        
        this.container.innerHTML = html;
    },
    
    /**
     * Setup scroll animations for skill bars
     */
    setupAnimations() {
        // Use Intersection Observer to animate skill bars when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate skill bars within this category
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach((bar, index) => {
                        const percentage = bar.dataset.percentage;
                        if (percentage) {
                            // Stagger animations
                            setTimeout(() => {
                                bar.style.width = `${percentage}%`;
                            }, index * 100);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe each skill category
        document.querySelectorAll('.skill-category').forEach(category => {
            observer.observe(category);
        });
    },
    
    /**
     * Render error state
     */
    renderError() {
        this.container.innerHTML = Renderer.errorMessage('Failed to load skills');
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Skills.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Skills;
}
