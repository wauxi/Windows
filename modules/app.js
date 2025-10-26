import { windowDragger } from './window-dragger.js';
import { windowCloser } from './window-closer.js';
import { desktopIconManager } from './desktop-icon-manager.js';
import { memoriesPlayerPreloader } from './memories-preloader.js';
import { iconScatterer } from './icon-scatterer.js';
import { runawayIcon } from './runaway-icon.js';

function initializeApp() {
  try { windowDragger.init(); } catch (e) { console.warn('windowDragger.init() failed', e); }
  try { windowCloser.init(); } catch (e) { console.warn('windowCloser.init() failed', e); }
  try { desktopIconManager.init(); } catch (e) { console.warn('desktopIconManager.init() failed', e); }

  try { iconScatterer.scatter(); } catch (e) { console.warn('iconScatterer.scatter() failed', e); }

  setTimeout(() => {
    try { runawayIcon.init(); } catch (e) { console.warn('runawayIcon.init() failed', e); }
  }, 1000);

  window.addEventListener('resize', () => {
    iconScatterer.onWindowResize();
  });
}

window.addEventListener('load', () => {
  initializeApp();
  memoriesPlayerPreloader.preload();
});
