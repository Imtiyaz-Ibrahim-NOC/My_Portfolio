/**
 * Renderer Module
 * Reusable rendering functions for dynamic content
 */

const Renderer = {
    /**
     * Render a loading spinner
     * @returns {string} HTML string
     */
    loadingSpinner() {
        return '<div class="loading"><div class="spinner"></div></div>';
    },
    
    /**
     * Render an error message
     * @param {string} message - Error message
     * @returns {string} HTML string
     */
    errorMessage(message = 'Failed to load content') {
        return `<div class="no-results">${Utils.sanitizeHTML(message)}</div>`;
    },
    
    /**
     * Render a no results message
     * @param {string} message - Message to display
     * @returns {string} HTML string
     */
    noResults(message = 'No items found') {
        return `<div class="no-results">${Utils.sanitizeHTML(message)}</div>`;
    },
    
    /**
     * Render social link icon
     * @param {string} platform - Social platform name
     * @param {string} url - Profile URL
     * @returns {string} HTML string
     */
    socialLink(platform, url) {
        const iconKey = platform.toLowerCase();
        const icon = Utils.icons[iconKey] || Utils.icons.globe;
        const label = platform.charAt(0).toUpperCase() + platform.slice(1);
        
        return `
            <a href="${url}" 
               class="social-link" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="${label}">
                ${icon}
            </a>
        `;
    },
    
    /**
     * Render project card
     * @param {Object} project - Project data object
     * @returns {string} HTML string
     */
    projectCard(project) {
        const imageHtml = project.image 
            ? `<img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">`
            : '';
        
        const tagsHtml = project.tags
            .map(tag => `<span class="project-tag">${Utils.sanitizeHTML(tag)}</span>`)
            .join('');
        
        const demoLinkHtml = project.demoLink 
            ? `<a href="${project.demoLink}" class="project-link" target="_blank" rel="noopener noreferrer">
                 ${Utils.icons.globe} Live Demo
               </a>` 
            : '';
        
        const githubLinkHtml = project.githubLink 
            ? `<a href="${project.githubLink}" class="project-link" target="_blank" rel="noopener noreferrer">
                 ${Utils.icons.github2} View Code
               </a>` 
            : '';
        
        return `
            <article class="project-card" data-id="${project.id}">
                ${imageHtml}
                <div class="project-content">
                    <h3 class="project-title">${Utils.sanitizeHTML(project.title)}</h3>
                    <p class="project-description">${Utils.sanitizeHTML(project.description)}</p>
                    <div class="project-tags">${tagsHtml}</div>
                    <div class="project-links">
                        ${demoLinkHtml}
                        ${githubLinkHtml}
                    </div>
                </div>
            </article>
        `;
    },
    
    /**
     * Render blog card
     * @param {Object} blog - Blog data object
     * @returns {string} HTML string
     */
    blogCard(blog) {
        const imageHtml = blog.image 
            ? `<img src="${blog.image}" alt="${blog.title}" class="blog-image" loading="lazy">`
            : '';
        
        return `
            <article class="blog-card" data-id="${blog.id}" onclick="window.location.href='blog.html?id=${blog.id}'">
                ${imageHtml}
                <div class="blog-content">
                    <span class="blog-category">${Utils.sanitizeHTML(blog.category)}</span>
                    <h3 class="blog-title">${Utils.sanitizeHTML(blog.title)}</h3>
                    <p class="blog-description">${Utils.sanitizeHTML(blog.description)}</p>
                    <div class="blog-meta">
                        <span>${Utils.icons.calendar} ${Utils.formatDate(blog.date)}</span>
                        <span>${Utils.icons.clock} ${blog.readTime}</span>
                    </div>
                </div>
            </article>
        `;
    },
    
    /**
     * Render certificate card
     * @param {Object} cert - Certificate data object
     * @returns {string} HTML string
     */
    certificateCard(cert) {
        const imageHtml = cert.image 
            ? `<img src="${cert.image}" alt="${cert.title}" class="certificate-image" loading="lazy">`
            : '';
        
        const linkHtml = cert.link 
            ? `<a href="${cert.link}" class="certificate-link" target="_blank" rel="noopener noreferrer">
                 ${Utils.icons.external} Verify Certificate
               </a>` 
            : '';
        
        return `
            <article class="certificate-card">
                ${imageHtml}
                <div class="certificate-content">
                    <h3 class="certificate-title">${Utils.sanitizeHTML(cert.title)}</h3>
                    <p class="certificate-issuer">${Utils.sanitizeHTML(cert.issuer)}</p>
                    ${linkHtml}
                </div>
            </article>
        `;
    },
    
    /**
     * Render skill category
     * @param {Object} category - Skill category object
     * @returns {string} HTML string
     */
    skillCategory(category) {
        const skillsHtml = category.skills
            .map(skill => this.skillBar(skill))
            .join('');
        
        return `
            <div class="skill-category">
                <h3 class="skill-category-title">
                    ${Utils.icons[category.icon] || ''}
                    ${Utils.sanitizeHTML(category.name)}
                </h3>
                <div class="skill-list">
                    ${skillsHtml}
                </div>
            </div>
        `;
    },
    
    /**
     * Render skill progress bar
     * @param {Object} skill - Skill object with name and percentage
     * @returns {string} HTML string
     */
    skillBar(skill) {
        return `
            <div class="skill-item">
                <div class="skill-header">
                    <span class="skill-name">${Utils.sanitizeHTML(skill.name)}</span>
                    <span class="skill-percentage">${skill.percentage}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" data-percentage="${skill.percentage}" style="width: 0%"></div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render filter tag button
     * @param {string} tag - Tag name
     * @param {boolean} isActive - Whether tag is active
     * @param {string} type - Filter type (tag or category)
     * @returns {string} HTML string
     */
    filterTag(tag, isActive = false, type = 'tag') {
        const className = type === 'category' ? 'filter-category' : 'filter-tag';
        const activeClass = isActive ? 'active' : '';
        return `<button class="${className} ${activeClass}" data-value="${tag}">${tag}</button>`;
    },
    
    /**
     * Render contact info item
     * @param {Object} info - Contact info object
     * @returns {string} HTML string
     */
    contactInfoItem(info) {
        const icon = Utils.icons[info.icon] || '';
        
        let valueHtml;
        if (info.type === 'email') {
            valueHtml = `<a href="mailto:${info.value}">${info.value}</a>`;
        } else if (info.type === 'phone') {
            valueHtml = `<a href="tel:${info.value.replace(/\s/g, '')}">${info.value}</a>`;
        } else {
            valueHtml = `<p>${info.value}</p>`;
        }
        
        return `
            <div class="contact-item">
                <div class="contact-icon">${icon}</div>
                <div class="contact-details">
                    <h4>${info.label}</h4>
                    ${valueHtml}
                </div>
            </div>
        `;
    },
    
    /**
     * Render highlight item
     * @param {Object} highlight - Highlight object with number and label
     * @returns {string} HTML string
     */
    highlightItem(highlight) {
        return `
            <div class="highlight-item">
                <div class="highlight-number">${highlight.number}</div>
                <div class="highlight-label">${Utils.sanitizeHTML(highlight.label)}</div>
            </div>
        `;
    },
    
    /**
     * Render grid of items
     * @param {Array} items - Array of items to render
     * @param {Function} renderFn - Function to render each item
     * @param {string} emptyMessage - Message when no items
     * @returns {string} HTML string
     */
    renderGrid(items, renderFn, emptyMessage = 'No items found') {
        if (!items || items.length === 0) {
            return this.noResults(emptyMessage);
        }
        return items.map(renderFn).join('');
    },
    
    /**
     * Render filter buttons
     * @param {Array} items - Array of filter items
     * @param {string} allLabel - Label for "All" button
     * @param {string} type - Filter type
     * @returns {string} HTML string
     */
    renderFilters(items, allLabel = 'All', type = 'tag') {
        const allButton = this.filterTag(allLabel, true, type);
        const itemButtons = items.map(item => this.filterTag(item, false, type));
        return allButton + itemButtons.join('');
    },
    
    /**
     * Animate skill progress bars
     * @param {string} selector - CSS selector for progress bars
     */
    animateSkillBars(selector = '.skill-progress') {
        const bars = document.querySelectorAll(selector);
        
        bars.forEach(bar => {
            const percentage = bar.dataset.percentage;
            if (percentage) {
                // Small delay for visual effect
                setTimeout(() => {
                    bar.style.width = `${percentage}%`;
                }, 100);
            }
        });
    },
    
    /**
     * Render footer links
     * @param {Object} social - Social links object
     * @returns {string} HTML string
     */
    footerLinks(social) {
        const links = [];
        
        if (social.github) {
            links.push(`<a href="${social.github}" class="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>`);
        }
        if (social.linkedin) {
            links.push(`<a href="${social.linkedin}" class="footer-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>`);
        }
        if (social.twitter) {
            links.push(`<a href="${social.twitter}" class="footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>`);
        }
        
        return links.join('');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
}
