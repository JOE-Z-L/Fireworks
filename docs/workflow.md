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

## Key Components

- **XML Loader**: Parses fireworks.xml to extract configuration data
- **Scheduler**: Manages timing of firework creation and lifecycle
- **Firework Types**:
  - **Fountain**: Emits particles from a fixed position
  - **Rocket**: Travels along a path before exploding
- **Particle System**: Manages particle creation, updates, and pooling
- **Debug Tools**: Performance monitoring and parameter adjustment

