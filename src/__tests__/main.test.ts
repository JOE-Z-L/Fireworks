import { describe, it, expect, beforeEach } from 'vitest';

describe('Main Application', () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '<div id="pixi-container"></div>';
  });

  it('should have a pixi-container element', () => {
    const container = document.getElementById('pixi-container');
    expect(container).toBeTruthy();
    expect(container?.tagName).toBe('DIV');
  });

  it('should be able to import PIXI modules', async () => {
    const { Application } = await import('pixi.js');
    expect(Application).toBeDefined();
    expect(typeof Application).toBe('function');
  });

  it('should create a PIXI application', async () => {
    const { Application } = await import('pixi.js');
    const app = new Application();
    expect(app).toBeDefined();
    expect(app.stage).toBeDefined();
  });
});
