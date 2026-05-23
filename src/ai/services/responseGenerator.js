/**
 * Response Generator
 * Generates natural language responses based on analysis results
 * Uses template-based approach with dynamic data insertion
 */

export class ResponseGenerator {
  constructor(currency = 'USD') {
    this.currency = currency;
    this.templates = this.initializeTemplates();
  }

  /**
   * Initialize response templates
   */
  initializeTemplates() {
    return {
      total_expenses: [
        "Your total expenses are {amount}. {period_context}",
        "You've spent {amount} {period}. {comparison}",
        "Your spending totals {amount} for {period}."
      ],
      total_income: [
        "Your total income is {amount}. {period_context}",
        "You've earned {amount} {period}. {comparison}",
        "Your income totals {amount} for {period}."
      ],
      balance: [
        "Your current balance is {amount}. {savings_context}",
        "You have {amount} available. {savings_context}",
        "Your net balance stands at {amount}. {savings_context}"
      ],
      category_spending: [
        "Here's your spending breakdown: {categories}",
        "Your spending by category: {categories}",
        "Category-wise breakdown: {categories}"
      ],
      time_period_spending: [
        "{spending_analysis}",
        "{spending_analysis}",
        "{spending_analysis}"
      ],
      budget_status: [
        "Budget status: {budgets}",
        "Here's how you're doing with your budgets: {budgets}",
        "Budget overview: {budgets}"
      ],
      savings_rate: [
        "Your savings rate is {rate}. {recommendation}",
        "You're saving {rate} of your income. {recommendation}",
        "Savings rate: {rate}. {recommendation}"
      ],
      spending_trend: [
        "Your spending has {direction} by {change} compared to last month.",
        "Compared to last month, your spending {direction} by {change}.",
        "Month-over-month: spending {direction} by {change}."
      ],
      insights: [
        "Here are your financial insights:\n{insights}",
        "Key findings from your data:\n{insights}",
        "Financial analysis highlights:\n{insights}"
      ],
      overspending: [
        "Overspending alerts:\n{alerts}",
        "Areas where you're over budget:\n{alerts}",
        "Budget warnings:\n{alerts}"
      ],
      recommendations: [
        "Here are my recommendations:\n{recommendations}",
        "Financial advice:\n{recommendations}",
        "Suggestions to improve your finances:\n{recommendations}"
      ],
      predictions: [
        "Based on your spending patterns, I predict you'll spend {predicted} next month. {confidence}",
        "Spending forecast: {predicted} for next month ({confidence} confidence).",
        "Next month prediction: {predicted}. {confidence}"
      ],
      financial_health: [
        "Your financial health is {health_level} with a score of {score}/100.\n{factors}",
        "Financial Score: {score}/100 ({health_level})\n{factors}",
        "Health Assessment: {health_level} ({score}/100)\n{factors}"
      ],
      income: [
        "{income_analysis}",
        "{income_analysis}",
        "{income_analysis}"
      ],
      trend_detection: [
        "{trend_analysis}",
        "{trend_analysis}",
        "{trend_analysis}"
      ],
      coaching: [
        "{coaching_advice}",
        "{coaching_advice}",
        "{coaching_advice}"
      ],
      conversational: [
        "{conversational_response}",
        "{conversational_response}",
        "{conversational_response}"
      ],
      goal_based: [
        "{goal_response}",
        "{goal_response}",
        "{goal_response}"
      ],
      recent_transactions: [
        "Your recent transactions:\n{transactions}",
        "Latest spending:\n{transactions}",
        "Recent activity:\n{transactions}"
      ],
      monthly_summary: [
        "Monthly summary:\n{summary}",
        "This month's overview:\n{summary}",
        "Monthly financial report:\n{summary}"
      ],
      afford: [
        "{affordability_message}",
        "{affordability_message}",
        "{affordability_message}"
      ],
      help: [
        "I can help you with:\n{capabilities}\n\nTry asking:\n{examples}",
        "Here's what I can do:\n{capabilities}\n\nExample questions:\n{examples}",
        "My capabilities:\n{capabilities}\n\nSample queries:\n{examples}"
      ],
      general: [
        "Based on your data, here's what I found:\n{summary}",
        "Here's an analysis of your finances:\n{summary}",
        "Financial overview:\n{summary}"
      ],
      greeting: [
        "Hello! I'm your AI financial assistant. I can help you analyze your spending, track budgets, and provide personalized financial advice. Ask me anything about your finances!",
        "Hi there! I'm here to help you understand your spending patterns and make better financial decisions. What would you like to know?",
        "Welcome! I can analyze your expense data, provide insights, and answer questions about your finances. How can I help you today?"
      ],
      error: [
        "I couldn't understand that. Try asking about your expenses, income, budget, or savings.",
        "I'm not sure what you mean. You can ask me about your spending, income, budget status, or financial insights.",
        "Let me help you better. Try asking about your expenses, income, budget, or savings."
      ]
    };
  }

