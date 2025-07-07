// Environment configuration
export const ENV = {
  // Display settings
  DISPLAY: {
    WIDTH: parseInt(import.meta.env.VITE_APP_DISPLAY_WIDTH || '1024', 10),
    HEIGHT: parseInt(import.meta.env.VITE_APP_DISPLAY_HEIGHT || '768', 10),
    BACKGROUND_COLOR: import.meta.env.VITE_APP_BACKGROUND_COLOR || '#000',
  },
  
  // Asset paths
  ASSETS: {
    FIREWORKS_XML: import.meta.env.VITE_APP_FIREWORKS_XML_PATH || '/fireworks.xml',
  },
  
  // Debug settings
  DEBUG: {
    ENABLED: import.meta.env.VITE_APP_DEBUG === 'true' || import.meta.env.DEV || false,
    LOG_LEVEL: import.meta.env.VITE_APP_LOG_LEVEL || (import.meta.env.DEV ? 'debug' : 'error'),
  }
};