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

### CI/CD
This project includes a GitHub Actions workflow that:
- Tests on Node.js 18, 20, and 22
- Runs linting, testing, and builds
- Uploads build artifacts
- Supports preview deployments for pull requests

### Technology Stack
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **PIXI.js** - 2D WebGL renderer
- **Vitest** - Fast unit testing framework
- **ESLint + Prettier** - Code linting and formatting
