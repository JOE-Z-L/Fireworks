import { Sprite, Texture } from 'pixi.js';

export class Particle extends Sprite {
    vx: number;
    vy: number;
    ax: number;
    ay: number;
    life: number;              // ms remaining

    constructor(texture: Texture, colour: number, life: number, vx = 0, vy = 0, ax = 0, ay = 0) {
        super({ texture, tint: colour });
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.life = life;
        this.anchor.set(0.5);     // rotate/scale around centre
    }

    /** Advance physics by dt milliseconds */
    update(dt: number): void {
        // Convert dt from ms to seconds for velocity maths
        const dtSec = dt / 1000;

        // integrate acceleration → velocity
        this.vx += this.ax * dtSec;
        this.vy += this.ay * dtSec;

        // integrate velocity → position
        this.x += this.vx * dtSec;
        this.y += this.vy * dtSec;
        this.life -= dt;

        // Simple alpha fade (optional polish)
        this.alpha = Math.max(this.life / 1000, 0);  // fades over last second
    }

    isDead(): boolean {
        return this.life <= 0;
    }
}
