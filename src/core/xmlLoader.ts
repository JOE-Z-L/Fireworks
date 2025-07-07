export interface FireworkConfig {
     begin: number;
     type: 'Fountain' | 'Rocket';
     colour: number;
     duration: number;
     position: { x: number; y: number };
     velocity?: { x: number; y: number };
}

/**
 * @param url   e.g. '/fireworks.xml'
 * @throws      Error if the file is unreachable or malformed
 */

export async function loadFireWorkConfigs(url:string): Promise<FireworkConfig[]> {

    const raw = await fetch(url).then( r=>{
        if(!r.ok) throw new Error(`HTTP ${r.status} while loading ${url}`);
        return r.text();
    });

    const dom = new DOMParser().parseFromString(raw, 'application/xml');
    const parseErr = dom.querySelector('parseererror');
    if(parseErr) {
        throw new Error(`XML parsing error: ${parseErr.textContent}`);
    }

    const configs:FireworkConfig[] = [];
    dom.querySelectorAll('FireworkDisplay > Firework').forEach(node=>{
        const cfg = readFirework(node);
        configs.push(cfg);
    });

    configs.sort((a, b) => a.begin - b.begin);
    return configs;

// Helpers
    function readFirework(node: Element): FireworkConfig {
        const begin     = mustIntAttr(node, 'begin');
        const typeStr   = mustAttr(node, 'type')      as 'Fountain' | 'Rocket';
        const colourStr = mustAttr(node, 'colour');
        const duration  = mustIntAttr(node, 'duration');

        const posNode = mustChild(node, 'Position');
        const position = {
            x: mustFloatAttr(posNode, 'x'),
            y: mustFloatAttr(posNode, 'y'),
        };

        let velocity: { x: number; y: number } | undefined;
        const velNode = node.querySelector(':scope > Velocity');
        if (velNode) {
            velocity = {
                x: mustFloatAttr(velNode, 'x'),
                y: mustFloatAttr(velNode, 'y'),
            };
        }

        if (typeStr !== 'Fountain' && typeStr !== 'Rocket') {
            throw new Error(`Unknown firework type '${typeStr}'`);
        }
        if (typeStr === 'Fountain' && velocity) {
            console.warn('Ignoring <Velocity> on a Fountain firework');
            velocity = undefined;
        }
        if (typeStr === 'Rocket' && !velocity) {
            throw new Error('Rocket firework is missing a <Velocity> element');
        }

        const colour = parseColour(colourStr);

        return { begin, type: typeStr, colour, duration, position, velocity };
    }


    function mustAttr(el: Element, name: string): string {
        const v = el.getAttribute(name);
        if (v === null) throw new Error(`<${el.tagName}> missing '${name}' attribute`);
        return v.trim();
    }
    function mustIntAttr(el: Element, name: string): number {
        const n = parseInt(mustAttr(el, name), 10);
        if (Number.isNaN(n)) throw new Error(`Attribute '${name}' is not an integer`);
        return n;
    }
    function mustFloatAttr(el: Element, name: string): number {
        const n = parseFloat(mustAttr(el, name));
        if (Number.isNaN(n)) throw new Error(`Attribute '${name}' is not a number`);
        return n;
    }
    function mustChild(el: Element, tag: string): Element {
        const child = el.querySelector(`:scope > ${tag}`);
        if (!child) throw new Error(`<${el.tagName}> is missing a <${tag}> child`);
        return child;
    }
    function parseColour(src: string): number {
        const cleaned = src.startsWith('0x') ? src.slice(2) :
            src.startsWith('#')  ? src.slice(1) : src;
        const n = parseInt(cleaned, 16);
        if (Number.isNaN(n) || n < 0 || n > 0xFFFFFF) {
            throw new Error(`Invalid colour value '${src}'`);
        }
        return n;
    }
}
