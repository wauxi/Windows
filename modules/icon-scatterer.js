import { DOM_SELECTORS } from './constants.js';

class IconScatterer {
  constructor() {
    this.desktop = document.querySelector(DOM_SELECTORS.DESKTOP);
    this.iconSize = 90;
    this.margin = 60;
    this.spacing = 140;
    this.maxTries = 200;
  }

  scatter() {
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
    
    const delay = Math.random() * 800;
    
    setTimeout(() => {
      icon.style.transition = 'opacity 0.8s ease';
      icon.style.opacity = 1;
    }, delay);
  }

  onWindowResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.scatter();
    }, 250);
  }
}

export const iconScatterer = new IconScatterer();
