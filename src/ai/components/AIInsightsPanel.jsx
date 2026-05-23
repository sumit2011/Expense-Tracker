import React, { useState, useEffect } from 'react';
import { useFinancialInsights } from '../hooks/useFinancialInsights.js';
import { AnalyticsEngine } from '../services/analyticsEngine.js';
import { FinancialReasoningEngine } from '../services/financialReasoning.js';
import { ResponseGenerator } from '../services/responseGenerator.js';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import './AIInsightsPanel.css';

export default function AIInsightsPanel({ records, categories, budgets, currency }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, [records, categories, budgets, currency]);

  const generateInsights = () => {
    setLoading(true);
    
    try {
      const analytics = new AnalyticsEngine(records, categories, budgets, currency);
      const reasoning = new FinancialReasoningEngine(analytics);
      const generator = new ResponseGenerator(currency);
      
      const generatedInsights = [];

      // Generate financial health insight
      const healthResult = reasoning.processQuery('How financially healthy am I?', records);
      if (healthResult.data) {
        generatedInsights.push({
          type: 'health',
          icon: <CheckCircle size={18} />,
          title: 'Financial Health',
          message: generator.generateResponse(healthResult),
          priority: healthResult.data.healthLevel === 'poor' ? 'high' : 'medium'
        });
      }

      // Generate spending trend insight
      const trendResult = reasoning.processQuery('What changed this month?', records);
      if (trendResult.data && trendResult.data.overallTrend) {
        const trend = trendResult.data.overallTrend;
        generatedInsights.push({
          type: 'trend',
          icon: <TrendingUp size={18} />,
          title: 'Spending Trend',
          message: `Your spending has ${trend.direction} by ${trend.formattedChange} compared to last month.`,
          priority: Math.abs(trend.percentage) > 20 ? 'high' : 'medium'
        });
      }

      // Generate budget alert insight
      const budgetResult = reasoning.processQuery('Where am I overspending?', records);
      if (budgetResult.data && budgetResult.data.budgets && budgetResult.data.budgets.length > 0) {
        generatedInsights.push({
          type: 'budget',
          icon: <AlertTriangle size={18} />,
          title: 'Budget Alert',
          message: `You're over budget in ${budgetResult.data.budgets.length} categor${budgetResult.data.budgets.length === 1 ? 'y' : 'ies'}.`,
          priority: 'high'
        });
      }

      // Generate savings insight
      const savingsResult = reasoning.processQuery('Am I saving enough?', records);
      if (savingsResult.data) {
        generatedInsights.push({
          type: 'savings',
          icon: <Sparkles size={18} />,
          title: 'Savings Rate',
          message: `Your savings rate is ${savingsResult.data.rate.toFixed(1)}%.`,
          priority: savingsResult.data.rate < 10 ? 'high' : 'medium'
        });
      }

      // Generate coaching insight
      const coachingResult = reasoning.processQuery('Give me financial advice', records);
      if (coachingResult.data && coachingResult.data.length > 0) {
        generatedInsights.push({
          type: 'coaching',
          icon: <Lightbulb size={18} />,
          title: 'Financial Tip',
          message: coachingResult.data[0].message,
          priority: 'low'
        });
      }

      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      generatedInsights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      setInsights(generatedInsights.slice(0, 3)); // Show top 3 insights
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ai-insights-panel loading">
        <div className="insight-skeleton"></div>
        <div className="insight-skeleton"></div>
      </div>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="ai-insights-panel">
      <div className="insights-header">
        <Sparkles size={20} />
        <h3>AI Insights</h3>
      </div>
      <div className="insights-list">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`insight-card priority-${insight.priority}`}
          >
            <div className="insight-icon">{insight.icon}</div>
            <div className="insight-content">
              <h4>{insight.title}</h4>
              <p>{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
