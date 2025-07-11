# Fireworks Display Application

## How to Run

### Quick Start
1. Extract the provided zip file to your web server directory
2. Open `index.html` in Chrome or Firefox
3. The application will automatically load the default `fireworks.xml` file and begin the display

### Development Setup
If you wish to examine or modify the source code:

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Features

### Core Requirements Implementation
-  Reads and parses the XML file format exactly as specified
-  Implements both Rocket and Fountain firework types
-  Handles all attributes: begin, type, colour, duration, position, velocity
-  Restarts the display after all fireworks have completed
-  Frame-rate independent animation using delta time
-  Robust error handling for malformed XML
-  Works in latest Chrome and Firefox

### Special Modes

#### Debug Mode
Enable by adding `?mode=debug` to the URL (e.g., `http://localhost:8080/?mode=debug`)

Debug mode provides:
- Interactive parameter adjustment panel
- Performance monitoring (FPS, memory usage)
- Particle count statistics
- XML configuration selection
- Asset switching options

The debug panel allows real-time adjustment of:
- Rocket explosion size, particle count, and scatter
- Fountain particle size, speed, spread, and lifetime
- Global settings like gravity and viewport zoom

#### Alternative Visual Mode
Enable by adding `?mode=alt` to the URL (e.g., `http://localhost:8080/?mode=alt`)

This mode shows the Fireworks display with alternative textures.

## Technical Implementation

### Architecture
The application follows a modular architecture:
- **XML Loader**: Parses and validates the XML configuration
- **Scheduler**: Manages timing of firework creation and lifecycle
- **Firework Types**: Encapsulated implementations of each firework type
- **Particle System**: Efficient particle management with optional pooling
- **Coordinate System**: Handles the specified coordinate space (1024×768, origin at center)

### Performance Optimizations
- Particle pooling to reduce garbage collection (toggle in debug mode)
- Texture loading with error handling
- Efficient rendering using PIXI.js
- Frame-rate independent physics

### Error Handling
The application includes error handling for:
- Malformed XML structure (via DOMParser error detection)
```typescript
const parseErr = dom.querySelector('parsererror');
if(parseErr) {
    throw new Error(`XML parsing error: ${parseErr.textContent}`);
}
```
- Missing or invalid attributes (with specific error messages)
```typescript
function mustAttr(el: Element, name: string): string {
    const v = el.getAttribute(name);
    if (v === null) throw new Error(`<${el.tagName}> missing '${name}' attribute`);
    return v.trim();
}
```
- Network errors when loading resources
```typescript
const raw = await fetch(url).then( r=>{
    if(!r.ok) throw new Error(`HTTP ${r.status} while loading ${url}`);
    return r.text();
});
```
- Texture loading failures (with fallback to white texture)
```typescript
catch (error) {
  console.error('Error in texture loading process:', error);
    return {
      particle: Texture.WHITE,
      rocket: Texture.WHITE,
      fountain: Texture.WHITE
    };
}
```

When errors occur, a user-friendly error message is displayed instead of crashing:
```typescript
const errorText = new Text({
    text: `⚠️ Error loading XML:\n${err.message}`,
    style: {
        fontFamily: 'Arial',
        fontSize: 28,
        fill: 0xff4444,
        align: 'center',
    },
});
```

## Runtime Settings

The application uses the following configurable parameters:

**Default Mode Settings:**
- **rocketScale**: 2.30 - Size of rocket body
- **rocketSparkScale**: 1.4 - Size of explosion particles
- **fountainSparkScale**: 0.8 - Size of fountain particles
- **trailScale**: 1.2 - Size of rocket trail particles
- **fountainSpeed**: 300 - Upward velocity (px/s)
- **fountainSpread**: 100 - Horizontal spread (px)
- **fountainLife**: 1200 - Particle lifetime (ms)
- **explosionSpeed**: 400 - Explosion velocity (px/s)
- **gravity**: -200 - Downward acceleration (px/s²)
- **emitInterval**: 2 - Time between particle emissions (ms)
- **viewportZoom**: 0.9 - Zoom level for the viewport
- **explosionJitter**: 1 - Random variation in explosion velocity
- **explosionParticles**: 80 - Particles per explosion

**Alternative Mode Settings:**
- **rocketScale**: 2.50
- **rocketSparkScale**: 1.8
- **fountainSparkScale**: 2.4
- **trailScale**: 1.5
- **fountainSpeed**: 350
- **fountainSpread**: 150
- **fountainLife**: 1150
- **explosionSpeed**: 500
- **gravity**: -150
- **emitInterval**: 1.5
- **viewportZoom**: 0.8
- **explosionJitter**: 1.5
- **explosionParticles**: 120

These settings can be adjusted in real-time using the debug panel to fine-tune the visual experience.

## Extensibility

The code is designed for easy extension:
- Adding new firework types requires minimal changes
- Visual assets can be swapped without code modification
- Parameters are centralized for easy tuning
- Event system allows for adding new effects or behaviors

### Technology Stack
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **PIXI.js** - 2D WebGL renderer
- **Tweakpane** - Debug UI for parameter adjustment
- **ESLint + Prettier** - Code linting and formatting




