import { TIMING, DOM_SELECTORS, CSS_CLASSES } from './constants.js';
import { hideDocumentScroll, showDocumentScroll } from './iframe-styles.js';
import { clearIframeObserver } from './dom-helpers.js';
import { lifecycleManager } from './lifecycle-manager.js';
import { getIframeDocument } from './dom-helpers.js';

class WindowManager {
  constructor() {
    this.appWindow = null;
    this.windowTitle = null;
    this.windowContent = null;
    this.closeBtn = null;
    this.header = null;
    
    this.zIndex = 1;
    this.prevDocumentOverflow = null;
    this.tvUnhideTimer = null;
    
    this._inited = false;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  init() {
    if (this._inited) return;
    this._inited = true;

    this.appWindow = document.querySelector(DOM_SELECTORS.APP_WINDOW);
    this.windowTitle = document.querySelector(DOM_SELECTORS.WINDOW_TITLE);
    this.windowContent = document.querySelector(DOM_SELECTORS.WINDOW_CONTENT);
    this.closeBtn = document.querySelector(DOM_SELECTORS.CLOSE_BUTTON);
    this.header = document.querySelector(DOM_SELECTORS.WINDOW_HEADER);

    if (!this.appWindow) {
      console.error('WindowManager: app window element not found');
      return;
    }

    if (!this.windowTitle) {
      console.error('WindowManager: window title element not found');
      return;
    }

    if (!this.windowContent) {
      console.error('WindowManager: window content element not found');
      return;
    }

    if (!this.header) {
      console.error('WindowManager: header element not found');
      return;
    }

    if (!this.closeBtn) {
      console.error('WindowManager: close button not found');
      return;
    }

    lifecycleManager.addEventListener(this.header, 'mousedown', (e) => this.onMouseDown(e));
    lifecycleManager.addEventListener(document, 'mouseup', () => this.onMouseUp());
    lifecycleManager.addEventListener(document, 'mousemove', (e) => this.onMouseMove(e));
    lifecycleManager.addEventListener(this.closeBtn, 'click', (e) => this.closeWindow(e));
  }

  // Dragging functionality
  onMouseDown(e) {
    if (e.target === this.closeBtn) {
      return;
    }

    this.isDragging = true;

    if (this.appWindow.style.transform && this.appWindow.style.transform !== 'none') {
      const rect = this.appWindow.getBoundingClientRect();
      this.setPosition(rect.left + 'px', rect.top + 'px');
      this.setTransform('none');
    }

    this.dragOffsetX = e.clientX - this.appWindow.offsetLeft;
    this.dragOffsetY = e.clientY - this.appWindow.offsetTop;

    this.setZIndex(this.getNextZIndex());
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseMove(e) {
    if (!this.isDragging) {
      return;
    }

    const newLeft = e.clientX - this.dragOffsetX;
    const newTop = e.clientY - this.dragOffsetY;

    this.setPosition(newLeft + 'px', newTop + 'px');
  }

  // Close functionality
  closeWindow(e) {
    e.stopPropagation();
    
    const iframe = this.windowContent.querySelector('iframe');
    
    if (iframe) {
      try {
        const doc = getIframeDocument(iframe);
        if (doc) hideDocumentScroll(doc);
      } catch {
        if (window.__DEV__) console.debug('window-manager: ignored cross-origin error while disabling iframe scroll');
      }
    }
    
    this.reset();
    showDocumentScroll(document);
  }

  // State management
  getNextZIndex() {
    return ++this.zIndex;
  }

  setTitle(title) {
    this.windowTitle.textContent = title;
  }

  clearTitle() {
    this.windowTitle.textContent = '';
  }

  setZIndex(index) {
    if (!this.appWindow) return;
    const numeric = Number(index);
    if (!Number.isNaN(numeric)) {
      this.appWindow.style.zIndex = numeric;
      this.zIndex = numeric;
    } else {
      this.appWindow.style.zIndex = index;
    }
  }

  show() {
    this.appWindow.style.display = 'block';
  }

  hide() {
    this.appWindow.style.display = 'none';
  }

  setPosition(left, top) {
    this.appWindow.style.left = left;
    this.appWindow.style.top = top;
  }

  setTransform(transform) {
    this.appWindow.style.transform = transform;
  }

  clearTransform() {
    this.appWindow.style.transform = '';
  }

  setSize(width, height) {
    if (width) this.appWindow.style.width = width;
    if (height) this.appWindow.style.height = height;
  }

  clearSize() {
    this.appWindow.style.width = '';
    this.appWindow.style.height = '';
  }

  setVisibility(visibility) {
    this.appWindow.style.visibility = visibility;
  }

  clearVisibility() {
    this.appWindow.style.visibility = '';
  }

  addClass(className) {
    this.appWindow.classList.add(className);
  }

  removeClass(className) {
    this.appWindow.classList.remove(className);
  }

  clearContent() {
    while (this.windowContent.firstChild) {
      const child = this.windowContent.firstChild;
      if (child && child.tagName && child.tagName.toLowerCase() === 'iframe') {
        clearIframeObserver(child);
      }
      this.windowContent.removeChild(child);
    }
  }

  appendContent(element) {
    this.windowContent.appendChild(element);
  }

  saveDocumentOverflow() {
    if (this.prevDocumentOverflow === null) {
      this.prevDocumentOverflow = document.documentElement.style.overflow;
    }
  }

  restoreDocumentOverflow() {
    if (this.prevDocumentOverflow !== null) {
      try {
        document.documentElement.style.overflow = this.prevDocumentOverflow;
      } catch (e) {}
      this.prevDocumentOverflow = null;
      try {
        document.body.style.overflow = '';
        document.body.style.overflowX = '';
        document.body.style.overflowY = '';
      } catch (e) {}
      return;
    }

    try {
      showDocumentScroll(document);
    } catch (e) {}
  }

  hideDocumentOverflow() {
    this.saveDocumentOverflow();
    try {
      hideDocumentScroll(document);
    } catch (e) {}
  }

  setUnhideTimer(callback, delay = TIMING.TV_UNHIDE_FALLBACK_TIMEOUT) {
    this.clearUnhideTimer();
    this.tvUnhideTimer = lifecycleManager.setTimeout(callback, delay);
  }

  clearUnhideTimer() {
    if (this.tvUnhideTimer) {
      window.clearTimeout(this.tvUnhideTimer);
      this.tvUnhideTimer = null;
    }
  }

  reset() {
    this.hide();
    this.clearTransform();
    this.clearContent();
    this.removeClass(CSS_CLASSES.TV_MODAL);
    this.removeClass(CSS_CLASSES.GAME_MODAL);
    this.restoreDocumentOverflow();
    this.clearSize();
    this.clearUnhideTimer();
    this.clearVisibility();
  }
}

export const windowManager = new WindowManager();
