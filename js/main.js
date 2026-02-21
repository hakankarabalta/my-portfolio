// ===================================
// MAIN APPLICATION ENTRY POINT
// Orchestrates component loading and initialization
// ===================================

/**
 * Main application initialization
 * This is the single entry point for the entire application
 */
(function() {
    'use strict';

    // Application state
    const App = {
        initialized: false,
        startTime: null,
        
        /**
         * Initialize the application
         */
        async init() {
            if (this.initialized) {
                console.warn('Application already initialized');
                return;
            }

            console.log('🎯 Initializing Portfolio Application...');
            this.startTime = performance.now();

            try {
                // Wait for DOM to be ready
                await this.waitForDOM();

                // Load all components via ComponentLoader
                await this.loadComponents();

                // Mark as initialized
                this.initialized = true;

                // Log success
                const duration = (performance.now() - this.startTime).toFixed(2);
                console.log(`✨ Application initialized successfully in ${duration}ms`);

                // Dispatch custom event for other scripts
                this.dispatchReadyEvent();

            } catch (error) {
                console.error('💥 Application initialization failed:', error);
                this.handleInitError(error);
            }
        },

        /**
         * Wait for DOM to be fully loaded
         * @returns {Promise<void>}
         */
        waitForDOM() {
            return new Promise((resolve) => {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', resolve);
                } else {
                    resolve();
                }
            });
        },

        /**
         * Load all components using ComponentLoader
         * @returns {Promise<void>}
         */
        async loadComponents() {
            if (!window.ComponentLoader) {
                throw new Error('ComponentLoader not found. Make sure loader.js is loaded before main.js');
            }

            console.log('📦 Loading components...');
            const results = await window.ComponentLoader.loadAll();

            // Check if any critical components failed
            if (results.failed > 0) {
                console.warn(`⚠️  ${results.failed} component(s) failed to load`);
                // Don't throw error - let app run with partial functionality
            }

            return results;
        },

        /**
         * Dispatch application ready event
         */
        dispatchReadyEvent() {
            const event = new CustomEvent('app:ready', {
                detail: {
                    timestamp: Date.now(),
                    duration: performance.now() - this.startTime
                }
            });
            window.dispatchEvent(event);
            console.log('📢 App ready event dispatched');
        },

        /**
         * Handle initialization errors
         * @param {Error} error - The error that occurred
         */
        handleInitError(error) {
            // Show error to user
            const errorContainer = document.createElement('div');
            errorContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                padding: var(--spacing-lg);
                background-color: #fee;
                border: 2px solid #c33;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            `;
            
            errorContainer.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: #c33; font-size: 1rem;">
                    ⚠️ Application Error
                </h3>
                <p style="margin: 0; font-size: 0.875rem; color: #666;">
                    The application failed to initialize properly. Please refresh the page.
                </p>
                <button 
                    onclick="location.reload()" 
                    style="
                        margin-top: 10px;
                        padding: 8px 16px;
                        background-color: #c33;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 0.875rem;
                    "
                >
                    Refresh Page
                </button>
            `;

            document.body.appendChild(errorContainer);

            // Auto-remove after 10 seconds
            setTimeout(() => {
                errorContainer.remove();
            }, 10000);
        }
    };

    // Start initialization
    App.init();

    // Expose App to window for debugging (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.PortfolioApp = App;
        console.log('🔧 Debug mode: window.PortfolioApp is available');
    }

})();

// ===================================
// ADDITIONAL EVENT LISTENERS
// ===================================

// Listen for app ready event (example usage for other scripts)
window.addEventListener('app:ready', (event) => {
    console.log('✅ Application is ready!', event.detail);
});

// Handle visibility change (pause/resume when tab is hidden/visible)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👋 Tab hidden - pausing non-critical operations');
    } else {
        console.log('👀 Tab visible - resuming operations');
    }
});

// Log unhandled errors
window.addEventListener('error', (event) => {
    console.error('💥 Unhandled error:', event.error);
});

// Log unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Unhandled promise rejection:', event.reason);
});
