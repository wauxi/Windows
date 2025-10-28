import { windowManager } from './window-manager.js';
import { iconManager } from './icon-manager.js';
import { memoriesPlayerPreloader } from './memories-preloader.js';
import { runawayIcon } from './runaway-icon.js';
import { lifecycleManager } from './lifecycle-manager.js';

function initializeApp() {
  try { windowManager.init(); } catch (e) { console.warn('windowManager.init() failed', e); }
  try { iconManager.init(); } catch (e) { console.warn('iconManager.init() failed', e); }

  try { iconManager.scatter(); } catch (e) { console.warn('iconManager.scatter() failed', e); }

  lifecycleManager.setTimeout(() => {
    try { runawayIcon.init(); } catch (e) { console.warn('runawayIcon.init() failed', e); }
  }, 1000);

  lifecycleManager.addEventListener(window, 'resize', () => {
    iconManager.onWindowResize();
  });
}

window.addEventListener('load', () => {
  initializeApp();
  memoriesPlayerPreloader.preload();
});
