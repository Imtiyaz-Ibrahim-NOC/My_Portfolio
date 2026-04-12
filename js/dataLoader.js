/**
 * Data Loader Module
 * Handles loading and caching of JSON data files
 */

const DataLoader = {
    // Cache for storing loaded data
    cache: {},
    
    /**
     * Base path for data files
     */
    basePath: 'data/',
    
    /**
     * Load a JSON data file
     * @param {string} filename - Name of the JSON file (without extension)
     * @param {boolean} useCache - Whether to use cached data
     * @returns {Promise<Object>} Parsed JSON data
     */
    async load(filename, useCache = true) {
        // Return cached data if available
        if (useCache && this.cache[filename]) {
            return this.cache[filename];
        }
        
        try {
            const response = await fetch(`${this.basePath}${filename}.json`);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}.json: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Cache the data
            if (useCache) {
                this.cache[filename] = data;
            }
            
            return data;
        } catch (error) {
            console.error(`Error loading ${filename}.json:`, error);
            throw error;
        }
    },
    
    /**
     * Load multiple data files
     * @param {Array<string>} filenames - Array of filenames to load
     * @param {boolean} useCache - Whether to use cached data
     * @returns {Promise<Object>} Object with loaded data
     */
    async loadMultiple(filenames, useCache = true) {
        const promises = filenames.map(name => this.load(name, useCache));
        const results = await Promise.all(promises);
        
        return filenames.reduce((acc, name, index) => {
            acc[name] = results[index];
            return acc;
        }, {});
    },
    
    /**
     * Preload all data files
     * @returns {Promise<Object>} All loaded data
     */
    async preloadAll() {
        const files = ['profile', 'skills', 'projects', 'blogs', 'certificates'];
        return this.loadMultiple(files);
    },
    
    /**
     * Clear cache for a specific file or all files
     * @param {string|null} filename - Specific file to clear, or null for all
     */
    clearCache(filename = null) {
        if (filename) {
            delete this.cache[filename];
        } else {
            this.cache = {};
        }
    },
    
    /**
     * Get cached data
     * @param {string} filename - Name of the cached file
     * @returns {Object|null} Cached data or null
     */
    getCached(filename) {
        return this.cache[filename] || null;
    },
    
    /**
     * Check if data is cached
     * @param {string} filename - Name of the file
     * @returns {boolean} Whether data is cached
     */
    isCached(filename) {
        return filename in this.cache;
    },
    
    /**
     * Load profile data
     * @returns {Promise<Object>} Profile data
     */
    async loadProfile() {
        return this.load('profile');
    },
    
    /**
     * Load skills data
     * @returns {Promise<Object>} Skills data
     */
    async loadSkills() {
        return this.load('skills');
    },
    
    /**
     * Load projects data
     * @returns {Promise<Object>} Projects data
     */
    async loadProjects() {
        return this.load('projects');
    },
    
    /**
     * Load blogs data
     * @returns {Promise<Object>} Blogs data
     */
    async loadBlogs() {
        return this.load('blogs');
    },
    
    /**
     * Load certificates data
     * @returns {Promise<Object>} Certificates data
     */
    async loadCertificates() {
        return this.load('certificates');
    },
    
    /**
     * Get a specific blog by ID
     * @param {string} id - Blog ID
     * @returns {Promise<Object|null>} Blog object or null
     */
    async getBlogById(id) {
        const data = await this.loadBlogs();
        return data.blogs.find(blog => blog.id === id) || null;
    },
    
    /**
     * Get a specific project by ID
     * @param {string} id - Project ID
     * @returns {Promise<Object|null>} Project object or null
     */
    async getProjectById(id) {
        const data = await this.loadProjects();
        return data.projects.find(project => project.id === id) || null;
    },
    
    /**
     * Get unique tags from all projects
     * @returns {Promise<Array<string>>} Array of unique tags
     */
    async getProjectTags() {
        const data = await this.loadProjects();
        const allTags = data.projects.flatMap(project => project.tags);
        return [...new Set(allTags)].sort();
    },
    
    /**
     * Get unique categories from all blogs
     * @returns {Promise<Array<string>>} Array of unique categories
     */
    async getBlogCategories() {
        const data = await this.loadBlogs();
        const categories = data.blogs.map(blog => blog.category);
        return [...new Set(categories)].sort();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}
