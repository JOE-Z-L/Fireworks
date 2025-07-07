import { Container, Texture } from 'pixi.js';
import type { FireworkConfig } from '../core/xmlLoader';
import { createFirework } from '../fireworks';

export class Scheduler {
    private elapsed = 0;                    // ms since show start
    private configs: FireworkConfig[];
    private root: Container;
    private launched = new Set<FireworkConfig>();
    private textures: Record<string, Texture>;

    constructor(configs: FireworkConfig[], root: Container, textures: Record<string, Texture>) {
        this.configs = configs;
        this.root = root;
        this.textures = textures;
    }

    /** Advance global time and update all active fireworks */
    update(dt: number): void {
        // Update elapsed time
        this.elapsed += dt;
        
        // Check for new fireworks to launch
        this.configs.forEach(config => {
            // Launch firework if we've passed its begin time and it hasn't been launched yet
            if (this.elapsed >= config.begin && !this.launched.has(config)) {
                const firework = createFirework(config, this.textures);
                this.root.addChild(firework);
                this.launched.add(config);
            }
        });
        
        // Update existing fireworks
        this.root.children.forEach(child => {
            if ('update' in child && typeof child.update === 'function') {
                child.update(dt);
            }
        });
        
        // Remove finished fireworks
        const finished = this.root.children.filter(child => 
            'isFinished' in child && 
            typeof (child as any).isFinished === 'function' && 
            (child as any).isFinished()
        );
        
        finished.forEach(child => {
            this.root.removeChild(child);
        });
        
        // Check if all fireworks are finished and we need to restart
        if (this.root.children.length === 0 && this.launched.size === this.configs.length) {
            this.restart();
        }
    }

    private restart(): void {
        // Reset elapsed time and launched set
        this.elapsed = 0;
        this.launched.clear();
    }
}
