# Fireworks

## Development Setup

This project is built with TypeScript, Vite, and PIXI.js.

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with UI

### Debug Mode
The application supports a debug mode that can be enabled by adding `?mode=debug` to the URL:
```
http://localhost:8080/?mode=debug
```

When debug mode is enabled, you'll have access to:
- TweakPane UI for adjusting firework parameters in real-time
- Performance statistics (FPS, memory usage, particle counts)
- Particle pooling toggle

### Alternative Mode
The application also supports an alternative visual mode that can be enabled by adding `?mode=alt` to the URL:
```
http://localhost:8080/?mode=alt
```

When alt mode is enabled:
- Alternative textures are loaded from the `/assets_alt/` directory
- Different firework parameters are applied (more particles, different sizes, etc.)


### Technology Stack
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **PIXI.js** - 2D WebGL renderer
- **Vitest** - Fast unit testing framework
- **ESLint + Prettier** - Code linting and formatting

### Running Independently

To run the application independently:

1. Build the project:
```bash
npm run build
```

2. The build output will be in the `dist` directory. You can serve these files with any web server.

3. For a simple local server, you can use:
   - Python: `python -m http.server -d dist 8080`
   - Node.js: `npx serve dist`
   - Or any other static file server

### Creating a Distribution Package

To create a zip file for distribution:

1. Build the project:
```bash
npm run build
```

2. Zip the contents of the `dist` directory:
```bash
# On Linux/macOS
cd dist && zip -r ../fireworks.zip .

# On Windows (PowerShell)
Compress-Archive -Path dist\* -DestinationPath fireworks.zip
```

3. The resulting `fireworks.zip` file can be deployed to any web server by extracting its contents to the server's root directory.
