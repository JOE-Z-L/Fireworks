import { describe, it, expect, beforeEach } from 'vitest';
import { Particle } from '../particules/Particle';
import { Texture } from 'pixi.js';

describe('Particle', () => {
  let p: Particle;
  const tex = Texture.WHITE;   // 1×1 white pixel from Pixi

  beforeEach(() => {
    p = new Particle(tex, 0xff00ff, 1000, 100, 50); // life 1 s, vx=100, vy=50
  });

  it('advances position linearly with dt', () => {
    p.update(500);              // 0.5 s
    expect(p.x).toBeCloseTo(50);
    expect(p.y).toBeCloseTo(25);
  });

  it('reduces life and reports isDead()', () => {
    p.update(1000);
    expect(p.life).toBe(0);
    expect(p.isDead()).toBe(true);
  });

  it('alpha fades as life decreases', () => {
    p.update(250);
    expect(p.alpha).toBeCloseTo(0.75);
  });
});