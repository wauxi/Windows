// Получаем элементы
const desktop = document.getElementById('desktop');
const appWindow = document.getElementById('app-window');
const windowTitle = document.getElementById('window-title');
const windowContent = document.getElementById('window-content');
const closeBtn = document.getElementById('close-window');

let zIndex = 1;

// DRAG & DROP для окна
let isDragging = false;
let offsetX, offsetY;
const header = appWindow.querySelector('.window-header');

header.addEventListener('mousedown', (e) => {
  isDragging = true;
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

// Закрытие окна
closeBtn.addEventListener('click', () => {
  appWindow.style.display = 'none';
  windowContent.innerHTML = '';
});

// Открытие конкретного приложения
desktop.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('dblclick', () => {
    const appName = icon.dataset.app; // имя приложения из data-app
    openApp(appName);
  });
});

// Функция открытия окна с приложением
function openApp(appName) {
  windowTitle.textContent = appName;
  appWindow.style.display = 'block';
  appWindow.style.zIndex = ++zIndex;

  // Загружаем конкретное приложение в iframe
  windowContent.innerHTML = `
    <iframe 
      src="apps/${appName}/index.html" 
      frameborder="0" 
      width="100%" 
      height="100%">
    </iframe>
  `;
}
