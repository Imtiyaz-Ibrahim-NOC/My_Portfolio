/**
 * Projects Module
 * Handles projects section with search and tag filtering
 */

const Projects = {
    /**
     * Initialize projects section
     */
    async init() {
        this.container = document.getElementById('projects-grid');
        this.searchInput = document.getElementById('project-search');
        this.tagsContainer = document.getElementById('project-tags');
        
        if (!this.container) return;
        
        this.allProjects = [];
        this.filteredProjects = [];
        this.allTags = [];
        this.activeTag = 'All';
        this.searchQuery = '';
        
        try {
            const data = await DataLoader.loadProjects();
            this.allProjects = data.projects || [];
            this.filteredProjects = [...this.allProjects];
            this.allTags = await DataLoader.getProjectTags();
            
            this.renderTags();
            this.renderProjects();
            this.bindEvents();
        } catch (error) {
            console.error('Error loading projects:', error);
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
                this.filterProjects();
            }, 300));
        }
        
        // Tag filters (event delegation)
        if (this.tagsContainer) {
            this.tagsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-tag')) {
                    this.activeTag = e.target.dataset.value;
                    this.updateActiveTag();
                    this.filterProjects();
                }
            });
        }
    },
    
    /**
     * Render filter tags
     */
    renderTags() {
        if (!this.tagsContainer) return;
        this.tagsContainer.innerHTML = Renderer.renderFilters(this.allTags, 'All', 'tag');
    },
    
    /**
     * Update active tag styling
     */
    updateActiveTag() {
        const tags = this.tagsContainer.querySelectorAll('.filter-tag');
        tags.forEach(tag => {
            if (tag.dataset.value === this.activeTag) {
                tag.classList.add('active');
            } else {
                tag.classList.remove('active');
            }
        });
    },
    
    /**
     * Filter projects based on search query and active tag
     */
    filterProjects() {
        this.filteredProjects = this.allProjects.filter(project => {
            // Tag filter
            const matchesTag = this.activeTag === 'All' || project.tags.includes(this.activeTag);
            
            // Search filter
            const matchesSearch = !this.searchQuery || 
                project.title.toLowerCase().includes(this.searchQuery) ||
                project.description.toLowerCase().includes(this.searchQuery) ||
                project.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
            
            return matchesTag && matchesSearch;
        });
        
        this.renderProjects();
    },
    
    /**
     * Render projects grid
     */
    renderProjects() {
        if (this.filteredProjects.length === 0) {
            this.container.innerHTML = Renderer.noResults('No projects found matching your criteria');
            return;
        }
        
        const html = this.filteredProjects
            .map(project => Renderer.projectCard(project))
            .join('');
        
        this.container.innerHTML = html;
        
        // Setup lazy loading for images
        Utils.lazyLoadImages('.project-image[data-src]');
        
        // Add reveal animation
        Utils.observeElements('.project-card', 'active', {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    },
    
    /**
     * Render error state
     */
    renderError() {
        this.container.innerHTML = Renderer.errorMessage('Failed to load projects');
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Projects.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Projects;
}
