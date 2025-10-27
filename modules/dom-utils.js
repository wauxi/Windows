export function getIframeDocument(iframe) {
  try {
    if (!iframe) return null;
    return iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document) || null;
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-utils: getIframeDocument failed', e);
    return null;
  }
}

export function disableScrollOnDocument(doc = document) {
  if (!doc) return;
  try {
    const de = doc.documentElement;
    const body = doc.body;
    if (de) {
      de.style.overflow = 'hidden';
      de.style.overflowX = 'hidden';
      de.style.overflowY = 'hidden';
    }
    if (body) {
      body.style.overflow = 'hidden';
      body.style.overflowX = 'hidden';
      body.style.overflowY = 'hidden';
    }
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-utils: disableScrollOnDocument failed', e);
  }
}

export function enableScrollOnDocument(doc = document) {
  if (!doc) return;
  try {
    const de = doc.documentElement;
    const body = doc.body;
    if (de) {
      de.style.overflow = '';
      de.style.overflowX = '';
      de.style.overflowY = '';
    }
    if (body) {
      body.style.overflow = '';
      body.style.overflowX = '';
      body.style.overflowY = '';
    }
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-utils: enableScrollOnDocument failed', e);
  }
}

export function safeObserveResizeInIframe(iframe, containerSelector, cb) {
  try {
    const doc = getIframeDocument(iframe);
    if (!doc) return null;
    const container = doc.querySelector(containerSelector) || doc.body;
    if (!container) return null;
    const ObserverCtor = iframe.contentWindow && iframe.contentWindow.ResizeObserver;
    if (!ObserverCtor) return null;
    const observer = new ObserverCtor(cb);
    observer.observe(container);
    return observer;
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-utils: safeObserveResizeInIframe failed', e);
    return null;
  }
}

export function measureElement(el) {
  if (!el) return { width: 0, height: 0 };
  try {
    if (el.tagName && el.tagName.toLowerCase() === 'iframe') {
      const doc = getIframeDocument(el);
      const container = doc && (doc.querySelector('.crt-container') || doc.querySelector('main') || doc.body);
      if (container) {
        const r = container.getBoundingClientRect();
        return { width: Math.ceil(r.width), height: Math.ceil(r.height) };
      }
    }

    const rect = el.getBoundingClientRect();
    return { width: Math.ceil(rect.width), height: Math.ceil(rect.height) };
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-utils: measureElement failed', e);
    return { width: 0, height: 0 };
  }
}

export function centerWindowState(winState, useTransform = true) {
  if (!winState) return;
  try {
    if (useTransform && typeof winState.setPosition === 'function' && typeof winState.setTransform === 'function') {
      winState.setPosition('50%', '50%');
      winState.setTransform('translate(-50%, -50%)');
      return;
    }

    const el = winState.appWindow || (winState.windowElement && winState.windowElement.nodeType ? winState.windowElement : null);
    if (!el) return;
    const w = el.offsetWidth || el.getBoundingClientRect().width;
    const h = el.offsetHeight || el.getBoundingClientRect().height;
    const left = Math.max(0, Math.round((window.innerWidth - w) / 2)) + 'px';
    const top = Math.max(0, Math.round((window.innerHeight - h) / 2)) + 'px';
    if (typeof winState.setPosition === 'function') winState.setPosition(left, top);
    if (typeof winState.setTransform === 'function') winState.setTransform('none');
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-utils: centerWindowState failed', e);
  }
}
