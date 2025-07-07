// src/fireworks/index.ts
import type { FireworkConfig } from '../core/xmlLoader';
import { FountainFirework } from './FountainFireWorks.ts';
import { RocketFirework } from './RocketFirework.ts';

export function createFirework(cfg: FireworkConfig) {
    switch (cfg.type) {
        case 'Fountain': return new FountainFirework(cfg);
        case 'Rocket':   return new RocketFirework(cfg);
        default: throw new Error(`Unknown firework type ${cfg.type}`);
    }
}
