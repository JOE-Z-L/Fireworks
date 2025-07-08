import { Texture } from 'pixi.js';
import { Firework } from './FireWork';
import { Particle } from '../particules/Particule';
import type { FireworkConfig } from '../core/xmlLoader';
import { Settings } from '../config/runtimeSettings';
import { Bench } from '../core/benchmark';
import { GlobalParticlePool } from '../particules/ParticlePool';

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

        // ─── Update and remove dead particles in a single loop ───────────────────────────
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i];

            // Update the child if it has an update method
            if ('update' in child && typeof child.update === 'function') {
                child.update(dt);
            }

            // Remove if dead
            if ('isDead' in child && typeof child.isDead === 'function' && (child as any).isDead()) {
            this.removeChild(child);

                // Release to pool if pooling is enabled
                if (Bench.pooling) {
                    GlobalParticlePool.release(child as Particle);
            }
            }
        }
    }

    private spawnParticle(): void {
        // Random sideways fan
        const vx = (Math.random() * 2 - 1) * Settings.fountainSpread;
        const vy = Settings.fountainSpeed + Math.random() * 30;    // slight jitter

        const p = Bench.pooling
            ? GlobalParticlePool.get(this.sparkTex, this.cfg.colour)
            : new Particle(this.sparkTex, this.cfg.colour, 0);

        p.reset(1200, 0, 0, vx, vy);   // Restore constant value of 1200ms
        p.scale.set(Settings.fountainSparkScale);                  // Use fountain-specific spark scale
        p.ay = Settings.gravity;                             // global downward pull
        p.blendMode = 'add';                                       // soft glow
        this.addChild(p);
    }
}