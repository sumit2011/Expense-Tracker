/**
 * useFinancialInsights Hook
 * Custom React hook for generating financial insights
 */

import { useMemo } from 'react';
import { ExpenseAnalyzer } from '../engines/expenseAnalyzer.js';
import { BudgetCalculator } from '../engines/budgetCalculator.js';
import { TrendPredictor } from '../engines/trendPredictor.js';
import { SavingsEngine } from '../engines/savingsEngine.js';
import { PatternDetector } from '../engines/patternDetector.js';
import { AnomalyDetector } from '../engines/anomalyDetector.js';

export function useFinancialInsights(records, categories, budgets) {
  const expenseAnalyzer = useMemo(() => {
    return new ExpenseAnalyzer(records, categories);
  }, [records, categories]);

  const budgetCalculator = useMemo(() => {
    return new BudgetCalculator(budgets, records, categories);
  }, [budgets, records, categories]);

  const trendPredictor = useMemo(() => {
    return new TrendPredictor(records);
  }, [records]);

  const savingsEngine = useMemo(() => {
    return new SavingsEngine(records, budgets);
  }, [records, budgets]);

  const patternDetector = useMemo(() => {
    return new PatternDetector(records, categories);
  }, [records, categories]);

  const anomalyDetector = useMemo(() => {
    return new AnomalyDetector(records, categories);
  }, [records, categories]);

  const expenseAnalysis = useMemo(() => {
    return expenseAnalyzer.generateAnalysis(records);
  }, [expenseAnalyzer, records]);

  const budgetReport = useMemo(() => {
    return budgetCalculator.generateBudgetReport(records);
  }, [budgetCalculator, records]);

  const spendingForecast = useMemo(() => {
    return trendPredictor.generateForecast(records, 3);
  }, [trendPredictor, records]);

  const savingsRecommendations = useMemo(() => {
    return savingsEngine.generateRecommendations(records);
  }, [savingsEngine, records]);

  const patternAnalysis = useMemo(() => {
    return patternDetector.generateAnalysis(records);
  }, [patternDetector, records]);

  const anomalyReport = useMemo(() => {
    return anomalyDetector.generateReport(records);
  }, [anomalyDetector, records]);

  const comprehensiveInsights = useMemo(() => {
    return {
      expenseAnalysis,
      budgetReport,
      spendingForecast,
      savingsRecommendations,
      patternAnalysis,
      anomalyReport,
      generatedAt: new Date().toISOString()
    };
  }, [
    expenseAnalysis,
    budgetReport,
    spendingForecast,
    savingsRecommendations,
    patternAnalysis,
    anomalyReport
  ]);

  return {
    expenseAnalyzer,
    budgetCalculator,
    trendPredictor,
    savingsEngine,
    patternDetector,
    anomalyDetector,
    comprehensiveInsights,
    expenseAnalysis,
    budgetReport,
    spendingForecast,
    savingsRecommendations,
    patternAnalysis,
    anomalyReport
  };
}

export default useFinancialInsights;
