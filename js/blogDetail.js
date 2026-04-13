/**
 * Blog Detail Module
 * Handles blog post detail page rendering
 */

const BlogDetail = {
    /**
     * Initialize blog detail page
     */
    async init() {
        this.blogId = Utils.getUrlParam('id');
        
        if (!this.blogId) {
            this.renderError('No blog ID provided');
            return;
        }
        
        try {
            const blog = await DataLoader.getBlogById(this.blogId);
            
            if (!blog) {
                this.renderError('Blog post not found');
                return;
            }
            
            this.render(blog);
            this.updatePageTitle(blog);
        } catch (error) {
            console.error('Error loading blog post:', error);
            this.renderError('Failed to load blog post');
        }
    },
    
    /**
     * Render blog post content
     * @param {Object} blog - Blog data object
     */
    render(blog) {
        // Render category
        const categoryEl = document.getElementById('blog-post-category');
        if (categoryEl) {
            categoryEl.textContent = blog.category;
        }
        
        // Render title
        const titleEl = document.getElementById('blog-post-title');
        if (titleEl) {
            titleEl.textContent = blog.title;
        }
        
        // Render meta information
        const metaEl = document.getElementById('blog-post-meta');
        if (metaEl) {
            metaEl.innerHTML = `
                <span>${Utils.icons.calendar} ${Utils.formatDate(blog.date)}</span>
                <span>${Utils.icons.clock} ${blog.readTime}</span>
                <span>${Utils.icons.user} ${blog.author}</span>
            `;
        }
        
        // Render featured image
        const imageContainer = document.getElementById('blog-post-image-container');
        if (imageContainer) {
            if (blog.image) {
                imageContainer.innerHTML = `<img src="${blog.image}" alt="${blog.title}">`;
            } else {
                imageContainer.style.display = 'none';
            }
        }
        
        // Render content
        const contentEl = document.getElementById('blog-post-content');
        if (contentEl) {
            contentEl.innerHTML = blog.content;
        }
    },
    
    /**
     * Update page title
     * @param {Object} blog - Blog data object
     */
    updatePageTitle(blog) {
        document.title = `${blog.title} - Blog`;
    },
    
    /**
     * Render error state
     * @param {string} message - Error message
     */
    renderError(message) {
        const contentEl = document.getElementById('blog-post-content');
        if (contentEl) {
            contentEl.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 4rem 2rem;">
                    <h2 style="margin-bottom: 1rem; color: var(--text-primary);">Oops!</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">${message}</p>
                    <a href="index.html?scroll=blogs" class="btn btn-primary">Back to Blog</a>
                </div>
            `;
        }
        
        // Hide other elements
        const elementsToHide = [
            document.getElementById('blog-post-category'),
            document.getElementById('blog-post-meta'),
            document.getElementById('blog-post-image-container')
        ];
        
        elementsToHide.forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        const titleEl = document.getElementById('blog-post-title');
        if (titleEl) {
            titleEl.textContent = 'Error';
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    BlogDetail.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogDetail;
}