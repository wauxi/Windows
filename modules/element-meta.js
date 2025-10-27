/**
 * element-meta.js
 * Centralized storage for DOM element metadata using WeakMap.
 * Prevents polluting DOM elements with custom properties.
 * Allows automatic garbage collection when elements are removed.
 */

const elementMetadata = new WeakMap();

/**
 * Get metadata object for an element. Creates empty object if not exists.
 * Optionally get a specific property by key.
 * @param {HTMLElement} el
 * @param {string} key - optional property key
 * @param {*} defaultValue - optional default if key not found
 * @returns {Object|*}
 */
export function getMeta(el, key = undefined, defaultValue = undefined) {
  if (!el) {
    return key !== undefined ? defaultValue : null;
  }
  
  // If no key specified, return entire metadata object
  if (key === undefined) {
    if (!elementMetadata.has(el)) {
      elementMetadata.set(el, {});
    }
    return elementMetadata.get(el);
  }
  
  // If key specified, return specific property
  const meta = elementMetadata.get(el);
  if (!meta) return defaultValue;
  return key in meta ? meta[key] : defaultValue;
}

/**
 * Set a metadata property on an element.
 * @param {HTMLElement} el
 * @param {string} key
 * @param {*} value
 */
export function setMeta(el, key, value) {
  if (!el) return;
  const meta = getMeta(el);
  if (meta) meta[key] = value;
}

/**
 * Check if a metadata property exists.
 * @param {HTMLElement} el
 * @param {string} key
 * @returns {boolean}
 */
export function hasMeta(el, key) {
  if (!el) return false;
  const meta = elementMetadata.get(el);
  return meta && key in meta;
}

/**
 * Delete a metadata property from an element.
 * @param {HTMLElement} el
 * @param {string} key
 */
export function deleteMeta(el, key) {
  if (!el) return;
  const meta = elementMetadata.get(el);
  if (meta) delete meta[key];
}

/**
 * Clear all metadata for an element (optional explicit cleanup).
 * @param {HTMLElement} el
 */
export function clearMeta(el) {
  if (!el) return;
  elementMetadata.delete(el);
}

/**
 * Get or create observer for iframe (ResizeObserver, etc).
 * Useful shorthand for common pattern.
 * @param {HTMLIFrameElement} iframe
 * @returns {ResizeObserver | null}
 */
export function getIframeObserver(iframe) {
  return getMeta(iframe, 'observer', null);
}

/**
 * Set observer for iframe.
 * @param {HTMLIFrameElement} iframe
 * @param {ResizeObserver} observer
 */
export function setIframeObserver(iframe, observer) {
  setMeta(iframe, 'observer', observer);
}

/**
 * Safely disconnect and clear observer from iframe.
 * @param {HTMLIFrameElement} iframe
 */
export function clearIframeObserver(iframe) {
  if (!iframe) return;
  const observer = getIframeObserver(iframe);
  if (observer) {
    try {
      observer.disconnect();
    } catch (e) {
      if (window.__DEV__) console.debug('element-meta: observer disconnect failed', e);
    }
  }
  deleteMeta(iframe, 'observer');
}

/**
 * Get computed TV/media player sizes stored in metadata.
 * @param {HTMLIFrameElement} iframe
 * @returns {Object | null} { computedWidth, computedHeight, computedScale, contentW, contentH }
 */
export function getTVComputedSizes(iframe) {
  if (!iframe) return null;
  const meta = elementMetadata.get(iframe);
  if (!meta || !meta.tvSizes) return null;
  return meta.tvSizes;
}

/**
 * Set computed TV/media player sizes in metadata.
 * @param {HTMLIFrameElement} iframe
 * @param {Object} sizes - { computedWidth, computedHeight, computedScale, contentW, contentH }
 */
export function setTVComputedSizes(iframe, sizes) {
  if (!iframe) return;
  setMeta(iframe, 'tvSizes', sizes);
}

/**
 * Clear computed sizes.
 * @param {HTMLIFrameElement} iframe
 */
export function clearTVComputedSizes(iframe) {
  if (!iframe) return;
  deleteMeta(iframe, 'tvSizes');
}
