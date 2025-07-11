import { Pane } from "tweakpane";
import { Settings, resetSettings } from "../config/runtimeSettings";
import {ENV} from "../config/env";

export const AssetSettings = {
    useAltAssets: localStorage.getItem('useAltAssets') === 'true' || false
};

export function getAssetPath(filename: string): string {
    return AssetSettings.useAltAssets ? `/assets_alt/${filename}` : `/assets/${filename}`;
}

export const XMLSettings = {
    currentXML: localStorage.getItem('currentXML') || 'default'
};

export function getXMLPath():string {
    switch (XMLSettings.currentXML) {
        case 'large': return '/fireworksLargeSet.xml';
        case 'varied': return '/fireworksVariedSet.xml';
        case 'extreme': return '/fireworksSaoJoaoSet.xml';
        default: return ENV.ASSETS.FIREWORKS_XML;
    }
}

/**
 * Creates the debug panel with all firework controls
 * @returns The created Tweakpane instance
 */
export function createDebugPanel(): Pane {
    const pane = new Pane({ title: 'Fireworks Debug Panel' });

    const xmlFolder = pane.addFolder({ title: 'XML Configuration' });
    const xmlOptions = {
        'Default': 'default',
        'Large Set': 'large',
        'Varied Set': 'varied',
        'Extreme(Caution)': 'extreme'
    };
    const xmlController = xmlFolder.addBinding(XMLSettings, 'currentXML', {
        options: xmlOptions,
        label: 'XML File'
    });

    xmlController.on('change', (ev) => {
        localStorage.setItem('currentXML', ev.value);
        window.location.reload();
    });

    // Rocket controls panel
    const rocketFolder = pane.addFolder({ title: 'Rocket Settings' });
    rocketFolder.addBinding(Settings, 'rocketSparkScale', { min: 0.5, max: 3.0, step: 0.1, label: 'Explosion Spark' });
    rocketFolder.addBinding(Settings, 'explosionParticles', { min: 30, max: 150, step: 5, label: 'Explosion Debris' });
    rocketFolder.addBinding(Settings, 'explosionJitter', { min: 0, max: 2, step: 0.05, label: 'Explosion Scatter' });
    rocketFolder.addBinding(Settings, 'explosionSpeed', { min: 150, max: 1000, step: 10 , label: 'Explosion Speed' });
    rocketFolder.addBinding(Settings, 'rocketScale', { min: 1, max: 4, step: 0.05, label: 'Rocket Scale' });

    // Fountain controls panel
    const fountainFolder = pane.addFolder({ title: 'Fountain Settings' });
    fountainFolder.addBinding(Settings, 'fountainSparkScale', { min: 0.1, max: 4, step: 0.1, label: 'Fountain Spark ' });
    fountainFolder.addBinding(Settings, 'fountainSpeed', { min: 100, max: 500, step: 10 , label: 'Fountain Speed' });
    fountainFolder.addBinding(Settings, 'fountainSpread', { min: 20, max: 200, step: 5, label: 'Fountain Spread' });
    fountainFolder.addBinding(Settings, 'fountainLife', { min: 300, max: 2000, step: 50, label: 'Particle Life' });

    // Global settings panel
    const globalFolder = pane.addFolder({ title: 'Global Settings' });
    globalFolder.addBinding(Settings, 'gravity', { min: -500, max: -100, step: 50 , label: 'Gravity' });
    globalFolder.addBinding(Settings, 'emitInterval', { min: 0.01, max: 10, step: 0.01, label: 'Particle Emit Interval' });
    globalFolder.addBinding(Settings, 'viewportZoom', { min: 0.1, max: 1, step: 0.1 , label: 'Viewport Zoom' });

    const assetFolder = pane.addFolder({ title: 'Asset Settings' });
    const assetToggle = assetFolder.addBinding(AssetSettings, 'useAltAssets', { label: 'Use Alt Assets' });

    assetToggle.on('change', (ev) => {
        localStorage.setItem('useAltAssets', ev.value.toString());
        window.location.reload();
    });

    const resetBtn = pane.addButton({
        title: 'Reset to Defaults',
    });

    resetBtn.on('click', () => {
        resetSettings();
        pane.refresh();
    });

    return pane;
}