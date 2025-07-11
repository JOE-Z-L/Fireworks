# Fireworks Display Application

A web-based fireworks simulation that renders dynamic firework displays based on XML configuration files.

## Running the Project

### Viewing the Project

To view the project:

1. Extract the provided zip file to a directory of your choice
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. The build output will be in the `dist` directory. You can serve these files with any web server:
   ```bash
   # Using Node.js serve
   npx serve dist    # If you're in the project root
   # OR
   npx serve         # If you're already in the dist directory
   
   # Or using Python
   python -m http.server -d dist 8080    # If you're in the project root
   # OR
   python -m http.server 8080            # If you're already in the dist directory
   ```
5. Open your browser and navigate to http://localhost:8080

### Creating a Distribution Package

To create a zip file for distribution:

1. Build the project:
   ```bash
   npm run build
   ```
2. Zip the contents of the `dist` directory:
   ```bash
   # On Linux/macOS
   cd dist && zip -r ../fireworks.zip .
   
   # On Windows (PowerShell)
   Compress-Archive -Path dist\* -DestinationPath fireworks.zip
   ```
3. The resulting `fireworks.zip` file can be deployed to any web server by extracting its contents to the server's root directory.

## Special Modes

### Debug Mode
The application supports a debug mode that can be enabled by adding `?mode=debug` to the URL:
```
http://localhost:8080/?mode=debug
```
When debug mode is enabled, you'll have access to:
- **TweakPane UI** for adjusting firework parameters in real-time
- **Performance statistics** (FPS, memory usage, particle counts)
- **Particle pooling toggle**
- **Particle count graph** showing active vs. pooled particles over time

The debug panel includes several sections:
- **XML Configuration**: Choose between different XML data files
- **Rocket Settings**: Adjust explosion size, particle count, scatter, speed, and rocket scale
- **Fountain Settings**: Modify spark size, emission speed, spread, and particle lifetime
- **Global Settings**: Change gravity, emission interval, and viewport zoom
- **Asset Settings**: Toggle between standard and alternative assets

The performance monitor displays:
- **FPS**: Current frames per second
- **AVG**: Average FPS over time
- **MEM**: Memory usage in megabytes
- **Active**: Currently active particles
- **Free**: Available particles in pool

Below the read-outs there is a checkbox **"Use Pool"**.  
Toggling it on/off lets you compare pooled vs. non-pooled particle allocation in real time.


### Alternative Mode (`?mode=alt`)
The application supports an alternative visual mode that can be enabled by adding `?mode=alt` to the URL:
```
http://localhost:8080/?mode=alt
```

When alt mode is enabled:
- Alternative textures are loaded from the `/assets_alt/` directory
- Different firework parameters are applied:
  - Larger particle sizes (rockets: 1.8x, fountains: 2.4x)
  - More explosion particles (120 vs. 80)
  - Higher fountain speed (350 vs. 300)
  - Wider fountain spread (150 vs. 100)
  - Lower gravity (-150 vs. -200)
  - Different zoom level (0.8 vs. 0.9)

While the preference is stored in `localStorage` when activated, entering the application without any URL parameters will reset to the default mode and settings.

## XML Data Format

The application reads an XML file that defines the firework display. The XML structure follows the format specified in the instructions:

```xml
<?xml version="1.0" ?>
<FireworkDisplay>
  <Firework begin="1000" type="Fountain" colour="0x20FF40" duration="5000">
    <Position x="0" y="-384"/>
  </Firework>
  <Firework begin="2000" type="Rocket" colour="0xFF2020" duration="1000">
    <Position x="500" y="-384"/>
    <Velocity x="-180" y="600"/>
  </Firework>
</FireworkDisplay>
```

The application supports multiple XML configurations that can be selected in debug mode.