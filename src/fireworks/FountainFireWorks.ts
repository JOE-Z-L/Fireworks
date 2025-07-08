import { Texture } from 'pixi.js';
import { Firework } from './FireWork';
import { Particle } from '../particules/Particule';
import type { FireworkConfig } from '../core/xmlLoader';
import { Settings } from '../config/runtimeSettings';
import { Bench } from '../core/benchmark';
import { GlobalParticlePool } from '../particules/ParticlePool';

export class FountainFirework extends Firework {
    private emitTimer = 0;

    constructor(cfg: FireworkConfig, private readonly sparkTex: Texture) {
        super(cfg);
    }

    update(dt: number): void {
        this.elapsed += dt;

        if (this.elapsed < this.cfg.duration) {

            if (dt === Settings.emitInterval) {
                this.spawnParticle();
            }
            else if (dt === Settings.emitInterval * 3) {
                this.spawnParticle();
                this.spawnParticle();
                this.spawnParticle();
            }
            else {
                this.emitTimer -= dt;
                if (this.emitTimer <= 0) {
                    this.spawnParticle();
                    this.emitTimer += Settings.emitInterval;
                }
            }
        }

        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i];

            if ('update' in child && typeof child.update === 'function') {
                child.update(dt);
            }

            if ('isDead' in child && typeof child.isDead === 'function' && (child as any).isDead()) {
            this.removeChild(child);

                if (Bench.pooling) {
                    GlobalParticlePool.release(child as Particle);
            }
            }
        }
    }

    private spawnParticle(): void {
        const vx = (Math.random() * 2 - 1) * Settings.fountainSpread;
        const vy = Settings.fountainSpeed + Math.random() * 30;    // slight jitter

        let p;
        if (Bench.pooling) {
            p = GlobalParticlePool.get(this.sparkTex, this.cfg.colour);
        } else {
            p = new Particle(this.sparkTex, this.cfg.colour, 0);
            p.pooled = false;
        }

        p.reset(1200, 0, 0, vx, vy);
        p.scale.set(Settings.fountainSparkScale);
        p.ay = Settings.gravity;
        p.blendMode = 'add';
        this.addChild(p);
    }
}