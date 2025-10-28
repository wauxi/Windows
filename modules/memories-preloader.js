import { TIMING, TV_CONFIG, DOM_SELECTORS, APP_NAMES } from './constants.js';
import { getIframeDocument } from './dom-helpers.js';
import { hideDocumentScroll } from './iframe-styles.js';
import { applyIframeStyles } from './iframe-styles.js';
import { setTVComputedSizes } from './dom-helpers.js';
import { calculateTVSize } from './size-calculator.js';
import { lifecycleManager } from './lifecycle-manager.js';

class MemoriesPlayerPreloader {
  constructor() {
    this.memoriesPlayerIframe = null;
    this.isReady = false;
  }

  preload() {
    this.memoriesPlayerIframe = document.createElement('iframe');
    this.memoriesPlayerIframe.src = `apps/${APP_NAMES.MEMORIES_PLAYER}/index.html`;
    this.memoriesPlayerIframe.setAttribute('frameborder', '0');
    
    applyIframeStyles(this.memoriesPlayerIframe, 'memories_player');
    this.memoriesPlayerIframe.style.position = 'absolute';
    this.memoriesPlayerIframe.style.visibility = 'hidden';
    this.memoriesPlayerIframe.style.pointerEvents = 'none';

    lifecycleManager.addEventListener(this.memoriesPlayerIframe, 'load', () => this.onIframeLoad());

    document.body.appendChild(this.memoriesPlayerIframe);
  }

  onIframeLoad() {
    try {
      const doc = getIframeDocument(this.memoriesPlayerIframe);
      if (doc) {
        hideDocumentScroll(doc);
      }

      lifecycleManager.setTimeout(() => this.measureTVSize(), TIMING.TV_PRELOAD_MEASUREMENT_DELAY);
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

      const { windowWidth, windowHeight } = calculateTVSize(this.memoriesPlayerIframe);

      setTVComputedSizes(this.memoriesPlayerIframe, {
        computedWidth: windowWidth,
        computedHeight: windowHeight,
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
    lifecycleManager.setTimeout(() => {
      if (!this.memoriesPlayerIframe) {
        this.preload();
      }
    }, TIMING.TV_PRELOAD_BACKGROUND_DELAY);
  }
}

export const memoriesPlayerPreloader = new MemoriesPlayerPreloader();
