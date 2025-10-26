import { TIMING, DOM_SELECTORS, CSS_CLASSES } from './constants.js';

class WindowState {
  constructor() {
    this.appWindow = document.querySelector(DOM_SELECTORS.APP_WINDOW);
    this.windowTitle = document.querySelector(DOM_SELECTORS.WINDOW_TITLE);
    this.windowContent = document.querySelector(DOM_SELECTORS.WINDOW_CONTENT);
    this.closeBtn = document.querySelector(DOM_SELECTORS.CLOSE_BUTTON);
    
    this.zIndex = 1;
    this.prevDocumentOverflow = null;
    this.tvUnhideTimer = null;
    
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

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
      if (child && child._minesweeperObserver) {
        try {
          child._minesweeperObserver.disconnect();
        } catch {
        }
        child._minesweeperObserver = null;
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
      document.documentElement.style.overflow = this.prevDocumentOverflow;
      this.prevDocumentOverflow = null;
    }
  }

  hideDocumentOverflow() {
    this.saveDocumentOverflow();
    document.documentElement.style.overflow = 'hidden';
  }

  setUnhideTimer(callback, delay = TIMING.TV_UNHIDE_FALLBACK_TIMEOUT) {
    this.clearUnhideTimer();
    this.tvUnhideTimer = setTimeout(() => {
      callback();
      this.tvUnhideTimer = null;
    }, delay);
  }

  clearUnhideTimer() {
    if (this.tvUnhideTimer) {
      clearTimeout(this.tvUnhideTimer);
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

export const windowState = new WindowState();
