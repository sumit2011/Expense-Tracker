/**
 * useAIChat Hook
 * Custom React hook for AI chat functionality
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatManager } from '../services/chatManager.js';

export function useAIChat(records, categories, budgets, currency = 'USD') {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const chatManagerRef = useRef(null);

  // Initialize chat manager
  useEffect(() => {
    chatManagerRef.current = new ChatManager(records, categories, budgets, currency);
    
    // Load initial greeting
    const greeting = chatManagerRef.current.getGreeting();
    setMessages([{
      id: 1,
      type: 'ai',
      text: greeting,
      timestamp: new Date()
    }]);

    // Load initial suggestions
    setSuggestions(chatManagerRef.current.getSuggestions());
  }, []);

  // Update chat manager when data changes
  useEffect(() => {
    if (chatManagerRef.current) {
      chatManagerRef.current.updateData(records, categories, budgets);
    }
  }, [records, categories, budgets]);

  // Update currency when it changes
  useEffect(() => {
    if (chatManagerRef.current) {
      chatManagerRef.current.updateCurrency(currency);
    }
  }, [currency]);

  // Send message
  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim() || !chatManagerRef.current) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Process message through chat manager
      const result = await chatManagerRef.current.processMessage(userMessage, records);

      // Add AI response
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: result.response,
        intent: result.intent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

      // Update suggestions based on context
      setSuggestions(chatManagerRef.current.getSuggestions());

      return result;
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      
      return null;
    } finally {
      setIsTyping(false);
    }
  }, [records]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    if (chatManagerRef.current) {
      chatManagerRef.current.clearHistory();
    }
    setMessages([]);
    const greeting = chatManagerRef.current?.getGreeting() || 'Hello! How can I help you with your finances?';
    setMessages([{
      id: 1,
      type: 'ai',
      text: greeting,
      timestamp: new Date()
    }]);
  }, []);

  // Get conversation summary
  const getSummary = useCallback(() => {
    return chatManagerRef.current?.getSummary() || null;
  }, []);

  // Export conversation
  const exportConversation = useCallback(() => {
    return chatManagerRef.current?.exportConversation() || null;
  }, []);

  // Import conversation
  const importConversation = useCallback((data) => {
    if (chatManagerRef.current) {
      chatManagerRef.current.importConversation(data);
      const history = chatManagerRef.current.getHistory();
      setMessages(history);
    }
  }, []);

  return {
    messages,
    isTyping,
    suggestions,
    sendMessage,
    clearConversation,
    getSummary,
    exportConversation,
    importConversation
  };
}

export default useAIChat;
