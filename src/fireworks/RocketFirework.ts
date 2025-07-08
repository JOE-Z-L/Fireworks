import { Sprite, Texture } from 'pixi.js';
import { Firework } from './FireWork';
import { Particle } from '../particules/Particule';
import type { FireworkConfig } from '../core/xmlLoader';
import { Settings } from '../config/runtimeSettings';

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
            // ─── Thrust phase ─────────────────────────────────────
            this.x += (this.cfg.velocity?.x ?? 0) * dtSec;
            this.y += (this.cfg.velocity?.y ?? 0) * dtSec;

            this.body.scale.set(Settings.rocketScale);

            // Trail particles
            this.trailTimer -= dt;
            if (this.trailTimer <= 0) {
                this.spawnTrailSpark();
                this.trailTimer += Settings.emitInterval;
            }

            // Time to explode?
            if (this.elapsed >= this.cfg.duration) {
                this.explode();
            }
        }

        // Update & cull debris
        this.children.forEach(child => {
            if ('update' in child && typeof child.update === 'function') {
                child.update(dt);
            }
        });

        // Find and remove dead particles
        const deadParticles = this.children.filter(child =>
            'isDead' in child && typeof child.isDead === 'function' && child.isDead()
        );

        // Remove each dead particle individually
        deadParticles.forEach(child => {
            this.removeChild(child);
        });
    }

    private spawnTrailSpark() {
        const p = new Particle(this.sparkTex, this.cfg.colour, 500, 0, -40);
        p.scale.set(Settings.trailScale);
        p.alpha = 0.5;
        p.blendMode = 'add';
        this.addChild(p);
    }

    private explode() {
        this.exploded = true;
        this.body.visible = false;

        // Use setting for particle count
        const particleCount = Settings.explosionParticles;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;

            // Add jitter to velocity for scattered effect
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
