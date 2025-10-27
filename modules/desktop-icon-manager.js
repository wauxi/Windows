import { DOM_SELECTORS } from './constants.js';
import { appLauncher } from './app-launcher.js';
import { errorDialog } from './error-dialog.js';

class DesktopIconManager {
  constructor() {
    this.desktop = document.querySelector(DOM_SELECTORS.DESKTOP);
    this._inited = false;
  }

  init() {
    if (this._inited) return;
    this._inited = true;

    if (!this.desktop) {
      console.warn('DesktopIconManager: desktop element not found');
      return;
    }

    this.setupIconClickHandlers();
  }

  setupIconClickHandlers() {
    if (!this.desktop) return;
    this.desktop.addEventListener('click', (e) => {
      try {
        const icon = e.target.closest(DOM_SELECTORS.ICON);
        if (icon && this.desktop.contains(icon)) {
          e.preventDefault();
        }
      } catch (err) {
        if (window.__DEV__) console.debug('desktop-icon-manager: click delegation error', err);
      }
    });

    this.desktop.addEventListener('dblclick', (e) => {
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
        if (window.__DEV__) console.debug('desktop-icon-manager: dblclick delegation error', err);
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
}

export const desktopIconManager = new DesktopIconManager();
