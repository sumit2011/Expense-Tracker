/**
 * Context Memory System
 * Manages conversation context and user preferences
 * Enables multi-turn conversations with context awareness
 */

export class ContextMemory {
  constructor(maxHistory = 20) {
    this.maxHistory = maxHistory;
    this.conversationHistory = [];
    this.userPreferences = {};
    this.sessionContext = {};
    this.loadFromStorage();
  }

  /**
   * Load conversation history from local storage
   */
  loadFromStorage() {
    try {
      const history = localStorage.getItem('ai-conversation-history');
      const preferences = localStorage.getItem('ai-user-preferences');
      
      if (history) {
        this.conversationHistory = JSON.parse(history);
      }
      
      if (preferences) {
        this.userPreferences = JSON.parse(preferences);
      }
    } catch (error) {
      console.error('Error loading context from storage:', error);
    }
  }

  /**
   * Save conversation history to local storage
   */
  saveToStorage() {
    try {
      localStorage.setItem('ai-conversation-history', JSON.stringify(this.conversationHistory));
      localStorage.setItem('ai-user-preferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.error('Error saving context to storage:', error);
    }
  }

  /**
   * Add message to conversation history
   */
  addMessage(message) {
    this.conversationHistory.push({
      ...message,
      timestamp: new Date().toISOString()
    });

    // Keep only the last maxHistory messages
    if (this.conversationHistory.length > this.maxHistory) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistory);
    }

    this.saveToStorage();
  }

  /**
   * Get conversation history
   */
  getHistory(limit = 10) {
    return this.conversationHistory.slice(-limit);
  }

  /**
   * Get recent user queries
   */
  getRecentQueries(limit = 5) {
    return this.conversationHistory
      .filter(msg => msg.type === 'user')
      .slice(-limit)
      .map(msg => msg.text);
  }

  /**
   * Get recent intents
   */
  getRecentIntents(limit = 5) {
    return this.conversationHistory
      .filter(msg => msg.intent)
      .slice(-limit)
      .map(msg => msg.intent);
  }

  /**
   * Check if query is a follow-up
   */
  isFollowUp(query) {
    const recentQueries = this.getRecentQueries(3);
    const followUpIndicators = [
      'what about',
      'and',
      'also',
      'what else',
      'tell me more',
      'explain',
      'why',
      'how',
      'compare'
    ];

    const lowerQuery = query.toLowerCase();
    return followUpIndicators.some(indicator => lowerQuery.includes(indicator)) ||
           recentQueries.length > 0;
  }

  /**
   * Get context for current query
   */
  getContext(query) {
    const recentIntents = this.getRecentIntents(3);
    const recentQueries = this.getRecentQueries(3);
    
    return {
      isFollowUp: this.isFollowUp(query),
      recentIntents,
      recentQueries,
      lastIntent: recentIntents[recentIntents.length - 1],
      lastQuery: recentQueries[recentQueries.length - 1],
      conversationLength: this.conversationHistory.length
    };
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences) {
    this.userPreferences = {
      ...this.userPreferences,
      ...preferences
    };
    this.saveToStorage();
  }

  /**
   * Get user preferences
   */
  getPreferences() {
    return this.userPreferences;
  }

  /**
   * Set session context
   */
  setSessionContext(key, value) {
    this.sessionContext[key] = value;
  }

  /**
   * Get session context
   */
  getSessionContext(key) {
    return this.sessionContext[key];
  }

  /**
   * Clear session context
   */
  clearSessionContext() {
    this.sessionContext = {};
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    this.saveToStorage();
  }

  /**
   * Get conversation summary
   */
  getSummary() {
    const userMessages = this.conversationHistory.filter(msg => msg.type === 'user');
    const aiMessages = this.conversationHistory.filter(msg => msg.type === 'ai');
    
    return {
      totalMessages: this.conversationHistory.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      firstMessage: this.conversationHistory[0]?.timestamp,
      lastMessage: this.conversationHistory[this.conversationHistory.length - 1]?.timestamp,
      topIntents: this.getTopIntents()
    };
  }

  /**
   * Get top intents from conversation
   */
  getTopIntents(limit = 5) {
    const intentCounts = {};
    
    this.conversationHistory.forEach(msg => {
      if (msg.intent) {
        intentCounts[msg.intent] = (intentCounts[msg.intent] || 0) + 1;
      }
    });

    return Object.entries(intentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([intent, count]) => ({ intent, count }));
  }

  /**
   * Export conversation data
   */
  exportData() {
    return {
      history: this.conversationHistory,
      preferences: this.userPreferences,
      summary: this.getSummary()
    };
  }

  /**
   * Import conversation data
   */
  importData(data) {
    if (data.history) {
      this.conversationHistory = data.history;
    }
    if (data.preferences) {
      this.userPreferences = data.preferences;
    }
    this.saveToStorage();
  }
}

export default ContextMemory;
