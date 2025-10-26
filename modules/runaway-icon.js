class RunawayIcon {
  constructor() {
    this.runawayIcons = new Set();
    this.escapeDistance = 150; 
    this.moveDistance = 200; 
    this.animationDuration = 300; 
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
    steamIcon.addEventListener('mouseenter', (e) => this.escapeFromCursor(steamIcon, e));
    document.addEventListener('mousemove', (e) => this.checkProximity(steamIcon, e));
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
    
    const maxLeft = window.innerWidth - rect.width - 20;
    const maxTop = window.innerHeight - rect.height - 20;
    
    newLeft = Math.max(20, Math.min(newLeft, maxLeft));
    newTop = Math.max(20, Math.min(newTop, maxTop));
    
    icon.style.transition = `left ${this.animationDuration}ms ease-out, top ${this.animationDuration}ms ease-out`;
    icon.style.left = newLeft + 'px';
    icon.style.top = newTop + 'px';
    
    icon.style.transform = 'scale(1.1) rotate(5deg)';
    
    setTimeout(() => {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }, this.animationDuration / 2);
  }

  teleportToRandomPosition(icon) {
    const maxLeft = window.innerWidth - 100;
    const maxTop = window.innerHeight - 100;
    
    const randomLeft = Math.random() * maxLeft + 20;
    const randomTop = Math.random() * maxTop + 20;
    
    icon.style.transition = 'opacity 200ms';
    icon.style.opacity = '0';
    
    setTimeout(() => {
      icon.style.left = randomLeft + 'px';
      icon.style.top = randomTop + 'px';
      icon.style.opacity = '1';
    }, 200);
  }
}

export const runawayIcon = new RunawayIcon();
