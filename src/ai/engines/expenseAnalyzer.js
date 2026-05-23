/**
 * Expense Analyzer Engine
 * Advanced expense analysis with pattern detection and categorization
 */

export class ExpenseAnalyzer {
  constructor(records, categories) {
    this.records = records || [];
    this.categories = categories || [];
  }

  /**
   * Analyze spending patterns by day of week
   */
  analyzeByDayOfWeek(records = this.records) {
    const dayAnalysis = {
      0: { name: 'Sunday', total: 0, count: 0, avg: 0 },
      1: { name: 'Monday', total: 0, count: 0, avg: 0 },
      2: { name: 'Tuesday', total: 0, count: 0, avg: 0 },
      3: { name: 'Wednesday', total: 0, count: 0, avg: 0 },
      4: { name: 'Thursday', total: 0, count: 0, avg: 0 },
      5: { name: 'Friday', total: 0, count: 0, avg: 0 },
      6: { name: 'Saturday', total: 0, count: 0, avg: 0 }
    };

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        const day = new Date(record.date).getDay();
        dayAnalysis[day].total += Math.abs(record.amount);
        dayAnalysis[day].count += 1;
      });

    Object.keys(dayAnalysis).forEach(day => {
      if (dayAnalysis[day].count > 0) {
        dayAnalysis[day].avg = dayAnalysis[day].total / dayAnalysis[day].count;
      }
    });

    return Object.values(dayAnalysis).sort((a, b) => b.total - a.total);
  }

  /**
   * Analyze spending patterns by time of day
   */
  analyzeByTimeOfDay(records = this.records) {
    const timeAnalysis = {
      morning: { name: 'Morning (6AM-12PM)', total: 0, count: 0 },
      afternoon: { name: 'Afternoon (12PM-6PM)', total: 0, count: 0 },
      evening: { name: 'Evening (6PM-12AM)', total: 0, count: 0 },
      night: { name: 'Night (12AM-6AM)', total: 0, count: 0 }
    };

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        const hour = new Date(record.date).getHours();
        const amount = Math.abs(record.amount);

        if (hour >= 6 && hour < 12) {
          timeAnalysis.morning.total += amount;
          timeAnalysis.morning.count += 1;
        } else if (hour >= 12 && hour < 18) {
          timeAnalysis.afternoon.total += amount;
          timeAnalysis.afternoon.count += 1;
        } else if (hour >= 18 && hour < 24) {
          timeAnalysis.evening.total += amount;
          timeAnalysis.evening.count += 1;
        } else {
          timeAnalysis.night.total += amount;
          timeAnalysis.night.count += 1;
        }
      });

    return Object.values(timeAnalysis).sort((a, b) => b.total - a.total);
  }

  /**
   * Detect recurring expenses
   */
  detectRecurringExpenses(records = this.records) {
    const expenseMap = new Map();

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        const key = `${record.name}_${Math.abs(record.amount)}`;
        if (!expenseMap.has(key)) {
          expenseMap.set(key, {
            name: record.name,
            amount: Math.abs(record.amount),
            dates: [],
            count: 0
          });
        }
        expenseMap.get(key).dates.push(record.date);
        expenseMap.get(key).count += 1;
      });

    const recurring = [];
    expenseMap.forEach(expense => {
      if (expense.count >= 2) {
        const dates = expense.dates.sort((a, b) => new Date(a) - new Date(b));
        const intervals = [];
        
        for (let i = 1; i < dates.length; i++) {
          const daysDiff = Math.floor((new Date(dates[i]) - new Date(dates[i-1])) / (1000 * 60 * 60 * 24));
          intervals.push(daysDiff);
        }

        const avgInterval = intervals.length > 0 
          ? intervals.reduce((sum, val) => sum + val, 0) / intervals.length 
          : 0;

        let frequency = 'irregular';
        if (avgInterval >= 28 && avgInterval <= 31) frequency = 'monthly';
        else if (avgInterval >= 6 && avgInterval <= 8) frequency = 'weekly';
        else if (avgInterval >= 13 && avgInterval <= 16) frequency = 'bi-weekly';
        else if (avgInterval >= 90 && avgInterval <= 92) frequency = 'quarterly';
        else if (avgInterval >= 364 && avgInterval <= 366) frequency = 'yearly';

        recurring.push({
          ...expense,
          frequency,
          avgInterval: Math.round(avgInterval),
          lastDate: dates[dates.length - 1]
        });
      }
    });

    return recurring.sort((a, b) => b.count - a.count);
  }

  /**
   * Analyze expense volatility
   */
  analyzeVolatility(records = this.records, months = 6) {
    const monthlyExpenses = [];
    const now = new Date();

    for (let i = 0; i < months; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthExpenses = records
        .filter(r => {
          const date = new Date(r.date);
          return r.amount < 0 && r.type !== 'transfer' &&
                 date >= month && date <= endOfMonth;
        })
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);

      monthlyExpenses.push(monthExpenses);
    }

    if (monthlyExpenses.length < 2) {
      return { volatility: 0, trend: 'stable', stdDev: 0 };
    }

    const mean = monthlyExpenses.reduce((sum, val) => sum + val, 0) / monthlyExpenses.length;
    const variance = monthlyExpenses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlyExpenses.length;
    const stdDev = Math.sqrt(variance);
    const volatility = (stdDev / mean) * 100;

    let trend = 'stable';
    if (monthlyExpenses[0] > monthlyExpenses[monthlyExpenses.length - 1] * 1.2) {
      trend = 'increasing';
    } else if (monthlyExpenses[0] < monthlyExpenses[monthlyExpenses.length - 1] * 0.8) {
      trend = 'decreasing';
    }

    return {
      volatility: volatility.toFixed(1),
      trend,
      stdDev: stdDev.toFixed(2),
      mean: mean.toFixed(2),
      monthlyExpenses
    };
  }

  /**
   * Find unusual expense spikes
   */
  detectExpenseSpikes(records = this.records, threshold = 2) {
    const expenses = records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .map(r => Math.abs(r.amount));

    if (expenses.length < 3) return [];

    const mean = expenses.reduce((sum, val) => sum + val, 0) / expenses.length;
    const variance = expenses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / expenses.length;
    const stdDev = Math.sqrt(variance);

    const spikes = records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .filter(r => Math.abs(r.amount) > mean + (threshold * stdDev))
      .map(r => ({
        ...r,
        amount: Math.abs(r.amount),
        deviation: ((Math.abs(r.amount) - mean) / stdDev).toFixed(2)
      }))
      .sort((a, b) => b.amount - a.amount);

    return spikes;
  }

  /**
   * Calculate expense concentration (Herfindahl index)
   */
  calculateExpenseConcentration(records = this.records) {
    const categoryTotals = {};
    let total = 0;

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        const amount = Math.abs(record.amount);
        categoryTotals[record.name] = (categoryTotals[record.name] || 0) + amount;
        total += amount;
      });

    if (total === 0) return { concentration: 0, diversity: 'none' };

    let hhi = 0;
    Object.values(categoryTotals).forEach(catTotal => {
      const share = catTotal / total;
      hhi += share * share;
    });

    let diversity = 'high';
    if (hhi > 0.5) diversity = 'low';
    else if (hhi > 0.25) diversity = 'medium';

    return {
      concentration: (hhi * 100).toFixed(1),
      diversity,
      categoryCount: Object.keys(categoryTotals).length
    };
  }

  /**
   * Generate comprehensive expense analysis
   */
  generateAnalysis(records = this.records) {
    return {
      byDayOfWeek: this.analyzeByDayOfWeek(records),
      byTimeOfDay: this.analyzeByTimeOfDay(records),
      recurringExpenses: this.detectRecurringExpenses(records),
      volatility: this.analyzeVolatility(records),
      expenseSpikes: this.detectExpenseSpikes(records),
      concentration: this.calculateExpenseConcentration(records)
    };
  }
}

export default ExpenseAnalyzer;
