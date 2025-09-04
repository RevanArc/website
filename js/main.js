// ===== MAIN APPLICATION CONTROLLER =====

class RevanArcApp {
    constructor() {
        this.isLoaded = false;
        this.currentTheme = 'blue';
        this.init();
    }

    init() {
        this.setupLoadingSequence();
        this.setupErrorHandling();
        this.setupAccessibility();
        this.setupThemeManager();
        this.setupAnalytics();
        this.setupServiceWorker();
    }

    setupLoadingSequence() {
        // Show loading screen until everything is ready
        this.createLoadingScreen();
        
        // Wait for all critical resources
        Promise.all([
            this.waitForDOMReady(),
            this.waitForImagesLoaded(),
            this.waitForFontsLoaded()
        ]).then(() => {
            this.completeLoading();
        }).catch((error) => {
            console.error('Loading error:', error);
            this.completeLoading(); // Still show the site even if some resources fail
        });
    }

    createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-emblem">
                    <div class="loading-mask">
                        <div class="loading-left"></div>
                        <div class="loading-right"></div>
                    </div>
                </div>
                <div class="loading-text">
                    <h1>RevanArc</h1>
                    <p>Initializing AI Security Protocols...</p>
                </div>
                <div class="loading-progress">
                    <div class="progress-bar"></div>
                </div>
            </div>
        `;
        
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, var(--space-black), var(--deep-navy));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 1s ease-out;
        `;
        
