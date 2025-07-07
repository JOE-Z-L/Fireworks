import { describe, it, expect, beforeEach } from "vitest";
import { FountainFirework } from "../fireworks/FountainFireWorks";
import type { FireworkConfig } from "../core/xmlLoader";

describe("FountainFirework", () => {
  let fw: FountainFirework;
  const EMIT_INTERVAL = 30;

  beforeEach(() => {
    const cfg = {
      begin: 0,
      duration: 1000,
      colour: 0xffffff,
      position: { x: 100, y: 200 },
      type: 'Fountain',
    } satisfies FireworkConfig;

    fw = new FountainFirework(cfg);
  });

  it("emits one particle after first EMIT_INTERVAL", () => {
    fw.update(EMIT_INTERVAL);
    expect(fw.children.length).toBe(1);
  });

  it("emits multiple particles over time", () => {
    fw.update(EMIT_INTERVAL * 3); // Should emit 3 particles
    expect(fw.children.length).toBe(3);
  });

  it("stops emitting after duration", () => {
    // Run for half the duration
    fw.update(500);
    const halfwayCount = fw.children.length;
    expect(halfwayCount).toBeGreaterThan(0);
    
    // Run for the rest of the duration plus a bit more
    fw.update(600);
    // Count should be stable (no new particles)
    expect(fw.children.length).toBe(halfwayCount);
  });

  it("eventually reaches isFinished when all particles expire", () => {
    // Emit some particles
    fw.update(100);
    expect(fw.isFinished()).toBe(false);
    
    // Fast forward to expire all particles (particle life is 1200ms)
    fw.update(1300);
    expect(fw.isFinished()).toBe(true);
  });
});