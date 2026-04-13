/**
 * Hero Module
 * Handles hero section content rendering and interactions
 */

const Hero = {
    /**
     * Initialize hero section
     */
    async init() {
        this.container = document.getElementById('hero');
        if (!this.container) return;
        
        try {
            const profile = await DataLoader.loadProfile();
            this.render(profile);
        } catch (error) {
            console.error('Error loading hero content:', error);
            this.renderError();
        }
    },
    
    /**
     * Render hero content
     * @param {Object} profile - Profile data
     */
    render(profile) {
        // Update page title
        document.title = `${profile.name} - ${profile.title}`;
        
        // Render name
        const nameEl = document.getElementById('hero-name');
        if (nameEl) {
            nameEl.textContent = profile.name;
        }
        
        // Render title
        const titleEl = document.getElementById('hero-title');
        if (titleEl) {
            titleEl.textContent = profile.title;
        }
        
        // Render description
        const descEl = document.getElementById('hero-description');
        if (descEl) {
            descEl.textContent = profile.description;
        }
        
        // Render social links
        this.renderSocialLinks(profile.social);
        
        // Render profile image
        this.renderProfileImage(profile.profileImage, profile.name);
        
        // Update nav logo
        const navLogo = document.getElementById('nav-logo');
        if (navLogo) {
            navLogo.textContent = profile.name.split(' ')[0];
        }
    },
    
    /**
     * Render social links
     * @param {Object} social - Social links object
     */
    renderSocialLinks(social) {
        const container = document.getElementById('hero-social');
        if (!container || !social) return;
        
        const links = [];
        
        if (social.github) {
            links.push(Renderer.socialLink('github', social.github));
        }
        if (social.linkedin) {
            links.push(Renderer.socialLink('linkedin', social.linkedin));
        }
        if (social.twitter) {
            links.push(Renderer.socialLink('twitter', social.twitter));
        }
        if (social.portfolio) {
            links.push(Renderer.socialLink('globe', social.portfolio));
        }
        
        container.innerHTML = links.join('');
    },
    
    /**
     * Render profile image
     * @param {string} imageUrl - Image URL
     * @param {string} alt - Alt text
     */
    renderProfileImage(imageUrl, alt) {
        const container = document.getElementById('hero-image-container');
        if (!container) return;
        
        if (imageUrl) {
            container.innerHTML = `
                <img src="${imageUrl}" 
                     alt="${alt}" 
                     class="profile-image"
                     loading="eager">
            `;
        } else {
            // Render placeholder or initials
            const initials = alt.split(' ').map(n => n[0]).join('').toUpperCase();
            container.innerHTML = `
                <div class="profile-image" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--accent-gradient);
                    color: white;
                    font-size: 4rem;
                    font-weight: 700;
                ">${initials}</div>
            `;
        }
        
    },
    
    /**
     * Render error state
     */
    renderError() {
        const nameEl = document.getElementById('hero-name');
        if (nameEl) nameEl.textContent = 'Welcome';
        
        const titleEl = document.getElementById('hero-title');
        if (titleEl) titleEl.textContent = 'Developer Portfolio';
        
        const descEl = document.getElementById('hero-description');
        if (descEl) descEl.textContent = 'Building amazing things with code.';
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Hero.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Hero;
}