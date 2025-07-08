const DEFAULT_SETTINGS = {
    sparkScale: 6.0,         // Size of explosion particles
    trailScale: 1.2,         // Size of rocket trail particles
    fountainSpeed: 280,      // Initial upward velocity for fountain particles
    fountainSpread: 80,      // Sideways spread for fountain particles
    explosionSpeed: 400,     // Initial velocity for explosion particles
    gravity: -500,           // Downward acceleration (negative because Y is up)
    emitInterval: 2,        // Time between particle emissions (ms)
    viewportZoom: 1,         // Zoom level for the viewport
};

export const Settings = {
    ...DEFAULT_SETTINGS
};

export function resetSettings() {
    Object.assign(Settings, DEFAULT_SETTINGS);
}
