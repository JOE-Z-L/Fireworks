import { Sprite, Texture } from 'pixi.js';
import { Firework } from './FireWork';
import { Particle } from '../particules/Particule';
import type { FireworkConfig } from '../core/xmlLoader';

const TRAIL_EMIT = 50;         // ms between trail sparks
const EXPLOSION_PARTS = 60;    // number of explosion sparks
const EXPLOSION_SPEED = 300;   // px/s initial debris velocity
const GRAVITY = -800;          // shared with fountain

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
        this.addChild(this.body);
    }

    update(dt: number): void {
        this.elapsed += dt;

        const dtSec = dt / 1000;

        if (!this.exploded) {
            // ─── Thrust phase ─────────────────────────────────────
            this.x += (this.cfg.velocity?.x ?? 0) * dtSec;
            this.y += (this.cfg.velocity?.y ?? 0) * dtSec;

            // Trail particles
            this.trailTimer -= dt;
            if (this.trailTimer <= 0) {
                this.spawnTrailSpark();
                this.trailTimer += TRAIL_EMIT;
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
        p.scale.set(1.2);
        p.alpha = 0.5;
        p.blendMode = 'add';
        this.addChild(p);
    }

    private explode() {
        this.exploded = true;
        this.body.visible = false;

        //  lets call it "debris"
        for (let i = 0; i < EXPLOSION_PARTS; i++) {
            const angle = (i / EXPLOSION_PARTS) * Math.PI * 2;
            const vx = Math.cos(angle) * EXPLOSION_SPEED;
            const vy = Math.sin(angle) * EXPLOSION_SPEED;

            const p = new Particle(this.sparkTex, this.cfg.colour, 1200, vx, vy);
            p.scale.set(1.6);
            p.blendMode = 'add';
            p.ay = GRAVITY;
            this.addChild(p);
        }
    }
}
