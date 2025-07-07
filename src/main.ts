import { Application, Text } from "pixi.js";
import { loadFireWorkConfigs } from "./core/xmlLoader";
// import { createCoordinatesRoot } from "./core/coordinateSystem";

const WIDTH = 1024;
const HEIGHT = 768;

(async () => {
    // Initialize PIXI Application
    const app = new Application();
    await app.init({
        width: WIDTH,
        height: HEIGHT,
        background: '#000',
        resolution: devicePixelRatio,
    });

    // Add canvas to DOM
    document.getElementById('pixi-container')?.appendChild(app.canvas);

    // Add welcome message
    const message = new Text({
        text: 'Fireworks Display\nLoading...',
        style: {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xffffff,
            align: 'center'
        }
    });

    // Center the message
    message.anchor.set(0.5);
    message.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(message);

    console.log('Fireworks application initialized');

    try {
        const cfgs = await loadFireWorkConfigs('/fireworks.xml');
        console.table(cfgs);
    } catch (error) {
        console.error('Failed to load fireworks:', error);
    }
})();