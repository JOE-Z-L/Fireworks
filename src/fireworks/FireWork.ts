import { Container } from 'pixi.js';
import { FireworkConfig } from '../core/xmlLoader';

export abstract class Firework extends Container {
    protected elapsed = 0;

    constructor(readonly cfg: FireworkConfig) {
        super();
        this.position.set(cfg.position.x, cfg.position.y);
    }

    /** Called each frame by Scheduler */
    abstract update(dt: number): void;

    /** True when no visible effect remains */
    isFinished(): boolean {
        // Skip the rocket body in the check (which doesn't have isDead)
        return this.elapsed >= this.cfg.duration &&
               this.children.every(c => {
                   // Skip elements without isDead method
                   if (!('isDead' in c) || typeof (c as any).isDead !== 'function') {
                       return true;
                   }
                   return (c as any).isDead();
               });
    }
}
