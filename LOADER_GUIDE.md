# Component Loader Guide

## Overview
The component loader system provides centralized component initialization with error handling, dependency management, and performance tracking.

## Architecture

### Files
- **`main.js`** - Application entry point, orchestrates initialization
- **`loader.js`** - Component loader with error handling and dependency management

### Loading Sequence
```
1. global.js      (utilities and helpers)
2. navbar.js      (component class)
3. skills.js      (component class)
4. projects.js    (component class)
5. project-detail.js (component class)
6. loader.js      (loader system)
7. main.js        (initialization)
```

## How It Works

### 1. Component Registration
Components are registered in `loader.js`:

```javascript
// Register component with optional dependencies
window.ComponentLoader.register(
    'componentName',      // Unique identifier
    initFunction,         // Async initialization function
    ['dependency1']       // Optional: array of dependency names
);
```

### 2. Component Initialization
Each component has an init function that:
- Checks if required DOM elements exist
- Waits for the component's own initialization
- Throws errors if something goes wrong

Example:
```javascript
async function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        throw new Error('Navbar element not found in DOM');
    }
    
    // Navbar initializes itself via DOMContentLoaded
    // Just verify it exists and wait
    await new Promise(resolve => setTimeout(resolve, 50));
}
```

### 3. Automatic Loading
`main.js` automatically:
- Waits for DOM ready
- Loads all registered components
- Handles errors gracefully
- Dispatches ready event

## Error Handling

### Types of Errors Handled
1. **Missing DOM elements** - Component's container not found
2. **Failed data loading** - JSON fetch errors
3. **Initialization failures** - Component setup errors
4. **Missing dependencies** - Required components not loaded

### Error Recovery
- Failed components are logged but don't crash the app
- User sees friendly error messages in component areas
- Other components continue to work normally
- Console shows detailed error information

### Example Error Handling
```javascript
try {
    await window.ComponentLoader.loadAll();
} catch (error) {
    console.error('Loading failed:', error);
    // App shows error UI but continues running
}
```

## Debugging

### Console Output
The loader provides detailed console logs:
```
🚀 Starting component loader...
📦 Loading component: navbar
✅ navbar loaded successfully
📦 Loading component: skills
✅ skills loaded successfully
📊 Component Loading Results:
✅ Successfully loaded: 3
❌ Failed to load: 0
⏱️  Total time: 145.32ms
```

### Debug Mode
On localhost, access debug info:
```javascript
// In browser console
window.PortfolioApp          // Main app object
window.ComponentLoader        // Loader instance

// Check status
window.ComponentLoader.loadedComponents   // Set of loaded components
window.ComponentLoader.failedComponents   // Set of failed components
window.ComponentLoader.errors             // Array of error details
```

### Test Suite
Open `test.html` to run automated tests:
- Verifies loader is available
- Checks component registration
- Tests file existence
- Shows component status
- Reports any errors

## Adding New Components

### Step 1: Create Component File
Create `js/my-component.js`:
```javascript
class MyComponent {
    constructor() {
        this.container = document.querySelector('.my-component');
        this.init();
    }
    
    async init() {
        if (!this.container) {
            console.warn('MyComponent container not found');
            return;
        }
        
        // Your initialization code
        await this.loadData();
        this.render();
    }
    
    async loadData() {
        // Load data
    }
    
    render() {
        // Render UI
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MyComponent();
});
```

### Step 2: Register in loader.js
Add to `loader.js`:
```javascript
// Create init function
async function initMyComponent() {
    const container = document.querySelector('.my-component');
    if (!container) {
        throw new Error('MyComponent container not found');
    }
    await new Promise(resolve => setTimeout(resolve, 100));
}

// Register component
window.ComponentLoader.register(
    'myComponent',
    initMyComponent,
    [] // Add dependencies if needed
);
```

### Step 3: Add Script Tag
In HTML files:
```html
<script src="js/my-component.js"></script>
<script src="js/loader.js"></script>
<script src="js/main.js"></script>
```

### Step 4: Test
1. Open `test.html` to verify registration
2. Check console for loading status
3. Verify component works on main page

## Dependencies

### Declaring Dependencies
If component B depends on component A:
```javascript
window.ComponentLoader.register(
    'componentB',
    initComponentB,
    ['componentA']  // B needs A to be loaded first
);
```

### Automatic Ordering
The loader automatically:
- Sorts components by dependencies
- Loads dependencies first
- Validates all dependencies exist
- Reports missing dependencies

## Performance

### Timing
The loader tracks:
- Individual component load time
- Total initialization time
- Time to first interactive

### Optimization Tips
1. Keep init functions lightweight
2. Defer heavy operations to after init
3. Use async/await for data loading
4. Minimize DOM queries in init

## Best Practices

### 1. Error Handling
```javascript
// ✅ Good - throw descriptive errors
if (!element) {
    throw new Error('Specific element not found');
}

// ❌ Bad - silent failures
if (!element) {
    return;
}
```

### 2. Async Operations
```javascript
// ✅ Good - wait for async operations
await this.loadData();
await this.render();

// ❌ Bad - don't wait
this.loadData();
this.render();
```

### 3. DOM Checks
```javascript
// ✅ Good - check before accessing
const el = document.querySelector('.selector');
if (!el) throw new Error('Element not found');

// ❌ Bad - assume it exists
const el = document.querySelector('.selector');
el.classList.add('active'); // Might throw
```

## Troubleshooting

### Component Not Loading
1. Check console for error messages
2. Verify script tag is in HTML
3. Check component is registered in loader.js
4. Verify DOM elements exist

### Initialization Errors
1. Open browser console
2. Look for ❌ error messages
3. Check error details in `window.ComponentLoader.errors`
4. Verify all dependencies are met

### Test Failures
1. Open `test.html`
2. Check which tests failed
3. Review error descriptions
4. Fix issues and refresh

## Events

### App Ready Event
Listen for app initialization:
```javascript
window.addEventListener('app:ready', (event) => {
    console.log('App ready!', event.detail);
    // Your code here
});
```

### Custom Events
Dispatch custom events from components:
```javascript
// In component
const event = new CustomEvent('component:loaded', {
    detail: { componentName: 'myComponent' }
});
window.dispatchEvent(event);

// Listen
window.addEventListener('component:loaded', (e) => {
    console.log('Component loaded:', e.detail.componentName);
});
```

## FAQ

**Q: Why do components initialize themselves via DOMContentLoaded?**
A: This ensures they work even without the loader (backward compatibility).

**Q: Can I remove the loader system?**
A: Yes, but you'll lose error handling, dependency management, and debugging tools.

**Q: How do I disable console logging?**
A: Edit loader.js and comment out console.log statements (keep console.error).

**Q: Can I add dependencies between existing components?**
A: Yes, just update the registration in loader.js with the dependencies array.

**Q: What happens if a non-critical component fails?**
A: The app continues running, shows an error message in that component's area, and logs the error.
