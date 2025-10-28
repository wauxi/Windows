import { APP_NAMES, SCROLLING } from './constants.js';
import { applyIframeStyles } from './iframe-styles.js';
import { lifecycleManager } from './lifecycle-manager.js';

class IframeCreator {
  createBaseIframe(src, scrolling, preventWheel = false) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', scrolling);
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    if (preventWheel) {
      lifecycleManager.addEventListener(iframe, 'wheel', (e) => {
        e.preventDefault();
      }, { passive: false });
    }

    return iframe;
  }

  createMemoriesPlayerIframe() {
    const iframe = this.createBaseIframe(
      `apps/${APP_NAMES.MEMORIES_PLAYER}/index.html`,
      SCROLLING.PHOTOBOOTH_SCROLLING,
      true
    );
    applyIframeStyles(iframe, 'memories_player');
    return iframe;
  }

  createPhotoboothIframe() {
    return this.createBaseIframe(
      `apps/${APP_NAMES.PHOTOBOOTH}/index.html`,
      SCROLLING.PHOTOBOOTH_SCROLLING,
      false
    );
  }

  createMinesweeperIframe() {
    const iframe = this.createBaseIframe(
      `apps/${APP_NAMES.MINESWEEPER}/index.html`,
      SCROLLING.PHOTOBOOTH_SCROLLING,
      true
    );
    applyIframeStyles(iframe, 'minesweeper');
    return iframe;
  }

  createRegularAppIframe(appName) {
    return this.createBaseIframe(
      `apps/${appName}/index.html`,
      SCROLLING.OTHER_APPS_SCROLLING,
      false
    );
  }

  createIframe(appName) {
    if (appName === APP_NAMES.MEMORIES_PLAYER) {
      return this.createMemoriesPlayerIframe();
    } else if (appName === APP_NAMES.PHOTOBOOTH) {
      return this.createPhotoboothIframe();
    } else if (appName === APP_NAMES.MINESWEEPER) {
      return this.createMinesweeperIframe();
    } else {
      return this.createRegularAppIframe(appName);
    }
  }
}

export const iframeCreator = new IframeCreator();
