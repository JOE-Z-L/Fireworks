import { describe, it, expect, beforeEach } from "vitest";
import { RocketFirework } from "../fireworks/RocketFirework";
import type { FireworkConfig } from "../core/xmlLoader";

describe("RocketFirework", () => {
  let fw: RocketFirework;
  const EXPLOSION_PARTS = 60; // Same as in RocketFirework.ts

  beforeEach(() => {
    const cfg = {
      begin: 0,
      duration: 1000,
      colour: 0xffffff,
      position: { x: 100, y: 200 },
      type: 'Rocket',
      velocity: { x: 0, y: 600 }
    } satisfies FireworkConfig;

    fw = new RocketFirework(cfg);
  });

  it("emits trail particles during flight", () => {
    fw.update(100); // Update for 100ms
    // Should have at least one trail particle plus the rocket body
    expect(fw.children.length).toBeGreaterThan(1);
  });

  it("explodes after duration", () => {
    // Update for exactly the duration
    fw.update(1000);
    
    // Should have EXPLOSION_PARTS particles plus the (invisible) rocket body
    expect(fw.children.length).toBe(EXPLOSION_PARTS + 1);
    
    // Check if the rocket has exploded (using a private property test)
    // We can use any to access the private property for testing
    expect((fw as any).exploded).toBe(true);
  });

  it("eventually reaches isFinished when all particles expire", () => {
    // Trigger explosion
    fw.update(1000);
    expect(fw.isFinished()).toBe(false);
    
    // Fast forward to expire all particles (explosion particles live for 1200ms)
    fw.update(1300);
    expect(fw.isFinished()).toBe(true);
  });

  it("moves according to velocity during flight", () => {
    const initialX = fw.x;
    const initialY = fw.y;
    
    // Update for 500ms (half the duration)
    fw.update(500);
    
    // Y position should have changed according to velocity
    // 600 pixels/second * 0.5 seconds = 300 pixels
    expect(fw.y).toBeCloseTo(initialY + 300);
    
    // X position should remain the same (velocity.x = 0)
    expect(fw.x).toBe(initialX);
  });
});