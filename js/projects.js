// ===================================
// PROJECTS COMPONENT JAVASCRIPT
// Loads projects from JSON and renders project cards
// ===================================

class Projects {
    constructor() {
        this.projectsGrid = document.querySelector('.projects-grid');
        this.dataPath = 'data/projects.json';
        
        this.init();
    }
    
    async init() {
        if (!this.projectsGrid) {
            console.warn('Projects grid element not found');
            return;
        }
        
        await this.loadProjects();
    }
    
    async loadProjects() {
        try {
            const response = await fetch(this.dataPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.renderProjects(data.projects);
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError();
        }
    }
    
    renderProjects(projects) {
        // Clear grid
        this.projectsGrid.innerHTML = '';
        
        // Create card for each project
        projects.forEach(project => {
            const card = this.createProjectCard(project);
            this.projectsGrid.appendChild(card);
        });
    }
    
    createProjectCard(project) {
        const card = document.createElement('a');
        card.className = 'project-card';
        card.href = `project-detail.html?id=${project.id}`;
        card.setAttribute('data-project-id', project.id);
        
        // Generate tags HTML
        const tagsHTML = project.tags.map(tag => 
            `<span class="project-tag-item" style="background-color: ${this.hexToRGBA(tag.color, 0.2)}; color: ${tag.color};">
                ${this.escapeHtml(tag.name)}
            </span>`
        ).join('');
        
        card.innerHTML = `
            <div class="project-thumbnail">
                <img 
                    src="${project.thumbnail}" 
                    alt="${this.escapeHtml(project.title)}"
                    loading="lazy"
                >
            </div>
            <div class="project-info">
                <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Convert hex color to RGBA with transparency
    hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    showError() {
        this.projectsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                An error occurred while loading projects.
            </div>
        `;
    }
    
    // XSS protection
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ===================================
// INITIALIZE
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    new Projects();
});
