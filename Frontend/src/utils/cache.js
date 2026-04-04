/**
 * API Response Caching Utility
 * Using localStorage with TTL (Time-To-Live).
 */

const CACHE_PREFIX = "shikshasetu_cache_";

/**
 * Save data to cache with an expiration time.
 * @param {string} key - Unique key for the cache entry.
 * @param {any} data - The data to store.
 * @param {number} ttlMinutes - How long the cache should be valid in minutes.
 */
export const setCache = (key, data, ttlMinutes = 60) => {
  const expiry = Date.now() + ttlMinutes * 60 * 1000;
  const cacheEntry = {
    data,
    expiry,
  };
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
};

/**
 * Retrieve data from cache if it has not expired.
 * @param {string} key - Unique key for the cache entry.
 * @returns {any|null} The cached data or null if not found or expired.
 */
export const getCache = (key) => {
  const raw = localStorage.getItem(CACHE_PREFIX + key);
  if (!raw) return null;

  try {
    const { data, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error parsing cache entry:", error);
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }
};

/**
 * Manually invalidate a specific cache entry.
 * @param {string} key - Unique key for the cache entry.
 */
export const invalidateCache = (key) => {
  localStorage.removeItem(CACHE_PREFIX + key);
};

/**
 * Clear all ShikshaSetu API cache entries.
 */
export const clearCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};
