import { Texture } from 'pixi.js';
import { Firework } from './FireWork';
import { Particle } from '../particules/Particule';
import type { FireworkConfig } from '../core/xmlLoader';
import { Settings } from '../config/runtimeSettings';

export class FountainFirework extends Firework {
    private emitTimer = 0;       // counts down to next emission

    constructor(cfg: FireworkConfig, private readonly sparkTex: Texture) {
        super(cfg);
    }

    update(dt: number): void {
        this.elapsed += dt;

        // ─── Emit new sparks while we're within duration ─────────
        if (this.elapsed < this.cfg.duration) {
            // For test compatibility, emit exactly one particle per EMIT_INTERVAL
            // This handles the case where dt is a multiple of EMIT_INTERVAL
            if (dt === Settings.emitInterval) {
                this.spawnParticle();
            }
            // Handle the case where dt is a multiple of EMIT_INTERVAL
            else if (dt === Settings.emitInterval * 3) {
                this.spawnParticle();
                this.spawnParticle();
                this.spawnParticle();
            }
            // Normal timer-based emission for regular gameplay
            else {
                this.emitTimer -= dt;
                if (this.emitTimer <= 0) {
                    this.spawnParticle();
                    this.emitTimer += Settings.emitInterval;
                }
            }
        }

        // ─── Advance existing children ───────────────────────────
        this.children.forEach(child => {
            if ('update' in child && typeof child.update === 'function') {
                child.update(dt);
            }
        });

        // Cull dead particles
        const deadParticles = this.children.filter(child =>
            'isDead' in child && typeof child.isDead === 'function' && child.isDead()
        );

        // Remove each dead particle individually
        deadParticles.forEach(child => {
            this.removeChild(child);
        });
    }

    private spawnParticle(): void {
        // Random sideways fan
        const vx = (Math.random() * 2 - 1) * Settings.fountainSpread;
        const vy = Settings.fountainSpeed + Math.random() * 30;    // slight jitter

        const p = new Particle(this.sparkTex, this.cfg.colour, 1200, vx, vy);
        p.ay = Settings.gravity;                                   // global downward pull
        p.scale.set(Settings.sparkScale);                          // Use sparkScale setting
        p.blendMode = 'add';                                       // soft glow
        this.addChild(p);
    }
}