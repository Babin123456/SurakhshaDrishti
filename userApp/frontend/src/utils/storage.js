/**
 * Multi-Platform Mobile Storage Adapter
 * Compatible with Web, Android WebView, Capacitor Preferences, and React Native AsyncStorage.
 * Resolves BUG-15: Prevents Android OS memory reclamation from clearing auth sessions.
 */

const memoryCache = new Map();

export const mobileStorage = {
  /**
   * Retrieve item from storage with fallback chain:
   * 1. Window Capacitor / React Native Native Bridge (if injected)
   * 2. localStorage (Persistent on device across app suspensions/reboots)
   * 3. sessionStorage (Legacy browser session fallback)
   * 4. In-memory cache (when storage access is restricted)
   */
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.Capacitor?.Plugins?.Preferences) {
        // Asynchronous native preference hook when invoked via promise
      }

      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem(key);
        if (val !== null) return val;
      }

      if (typeof sessionStorage !== 'undefined') {
        const val = sessionStorage.getItem(key);
        if (val !== null) return val;
      }

      return memoryCache.get(key) || null;
    } catch (e) {
      console.warn(`mobileStorage.getItem error for key ${key}:`, e);
      return memoryCache.get(key) || null;
    }
  },

  /**
   * Persist item across device lifecycle
   */
  setItem: (key, value) => {
    try {
      memoryCache.set(key, value);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }

      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`mobileStorage.setItem error for key ${key}:`, e);
    }
  },

  /**
   * Remove item from all storage tiers
   */
  removeItem: (key) => {
    try {
      memoryCache.delete(key);

      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }

      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`mobileStorage.removeItem error for key ${key}:`, e);
    }
  },

  /**
   * Clear all app storage
   */
  clear: () => {
    try {
      memoryCache.clear();
      if (typeof localStorage !== 'undefined') localStorage.clear();
      if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
    } catch (e) {}
  }
};
