import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadFireWorkConfigs } from '../core/xmlLoader';

describe('xmlLoader', () => {
  // Mock fetch and DOMParser
  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = vi.fn();
    
    // Mock DOMParser
    global.DOMParser = vi.fn().mockImplementation(() => ({
      parseFromString: vi.fn()
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load and parse firework configs correctly', async () => {
    // Mock successful fetch response
    const mockXml = `
      <?xml version="1.0" ?>
      <FireworkDisplay>
        <Firework begin="1000" type="Fountain" colour="0x20FF40" duration="5000">
          <Position x="0" y="-384"/>
        </Firework>
        <Firework begin="2000" type="Rocket" colour="0x4020FF" duration="4000">
          <Position x="100" y="-384"/>
          <Velocity x="10" y="20"/>
        </Firework>
      </FireworkDisplay>
    `;
    
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockXml)
    });

    // Mock DOMParser and querySelectorAll
    const mockFireworkElements = [
      {
        tagName: 'Firework',
        getAttribute: (name: string) => {
          const attrs: Record<string, string> = {
            begin: '1000',
            type: 'Fountain',
            colour: '0x20FF40',
            duration: '5000'
          };
          return attrs[name] || null;
        },
        querySelector: (selector: string) => {
          if (selector === ':scope > Position') {
            return {
              tagName: 'Position',
              getAttribute: (name: string) => name === 'x' ? '0' : name === 'y' ? '-384' : null
            };
          }
          return null;
        }
      },
      {
        tagName: 'Firework',
        getAttribute: (name: string) => {
          const attrs: Record<string, string> = {
            begin: '2000',
            type: 'Rocket',
            colour: '0x4020FF',
            duration: '4000'
          };
          return attrs[name] || null;
        },
        querySelector: (selector: string) => {
          if (selector === ':scope > Position') {
            return {
              tagName: 'Position',
              getAttribute: (name: string) => name === 'x' ? '100' : name === 'y' ? '-384' : null
            };
          }
          if (selector === ':scope > Velocity') {
            return {
              tagName: 'Velocity',
              getAttribute: (name: string) => name === 'x' ? '10' : name === 'y' ? '20' : null
            };
          }
          return null;
        }
      }
    ];

    const mockDom = {
      querySelector: (selector: string) => selector === 'parseererror' ? null : null,
      querySelectorAll: (selector: string) => mockFireworkElements
    };

    (global.DOMParser as any).mockImplementation(() => ({
      parseFromString: () => mockDom
    }));

    // Call the function
    const result = await loadFireWorkConfigs('/fireworks.xml');

    // Assertions
    expect(global.fetch).toHaveBeenCalledWith('/fireworks.xml');
    expect(result).toHaveLength(2);
    
    // Check first firework (Fountain)
    expect(result[0]).toEqual({
      begin: 1000,
      type: 'Fountain',
      colour: 0x20FF40,
      duration: 5000,
      position: { x: 0, y: -384 }
    });
    
    // Check second firework (Rocket)
    expect(result[1]).toEqual({
      begin: 2000,
      type: 'Rocket',
      colour: 0x4020FF,
      duration: 4000,
      position: { x: 100, y: -384 },
      velocity: { x: 10, y: 20 }
    });
  });

  it('should throw error when fetch fails', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404
    });

    await expect(loadFireWorkConfigs('/not-found.xml')).rejects.toThrow('HTTP 404 while loading /not-found.xml');
  });

  it('should throw error when XML is malformed', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('<invalid>xml</>')
    });

    const mockParseError = { textContent: 'XML parsing error' };
    const mockDom = {
      querySelector: (selector: string) => selector === 'parseererror' ? mockParseError : null
    };

    (global.DOMParser as any).mockImplementation(() => ({
      parseFromString: () => mockDom
    }));

    await expect(loadFireWorkConfigs('/invalid.xml')).rejects.toThrow('XML parsing error');
  });
});

// Adding the simpler test approach
describe('xmlLoader with Response mock', () => {
  const SAMPLE_XML = `
  <FireworkDisplay>
    <Firework begin="2000" type="Fountain" colour="0x4020FF" duration="4000">
      <Position x="100" y="-384"/>
    </Firework>

    <Firework begin="2000" type="Rocket" colour="0xFF2020" duration="1000">
      <Position x="0" y="-384"/>
      <Velocity x="0" y="600"/>
    </Firework>
  </FireworkDisplay>
  `;

  // Save original fetch
  const originalFetch = global.fetch;
  const originalDOMParser = global.DOMParser;

  beforeEach(() => {
    // Shim fetch with a local blob so no HTTP request is made
    global.fetch = async () =>
      new Response(SAMPLE_XML, { status: 200, headers: { 'Content-Type': 'application/xml' } });

    // Create a real DOM parser that works with the test environment
    global.DOMParser = class {
      parseFromString(str: string, contentType: string) {
        // Create a simple DOM structure that matches our XML
        const fountainElement = {
          tagName: 'Firework',
          getAttribute: (name: string) => {
            const attrs: Record<string, string> = {
              begin: '2000',
              type: 'Fountain',
              colour: '0x4020FF',
              duration: '4000'
            };
            return attrs[name] || null;
          },
          querySelector: (selector: string) => {
            if (selector === ':scope > Position') {
              return {
                tagName: 'Position',
                getAttribute: (name: string) => name === 'x' ? '100' : name === 'y' ? '-384' : null
              };
            }
            return null;
          }
        };

        const rocketElement = {
          tagName: 'Firework',
          getAttribute: (name: string) => {
            const attrs: Record<string, string> = {
              begin: '2000',
              type: 'Rocket',
              colour: '0xFF2020',
              duration: '1000'
            };
            return attrs[name] || null;
          },
          querySelector: (selector: string) => {
            if (selector === ':scope > Position') {
              return {
                tagName: 'Position',
                getAttribute: (name: string) => name === 'x' ? '0' : name === 'y' ? '-384' : null
              };
            }
            if (selector === ':scope > Velocity') {
              return {
                tagName: 'Velocity',
                getAttribute: (name: string) => name === 'x' ? '0' : name === 'y' ? '600' : null
              };
            }
            return null;
          }
        };

        return {
          querySelector: (selector: string) => selector === 'parseererror' ? null : null,
          querySelectorAll: (selector: string) => [fountainElement, rocketElement]
        };
      }
    };
  });

  afterEach(() => {
    // Restore original fetch and DOMParser
    global.fetch = originalFetch;
    global.DOMParser = originalDOMParser;
  });

  it('parses FireworkDisplay into FireworkConfig[]', async () => {
    const cfgs = await loadFireWorkConfigs('/fake-url.xml');
    expect(cfgs).toHaveLength(2);

    // Fountain
    expect(cfgs[0]).toMatchObject({
      begin: 2000,
      type: 'Fountain',
      colour: 0x4020ff,
      duration: 4000,
      position: { x: 100, y: -384 },
      velocity: undefined,
    });

    // Rocket
    expect(cfgs[1]).toMatchObject({
      type: 'Rocket',
      velocity: { x: 0, y: 600 },
    });
  });
});