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
        return this.children.every(c => (c as any).isDead?.());
    }
}
