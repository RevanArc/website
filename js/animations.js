// ===== ADVANCED ANIMATIONS =====

class AdvancedAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupStarfieldAnimation();
        this.setupEmblemEffects();
        this.setupConstellationAnimation();
        this.setupKnowledgeStageInteraction();
        this.setupParticleEffects();
        this.setupMouseEffects();
    }

    setupStarfieldAnimation() {
        this.createDynamicStarfield();
        this.setupStarTwinkle();
    }

    createDynamicStarfield() {
        const starfield = document.querySelector('.starfield');
        if (!starfield) return;

        // Create additional star layers
        for (let i = 0; i < 3; i++) {
            const starLayer = document.createElement('div');
            starLayer.className = `star-layer star-layer-${i + 1}`;
            starLayer.style.position = 'absolute';
            starLayer.style.top = '0';
            starLayer.style.left = '0';
            starLayer.style.width = '100%';
            starLayer.style.height = '100%';
            starLayer.style.pointerEvents = 'none';
            
            this.generateStars(starLayer, 50 + i * 30);
            starfield.appendChild(starLayer);
        }
    }

    generateStars(container, count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'dynamic-star';
            
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const opacity = Math.random() * 0.8 + 0.2;
            const animationDelay = Math.random() * 4;
            
            star.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                opacity: ${opacity};
                animation: starTwinkle 3s ease-in-out infinite;
                animation-delay: ${animationDelay}s;
            `;
            
            container.appendChild(star);
        }
    }

    setupStarTwinkle() {
        // Add CSS for star twinkling if not already present
        if (!document.getElementById('starTwinkleCSS')) {
            const style = document.createElement('style');
            style.id = 'starTwinkleCSS';
            style.textContent = `
                @keyframes starTwinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                
                .star-layer-1 { animation: starDrift1 120s linear infinite; }
                .star-layer-2 { animation: starDrift2 180s linear infinite; }
                .star-layer-3 { animation: starDrift3 240s linear infinite; }
                
                @keyframes starDrift1 {
                    0% { transform: translateX(0) translateY(0); }
                    100% { transform: translateX(-100px) translateY(-20px); }
                }
                
                @keyframes starDrift2 {
                    0% { transform: translateX(0) translateY(0); }
                    100% { transform: translateX(-150px) translateY(30px); }
                }
                
                @keyframes starDrift3 {
                    0% { transform: translateX(0) translateY(0); }
                    100% { transform: translateX(-200px) translateY(-40px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupEmblemEffects() {
        const emblem = document.querySelector('.revan-emblem');
        if (!emblem) return;

        // Add energy pulse effect
        this.createEnergyPulse(emblem);
        
        // Add hover interactions
        emblem.addEventListener('mouseenter', () => {
            this.activateEmblemPower();
        });
        
        emblem.addEventListener('mouseleave', () => {
            this.deactivateEmblemPower();
        });
    }

    createEnergyPulse(emblem) {
        const pulseRing = document.createElement('div');
        pulseRing.className = 'energy-pulse';
        pulseRing.style.cssText = `
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            border: 2px solid var(--brass-gold);
            border-radius: 50%;
            opacity: 0;
            pointer-events: none;
            animation: energyPulse 4s ease-in-out infinite;
        `;
        
        emblem.style.position = 'relative';
        emblem.appendChild(pulseRing);
        
        // Add CSS for energy pulse
        if (!document.getElementById('energyPulseCSS')) {
            const style = document.createElement('style');
            style.id = 'energyPulseCSS';
            style.textContent = `
                @keyframes energyPulse {
                    0% { 
                        opacity: 0; 
                        transform: scale(0.8); 
                    }
                    50% { 
                        opacity: 0.6; 
                        transform: scale(1.1); 
                    }
                    100% { 
                        opacity: 0; 
                        transform: scale(1.3); 
                    }
                }
                
                .emblem-powered {
                    animation: emblemPower 0.5s ease-out !important;
                }
                
                @keyframes emblemPower {
                    0% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.1) rotate(5deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    activateEmblemPower() {
        const emblem = document.querySelector('.revan-emblem');
        const leftSide = emblem.querySelector('.emblem-left');
        const rightSide = emblem.querySelector('.emblem-right');
        
        emblem.classList.add('emblem-powered');
        
        // Enhance glow effects
        if (leftSide) leftSide.style.boxShadow = '0 0 40px rgba(77, 163, 255, 0.8)';
        if (rightSide) rightSide.style.boxShadow = '0 0 40px rgba(224, 72, 72, 0.8)';
    }

    deactivateEmblemPower() {
        const emblem = document.querySelector('.revan-emblem');
        const leftSide = emblem.querySelector('.emblem-left');
        const rightSide = emblem.querySelector('.emblem-right');
        
        setTimeout(() => {
            emblem.classList.remove('emblem-powered');
        }, 500);
        
        // Reset glow effects
        if (leftSide) leftSide.style.boxShadow = '';
        if (rightSide) rightSide.style.boxShadow = '';
    }

    setupConstellationAnimation() {
        const constellation = document.querySelector('.constellation');
        if (!constellation) return;

        const nodes = constellation.querySelectorAll('.knowledge-node');
        const connections = constellation.querySelectorAll('.connection-line');
        
        // Animate connections based on node hover
        nodes.forEach((node, index) => {
            node.addEventListener('mouseenter', () => {
                this.activateConstellationPath(index, connections);
            });
            
            node.addEventListener('mouseleave', () => {
                this.deactivateConstellationPath(connections);
            });
        });
    }

    setupKnowledgeStageInteraction() {
        const nodes = document.querySelectorAll('.knowledge-node');
        const stageDetails = document.getElementById('stageDetails');
        const stageContents = document.querySelectorAll('.stage-content');
        
        if (!stageDetails) return;
        
        // Initially hide all stage contents
        stageContents.forEach(content => {
            content.style.display = 'none';
        });
        
        nodes.forEach(node => {
            node.addEventListener('click', () => {
                const stage = node.getAttribute('data-stage');
                this.showStageDetails(stage, stageDetails, stageContents);
                this.highlightActiveNode(node, nodes);
            });
            
            // Add keyboard support
            node.setAttribute('tabindex', '0');
            node.setAttribute('role', 'button');
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    node.click();
                }
            });
        });
        
        // Show first stage by default
        if (nodes.length > 0) {
            setTimeout(() => {
                nodes[0].click();
            }, 500);
        }
    }

    showStageDetails(stage, container, contents) {
        // Hide all contents first
        contents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        
        // Show the selected stage
        const targetContent = document.querySelector(`.stage-content[data-stage="${stage}"]`);
        if (targetContent) {
            targetContent.style.display = 'block';
            targetContent.classList.add('active');
            
            // Animate in
            targetContent.style.opacity = '0';
            targetContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0)';
            }, 50);
        }
        
        // Show the container
        container.style.display = 'block';
        container.classList.add('visible');
    }

    highlightActiveNode(activeNode, allNodes) {
        allNodes.forEach(node => {
            node.classList.remove('active');
        });
        activeNode.classList.add('active');
    }

    activateConstellationPath(nodeIndex, connections) {
        connections.forEach((line, lineIndex) => {
            if (this.isConnectedToNode(nodeIndex, lineIndex)) {
                line.style.strokeOpacity = '1';
                line.style.strokeWidth = '2';
                line.style.filter = 'drop-shadow(0 0 5px var(--brass-gold))';
            }
        });
    }

    deactivateConstellationPath(connections) {
        connections.forEach(line => {
            line.style.strokeOpacity = '';
            line.style.strokeWidth = '';
            line.style.filter = '';
        });
    }

    isConnectedToNode(nodeIndex, lineIndex) {
        // Simple logic to determine if a line connects to a node
        // This would be more sophisticated in a real implementation
        return lineIndex % 2 === nodeIndex % 2;
    }

    setupParticleEffects() {
        this.createFloatingParticles();
    }

    createFloatingParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(particleContainer);
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            this.createParticle(particleContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + size;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: rgba(212, 175, 55, 0.6);
            border-radius: 50%;
            animation: particleFloat ${duration}s linear infinite;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                this.createParticle(container);
            }
        }, (duration + delay) * 1000);
        
        // Add CSS for particle float if not present
        if (!document.getElementById('particleFloatCSS')) {
            const style = document.createElement('style');
            style.id = 'particleFloatCSS';
            style.textContent = `
                @keyframes particleFloat {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(50px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupMouseEffects() {
        this.setupHoverRipples();
    }

    setupHoverRipples() {
        const interactiveElements = document.querySelectorAll(
            '.cta-button, .card-button, .nav-link, .filter-btn, .community-card, .clickable-emblem'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.createRipple(e.target, e.clientX, e.clientY);
            });
        });
    }

    createRipple(element, x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'hover-ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const left = x - rect.left - size / 2;
        const top = y - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            left: ${left}px;
            top: ${top}px;
            width: ${size}px;
            height: ${size}px;
            background: rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleExpand 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
        
        // Add CSS for ripple expand
        if (!document.getElementById('rippleExpandCSS')) {
            const style = document.createElement('style');
            style.id = 'rippleExpandCSS';
            style.textContent = `
                @keyframes rippleExpand {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupReducedMotion();
        this.setupIntersectionOptimizations();
        this.setupDebouncing();
    }

    setupReducedMotion() {
        // Respect user's reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
            this.disableAnimations();
        }
        
        prefersReducedMotion.addListener((e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
                this.disableAnimations();
            } else {
                document.body.classList.remove('reduced-motion');
                this.enableAnimations();
            }
        });
    }

    disableAnimations() {
        const style = document.createElement('style');
        style.id = 'reducedMotionCSS';
        style.textContent = `
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    enableAnimations() {
        const reducedMotionCSS = document.getElementById('reducedMotionCSS');
        if (reducedMotionCSS) {
            reducedMotionCSS.remove();
        }
    }

    setupIntersectionOptimizations() {
        // Pause animations when elements are not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                } else {
                    entry.target.classList.remove('in-viewport');
                }
            });
        });

        document.querySelectorAll('.project-card, .revan-emblem, .constellation').forEach(el => {
            observer.observe(el);
        });
    }

    setupDebouncing() {
        // Debounce scroll and resize events
        let scrollTimeout;
        let resizeTimeout;
        
        const debouncedScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.dispatchEvent(new CustomEvent('debouncedScroll'));
            }, 16); // ~60fps
        };
        
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                document.dispatchEvent(new CustomEvent('debouncedResize'));
            }, 250);
        };
        
        window.addEventListener('scroll', debouncedScroll, { passive: true });
        window.addEventListener('resize', debouncedResize);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAnimations();
    new PerformanceManager();
});
