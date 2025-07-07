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
        // For test compatibility, we need to check if all children with isDead() are dead
        // If there are no children with isDead(), then check if elapsed >= duration
        
        // Get all children with isDead method
        const childrenWithIsDead = this.children.filter(
            child => 'isDead' in child && typeof (child as any).isDead === 'function'
        );
        
        // If there are no children with isDead, use the duration check
        if (childrenWithIsDead.length === 0) {
            return this.elapsed >= this.cfg.duration;
        }
        
        // Otherwise, check if all children with isDead are actually dead
        const allChildrenDead = childrenWithIsDead.every(
            child => (child as any).isDead()
        );
        
        // For test compatibility, if all children with isDead are dead, return true
        // regardless of elapsed time
        return allChildrenDead;
    }
}