        document.body.appendChild(loadingScreen);
        this.addLoadingStyles();
    }

    addLoadingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .loading-content {
                text-align: center;
                color: white;
            }
            
            .loading-emblem {
                width: 100px;
                height: 100px;
                margin: 0 auto 2rem;
                position: relative;
            }
            
            .loading-mask {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 3px solid var(--brass-gold);
                position: relative;
                overflow: hidden;
                animation: loadingPulse 2s ease-in-out infinite;
            }
            
            .loading-left, .loading-right {
                position: absolute;
                top: 0;
                width: 50%;
                height: 100%;
            }
            
            .loading-left {
                left: 0;
                background: var(--blue-gradient);
                animation: loadingGlowBlue 3s ease-in-out infinite;
            }
            
            .loading-right {
                right: 0;
                background: var(--red-gradient);
                animation: loadingGlowRed 3s ease-in-out infinite 1.5s;
            }
            
            .loading-text h1 {
                font-family: var(--font-heading);
                font-size: 2.5rem;
                color: var(--brass-gold);
                margin-bottom: 1rem;
                letter-spacing: 0.2em;
            }
            
            .loading-text p {
                font-family: var(--font-body);
                color: var(--gray-light);
                font-size: 1.1rem;
                margin-bottom: 2rem;
            }
            
            .loading-progress {
                width: 300px;
                height: 4px;
                background: rgba(212, 175, 55, 0.2);
                border-radius: 2px;
                margin: 0 auto;
                overflow: hidden;
            }
            
            .progress-bar {
                height: 100%;
                background: var(--gold-gradient);
                width: 0%;
                animation: loadingProgress 3s ease-out forwards;
                border-radius: 2px;
            }
            
            @keyframes loadingPulse {
                0%, 100% { 
                    box-shadow: 0 0 20px var(--brass-gold); 
                }
                50% { 
                    box-shadow: 0 0 40px var(--brass-gold), 0 0 60px var(--bright-gold); 
                }
            }
            
            @keyframes loadingGlowBlue {
                0%, 100% { 
                    box-shadow: inset 0 0 20px rgba(77, 163, 255, 0.3); 
                }
                50% { 
                    box-shadow: inset 0 0 40px rgba(77, 163, 255, 0.6); 
                }
            }
            
            @keyframes loadingGlowRed {
                0%, 100% { 
                    box-shadow: inset 0 0 20px rgba(224, 72, 72, 0.3); 
                }
                50% { 
                    box-shadow: inset 0 0 40px rgba(224, 72, 72, 0.6); 
                }
            }
            
            @keyframes loadingProgress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
        `;
        document.head.appendChild(style);
    }

    waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    waitForImagesLoaded() {
        return new Promise((resolve) => {
            const images = document.querySelectorAll('img');
            if (images.length === 0) {
                resolve();
                return;
            }
            
            let loadedCount = 0;
            const totalImages = images.length;
            
            images.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.addEventListener('load', () => {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            resolve();
                        }
                    });
                    img.addEventListener('error', () => {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            resolve();
                        }
                    });
                }
            });
            
            if (loadedCount === totalImages) {
                resolve();
            }
        });
    }

    waitForFontsLoaded() {
        return new Promise((resolve) => {
            if ('fonts' in document) {
                document.fonts.ready.then(resolve);
            } else {
                // Fallback for older browsers
                setTimeout(resolve, 2000);
            }
        });
    }

    completeLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
                this.isLoaded = true;
                this.onAppReady();
            }, 1000);
        }
    }

    onAppReady() {
        // Trigger ready event
        document.dispatchEvent(new CustomEvent('appReady'));
        
        // Initialize welcome sequence
        this.playWelcomeSequence();
        
        // Start periodic updates
        this.startPeriodicUpdates();
    }

    playWelcomeSequence() {
        // Animate hero elements in sequence
        const hero = document.querySelector('.hero');
        const emblem = document.querySelector('.revan-emblem');
        const title = document.querySelector('.hero-title');
        const description = document.querySelector('.hero-description');
        const actions = document.querySelector('.hero-actions');
        
        if (hero) {
            hero.classList.add('welcome-sequence');
            
            setTimeout(() => emblem?.classList.add('animate-in'), 200);
            setTimeout(() => title?.classList.add('animate-in'), 600);
            setTimeout(() => description?.classList.add('animate-in'), 1000);
            setTimeout(() => actions?.classList.add('animate-in'), 1400);
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.handleError(e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleError(e.reason);
        });
    }

    handleError(error) {
        // Log error details
        const errorData = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.error('Error details:', errorData);
        
        // Show user-friendly error message if needed
        if (!this.isLoaded) {
            this.showErrorMessage('Something went wrong while loading. Please refresh the page.');
        }
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button onclick="window.location.reload()">Reload Page</button>
            </div>
        `;
        
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            color: white;
            text-align: center;
        `;
        
        document.body.appendChild(errorDiv);
    }

    setupAccessibility() {
        // Add keyboard navigation support
        this.setupKeyboardNavigation();
        
        // Add screen reader support
        this.setupScreenReaderSupport();
        
        // Add focus management
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Global keyboard shortcuts
            switch (e.key) {
                case 'h':
                case 'H':
                    if (!e.ctrlKey && !e.altKey) {
                        document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
                case 'p':
                case 'P':
                    if (!e.ctrlKey && !e.altKey) {
                        document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
                case 'Escape':
                    this.closeFocusedElements();
                    break;
            }
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA labels and descriptions
        const emblem = document.querySelector('.revan-emblem');
        if (emblem) {
            emblem.setAttribute('aria-label', 'RevanArc logo representing the duality of AI security');
            emblem.setAttribute('role', 'img');
        }
        
        // Add live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'liveRegion';
        document.body.appendChild(liveRegion);
    }

    setupFocusManagement() {
        // Improve focus visibility
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 3px solid var(--brass-gold);
                outline-offset: 2px;
            }
            
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
        
        // Trap focus in modals if any
        this.setupFocusTrap();
    }

    setupFocusTrap() {
        // Implementation for focus trapping in modals
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal.active');
            if (modal && e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    closeFocusedElements() {
        // Close any open elements and return focus
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
        
        // Clear search if active
        const searchInput = document.getElementById('projectSearch');
        if (searchInput && searchInput === document.activeElement) {
            searchInput.blur();
        }
    }

    setupThemeManager() {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(() => this.handleSystemThemeChange());
        
        // Listen for duality switch changes
        document.addEventListener('modeChange', (e) => {
            this.currentTheme = e.detail.mode;
            this.updateThemeMetrics();
        });
    }

    handleSystemThemeChange() {
        // Adapt to system theme if needed
        console.log('System theme changed');
    }

    updateThemeMetrics() {
        // Update meta theme color
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            const color = this.currentTheme === 'red' ? '#e04848' : '#4da3ff';
            themeColorMeta.setAttribute('content', color);
        }
    }

    setupAnalytics() {
        // Basic analytics tracking (privacy-focused)
        this.trackPageView();
        this.setupInteractionTracking();
    }

    trackPageView() {
        // Log page view without personal data
        console.log('Page view tracked:', {
            url: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.slice(0, 50) // Truncated for privacy
        });
    }

    setupInteractionTracking() {
        // Track important interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.cta-button, .card-button, .nav-link')) {
                console.log('Interaction tracked:', {
                    element: e.target.className,
                    text: e.target.textContent.slice(0, 30),
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    setupServiceWorker() {
        // Register service worker for offline functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    startPeriodicUpdates() {
        // Start any periodic background tasks
        setInterval(() => {
            this.updateDynamicContent();
        }, 60000); // Every minute
    }

    updateDynamicContent() {
        // Update timestamps, check for new content, etc.
        this.updateLastUpdated();
    }

    updateLastUpdated() {
        const lastUpdated = document.querySelector('.last-updated');
        if (lastUpdated) {
            lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        }
    }

    // Public API methods
    switchToMode(mode) {
        const dualitySwitch = document.querySelector('.duality-switch');
        if (dualitySwitch && mode !== this.currentTheme) {
            dualitySwitch.click();
        }
    }

    scrollToSection(sectionId) {
        const section = document.querySelector(`#${sectionId}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--brass-gold);
            color: var(--space-black);
            border-radius: 8px;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== INITIALIZE APPLICATION =====

// Create global app instance
window.RevanArc = new RevanArcApp();

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RevanArcApp;
}
