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

    const icons = this.desktop.querySelectorAll(DOM_SELECTORS.ICON);
    if (!icons || icons.length === 0) return;

    icons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.preventDefault();
      });
      
      icon.addEventListener('dblclick', (e) => this.onIconDoubleClick(e));
      
      const img = icon.querySelector('img');
      const text = icon.querySelector('div');
      
      if (img) {
        img.addEventListener('click', (e) => e.preventDefault());
        img.addEventListener('dblclick', (e) => e.preventDefault());
      }
      if (text) {
        text.addEventListener('click', (e) => e.preventDefault());
        text.addEventListener('dblclick', (e) => e.preventDefault());
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
