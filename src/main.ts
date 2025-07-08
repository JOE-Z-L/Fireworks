import { Application, Text,  Texture } from "pixi.js";
import { loadFireWorkConfigs } from "./core/xmlLoader";
import { ENV } from "./config/env";
import {createCoordinatesRoot} from "./core/coordinatesSystem";
import { Scheduler } from "./core/scheduler";
import type { TextureSet } from "./fireworks";
import {Pane} from "tweakpane";
import { Settings, resetSettings } from "./config/runtimeSettings";
import { enableResponsiveCanvas } from "./core/canvasResize";
import { Bench, initBench } from "./core/benchmark";
import { GlobalParticlePool } from "./particules/ParticlePool";

// Load textures directly using Image objects and Texture.from
let textures = {
    particle: Texture.WHITE,
    rocket: Texture.WHITE,
    fountain: Texture.WHITE
  };

try {
  // Function to load an image and create a texture
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

  // Load all textures
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
    // Keep using the default WHITE textures
  });
  
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

    initBench(app.ticker);

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


    // Create separate panels for different firework types
    const pane = new Pane({ title: 'Fireworks', expanded: false });

    // Rocket controls panel
    const rocketFolder = pane.addFolder({ title: 'Rocket Settings' });
    rocketFolder.addBinding(Settings, 'rocketSparkScale', { min: 0.5, max: 3.0, step: 0.1, label: 'Spark Scale' });
    rocketFolder.addBinding(Settings, 'explosionParticles', { min: 30, max: 150, step: 5 });
    rocketFolder.addBinding(Settings, 'explosionJitter', { min: 0, max: 2, step: 0.05 });
    rocketFolder.addBinding(Settings, 'explosionSpeed', { min: 150, max: 1000, step: 10 });
    rocketFolder.addBinding(Settings, 'rocketScale',    { min: 1, max: 2, step: 0.05, label: 'Rocket Scale' });

    // Fountain controls panel
    const fountainFolder = pane.addFolder({ title: 'Fountain Settings' });
    fountainFolder.addBinding(Settings, 'fountainSparkScale', { min: 0.5, max: 3.0, step: 0.1, label: 'Spark Scale' });
    fountainFolder.addBinding(Settings, 'fountainSpeed',  { min: 100, max: 500, step: 10 });
    fountainFolder.addBinding(Settings, 'fountainSpread', { min: 20,  max: 200, step: 5  });
    fountainFolder.addBinding(Settings, 'fountainLife', { min: 300, max: 2000, step: 50, label: 'Particle Life' });

    // Global settings panel
    const globalFolder = pane.addFolder({ title: 'Global Settings' });
    globalFolder.addBinding(Settings, 'gravity',        { min: -500, max: -100, step: 50 });
    globalFolder.addBinding(Settings, 'emitInterval',   { min: 0.01, max: 10,  step: 0.01  });
    globalFolder.addBinding(Settings, 'viewportZoom',   { min: 0.5, max: 3, step: 0.1 });

    // Create a custom stats display positioned to the left of the pane
    const statsDisplay = document.createElement('div');
    statsDisplay.id = 'stats-display';
    statsDisplay.style.cssText = `
        position: absolute;
        top: 10px;
        right: ${pane.element.offsetWidth + 20}px;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-family: monospace;
        padding: 10px;
        border-radius: 4px;
        font-size: 12px;
        min-width: 120px;
        z-index: 1000;
    `;
    document.body.appendChild(statsDisplay);

    const poolingToggle = document.createElement('div');
    poolingToggle.innerHTML = `<label><input type="checkbox" ${Bench.pooling ? 'checked' : ''}/> Use Pool</label>`;
    poolingToggle.style.marginTop = '8px';
    poolingToggle.querySelector('input')?.addEventListener('change', (e) => {
        Bench.pooling = (e.target as HTMLInputElement).checked;

        // Completely reset the pool when toggling pooling
        GlobalParticlePool.reset();
    });
    statsDisplay.appendChild(poolingToggle);

    // Position the stats display after the pane is fully initialized
    setTimeout(() => {
        statsDisplay.style.right = `${pane.element.offsetWidth + 20}px`;
    }, 100);

    // Update stats display less frequently
    let updateCounter = 0;
    app.ticker.add(() => {
        updateCounter++;

        // Only update every 10 frames (about 6 times per second at 60fps)
        if (updateCounter % 50 === 0) {
        statsDisplay.innerHTML = `
            FPS: ${Bench.fps.toFixed(1)}<br>
            AVG: ${Bench.fpsAvg}<br>
            MEM: ${Bench.memMB} MB<br>
            Active: ${GlobalParticlePool.stats.active}<br>
            Free: ${GlobalParticlePool.stats.free}
        `;
        statsDisplay.appendChild(poolingToggle);
        }
    });

    const resetBtn = pane.addButton({
        title: 'Reset to Defaults',
        expandable: false,
    });

    resetBtn.on('click', () => {
        resetSettings();
        pane.refresh();
    });

})();