const desktop = document.getElementById('desktop');
const appWindow = document.getElementById('app-window');
const windowTitle = document.getElementById('window-title');
const windowContent = document.getElementById('window-content');
const closeBtn = document.getElementById('close-window');

let zIndex = 1;

let isDragging = false;
let offsetX, offsetY;
const header = appWindow.querySelector('.window-header');

header.addEventListener('mousedown', (e) => {
  if (e.target === closeBtn) {
    return;
  }
  isDragging = true;
  
  if (appWindow.style.transform && appWindow.style.transform !== 'none') {
    const rect = appWindow.getBoundingClientRect();
    appWindow.style.left = rect.left + 'px';
    appWindow.style.top = rect.top + 'px';
    appWindow.style.transform = 'none';
  }
  
  offsetX = e.clientX - appWindow.offsetLeft;
  offsetY = e.clientY - appWindow.offsetTop;
  appWindow.style.zIndex = ++zIndex;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    appWindow.style.left = e.clientX - offsetX + 'px';
    appWindow.style.top = e.clientY - offsetY + 'px';
  }
});

closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  appWindow.style.display = 'none';
  appWindow.style.transform = '';
  windowContent.innerHTML = '';
});

desktop.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('dblclick', () => {
    const appName = icon.dataset.app; 
    openApp(appName);
  });
});

function openApp(appName) {
  windowTitle.textContent = appName;
  appWindow.style.display = 'block';
  appWindow.style.zIndex = ++zIndex;
  
  appWindow.style.left = '50%';
  appWindow.style.top = '50%';
  appWindow.style.transform = 'translate(-50%, -50%)';

  windowContent.innerHTML = `
    <iframe 
      src="apps/${appName}/index.html" 
      frameborder="0" 
      width="100%" 
      height="100%"
      style="border: none;">
    </iframe>
  `;
}
