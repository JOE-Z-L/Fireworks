import { Ticker } from 'pixi.js';
import { GlobalParticlePool } from '../particules/ParticlePool';

export function createParticleGraph(ticker: Ticker): HTMLCanvasElement {
    const graphCanvas = document.createElement('canvas');
    graphCanvas.width = 300;
    graphCanvas.height = 150;
    graphCanvas.style.marginTop = '8px';
    graphCanvas.style.border = '1px solid #333';
    
    const historyLength = 120;
    const activeHistory = new Array(historyLength).fill(0);
    const freeHistory = new Array(historyLength).fill(0);
    
    let updateCounter = 0;
    ticker.add(() => {
        updateCounter++;
        if (updateCounter % 10 === 0) {
            // Update history data
            activeHistory.push(GlobalParticlePool.stats.active);
            activeHistory.shift();
            freeHistory.push(GlobalParticlePool.stats.free);
            freeHistory.shift();

            const ctx = graphCanvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

                const maxValue = Math.max(
                    ...activeHistory,
                    ...freeHistory
                ) || 1;

                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    const y = i * (graphCanvas.height / 3);
                    ctx.moveTo(0, y);
                    ctx.lineTo(graphCanvas.width, y);
                }
                ctx.stroke();

                ctx.strokeStyle = '#4CAF50';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                freeHistory.forEach((value, index) => {
                    const x = index / historyLength * graphCanvas.width;
                    const y = graphCanvas.height - (value / maxValue * (graphCanvas.height - 10));
                    if (index === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();
                
                ctx.strokeStyle = '#F44336';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                activeHistory.forEach((value, index) => {
                    const x = index / historyLength * graphCanvas.width;
                    const y = graphCanvas.height - (value / maxValue * (graphCanvas.height - 10));
                    if (index === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();

                ctx.font = '12px Arial';

                ctx.fillStyle = '#4CAF50';
                ctx.fillText('Free', 30, 10);

                ctx.fillStyle = '#F44336';
                ctx.fillText('Active', 75, 10);

                ctx.fillStyle = '#FFFFFF';
                ctx.textAlign = 'right';
                ctx.fillText(`Max: ${maxValue}`, graphCanvas.width - 5, 10);
            }
        }
    });
    
    return graphCanvas;
}