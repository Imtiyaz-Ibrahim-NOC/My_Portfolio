/**
 * Certificates Module
 * Handles certificates section content rendering
 */

const Certificates = {
    /**
     * Initialize certificates section
     */
    async init() {
        this.container = document.getElementById('certificates-grid');
        if (!this.container) return;
        
        try {
            const data = await DataLoader.loadCertificates();
            this.render(data.certificates);
        } catch (error) {
            console.error('Error loading certificates:', error);
            this.renderError();
        }
    },
    
    /**
     * Render certificates grid
     * @param {Array} certificates - Array of certificate objects
     */
    render(certificates) {
        if (!certificates || certificates.length === 0) {
            this.container.innerHTML = Renderer.noResults('No certificates found');
            return;
        }
        
        const html = certificates
            .map(cert => Renderer.certificateCard(cert))
            .join('');
        
        this.container.innerHTML = html;
        
        // Setup lazy loading for images
        Utils.lazyLoadImages('.certificate-image[data-src]');
        
        // Add reveal animation
        Utils.observeElements('.certificate-card', 'active', {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    },
    
    /**
     * Render error state
     */
    renderError() {
        this.container.innerHTML = Renderer.errorMessage('Failed to load certificates');
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Certificates.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Certificates;
}
