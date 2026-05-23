/**
 * Financial Reasoning Engine
 * Processes user queries and determines the appropriate analysis
 * Uses rule-based reasoning with intent classification
 */

export class FinancialReasoningEngine {
  constructor(analyticsEngine) {
    this.analytics = analyticsEngine;
    this.intents = this.initializeIntents();
  }

  /**
   * Initialize intent patterns
   */
  initializeIntents() {
    return {
      total_expenses: {
        patterns: ['total expense', 'total spending', 'how much did i spend', 'spent overall', 'expenses total', 'where did most of my money go', 'biggest expenses'],
        priority: 1
      },
      total_income: {
        patterns: ['total income', 'total earnings', 'how much did i earn', 'income total', 'earned overall', 'how much income did i receive'],
        priority: 1
      },
      balance: {
        patterns: ['balance', 'current balance', 'how much money', 'net balance', 'savings balance', 'how much salary is left'],
        priority: 1
      },
      category_spending: {
        patterns: ['category', 'spending by category', 'breakdown', 'where did i spend', 'category wise', 'what category am i overspending on', 'which category increased'],
        priority: 2
      },
      time_period_spending: {
        patterns: ['this month', 'this week', 'this year', 'last month', 'last week', 'how much did i spend on', 'daily average', 'highest spending day', 'money wasted', 'unnecessary expenses'],
        priority: 2
      },
      budget_status: {
        patterns: ['budget', 'budget status', 'budget remaining', 'budget left', 'how much budget', 'can i afford', 'is my spending healthy', 'ideal monthly budget', 'am i exceeding my income', 'how much money can i safely spend'],
        priority: 2
      },
      savings_rate: {
        patterns: ['savings rate', 'saving rate', 'how much saving', 'savings percentage', 'save rate', 'why are my savings decreasing', 'how can i save more', 'how much can i save if i reduce', 'am i saving enough', 'how long will it take to save', 'improve financial habits'],
        priority: 2
      },
      spending_trend: {
        patterns: ['trend', 'spending trend', 'trend analysis', 'compare month', 'month comparison', 'compare my spending with last month'],
        priority: 2
      },
      insights: {
        patterns: ['insight', 'analysis', 'pattern', 'spending pattern', 'financial insight'],
        priority: 3
      },
      overspending: {
        patterns: ['overspend', 'over spending', 'spending too much', 'exceed budget', 'over budget'],
        priority: 2
      },
      recommendations: {
        patterns: ['recommend', 'suggestion', 'advice', 'how to save', 'save money', 'reduce spending'],
        priority: 3
      },
      predictions: {
        patterns: ['predict', 'forecast', 'next month', 'future spending', 'will i spend', 'what will my savings look like', 'will i run out of money', 'how much will i spend if this trend continues', 'can i reach my savings goal'],
        priority: 3
      },
      financial_health: {
        patterns: ['financial health', 'financially healthy', 'financial score', 'bad spending habits', 'am i improving financially', 'what should i change', 'how stable is my monthly spending', 'how am i doing financially'],
        priority: 3
      },
      income: {
        patterns: ['income', 'earn', 'earned', 'revenue', 'salary', 'what percentage of my income am i saving', 'how much money do i spend after receiving salary', 'how much income did i lose to expenses'],
        priority: 2
      },
      trend_detection: {
        patterns: ['what changed', 'what changed this month', 'category growing fastest', 'which expense repeats most often', 'what subscriptions', 'detect unusual expenses', 'did my food expenses increase'],
        priority: 2
      },
      coaching: {
        patterns: ['financial advice', 'become financially disciplined', 'what should i avoid spending on', 'suggest ways to reduce expenses', 'better money management', 'how do i stop impulse spending', '50/30/20 rule', 'should i invest or save'],
        priority: 3
      },
      conversational: {
        patterns: ['how am i doing', 'summarize my month', 'tell me about my spending', 'what should i focus on', "give me today's financial insight", 'do you think i spend too much', "what's your advice for me today"],
        priority: 3
      },
      goal_based: {
        patterns: ['can i save', 'help me plan for', 'how much should i save for a laptop', 'create a savings goal', 'track my emergency fund', 'can i afford emi'],
        priority: 3
      },
      recent_transactions: {
        patterns: ['recent', 'latest', 'last transaction', 'recent spending', 'latest expense'],
        priority: 1
      },
      monthly_summary: {
        patterns: ['monthly summary', 'month summary', 'this month', 'summary of month'],
        priority: 2
      },
      afford: {
        patterns: ['can i afford', 'afford to buy', 'should i buy', 'can i purchase'],
        priority: 3
      },
      help: {
        patterns: ['help', 'what can you do', 'capabilities', 'features', 'what can i ask'],
        priority: 0
      }
    };
  }

