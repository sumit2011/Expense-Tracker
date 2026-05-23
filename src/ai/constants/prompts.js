/**
 * AI Prompt Constants
 * Pre-defined prompts and response templates
 */

export const AI_PROMPTS = {
  // Greeting prompts
  GREETING: [
    "Hello! I'm your AI financial assistant. I can help you analyze your spending, track budgets, and provide personalized financial advice. Ask me anything about your finances!",
    "Hi there! I'm here to help you understand your spending patterns and make better financial decisions. What would you like to know?",
    "Welcome! I can analyze your expense data, provide insights, and answer questions about your finances. How can I help you today?"
  ],

  // Error prompts
  ERROR: [
    "I couldn't understand that. Try asking about your expenses, income, budget, or savings.",
    "I'm not sure what you mean. You can ask me about your spending, income, budget status, or financial insights.",
    "Let me help you better. Try asking about your expenses, income, budget, or savings."
  ],

  // Help prompts
  HELP: {
    CAPABILITIES: [
      "Track total expenses and income",
      "Analyze spending by category",
      "Check budget status",
      "View spending trends",
      "Get financial insights",
      "Receive savings recommendations",
      "Predict future spending",
      "Check if you can afford a purchase",
      "View recent transactions",
      "Get monthly summaries"
    ],
    EXAMPLES: [
      "What are my total expenses?",
      "How is my budget status?",
      "Show me spending insights",
      "Can I afford a bike for $500?",
      "Compare this month with last month",
      "Where am I overspending?"
    ]
  },

  // Quick suggestions
  QUICK_SUGGESTIONS: [
    "What are my total expenses?",
    "How is my budget status?",
    "Show me spending insights",
    "What's my current balance?",
    "Compare this month with last month",
    "Where am I overspending?"
  ],

  // Intent-specific prompts
  INTENTS: {
    total_expenses: "Calculate and display total expenses for the specified period",
    total_income: "Calculate and display total income for the specified period",
    balance: "Calculate and display current balance and savings",
    category_spending: "Show spending breakdown by category",
    budget_status: "Check budget status and remaining amounts",
    savings_rate: "Calculate and display savings rate",
    spending_trend: "Analyze and display spending trends",
    insights: "Generate comprehensive financial insights",
    overspending: "Check for overspending and budget alerts",
    recommendations: "Provide financial recommendations",
    predictions: "Predict future spending",
    recent_transactions: "Show recent transactions",
    monthly_summary: "Generate monthly financial summary",
    afford: "Check affordability of a purchase",
    help: "Display help and capabilities"
  }
};

export const RESPONSE_TEMPLATES = {
  // Currency formatting
  CURRENCY: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  },

  // Percentage formatting
  PERCENTAGE: (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  },

  // Date formatting
  DATE: (date, format = 'short') => {
    const dateObj = new Date(date);
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'long':
        return dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'month':
        return dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      default:
        return dateObj.toLocaleDateString('en-US');
    }
  }
};

export const ANALYSIS_THRESHOLDS = {
  // Budget thresholds
  BUDGET_WARNING: 80,
  BUDGET_CRITICAL: 100,

  // Savings rate thresholds
  SAVINGS_POOR: 10,
  SAVINGS_FAIR: 20,
  SAVINGS_GOOD: 30,

  // Spending change thresholds
  SPENDING_INCREASE_HIGH: 20,
  SPENDING_INCREASE_MEDIUM: 10,
  SPENDING_DECREASE_HIGH: -20,
  SPENDING_DECREASE_MEDIUM: -10,

  // Anomaly detection thresholds
  ANOMALY_Z_SCORE: 2,
  ANOMALY_Z_SCORE_HIGH: 3,

  // Category dominance threshold
  CATEGORY_DOMINANCE: 40,

  // Emergency fund targets
  EMERGENCY_FUND_MONTHS: 3,
  EMERGENCY_FUND_MONTHS_IDEAL: 6
};

