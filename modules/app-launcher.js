import { TIMING, TV_CONFIG, DOM_SELECTORS, CSS_CLASSES, APP_NAMES, MINESWEEPER_CONFIG } from './constants.js';
import { windowState } from './window-state.js';
import { memoriesPlayerPreloader } from './memories-preloader.js';
import { iframeCreator } from './iframe-creator.js';
import { webampManager } from './webamp-manager.js';
import { errorDialog } from './error-dialog.js';

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
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    windowState.appendContent(iframe);

    if (iframe._computedWidth && iframe._computedHeight) {
      windowState.addClass(CSS_CLASSES.TV_MODAL);
      windowState.setSize(
        iframe._computedWidth + 'px',
        iframe._computedHeight + 'px'
      );
      iframe.style.width = iframe._contentW + 'px';
      iframe.style.height = iframe._contentH + 'px';
      iframe.style.transform = `scale(${iframe._computedScale})`;

      windowState.setPosition('50%', '50%');
      windowState.setTransform('translate(-50%, -50%)');

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
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        
        try {
          doc.documentElement.style.overflow = 'hidden';
          doc.documentElement.style.overflowX = 'hidden';
          doc.documentElement.style.overflowY = 'hidden';
      } catch {
        if (window.__DEV__) console.debug('app-launcher: ignored iframe doc overflow change');
      }
        try {
          doc.body.style.overflow = 'hidden';
          doc.body.style.overflowX = 'hidden';
          doc.body.style.overflowY = 'hidden';
        } catch {
          if (window.__DEV__) console.debug('app-launcher: ignored iframe body overflow change');
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
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      try {
        doc.documentElement.style.overflow = 'hidden';
        doc.documentElement.style.overflowX = 'hidden';
        doc.documentElement.style.overflowY = 'hidden';
      } catch {
        if (window.__DEV__) console.debug('app-launcher: ignored error while measuring TV container');
      }
      try {
        doc.body.style.overflow = 'hidden';
        doc.body.style.overflowX = 'hidden';
        doc.body.style.overflowY = 'hidden';
      } catch {
        if (window.__DEV__) console.debug('app-launcher: ignored error while sizing TV modal');
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

      const finalW = Math.round(contentW * scale);
      const finalH = Math.round(contentH * scale);

      windowState.setSize(finalW + 'px', finalH + 'px');
      iframe.style.width = contentW + 'px';
      iframe.style.height = contentH + 'px';
      iframe.style.transform = `scale(${scale})`;

      windowState.setPosition('50%', '50%');
      windowState.setTransform('translate(-50%, -50%)');

      windowState.hideDocumentOverflow();

      windowState.clearUnhideTimer();
      windowState.setVisibility('visible');
    } catch (err) {
      console.warn('Error sizing TV modal:', err);
    }
  }

  setupMinesweeperAsync(iframe) {
    const onLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        try {
          doc.documentElement.style.overflow = 'hidden';
          doc.documentElement.style.overflowX = 'hidden';
          doc.documentElement.style.overflowY = 'hidden';
        } catch {
          if (window.__DEV__) console.debug('app-launcher: unable to disable document scroll for minesweeper');
        }
        try {
          doc.body.style.overflow = 'hidden';
          doc.body.style.overflowX = 'hidden';
          doc.body.style.overflowY = 'hidden';
        } catch {
          if (window.__DEV__) console.debug('app-launcher: unable to disable body scroll for minesweeper');
        }

        setTimeout(() => this.sizeMinesweeper(iframe), TIMING.MINESWEEPER_MEASUREMENT_DELAY);

        const container = doc.querySelector(DOM_SELECTORS.MINESWEEPER_CONTAINER) || doc.body;
        if (iframe.contentWindow && iframe.contentWindow.ResizeObserver && container) {
          try {
            const ObserverCtor = iframe.contentWindow.ResizeObserver;
            const observer = new ObserverCtor(() => this.sizeMinesweeper(iframe));
            observer.observe(container);
            iframe._minesweeperObserver = observer;
          } catch (observerErr) {
            if (window.__DEV__) console.debug('app-launcher: minesweeper resize observer failed', observerErr);
          }
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
      const doc = iframe.contentDocument || iframe.contentWindow.document;

      try {
        doc.documentElement.style.overflow = 'hidden';
        doc.documentElement.style.overflowX = 'hidden';
        doc.documentElement.style.overflowY = 'hidden';
      } catch {
        if (window.__DEV__) console.debug('app-launcher: minesweeper document overflow lock failed');
      }
      try {
        doc.body.style.overflow = 'hidden';
        doc.body.style.overflowX = 'hidden';
        doc.body.style.overflowY = 'hidden';
      } catch {
        if (window.__DEV__) console.debug('app-launcher: minesweeper body overflow lock failed');
      }

      const container = doc.querySelector(DOM_SELECTORS.MINESWEEPER_CONTAINER) || doc.body;
      
      container.offsetHeight;
      
      const rect = container.getBoundingClientRect();

      let containerWidth = Math.ceil(rect.width) || MINESWEEPER_CONFIG.DEFAULT_WIDTH;
      let containerHeight = Math.ceil(rect.height) || MINESWEEPER_CONFIG.DEFAULT_HEIGHT;

      const windowW = containerWidth + 8; 
      const windowH = containerHeight + 28 + 8; 

      const maxW = Math.floor(window.innerWidth * MINESWEEPER_CONFIG.MAX_WIDTH_RATIO);
      const maxH = Math.floor(window.innerHeight * MINESWEEPER_CONFIG.MAX_HEIGHT_RATIO);

      const finalW = Math.min(windowW, maxW);
      const finalH = Math.min(windowH, maxH);

      windowState.setSize(finalW + 'px', finalH + 'px');

      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.transform = '';
      iframe.style.transformOrigin = '';

      windowState.setPosition('50%', '50%');
      windowState.setTransform('translate(-50%, -50%)');

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
        const doc = iframe.contentDocument;
        if (doc && doc.body) {
          doc.documentElement.style.overflow = 'hidden';
          doc.body.style.overflow = 'hidden';
        }
      } catch {}
    });
    iframe.addEventListener('wheel', (e) => {
      e.preventDefault();
    }, { passive: false });
  }
}

export const appLauncher = new AppLauncher();
