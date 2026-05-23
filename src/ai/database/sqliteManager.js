/**
 * SQLite Manager
 * Manages SQLite database for AI chat history and insights cache
 * Uses Capacitor SQLite plugin for mobile support
 */

import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

export class SQLiteManager {
  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.db = null;
    this.dbName = 'ai_assistant.db';
    this.isInitialized = false;
  }

  /**
   * Initialize database
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      this.db = await this.sqlite.createConnection({
        database: this.dbName,
        version: 1,
        encryption: false
      });

      await this.openDatabase();
      await this.createTables();
      this.isInitialized = true;
      
      console.log('SQLite database initialized successfully');
    } catch (error) {
      console.error('Error initializing SQLite database:', error);
      // Fallback to IndexedDB if SQLite fails
      this.useIndexedDBFallback();
    }
  }

  /**
   * Open database connection
   */
  async openDatabase() {
    if (!this.db) return;
    await this.db.open();
  }

  /**
   * Close database connection
   */
  async closeDatabase() {
    if (!this.db) return;
    await this.db.close();
  }

  /**
   * Create database tables
   */
  async createTables() {
    if (!this.db) return;

    const queries = [
      // Chat history table
      `CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_type TEXT NOT NULL,
        text TEXT NOT NULL,
        intent TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        context_data TEXT
      )`,

      // Insights cache table
      `CREATE TABLE IF NOT EXISTS insights_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        insight_type TEXT NOT NULL,
        insight_data TEXT NOT NULL,
        generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME
      )`,

      // User preferences table
      `CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        preference_key TEXT UNIQUE NOT NULL,
        preference_value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Analytics cache table
      `CREATE TABLE IF NOT EXISTS analytics_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cache_key TEXT UNIQUE NOT NULL,
        cache_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME
      )`,

      // Create indexes for better performance
      `CREATE INDEX IF NOT EXISTS idx_chat_history_timestamp ON chat_history(timestamp)`,
      `CREATE INDEX IF NOT EXISTS idx_insights_cache_type ON insights_cache(insight_type)`,
      `CREATE INDEX IF NOT EXISTS idx_analytics_cache_key ON analytics_cache(cache_key)`,
      `CREATE INDEX IF NOT EXISTS idx_insights_cache_expires ON insights_cache(expires_at)`
    ];

    for (const query of queries) {
      await this.db.execute(query);
    }
  }

  /**
   * Add message to chat history
   */
  async addMessage(message) {
    if (!this.db) return null;

    try {
      const query = `
        INSERT INTO chat_history (message_type, text, intent, context_data)
        VALUES (?, ?, ?, ?)
      `;
      
      const contextData = JSON.stringify(message.context || {});
      const result = await this.db.run(query, [
        message.type,
        message.text,
        message.intent || null,
        contextData
      ]);

      return result.changes.lastId;
    } catch (error) {
      console.error('Error adding message to chat history:', error);
      return null;
    }
  }

  /**
   * Get chat history
   */
  async getChatHistory(limit = 50) {
    if (!this.db) return [];

    try {
      const query = `
        SELECT * FROM chat_history
        ORDER BY timestamp DESC
        LIMIT ?
      `;
      
      const result = await this.db.query(query, [limit]);
      return result.values || [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  /**
   * Clear chat history
   */
  async clearChatHistory() {
    if (!this.db) return;

    try {
      const query = 'DELETE FROM chat_history';
      await this.db.execute(query);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }

  /**
   * Cache insight
   */
  async cacheInsight(insightType, insightData, ttlHours = 24) {
    if (!this.db) return;

    try {
      const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
      const query = `
        INSERT OR REPLACE INTO insights_cache (insight_type, insight_data, expires_at)
        VALUES (?, ?, ?)
      `;
      
      await this.db.run(query, [
        insightType,
        JSON.stringify(insightData),
        expiresAt
      ]);
    } catch (error) {
      console.error('Error caching insight:', error);
    }
  }

  /**
   * Get cached insight
   */
  async getCachedInsight(insightType) {
    if (!this.db) return null;

    try {
      const query = `
        SELECT insight_data, expires_at FROM insights_cache
        WHERE insight_type = ? AND expires_at > datetime('now')
        ORDER BY generated_at DESC
        LIMIT 1
      `;
      
      const result = await this.db.query(query, [insightType]);
      
      if (result.values && result.values.length > 0) {
        return JSON.parse(result.values[0].insight_data);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached insight:', error);
      return null;
    }
  }

  /**
   * Clear expired insights
   */
  async clearExpiredInsights() {
    if (!this.db) return;

    try {
      const query = `
        DELETE FROM insights_cache
        WHERE expires_at < datetime('now')
      `;
      await this.db.execute(query);
    } catch (error) {
      console.error('Error clearing expired insights:', error);
    }
  }

  /**
   * Set user preference
   */
  async setPreference(key, value) {
    if (!this.db) return;

    try {
      const query = `
        INSERT OR REPLACE INTO user_preferences (preference_key, preference_value)
        VALUES (?, ?)
      `;
      
      await this.db.run(query, [key, JSON.stringify(value)]);
    } catch (error) {
      console.error('Error setting preference:', error);
    }
  }

  /**
   * Get user preference
   */
  async getPreference(key) {
    if (!this.db) return null;

    try {
      const query = `
        SELECT preference_value FROM user_preferences
        WHERE preference_key = ?
      `;
      
      const result = await this.db.query(query, [key]);
      
      if (result.values && result.values.length > 0) {
        return JSON.parse(result.values[0].preference_value);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting preference:', error);
      return null;
    }
  }

  /**
   * Cache analytics data
   */
  async cacheAnalytics(cacheKey, data, ttlHours = 1) {
    if (!this.db) return;

    try {
      const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
      const query = `
        INSERT OR REPLACE INTO analytics_cache (cache_key, cache_data, expires_at)
        VALUES (?, ?, ?)
      `;
      
      await this.db.run(query, [
        cacheKey,
        JSON.stringify(data),
        expiresAt
      ]);
    } catch (error) {
      console.error('Error caching analytics:', error);
    }
  }

  /**
   * Get cached analytics
   */
  async getCachedAnalytics(cacheKey) {
    if (!this.db) return null;

    try {
      const query = `
        SELECT cache_data, expires_at FROM analytics_cache
        WHERE cache_key = ? AND expires_at > datetime('now')
        LIMIT 1
      `;
      
      const result = await this.db.query(query, [cacheKey]);
      
      if (result.values && result.values.length > 0) {
        return JSON.parse(result.values[0].cache_data);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached analytics:', error);
      return null;
    }
  }

  /**
   * Clear all caches
   */
  async clearAllCaches() {
    if (!this.db) return;

    try {
      await this.db.execute('DELETE FROM insights_cache');
      await this.db.execute('DELETE FROM analytics_cache');
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }

  /**
   * Get database stats
   */
  async getDatabaseStats() {
    if (!this.db) return null;

    try {
      const chatCount = await this.db.query('SELECT COUNT(*) as count FROM chat_history');
      const insightsCount = await this.db.query('SELECT COUNT(*) as count FROM insights_cache');
      const analyticsCount = await this.db.query('SELECT COUNT(*) as count FROM analytics_cache');

      return {
        chatHistoryCount: chatCount.values[0].count,
        insightsCacheCount: insightsCount.values[0].count,
        analyticsCacheCount: analyticsCount.values[0].count
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return null;
    }
  }

  /**
   * IndexedDB fallback for web platforms
   */
  useIndexedDBFallback() {
    console.log('Using IndexedDB fallback');
    this.isIndexedDB = true;
    // IndexedDB implementation would go here
  }

  /**
   * Export database
   */
  async exportDatabase() {
    if (!this.db) return null;

    try {
      const chatHistory = await this.getChatHistory(1000);
      const insights = await this.db.query('SELECT * FROM insights_cache');
      const preferences = await this.db.query('SELECT * FROM user_preferences');

      return {
        chatHistory: chatHistory.values || [],
        insights: insights.values || [],
        preferences: preferences.values || [],
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting database:', error);
      return null;
    }
  }

  /**
   * Import database
   */
  async importDatabase(data) {
    if (!this.db || !data) return;

    try {
      // Clear existing data
      await this.clearChatHistory();
      await this.db.execute('DELETE FROM insights_cache');
      await this.db.execute('DELETE FROM user_preferences');

      // Import chat history
      if (data.chatHistory) {
        for (const message of data.chatHistory) {
          await this.addMessage(message);
        }
      }

      // Import insights
      if (data.insights) {
        for (const insight of data.insights) {
          await this.cacheInsight(insight.insight_type, JSON.parse(insight.insight_data));
        }
      }

      // Import preferences
      if (data.preferences) {
        for (const pref of data.preferences) {
          await this.setPreference(pref.preference_key, JSON.parse(pref.preference_value));
        }
      }

      console.log('Database imported successfully');
    } catch (error) {
      console.error('Error importing database:', error);
    }
  }

  /**
   * Close and cleanup
   */
  async cleanup() {
    if (this.db) {
      await this.closeDatabase();
      await this.sqlite.closeConnection({ database: this.dbName });
      this.db = null;
      this.isInitialized = false;
    }
  }
}

export default SQLiteManager;
