import { Application, Text, Texture } from "pixi.js";
import { loadFireWorkConfigs } from "./core/xmlLoader";
import { ENV } from "./config/env";
import {createCoordinatesRoot} from "./core/coordinatesSystem";
import { Scheduler } from "./core/scheduler";
import type { TextureSet } from "./fireworks";
import {resetSettings, Settings} from "./config/runtimeSettings";
import { enableResponsiveCanvas } from "./core/canvasResize";
import {  initBench } from "./core/benchmark";
import { createStatsDisplay } from "./components/StatsDisplay";
import { createDebugPanel, getAssetPath, AssetSettings, getXMLPath } from "./components/DebugPanel";

const loadTextures = async (): Promise<TextureSet> => {
try {
  const loadTexture = (url: string): Promise<Texture> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        resolve(Texture.from(img));
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${url}`);
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });
  };

    const [particleTex, rocketTex, fountainTex] = await Promise.all([
    loadTexture(getAssetPath('particle.png')),
    loadTexture(getAssetPath('rocket.png')),
    loadTexture(getAssetPath('fountain.png'))
    ]);

    console.log('Successfully loaded all textures');
    return {
      particle: particleTex,
      rocket: rocketTex,
      fountain: fountainTex
    };
} catch (error) {
  console.error('Error in texture loading process:', error);
    return {
      particle: Texture.WHITE,
      rocket: Texture.WHITE,
      fountain: Texture.WHITE
    };
}
};

function getQueryParam(param: string, value: string): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) === value;
}

const DEBUG_MODE = getQueryParam('mode', 'debug');
const ALT_MODE = getQueryParam('mode', 'alt');

if (ALT_MODE) {
  localStorage.setItem('useAltAssets', 'true');
  AssetSettings.useAltAssets = true;
} else if (!DEBUG_MODE) {
  localStorage.removeItem('useAltAssets');
  AssetSettings.useAltAssets = false;
}

resetSettings();

(async () => {
    const app = new Application();
    await app.init({
        width: ENV.DISPLAY.WIDTH,
        height: ENV.DISPLAY.HEIGHT,
        background: ENV.DISPLAY.BACKGROUND_COLOR,
        resolution: devicePixelRatio,
    });

    initBench(app.ticker);

    document.getElementById('fw-container')?.appendChild(app.canvas);

    const message = new Text({
        text: 'Fireworks Display\nLoading...',
        style: {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xffffff,
            align: 'center'
        }
    });

    message.anchor.set(0.5);
    message.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(message);

    console.log('Fireworks application initialized, loading textures...');

    let textureSet;
    try {
        textureSet = await loadTextures();
    console.log('Textures loaded:', textureSet);
    } catch (textureError) {
        console.error('Error loading textures:', textureError);

        app.stage.removeChild(message);

        const errorText = new Text({
            text: `⚠️ Asset Loading Error\nFailed to load required textures`,
            style: {
                fontFamily: 'Arial',
                fontSize: 28,
                fill: 0xff4444,
                align: 'center',
            },
        });
        errorText.anchor.set(0.5);
        errorText.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(errorText);

        return;
    }

    try {
        const screen = createCoordinatesRoot(app.screen.width, app.screen.height);
        screen.scale.set(Settings.viewportZoom, -Settings.viewportZoom);
        app.stage.addChild(screen);

        const logicalW = ENV.DISPLAY.WIDTH;
        const logicalH = ENV.DISPLAY.HEIGHT;
        enableResponsiveCanvas(app, screen, logicalW, logicalH);

        try {
        const cfgs = await loadFireWorkConfigs(getXMLPath());
        console.table(cfgs);

        app.stage.removeChild(message);

        const scheduler = new Scheduler(cfgs, screen, textureSet);

        app.ticker.add(({ deltaMS }) => {
            screen.scale.set(Settings.viewportZoom, -Settings.viewportZoom);
            scheduler.update(deltaMS);
        });
        } catch (err: any) {
            console.error('Failed to load fireworks:', err);

            app.stage.removeChild(message);

            const errorText = new Text({
                text: `⚠️ Error loading XML:\n${err.message}`,
                style: {
                    fontFamily: 'Arial',
                    fontSize: 28,
                    fill: 0xff4444,
                    align: 'center',
                },
            });
            errorText.anchor.set(0.5);
            errorText.position.set(app.screen.width / 2, app.screen.height / 2);
            app.stage.addChild(errorText);
        }
    } catch (error) {
        console.error('Failed to load fireworks:', error);
    }

    if (DEBUG_MODE) {
        const pane = createDebugPanel();
        const statsDisplay = createStatsDisplay(pane.element.offsetWidth, app.ticker);
        document.body.appendChild(statsDisplay);
    }
})();