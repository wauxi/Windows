import { windowState } from './window-state.js';
import { DOM_SELECTORS } from './constants.js';
import { webampManager } from './webamp-manager.js';

class WindowCloser {
  constructor() {
    this.closeBtn = document.querySelector(DOM_SELECTORS.CLOSE_BUTTON);
    this._inited = false;
  }

  init() {
    if (this._inited) return;
    this._inited = true;

    if (!this.closeBtn) {
      console.warn('WindowCloser: close button not found');
      return;
    }

    this.closeBtn.addEventListener('click', (e) => this.closeWindow(e));
  }

  closeWindow(e) {
    e.stopPropagation();
    
    const iframe = windowState.windowContent.querySelector('iframe');
    
    if (iframe) {
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          doc.documentElement.style.overflow = 'hidden';
          doc.documentElement.style.overflowX = 'hidden';
          doc.documentElement.style.overflowY = 'hidden';
          doc.body.style.overflow = 'hidden';
          doc.body.style.overflowX = 'hidden';
          doc.body.style.overflowY = 'hidden';
        }
      } catch {
        if (window.__DEV__) console.debug('window-closer: ignored cross-origin error while disabling iframe scroll');
      }
    }
    
    windowState.reset();
    
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowX = '';
    document.documentElement.style.overflowY = '';
  }
}

export const windowCloser = new WindowCloser();
