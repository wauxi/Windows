function scatterIcons() {
  const desktop = document.getElementById('desktop');
  const icons = desktop.querySelectorAll('.icon');
  const iconSize = 90;
  const margin = 60;
  const spacing = 140;
  const placed = [];

  const maxX = desktop.clientWidth - iconSize - margin;
  const maxY = desktop.clientHeight - iconSize - margin;

  icons.forEach(icon => {
    let x, y;
    let tries = 0;
    const maxTries = 200;

    do {
      x = margin + Math.random() * (maxX - margin);
      y = margin + Math.random() * (maxY - margin);
      tries++;

      var overlap = placed.some(p => {
        const dx = p.x - x;
        const dy = p.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < spacing;
      });
    } while (overlap && tries < maxTries);

    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;
    placed.push({ x, y });

    icon.style.opacity = 0;
    setTimeout(() => {
      icon.style.transition = 'opacity 0.8s ease';
      icon.style.opacity = 1;
    }, Math.random() * 800);
  });
}

window.addEventListener('load', scatterIcons);
