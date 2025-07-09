import { Container } from 'pixi.js';
import  { FireworkConfig } from '../core/xmlLoader';
import { createFirework, TextureSet } from '../fireworks';

export class Scheduler {
    private elapsed = 0;                    // ms since show start
    private configs: FireworkConfig[];
    private root: Container;
    private launched = new Set<FireworkConfig>();
    private textures: TextureSet;

    constructor(configs: FireworkConfig[], root: Container, textures: TextureSet) {
        this.configs = configs;
        this.root = root;
        this.textures = textures;
    }

    update(dt: number): void {
        this.elapsed += dt;
        
        this.configs.forEach(config => {
            if (this.elapsed >= config.begin && !this.launched.has(config)) {
                const firework = createFirework(config, this.textures);
                this.root.addChild(firework);
                this.launched.add(config);
            }
        });
        
        this.root.children.forEach(child => {
            if ('update' in child && typeof child.update === 'function') {
                child.update(dt);
            }
        });
        
        const finished = this.root.children.filter(child =>
            'isFinished' in child && 
            typeof (child as any).isFinished === 'function' && 
            (child as any).isFinished()
        );
        
        finished.forEach(child => {
            this.root.removeChild(child);
        });
        
        if (this.root.children.length === 0 && this.launched.size === this.configs.length) {
            this.restart();
        }
    }

    private restart(): void {
        this.elapsed = 0;
        this.launched.clear();
    }
}
