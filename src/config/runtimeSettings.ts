const DEFAULT_SETTINGS = {
    rocketScale: 2.30,          // Size of rocket body
    rocketSparkScale: 1.4,    // Size of rocket explosion particles
    fountainSparkScale: 0.8,  // Size of fountain particles
    trailScale: 1.2,          // Size of rocket trail particles
    fountainSpeed: 300,       // Initial upward velocity for fountain particles
    fountainSpread: 100,      // Sideways spread for fountain particles
    fountainLife: 1200,       // Lifetime of fountain particles in ms
    explosionSpeed: 400,      // Initial velocity for explosion particles
    gravity: -200,            // Downward acceleration (negative because Y is up)
    emitInterval: 2,          // Time between particle emissions (ms)
    viewportZoom: 0.9,          // Zoom level for the viewport
    explosionJitter: 1,      // Random variation in explosion velocity (0-1)
    explosionParticles: 80,    // Number of particles in explosion
};

//  Settings for alt mode
const ALT_SETTINGS = {
    rocketScale: 2.50,
    rocketSparkScale: 1.8,
    fountainSparkScale: 2.4,
    trailScale: 1.5,
    fountainSpeed: 350,
    fountainSpread: 150,
    fountainLife: 1150,
    explosionSpeed: 500,
    gravity: -150,
    emitInterval: 1.5,
    viewportZoom: 0.8,
    explosionJitter: 1.5,
    explosionParticles: 120,
};

export const Settings = {
    ...DEFAULT_SETTINGS
};

export function resetSettings() {
    const isAltMode = new URLSearchParams(window.location.search).get('mode') === 'alt' || localStorage.getItem('useAltAssets') === 'true';
    Object.assign(Settings, isAltMode ? ALT_SETTINGS : DEFAULT_SETTINGS);
}
resetSettings();