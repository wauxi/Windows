export const TIMING = {
  TV_PRELOAD_MEASUREMENT_DELAY: 120,      // ms - delay before measuring TV iframe size
  TV_UNHIDE_FALLBACK_TIMEOUT: 2000,       // ms - fallback timeout to unhide window
  TV_PRELOAD_BACKGROUND_DELAY: 500,       // ms - delay before preloading next TV iframe
  ICON_FADE_DURATION: 0.8,                 // seconds
  ICON_FADE_MAX_DELAY: 800,                // ms - max random delay for icon fade
  WINDOW_DRAG_SMOOTH: 0.3,                 // seconds
  MINESWEEPER_MEASUREMENT_DELAY: 100       // ms - delay before measuring Minesweeper iframe size
};

export const TV_CONFIG = {
  DEFAULT_WIDTH: 980,                      // px - default TV width
  DEFAULT_HEIGHT: 640,                     // px - default TV height
  PADDING_BUFFER: 8,                       // px - buffer around TV container
  MAX_WIDTH_RATIO: 0.96,                   // % of viewport width
  MAX_HEIGHT_RATIO: 0.86                   // % of viewport height
};

export const MINESWEEPER_CONFIG = {
  DEFAULT_WIDTH: 600,                      // px - fallback width for Minesweeper
  DEFAULT_HEIGHT: 520,                     // px - fallback height for Minesweeper
  PADDING_BUFFER: 32,                      // px - buffer around Minesweeper container
  MAX_WIDTH_RATIO: 0.85,                   // % of viewport width
  MAX_HEIGHT_RATIO: 0.90                   // % of viewport height
};

export const SCROLLING = {
  PHOTOBOOTH_SCROLLING: 'no',
  OTHER_APPS_SCROLLING: 'yes'
};

export const DOM_SELECTORS = {
  DESKTOP: '#desktop',
  APP_WINDOW: '#app-window',
  WINDOW_TITLE: '#window-title',
  WINDOW_CONTENT: '#window-content',
  CLOSE_BUTTON: '#close-window',
  WINDOW_HEADER: '.window-header',
  ICON: '.icon',
  TV_CONTAINER: '.crt-container',
  MINESWEEPER_CONTAINER: '#game_window'
};

export const CSS_CLASSES = {
  TV_MODAL: 'tv-modal',
  GAME_MODAL: 'game-modal'
};

export const APP_NAMES = {
  MEMORIES_PLAYER: 'memories_player',
  PHOTOBOOTH: 'photobooth',
  CARDS: 'cards',
  MINESWEEPER: 'minesweeper',
  WINAMP: 'winamp'
};
