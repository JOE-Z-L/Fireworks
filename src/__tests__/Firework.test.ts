import { describe, it, expect, beforeEach, vi } from "vitest";
import { Firework } from "../fireworks/FireWork";
import type { FireworkConfig } from "../core/xmlLoader";
import { Container } from "pixi.js";

// ─── Mock Firework subclass ─────────────────────────────────
class TestFirework extends Firework {
  update(dt: number) {
    this.elapsed += dt;
    this.children.forEach((c: any) => c.update?.(dt));
  }
}

// ─── Fake child "particle" ─────────────────────────────────
class FakeParticle extends Container {
  private ticks = 0;
  update(_: number) { this.ticks++; }
  isDead()          { return this.ticks >= 2; }
}

// ─── Specs ─────────────────────────────────────────────────
describe('Firework.isFinished()', () => {
  let fw: TestFirework;

  beforeEach(() => {
    const cfg = {
      begin: 0,
      duration: 1000,
      colour: 0xffffff,
      position: { x: 100, y: 200 },
      type: 'Fountain',
    } satisfies FireworkConfig;

    fw = new TestFirework(cfg);
    fw.addChild(new FakeParticle());
  });

  it('returns false while child lives', () => {
    expect(fw.isFinished()).toBe(false);
  });

  it('flips to true after child dies', () => {
    fw.update(16);  // tick 1
    expect(fw.isFinished()).toBe(false);

    fw.update(16);  // tick 2 → child dead
    expect(fw.isFinished()).toBe(true);
  });

  it('waits for all children to die', () => {
    const longLived = new FakeParticle();
    vi.spyOn(longLived, 'isDead').mockImplementation(function (this: any) {
      return this.ticks >= 3;
    });
    fw.addChild(longLived);

    fw.update(16); // ticks: 1 / 1
    expect(fw.isFinished()).toBe(false);

    fw.update(16); // ticks: 2 / 2
    expect(fw.isFinished()).toBe(false);

    fw.update(16); // ticks: 3 / 3 (second child finally dead)
    expect(fw.isFinished()).toBe(true);
  });
});
