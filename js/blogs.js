/**
 * Blogs Module
 * Handles blogs section with search, category filtering,
 * and optimized chunk loading (pagination)
 */

const Blogs = {
    async init() {
        this.container = document.getElementById('blogs-grid');
        this.searchInput = document.getElementById('blog-search');
        this.categoriesContainer = document.getElementById('blog-categories');
        this.loadMoreBtn = document.getElementById('load-more');

        if (!this.container) return;

        // State
        this.allBlogs = [];
        this.filteredBlogs = [];
        this.allCategories = [];
        this.activeCategory = 'All';
        this.searchQuery = '';

        // Pagination
        this.itemsPerLoad = 10;
        this.currentIndex = 0;

        try {
            const data = await DataLoader.loadBlogs();
            this.allBlogs = data.blogs || [];
            this.filteredBlogs = [...this.allBlogs];
            this.allCategories = await DataLoader.getBlogCategories();

            this.renderCategories();
            this.renderBlogs(); // initial chunk
            this.bindEvents();
        } catch (error) {
            console.error('Error loading blogs:', error);
            this.renderError();
        }
    },

    bindEvents() {
        // 🔍 Search
        if (this.searchInput) {
            this.searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.filterBlogs();
            }, 300));
        }

        // 🏷️ Category filter
        if (this.categoriesContainer) {
            this.categoriesContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-category')) {
                    this.activeCategory = e.target.dataset.value;
                    this.updateActiveCategory();
                    this.filterBlogs();
                }
            });
        }

        // ➕ Load More button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreBlogs();
            });
        }
    },

    renderCategories() {
        if (!this.categoriesContainer) return;
        this.categoriesContainer.innerHTML =
            Renderer.renderFilters(this.allCategories, 'All', 'category');
    },

    updateActiveCategory() {
        const categories = this.categoriesContainer.querySelectorAll('.filter-category');
        categories.forEach(cat => {
            cat.classList.toggle('active', cat.dataset.value === this.activeCategory);
        });
    },

    filterBlogs() {
        this.filteredBlogs = this.allBlogs.filter(blog => {
            const matchesCategory =
                this.activeCategory === 'All' || blog.category === this.activeCategory;

            const matchesSearch =
                !this.searchQuery ||
                blog.title.toLowerCase().includes(this.searchQuery) ||
                blog.description.toLowerCase().includes(this.searchQuery) ||
                blog.category.toLowerCase().includes(this.searchQuery);

            return matchesCategory && matchesSearch;
        });

        // 🔥 Reset & re-render
        this.currentIndex = 0;
        this.container.innerHTML = '';
        this.loadMoreBlogs();
    },

    renderBlogs() {
        if (this.filteredBlogs.length === 0) {
            this.container.innerHTML =
                Renderer.noResults('No articles found matching your criteria');
            if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
            return;
        }

        // Reset
        this.container.innerHTML = '';
        this.currentIndex = 0;

        this.loadMoreBlogs();
    },

    loadMoreBlogs() {
        const nextItems = this.filteredBlogs.slice(
            this.currentIndex,
            this.currentIndex + this.itemsPerLoad
        );

        const html = nextItems
            .map(blog => Renderer.blogCard(blog))
            .join('');

        this.container.insertAdjacentHTML('beforeend', html);

        this.currentIndex += this.itemsPerLoad;

        // Hide button if no more items
        if (this.loadMoreBtn) {
            if (this.currentIndex >= this.filteredBlogs.length) {
                this.loadMoreBtn.style.display = 'none';
            } else {
                this.loadMoreBtn.style.display = 'block';
            }
        }

        // Lazy load images
        Utils.lazyLoadImages('.blog-image[data-src]');

        // Reveal animation
        Utils.observeElements('.blog-card', 'active', {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    },

    renderError() {
        this.container.innerHTML =
            Renderer.errorMessage('Failed to load blog posts');
    }
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    Blogs.init();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Blogs;
}