import { Application, Text, Texture } from "pixi.js";
import { loadFireWorkConfigs } from "./core/xmlLoader";
import { ENV } from "./config/env";
import {createCoordinatesRoot} from "./core/coordinatesSystem";
import { Scheduler } from "./core/scheduler";
import type { TextureSet } from "./fireworks";
import { Settings } from "./config/runtimeSettings";
import { enableResponsiveCanvas } from "./core/canvasResize";
import {  initBench } from "./core/benchmark";
import { createDebugToggle } from "./components/DebugToggle";
import { createStatsDisplay } from "./components/StatsDisplay";
import { createDebugPanel } from "./components/DebugPanel";

let textures = {
    particle: Texture.WHITE,
    rocket: Texture.WHITE,
    fountain: Texture.WHITE
  };

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

  Promise.all([
    loadTexture('/assets/particle.png'),
    loadTexture('/assets1/rocket.png'),
    loadTexture('/assets/fountain.png')
  ]).then(([particleTex, rocketTex, fountainTex]) => {
    textures = {
      particle: particleTex,
      rocket: rocketTex,
      fountain: fountainTex
    };
    console.log('Successfully loaded all textures manually');
  }).catch(err => {
    console.warn('Manual texture loading failed, using fallbacks', err);
  });
  
  console.log('Using textures:', textures);
} catch (error) {
  console.error('Error in texture loading process:', error);
}

function getQueryParam(param: string, value: string): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) === value;
}

const DEBUG_MODE = getQueryParam('mode', 'debug');

(async () => {
    document.body.appendChild(createDebugToggle(DEBUG_MODE));

    const app = new Application();
    await app.init({
        width: ENV.DISPLAY.WIDTH,
        height: ENV.DISPLAY.HEIGHT,
        background: ENV.DISPLAY.BACKGROUND_COLOR,
        resolution: devicePixelRatio,
    });

    initBench(app.ticker);

    console.log('textures loaded', textures);

    document.getElementById('fw-container')?.appendChild(app.canvas);

    const message = new Text({
        text: 'fireworks Display\nLoading...',
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

    console.log('fireworks application initialized');

    try {
        const screen = createCoordinatesRoot(app.screen.width, app.screen.height);
        screen.scale.set(Settings.viewportZoom, -Settings.viewportZoom);
        app.stage.addChild(screen);

        const logicalW = ENV.DISPLAY.WIDTH;   // 1024
        const logicalH = ENV.DISPLAY.HEIGHT;  // 768
        enableResponsiveCanvas(app, screen, logicalW, logicalH);

        const cfgs = await loadFireWorkConfigs(ENV.ASSETS.FIREWORKS_XML);
        console.table(cfgs);

        app.stage.removeChild(message);

        // Create TextureSet from loaded textures
        const textureSet: TextureSet = {
            particle: textures.particle,
            rocket: textures.rocket,
            fountain: textures.fountain
        };

        const scheduler = new Scheduler(cfgs, screen, textureSet);

        app.ticker.add(({ deltaMS }) => {
            screen.scale.set(Settings.viewportZoom, -Settings.viewportZoom);
            scheduler.update(deltaMS);
        });
    } catch (error) {
        console.error('Failed to load fireworks:', error);
    }



    if (DEBUG_MODE) {
        const pane = createDebugPanel();
        const statsDisplay = createStatsDisplay(pane.element.offsetWidth, app.ticker);
        document.body.appendChild(statsDisplay);
    }
})();