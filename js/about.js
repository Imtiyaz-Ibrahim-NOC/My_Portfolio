/**
 * About Module
 * Handles about section content rendering
 */

const About = {
    /**
     * Initialize about section
     */
    async init() {
        this.container = document.getElementById('about-content');
        if (!this.container) return;
        
        try {
            const profile = await DataLoader.loadProfile();
            this.render(profile.about);
        } catch (error) {
            console.error('Error loading about content:', error);
            this.renderError();
        }
    },
    
    /**
     * Render about content
     * @param {Object} about - About data
     */
    render(about) {
        if (!about) return;
        
        let html = '';
        
        // Add summary if available
        if (about.summary) {
            html += `<p class="about-text">${Utils.sanitizeHTML(about.summary)}</p>`;
        }
        
        // Add paragraphs
        if (about.paragraphs && about.paragraphs.length > 0) {
            about.paragraphs.forEach(paragraph => {
                html += `<p class="about-text">${Utils.sanitizeHTML(paragraph)}</p>`;
            });
        }
        
        // Add highlights if available
        if (about.highlights && about.highlights.length > 0) {
            const highlightsHtml = about.highlights
                .map(h => Renderer.highlightItem(h))
                .join('');
            
            html += `<div class="about-highlights">${highlightsHtml}</div>`;
        }
        
        this.container.innerHTML = html;
        
        // Add reveal animation
        Utils.observeElements('.about-text, .highlight-item', 'active', {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    },
    
    /**
     * Render error state
     */
    renderError() {
        this.container.innerHTML = `
            <p class="about-text">
                Passionate developer with expertise in building modern web applications 
                and data solutions. Always eager to learn and create impactful projects.
            </p>
        `;
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    About.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = About;
}
