/**
 * Insights Cache Manager
 * Caches financial insights with TTL
 */

export class InsightsCacheManager {
  constructor(defaultTTL = 3600000) { // 1 hour default TTL
    this.defaultTTL = defaultTTL;
    this.cache = new Map();
    this.storageKey = 'ai-insights-cache';
    this.loadFromStorage();
  }

  /**
   * Load cache from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        // Restore cache with expiration checking
        Object.entries(data).forEach(([key, value]) => {
          if (value.expiresAt > Date.now()) {
            this.cache.set(key, value);
          }
        });
      }
    } catch (error) {
      console.error('Error loading insights cache:', error);
      this.cache.clear();
    }
  }

  /**
   * Save cache to localStorage
   */
  saveToStorage() {
    try {
      const data = {};
      this.cache.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving insights cache:', error);
    }
  }

  /**
   * Generate cache key
   */
  generateKey(type, params = {}) {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return `${type}:${paramString}`;
  }

  /**
   * Set insight in cache
   */
  setInsight(type, data, params = {}, ttl = this.defaultTTL) {
    const key = this.generateKey(type, params);
    const expiresAt = Date.now() + ttl;

    this.cache.set(key, {
      type,
      data,
      params,
      expiresAt,
      createdAt: Date.now()
    });

    this.saveToStorage();
  }

  /**
   * Get insight from cache
   */
  getInsight(type, params = {}) {
    const key = this.generateKey(type, params);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Check if expired
    if (cached.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    return cached.data;
  }

  /**
   * Check if insight is cached
   */
  hasInsight(type, params = {}) {
    const key = this.generateKey(type, params);
    const cached = this.cache.get(key);

    if (!cached) return false;

    // Check if expired
    if (cached.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  /**
   * Clear specific insight from cache
   */
  clearInsight(type, params = {}) {
    const key = this.generateKey(type, params);
    this.cache.delete(key);
    this.saveToStorage();
  }

  /**
   * Clear all insights of a type
   */
  clearType(type) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${type}:`)) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }

  /**
   * Clear expired insights
   */
  clearExpired() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expiresAt < now) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.cache.clear();
    this.saveToStorage();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let total = 0;
    let expired = 0;
    let byType = {};

    for (const [key, value] of this.cache.entries()) {
      total++;
      if (value.expiresAt < now) {
        expired++;
      }

      const type = key.split(':')[0];
      byType[type] = (byType[type] || 0) + 1;
    }

    return {
      total,
      expired,
      active: total - expired,
      byType,
      size: JSON.stringify(Object.fromEntries(this.cache)).length
    };
  }

  /**
   * Get cache size in bytes
   */
  getSize() {
    return JSON.stringify(Object.fromEntries(this.cache)).length;
  }

  /**
   * Export cache
   */
  exportCache() {
    return {
      cache: Object.fromEntries(this.cache),
      stats: this.getStats(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Import cache
   */
  importCache(data) {
    if (data && data.cache) {
      this.cache = new Map(Object.entries(data.cache));
      this.clearExpired();
      this.saveToStorage();
    }
  }
}

export default InsightsCacheManager;
