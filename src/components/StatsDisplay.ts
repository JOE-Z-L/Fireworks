import { Ticker } from 'pixi.js';
import { Bench } from '../core/benchmark';
import { GlobalParticlePool } from '../particules/ParticlePool';
import { createParticleGraph } from './ParticleGraph';

/**
 * Creates a statistics display panel
 * @param paneWidth Width of the tweakpane UI (for positioning)
 * @param ticker PIXI ticker for updates
 * @returns The created stats display element
 */
export function createStatsDisplay(paneWidth: number, ticker: Ticker): HTMLDivElement {
    const statsDisplay = document.createElement('div');
    statsDisplay.id = 'stats-display';
    statsDisplay.style.cssText = `
        position: absolute;
        top: 10px;
        right: ${paneWidth + 20}px;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-family: monospace;
        padding: 10px;
        border-radius: 4px;
        font-size: 12px;
        min-width: 120px;
        z-index: 1000;
    `;
    const graphCanvas = createParticleGraph(ticker);

    const poolingToggle = document.createElement('div');
    poolingToggle.innerHTML = `<label><input type="checkbox" ${Bench.pooling ? 'checked' : ''}/> Use Pool</label>`;
    poolingToggle.style.marginTop = '8px';
    poolingToggle.querySelector('input')?.addEventListener('change', (e) => {
        Bench.pooling = (e.target as HTMLInputElement).checked;
        GlobalParticlePool.reset();
    });

    const statsText = document.createElement('div');

    statsDisplay.appendChild(statsText);
    statsDisplay.appendChild(poolingToggle);
    statsDisplay.appendChild(graphCanvas);

    let updateCounter = 0;
    ticker.add(() => {
        updateCounter++;
        if (updateCounter % 10 === 0) {
            statsText.innerHTML = `
                FPS: ${Bench.fps.toFixed(1)}<br>
                AVG: ${Bench.fpsAvg}<br>
                MEM: ${Bench.memMB} MB<br>
                Active: ${GlobalParticlePool.stats.active}<br>
                Free: ${GlobalParticlePool.stats.free}
            `;
        }
    });
    
    setTimeout(() => {
        statsDisplay.style.right = `${paneWidth + 20}px`;
    }, 100);
    
    return statsDisplay;
}