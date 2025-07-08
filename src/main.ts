import { Application, Text, Assets, Texture } from "pixi.js";
import { loadFireWorkConfigs } from "./core/xmlLoader";
import { ENV } from "./config/env";
import {createCoordinatesRoot} from "./core/coordinatesSystem";
import { Scheduler } from "./core/scheduler";
import type { TextureSet } from "./fireworks";

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
    fetch('/assets/particle.png').then(r => r.ok).catch(() => false),
    fetch('/assets/rocket.png').then(r => r.ok).catch(() => false),
    fetch('/assets/fountain.png').then(r => r.ok).catch(() => false)
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
        const ZOOM =1;
        screen.scale.set(ZOOM,-ZOOM);
        app.stage.addChild(screen);

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
        app.ticker.add(({ deltaMS }) => scheduler.update(deltaMS));
    } catch (error) {
        console.error('Failed to load fireworks:', error);
    }
})();