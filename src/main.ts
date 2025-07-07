
import { Application, Text } from "pixi.js";
import { loadFireWorksConfigs } from "@core/xmlLoader";
import { Scheduler } from "@core/scheduler";
import { FireworkDisplay } from "@fireworks/FireworkDisplay";

//TODO: add screen resolution
/*// main.ts (snippet)
const WIDTH  = 1024;
const HEIGHT = 768;

await app.init({
    width: WIDTH,
    height: HEIGHT,
    background: '#000',
    resolution: devicePixelRatio,   // crisp on Hi-DPI
});*/


(async () => {
    // Initialize PIXI Application
    const app = new Application();
    await app.init({background: '#000000', resizeTo: window});

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

    // TODO: Implement fireworks loading and display
})();