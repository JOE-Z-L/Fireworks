import { Container } from 'pixi.js';
import { FireworkConfig } from '../core/xmlLoader';

export abstract class Firework extends Container {
    protected elapsed = 0;

    constructor(readonly cfg: FireworkConfig) {
        super();
        this.position.set(cfg.position.x, cfg.position.y);
    }

    abstract update(dt: number): void;

    isFinished(): boolean {
        const childrenWithIsDead = this.children.filter(
            child => 'isDead' in child && typeof (child as any).isDead === 'function'
        );
        if (childrenWithIsDead.length === 0) {
            return this.elapsed >= this.cfg.duration;
        }
        const allChildrenDead = childrenWithIsDead.every(
            child => (child as any).isDead()
        );
        return allChildrenDead;
    }
}
