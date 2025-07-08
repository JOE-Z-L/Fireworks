import { Application, Text, Assets, Texture } from "pixi.js";
import { loadFireWorkConfigs } from "./core/xmlLoader";
import { ENV } from "./config/env";
import {createCoordinatesRoot} from "./core/coordinatesSystem";
import { Scheduler } from "./core/scheduler";
import type { TextureSet } from "./fireworks";
import {Pane} from "tweakpane";
import { Settings, resetSettings } from "./config/runtimeSettings";
import { enableResponsiveCanvas } from "./core/canvasResize";

// Try a different approach to asset loading
let textures;
try {
  // Create empty textures first
  textures = {
    particle: Texture.WHITE,
    rocket: Texture.WHITE,
    fountain: Texture.WHITE
  };

  // Check if assets exist before trying to load them
  const assetsExist = await Promise.all([
    fetch('/assets1/particle.png').then(r => r.ok).catch(() => false),
    fetch('/assets1/rocket.png').then(r => r.ok).catch(() => false),
    fetch('/assets1/fountain.png').then(r => r.ok).catch(() => false)
  ]);

  if (assetsExist.every(exists => exists)) {
    // All assets exist, try to load them with PIXI
    try {
      const loadedTextures = await Assets.load({
        particle: '/assets/particle.png',
        rocket: '/assets/rocket.png',
        fountain: '/assets/fountain.png',
      });
      
      textures = loadedTextures;
      console.log('Successfully loaded all textures');
    } catch (loadError) {
      console.warn('PIXI asset loading failed, using fallbacks', loadError);
    }
  } else {
    console.warn('Some assets do not exist, using fallbacks');
  }
  
  console.log('Using textures:', textures);
} catch (error) {
  console.error('Error in texture loading process:', error);
}

(async () => {
    const app = new Application();
    await app.init({
        width: ENV.DISPLAY.WIDTH,
        height: ENV.DISPLAY.HEIGHT,
        background: ENV.DISPLAY.BACKGROUND_COLOR,
        resolution: devicePixelRatio,
    });
    console.log('textures loaded', textures);

    // Add canvas to DOM
    document.getElementById('pixi-container')?.appendChild(app.canvas);

    // Add welcome a message
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
        // Initial scale is set but will be updated by ticker
        screen.scale.set(Settings.viewportZoom, -Settings.viewportZoom);
        app.stage.addChild(screen);

        // Enable responsive canvas
        const logicalW = ENV.DISPLAY.WIDTH;   // 1024
        const logicalH = ENV.DISPLAY.HEIGHT;  // 768
        enableResponsiveCanvas(app, screen, logicalW, logicalH);

        const cfgs = await loadFireWorkConfigs(ENV.ASSETS.FIREWORKS_XML);
        console.table(cfgs);

        app.stage.removeChild(message);

        // Create TextureSet from loaded textures
        const textureSet: TextureSet = {
            particle: textures.particle,
            rocket: textures.rocket
        };

        // Initialize scheduler and start animation
        const scheduler = new Scheduler(cfgs, screen, textureSet);

        // Update ticker to include zoom adjustment
        app.ticker.add(({ deltaMS }) => {
            screen.scale.set(Settings.viewportZoom, -Settings.viewportZoom);
            scheduler.update(deltaMS);
        });
    } catch (error) {
        console.error('Failed to load fireworks:', error);
    }


    const pane = new Pane({ title: 'Fireworks' });
    pane.addBinding(Settings, 'sparkScale',     { min: 1, max: 10, step: 0.1 });
    pane.addBinding(Settings, 'trailScale',     { min: 1, max: 10, step: 0.1 });
    pane.addBinding(Settings, 'fountainSpeed',  { min: 100, max: 500, step: 10 });
    pane.addBinding(Settings, 'fountainSpread', { min: 20,  max: 500, step: 5  });
    pane.addBinding(Settings, 'explosionSpeed', { min: 150, max: 1000, step: 10 });
    pane.addBinding(Settings, 'gravity',        { min: -800, max: -200, step: 50 });
    pane.addBinding(Settings, 'emitInterval',   { min: 0.1, max: 10,  step: 1  });
    pane.addBinding(Settings, 'viewportZoom',   { min: 0.5, max: 3, step: 0.1 });

    const resetBtn = pane.addButton({
        title: 'Reset to Defaults',
        expandable: false,
    });

    resetBtn.on('click', () => {
        resetSettings();
        pane.refresh();
    });

})();