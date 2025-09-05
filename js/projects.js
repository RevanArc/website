// ===== PROJECT FILTERING AND INTERACTIONS =====

class ProjectManager {
    constructor() {
        this.projects = [];
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        this.setupProjects();
        this.setupFilters();
        this.setupProjectInteractions();
        this.setupRepositoryLinks();
    }

    setupProjects() {
        // Define project data
        this.projects = [
            {
                id: 'enchiridion',
                title: 'Enchiridion',
                description: 'Comprehensive encyclopedia and knowledgebase of AI security research, techniques, and best practices.',
                categories: ['knowledge'],
                tags: ['Knowledge', 'Research'],
                icon: 'img/enchiridion.png',
                repo: 'https://github.com/RevanArc/enchiridion',
                status: 'active'
            },
            {
                id: 'phalanx',
                title: 'Phalanx',
                description: 'End-to-end AI security platform providing runtime protection, evaluations, and remediation capabilities.',
                categories: ['blue', 'red'],
                tags: ['Defense', 'Testing'],
                icon: '🛡️',
                repo: 'https://github.com/RevanArc/phalanx',
                status: 'active'
            },
            {
                id: 'lmbom',
                title: 'LMBoM',
                description: 'Language Model Bill of Materials - tracking lineage, evaluations, and provenance for AI model supply chains.',
                categories: ['supply'],
                tags: ['Supply Chain', 'Transparency'],
                icon: '📋',
                repo: 'https://github.com/RevanArc/lmbom',
                status: 'development'
            },
            {
                id: 'hk47',
                title: 'HK-47',
                description: 'Autonomous AI red-teaming agent for adversarial testing and security assessment of AI systems.',
                categories: ['red'],
                tags: ['Adversary', 'Autonomous'],
                icon: '🤖',
                repo: 'https://github.com/RevanArc/hk47',
                status: 'development'
            },
            {
                id: 'starmap',
                title: 'Starmap',
                description: 'AI security reference architectures and implementation guides for robust AI system design.',
                categories: ['blue'],
                tags: ['Architecture', 'Reference'],
                icon: '🗺️',
                repo: 'https://github.com/RevanArc/starmap',
                status: 'planning'
            },
            {
                id: 'veritas',
                title: 'Veritas',
                description: 'Language Model Evaluation Service providing standardized security, safety, and robustness testing for AI models.',
                categories: ['blue', 'knowledge'],
                tags: ['Evaluation', 'Testing'],
                icon: '🔎',
                repo: 'https://github.com/RevanArc/veritas',
                status: 'development'
            }
        ];
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.setActiveFilter(filter);
                this.updateFilterButtons(button);
                this.filterProjects(filter);
            });
        });
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
    }

    updateFilterButtons(activeButton) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card) => {
            const categories = card.getAttribute('data-category').split(' ');
            let shouldShow = false;
            
            if (filter === 'all') {
                shouldShow = true;
            } else {
                shouldShow = categories.includes(filter);
            }
            
            if (shouldShow) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1) translateY(0)';
            } else {
                card.classList.add('hidden');
                card.style.opacity = '0.3';
                card.style.transform = 'scale(0.95) translateY(10px)';
                card.style.pointerEvents = 'none';
            }
        });
        
        // Update project count
        const visibleCount = document.querySelectorAll('.project-card:not(.hidden)').length;
        this.updateProjectCount(visibleCount);
    }

    setupProjectInteractions() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            // Add hover sound effect (if needed)
            card.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
            
            // Add click analytics (if needed)
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('card-button')) {
                    const projectId = this.getProjectIdFromCard(card);
                    this.trackProjectView(projectId);
                }
            });
            
            // Add keyboard navigation
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const button = card.querySelector('.card-button');
                    if (button) button.click();
                }
            });
        });
    }

    setupRepositoryLinks() {
        const repoButtons = document.querySelectorAll('.card-button');
        
        repoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const card = button.closest('.project-card');
                const projectId = this.getProjectIdFromCard(card);
                const project = this.projects.find(p => p.id === projectId);
                
                console.log('Button clicked for project:', projectId, project); // Debug log
                
                if (project && project.repo) {
                    // Add loading state
                    const originalText = button.textContent;
                    button.classList.add('loading');
                    button.textContent = 'Opening...';
                    button.disabled = true;
                    
                    // Open repository
                    setTimeout(() => {
                        try {
                            window.open(project.repo, '_blank', 'noopener,noreferrer');
                        } catch (error) {
                            console.error('Error opening repository:', error);
                        }
                        
                        button.classList.remove('loading');
                        button.textContent = originalText;
                        button.disabled = false;
                    }, 300);
                } else {
                    console.warn('No repository found for project:', projectId);
                    this.showComingSoonMessage(button);
                }
            });
        });
        
        // Make project cards clickable
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-button')) {
                    const button = card.querySelector('.card-button');
                    if (button) {
                        button.click();
                    }
                }
            });
            
            // Add visual feedback for clickability
            card.style.cursor = 'pointer';
        });
    }

    getProjectIdFromCard(card) {
        // First try to get the project ID from data attribute
        const projectId = card.getAttribute('data-project-id');
        if (projectId) {
            return projectId;
        }
        
        // Fallback to title mapping
        const title = card.querySelector('.card-title').textContent.toLowerCase().trim();
        const titleMap = {
            'enchiridion': 'enchiridion',
            'phalanx': 'phalanx',
            'lmbom': 'lmbom',
            'hk-47': 'hk47',
            'starmap': 'starmap'
        };
        
        return titleMap[title] || title.replace(/[^a-z0-9]/g, '');
    }

    showComingSoonMessage(button) {
        const originalText = button.textContent;
        button.textContent = 'Coming Soon!';
        button.classList.add('coming-soon');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('coming-soon');
        }, 2000);
    }

    playHoverSound() {
        // Optional: Add subtle sound effects
        // This would require audio files and user interaction first
    }

    trackProjectView(projectId) {
        // Optional: Add analytics tracking
        console.log(`Project viewed: ${projectId}`);
    }

    updateProjectCount(count) {
        // Optional: Show project count
        const countElement = document.querySelector('.project-count');
        if (countElement) {
            countElement.textContent = `${count} project${count !== 1 ? 's' : ''}`;
        }
    }

    // Public method to get project by filter
    getProjectsByFilter(filter) {
        if (filter === 'all') {
            return this.projects;
        }
        return this.projects.filter(project => 
            project.categories.includes(filter)
        );
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const projectManager = new ProjectManager();
});
