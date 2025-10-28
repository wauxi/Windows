/**
 * Centralized lifecycle management for timers and event listeners.
 * Prevents memory leaks by tracking all timers and listeners for cleanup.
 */

class LifecycleManager {
  constructor() {
    this.timers = new Set();
    this.listeners = new Map(); // Map<element, Map<eventType, Set<handlers>>>
  }

  /**
   * Create a timer that can be cleaned up later
   * @param {Function} callback
   * @param {number} delay
   * @returns {number} timerId
   */
  setTimeout(callback, delay) {
    const timerId = window.setTimeout(() => {
      this.timers.delete(timerId);
      callback();
    }, delay);
    this.timers.add(timerId);
    return timerId;
  }

  /**
   * Create an interval that can be cleaned up later
   * @param {Function} callback
   * @param {number} interval
   * @returns {number} intervalId
   */
  setInterval(callback, interval) {
    const intervalId = window.setInterval(callback, interval);
    this.timers.add(intervalId);
    return intervalId;
  }

  /**
   * Add event listener with automatic cleanup tracking
   * @param {Element} element
   * @param {string} eventType
   * @param {Function} handler
   * @param {Object} options
   */
  addEventListener(element, eventType, handler, options = {}) {
    if (!element) return;

    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }

    const eventMap = this.listeners.get(element);
    if (!eventMap.has(eventType)) {
      eventMap.set(eventType, new Set());
    }

    const handlerSet = eventMap.get(eventType);
    handlerSet.add({ handler, options });

    element.addEventListener(eventType, handler, options);
  }

  /**
   * Clear all timers
   */
  clearTimers() {
    this.timers.forEach(timerId => {
      window.clearTimeout(timerId);
      window.clearInterval(timerId);
    });
    this.timers.clear();
  }

  /**
   * Clear all event listeners
   */
  clearListeners() {
    this.listeners.forEach((eventMap, element) => {
      eventMap.forEach((handlerSet, eventType) => {
        handlerSet.forEach(({ handler, options }) => {
          element.removeEventListener(eventType, handler, options);
        });
      });
    });
    this.listeners.clear();
  }

  /**
   * Clear everything
   */
  dispose() {
    this.clearTimers();
    this.clearListeners();
  }
}

export const lifecycleManager = new LifecycleManager();
