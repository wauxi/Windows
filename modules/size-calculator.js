/**
 * Centralized size calculation logic.
 * Eliminates duplicated measurement and scaling code.
 */

import { TV_CONFIG, MINESWEEPER_CONFIG, UI_DIMENSIONS } from './constants.js';
import { getIframeDocument } from './dom-helpers.js';
import { DOM_SELECTORS } from './constants.js';

/**
 * Measure container element with fallback strategy
 * @param {Element} container
 * @returns {Object} { width, height }
 */
function measureContainer(container) {
  if (!container) return { width: 0, height: 0 };

  try {
    const rect = container.getBoundingClientRect();
    const width = Math.max(
      Math.ceil(rect.width),
      container.scrollWidth || 0,
      container.offsetWidth || 0
    );
    const height = Math.max(
      Math.ceil(rect.height),
      container.scrollHeight || 0,
      container.offsetHeight || 0
    );
    return { width, height };
  } catch (e) {
    if (window.__DEV__) console.debug('size-calculator: measureContainer failed', e);
    return { width: 0, height: 0 };
  }
}

/**
 * Calculate TV/media player dimensions with scaling
 * @param {HTMLIFrameElement} iframe
 * @returns {Object} { windowWidth, windowHeight, iframeWidth, iframeHeight }
 */
export function calculateTVSize(iframe) {
  try {
    const doc = getIframeDocument(iframe);
    if (!doc) {
      return {
        windowWidth: TV_CONFIG.DEFAULT_WIDTH,
        windowHeight: TV_CONFIG.DEFAULT_HEIGHT,
        iframeWidth: TV_CONFIG.DEFAULT_WIDTH,
        iframeHeight: TV_CONFIG.DEFAULT_HEIGHT,
      };
    }

    const tvContainer = doc.querySelector(DOM_SELECTORS.TV_CONTAINER) ||
      doc.querySelector('#crtMain') ||
      doc.querySelector('main') ||
      doc.body;

    const { width: tvWidth, height: tvHeight } = measureContainer(tvContainer);

    const finalWidth = tvWidth || TV_CONFIG.DEFAULT_WIDTH;
    const finalHeight = tvHeight || TV_CONFIG.DEFAULT_HEIGHT;

    const contentW = finalWidth + TV_CONFIG.PADDING_BUFFER;
    const contentH = finalHeight + TV_CONFIG.PADDING_BUFFER;

    const maxW = Math.floor(window.innerWidth * TV_CONFIG.MAX_WIDTH_RATIO);
    const maxH = Math.floor(window.innerHeight * TV_CONFIG.MAX_HEIGHT_RATIO);

    const scale = Math.min(1, maxW / contentW, maxH / contentH);

    return {
      windowWidth: Math.round(contentW * scale),
      windowHeight: Math.round(contentH * scale),
      iframeWidth: Math.round(contentW * scale),
      iframeHeight: Math.round(contentH * scale),
    };
  } catch (err) {
    if (window.__DEV__) console.debug('size-calculator: calculateTVSize failed', err);
    return {
      windowWidth: TV_CONFIG.DEFAULT_WIDTH,
      windowHeight: TV_CONFIG.DEFAULT_HEIGHT,
      iframeWidth: TV_CONFIG.DEFAULT_WIDTH,
      iframeHeight: TV_CONFIG.DEFAULT_HEIGHT,
    };
  }
}

/**
 * Calculate Minesweeper dimensions
 * @param {HTMLIFrameElement} iframe
 * @returns {Object} { windowWidth, windowHeight }
 */
export function calculateMinesweeperSize(iframe) {
  try {
    const doc = getIframeDocument(iframe);
    if (!doc) {
      return {
        windowWidth: MINESWEEPER_CONFIG.DEFAULT_WIDTH,
        windowHeight: MINESWEEPER_CONFIG.DEFAULT_HEIGHT,
      };
    }

    const container = doc.querySelector(DOM_SELECTORS.MINESWEEPER_CONTAINER) || doc.body;
    const { width, height } = measureContainer(container);

    const containerWidth = width || MINESWEEPER_CONFIG.DEFAULT_WIDTH;
    const containerHeight = height || MINESWEEPER_CONFIG.DEFAULT_HEIGHT;

    const windowW = containerWidth + UI_DIMENSIONS.WINDOW_PADDING;
    const windowH = containerHeight + UI_DIMENSIONS.WINDOW_HEADER_HEIGHT + UI_DIMENSIONS.WINDOW_PADDING;

    const maxW = Math.floor(window.innerWidth * MINESWEEPER_CONFIG.MAX_WIDTH_RATIO);
    const maxH = Math.floor(window.innerHeight * MINESWEEPER_CONFIG.MAX_HEIGHT_RATIO);

    return {
      windowWidth: Math.min(windowW, maxW),
      windowHeight: Math.min(windowH, maxH),
    };
  } catch (err) {
    if (window.__DEV__) console.debug('size-calculator: calculateMinesweeperSize failed', err);
    return {
      windowWidth: MINESWEEPER_CONFIG.DEFAULT_WIDTH,
      windowHeight: MINESWEEPER_CONFIG.DEFAULT_HEIGHT,
    };
  }
}
