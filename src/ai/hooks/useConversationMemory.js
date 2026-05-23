/**
 * useConversationMemory Hook
 * Custom React hook for managing conversation context
 */

import { useState, useCallback, useEffect } from 'react';
import { ContextMemory } from '../services/contextMemory.js';

export function useConversationMemory(maxHistory = 20) {
  const [memory, setMemory] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const contextMemory = new ContextMemory(maxHistory);
    setMemory(contextMemory);
    setHistory(contextMemory.getHistory());
  }, [maxHistory]);

  const addMessage = useCallback((message) => {
    if (memory) {
      memory.addMessage(message);
      setHistory(memory.getHistory());
    }
  }, [memory]);

  const getHistory = useCallback((limit = 10) => {
    return memory ? memory.getHistory(limit) : [];
  }, [memory]);

  const getRecentQueries = useCallback((limit = 5) => {
    return memory ? memory.getRecentQueries(limit) : [];
  }, [memory]);

  const getRecentIntents = useCallback((limit = 5) => {
    return memory ? memory.getRecentIntents(limit) : [];
  }, [memory]);

  const getContext = useCallback((query) => {
    return memory ? memory.getContext(query) : null;
  }, [memory]);

  const updatePreferences = useCallback((preferences) => {
    if (memory) {
      memory.updatePreferences(preferences);
    }
  }, [memory]);

  const getPreferences = useCallback(() => {
    return memory ? memory.getPreferences() : {};
  }, [memory]);

  const clearHistory = useCallback(() => {
    if (memory) {
      memory.clearHistory();
      setHistory([]);
    }
  }, [memory]);

  const getSummary = useCallback(() => {
    return memory ? memory.getSummary() : null;
  }, [memory]);

  const exportData = useCallback(() => {
    return memory ? memory.exportData() : null;
  }, [memory]);

  const importData = useCallback((data) => {
    if (memory) {
      memory.importData(data);
      setHistory(memory.getHistory());
    }
  }, [memory]);

  return {
    memory,
    history,
    addMessage,
    getHistory,
    getRecentQueries,
    getRecentIntents,
    getContext,
    updatePreferences,
    getPreferences,
    clearHistory,
    getSummary,
    exportData,
    importData
  };
}

export default useConversationMemory;
