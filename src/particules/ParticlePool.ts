// src/particles/ParticlePool.ts
import { Particle } from './Particule';
import type { Texture } from 'pixi.js';

class Bucket {
    free: Particle[] = [];
    active = 0;
}

export class ParticlePool {
    /** key = `${tint}-${texture.uid}`  */
    private buckets: Map<string, Bucket> = new Map();

    private key(tex: Texture, tint: number) {
        return `${tint}-${tex.source.uid}`;
    }

    get(tex: Texture, tint: number) {
        const b = this.bucket(tex, tint);
        const p = b.free.pop() ?? new Particle(tex, tint, 0);
        b.active++;
        p.pooled = false;    // mark as checked-out
        return p;
    }

    release(p: Particle) {
        if (!p.pooled) {     // guard against double-release
            p.pooled = true;
        const b = this.bucket(p.texture, p.tint);
        b.active--;
        b.free.push(p);
    }
    }

    /** aggregated stats for monitor */
    get stats() {
        let active = 0, free = 0;
        for (const b of this.buckets.values()) {
            active += b.active;
            free   += b.free.length;
        }
        return { active, free };
    }

    private bucket(tex: Texture, tint: number) {
        const k = this.key(tex, tint);
        let b = this.buckets.get(k);
        if (!b) {
            b = new Bucket();
            this.buckets.set(k, b);
        }
        return b;
    }
}

export const GlobalParticlePool = new ParticlePool();
