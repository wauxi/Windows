import { TIMING, TV_CONFIG, DOM_SELECTORS, CSS_CLASSES, APP_NAMES, MINESWEEPER_CONFIG } from './constants.js';
import { windowState } from './window-state.js';
import { memoriesPlayerPreloader } from './memories-preloader.js';
import { iframeCreator } from './iframe-creator.js';
import { webampManager } from './webamp-manager.js';
import { errorDialog } from './error-dialog.js';
import { getIframeDocument, disableScrollOnDocument, safeObserveResizeInIframe, centerWindowState } from './dom-utils.js';
import { UI_DIMENSIONS } from './constants.js';
import { getTVComputedSizes, setIframeObserver } from './element-meta.js';

class AppLauncher {
  openApp(appName) {
    errorDialog.close();

    if (appName === APP_NAMES.WINAMP) {
      this.openWinamp();
      return;
    }

    if (appName === APP_NAMES.MEMORIES_PLAYER) {
      windowState.clearTitle();
    } else {
      windowState.setTitle(appName);
    }

    windowState.show();
    windowState.setZIndex(windowState.getNextZIndex());
    windowState.setPosition('50%', '50%');
    windowState.setTransform('translate(-50%, -50%)');

    windowState.clearContent();

    if (appName === APP_NAMES.MEMORIES_PLAYER && 
        memoriesPlayerPreloader.getIframe() && 
        memoriesPlayerPreloader.getIsReady()) {
      this.openMemoriesPlayerPreloaded();
    } else {
      this.openRegularApp(appName);
    }
  }

  async openWinamp() {
    try {
      await webampManager.createWebamp();
    } catch (error) {
      console.error('Failed to open Winamp:', error);
      alert('Failed to load Winamp. Please check your internet connection.');
    }
  }

  openMemoriesPlayerPreloaded() {
    const iframe = memoriesPlayerPreloader.getIframe();

    if (iframe.parentNode === document.body) {
      iframe.parentNode.removeChild(iframe);
    }

    iframe.style.position = 'static';
    iframe.style.visibility = 'visible';
    iframe.style.pointerEvents = 'auto';
    iframe.style.border = 'none';
    iframe.style.outline = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.overflowX = 'hidden';
    iframe.style.overflowY = 'hidden';
    iframe.setAttribute('scrolling', 'no');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    windowState.appendContent(iframe);

    // Read computed sizes from WeakMap (element-meta) instead of iframe properties
    const sizes = getTVComputedSizes(iframe);
    if (sizes && sizes.computedWidth && sizes.computedHeight) {
      windowState.addClass(CSS_CLASSES.TV_MODAL);
      windowState.setSize(
        sizes.computedWidth + 'px',
        sizes.computedHeight + 'px'
      );
      // Use direct sizing instead of scale transform to avoid cutting off content
      iframe.style.width = sizes.computedWidth + 'px';
      iframe.style.height = sizes.computedHeight + 'px';
      iframe.style.transform = 'none';
      iframe.style.transformOrigin = 'top left';

      centerWindowState(windowState);

      windowState.hideDocumentOverflow();
      windowState.setVisibility('visible');
    }

    memoriesPlayerPreloader.clear();
    memoriesPlayerPreloader.startBackgroundPreload();
  }

  openRegularApp(appName) {
    const iframe = iframeCreator.createIframe(appName);

    if (appName === APP_NAMES.MEMORIES_PLAYER) {
      this.setupMemoriesPlayerAsync(iframe);
    } else if (appName === APP_NAMES.MINESWEEPER) {
      this.setupMinesweeperAsync(iframe);
    }

    if (appName === APP_NAMES.PHOTOBOOTH) {
      this.setupPhotoboothHandling(iframe);
    }

    if (appName === APP_NAMES.MEMORIES_PLAYER) {
      windowState.addClass(CSS_CLASSES.TV_MODAL);
      windowState.setVisibility('hidden');
      windowState.setUnhideTimer(() => {
        windowState.setVisibility('visible');
      });
    } else if (appName === APP_NAMES.MINESWEEPER) {
      windowState.addClass(CSS_CLASSES.GAME_MODAL);
      windowState.removeClass(CSS_CLASSES.TV_MODAL);
      windowState.clearSize();
      windowState.setVisibility('hidden');
      windowState.setUnhideTimer(() => {
        windowState.setVisibility('visible');
      });
      windowState.restoreDocumentOverflow();
    } else {
      windowState.removeClass(CSS_CLASSES.TV_MODAL);
      windowState.removeClass(CSS_CLASSES.GAME_MODAL);
      windowState.restoreDocumentOverflow();
      windowState.clearSize();
      windowState.clearUnhideTimer();
      windowState.setVisibility('');
    }

    windowState.appendContent(iframe);
  }

