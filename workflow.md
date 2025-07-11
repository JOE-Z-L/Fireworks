# Fireworks Application Workflow

## Application Flow

The application follows these key steps:

1. **Initialization**: Setup PIXI.js application and load resources
2. **XML Loading**: Parse fireworks configuration from XML file
3. **Scheduler Creation**: Initialize scheduler with firework configurations
4. **Animation Loop**: Update and render fireworks based on elapsed time
5. **Debug Mode**: Optional debug controls and statistics (when enabled)

## Workflow Diagram

```mermaid
flowchart TD
    A[Initialize App] --> B[Load XML Config]
    B --> C[Parse Firework Configs]
    C --> D[Create Scheduler]
    D --> E[Animation Loop]
    
    E -->|Each Frame| F[Update Scheduler]
    F --> G[Update Active Fireworks]
    G --> H[Render Frame]
    H --> E
    
    B -.->|Error| Z[Display Error]
    
    subgraph "Debug Mode"
        I[TweakPane Controls] -.->|Adjust Parameters| E
        E -.->|Update Stats| J[Performance Stats]
    end
    
    subgraph "Firework Creation"
        D --> K{Firework Type?}
        K -->|Fountain| L[Create Fountain]
        K -->|Rocket| M[Create Rocket]
        L --> N[Add to Display]
        M --> N
    end
```

## Additional Configuration

For detailed information about:
- Debug Mode features (`?mode=debug`)
- Alternative Mode settings (`?mode=alt`)
- XML configuration options
- Runtime settings and parameters

Please refer to the README.md file, which contains comprehensive documentation on these topics.

