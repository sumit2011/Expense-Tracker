/**
 * Chat Manager
 * Orchestrates the AI chat functionality
 * Coordinates between analytics, reasoning, response generation, and memory
 */

import { AnalyticsEngine } from './analyticsEngine.js';
import { FinancialReasoningEngine } from './financialReasoning.js';
import { ResponseGenerator } from './responseGenerator.js';
import { ContextMemory } from './contextMemory.js';

export class ChatManager {
  constructor(records, categories, budgets, currency = 'USD') {
    this.analytics = new AnalyticsEngine(records, categories, budgets, currency);
    this.reasoning = new FinancialReasoningEngine(this.analytics);
    this.responseGenerator = new ResponseGenerator(currency);
    this.memory = new ContextMemory();
    this.currency = currency;
  }

  /**
   * Process user message and generate response
   */
  async processMessage(userMessage, records) {
    // Update analytics with current records
    this.analytics.records = records;

    // Add user message to memory
    this.memory.addMessage({
      type: 'user',
      text: userMessage
    });

    // Get context
    const context = this.memory.getContext(userMessage);

    // Process query through reasoning engine
    const analysisResult = this.reasoning.processQuery(userMessage, records);

    // Store intent in memory
    this.memory.addMessage({
      type: 'system',
      intent: analysisResult.intent,
      params: analysisResult.params
    });

    // Generate response
    const responseText = this.responseGenerator.generateResponse(analysisResult);

    // Add AI response to memory
    this.memory.addMessage({
      type: 'ai',
      text: responseText,
      intent: analysisResult.intent
    });

    return {
      response: responseText,
      intent: analysisResult.intent,
      context,
      data: analysisResult.data
    };
  }

  /**
   * Get conversation history
   */
  getHistory(limit = 20) {
    return this.memory.getHistory(limit);
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.memory.clearHistory();
  }

  /**
   * Get quick suggestions based on context
   */
  getSuggestions() {
    const recentIntents = this.memory.getRecentIntents(5);
    const suggestions = [];

    // Default suggestions
    const defaultSuggestions = [
      "What are my total expenses?",
      "How is my budget status?",
      "Show me spending insights",
      "What's my current balance?"
    ];

    // Context-aware suggestions
    if (recentIntents.includes('total_expenses')) {
      suggestions.push("What about my income?");
      suggestions.push("Show me category breakdown");
    }

    if (recentIntents.includes('budget_status')) {
      suggestions.push("Where am I overspending?");
      suggestions.push("Give me budget recommendations");
    }

    if (recentIntents.includes('insights')) {
      suggestions.push("Predict next month's spending");
      suggestions.push("How can I save more?");
    }

    // Combine and deduplicate
    const allSuggestions = [...new Set([...suggestions, ...defaultSuggestions])];
    return allSuggestions.slice(0, 6);
  }

  /**
   * Get initial greeting
   */
  getGreeting() {
    return this.responseGenerator.generateGreeting();
  }

  /**
   * Update data
   */
  updateData(records, categories, budgets) {
    this.analytics.records = records;
    this.analytics.categories = categories;
    this.analytics.budgets = budgets;
  }

  /**
   * Update currency
   */
  updateCurrency(currency) {
    this.currency = currency;
    this.analytics.currency = currency;
    this.responseGenerator.currency = currency;
  }

  /**
   * Get conversation summary
   */
  getSummary() {
    return this.memory.getSummary();
  }

  /**
   * Export conversation data
   */
  exportConversation() {
    return this.memory.exportData();
  }

  /**
   * Import conversation data
   */
  importConversation(data) {
    this.memory.importData(data);
  }
}

export default ChatManager;
