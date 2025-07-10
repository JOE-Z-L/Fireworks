import { Sprite, Texture } from 'pixi.js';

export class Particle extends Sprite {
    vx: number;
    vy: number;
    ax: number;
    ay: number;
    life: number;
    pooled = false;

    constructor(texture: Texture, colour: number, life: number, vx = 0, vy = 0, ax = 0, ay = 0) {
        super({ texture, tint: colour });
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.life = life;
        this.anchor.set(0.5);
    }

    update(dt: number): void {
        const dtSec = dt / 1000;

        this.vx += this.ax * dtSec;
        this.vy += this.ay * dtSec;

        this.x += this.vx * dtSec;
        this.y += this.vy * dtSec;
        this.life -= dt;

        this.alpha = Math.max(this.life / 1000, 0);
    }

    reset(life: number, x: number, y: number, vx: number, vy: number) {
        this.pooled = false;
        this.life = life;
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;
        this.alpha = 1;
        this.visible = true;
    }


    isDead(): boolean {
        return this.life <= 0;
    }

}
