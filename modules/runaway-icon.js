import { RUNAWAY_CONFIG } from './constants.js';
import { lifecycleManager } from './lifecycle-manager.js';

class RunawayIcon {
  constructor() {
    this.runawayIcons = new Set();
    this.escapeDistance = RUNAWAY_CONFIG.ESCAPE_DISTANCE;
    this.moveDistance = RUNAWAY_CONFIG.MOVE_DISTANCE;
    this.animationDuration = RUNAWAY_CONFIG.ANIMATION_DURATION;
  }

  init() {
    const steamIcon = Array.from(document.querySelectorAll('.icon[data-stub="placeholder"]'))
      .find(icon => {
        const text = icon.textContent.trim();
        return text === 'Steam';
      });
    
    if (!steamIcon) {
      console.warn('Steam icon not found');
      return;
    }
    
    this.runawayIcons.add(steamIcon);
    lifecycleManager.addEventListener(steamIcon, 'mouseenter', (e) => this.escapeFromCursor(steamIcon, e));
    lifecycleManager.addEventListener(document, 'mousemove', (e) => this.checkProximity(steamIcon, e));
  }

  checkProximity(icon, event) {
    const rect = icon.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    const iconCenterY = rect.top + rect.height / 2;
    
    const distanceX = event.clientX - iconCenterX;
    const distanceY = event.clientY - iconCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    if (distance < this.escapeDistance) {
      this.escapeFromCursor(icon, event);
    }
  }

  escapeFromCursor(icon, event) {
    const rect = icon.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    const iconCenterY = rect.top + rect.height / 2;
    
    const directionX = iconCenterX - event.clientX;
    const directionY = iconCenterY - event.clientY;
    const distance = Math.sqrt(directionX * directionX + directionY * directionY);
    
    const normalizedX = (directionX / distance) * this.moveDistance;
    const normalizedY = (directionY / distance) * this.moveDistance;
    
    const currentLeft = parseInt(icon.style.left) || 0;
    const currentTop = parseInt(icon.style.top) || 0;
    
    let newLeft = currentLeft + normalizedX;
    let newTop = currentTop + normalizedY;
    
  const maxLeft = window.innerWidth - rect.width - RUNAWAY_CONFIG.BOUNDS_PADDING;
  const maxTop = window.innerHeight - rect.height - RUNAWAY_CONFIG.BOUNDS_PADDING;

  newLeft = Math.max(RUNAWAY_CONFIG.BOUNDS_PADDING, Math.min(newLeft, maxLeft));
  newTop = Math.max(RUNAWAY_CONFIG.BOUNDS_PADDING, Math.min(newTop, maxTop));
    
    icon.style.transition = `left ${this.animationDuration}ms ease-out, top ${this.animationDuration}ms ease-out`;
    icon.style.left = newLeft + 'px';
    icon.style.top = newTop + 'px';
    
    icon.style.transform = 'scale(1.1) rotate(5deg)';
    
    lifecycleManager.setTimeout(() => {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }, this.animationDuration / 2);
  }

  teleportToRandomPosition(icon) {
    const maxLeft = window.innerWidth - RUNAWAY_CONFIG.TELEPORT_MARGIN;
    const maxTop = window.innerHeight - RUNAWAY_CONFIG.TELEPORT_MARGIN;

    const randomLeft = Math.random() * maxLeft + RUNAWAY_CONFIG.BOUNDS_PADDING;
    const randomTop = Math.random() * maxTop + RUNAWAY_CONFIG.BOUNDS_PADDING;

    icon.style.transition = `opacity ${RUNAWAY_CONFIG.TELEPORT_FADE_MS}ms`;
    icon.style.opacity = '0';

    lifecycleManager.setTimeout(() => {
      icon.style.left = randomLeft + 'px';
      icon.style.top = randomTop + 'px';
      icon.style.opacity = '1';
    }, RUNAWAY_CONFIG.TELEPORT_FADE_MS);
  }
}

export const runawayIcon = new RunawayIcon();
