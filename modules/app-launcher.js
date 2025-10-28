import { TIMING, DOM_SELECTORS, CSS_CLASSES, APP_NAMES } from './constants.js';
import { windowManager } from './window-manager.js';
import { memoriesPlayerPreloader } from './memories-preloader.js';
import { iframeCreator } from './iframe-creator.js';
import { webampManager } from './webamp-manager.js';
import { errorDialog } from './error-dialog.js';
import { getIframeDocument, safeObserveResizeInIframe, safeObserveMutationsInIframe, centerWindowState, getTVComputedSizes, setIframeObserver, getIframeObserver, setMeta } from './dom-helpers.js';
import { applyIframeStyles, hideDocumentScroll } from './iframe-styles.js';
import { calculateTVSize, calculateMinesweeperSize } from './size-calculator.js';
import { lifecycleManager } from './lifecycle-manager.js';

class AppLauncher {
  openApp(appName) {
    errorDialog.close();

    if (appName === APP_NAMES.WINAMP) {
      this.openWinamp();
      return;
    }

    if (appName === APP_NAMES.MEMORIES_PLAYER) {
      windowManager.clearTitle();
    } else {
      windowManager.setTitle(appName);
    }

    windowManager.show();
    windowManager.setZIndex(windowManager.getNextZIndex());
    windowManager.setPosition('50%', '50%');
    windowManager.setTransform('translate(-50%, -50%)');

    windowManager.clearContent();

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
      errorDialog.show({
        title: 'Winamp Error',
        message: 'Failed to load Winamp. Please check your internet connection.',
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    }
  }

  openMemoriesPlayerPreloaded() {
    const iframe = memoriesPlayerPreloader.getIframe();
    
    if (!iframe) {
      console.error('app-launcher: preloaded iframe not found');
      windowManager.setVisibility('visible');
      return;
    }

    if (iframe.parentNode === document.body) {
      iframe.parentNode.removeChild(iframe);
    }

    applyIframeStyles(iframe, 'memories_player');
    iframe.classList.add('iframe-preloaded', 'iframe-scaled');

    windowManager.appendContent(iframe);

    const sizes = getTVComputedSizes(iframe);
    
    if (sizes && sizes.computedWidth && sizes.computedHeight) {
      windowManager.addClass(CSS_CLASSES.TV_MODAL);
      windowManager.setSize(
        sizes.computedWidth + 'px',
        sizes.computedHeight + 'px'
      );
      iframe.style.width = sizes.computedWidth + 'px';
      iframe.style.height = sizes.computedHeight + 'px';

      centerWindowState(windowManager);
      windowManager.hideDocumentOverflow();
      windowManager.setVisibility('visible');
    } else {
      windowManager.setVisibility('visible');
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
    } else if (appName === APP_NAMES.PHOTOBOOTH) {
      this.setupPhotoboothHandling(iframe);
    }

    if (appName === APP_NAMES.MEMORIES_PLAYER) {
      windowManager.addClass(CSS_CLASSES.TV_MODAL);
      windowManager.setVisibility('hidden');
      windowManager.setUnhideTimer(() => {
        windowManager.setVisibility('visible');
      });
    } else if (appName === APP_NAMES.MINESWEEPER) {
      windowManager.addClass(CSS_CLASSES.GAME_MODAL);
      windowManager.removeClass(CSS_CLASSES.TV_MODAL);
      windowManager.clearSize();
      windowManager.setVisibility('hidden');
      windowManager.setUnhideTimer(() => {
        windowManager.setVisibility('visible');
      });
      windowManager.restoreDocumentOverflow();
    } else {
      windowManager.removeClass(CSS_CLASSES.TV_MODAL);
      windowManager.removeClass(CSS_CLASSES.GAME_MODAL);
      windowManager.restoreDocumentOverflow();
      windowManager.clearSize();
      windowManager.clearUnhideTimer();
      windowManager.setVisibility('');
    }

    windowManager.appendContent(iframe);
  }

  setupMemoriesPlayerAsync(iframe) {
    lifecycleManager.addEventListener(iframe, 'load', () => {
      try {
        const doc = getIframeDocument(iframe);
        if (doc) {
          hideDocumentScroll(doc);
        }
        lifecycleManager.setTimeout(() => this.sizeMemoriesPlayer(iframe), TIMING.TV_PRELOAD_MEASUREMENT_DELAY);
      } catch (err) {
        console.warn('Could not auto-fit memories_player iframe:', err);
      }
    });

    this.setupPreventWheel(iframe);
  }

  setupPreventWheel(iframe) {
    lifecycleManager.addEventListener(iframe, 'wheel', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  sizeMemoriesPlayer(iframe) {
    try {
      const doc = getIframeDocument(iframe);
      if (!doc) {
        console.warn('app-launcher: memories_player iframe document not accessible');
        windowManager.clearUnhideTimer();
        windowManager.setVisibility('visible');
        return;
      }

      hideDocumentScroll(doc);
      applyIframeStyles(iframe, 'memories_player');

      const { windowWidth, windowHeight, iframeWidth, iframeHeight } = calculateTVSize(iframe);

      windowManager.setSize(windowWidth + 'px', windowHeight + 'px');
      iframe.style.width = iframeWidth + 'px';
      iframe.style.height = iframeHeight + 'px';
      iframe.classList.add('iframe-scaled');

      centerWindowState(windowManager);
      windowManager.hideDocumentOverflow();
      windowManager.clearUnhideTimer();
      windowManager.setVisibility('visible');
    } catch (err) {
      console.warn('Error sizing TV modal:', err);
      windowManager.clearUnhideTimer();
      windowManager.setVisibility('visible');
    }
  }

  setupMinesweeperAsync(iframe) {
    const onLoad = () => {
      try {
        const doc = getIframeDocument(iframe);
        if (doc) {
          hideDocumentScroll(doc);
        }

        lifecycleManager.setTimeout(() => this.sizeMinesweeper(iframe), TIMING.MINESWEEPER_MEASUREMENT_DELAY);

        // Watch for DOM changes in the grid (difficulty changes rebuild the table)
        const mutationObserver = safeObserveMutationsInIframe(iframe, '#grid', () => {
          lifecycleManager.setTimeout(() => this.sizeMinesweeper(iframe), 100);
        });
        
        if (mutationObserver) {
          setIframeObserver(iframe, mutationObserver);
        }

        // Backup: also watch container resize
        const resizeObserver = safeObserveResizeInIframe(iframe, DOM_SELECTORS.MINESWEEPER_CONTAINER, () => this.sizeMinesweeper(iframe));
        if (resizeObserver) {
          const currentObserver = getIframeObserver(iframe);
          if (currentObserver) {
            // Store both observers
            setMeta(iframe, 'observers', [currentObserver, resizeObserver]);
          } else {
            setIframeObserver(iframe, resizeObserver);
          }
        }
      } catch (err) {
        console.warn('Could not auto-fit minesweeper iframe:', err);
        windowManager.clearUnhideTimer();
        windowManager.setVisibility('visible');
      }
    };

    lifecycleManager.addEventListener(iframe, 'load', onLoad, { once: true });
  }

  sizeMinesweeper(iframe) {
    try {
      const doc = getIframeDocument(iframe);
      if (!doc) {
        console.warn('app-launcher: minesweeper iframe document not accessible');
        windowManager.clearUnhideTimer();
        windowManager.setVisibility('visible');
        return;
      }

      hideDocumentScroll(doc);

      const { windowWidth, windowHeight } = calculateMinesweeperSize(iframe);

      windowManager.setSize(windowWidth + 'px', windowHeight + 'px');
      iframe.classList.add('iframe-fullsize');

      centerWindowState(windowManager);
      windowManager.hideDocumentOverflow();
      windowManager.clearUnhideTimer();
      windowManager.setVisibility('visible');
    } catch (err) {
      console.warn('Error sizing minesweeper modal:', err);
      windowManager.clearUnhideTimer();
      windowManager.setVisibility('visible');
    }
  }

  setupPhotoboothHandling(iframe) {
    lifecycleManager.addEventListener(iframe, 'load', () => {
      try {
        const doc = getIframeDocument(iframe);
        if (doc) {
          hideDocumentScroll(doc);
        }
      } catch {}
    });
    this.setupPreventWheel(iframe);
  }
}

export const appLauncher = new AppLauncher();
