// ===================================
// SKILLS COMPONENT JAVASCRIPT
// Loads skills from JSON and handles filtering
// ===================================

class Skills {
    constructor() {
        this.skillsGrid = document.querySelector('.skills-grid');
        this.filtersContainer = document.querySelector('.skills-filters');
        this.dataPath = 'data/skills.json';
        this.skillsData = [];
        
        this.init();
    }
    
    async init() {
        if (!this.skillsGrid) {
            console.warn('Skills grid element not found');
            return;
        }
        
        await this.loadSkills();
    }
    
    async loadSkills() {
        try {
            const response = await fetch(this.dataPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.skillsData = data.skills;
            
            // Create filter buttons
            this.createFilterButtons();
            
            // Render skills
            this.renderSkills(this.skillsData);
            
            // Attach filter event listeners
            this.attachFilterEvents();
            
        } catch (error) {
            console.error('Error loading skills:', error);
            this.showError();
        }
    }
    
    // Calculate count for each category
    calculateCategoryCounts() {
        const counts = {
            'all': this.skillsData.length
        };
        
        this.skillsData.forEach(skill => {
            counts[skill.category] = (counts[skill.category] || 0) + 1;
        });
        
        return counts;
    }
    
    // Create filter buttons dynamically
    createFilterButtons() {
        if (!this.filtersContainer) return;
        
        const counts = this.calculateCategoryCounts();
        const categories = ['all', ...new Set(this.skillsData.map(s => s.category))];
        
        // Professional category labels
        const buttonLabels = {
            'all': 'Tümü',
            'Frontend': 'Frontend',
            'Backend': 'Backend',
            'UI/UX Design': 'UI/UX Design',
            'Tools & Others': 'Tools & Others'
        };
        
        this.filtersContainer.innerHTML = '';
        
        categories.forEach((category, index) => {
            const button = document.createElement('button');
            button.className = 'filter-btn' + (index === 0 ? ' active' : '');
            button.setAttribute('data-filter', category);
            button.innerHTML = `
                ${buttonLabels[category] || category} 
                <span class="filter-count">${counts[category]}</span>
            `;
            this.filtersContainer.appendChild(button);
        });
    }
    
    // Attach event listeners to filter buttons
    attachFilterEvents() {
        if (!this.filtersContainer) return;
        
        this.filtersContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.filter-btn');
            if (!button) return;
            
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            this.filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Filter skill cards
            this.filterSkills(filter);
        });
    }
    
    // Filter skills by category
    filterSkills(filter) {
        const cards = this.skillsGrid.querySelectorAll('.skill-card');
        
        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all') {
                card.classList.remove('hidden');
            } else {
                if (category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    }
    
    renderSkills(skills) {
        // Clear grid
        this.skillsGrid.innerHTML = '';
        
        // Create card for each skill
        skills.forEach(skill => {
            const card = this.createSkillCard(skill);
            this.skillsGrid.appendChild(card);
        });
    }
    
    createSkillCard(skill) {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.setAttribute('data-skill-id', skill.id);
        card.setAttribute('data-category', skill.category);
        
        card.innerHTML = `
            <div class="skill-logo">
                <img 
                    src="${skill.logo}" 
                    alt="${skill.name} logo"
                    onerror="this.src='assets/logos/placeholder.svg'"
                    loading="lazy"
                >
            </div>
            <div class="skill-info">
                <div class="skill-name">${this.escapeHtml(skill.name)}</div>
                <div class="skill-category">${this.escapeHtml(skill.category)}</div>
            </div>
        `;
        
        return card;
    }
    
    showError() {
        this.skillsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                An error occurred while loading skills.
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
    new Skills();
});
