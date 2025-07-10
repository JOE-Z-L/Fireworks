interface ImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;

  readonly VITE_APP_DISPLAY_WIDTH: string;
  readonly VITE_APP_DISPLAY_HEIGHT: string;
  readonly VITE_APP_BACKGROUND_COLOR: string;
  readonly VITE_APP_FIREWORKS_XML_PATH: string;
  readonly VITE_APP_DEBUG: string;
  readonly VITE_APP_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}