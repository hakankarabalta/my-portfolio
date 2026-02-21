// ===================================
// COMPONENT LOADER
// Centralized loader for all data-driven components
// Handles loading order, error management, and dependencies
// ===================================

class ComponentLoader {
    constructor() {
        this.components = [];
        this.loadedComponents = new Set();
        this.failedComponents = new Set();
        this.errors = [];
    }

    /**
     * Register a component to be loaded
     * @param {string} name - Component name for tracking
     * @param {Function} loadFunction - Async function that loads the component
     * @param {Array} dependencies - Array of component names this depends on
     */
    register(name, loadFunction, dependencies = []) {
        this.components.push({
            name,
            loadFunction,
            dependencies,
            loaded: false,
            error: null
        });
    }

    /**
     * Load all registered components in dependency order
     * @returns {Promise<Object>} Results with success/failure counts
     */
    async loadAll() {
        console.log('🚀 Starting component loader...');
        const startTime = performance.now();

        // Sort components by dependencies
        const sortedComponents = this.sortByDependencies();

        for (const component of sortedComponents) {
            await this.loadComponent(component);
        }

        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        // Log results
        this.logResults(duration);

        return {
            total: this.components.length,
            loaded: this.loadedComponents.size,
            failed: this.failedComponents.size,
            errors: this.errors,
            duration
        };
    }

    /**
     * Load a single component
     * @param {Object} component - Component configuration object
     */
    async loadComponent(component) {
        const { name, loadFunction, dependencies } = component;

        // Check if dependencies are loaded
        const missingDeps = dependencies.filter(dep => !this.loadedComponents.has(dep));
        if (missingDeps.length > 0) {
            const error = `Missing dependencies: ${missingDeps.join(', ')}`;
            this.handleError(name, error);
            return;
        }

        try {
            console.log(`📦 Loading component: ${name}`);
            await loadFunction();
            this.loadedComponents.add(name);
            component.loaded = true;
            console.log(`✅ ${name} loaded successfully`);
        } catch (error) {
            this.handleError(name, error);
        }
    }

    /**
     * Handle component loading errors
     * @param {string} componentName - Name of the failed component
     * @param {Error|string} error - Error object or message
     */
    handleError(componentName, error) {
        const errorMessage = error instanceof Error ? error.message : error;
        console.error(`❌ Failed to load ${componentName}:`, errorMessage);
        
        this.failedComponents.add(componentName);
        this.errors.push({
            component: componentName,
            error: errorMessage,
            timestamp: new Date().toISOString()
        });

        // Show user-friendly error in UI if component container exists
        const container = document.querySelector(`[data-component="${componentName}"]`);
        if (container) {
            this.showErrorUI(container, componentName, errorMessage);
        }
    }

    /**
     * Display error message in the component's container
     * @param {HTMLElement} container - Container element
     * @param {string} componentName - Component name
     * @param {string} error - Error message
     */
    showErrorUI(container, componentName, error) {
        container.innerHTML = `
            <div style="
                padding: var(--spacing-lg);
                text-align: center;
                color: var(--text-muted);
                background-color: var(--bg-secondary);
                border-radius: var(--radius-md);
                margin: var(--spacing-md);
            ">
                <p style="font-weight: 600; margin-bottom: var(--spacing-sm);">
                    ⚠️ ${componentName} could not be loaded
                </p>
                <p style="font-size: 0.875rem;">
                    ${error}
                </p>
            </div>
        `;
    }

    /**
     * Sort components by their dependencies
     * @returns {Array} Sorted component array
     */
    sortByDependencies() {
        const sorted = [];
        const visited = new Set();

        const visit = (component) => {
            if (visited.has(component.name)) return;
            visited.add(component.name);

            // Visit dependencies first
            component.dependencies.forEach(depName => {
                const depComponent = this.components.find(c => c.name === depName);
                if (depComponent) {
                    visit(depComponent);
                }
            });

            sorted.push(component);
        };

        this.components.forEach(visit);
        return sorted;
    }

    /**
     * Log loading results to console
     * @param {number} duration - Total loading duration in ms
     */
    logResults(duration) {
        console.log('\n📊 Component Loading Results:');
        console.log(`✅ Successfully loaded: ${this.loadedComponents.size}`);
        console.log(`❌ Failed to load: ${this.failedComponents.size}`);
        console.log(`⏱️  Total time: ${duration}ms`);

        if (this.failedComponents.size > 0) {
            console.log('\n❌ Failed components:');
            this.errors.forEach(({ component, error }) => {
                console.log(`  - ${component}: ${error}`);
            });
        }

        console.log('\n');
    }
}

// ===================================
// COMPONENT INITIALIZATION FUNCTIONS
// These verify components exist but don't reinitialize them
// Components initialize themselves via their own DOMContentLoaded events
// ===================================

/**
 * Initialize Skills component
 * @returns {Promise<void>}
 */
async function initSkills() {
    const skillsSection = document.querySelector('.skills');
    if (!skillsSection) {
        // Not an error if section doesn't exist on this page
        return;
    }

    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) {
        console.warn('Skills grid element not found');
        return;
    }

    // Component initializes itself, just verify it exists
    console.log('✓ Skills component verified');
}

/**
 * Initialize Projects component
 * @returns {Promise<void>}
 */
async function initProjects() {
    const projectsSection = document.querySelector('.projects');
    if (!projectsSection) {
        // Not an error if section doesn't exist on this page
        return;
    }

    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) {
        console.warn('Projects grid element not found');
        return;
    }

    // Component initializes itself, just verify it exists
    console.log('✓ Projects component verified');
}

/**
 * Initialize Navbar component
 * @returns {Promise<void>}
 */
async function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        console.warn('Navbar element not found');
        return;
    }

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) {
        console.warn('Navbar elements (hamburger or menu) not found');
        return;
    }

    // Component initializes itself, just verify it exists
    console.log('✓ Navbar component verified');
}

/**
 * Initialize Project Detail page
 * @returns {Promise<void>}
 */
async function initProjectDetail() {
    // Only verify if we're on the project detail page
    const projectDetail = document.querySelector('.project-detail');
    if (!projectDetail) {
        // Not an error - just not on this page
        return;
    }

    const slider = document.querySelector('.slider-container');
    if (!slider) {
        console.warn('Project detail slider not found');
        return;
    }

    // Component initializes itself, just verify it exists
    console.log('✓ Project Detail component verified');
}

// ===================================
// EXPORT LOADER INSTANCE
// ===================================

// Create global loader instance
window.ComponentLoader = new ComponentLoader();

// Register all components
window.ComponentLoader.register('navbar', initNavbar, []);
window.ComponentLoader.register('skills', initSkills, []);
window.ComponentLoader.register('projects', initProjects, []);
window.ComponentLoader.register('projectDetail', initProjectDetail, []);

console.log('📝 Component loader configured and ready');
