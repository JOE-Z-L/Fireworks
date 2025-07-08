import { Texture } from 'pixi.js';
import type { FireworkConfig } from '../core/xmlLoader';
import { FountainFirework } from './FountainFireWorks';
import { RocketFirework }   from './RocketFirework';

export interface TextureSet {
    particle: Texture;
    rocket  : Texture;
}

export function createFirework(cfg: FireworkConfig, tex: TextureSet) {
    switch (cfg.type) {
        case 'Fountain': return new FountainFirework(cfg, tex.particle);
        case 'Rocket'  : return new RocketFirework(cfg, tex.rocket, tex.particle);
        default        : throw new Error(`Unknown firework type ${cfg.type}`);
    }
}
