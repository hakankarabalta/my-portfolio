# Portfolio Website

A modern, responsive portfolio website built with vanilla HTML, CSS, and JavaScript. Features a clean design with smooth animations and dynamic content loading.

## 🎨 Features

- **Responsive Design**: Fully responsive layout that works seamlessly across desktop, tablet, and mobile devices
- **Dynamic Content**: Projects and skills are loaded dynamically from JSON files
- **Smooth Animations**: Elegant fade-in animations and smooth transitions
- **Interactive Navigation**: Mobile-friendly hamburger menu with smooth scrolling
- **Project Showcase**: Filterable skills section and detailed project pages with image sliders
- **Modern UI/UX**: Clean, minimalist design with careful attention to typography and spacing

## 🚀 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties (CSS variables), Flexbox, Grid
- **JavaScript (ES6+)**: Classes, async/await, modules
- **JSON**: Data storage for projects and skills

## 📁 Project Structure

```
portfolio/
├── css/
│   ├── global.css          # Global styles, CSS variables, utility classes
│   ├── navbar.css          # Navigation bar styles
│   ├── hero.css            # Hero section styles
│   ├── skills.css          # Skills section styles
│   ├── projects.css        # Projects grid styles
│   └── project-detail.css  # Project detail page styles
├── js/
│   ├── main.js             # Main application entry point
│   ├── loader.js           # Component loader with error handling
│   ├── global.js           # Global utilities and scroll handling
│   ├── navbar.js           # Navigation functionality
│   ├── skills.js           # Skills loading and filtering
│   ├── projects.js         # Projects loading and rendering
│   └── project-detail.js   # Project detail page and image slider
├── data/
│   ├── skills.json         # Skills data
│   └── projects.json       # Projects data
├── index.html              # Main page
├── project-detail.html     # Project detail page
├── test.html               # Test suite for loader system
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## 🎯 CSS Architecture

### CSS Variables
The project uses CSS custom properties for consistent theming:

```css
/* Colors */
--bg-primary, --bg-secondary, --bg-ghost
--text-primary, --text-secondary, --text-muted
--primary, --primary-hover, --primary-light

/* Spacing */
--spacing-xs, --spacing-sm, --spacing-md, 
--spacing-lg, --spacing-xl, --spacing-2xl

/* Border Radius */
--radius-sm, --radius-md, --radius-lg, --radius-xl

/* Shadows */
--shadow-sm, --shadow-md, --shadow-lg

/* Transitions */
--transition-fast, --transition-base, --transition-slow
```

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

## 🔧 Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Open in browser**
   
   Simply open `index.html` in your web browser. No build process required!

   For local development with live reload, you can use any simple HTTP server:
   
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (with http-server package)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

3. **Test the loader system**
   
   Open `test.html` in your browser to see the component loader test suite and verify all files are loading correctly.

4. **Customize content**
   
   - Edit `data/skills.json` to add your skills
   - Edit `data/projects.json` to add your projects
   - Update social links in `index.html` and `project-detail.html`
   - Replace profile image URL in `css/global.css` (--profile-image variable)

## 🏗️ JavaScript Architecture

The project uses a modular component loading system:

### Loading Order
1. **global.js** - Global utilities and scroll handlers
2. **Component scripts** (navbar.js, skills.js, projects.js, project-detail.js)
3. **loader.js** - Centralized component loader with error handling
4. **main.js** - Application entry point and orchestration

### Component Loader Features
- **Dependency Management**: Components can depend on other components
- **Error Handling**: Graceful degradation if components fail to load
- **Loading Progress**: Console logging of component loading status
- **Error Reporting**: User-friendly error messages in UI
- **Performance Tracking**: Measures and logs initialization time

### Debug Mode
When running on localhost, the application exposes `window.PortfolioApp` for debugging:
```javascript
// In browser console
PortfolioApp.initialized  // Check if app is ready
window.ComponentLoader.loadedComponents  // See loaded components
window.ComponentLoader.errors  // Check for errors
```

## 📝 Customization Guide

### Adding Skills

Edit `data/skills.json`:

```json
{
  "skills": [
    {
      "id": 1,
      "name": "JavaScript",
      "category": "Yazılım Dili",
      "logo": "https://cdn.jsdelivr.net/path/to/logo.svg"
    }
  ]
}
```

**Categories**:
- "Yazılım Dili" (Programming Language)
- "Araç" (Tool)
- "Diğer Yetenek" (Other Skill)

### Adding Projects

Edit `data/projects.json`:

```json
{
  "projects": [
    {
      "id": 1,
      "title": "Project Name",
      "thumbnail": "https://example.com/image.jpg",
      "tags": [
        { "name": "React", "color": "#61dafb" }
      ],
      "description": "Project description...",
      "detailImages": [
        "https://example.com/detail1.jpg",
        "https://example.com/detail2.jpg"
      ]
    }
  ]
}
```

### Changing Colors

Edit CSS variables in `css/global.css`:

```css
:root {
  --primary: #d63447;        /* Main accent color */
  --primary-hover: #c22a3d;  /* Hover state */
  --primary-light: #e85d6f;  /* Lighter variant */
}
```

### Changing Profile Image

In `css/global.css`, update:

```css
--profile-image: url('your-image-url-here');
```

## 📱 Features Breakdown

### Skills Section
- Filterable by category
- Smooth fade animations
- Custom scrollbar
- Responsive grid layout (4 → 3 → 1 columns)

### Projects Section
- Grid layout on desktop (3 columns)
- Horizontal scroll on mobile
- Hover effects with lift animation
- Click to view detailed project page

### Project Detail Page
- Image slider with touch support
- Click images to view in fullscreen modal
- Navigation arrows (hidden on mobile)
- Touch swipe gestures for mobile
- Smooth slide transitions

### Navigation
- Sticky navbar with scroll shadow
- Active link highlighting based on scroll position
- Mobile hamburger menu with overlay
- Smooth scroll to sections

## 🎨 Design Principles

- **Mobile-First**: Designed for mobile first, enhanced for larger screens
- **Performance**: Lazy loading images, efficient CSS, minimal JavaScript
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support
- **Clean Code**: Organized file structure, commented code, consistent naming

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/portfolio/issues).

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Note**: Remember to replace placeholder URLs, social media links, and personal information with your actual details before deploying.
