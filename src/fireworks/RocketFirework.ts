import { Sprite, Texture } from 'pixi.js';
import { Firework } from './FireWork';
import { Particle } from '../particules/Particule';
import type { FireworkConfig } from '../core/xmlLoader';
import { Settings } from '../config/runtimeSettings';
import { Bench } from '../core/benchmark';
import { GlobalParticlePool } from '../particules/ParticlePool';

export class RocketFirework extends Firework {
    private exploded = false;
    private trailTimer = 0;
    private body: Sprite;

    constructor(
        cfg: FireworkConfig,
        bodyTex: Texture,
        private readonly sparkTex: Texture
    ) {
        super(cfg);

        this.body = new Sprite(bodyTex);
        this.body.anchor.set(0.5);
        this.body.scale.set(0.4);
        this.body.tint = cfg.colour;
        this.body.blendMode = 'add';
        this.addChild(this.body);
    }

    update(dt: number): void {
        this.elapsed += dt;

        const dtSec = dt / 1000;

        if (!this.exploded) {
            this.x += (this.cfg.velocity?.x ?? 0) * dtSec;
            this.y += (this.cfg.velocity?.y ?? 0) * dtSec;

            this.body.scale.set(Settings.rocketScale);

            this.trailTimer -= dt;
            if (this.trailTimer <= 0) {
                this.spawnTrailSpark();
                this.trailTimer += Settings.emitInterval;
            }

            if (this.elapsed >= this.cfg.duration) {
                this.explode();
            }
        }

        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i];
            
            if (child === this.body) continue;
            
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

    private makeSpark(life: number, vx: number, vy: number) {
        let p;
        if (Bench.pooling) {
            p = GlobalParticlePool.get(this.sparkTex, this.cfg.colour);
        } else {
            p = new Particle(this.sparkTex, this.cfg.colour, 0);
            p.pooled = false;
        }

        p.reset(life, 0, 0, vx, vy);
        p.scale.set(Settings.rocketSparkScale);
        p.ay = Settings.gravity;
        p.blendMode = 'add';
        this.addChild(p);
        return p;
    }

    private spawnTrailSpark() {
        const p = this.makeSpark(500, 0, -40);
        p.scale.set(Settings.trailScale);
        p.alpha = 0.5;
        p.blendMode = 'add';
        this.addChild(p);
    }

    private explode() {
        this.exploded = true;
        this.body.visible = false;

        const particleCount = Settings.explosionParticles;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;

            // this adds "jitter" to velocity for scattered "shotgun" effect", so the explosion is not a circle
            const jitter = 1 - (Math.random() * Settings.explosionJitter);
            const vx = Math.cos(angle) * Settings.explosionSpeed * jitter;
            const vy = Math.sin(angle) * Settings.explosionSpeed * jitter;

            const p = new Particle(this.sparkTex, this.cfg.colour, 1200, vx, vy);
            p.scale.set(Settings.rocketSparkScale);
            p.blendMode = 'add';
            p.ay = Settings.gravity;
            this.addChild(p);
        }
    }
}
