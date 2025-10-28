import { DOM_SELECTORS, ICON_LAYOUT, TIMING } from './constants.js';
import { appLauncher } from './app-launcher.js';
import { errorDialog } from './error-dialog.js';
import { lifecycleManager } from './lifecycle-manager.js';

class IconManager {
  constructor() {
    this.desktop = null;
    this.iconSize = ICON_LAYOUT.ICON_SIZE;
    this.margin = ICON_LAYOUT.ICON_MARGIN;
    this.spacing = ICON_LAYOUT.ICON_SPACING;
    this.maxTries = ICON_LAYOUT.ICON_MAX_TRIES;
    this.resizeTimer = null;
    this._inited = false;
  }

  init() {
    if (this._inited) return;
    this._inited = true;

    this.desktop = document.querySelector(DOM_SELECTORS.DESKTOP);

    if (!this.desktop) {
      console.error('IconManager: desktop element not found');
      return;
    }

    this.setupIconClickHandlers();
  }

  setupIconClickHandlers() {
    if (!this.desktop) return;
    
    lifecycleManager.addEventListener(this.desktop, 'click', (e) => {
      try {
        const icon = e.target.closest(DOM_SELECTORS.ICON);
        if (icon && this.desktop.contains(icon)) {
          e.preventDefault();
        }
      } catch (err) {
        if (window.__DEV__) console.debug('icon-manager: click delegation error', err);
      }
    });

    lifecycleManager.addEventListener(this.desktop, 'dblclick', (e) => {
      try {
        const icon = e.target.closest(DOM_SELECTORS.ICON);
        if (!icon || !this.desktop.contains(icon)) return;

        const syntheticEvent = {
          currentTarget: icon,
          clientX: e.clientX,
          clientY: e.clientY,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation()
        };

        this.onIconDoubleClick(syntheticEvent);
      } catch (err) {
        if (window.__DEV__) console.debug('icon-manager: dblclick delegation error', err);
      }
    });
  }

  onIconDoubleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const icon = e.currentTarget;
    const appName = icon.dataset.app;
    const stubName = icon.dataset.stub;
    
    if (appName) {
      appLauncher.openApp(appName);
    } else if (stubName === 'placeholder') {
      errorDialog.show({
        title: 'Расположение недоступно',
        message: 'Файл или папка повреждены. Чтение невозможно.',
        x: e.clientX,
        y: e.clientY
      });
    }
  }

  scatter() {
    if (!this.desktop) {
      console.error('IconManager: cannot scatter, desktop not initialized');
      return;
    }

    const icons = this.desktop.querySelectorAll(DOM_SELECTORS.ICON);
    const placed = [];

    const maxX = this.desktop.clientWidth - this.iconSize - this.margin;
    const maxY = this.desktop.clientHeight - this.iconSize - this.margin;

    icons.forEach((icon, index) => {
      const position = this.findRandomPosition(placed, maxX, maxY);
      
      if (position) {
        this.positionIcon(icon, position.x, position.y);
        placed.push(position);
        this.animateIconAppear(icon, index);
      }
    });
  }

  findRandomPosition(placed, maxX, maxY) {
    let tries = 0;

    while (tries < this.maxTries) {
      const x = this.margin + Math.random() * (maxX - this.margin);
      const y = this.margin + Math.random() * (maxY - this.margin);
      tries++;

      if (!this.hasOverlap(x, y, placed)) {
        return { x, y };
      }
    }

    return { 
      x: this.margin + Math.random() * (maxX - this.margin),
      y: this.margin + Math.random() * (maxY - this.margin)
    };
  }

  hasOverlap(x, y, placed) {
    return placed.some(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.spacing;
    });
  }

  positionIcon(icon, x, y) {
    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;
  }

  animateIconAppear(icon, index) {
    icon.style.opacity = 0;
    
    const delay = Math.random() * TIMING.ICON_FADE_MAX_DELAY;

    lifecycleManager.setTimeout(() => {
      icon.style.transition = `opacity ${TIMING.ICON_FADE_DURATION}ms ease`;
      icon.style.opacity = 1;
    }, delay);
  }

  onWindowResize() {
    if (this.resizeTimer) {
      window.clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = lifecycleManager.setTimeout(() => {
      this.scatter();
    }, ICON_LAYOUT.ICON_RESIZE_DEBOUNCE);
  }
}

export const iconManager = new IconManager();
