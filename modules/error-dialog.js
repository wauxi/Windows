import { UI_DIMENSIONS } from './constants.js';

class ErrorDialog {
  constructor() {
    this.currentDialog = null;
    this.dragOffset = { x: 0, y: 0 };
    this.isDragging = false;
    this.loadStyles();
  }

  loadStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'modules/error-dialog.css';
    document.head.appendChild(link);
  }

  createErrorIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('width', '32');
    svg.setAttribute('height', '32');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '16');
    circle.setAttribute('cy', '16');
    circle.setAttribute('r', '14');
    circle.setAttribute('fill', '#ff0000');
    circle.setAttribute('stroke', '#800000');
    circle.setAttribute('stroke-width', '1');
    
    const xPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    xPath.setAttribute('d', 'M 10 10 L 22 22 M 22 10 L 10 22');
    xPath.setAttribute('stroke', 'white');
    xPath.setAttribute('stroke-width', '2.5');
    xPath.setAttribute('stroke-linecap', 'round');
    xPath.setAttribute('stroke-linejoin', 'round');
    
    svg.appendChild(circle);
    svg.appendChild(xPath);
    return svg;
  }

  show(options = {}) {
    if (this.currentDialog) {
      this.currentDialog.remove();
    }

    const {
      title = 'Ошибка',
      message = 'Операция не может быть выполнена',
      x = window.innerWidth / 2,
      y = window.innerHeight / 2
    } = options;

    const dialog = document.createElement('div');
    dialog.className = 'error-dialog';
  dialog.style.left = (x - UI_DIMENSIONS.ERROR_DIALOG_OFFSET_X) + 'px';
  dialog.style.top = (y - UI_DIMENSIONS.ERROR_DIALOG_OFFSET_Y) + 'px';

    const header = document.createElement('div');
    header.className = 'error-dialog-header';

    const titleSpan = document.createElement('div');
    titleSpan.className = 'error-dialog-title';
    titleSpan.textContent = title;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'error-dialog-close';
    closeBtn.textContent = '×';
    closeBtn.onmousedown = (e) => e.preventDefault();
    closeBtn.onclick = () => this.close();

    header.appendChild(titleSpan);
    header.appendChild(closeBtn);

    const content = document.createElement('div');
    content.className = 'error-dialog-content';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'error-dialog-icon';
    iconDiv.appendChild(this.createErrorIcon());

    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-dialog-message';

    const titleText = document.createElement('div');
    titleText.className = 'error-dialog-title-text';
    titleText.textContent = 'Нет доступа';

    const messageText = document.createElement('div');
    messageText.className = 'error-dialog-text';
    messageText.textContent = message;

    messageDiv.appendChild(titleText);
    messageDiv.appendChild(messageText);

    content.appendChild(iconDiv);
    content.appendChild(messageDiv);

    const buttons = document.createElement('div');
    buttons.className = 'error-dialog-buttons';

    const okBtn = document.createElement('button');
    okBtn.className = 'error-dialog-btn';
    okBtn.textContent = 'OK';
    okBtn.onclick = () => this.close();

    buttons.appendChild(okBtn);

    dialog.appendChild(header);
    dialog.appendChild(content);
    dialog.appendChild(buttons);

    document.body.appendChild(dialog);
    this.currentDialog = dialog;

    this.setupDragging(dialog, header);

    okBtn.focus();
  }

  setupDragging(dialog, header) {
    header.addEventListener('mousedown', (e) => {
      if (e.target === header || e.target.closest('.error-dialog-title')) {
        this.isDragging = true;
        this.dragOffset.x = e.clientX - dialog.offsetLeft;
        this.dragOffset.y = e.clientY - dialog.offsetTop;
        dialog.classList.add('dragging');
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging && this.currentDialog === dialog) {
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;

        const maxX = window.innerWidth - dialog.offsetWidth;
        const maxY = window.innerHeight - dialog.offsetHeight;

        dialog.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        dialog.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        dialog.classList.remove('dragging');
      }
    });
  }

  close() {
    if (this.currentDialog) {
      this.currentDialog.remove();
      this.currentDialog = null;
    }
    this.isDragging = false;
  }
}

export const errorDialog = new ErrorDialog();
