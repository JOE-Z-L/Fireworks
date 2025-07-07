import { Application, Text , Assets } from "pixi.js";
import { loadFireWorkConfigs } from "./core/xmlLoader";
import { ENV } from "./config/env";
import {createCoordinatesRoot} from "./core/coordinatesSystem";
import { Scheduler } from "./core/scheduler";

const textures = await Assets.load({
    particle : '/assets/particle.png',
    rocket   : '/assets/rocket.png',
    fountain : '/assets/fountain.png',
});

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
        const world = createCoordinatesRoot(app.screen.width, app.screen.height);
        app.stage.addChild(world);

        const cfgs = await loadFireWorkConfigs(ENV.ASSETS.FIREWORKS_XML);
        console.table(cfgs);

        app.stage.removeChild(message);

        // Initialize scheduler and start animation
        const scheduler = new Scheduler(cfgs, world, textures);
        app.ticker.add(({ deltaMS }) => scheduler.update(deltaMS));
    } catch (error) {
        console.error('Failed to load fireworks:', error);
    }
})();