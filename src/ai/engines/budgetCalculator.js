/**
 * Budget Calculator Engine
 * Advanced budget calculations and recommendations
 */

export class BudgetCalculator {
  constructor(budgets, records, categories) {
    this.budgets = budgets || {};
    this.records = records || [];
    this.categories = categories || [];
  }

  /**
   * Calculate budget health score (0-100)
   */
  calculateBudgetHealthScore(records = this.records) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyRecords = records.filter(r => {
      const date = new Date(r.date);
      return date >= startOfMonth && date <= now && r.amount < 0 && r.type !== 'transfer';
    });

    let totalScore = 0;
    let budgetCount = 0;

    Object.entries(this.budgets).forEach(([budgetName, budgetData]) => {
      const limit = typeof budgetData === 'object' ? budgetData.limit : budgetData;
      const categories = typeof budgetData === 'object' && budgetData.categories 
        ? budgetData.categories 
        : [budgetName];

      const spent = categories.reduce((sum, cat) => {
        return sum + monthlyRecords
          .filter(r => r.name === cat)
          .reduce((s, r) => s + Math.abs(r.amount), 0);
      }, 0);

      const percentage = (spent / limit) * 100;
      
      // Score calculation
      let score = 100;
      if (percentage >= 100) score = 0;
      else if (percentage >= 90) score = 20;
      else if (percentage >= 80) score = 40;
      else if (percentage >= 70) score = 60;
      else if (percentage >= 50) score = 80;

      totalScore += score;
      budgetCount++;
    });

    return budgetCount > 0 ? Math.round(totalScore / budgetCount) : 100;
  }

  /**
   * Calculate recommended budget based on spending history
   */
  calculateRecommendedBudget(category, records = this.records, months = 3) {
    const now = new Date();
    let totalSpent = 0;
    let monthsWithData = 0;

    for (let i = 0; i < months; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthSpent = records
        .filter(r => {
          const date = new Date(r.date);
          return r.name === category && r.amount < 0 && r.type !== 'transfer' &&
                 date >= month && date <= endOfMonth;
        })
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);

      if (monthSpent > 0) {
        totalSpent += monthSpent;
        monthsWithData++;
      }
    }

    if (monthsWithData === 0) return null;

    const avgMonthly = totalSpent / monthsWithData;
    const recommended = Math.ceil(avgMonthly * 1.1); // Add 10% buffer

    return {
      category,
      recommended,
      averageSpent: Math.round(avgMonthly),
      monthsAnalyzed: monthsWithData,
      buffer: Math.round(recommended - avgMonthly)
    };
  }

  /**
   * Generate budget recommendations for all categories
   */
  generateAllRecommendations(records = this.records) {
    const categorySpending = {};
    
    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        categorySpending[record.name] = (categorySpending[record.name] || 0) + Math.abs(record.amount);
      });

    const recommendations = [];
    Object.keys(categorySpending).forEach(category => {
      const rec = this.calculateRecommendedBudget(category, records);
      if (rec) {
        recommendations.push(rec);
      }
    });

    return recommendations.sort((a, b) => b.recommended - a.recommended);
  }

  /**
   * Calculate budget optimization suggestions
   */
  calculateOptimizationSuggestions(records = this.records) {
    const suggestions = [];
    const budgetHealth = this.calculateBudgetHealthScore(records);

    if (budgetHealth < 50) {
      suggestions.push({
        type: 'critical',
        message: 'Your budget health is critical. Review and adjust your budgets immediately.',
        priority: 'high'
      });
    } else if (budgetHealth < 70) {
      suggestions.push({
        type: 'warning',
        message: 'Your budget health needs attention. Consider adjusting spending limits.',
        priority: 'medium'
      });
    }

    // Check for unused budgets
    Object.entries(this.budgets).forEach(([budgetName, budgetData]) => {
      const limit = typeof budgetData === 'object' ? budgetData.limit : budgetData;
      const categories = typeof budgetData === 'object' && budgetData.categories 
        ? budgetData.categories 
        : [budgetName];

      const spent = categories.reduce((sum, cat) => {
        return sum + records
          .filter(r => r.name === cat && r.amount < 0 && r.type !== 'transfer')
          .reduce((s, r) => s + Math.abs(r.amount), 0);
      }, 0);

      if (spent < limit * 0.3) {
        suggestions.push({
          type: 'optimization',
          message: `${budgetName} budget is underutilized (${Math.round((spent/limit)*100)}% used). Consider reducing the limit.`,
          priority: 'low'
        });
      }
    });

    return suggestions;
  }

  /**
   * Calculate budget pacing (are you on track?)
   */
  calculateBudgetPacing(records = this.records) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const daysInMonth = endOfMonth.getDate();
    const daysPassed = now.getDate();
    const monthProgress = daysPassed / daysInMonth;

    const pacing = [];

    Object.entries(this.budgets).forEach(([budgetName, budgetData]) => {
      const limit = typeof budgetData === 'object' ? budgetData.limit : budgetData;
      const categories = typeof budgetData === 'object' && budgetData.categories 
        ? budgetData.categories 
        : [budgetName];

      const spent = categories.reduce((sum, cat) => {
        return sum + records
          .filter(r => {
            const date = new Date(r.date);
            return r.name === cat && r.amount < 0 && r.type !== 'transfer' &&
                   date >= startOfMonth && date <= now;
          })
          .reduce((s, r) => s + Math.abs(r.amount), 0);
      }, 0);

      const expectedSpent = limit * monthProgress;
      const paceStatus = spent > expectedSpent * 1.2 ? 'ahead' 
                        : spent < expectedSpent * 0.8 ? 'behind' 
                        : 'on_track';

      pacing.push({
        name: budgetName,
        limit,
        spent,
        expected: expectedSpent,
        monthProgress: (monthProgress * 100).toFixed(1),
        paceStatus,
        projected: spent / monthProgress
      });
    });

    return pacing;
  }

  /**
   * Generate comprehensive budget report
   */
  generateBudgetReport(records = this.records) {
    return {
      healthScore: this.calculateBudgetHealthScore(records),
      recommendations: this.generateAllRecommendations(records),
      optimizations: this.calculateOptimizationSuggestions(records),
      pacing: this.calculateBudgetPacing(records)
    };
  }
}

export default BudgetCalculator;