  setupMemoriesPlayerAsync(iframe) {
    iframe.addEventListener('load', () => {
      try {
        const doc = getIframeDocument(iframe);
        if (doc) {
          disableScrollOnDocument(doc);
        }
        setTimeout(() => this.sizeMemoriesPlayer(iframe), TIMING.TV_PRELOAD_MEASUREMENT_DELAY);
      } catch (err) {
        console.warn('Could not auto-fit memories_player iframe:', err);
      }
    });

    iframe.addEventListener('wheel', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  sizeMemoriesPlayer(iframe) {
    try {
      const doc = getIframeDocument(iframe);
      if (!doc) {
        console.warn('app-launcher: memories_player iframe document not accessible');
        windowState.clearUnhideTimer();
        windowState.setVisibility('visible');
        return;
      }

      disableScrollOnDocument(doc);

      // Ensure no border on iframe and force no overflow
      iframe.style.border = 'none';
      iframe.style.outline = 'none';
      iframe.style.overflow = 'hidden';
      iframe.style.overflowX = 'hidden';
      iframe.style.overflowY = 'hidden';
      iframe.setAttribute('scrolling', 'no');

  // Prefer measuring the inner `.crt-container` first (matches preloader).
  // Fall back to #crtMain or main/body if the container isn't present.
  const tvContainer = doc.querySelector(DOM_SELECTORS.TV_CONTAINER) ||
         doc.querySelector('#crtMain') ||
         doc.querySelector('main') ||
         doc.body;

      const rect = tvContainer.getBoundingClientRect();
      // Use scrollHeight/scrollWidth where possible — this captures overflowing
      // children and negative margins that bounding rect might miss.
      const tvWidth = Math.max(
        Math.ceil(rect.width),
        tvContainer.scrollWidth || 0,
        tvContainer.offsetWidth || 0
      ) || TV_CONFIG.DEFAULT_WIDTH;

      const tvHeight = Math.max(
        tvContainer.scrollHeight || Math.ceil(rect.height) || 0,
        tvContainer.offsetHeight || 0
      ) || TV_CONFIG.DEFAULT_HEIGHT;

      const contentW = tvWidth + TV_CONFIG.PADDING_BUFFER;
      const contentH = tvHeight + TV_CONFIG.PADDING_BUFFER;

      const maxW = Math.floor(window.innerWidth * TV_CONFIG.MAX_WIDTH_RATIO);
      const maxH = Math.floor(window.innerHeight * TV_CONFIG.MAX_HEIGHT_RATIO);

      const scale = Math.min(1, maxW / contentW, maxH / contentH);

      // Instead of using scale transform (which can cut off content),
      // directly set the iframe width/height to scaled values
      const finalW = Math.round(contentW * scale);
      const finalH = Math.round(contentH * scale);

      windowState.setSize(finalW + 'px', finalH + 'px');
      iframe.style.width = finalW + 'px';
      iframe.style.height = finalH + 'px';
      iframe.style.transform = 'none';  // Remove scale transform
      iframe.style.transformOrigin = 'top left';

      centerWindowState(windowState);

      windowState.hideDocumentOverflow();

      windowState.clearUnhideTimer();
      windowState.setVisibility('visible');
    } catch (err) {
      console.warn('Error sizing TV modal:', err);
      windowState.clearUnhideTimer();
      windowState.setVisibility('visible');
    }
  }

  setupMinesweeperAsync(iframe) {
    const onLoad = () => {
      try {
        const doc = getIframeDocument(iframe);
        if (doc) {
          disableScrollOnDocument(doc);
        }

        setTimeout(() => this.sizeMinesweeper(iframe), TIMING.MINESWEEPER_MEASUREMENT_DELAY);

        // Store observer in WeakMap instead of iframe property
        const observer = safeObserveResizeInIframe(iframe, DOM_SELECTORS.MINESWEEPER_CONTAINER, () => this.sizeMinesweeper(iframe));
        if (observer) {
          setIframeObserver(iframe, observer);
        }
      } catch (err) {
        console.warn('Could not auto-fit minesweeper iframe:', err);
        windowState.clearUnhideTimer();
        windowState.setVisibility('visible');
      }
    };

    iframe.addEventListener('load', onLoad, { once: true });
  }

  sizeMinesweeper(iframe) {
    try {
      const doc = getIframeDocument(iframe);
      if (!doc) {
        console.warn('app-launcher: minesweeper iframe document not accessible');
        windowState.clearUnhideTimer();
        windowState.setVisibility('visible');
        return;
      }

      disableScrollOnDocument(doc);

      const container = doc.querySelector(DOM_SELECTORS.MINESWEEPER_CONTAINER) || doc.body;
      
      container.offsetHeight;
      
      const rect = container.getBoundingClientRect();

      let containerWidth = Math.ceil(rect.width) || MINESWEEPER_CONFIG.DEFAULT_WIDTH;
      let containerHeight = Math.ceil(rect.height) || MINESWEEPER_CONFIG.DEFAULT_HEIGHT;

      const windowW = containerWidth + UI_DIMENSIONS.WINDOW_PADDING; 
      const windowH = containerHeight + UI_DIMENSIONS.WINDOW_HEADER_HEIGHT + UI_DIMENSIONS.WINDOW_PADDING; 

      const maxW = Math.floor(window.innerWidth * MINESWEEPER_CONFIG.MAX_WIDTH_RATIO);
      const maxH = Math.floor(window.innerHeight * MINESWEEPER_CONFIG.MAX_HEIGHT_RATIO);

      const finalW = Math.min(windowW, maxW);
      const finalH = Math.min(windowH, maxH);

      windowState.setSize(finalW + 'px', finalH + 'px');

      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.transform = '';
      iframe.style.transformOrigin = '';

      centerWindowState(windowState);

      windowState.hideDocumentOverflow();
      windowState.clearUnhideTimer();
      windowState.setVisibility('visible');
    } catch (err) {
      console.warn('Error sizing minesweeper modal:', err);
      windowState.clearUnhideTimer();
      windowState.setVisibility('visible');
    }
  } 
  setupPhotoboothHandling(iframe) {
    iframe.addEventListener('load', () => {
      try {
        const doc = getIframeDocument(iframe);
        if (doc) {
          disableScrollOnDocument(doc);
        }
      } catch {}
    });
    iframe.addEventListener('wheel', (e) => {
      e.preventDefault();
    }, { passive: false });
  }
}

export const appLauncher = new AppLauncher();
