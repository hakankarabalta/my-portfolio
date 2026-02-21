// ===================================
// PROJECT DETAIL PAGE JAVASCRIPT
// Handles project detail display and image slider
// ===================================

class ProjectDetail {
    constructor() {
        this.projectId = this.getProjectIdFromURL();
        this.dataPath = 'data/projects.json';
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    getProjectIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'));
    }
    
    async init() {
        if (!this.projectId) {
            console.error('Project ID not found');
            window.location.href = 'index.html';
            return;
        }
        
        await this.loadProject();
    }
    
    async loadProject() {
        try {
            const response = await fetch(this.dataPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const project = data.projects.find(p => p.id === this.projectId);
            
            if (!project) {
                throw new Error('Project not found');
            }
            
            this.renderProject(project);
            this.initSlider(project.detailImages);
            
        } catch (error) {
            console.error('Error loading project:', error);
            window.location.href = 'index.html';
        }
    }
    
    renderProject(project) {
        // Set page title
        document.title = `${project.title} - Portfolio`;
        
        // Render thumbnail
        const thumbnail = document.querySelector('.detail-thumbnail img');
        if (thumbnail) {
            thumbnail.src = project.thumbnail;
            thumbnail.alt = project.title;
        }
        
        // Render title
        const title = document.querySelector('.detail-title');
        if (title) {
            title.textContent = project.title;
        }
        
        // Render description
        const description = document.querySelector('.detail-description');
        if (description) {
            description.innerHTML = project.description;
        }
        
        // Render link if available
        const link = document.querySelector('.detail-link');
        if (link && project.Link) {
            link.href = project.Link;
            link.style.display = 'inline-flex';
        }
        
        // Render tags
        const tagsContainer = document.querySelector('.detail-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = project.tags.map(tag => 
                `<span class="detail-tag-item" style="background-color: ${this.hexToRGBA(tag.color, 0.2)}; color: ${tag.color};">
                    ${this.escapeHtml(tag.name)}
                </span>`
            ).join('');
        }
    }
    
    initSlider(images) {
        this.totalSlides = images.length;
        
        const track = document.querySelector('.slider-track');
        const indicatorsContainer = document.querySelector('.slider-indicators');
        
        if (!track || !indicatorsContainer) return;
        
        // Create slides
        track.innerHTML = images.map((img, index) => `
            <div class="slider-slide" data-index="${index}">
                <img src="${img}" alt="Project detail image ${index + 1}">
            </div>
        `).join('');
        
        // Create indicators
        indicatorsContainer.innerHTML = images.map((_, index) => `
            <button class="slider-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
        `).join('');
        
        // Attach event listeners
        this.attachSliderEvents();
    }
    
    attachSliderEvents() {
        // Arrow buttons
        const prevBtn = document.querySelector('.slider-arrow.prev');
        const nextBtn = document.querySelector('.slider-arrow.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicator buttons
        const indicators = document.querySelectorAll('.slider-indicator');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            });
        });
        
        // Touch events for mobile swipe
        const track = document.querySelector('.slider-track');
        if (track) {
            track.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            });
            
            track.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe();
            });
        }
        
        // Click image to open modal
        const slides = document.querySelectorAll('.slider-slide');
        slides.forEach(slide => {
            slide.addEventListener('click', () => {
                const img = slide.querySelector('img');
                this.openModal(img.src);
            });
        });
        
        // Close modal
        const modalClose = document.querySelector('.modal-close');
        const modal = document.querySelector('.image-modal');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    updateSlider() {
        const track = document.querySelector('.slider-track');
        const indicators = document.querySelectorAll('.slider-indicator');
        
        if (track) {
            track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - go to next slide
                this.nextSlide();
            } else {
                // Swipe right - go to previous slide
                this.prevSlide();
            }
        }
    }
    
    openModal(imageSrc) {
        const modal = document.querySelector('.image-modal');
        const modalImg = modal.querySelector('img');
        
        if (modal && modalImg) {
            modalImg.src = imageSrc;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal() {
        const modal = document.querySelector('.image-modal');
        
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Convert hex color to RGBA with transparency
    hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
    new ProjectDetail();
});