  /**
   * Get random template for intent
   */
  getTemplate(intent) {
    const templates = this.templates[intent] || this.templates.general;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency
    }).format(amount);
  }

  /**
   * Generate response based on analysis result
   */
  generateResponse(analysisResult) {
    const { intent, data, params } = analysisResult;
    const template = this.getTemplate(intent);

    switch (intent) {
      case 'total_expenses':
        return this.generateTotalExpensesResponse(template, data, params);
      case 'total_income':
        return this.generateTotalIncomeResponse(template, data, params);
      case 'balance':
        return this.generateBalanceResponse(template, data, params);
      case 'category_spending':
        return this.generateCategoryResponse(template, data);
      case 'time_period_spending':
        return this.generateTimePeriodSpendingResponse(template, data);
      case 'budget_status':
        return this.generateBudgetResponse(template, data);
      case 'savings_rate':
        return this.generateSavingsRateResponse(template, data);
      case 'spending_trend':
        return this.generateTrendResponse(template, data);
      case 'insights':
        return this.generateInsightsResponse(template, data);
      case 'overspending':
        return this.generateOverspendingResponse(template, data);
      case 'recommendations':
        return this.generateRecommendationsResponse(template, data);
      case 'predictions':
        return this.generatePredictionsResponse(template, data);
      case 'financial_health':
        return this.generateFinancialHealthResponse(template, data);
      case 'income':
        return this.generateIncomeResponse(template, data);
      case 'trend_detection':
        return this.generateTrendDetectionResponse(template, data);
      case 'coaching':
        return this.generateCoachingResponse(template, data);
      case 'conversational':
        return this.generateConversationalResponse(template, data);
      case 'goal_based':
        return this.generateGoalBasedResponse(template, data);
      case 'recent_transactions':
        return this.generateRecentTransactionsResponse(template, data);
      case 'monthly_summary':
        return this.generateMonthlySummaryResponse(template, data);
      case 'afford':
        return this.generateAffordResponse(template, data);
      case 'help':
        return this.generateHelpResponse(template, data);
      default:
        return this.generateGeneralResponse(template, data);
    }
  }

  /**
   * Generate total expenses response
   */
  generateTotalExpensesResponse(template, data, params) {
    const periodContext = this.getPeriodContext(params.period);
    const comparison = this.getComparisonContext(data.total);

    return template
      .replace('{amount}', data.formatted)
      .replace('{period_context}', periodContext)
      .replace('{comparison}', comparison)
      .replace('{period}', this.getPeriodLabel(params.period));
  }

  /**
   * Generate total income response
   */
  generateTotalIncomeResponse(template, data, params) {
    const periodContext = this.getPeriodContext(params.period);
    const comparison = this.getComparisonContext(data.total);

    return template
      .replace('{amount}', data.formatted)
      .replace('{period_context}', periodContext)
      .replace('{comparison}', comparison)
      .replace('{period}', this.getPeriodLabel(params.period));
  }

  /**
   * Generate balance response
   */
  generateBalanceResponse(template, data, params) {
    const savingsContext = data.balance >= 0 
      ? 'You\'re in a positive position!'
      : 'You\'re spending more than you earn.';

    return template
      .replace('{amount}', data.formatted)
      .replace('{savings_context}', savingsContext);
  }

  /**
   * Generate category spending response
   */
  generateCategoryResponse(template, data) {
    const categories = data.topCategories
      .slice(0, 5)
      .map(cat => `• ${cat.category}: ${cat.formattedAmount} (${cat.percentage.toFixed(1)}%)`)
      .join('\n');

    return template.replace('{categories}', categories);
  }

  /**
   * Generate budget status response
   */
  generateBudgetResponse(template, data) {
    const budgets = data.budgets
      .map(b => {
        const icon = b.status === 'exceeded' ? '❌' : b.status === 'warning' ? '⚠️' : '✅';
        return `${icon} ${b.name}: ${b.formattedSpent}/${b.formattedLimit} (${b.percentage.toFixed(0)}%)`;
      })
      .join('\n');

    return template.replace('{budgets}', budgets);
  }

  /**
   * Generate savings rate response
   */
  generateSavingsRateResponse(template, data) {
    let recommendation = '';
    if (data.rate < 10) {
      recommendation = 'Try to save at least 20% of your income.';
    } else if (data.rate < 20) {
      recommendation = 'Good progress! Aim for 20% to build a stronger financial cushion.';
    } else {
      recommendation = 'Excellent! You\'re building a healthy financial foundation.';
    }

    return template
      .replace('{rate}', data.formatted)
      .replace('{recommendation}', recommendation);
  }

  /**
   * Generate spending trend response
   */
  generateTrendResponse(template, data) {
    return template
      .replace('{direction}', data.direction)
      .replace('{change}', data.formattedChange);
  }

  /**
   * Generate insights response
   */
  generateInsightsResponse(template, data) {
    const insights = [];

    // Balance insight
    insights.push(`💰 Net Balance: ${this.formatCurrency(data.netBalance)}`);

    // Savings rate insight
    insights.push(`📈 Savings Rate: ${data.savingsRate.toFixed(1)}%`);

    // Top category insight
    if (data.topCategories.length > 0) {
      insights.push(`🏷️ Top Category: ${data.topCategories[0].category} (${data.topCategories[0].percentage.toFixed(1)}%)`);
    }

    // Trend insight
    insights.push(`📊 Spending Trend: ${data.spendingTrend.direction} by ${data.spendingTrend.formattedChange}`);

    // Budget status
    const exceededBudgets = data.budgetStatus.filter(b => b.status === 'exceeded');
    if (exceededBudgets.length > 0) {
      insights.push(`⚠️ Over Budget: ${exceededBudgets.map(b => b.name).join(', ')}`);
    }

    // Unusual spending
    if (data.unusualSpending.length > 0) {
      insights.push(`🔍 Unusual Patterns: ${data.unusualSpending.length} detected`);
    }

    return template.replace('{insights}', insights.join('\n'));
  }

  /**
   * Generate overspending response
   */
  generateOverspendingResponse(template, data) {
    const alerts = [];

    if (data.budgets.length > 0) {
      data.budgets.forEach(b => {
        alerts.push(`⚠️ ${b.name}: ${b.formattedSpent}/${b.formattedLimit} (${b.percentage.toFixed(0)}%)`);
      });
    }

    if (data.unusual.length > 0) {
      data.unusual.forEach(u => {
        alerts.push(`🔍 ${u.message}`);
      });
    }

    if (alerts.length === 0) {
      alerts.push('✅ No overspending detected. Great job!');
    }

    return template.replace('{alerts}', alerts.join('\n'));
  }

  /**
   * Generate recommendations response
   */
  generateRecommendationsResponse(template, data) {
    const recommendations = data.map((rec, index) => {
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      return `${priority} ${rec.message}`;
    });

    return template.replace('{recommendations}', recommendations.join('\n'));
  }

  /**
   * Generate predictions response
   */
  generatePredictionsResponse(template, data) {
    const confidence = data.confidence >= 0.8 ? 'high' : data.confidence >= 0.6 ? 'moderate' : 'low';
    const confidenceText = `${confidence} confidence`;

    return template
      .replace('{predicted}', data.formattedPredicted)
      .replace('{confidence}', confidenceText);
  }

  /**
   * Generate recent transactions response
   */
  generateRecentTransactionsResponse(template, data) {
    const transactions = data.transactions
      .map(t => `• ${t.name}: ${t.formattedAmount}`)
      .join('\n');

    return template.replace('{transactions}', transactions);
  }

  /**
   * Generate monthly summary response
   */
  generateMonthlySummaryResponse(template, data) {
    const summary = [
      `💰 Total Expenses: ${this.formatCurrency(data.totalExpenses)}`,
      `💵 Total Income: ${this.formatCurrency(data.totalIncome)}`,
      `📊 Net Balance: ${this.formatCurrency(data.netBalance)}`,
      `📈 Savings Rate: ${data.savingsRate.toFixed(1)}%`,
      `📊 Spending Trend: ${data.spendingTrend.direction} by ${data.spendingTrend.formattedChange}`
    ];

    if (data.topCategories.length > 0) {
      summary.push(`🏷️ Top Category: ${data.topCategories[0].category}`);
    }

    return template.replace('{summary}', summary.join('\n'));
  }

  /**
   * Generate affordability response
   */
  generateAffordResponse(template, data) {
    return template.replace('{affordability_message}', data.message);
  }

  /**
   * Generate help response
   */
  generateHelpResponse(template, data) {
    const capabilities = data.capabilities.map(c => `• ${c}`).join('\n');
    const examples = data.examples.map(e => `• "${e}"`).join('\n');

    return template
      .replace('{capabilities}', capabilities)
      .replace('{examples}', examples);
  }

  /**
   * Generate general response
   */
  generateGeneralResponse(template, data) {
    const summary = [
      `💰 Total Expenses: ${this.formatCurrency(data.totalExpenses)}`,
      `💵 Total Income: ${this.formatCurrency(data.totalIncome)}`,
      `📊 Net Balance: ${this.formatCurrency(data.netBalance)}`,
      `📈 Savings Rate: ${data.savingsRate.toFixed(1)}%`
    ];

    return template.replace('{summary}', summary.join('\n'));
  }

  /**
   * Get period context
   */
  getPeriodContext(period) {
    const contexts = {
      this_month: 'for this month',
      last_month: 'for last month',
      this_year: 'for this year',
      last_year: 'for last year'
    };
    return contexts[period] || 'overall';
  }

  /**
   * Get period label
   */
  getPeriodLabel(period) {
    const labels = {
      this_month: 'this month',
      last_month: 'last month',
      this_year: 'this year',
      last_year: 'last year'
    };
    return labels[period] || 'this period';
  }

  /**
   * Get comparison context
   */
  getComparisonContext(amount) {
    if (amount > 1000) {
      return 'This is a significant amount.';
    } else if (amount > 500) {
      return 'This is moderate spending.';
    } else {
      return 'This is relatively low.';
    }
  }

  /**
   * Generate greeting message
   */
  generateGreeting() {
    const templates = this.templates.greeting;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate error message
   */
  generateError() {
    const templates = this.templates.error;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate time period spending response
   */
  generateTimePeriodSpendingResponse(template, data) {
    let analysis = '';
    
    if (data.category) {
      analysis = `You spent ${data.formatted} on ${data.category} ${data.period || 'this period'}.`;
    } else if (data.dailyAverage !== undefined) {
      analysis = `Your daily average spending is ${data.formattedDaily}. Total spending: ${data.formattedTotal}.`;
    } else if (data.date) {
      analysis = `Your highest spending day was ${data.date} with ${data.formatted}.`;
    } else {
      analysis = `Your total spending ${data.period || 'this period'} is ${data.formatted}.`;
    }
    
    return template.replace('{spending_analysis}', analysis);
  }

  /**
   * Generate financial health response
   */
  generateFinancialHealthResponse(template, data) {
    const factors = data.factors.map(f => {
      const icon = f.status === 'excellent' ? '✅' : f.status === 'good' ? '🟢' : f.status === 'fair' ? '🟡' : '🔴';
      return `${icon} ${f.name}: ${f.score}/100 (${f.status})`;
    }).join('\n');
    
    return template
      .replace('{health_level}', data.healthLevel)
      .replace('{score}', data.score)
      .replace('{factors}', factors);
  }

  /**
   * Generate income response
   */
  generateIncomeResponse(template, data) {
    let analysis = '';
    
    if (data.savingsRate !== undefined) {
      analysis = `You're saving ${data.formatted} of your income. Total income: ${data.formattedIncome}, Total expenses: ${data.formattedExpenses}.`;
    } else if (data.balance !== undefined) {
      analysis = `After salary and expenses, you have ${data.formatted} remaining. Total income: ${data.formattedIncome}.`;
    } else if (data.incomeLost !== undefined) {
      analysis = `You lost ${data.formattedLost} (${data.percentageLost}%) of your income to expenses. Total income: ${data.formattedIncome}.`;
    } else {
      analysis = `Your total income ${data.period || 'this period'} is ${data.formatted}. Savings rate: ${data.formattedSavingsRate}.`;
    }
    
    return template.replace('{income_analysis}', analysis);
  }

  /**
   * Generate trend detection response
   */
  generateTrendDetectionResponse(template, data) {
    let analysis = '';
    
    analysis += `Overall trend: ${data.overallTrend.direction} by ${data.overallTrend.formattedChange}.\n`;
    
    if (data.fastestGrowingCategory) {
      analysis += `Fastest growing category: ${data.fastestGrowingCategory.category} (${data.fastestGrowingCategory.growth.toFixed(1)}% growth).\n`;
    }
    
    if (data.recurringExpenses.length > 0) {
      analysis += `Recurring expenses detected:\n`;
      data.recurringExpenses.slice(0, 3).forEach(r => {
        analysis += `• ${r.name}: ${this.formatCurrency(r.amount)} (${r.count} times)\n`;
      });
    }
    
    if (data.unusualExpenses.length > 0) {
      analysis += `\n⚠️ ${data.unusualExpenses.length} unusual spending patterns detected.`;
    }
    
    return template.replace('{trend_analysis}', analysis.trim());
  }

  /**
   * Generate coaching response
   */
  generateCoachingResponse(template, data) {
    const advice = data.map((item, index) => {
      return `${index + 1}. ${item.title}\n${item.message}`;
    }).join('\n\n');
    
    return template.replace('{coaching_advice}', advice);
  }

  /**
   * Generate conversational response
   */
  generateConversationalResponse(template, data) {
    return template.replace('{conversational_response}', data.message);
  }

  /**
   * Generate goal-based response
   */
  generateGoalBasedResponse(template, data) {
    let response = data.message;
    
    if (data.type === 'goal_help' && data.examples) {
      response += '\n\nExamples:\n' + data.examples.map(e => `• ${e}`).join('\n');
    }
    
    return template.replace('{goal_response}', response);
  }
}

export default ResponseGenerator;
