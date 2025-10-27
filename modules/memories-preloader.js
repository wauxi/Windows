import { TIMING, TV_CONFIG, DOM_SELECTORS, APP_NAMES } from './constants.js';
import { getIframeDocument, disableScrollOnDocument } from './dom-utils.js';
import { setTVComputedSizes } from './element-meta.js';

class MemoriesPlayerPreloader {
  constructor() {
    this.memoriesPlayerIframe = null;
    this.isReady = false;
  }

  preload() {
    this.memoriesPlayerIframe = document.createElement('iframe');
    this.memoriesPlayerIframe.src = `apps/${APP_NAMES.MEMORIES_PLAYER}/index.html`;
    this.memoriesPlayerIframe.setAttribute('frameborder', '0');
    this.memoriesPlayerIframe.setAttribute('scrolling', 'no'); 
    this.memoriesPlayerIframe.style.border = 'none';
    this.memoriesPlayerIframe.style.display = 'block';
    this.memoriesPlayerIframe.style.position = 'absolute';
    this.memoriesPlayerIframe.style.visibility = 'hidden';
    this.memoriesPlayerIframe.style.pointerEvents = 'none';
    this.memoriesPlayerIframe.style.overflow = 'hidden'; 
    this.memoriesPlayerIframe.style.overflowX = 'hidden';
    this.memoriesPlayerIframe.style.overflowY = 'hidden';

    this.memoriesPlayerIframe.addEventListener('load', () => this.onIframeLoad());

    document.body.appendChild(this.memoriesPlayerIframe);
  }

  onIframeLoad() {
    try {
      const doc = getIframeDocument(this.memoriesPlayerIframe);
      if (doc) {
        disableScrollOnDocument(doc);
      }

      setTimeout(() => this.measureTVSize(), TIMING.TV_PRELOAD_MEASUREMENT_DELAY);
    } catch (err) {
      console.warn('Error preloading memories_player:', err);
      this.isReady = true;
    }
  }

  measureTVSize() {
    try {
      const doc = getIframeDocument(this.memoriesPlayerIframe);
      if (!doc) {
        console.warn('memories-preloader: iframe document not accessible (cross-origin or not loaded)');
        this.isReady = true;
        return;
      }

      const tvContainer = doc.querySelector(DOM_SELECTORS.TV_CONTAINER) || 
                         doc.querySelector('main') || 
                         doc.body;

      const rect = tvContainer.getBoundingClientRect();
      const tvWidth = Math.max(
        Math.ceil(rect.width),
        tvContainer.scrollWidth || 0,
        tvContainer.offsetWidth || 0
      ) || TV_CONFIG.DEFAULT_WIDTH;

      const tvHeight = Math.max(
        Math.ceil(rect.height),
        tvContainer.scrollHeight || 0,
        tvContainer.offsetHeight || 0
      ) || TV_CONFIG.DEFAULT_HEIGHT;

      const contentW = tvWidth + TV_CONFIG.PADDING_BUFFER;
      const contentH = tvHeight + TV_CONFIG.PADDING_BUFFER;

      const maxW = Math.floor(window.innerWidth * TV_CONFIG.MAX_WIDTH_RATIO);
      const maxH = Math.floor(window.innerHeight * TV_CONFIG.MAX_HEIGHT_RATIO);

      const scale = Math.min(1, maxW / contentW, maxH / contentH);

      setTVComputedSizes(this.memoriesPlayerIframe, {
        computedWidth: Math.round(contentW * scale),
        computedHeight: Math.round(contentH * scale),
        computedScale: scale,
        contentW,
        contentH
      });

      this.isReady = true;
    } catch (err) {
      console.warn('Error precomputing TV sizes:', err);
      this.isReady = true;
    }
  }

  getIsReady() {
    return this.isReady;
  }

  getIframe() {
    return this.memoriesPlayerIframe;
  }

  clear() {
    this.memoriesPlayerIframe = null;
    this.isReady = false;
  }

  startBackgroundPreload() {
    setTimeout(() => {
      if (!this.memoriesPlayerIframe) {
        this.preload();
      }
    }, TIMING.TV_PRELOAD_BACKGROUND_DELAY);
  }
}

export const memoriesPlayerPreloader = new MemoriesPlayerPreloader();
