/**
 * Chat History Manager
 * Manages chat history with localStorage fallback
 */

export class ChatHistoryManager {
  constructor(maxHistory = 100) {
    this.maxHistory = maxHistory;
    this.storageKey = 'ai-chat-history';
    this.history = [];
    this.loadFromStorage();
  }

  /**
   * Load history from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      this.history = [];
    }
  }

  /**
   * Save history to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  /**
   * Add message to history
   */
  addMessage(message) {
    const messageWithTimestamp = {
      ...message,
      timestamp: message.timestamp || new Date().toISOString()
    };

    this.history.push(messageWithTimestamp);

    // Keep only maxHistory messages
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }

    this.saveToStorage();
  }

  /**
   * Get history
   */
  getHistory(limit = 50) {
    return this.history.slice(-limit);
  }

  /**
   * Get recent user messages
   */
  getRecentUserMessages(limit = 5) {
    return this.history
      .filter(msg => msg.type === 'user')
      .slice(-limit);
  }

  /**
   * Get recent AI messages
   */
  getRecentAIMessages(limit = 5) {
    return this.history
      .filter(msg => msg.type === 'ai')
      .slice(-limit);
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
    this.saveToStorage();
  }

  /**
   * Get history statistics
   */
  getStats() {
    const userMessages = this.history.filter(msg => msg.type === 'user');
    const aiMessages = this.history.filter(msg => msg.type === 'ai');

    return {
      totalMessages: this.history.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      firstMessage: this.history[0]?.timestamp,
      lastMessage: this.history[this.history.length - 1]?.timestamp
    };
  }

  /**
   * Export history
   */
  exportHistory() {
    return {
      history: this.history,
      stats: this.getStats(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Import history
   */
  importHistory(data) {
    if (data && data.history) {
      this.history = data.history;
      this.saveToStorage();
    }
  }

  /**
   * Search history by text
   */
  searchHistory(query) {
    const lowerQuery = query.toLowerCase();
    return this.history.filter(msg => 
      msg.text.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get messages by intent
   */
  getMessagesByIntent(intent) {
    return this.history.filter(msg => msg.intent === intent);
  }

  /**
   * Get messages by date range
   */
  getMessagesByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.history.filter(msg => {
      const msgDate = new Date(msg.timestamp);
      return msgDate >= start && msgDate <= end;
    });
  }
}

export default ChatHistoryManager;
