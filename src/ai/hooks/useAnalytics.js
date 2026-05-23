/**
 * useAnalytics Hook
 * Custom React hook for financial analytics
 */

import { useMemo } from 'react';
import { AnalyticsEngine } from '../services/analyticsEngine.js';

export function useAnalytics(records, categories, budgets, currency = 'USD') {
  const analytics = useMemo(() => {
    return new AnalyticsEngine(records, categories, budgets, currency);
  }, [records, categories, budgets, currency]);

  const summary = useMemo(() => {
    return analytics.generateSummary(records);
  }, [analytics, records]);

  const categoryBreakdown = useMemo(() => {
    return analytics.getCategoryBreakdown(records);
  }, [analytics, records]);

  const budgetStatus = useMemo(() => {
    return analytics.getBudgetStatus(records);
  }, [analytics, records]);

  const spendingTrend = useMemo(() => {
    return analytics.getSpendingTrend(records);
  }, [analytics, records]);

  const savingsRate = useMemo(() => {
    return analytics.getSavingsRate(records);
  }, [analytics, records]);

  const unusualSpending = useMemo(() => {
    return analytics.detectUnusualSpending(records);
  }, [analytics, records]);

  const monthlyComparison = useMemo(() => {
    return analytics.getMonthlyComparison(records, 6);
  }, [analytics, records]);

  return {
    analytics,
    summary,
    categoryBreakdown,
    budgetStatus,
    spendingTrend,
    savingsRate,
    unusualSpending,
    monthlyComparison
  };
}

export default useAnalytics;
