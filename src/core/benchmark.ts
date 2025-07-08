import { Ticker } from 'pixi.js';

export const Bench = {
    fps: 0,
    fpsAvg: 0,
    memMB: 'n/a',
    pooling: true,      // toggle later
};

export function initBench(ticker: Ticker) {
    let acc = 0, frames = 0;

    ticker.add(() => {
        Bench.fps = ticker.FPS;
        acc += Bench.fps; frames++;

        // once a second → rolling average & memory
        if (ticker.lastTime % 1000 < 16) {
            Bench.fpsAvg = +(acc / frames).toFixed(1);
            acc = frames = 0;

            const m = (performance as any).memory;
            if (m) Bench.memMB = (m.usedJSHeapSize / 1048576).toFixed(1);
        }
    });
}
