/**
 * Contact Module
 * Handles contact section content rendering and form submission
 */

const Contact = {
    /**
     * Initialize contact section
     */
    async init() {
        this.infoContainer = document.getElementById('contact-info');
        this.form = document.getElementById('contact-form');
        
        try {
            const profile = await DataLoader.loadProfile();
            this.renderContactInfo(profile.contact, profile.resumeLink);
            this.bindEvents();
        } catch (error) {
            console.error('Error loading contact info:', error);
            this.renderError();
        }
    },
    
    /**
     * Render contact information
     * @param {Object} contact - Contact data
     * @param {string} resumeLink - Resume download link
     */
    renderContactInfo(contact, resumeLink) {
        if (!this.infoContainer || !contact) return;
        
        let html = '';
        
        // Render contact info items
        if (contact.info && contact.info.length > 0) {
            contact.info.forEach(info => {
                html += Renderer.contactInfoItem(info);
            });
        }
        
        // Add resume download button if link exists
        if (resumeLink) {
            html += `
                <div class="resume-download">
                    <a href="${resumeLink}" class="btn btn-primary" download>
                        ${Utils.icons.download} Download Resume
                    </a>
                </div>
            `;
        }
        
        this.infoContainer.innerHTML = html;
    },
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },
    
    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate form data
        if (!this.validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `${Utils.icons.check} Sending...`;
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showSuccessMessage();
            this.form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
        
        // For actual implementation, use a service like:
        // - Formspree: https://formspree.io
        // - Netlify Forms
        // - EmailJS
        // - Your own backend API
        
        /*
        // Example using fetch to your API:
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            this.showSuccessMessage();
            this.form.reset();
        })
        .catch(error => {
            this.showErrorMessage();
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
        */
    },
    
    /**
     * Validate form data
     * @param {Object} data - Form data
     * @returns {boolean} Whether form is valid
     */
    validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Please enter a valid name');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }
        
        return true;
    },
    
    /**
     * Validate email address
     * @param {string} email - Email address
     * @returns {boolean} Whether email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * Show success message
     */
    showSuccessMessage() {
        alert('Thank you for your message! I will get back to you soon.');
    },
    
    /**
     * Show error message
     */
    showErrorMessage() {
        alert('Sorry, there was an error sending your message. Please try again later.');
    },
    
    /**
     * Render error state
     */
    renderError() {
        if (this.infoContainer) {
            this.infoContainer.innerHTML = Renderer.errorMessage('Failed to load contact information');
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Contact.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Contact;
}
