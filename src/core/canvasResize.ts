import type { Application, Container } from 'pixi.js';

/**
 * @param app     The PIXI Application
 * @param viewport   The root container in createCoordinatesRoot()
 * @param logicalWidth  e.g. 1024
 * @param logicalHeight e.g. 768
 */
export function enableResponsiveCanvas(
  app: Application,
  viewport: Container,
  logicalWidth: number,
  logicalHeight: number,
) {
  function resize() {
    const { innerWidth: W, innerHeight: H } = window;
    const scale = Math.min(W / logicalWidth, H / logicalHeight);
    const cssW = Math.round(logicalWidth * scale);
    const cssH = Math.round(logicalHeight * scale);
    const wrapper = document.getElementById('fw-container')!;
    wrapper.appendChild(app.canvas);

    Object.assign(wrapper.style, {
      position: 'absolute',
      left: `${(W - cssW) / 2}px`,
      top:  `${(H - cssH) / 2}px`,
      width: `${cssW}px`,
      height: `${cssH}px`,
      background: '#000',
    });

    viewport.position.set(logicalWidth / 2, logicalHeight / 2);
  }

  resize();
  window.addEventListener('resize', resize);

  return () => window.removeEventListener('resize', resize);
}