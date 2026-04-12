/**
 * Blogs Module
 * Handles blogs section with search and category filtering
 */

const Blogs = {
    /**
     * Initialize blogs section
     */
    async init() {
        this.container = document.getElementById('blogs-grid');
        this.searchInput = document.getElementById('blog-search');
        this.categoriesContainer = document.getElementById('blog-categories');
        
        if (!this.container) return;
        
        this.allBlogs = [];
        this.filteredBlogs = [];
        this.allCategories = [];
        this.activeCategory = 'All';
        this.searchQuery = '';
        
        try {
            const data = await DataLoader.loadBlogs();
            this.allBlogs = data.blogs || [];
            this.filteredBlogs = [...this.allBlogs];
            this.allCategories = await DataLoader.getBlogCategories();
            
            this.renderCategories();
            this.renderBlogs();
            this.bindEvents();
        } catch (error) {
            console.error('Error loading blogs:', error);
            this.renderError();
        }
    },
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.filterBlogs();
            }, 300));
        }
        
        // Category filters (event delegation)
        if (this.categoriesContainer) {
            this.categoriesContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-category')) {
                    this.activeCategory = e.target.dataset.value;
                    this.updateActiveCategory();
                    this.filterBlogs();
                }
            });
        }
    },
    
    /**
     * Render category filters
     */
    renderCategories() {
        if (!this.categoriesContainer) return;
        this.categoriesContainer.innerHTML = Renderer.renderFilters(this.allCategories, 'All', 'category');
    },
    
    /**
     * Update active category styling
     */
    updateActiveCategory() {
        const categories = this.categoriesContainer.querySelectorAll('.filter-category');
        categories.forEach(cat => {
            if (cat.dataset.value === this.activeCategory) {
                cat.classList.add('active');
            } else {
                cat.classList.remove('active');
            }
        });
    },
    
    /**
     * Filter blogs based on search query and active category
     */
    filterBlogs() {
        this.filteredBlogs = this.allBlogs.filter(blog => {
            // Category filter
            const matchesCategory = this.activeCategory === 'All' || blog.category === this.activeCategory;
            
            // Search filter
            const matchesSearch = !this.searchQuery || 
                blog.title.toLowerCase().includes(this.searchQuery) ||
                blog.description.toLowerCase().includes(this.searchQuery) ||
                blog.category.toLowerCase().includes(this.searchQuery);
            
            return matchesCategory && matchesSearch;
        });
        
        this.renderBlogs();
    },
    
    /**
     * Render blogs grid
     */
    renderBlogs() {
        if (this.filteredBlogs.length === 0) {
            this.container.innerHTML = Renderer.noResults('No articles found matching your criteria');
            return;
        }
        
        const html = this.filteredBlogs
            .map(blog => Renderer.blogCard(blog))
            .join('');
        
        this.container.innerHTML = html;
        
        // Setup lazy loading for images
        Utils.lazyLoadImages('.blog-image[data-src]');
        
        // Add reveal animation
        Utils.observeElements('.blog-card', 'active', {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    },
    
    /**
     * Render error state
     */
    renderError() {
        this.container.innerHTML = Renderer.errorMessage('Failed to load blog posts');
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Blogs.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Blogs;
}
