import { windowState } from './window-state.js';
import { DOM_SELECTORS } from './constants.js';
import { webampManager } from './webamp-manager.js';
import { getIframeDocument, disableScrollOnDocument, enableScrollOnDocument } from './dom-utils.js';

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
        const doc = getIframeDocument(iframe);
        if (doc) disableScrollOnDocument(doc);
      } catch {
        if (window.__DEV__) console.debug('window-closer: ignored cross-origin error while disabling iframe scroll');
      }
    }
    
    windowState.reset();
    
    enableScrollOnDocument(document);
  }
}

export const windowCloser = new WindowCloser();