export const INTENT_PATTERNS = {
  // Spending Analysis
  total_expenses: [
    'total expense', 'total spending', 'how much did i spend', 'spent overall',
    'expenses total', 'my expenses', 'show expenses', 'where did most of my money go',
    'most of my money', 'money went', 'biggest expenses', 'show my biggest expenses'
  ],
  category_spending: [
    'category', 'spending by category', 'breakdown', 'where did i spend',
    'category wise', 'by category', 'show categories', 'what category am i overspending on',
    'overspending on', 'category increased', 'which category increased'
  ],
  time_period_spending: [
    'this month', 'this week', 'this year', 'last month', 'last week',
    'how much did i spend on', 'spent on food', 'spent on shopping',
    'daily average', 'average daily', 'highest spending day', 'highest day',
    'waste on', 'money wasted', 'unnecessary expenses'
  ],
  
  // Savings
  savings_rate: [
    'savings rate', 'saving rate', 'how much saving', 'savings percentage',
    'save rate', 'my savings', 'why are my savings decreasing', 'savings decreasing',
    'how can i save more', 'save more money', 'reduce spending',
    'how much can i save if i reduce', 'reduce food spending', 'reduce shopping',
    'monthly savings rate', 'am i saving enough', 'saving enough',
    'how much should i save', 'should i save every month', 'how long will it take to save',
    'save ₹', 'save $', 'improve financial habits', 'improve habits'
  ],
  
  // Budget
  budget_status: [
    'budget', 'budget status', 'budget remaining', 'budget left',
    'how much budget', 'over budget', 'budget progress', 'can i afford',
    'afford a', 'afford phone', 'afford bike', 'afford laptop',
    'is my spending healthy', 'spending healthy', 'how much should i budget for',
    'budget for food', 'budget for shopping', 'ideal monthly budget',
    'ideal budget', 'am i exceeding my income', 'exceeding income',
    'how much money can i safely spend', 'safely spend', 'what budget should i set'
  ],
  
  // Predictive / Forecast
  predictions: [
    'predict', 'forecast', 'next month', 'future spending',
    'will i spend', 'spending forecast', 'what will my savings look like',
    'savings look like', 'predict my next month expenses', 'will i run out of money',
    'run out of money', 'how much will i spend if this trend continues',
    'if this trend continues', 'can i reach my savings goal', 'reach savings goal',
    'what will happen if i continue', 'continue this spending pattern'
  ],
  
  // Financial Health
  financial_health: [
    'financial health', 'financially healthy', 'financial score',
    'give me a financial score', 'bad spending habits', 'spending habits',
    'am i improving financially', 'improving financially', 'what should i change',
    'change in my finances', 'how stable is my monthly spending', 'stable spending',
    'how am i doing financially', 'financially doing'
  ],
  
  // Income
  income: [
    'total income', 'total earnings', 'how much did i earn', 'earned overall',
    'income total', 'my income', 'show income', 'how much income did i receive',
    'income received', 'what percentage of my income am i saving',
    'percentage of income', 'how much salary is left', 'salary left',
    'how much money do i spend after receiving salary', 'after salary',
    'how much income did i lose to expenses', 'income lost to expenses'
  ],
  
  // Trend Detection
  trend_detection: [
    'trend', 'spending trend', 'trend analysis', 'compare month',
    'month comparison', 'how has my spending changed', 'what changed',
    'what changed this month', 'category growing fastest', 'growing fastest',
    'show my spending trends', 'which expense repeats most often', 'repeats most often',
    'what subscriptions', 'subscriptions', 'detect unusual expenses', 'unusual expenses',
    'did my food expenses increase', 'food expenses increase', 'shopping increase'
  ],
  
  // Smart AI Coaching
  coaching: [
    'financial advice', 'give me financial advice', 'financially disciplined',
    'become financially disciplined', 'what should i avoid spending on',
    'avoid spending on', 'suggest ways to reduce expenses', 'reduce expenses',
    'better money management', 'money management', 'how do i stop impulse spending',
    'stop impulse spending', '50/30/20 rule', 'should i invest or save',
    'invest or save'
  ],
  
  // Conversational
  conversational: [
    'how am i doing', 'summarize my month', 'summarize month', 'tell me about my spending',
    'about my spending', 'what should i focus on', 'focus on',
    "give me today's financial insight", 'today insight', 'do you think i spend too much',
    'spend too much', "what's your advice for me today", 'advice for me today'
  ],
  
  // Goal-Based
  goal_based: [
    'can i save', 'save in', 'help me plan for', 'plan for vacation',
    'how much should i save for a laptop', 'save for laptop', 'create a savings goal',
    'savings goal', 'track my emergency fund', 'emergency fund', 'can i afford emi',
    'afford emi', 'emi payments'
  ],
  
  // General
  recent_transactions: [
    'recent', 'latest', 'last transaction', 'recent spending',
    'latest expense', 'show recent'
  ],
  monthly_summary: [
    'monthly summary', 'month summary', 'this month',
    'summary of month', 'month report'
  ],
  help: [
    'help', 'what can you do', 'capabilities', 'features',
    'what can i ask', 'assist'
  ]
};

export const CATEGORY_ICONS = {
  'Food & Drink': 'utensils',
  'Shopping': 'bag',
  'Health': 'heart',
  'Transport': 'bus',
  'Interest': 'dollarBox',
  'Life & Event': 'briefcase',
  'Groceries': 'shoppingCart',
  'Salary': 'cash',
  'Entertainment': 'film',
  'Utilities': 'zap',
  'Education': 'book',
  'Travel': 'plane',
  'Personal': 'user',
  'Other': 'more'
};

export const CATEGORY_COLORS = {
  'Food & Drink': 'var(--yellow)',
  'Shopping': 'var(--blue)',
  'Health': 'var(--red)',
  'Transport': 'var(--green)',
  'Interest': 'var(--purple)',
  'Life & Event': 'var(--orange)',
  'Groceries': 'var(--pink)',
  'Salary': 'var(--green)',
  'Entertainment': 'var(--purple)',
  'Utilities': 'var(--yellow)',
  'Education': 'var(--blue)',
  'Travel': 'var(--orange)',
  'Personal': 'var(--primary)',
  'Other': 'var(--muted)'
};

export default {
  AI_PROMPTS,
  RESPONSE_TEMPLATES,
  ANALYSIS_THRESHOLDS,
  INTENT_PATTERNS,
  CATEGORY_ICONS,
  CATEGORY_COLORS
};
