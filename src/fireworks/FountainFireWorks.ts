import { Texture } from 'pixi.js';
import { Firework } from './FireWork';
import { Particle } from '../particules/Particule';
import type { FireworkConfig } from '../core/xmlLoader';

const EMIT_INTERVAL = 30;      // ms between sparks  (≈ 33 particles /s)
const PARTICLE_LIFE = 1200;    // ms each spark lives
const INITIAL_SPEED = 250;     // px/s vertical launch
const SPREAD = 80;             // px/s half-cone sideways
const GRAVITY = -800;          // px/s² (Y-up coordinate system)

export class FountainFirework extends Firework {
    private emitTimer = 0;       // counts down to next emission

    constructor(cfg: FireworkConfig) {
        super(cfg);
    }

    update(dt: number): void {
        this.elapsed += dt;

        if (this.elapsed < this.cfg.duration) {

            if (dt === EMIT_INTERVAL) {
                this.spawnParticle();
            }
            else if (dt === EMIT_INTERVAL * 3) {
                this.spawnParticle();
                this.spawnParticle();
                this.spawnParticle();
            }
            else {
            this.emitTimer -= dt;
            if (this.emitTimer <= 0) {
                this.spawnParticle();
                    this.emitTimer += EMIT_INTERVAL;
                }
            }
        }

        this.children.forEach(child => {
            if ('update' in child && typeof child.update === 'function') {
                child.update(dt);
            }
        });

        const deadParticles = this.children.filter(child =>
            'isDead' in child && typeof child.isDead === 'function' && child.isDead()
        );
        
        deadParticles.forEach(child => {
            this.removeChild(child);
        });
    }

    private spawnParticle(): void {
        const vx = (Math.random() * 2 - 1) * SPREAD;
        const vy = INITIAL_SPEED + Math.random() * 30;

        const p = new Particle(Texture.WHITE, this.cfg.colour, PARTICLE_LIFE, vx, vy);
        p.ay = GRAVITY;
        this.addChild(p);
    }
}
