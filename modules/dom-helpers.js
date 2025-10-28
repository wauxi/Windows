// DOM Utilities and Element Metadata Storage
// Centralized storage for DOM element metadata using WeakMap
// Prevents polluting DOM elements with custom properties

const elementMetadata = new WeakMap();

// DOM Query Functions
export function getIframeDocument(iframe) {
  try {
    if (!iframe) return null;
    return iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document) || null;
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-helpers: getIframeDocument failed', e);
    return null;
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
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-helpers: safeObserveResizeInIframe failed', e);
    return null;
  }
}

export function safeObserveMutationsInIframe(iframe, targetSelector, cb, options = { childList: true, subtree: true }) {
  try {
    const doc = getIframeDocument(iframe);
    if (!doc) return null;
    const target = doc.querySelector(targetSelector);
    if (!target) return null;
    const ObserverCtor = iframe.contentWindow && iframe.contentWindow.MutationObserver;
    if (!ObserverCtor) return null;
    const observer = new ObserverCtor(cb);
    observer.observe(target, options);
    return observer;
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-helpers: safeObserveMutationsInIframe failed', e);
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
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-helpers: measureElement failed', e);
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
    if (typeof window !== 'undefined' && window.__DEV__) console.debug('dom-helpers: centerWindowState failed', e);
  }
}

// Element Metadata Functions
export function getMeta(el, key = undefined, defaultValue = undefined) {
  if (!el) {
    return key !== undefined ? defaultValue : null;
  }
  
  if (key === undefined) {
    if (!elementMetadata.has(el)) {
      elementMetadata.set(el, {});
    }
    return elementMetadata.get(el);
  }
  
  const meta = elementMetadata.get(el);
  if (!meta) return defaultValue;
  return key in meta ? meta[key] : defaultValue;
}

export function setMeta(el, key, value) {
  if (!el) return;
  const meta = getMeta(el);
  if (meta) meta[key] = value;
}

export function hasMeta(el, key) {
  if (!el) return false;
  const meta = elementMetadata.get(el);
  return meta && key in meta;
}

export function deleteMeta(el, key) {
  if (!el) return;
  const meta = elementMetadata.get(el);
  if (meta) delete meta[key];
}

export function clearMeta(el) {
  if (!el) return;
  elementMetadata.delete(el);
}

// Iframe Observer Helpers
export function getIframeObserver(iframe) {
  return getMeta(iframe, 'observer', null);
}

export function setIframeObserver(iframe, observer) {
  setMeta(iframe, 'observer', observer);
}

export function clearIframeObserver(iframe) {
  if (!iframe) return;
  const observer = getIframeObserver(iframe);
  if (observer) {
    try {
      observer.disconnect();
    } catch (e) {
      if (window.__DEV__) console.debug('dom-helpers: observer disconnect failed', e);
    }
  }
  deleteMeta(iframe, 'observer');
}

// TV Size Helpers
export function getTVComputedSizes(iframe) {
  if (!iframe) return null;
  const meta = elementMetadata.get(iframe);
  if (!meta || !meta.tvSizes) return null;
  return meta.tvSizes;
}

export function setTVComputedSizes(iframe, sizes) {
  if (!iframe) return;
  setMeta(iframe, 'tvSizes', sizes);
}

export function clearTVComputedSizes(iframe) {
  if (!iframe) return;
  deleteMeta(iframe, 'tvSizes');
}
