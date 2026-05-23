/**
 * Savings Engine
 * Calculates savings metrics and provides recommendations
 */

export class SavingsEngine {
  constructor(records, budgets) {
    this.records = records || [];
    this.budgets = budgets || {};
  }

  /**
   * Calculate savings rate
   */
  calculateSavingsRate(records = this.records, period = 'month') {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const periodRecords = records.filter(r => {
      const date = new Date(r.date);
      return date >= startDate && date <= now;
    });

    const income = periodRecords
      .filter(r => r.amount > 0)
      .reduce((sum, r) => sum + r.amount, 0);

    const expenses = periodRecords
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .reduce((sum, r) => sum + Math.abs(r.amount), 0);

    if (income === 0) return { rate: 0, income: 0, expenses: 0, savings: 0 };

    const savings = income - expenses;
    const rate = (savings / income) * 100;

    return {
      rate: rate.toFixed(1),
      income,
      expenses,
      savings,
      period
    };
  }

  /**
   * Calculate savings goal progress
   */
  calculateGoalProgress(goalAmount, currentSavings, targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    const totalDays = Math.floor((target - now) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays);
    
    const progress = (currentSavings / goalAmount) * 100;
    const remaining = goalAmount - currentSavings;
    
    const dailyRequired = daysRemaining > 0 ? remaining / daysRemaining : 0;
    const monthlyRequired = dailyRequired * 30;

    const onTrack = currentSavings >= (goalAmount * (1 - daysRemaining / totalDays));

    return {
      progress: progress.toFixed(1),
      currentSavings,
      goalAmount,
      remaining,
      daysRemaining,
      dailyRequired: dailyRequired.toFixed(2),
      monthlyRequired: monthlyRequired.toFixed(2),
      onTrack,
      status: progress >= 100 ? 'completed' : onTrack ? 'on_track' : 'behind'
    };
  }

  /**
   * Generate savings recommendations
   */
  generateRecommendations(records = this.records) {
    const recommendations = [];
    const savingsRate = this.calculateSavingsRate(records);
    const rate = parseFloat(savingsRate.rate);

    // Savings rate recommendations
    if (rate < 10) {
      recommendations.push({
        type: 'savings_rate',
        priority: 'high',
        title: 'Increase Savings Rate',
        message: 'Your savings rate is below 10%. Aim to save at least 20% of your income for financial security.',
        action: 'Review expenses and identify areas to cut back'
      });
    } else if (rate < 20) {
      recommendations.push({
        type: 'savings_rate',
        priority: 'medium',
        title: 'Improve Savings Rate',
        message: `Your savings rate is ${rate}%. Try to reach 20% for better financial health.`,
        action: 'Consider automating savings transfers'
      });
    } else if (rate >= 20) {
      recommendations.push({
        type: 'savings_rate',
        priority: 'low',
        title: 'Excellent Savings Rate',
        message: `Great job! Your savings rate of ${rate}% is above the recommended 20%.`,
        action: 'Consider investing excess savings'
      });
    }

    // Budget-based recommendations
    const totalBudget = Object.values(this.budgets).reduce((sum, b) => {
      return sum + (typeof b === 'object' ? b.limit : b);
    }, 0);

    if (totalBudget > 0) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyExpenses = records
        .filter(r => {
          const date = new Date(r.date);
          return date >= startOfMonth && date <= now && r.amount < 0 && r.type !== 'transfer';
        })
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);

      const potentialSavings = totalBudget - monthlyExpenses;
      
      if (potentialSavings > 0) {
        recommendations.push({
          type: 'budget_savings',
          priority: 'medium',
          title: 'Budget Savings Opportunity',
          message: `You could save an additional ${this.formatCurrency(potentialSavings)} this month by staying within budget.`,
          action: 'Track spending closely to maximize budget savings'
        });
      }
    }

    // Emergency fund recommendation
    const monthlyExpenses = this.getMonthlyExpenses(records);
    const currentBalance = records.reduce((sum, r) => sum + r.amount, 0);
    const emergencyFundTarget = monthlyExpenses * 3; // 3 months
    const emergencyFundProgress = (currentBalance / emergencyFundTarget) * 100;

    if (emergencyFundProgress < 100) {
      recommendations.push({
        type: 'emergency_fund',
        priority: 'high',
        title: 'Build Emergency Fund',
        message: `Your emergency fund is at ${emergencyFundProgress.toFixed(1)}%. Aim for 3-6 months of expenses.`,
        action: `Save ${this.formatCurrency(emergencyFundTarget - currentBalance)} more to reach 3-month target`
      });
    }

    return recommendations;
  }

  /**
   * Calculate monthly expenses
   */
  getMonthlyExpenses(records = this.records) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return records
      .filter(r => {
        const date = new Date(r.date);
        return date >= startOfMonth && date <= now && r.amount < 0 && r.type !== 'transfer';
      })
      .reduce((sum, r) => sum + Math.abs(r.amount), 0);
  }

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Calculate savings potential from expense reduction
   */
  calculateSavingsPotential(reductionPercentage, records = this.records) {
    const monthlyExpenses = this.getMonthlyExpenses(records);
    const potentialSavings = monthlyExpenses * (reductionPercentage / 100);
    const annualSavings = potentialSavings * 12;

    return {
      monthly: potentialSavings,
      annual: annualSavings,
      formattedMonthly: this.formatCurrency(potentialSavings),
      formattedAnnual: this.formatCurrency(annualSavings)
    };
  }

  /**
   * Generate savings forecast
   */
  generateForecast(records = this.records, months = 12) {
    const savingsRate = this.calculateSavingsRate(records);
    const monthlyIncome = records
      .filter(r => {
        const date = new Date(r.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && r.amount > 0;
      })
      .reduce((sum, r) => sum + r.amount, 0);

    const monthlySavings = monthlyIncome * (parseFloat(savingsRate.rate) / 100);
    const forecast = [];

    for (let i = 1; i <= months; i++) {
      forecast.push({
        month: i,
        cumulativeSavings: monthlySavings * i,
        formatted: this.formatCurrency(monthlySavings * i)
      });
    }

    return {
      monthlySavings,
      annualSavings: monthlySavings * 12,
      forecast,
      formattedMonthly: this.formatCurrency(monthlySavings),
      formattedAnnual: this.formatCurrency(monthlySavings * 12)
    };
  }

  /**
   * Analyze savings consistency
   */
  analyzeConsistency(records = this.records, months = 6) {
    const monthlySavings = [];
    const now = new Date();

    for (let i = 0; i < months; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthIncome = records
        .filter(r => {
          const date = new Date(r.date);
          return date >= month && date <= endOfMonth && r.amount > 0;
        })
        .reduce((sum, r) => sum + r.amount, 0);

      const monthExpenses = records
        .filter(r => {
          const date = new Date(r.date);
          return date >= month && date <= endOfMonth && r.amount < 0 && r.type !== 'transfer';
        })
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);

      monthlySavings.unshift(monthIncome - monthExpenses);
    }

    const positiveMonths = monthlySavings.filter(s => s > 0).length;
    const consistency = (positiveMonths / monthlySavings.length) * 100;

    return {
      consistency: consistency.toFixed(1),
      positiveMonths,
      totalMonths: monthlySavings.length,
      monthlySavings,
      status: consistency >= 80 ? 'excellent' : consistency >= 60 ? 'good' : consistency >= 40 ? 'fair' : 'poor'
    };
  }
}

export default SavingsEngine;
