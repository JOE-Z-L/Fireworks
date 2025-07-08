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
    rocketFolder.addBinding(Settings, 'rocketSparkScale', { min: 0.5, max: 3.0, step: 0.1, label: 'Spark Scale' });
    rocketFolder.addBinding(Settings, 'explosionParticles', { min: 30, max: 150, step: 5 });
    rocketFolder.addBinding(Settings, 'explosionJitter', { min: 0, max: 2, step: 0.05 });
    rocketFolder.addBinding(Settings, 'explosionSpeed', { min: 150, max: 1000, step: 10 });
    rocketFolder.addBinding(Settings, 'rocketScale', { min: 1, max: 2, step: 0.05, label: 'Rocket Scale' });

    // Fountain controls panel
    const fountainFolder = pane.addFolder({ title: 'Fountain Settings' });
    fountainFolder.addBinding(Settings, 'fountainSparkScale', { min: 0.5, max: 3.0, step: 0.1, label: 'Spark Scale' });
    fountainFolder.addBinding(Settings, 'fountainSpeed', { min: 100, max: 500, step: 10 });
    fountainFolder.addBinding(Settings, 'fountainSpread', { min: 20, max: 200, step: 5 });
    fountainFolder.addBinding(Settings, 'fountainLife', { min: 300, max: 2000, step: 50, label: 'Particle Life' });

    // Global settings panel
    const globalFolder = pane.addFolder({ title: 'Global Settings' });
    globalFolder.addBinding(Settings, 'gravity', { min: -500, max: -100, step: 50 });
    globalFolder.addBinding(Settings, 'emitInterval', { min: 0.01, max: 10, step: 0.01 });
    globalFolder.addBinding(Settings, 'viewportZoom', { min: 0.5, max: 3, step: 0.1 });

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