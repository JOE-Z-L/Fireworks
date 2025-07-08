const DEFAULT_SETTINGS = {
    rocketScale: 1.4,          // Size of rocket body
    rocketSparkScale: 1.4,    // Size of rocket explosion particles
    fountainSparkScale: 2.4,  // Size of fountain particles
    trailScale: 1.2,          // Size of rocket trail particles
    fountainSpeed: 300,       // Initial upward velocity for fountain particles
    fountainSpread: 100,      // Sideways spread for fountain particles
    fountainLife: 1200,       // Lifetime of fountain particles in ms
    explosionSpeed: 400,      // Initial velocity for explosion particles
    gravity: -200,            // Downward acceleration (negative because Y is up)
    emitInterval: 2,          // Time between particle emissions (ms)
    viewportZoom: 1,          // Zoom level for the viewport
    explosionJitter: 1,      // Random variation in explosion velocity (0-1)
    explosionParticles: 80,    // Number of particles in explosion
};

export const Settings = {
    ...DEFAULT_SETTINGS
};

export function resetSettings() {
    Object.assign(Settings, DEFAULT_SETTINGS);
}
