const DEFAULT_SETTINGS = {
    sparkScale: 4,         // Size of explosion particles
    trailScale: 1.2,         // Size of rocket trail particles
    fountainSpeed: 280,      // Initial upward velocity for fountain particles
    fountainSpread: 80,      // Sideways spread for fountain particles
    explosionSpeed: 400,     // Initial velocity for explosion particles
    gravity: -800,           // Downward acceleration (negative because Y is up)
    emitInterval: 20,        // Time between particle emissions (ms)
};

// Runtime settings that can be adjusted via the UI
export const Settings = {
    ...DEFAULT_SETTINGS
};

// Function to reset settings to defaults
export function resetSettings() {
    Object.assign(Settings, DEFAULT_SETTINGS);
}
