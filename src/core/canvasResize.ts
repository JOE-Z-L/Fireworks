import type { Application, Container } from 'pixi.js';

/**
 * Sets up a resize listener that:
 *  • keeps a constant logical resolution (w×h),
 *  • scales the PIXI canvas with correct aspect ratio,
 *  • re-centres the viewport container,
 *  • returns a function to remove the listener (for tests / hot-reload).
 *
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

    // LETTERBOX — calculate the largest uniform scale that fits
    const scale = Math.min(W / logicalWidth, H / logicalHeight);

    // Resize the canvas DOM element
    const cssW = Math.round(logicalWidth * scale);
    const cssH = Math.round(logicalHeight * scale);

    const wrapper = document.getElementById('fw-container')!;
    wrapper.appendChild(app.canvas);

    // Style the wrapper instead of the canvas
    Object.assign(wrapper.style, {
      position: 'absolute',
      left: `${(W - cssW) / 2}px`,
      top:  `${(H - cssH) / 2}px`,
      width: `${cssW}px`,
      height: `${cssH}px`,
      background: '#000',      // bars colour
    });

    // Re-centre viewport origin (we keep same logical coords)
    viewport.position.set(logicalWidth / 2, logicalHeight / 2);
  }

  // Initial call + listener
  resize();
  window.addEventListener('resize', resize);

  return () => window.removeEventListener('resize', resize);
}