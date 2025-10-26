import { windowState } from './window-state.js';

class WebampManager {
  constructor() {
    this.webampInstance = null;
    this.container = document.getElementById('webamp-container');
  }

  async loadPlaylist() {
    try {
      const resp = await fetch('assets/audio/playlist/playlist.json');
      if (!resp.ok) return [];
      const data = await resp.json();
      if (!Array.isArray(data)) return [];
      return data;
    } catch (err) {
      console.warn('webamp-manager: failed to load playlist.json', err);
      return [];
    }
  }

  async createWebamp() {
    if (this.webampInstance) {
      return;
    }

    if (!window.Webamp) {
      console.error('Webamp library is not loaded!');
      return;
    }

    this.container.style.display = 'block';

    try {
      const initialTracks = await this.loadPlaylist();

      const zIndex = windowState.getNextZIndex();

      this.webampInstance = new window.Webamp({
        initialTracks,
        zIndex: zIndex + 1,
      });

      this.webampInstance.onClose(() => {
        this.dispose();
      });

      await this.webampInstance.renderWhenReady(this.container);

      try {
        const ensureVisible = (id, w, h) => {
          const el = document.getElementById(id);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          if ((rect.width === 0 && rect.height === 0) || getComputedStyle(el).display === 'none') {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            el.style.opacity = el.style.opacity || '1';
            el.style.width = el.style.width || (w + 'px');
            el.style.height = el.style.height || (h + 'px');
            el.style.transform = el.style.transform || '';
            return true;
          }
          return false;
        };

        ensureVisible('main-window', 275, 116);
        ensureVisible('equalizer-window', 275, 116);
      } catch (err) {
        console.debug('webamp-manager: ensureVisible failed', err);
      }

    } catch (e) {
      console.error('Failed to render Webamp:', e);
      this.dispose(); 
    }
  }

  dispose() {
    if (this.webampInstance) {
      this.webampInstance.dispose();
      this.webampInstance = null;
    }
    if (this.container) {
        this.container.style.display = 'none';
    }
  }
}

export const webampManager = new WebampManager();
