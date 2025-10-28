/**
 * Centralized iframe styling utilities.
 * Eliminates duplicated style assignments across the codebase.
 */

/**
 * Apply iframe styles for the given context
 * @param {HTMLIFrameElement} iframe
 * @param {string} context - 'memories_player', 'minesweeper', 'photobooth', etc.
 */
export function applyIframeStyles(iframe, context = 'default') {
  if (!iframe) return;

  // Common styles for all iframes
  const commonStyles = {
    border: 'none',
    outline: 'none',
    display: 'block',
    width: '100%',
    height: '100%',
  };

  // Context-specific styles
  const contextStyles = {
    memories_player: {
      ...commonStyles,
      overflow: 'hidden',
      overflowX: 'hidden',
      overflowY: 'hidden',
    },
    minesweeper: {
      ...commonStyles,
      overflow: 'auto',
    },
    photobooth: {
      ...commonStyles,
      overflow: 'hidden',
    },
    default: commonStyles,
  };

  const styles = contextStyles[context] || contextStyles.default;

  Object.assign(iframe.style, styles);

  if (context === 'memories_player' || context === 'minesweeper') {
    iframe.setAttribute('scrolling', 'no');
  }
}

/**
 * Apply styles to hide scrolling on document
 * @param {Document} doc
 */
export function hideDocumentScroll(doc = document) {
  if (!doc) return;
  try {
    const de = doc.documentElement;
    const body = doc.body;

    const scrollHideStyles = {
      overflow: 'hidden',
      overflowX: 'hidden',
      overflowY: 'hidden',
    };

    if (de) Object.assign(de.style, scrollHideStyles);
    if (body) Object.assign(body.style, scrollHideStyles);
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) {
      console.debug('iframe-styles: hideDocumentScroll failed', e);
    }
  }
}

/**
 * Apply styles to show scrolling on document
 * @param {Document} doc
 */
export function showDocumentScroll(doc = document) {
  if (!doc) return;
  try {
    const de = doc.documentElement;
    const body = doc.body;

    const scrollShowStyles = {
      overflow: '',
      overflowX: '',
      overflowY: '',
    };

    if (de) Object.assign(de.style, scrollShowStyles);
    if (body) Object.assign(body.style, scrollShowStyles);
  } catch (e) {
    if (typeof window !== 'undefined' && window.__DEV__) {
      console.debug('iframe-styles: showDocumentScroll failed', e);
    }
  }
}

/**
 * Set iframe to hidden state (used before measuring)
 * @param {HTMLIFrameElement} iframe
 */
export function hideIframe(iframe) {
  if (!iframe) return;
  iframe.style.visibility = 'hidden';
  iframe.style.position = 'absolute';
  iframe.style.pointerEvents = 'none';
}

/**
 * Set iframe to visible state
 * @param {HTMLIFrameElement} iframe
 */
export function showIframe(iframe) {
  if (!iframe) return;
  iframe.style.visibility = 'visible';
  iframe.style.position = 'static';
  iframe.style.pointerEvents = 'auto';
}
