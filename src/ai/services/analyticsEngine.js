/**
 * Local Analytics Engine
 * Performs real-time financial analysis on user data
 * All calculations run locally on the device
 */

export class AnalyticsEngine {
  constructor(records, categories, budgets, currency = 'USD') {
    this.records = records || [];
    this.categories = categories || [];
    this.budgets = budgets || {};
    this.currency = currency;
  }

  /**
   * Format currency based on user's locale
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency
    }).format(amount);
  }

  /**
   * Get current date range (this month)
   */
  getCurrentMonthRange() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: startOfMonth, end: endOfMonth };
  }

  /**
   * Filter records by date range
   */
  filterByDateRange(records, startDate, endDate) {
    return records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }

  /**
   * Calculate total expenses
   */
  getTotalExpenses(records = this.records, dateRange = null) {
    let filteredRecords = records.filter(r => r.amount < 0 && r.type !== 'transfer');
    if (dateRange) {
      filteredRecords = this.filterByDateRange(filteredRecords, dateRange.start, dateRange.end);
    }
    return filteredRecords.reduce((sum, r) => sum + Math.abs(r.amount), 0);
  }

  /**
   * Calculate total income
   */
  getTotalIncome(records = this.records, dateRange = null) {
    let filteredRecords = records.filter(r => r.amount > 0);
    if (dateRange) {
      filteredRecords = this.filterByDateRange(filteredRecords, dateRange.start, dateRange.end);
    }
    return filteredRecords.reduce((sum, r) => sum + r.amount, 0);
  }

  /**
   * Calculate net balance
   */
  getNetBalance(records = this.records, dateRange = null) {
    return this.getTotalIncome(records, dateRange) - this.getTotalExpenses(records, dateRange);
  }

  /**
   * Get category-wise spending breakdown
   */
  getCategoryBreakdown(records = this.records, dateRange = null) {
    let filteredRecords = records.filter(r => r.amount < 0 && r.type !== 'transfer');
    if (dateRange) {
      filteredRecords = this.filterByDateRange(filteredRecords, dateRange.start, dateRange.end);
    }

    const breakdown = filteredRecords.reduce((acc, record) => {
      const amount = Math.abs(record.amount);
      acc[record.name] = (acc[record.name] || 0) + amount;
      return acc;
    }, {});

    // Convert to array with percentages
    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    return Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      formattedAmount: this.formatCurrency(amount)
    })).sort((a, b) => b.amount - a.amount);
  }

  /**
   * Get top spending categories
   */
  getTopCategories(limit = 5, records = this.records, dateRange = null) {
    return this.getCategoryBreakdown(records, dateRange).slice(0, limit);
  }

  /**
   * Calculate average transaction amount
   */
  getAverageTransaction(records = this.records, dateRange = null) {
    let filteredRecords = records.filter(r => r.amount < 0 && r.type !== 'transfer');
    if (dateRange) {
      filteredRecords = this.filterByDateRange(filteredRecords, dateRange.start, dateRange.end);
    }

    if (filteredRecords.length === 0) return 0;
    const total = filteredRecords.reduce((sum, r) => sum + Math.abs(r.amount), 0);
    return total / filteredRecords.length;
  }

  /**
   * Get spending trend (comparison with previous period)
   */
  getSpendingTrend(records = this.records) {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthExpenses = this.getTotalExpenses(
      records,
      { start: thisMonth, end: now }
    );

    const lastMonthExpenses = this.getTotalExpenses(
      records,
      { start: lastMonth, end: lastMonthEnd }
    );

    const change = thisMonthExpenses - lastMonthExpenses;
    const percentage = lastMonthExpenses > 0 
      ? ((change / lastMonthExpenses) * 100) 
      : 0;

    return {
      current: thisMonthExpenses,
      previous: lastMonthExpenses,
      change,
      percentage,
      direction: change > 0 ? 'increased' : change < 0 ? 'decreased' : 'stable',
      formattedCurrent: this.formatCurrency(thisMonthExpenses),
      formattedPrevious: this.formatCurrency(lastMonthExpenses),
      formattedChange: this.formatCurrency(Math.abs(change))
    };
  }

  /**
   * Get budget status for all budgets
   */
  getBudgetStatus(records = this.records) {
    const { start, end } = this.getCurrentMonthRange();
    const monthlyRecords = this.filterByDateRange(records, start, end);
    const categorySpending = this.getCategoryBreakdown(monthlyRecords);

    return Object.entries(this.budgets).map(([budgetName, budgetData]) => {
      const limit = typeof budgetData === 'object' ? budgetData.limit : budgetData;
      const categories = typeof budgetData === 'object' && budgetData.categories 
        ? budgetData.categories 
        : [budgetName];

      const spent = categories.reduce((sum, cat) => {
        const catSpending = categorySpending.find(c => c.category === cat);
        return sum + (catSpending ? catSpending.amount : 0);
      }, 0);

      const remaining = limit - spent;
      const percentage = (spent / limit) * 100;
      const status = percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'healthy';

      return {
        name: budgetName,
        limit,
        spent,
        remaining,
        percentage,
        status,
        categories,
        formattedLimit: this.formatCurrency(limit),
        formattedSpent: this.formatCurrency(spent),
        formattedRemaining: this.formatCurrency(remaining)
      };
    });
  }

  /**
   * Get savings rate
   */
  getSavingsRate(records = this.records, dateRange = null) {
    const income = this.getTotalIncome(records, dateRange);
    const expenses = this.getTotalExpenses(records, dateRange);

    if (income === 0) return 0;
    return ((income - expenses) / income) * 100;
  }

  /**
   * Get monthly comparison (last 6 months)
   */
  getMonthlyComparison(records = this.records, months = 6) {
    const monthlyData = [];
    const now = new Date();

    for (let i = 0; i < months; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const expenses = this.getTotalExpenses(
        records,
        { start: month, end: endOfMonth }
      );
      const income = this.getTotalIncome(
        records,
        { start: month, end: endOfMonth }
      );

      monthlyData.push({
        month: month.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
        expenses,
        income,
        balance: income - expenses,
        formattedExpenses: this.formatCurrency(expenses),
        formattedIncome: this.formatCurrency(income),
        formattedBalance: this.formatCurrency(income - expenses)
      });
    }

    return monthlyData.reverse();
  }

  /**
   * Detect unusual spending patterns
   */
  detectUnusualSpending(records = this.records) {
    const categoryBreakdown = this.getCategoryBreakdown(records);
    const avgTransaction = this.getAverageTransaction(records);
    const unusual = [];

    // Check for transactions significantly above average
    const highValueTransactions = records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .filter(r => Math.abs(r.amount) > avgTransaction * 3);

    if (highValueTransactions.length > 0) {
      unusual.push({
        type: 'high_value',
        count: highValueTransactions.length,
        transactions: highValueTransactions.slice(0, 5),
        message: `${highValueTransactions.length} transactions are 3x above your average`
      });
    }

    // Check for categories with unusually high spending
    categoryBreakdown.forEach(cat => {
      if (cat.percentage > 40) {
        unusual.push({
          type: 'category_dominance',
          category: cat.category,
          percentage: cat.percentage,
          message: `${cat.category} represents ${cat.percentage.toFixed(1)}% of your spending`
        });
      }
    });

    return unusual;
  }

  /**
   * Generate comprehensive financial summary
   */
  generateSummary(records = this.records) {
    const { start, end } = this.getCurrentMonthRange();
    const dateRange = { start, end };

    return {
      totalExpenses: this.getTotalExpenses(records, dateRange),
      totalIncome: this.getTotalIncome(records, dateRange),
      netBalance: this.getNetBalance(records, dateRange),
      savingsRate: this.getSavingsRate(records, dateRange),
      topCategories: this.getTopCategories(3, records, dateRange),
      spendingTrend: this.getSpendingTrend(records),
      budgetStatus: this.getBudgetStatus(records),
      unusualSpending: this.detectUnusualSpending(records),
      averageTransaction: this.getAverageTransaction(records, dateRange),
      monthlyComparison: this.getMonthlyComparison(records, 3)
    };
  }
}

export default AnalyticsEngine;
