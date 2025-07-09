import { Pane } from "tweakpane";
import { Settings, resetSettings } from "../config/runtimeSettings";

/**
 * Creates the debug panel with all firework controls
 * @returns The created Tweakpane instance
 */
export function createDebugPanel(): Pane {
    const pane = new Pane({ title: 'Fireworks Debug Panel', expanded: false });

    // Rocket controls panel
    const rocketFolder = pane.addFolder({ title: 'Rocket Settings' });
    rocketFolder.addBinding(Settings, 'rocketSparkScale', { min: 0.5, max: 3.0, step: 0.1, label: 'Explosion Spark' });
    rocketFolder.addBinding(Settings, 'explosionParticles', { min: 30, max: 150, step: 5, label: 'Explosion Debris' });
    rocketFolder.addBinding(Settings, 'explosionJitter', { min: 0, max: 2, step: 0.05, label: 'Explosion Scatter' });
    rocketFolder.addBinding(Settings, 'explosionSpeed', { min: 150, max: 1000, step: 10 , label: 'Explosion Speed' });
    rocketFolder.addBinding(Settings, 'rocketScale', { min: 2, max: 5, step: 0.05, label: 'Rocket Scale' });

    // Fountain controls panel
    const fountainFolder = pane.addFolder({ title: 'Fountain Settings' });
    fountainFolder.addBinding(Settings, 'fountainSparkScale', { min: 0.1, max: 1.5, step: 0.1, label: 'Fountain Spark ' });
    fountainFolder.addBinding(Settings, 'fountainSpeed', { min: 100, max: 500, step: 10 , label: 'Fountain Speed' });
    fountainFolder.addBinding(Settings, 'fountainSpread', { min: 20, max: 200, step: 5, label: 'Fountain Spread' });
    fountainFolder.addBinding(Settings, 'fountainLife', { min: 300, max: 2000, step: 50, label: 'Particle Life' });

    // Global settings panel
    const globalFolder = pane.addFolder({ title: 'Global Settings' });
    globalFolder.addBinding(Settings, 'gravity', { min: -500, max: -100, step: 50 , label: 'Gravity' });
    globalFolder.addBinding(Settings, 'emitInterval', { min: 0.01, max: 10, step: 0.01, label: 'Particle Emit Interval' });
    globalFolder.addBinding(Settings, 'viewportZoom', { min: 0.1, max: 1, step: 0.1 , label: 'Viewport Zoom' });

    // Add reset button directly to the pane
    const resetBtn = pane.addButton({
        title: 'Reset to Defaults',
    });

    resetBtn.on('click', () => {
        resetSettings();
        pane.refresh();
    });

    return pane;
}