  /**
   * Classify user intent from query
   */
  classifyIntent(query) {
    const lowerQuery = query.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    for (const [intent, data] of Object.entries(this.intents)) {
      for (const pattern of data.patterns) {
        if (lowerQuery.includes(pattern)) {
          const score = pattern.length / lowerQuery.length;
          if (score > highestScore) {
            highestScore = score;
            bestMatch = intent;
          }
        }
      }
    }

    return bestMatch || 'general';
  }

  /**
   * Extract parameters from query
   */
  extractParameters(query, intent) {
    const params = {};
    const lowerQuery = query.toLowerCase();

    // Extract time period
    if (lowerQuery.includes('this month') || lowerQuery.includes('current month')) {
      params.period = 'this_month';
    } else if (lowerQuery.includes('last month') || lowerQuery.includes('previous month')) {
      params.period = 'last_month';
    } else if (lowerQuery.includes('this year') || lowerQuery.includes('current year')) {
      params.period = 'this_year';
    } else if (lowerQuery.includes('last year') || lowerQuery.includes('previous year')) {
      params.period = 'last_year';
    } else {
      params.period = 'this_month';
    }

    // Extract category
    const categoryMatch = lowerQuery.match(/on\s+(\w+)/);
    if (categoryMatch) {
      params.category = categoryMatch[1];
    }

    // Extract amount for affordability checks
    const amountMatch = query.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
    if (amountMatch) {
      params.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Extract item name for affordability
    if (intent === 'afford') {
      const itemMatch = query.match(/(?:buy|purchase|afford)\s+(.+?)(?:\s+(?:for|at|in)\s+\$?\d+)?$/i);
      if (itemMatch) {
        params.item = itemMatch[1].trim();
      }
    }

    return params;
  }

  /**
   * Get date range from parameters
   */
  getDateRange(params) {
    const now = new Date();
    
    switch (params.period) {
      case 'this_month':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now
        };
      case 'last_month':
        return {
          start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          end: new Date(now.getFullYear(), now.getMonth(), 0)
        };
      case 'this_year':
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: now
        };
      case 'last_year':
        return {
          start: new Date(now.getFullYear() - 1, 0, 1),
          end: new Date(now.getFullYear() - 1, 11, 31)
        };
      default:
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now
        };
    }
  }

  /**
   * Process query and return analysis result
   */
  processQuery(query, records) {
    const intent = this.classifyIntent(query);
    const params = this.extractParameters(query, intent);
    const dateRange = this.getDateRange(params);

    let result = {
      intent,
      params,
      dateRange,
      data: null,
      confidence: 0.8
    };

    switch (intent) {
      case 'total_expenses':
        result.data = {
          total: this.analytics.getTotalExpenses(records, dateRange),
          formatted: this.analytics.formatCurrency(
            this.analytics.getTotalExpenses(records, dateRange)
          )
        };
        break;

      case 'total_income':
        result.data = {
          total: this.analytics.getTotalIncome(records, dateRange),
          formatted: this.analytics.formatCurrency(
            this.analytics.getTotalIncome(records, dateRange)
          )
        };
        break;

      case 'balance':
        result.data = {
          balance: this.analytics.getNetBalance(records, dateRange),
          formatted: this.analytics.formatCurrency(
            this.analytics.getNetBalance(records, dateRange)
          )
        };
        break;

      case 'category_spending':
        result.data = {
          breakdown: this.analytics.getCategoryBreakdown(records, dateRange),
          topCategories: this.analytics.getTopCategories(5, records, dateRange)
        };
        break;

      case 'time_period_spending':
        result.data = this.analyzeTimePeriodSpending(query, records, dateRange, params);
        break;

      case 'budget_status':
        result.data = {
          budgets: this.analytics.getBudgetStatus(records)
        };
        break;

      case 'savings_rate':
        result.data = {
          rate: this.analytics.getSavingsRate(records, dateRange),
          formatted: `${this.analytics.getSavingsRate(records, dateRange).toFixed(1)}%`
        };
        break;

      case 'spending_trend':
        result.data = {
          trend: this.analytics.getSpendingTrend(records)
        };
        break;

      case 'insights':
        result.data = this.analytics.generateSummary(records);
        break;

      case 'overspending':
        result.data = {
          budgets: this.analytics.getBudgetStatus(records).filter(b => b.status === 'exceeded' || b.status === 'warning'),
          unusual: this.analytics.detectUnusualSpending(records)
        };
        break;

      case 'recommendations':
        result.data = this.generateRecommendations(records, dateRange);
        break;

      case 'predictions':
        result.data = this.generatePredictions(records, dateRange);
        break;

      case 'financial_health':
        result.data = this.assessFinancialHealth(records, dateRange);
        break;

      case 'income':
        result.data = this.analyzeIncome(query, records, dateRange, params);
        break;

      case 'trend_detection':
        result.data = this.detectTrends(query, records, dateRange);
        break;

      case 'coaching':
        result.data = this.generateCoachingAdvice(query, records, dateRange);
        break;

      case 'conversational':
        result.data = this.generateConversationalResponse(query, records, dateRange);
        break;

      case 'goal_based':
        result.data = this.handleGoalBasedQuery(query, records, dateRange, params);
        break;

      case 'recent_transactions':
        result.data = {
          transactions: records
            .filter(r => r.type !== 'transfer')
            .slice(0, 5)
            .map(r => ({
              ...r,
              formattedAmount: this.analytics.formatCurrency(Math.abs(r.amount))
            }))
        };
        break;

      case 'monthly_summary':
        result.data = this.analytics.generateSummary(records);
        break;

      case 'afford':
        result.data = this.checkAffordability(params.amount, records, dateRange);
        break;

      case 'help':
        result.data = this.getHelpInfo();
        break;

      default:
        result.data = this.analytics.generateSummary(records);
        result.intent = 'general';
    }

    return result;
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(records, dateRange) {
    const summary = this.analytics.generateSummary(records);
    const recommendations = [];

    // Budget recommendations
    const exceededBudgets = summary.budgetStatus.filter(b => b.status === 'exceeded');
    if (exceededBudgets.length > 0) {
      recommendations.push({
        type: 'budget',
        priority: 'high',
        message: `Consider reducing spending in ${exceededBudgets.map(b => b.name).join(', ')} to stay within budget`
      });
    }

    // Savings recommendations
    if (summary.savingsRate < 10) {
      recommendations.push({
        type: 'savings',
        priority: 'high',
        message: 'Your savings rate is below 10%. Try to save at least 20% of your income.'
      });
    } else if (summary.savingsRate < 20) {
      recommendations.push({
        type: 'savings',
        priority: 'medium',
        message: 'Good savings rate! Aim for 20% to build a stronger financial cushion.'
      });
    }

    // Category recommendations
    if (summary.topCategories.length > 0 && summary.topCategories[0].percentage > 40) {
      recommendations.push({
        type: 'category',
        priority: 'medium',
        message: `${summary.topCategories[0].category} takes up ${summary.topCategories[0].percentage.toFixed(1)}% of your spending. Consider diversifying.`
      });
    }

    // Trend recommendations
    if (summary.spendingTrend.percentage > 20) {
      recommendations.push({
        type: 'trend',
        priority: 'high',
        message: `Your spending increased by ${summary.spendingTrend.percentage.toFixed(1)}% compared to last month. Review your expenses.`
      });
    }

    return recommendations;
  }

  /**
   * Generate spending predictions
   */
  generatePredictions(records, dateRange) {
    const trend = this.analytics.getSpendingTrend(records);
    const monthlyComparison = this.analytics.getMonthlyComparison(records, 3);
    
    // Simple linear prediction based on trend
    const avgMonthlySpend = monthlyComparison.reduce((sum, m) => sum + m.expenses, 0) / monthlyComparison.length;
    const predictedNextMonth = avgMonthlySpend * (1 + (trend.percentage / 100));

    return {
      currentMonth: trend.current,
      predictedNextMonth: Math.max(0, predictedNextMonth),
      trendDirection: trend.direction,
      confidence: 0.7,
      formattedCurrent: this.analytics.formatCurrency(trend.current),
      formattedPredicted: this.analytics.formatCurrency(Math.max(0, predictedNextMonth))
    };
  }

  /**
   * Check affordability of a purchase
   */
  checkAffordability(amount, records, dateRange) {
    if (!amount) {
      return {
        affordable: false,
        message: 'Please specify the amount you want to spend.'
      };
    }

    const balance = this.analytics.getNetBalance(records, dateRange);
    const monthlyExpenses = this.analytics.getTotalExpenses(records, dateRange);
    const monthlyIncome = this.analytics.getTotalIncome(records, dateRange);
    const savingsRate = this.analytics.getSavingsRate(records, dateRange);

    let affordable = false;
    let message = '';
    let riskLevel = 'high';

    if (balance >= amount) {
      affordable = true;
      riskLevel = 'low';
      message = `Yes, you can afford this purchase. Your current balance is ${this.analytics.formatCurrency(balance)}.`;
    } else if (balance >= amount * 0.5) {
      affordable = true;
      riskLevel = 'medium';
      message = `You can afford this, but it will use ${((amount / balance) * 100).toFixed(1)}% of your balance.`;
    } else {
      affordable = false;
      message = `This purchase might be tight. Your current balance is ${this.analytics.formatCurrency(balance)} and this costs ${this.analytics.formatCurrency(amount)}.`;
    }

    // Consider savings rate
    if (savingsRate < 10 && affordable) {
      message += ' However, your savings rate is low. Consider building more savings first.';
    }

    return {
      affordable,
      riskLevel,
      amount,
      balance,
      savingsRate,
      message
    };
  }

  /**
   * Get help information
   */
  getHelpInfo() {
    return {
      capabilities: [
        'Track total expenses and income',
        'Analyze spending by category',
        'Check budget status',
        'View spending trends',
        'Get financial insights',
        'Receive savings recommendations',
        'Predict future spending',
        'Check if you can afford a purchase',
        'View recent transactions',
        'Get monthly summaries',
        'Assess financial health',
        'Analyze income patterns',
        'Detect spending trends',
        'Get financial coaching advice',
        'Plan for financial goals'
      ],
      examples: [
        'What are my total expenses?',
        'How is my budget status?',
        'Show me spending insights',
        'Can I afford a bike for $500?',
        'Compare this month with last month',
        'Where am I overspending?',
        'How financially healthy am I?',
        'What percentage of my income am I saving?',
        'What changed this month?',
        'Give me financial advice'
      ]
    };
  }

  /**
   * Analyze time period specific spending
   */
  analyzeTimePeriodSpending(query, records, dateRange, params) {
    const lowerQuery = query.toLowerCase();
    const breakdown = this.analytics.getCategoryBreakdown(records, dateRange);
    
    // Check for specific category
    if (params.category) {
      const categorySpending = breakdown.find(c => 
        c.category.toLowerCase().includes(params.category.toLowerCase())
      );
      return {
        category: params.category,
        amount: categorySpending ? categorySpending.amount : 0,
        formatted: categorySpending ? this.analytics.formatCurrency(categorySpending.amount) : this.analytics.formatCurrency(0),
        period: params.period
      };
    }

    // Check for daily average
    if (lowerQuery.includes('daily') || lowerQuery.includes('average daily')) {
      const totalExpenses = this.analytics.getTotalExpenses(records, dateRange);
      const days = Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24)) || 1;
      const dailyAverage = totalExpenses / days;
      return {
        totalExpenses,
        formattedTotal: this.analytics.formatCurrency(totalExpenses),
        dailyAverage,
        formattedDaily: this.analytics.formatCurrency(dailyAverage),
        period: params.period
      };
    }

    // Check for highest spending day
    if (lowerQuery.includes('highest') && lowerQuery.includes('day')) {
      const dailySpending = {};
      records.forEach(r => {
        if (r.amount < 0 && r.type !== 'transfer') {
          const date = new Date(r.date).toDateString();
          dailySpending[date] = (dailySpending[date] || 0) + Math.abs(r.amount);
        }
      });
      
      const sortedDays = Object.entries(dailySpending).sort((a, b) => b[1] - a[1]);
      const highestDay = sortedDays[0];
      
      return {
        date: highestDay ? highestDay[0] : 'N/A',
        amount: highestDay ? highestDay[1] : 0,
        formatted: highestDay ? this.analytics.formatCurrency(highestDay[1]) : this.analytics.formatCurrency(0)
      };
    }

    // Default: return period spending
    return {
      total: this.analytics.getTotalExpenses(records, dateRange),
      formatted: this.analytics.formatCurrency(this.analytics.getTotalExpenses(records, dateRange)),
      period: params.period,
      breakdown
    };
  }

  /**
   * Assess financial health
   */
  assessFinancialHealth(records, dateRange) {
    const summary = this.analytics.generateSummary(records);
    const savingsRate = this.analytics.getSavingsRate(records, dateRange);
    const budgetStatus = this.analytics.getBudgetStatus(records);
    const trend = this.analytics.getSpendingTrend(records);
    
    let score = 0;
    const factors = [];

    // Savings rate factor (0-30 points)
    if (savingsRate >= 20) {
      score += 30;
      factors.push({ name: 'Savings Rate', score: 30, status: 'excellent' });
    } else if (savingsRate >= 10) {
      score += 20;
      factors.push({ name: 'Savings Rate', score: 20, status: 'good' });
    } else if (savingsRate >= 5) {
      score += 10;
      factors.push({ name: 'Savings Rate', score: 10, status: 'fair' });
    } else {
      factors.push({ name: 'Savings Rate', score: 0, status: 'poor' });
    }

    // Budget adherence factor (0-25 points)
    const exceededBudgets = budgetStatus.filter(b => b.status === 'exceeded').length;
    if (exceededBudgets === 0) {
      score += 25;
      factors.push({ name: 'Budget Adherence', score: 25, status: 'excellent' });
    } else if (exceededBudgets <= 1) {
      score += 15;
      factors.push({ name: 'Budget Adherence', score: 15, status: 'good' });
    } else {
      score += 5;
      factors.push({ name: 'Budget Adherence', score: 5, status: 'poor' });
    }

    // Spending stability factor (0-25 points)
    if (trend.percentage >= -10 && trend.percentage <= 10) {
      score += 25;
      factors.push({ name: 'Spending Stability', score: 25, status: 'excellent' });
    } else if (trend.percentage >= -20 && trend.percentage <= 20) {
      score += 15;
      factors.push({ name: 'Spending Stability', score: 15, status: 'good' });
    } else {
      score += 5;
      factors.push({ name: 'Spending Stability', score: 5, status: 'poor' });
    }

    // Income diversity factor (0-20 points)
    const incomeSources = new Set(records.filter(r => r.amount > 0).map(r => r.name)).size;
    if (incomeSources >= 2) {
      score += 20;
      factors.push({ name: 'Income Diversity', score: 20, status: 'excellent' });
    } else if (incomeSources === 1) {
      score += 10;
      factors.push({ name: 'Income Diversity', score: 10, status: 'fair' });
    } else {
      factors.push({ name: 'Income Diversity', score: 0, status: 'poor' });
    }

    let healthLevel = 'poor';
    if (score >= 80) healthLevel = 'excellent';
    else if (score >= 60) healthLevel = 'good';
    else if (score >= 40) healthLevel = 'fair';

    return {
      score,
      healthLevel,
      factors,
      savingsRate,
      budgetStatus,
      spendingTrend: trend
    };
  }

  /**
   * Analyze income patterns
   */
  analyzeIncome(query, records, dateRange, params) {
    const lowerQuery = query.toLowerCase();
    const totalIncome = this.analytics.getTotalIncome(records, dateRange);
    const totalExpenses = this.analytics.getTotalExpenses(records, dateRange);
    const savingsRate = this.analytics.getSavingsRate(records, dateRange);
    
    // Check for percentage of income saved
    if (lowerQuery.includes('percentage') && lowerQuery.includes('saving')) {
      return {
        savingsRate,
        formatted: `${savingsRate.toFixed(1)}%`,
        totalIncome,
        formattedIncome: this.analytics.formatCurrency(totalIncome),
        totalExpenses,
        formattedExpenses: this.analytics.formatCurrency(totalExpenses)
      };
    }

    // Check for salary left
    if (lowerQuery.includes('salary') && lowerQuery.includes('left')) {
      const balance = this.analytics.getNetBalance(records, dateRange);
      return {
        balance,
        formatted: this.analytics.formatCurrency(balance),
        totalIncome,
        formattedIncome: this.analytics.formatCurrency(totalIncome),
        expensesAfterIncome: totalExpenses,
        formattedExpenses: this.analytics.formatCurrency(totalExpenses)
      };
    }

    // Check for income lost to expenses
    if (lowerQuery.includes('lost') || lowerQuery.includes('expense')) {
      const incomeLost = totalExpenses;
      const percentageLost = totalIncome > 0 ? (incomeLost / totalIncome) * 100 : 0;
      return {
        incomeLost,
        formattedLost: this.analytics.formatCurrency(incomeLost),
        percentageLost: percentageLost.toFixed(1),
        totalIncome,
        formattedIncome: this.analytics.formatCurrency(totalIncome)
      };
    }

    // Default income analysis
    return {
      totalIncome,
      formatted: this.analytics.formatCurrency(totalIncome),
      period: params.period,
      savingsRate,
      formattedSavingsRate: `${savingsRate.toFixed(1)}%`
    };
  }

  /**
   * Detect trends and changes
   */
  detectTrends(query, records, dateRange) {
    const lowerQuery = query.toLowerCase();
    const trend = this.analytics.getSpendingTrend(records);
    const breakdown = this.analytics.getCategoryBreakdown(records, dateRange);
    
    // Find fastest growing category
    const monthlyComparison = this.analytics.getMonthlyComparison(records, 3);
    const categoryGrowth = {};
    
    monthlyComparison.forEach(month => {
      Object.entries(month.categoryBreakdown || {}).forEach(([cat, amount]) => {
        categoryGrowth[cat] = categoryGrowth[cat] || [];
        categoryGrowth[cat].push(amount);
      });
    });

    const growthRates = Object.entries(categoryGrowth).map(([cat, amounts]) => {
      if (amounts.length < 2) return { category: cat, growth: 0 };
      const growth = ((amounts[amounts.length - 1] - amounts[0]) / amounts[0]) * 100;
      return { category: cat, growth };
    }).sort((a, b) => b.growth - a.growth);

    // Detect recurring expenses
    const recurring = {};
    records.forEach(r => {
      if (r.amount < 0 && r.type !== 'transfer') {
        const key = `${r.name}_${Math.abs(r.amount)}`;
        recurring[key] = (recurring[key] || 0) + 1;
      }
    });
    
    const recurringExpenses = Object.entries(recurring)
      .filter(([_, count]) => count >= 2)
      .map(([key, count]) => {
        const [name, amount] = key.split('_');
        return { name, amount: parseFloat(amount), count };
      })
      .sort((a, b) => b.count - a.count);

    // Detect unusual expenses
    const unusual = this.analytics.detectUnusualSpending(records);

    return {
      overallTrend: trend,
      fastestGrowingCategory: growthRates[0] || null,
      recurringExpenses: recurringExpenses.slice(0, 5),
      unusualExpenses: unusual
    };
  }

  /**
   * Generate coaching advice
   */
  generateCoachingAdvice(query, records, dateRange) {
    const lowerQuery = query.toLowerCase();
    const summary = this.analytics.generateSummary(records);
    const advice = [];

    // 50/30/20 rule
    if (lowerQuery.includes('50/30/20') || lowerQuery.includes('50 30 20')) {
      const totalIncome = this.analytics.getTotalIncome(records, dateRange);
      const needs = totalIncome * 0.5;
      const wants = totalIncome * 0.3;
      const savings = totalIncome * 0.2;
      
      advice.push({
        type: 'rule',
        title: '50/30/20 Rule',
        message: `The 50/30/20 rule suggests: 50% for needs (${this.analytics.formatCurrency(needs)}), 30% for wants (${this.analytics.formatCurrency(wants)}), and 20% for savings (${this.analytics.formatCurrency(savings)}).`
      });
    }

    // Impulse spending
    if (lowerQuery.includes('impulse')) {
      advice.push({
        type: 'impulse',
        title: 'Stop Impulse Spending',
        message: 'Wait 24 hours before making non-essential purchases. Use the 30-day rule for larger items. Unsubscribe from marketing emails to reduce temptation.'
      });
    }

    // Financial discipline
    if (lowerQuery.includes('disciplined')) {
      advice.push({
        type: 'discipline',
        title: 'Financial Discipline Tips',
        message: 'Set automatic transfers to savings. Track every expense. Review your spending weekly. Set clear financial goals and celebrate milestones.'
      });
    }

    // What to avoid
    if (lowerQuery.includes('avoid')) {
      const topCategory = summary.topCategories[0];
      advice.push({
        type: 'avoid',
        title: 'Spending to Avoid',
        message: topCategory 
          ? `Your highest spending category is ${topCategory.category}. Consider setting a strict limit here and look for cheaper alternatives.`
          : 'Focus on reducing discretionary spending like dining out, subscriptions, and impulse purchases.'
      });
    }

    // Invest vs save
    if (lowerQuery.includes('invest') || lowerQuery.includes('save')) {
      advice.push({
        type: 'invest_save',
        title: 'Invest vs Save',
        message: 'Build an emergency fund first (3-6 months expenses). Then consider low-risk investments for long-term goals. High-interest debt should be paid off before investing.'
      });
    }

    // General advice
    if (advice.length === 0) {
      if (summary.savingsRate < 20) {
        advice.push({
          type: 'savings',
          title: 'Increase Savings',
          message: 'Try to increase your savings rate to at least 20% of your income. Start small and gradually increase.'
        });
      }
      
      const exceededBudgets = summary.budgetStatus.filter(b => b.status === 'exceeded');
      if (exceededBudgets.length > 0) {
        advice.push({
          type: 'budget',
          title: 'Budget Control',
          message: `Review your spending in ${exceededBudgets.map(b => b.name).join(', ')}. Consider setting stricter limits or finding alternatives.`
        });
      }

      advice.push({
        type: 'general',
        title: 'Financial Wellness',
        message: 'Track your spending regularly, set clear financial goals, build an emergency fund, and avoid high-interest debt.'
      });
    }

    return advice;
  }

  /**
   * Generate conversational response
   */
  generateConversationalResponse(query, records, dateRange) {
    const lowerQuery = query.toLowerCase();
    const summary = this.analytics.generateSummary(records);
    
    if (lowerQuery.includes('how am i doing') || lowerQuery.includes('financially')) {
      const health = this.assessFinancialHealth(records, dateRange);
      return {
        type: 'status',
        message: `Your financial health is ${health.healthLevel} with a score of ${health.score}/100. Your savings rate is ${health.savingsRate.toFixed(1)}%.`,
        health
      };
    }

    if (lowerQuery.includes('summarize') || lowerQuery.includes('month')) {
      return {
        type: 'summary',
        message: `This month you spent ${this.analytics.formatCurrency(summary.totalExpenses)} and earned ${this.analytics.formatCurrency(summary.totalIncome)}. Your savings rate is ${summary.savingsRate.toFixed(1)}%.`,
        summary
      };
    }

    if (lowerQuery.includes('focus')) {
      const exceededBudgets = summary.budgetStatus.filter(b => b.status === 'exceeded');
      if (exceededBudgets.length > 0) {
        return {
          type: 'focus',
          message: `Focus on controlling spending in ${exceededBudgets.map(b => b.name).join(', ')} where you've exceeded your budget.`
        };
      }
      if (summary.savingsRate < 20) {
        return {
          type: 'focus',
          message: 'Focus on increasing your savings rate. Try to save at least 20% of your income.'
        };
      }
      return {
        type: 'focus',
        message: 'You\'re doing well! Focus on maintaining your current habits and consider investing for long-term goals.'
      };
    }

    if (lowerQuery.includes('today') || lowerQuery.includes('insight')) {
      const today = new Date();
      const todayRecords = records.filter(r => 
        new Date(r.date).toDateString() === today.toDateString()
      );
      const todaySpending = todayRecords
        .filter(r => r.amount < 0 && r.type !== 'transfer')
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);
      
      return {
        type: 'daily',
        message: todaySpending > 0 
          ? `Today you spent ${this.analytics.formatCurrency(todaySpending)}.`
          : 'No spending recorded today.',
        todaySpending,
        formatted: this.analytics.formatCurrency(todaySpending)
      };
    }

    // Default conversational response
    return {
      type: 'general',
      message: 'I\'m here to help you understand your finances better. Ask me about your spending, savings, budget, or financial health.',
      summary
    };
  }

  /**
   * Handle goal-based queries
   */
  handleGoalBasedQuery(query, records, dateRange, params) {
    const lowerQuery = query.toLowerCase();
    const summary = this.analytics.generateSummary(records);
    const monthlySavings = summary.totalIncome - summary.totalExpenses;
    
    // Extract goal amount
    const amountMatch = query.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
    const goalAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;
    
    // Extract time period
    const timeMatch = query.match(/(\d+)\s*(month|months|year|years|week|weeks)/i);
    const timePeriod = timeMatch ? { amount: parseInt(timeMatch[1]), unit: timeMatch[2].toLowerCase() } : null;

    if (goalAmount && timePeriod) {
      const monthsNeeded = timePeriod.unit.includes('year') 
        ? timePeriod.amount * 12 
        : timePeriod.unit.includes('week')
        ? timePeriod.amount / 4
        : timePeriod.amount;
      
      const requiredMonthlySavings = goalAmount / monthsNeeded;
      const canAchieve = monthlySavings >= requiredMonthlySavings;
      
      return {
        type: 'goal_analysis',
        goalAmount,
        formattedGoal: this.analytics.formatCurrency(goalAmount),
        timePeriod,
        requiredMonthlySavings,
        formattedRequired: this.analytics.formatCurrency(requiredMonthlySavings),
        currentMonthlySavings: monthlySavings,
        formattedCurrent: this.analytics.formatCurrency(monthlySavings),
        canAchieve,
        message: canAchieve
          ? `Yes, you can save ${this.analytics.formatCurrency(goalAmount)} in ${timePeriod.amount} ${timePeriod.unit}. You need to save ${this.analytics.formatCurrency(requiredMonthlySavings)} per month, and you're currently saving ${this.analytics.formatCurrency(monthlySavings)}.`
          : `To save ${this.analytics.formatCurrency(goalAmount)} in ${timePeriod.amount} ${timePeriod.unit}, you need to save ${this.analytics.formatCurrency(requiredMonthlySavings)} per month. You're currently saving ${this.analytics.formatCurrency(monthlySavings)}, so you'd need to increase your savings by ${this.analytics.formatCurrency(requiredMonthlySavings - monthlySavings)} per month.`
      };
    }

    if (lowerQuery.includes('emergency')) {
      const currentBalance = this.analytics.getNetBalance(records, dateRange);
      const emergencyFundGoal = summary.totalExpenses * 3; // 3 months
      const progress = (currentBalance / emergencyFundGoal) * 100;
      
      return {
        type: 'emergency_fund',
        currentBalance,
        formattedBalance: this.analytics.formatCurrency(currentBalance),
        goalAmount: emergencyFundGoal,
        formattedGoal: this.analytics.formatCurrency(emergencyFundGoal),
        progress: Math.min(progress, 100).toFixed(1),
        message: `Your emergency fund is ${progress.toFixed(1)}% complete. You have ${this.analytics.formatCurrency(currentBalance)} of the recommended ${this.analytics.formatCurrency(emergencyFundGoal)} (3 months of expenses).`
      };
    }

    if (lowerQuery.includes('emi')) {
      const amountMatch = query.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
      const emiAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;
      
      if (emiAmount) {
        const monthlyIncome = summary.totalIncome;
        const monthlyExpenses = summary.totalExpenses;
        const availableForEMI = monthlyIncome - monthlyExpenses;
        const canAffordEMI = availableForEMI >= emiAmount;
        const emiRatio = (emiAmount / monthlyIncome) * 100;
        
        return {
          type: 'emi_check',
          emiAmount,
          formattedEMI: this.analytics.formatCurrency(emiAmount),
          availableForEMI,
          formattedAvailable: this.analytics.formatCurrency(availableForEMI),
          canAffordEMI,
          emiRatio: emiRatio.toFixed(1),
          message: canAffordEMI
            ? `Yes, you can afford an EMI of ${this.analytics.formatCurrency(emiAmount)}. This represents ${emiRatio.toFixed(1)}% of your monthly income.`
            : `An EMI of ${this.analytics.formatCurrency(emiAmount)} might be tight. You have ${this.analytics.formatCurrency(availableForEMI)} available after expenses. Consider a lower EMI amount.`
        };
      }
    }

    // Default goal response
    return {
      type: 'goal_help',
      message: 'I can help you plan for financial goals. Tell me the amount you want to save and the time period, and I\'ll calculate if it\'s achievable.',
      examples: [
        'Can I save ₹50,000 in 6 months?',
        'How much should I save for a laptop?',
        'Can I afford EMI of ₹5,000?'
      ]
    };
  }
}

export default FinancialReasoningEngine;
