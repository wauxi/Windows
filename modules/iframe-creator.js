import { APP_NAMES, SCROLLING } from './constants.js';

class IframeCreator {
  createBaseIframe(src, scrolling, preventWheel = false) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', scrolling);
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.overflow = scrolling === SCROLLING.PHOTOBOOTH_SCROLLING ? 'hidden' : 'auto';

    if (preventWheel) {
      iframe.addEventListener('wheel', (e) => {
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
    iframe.style.border = 'none';
    iframe.style.outline = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.overflowX = 'hidden';
    iframe.style.overflowY = 'hidden';
    iframe.setAttribute('scrolling', 'no');
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
    return this.createBaseIframe(
      `apps/${APP_NAMES.MINESWEEPER}/index.html`,
      SCROLLING.PHOTOBOOTH_SCROLLING,
      true
    );
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
