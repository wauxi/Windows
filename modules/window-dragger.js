import { windowState } from './window-state.js';
import { DOM_SELECTORS } from './constants.js';

class WindowDragger {
  constructor() {
    this.header = document.querySelector(DOM_SELECTORS.WINDOW_HEADER);
    this.closeBtn = document.querySelector(DOM_SELECTORS.CLOSE_BUTTON);
    this._inited = false;
  }

  init() {
    if (this._inited) return;
    this._inited = true;

    if (!this.header) {
      console.warn('WindowDragger: header element not found');
      return;
    }

    this.header.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mouseup', () => this.onMouseUp());
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onMouseDown(e) {
    if (e.target === this.closeBtn) {
      return;
    }

    windowState.isDragging = true;

    if (windowState.appWindow.style.transform && windowState.appWindow.style.transform !== 'none') {
      const rect = windowState.appWindow.getBoundingClientRect();
      windowState.setPosition(rect.left + 'px', rect.top + 'px');
      windowState.setTransform('none');
    }

    windowState.dragOffsetX = e.clientX - windowState.appWindow.offsetLeft;
    windowState.dragOffsetY = e.clientY - windowState.appWindow.offsetTop;

    windowState.setZIndex(windowState.getNextZIndex());
  }

  onMouseUp() {
    windowState.isDragging = false;
  }

  onMouseMove(e) {
    if (!windowState.isDragging) {
      return;
    }

    const newLeft = e.clientX - windowState.dragOffsetX;
    const newTop = e.clientY - windowState.dragOffsetY;

    windowState.setPosition(newLeft + 'px', newTop + 'px');
  }
}

export const windowDragger = new WindowDragger();
