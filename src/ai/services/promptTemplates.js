/**
 * Prompt Templates
 * Pre-defined templates for different types of financial queries
 * Used for consistent and structured responses
 */

export const PromptTemplates = {
  // Expense-related prompts
  totalExpenses: {
    template: "Calculate total expenses for {period}",
    params: ['period'],
    examples: [
      "What are my total expenses this month?",
      "How much did I spend last month?",
      "Show me my total expenses for this year"
    ]
  },

  // Income-related prompts
  totalIncome: {
    template: "Calculate total income for {period}",
    params: ['period'],
    examples: [
      "What's my total income this month?",
      "How much did I earn last month?",
      "Show me my income for this year"
    ]
  },

  // Balance-related prompts
  balance: {
    template: "Calculate current balance",
    params: [],
    examples: [
      "What's my current balance?",
      "How much money do I have?",
      "What's my net balance?"
    ]
  },

  // Category breakdown prompts
  categoryBreakdown: {
    template: "Show spending breakdown by category for {period}",
    params: ['period'],
    examples: [
      "Show me my spending by category",
      "Where did I spend my money this month?",
      "Category-wise spending breakdown"
    ]
  },

  // Budget status prompts
  budgetStatus: {
    template: "Check budget status",
    params: [],
    examples: [
      "How is my budget status?",
      "Am I over budget?",
      "Show me my budget progress"
    ]
  },

  // Savings rate prompts
  savingsRate: {
    template: "Calculate savings rate for {period}",
    params: ['period'],
    examples: [
      "What's my savings rate?",
      "How much am I saving?",
      "Savings percentage this month"
    ]
  },

  // Spending trend prompts
  spendingTrend: {
    template: "Analyze spending trend compared to {comparison_period}",
    params: ['comparison_period'],
    examples: [
      "Compare this month with last month",
      "Show me spending trends",
      "How has my spending changed?"
    ]
  },

  // Financial insights prompts
  insights: {
    template: "Generate financial insights",
    params: [],
    examples: [
      "Give me financial insights",
      "Analyze my spending patterns",
      "Show me my financial health"
    ]
  },

  // Overspending alerts
  overspending: {
    template: "Check for overspending",
    params: [],
    examples: [
      "Where am I overspending?",
      "Am I spending too much?",
      "Show me overspending alerts"
    ]
  },

  // Recommendations prompts
  recommendations: {
    template: "Generate financial recommendations",
    params: [],
    examples: [
      "Give me financial advice",
      "How can I save more money?",
      "What should I do to improve my finances?"
    ]
  },

  // Predictions prompts
  predictions: {
    template: "Predict spending for {future_period}",
    params: ['future_period'],
    examples: [
      "Predict my spending for next month",
      "How much will I spend next month?",
      "Spending forecast"
    ]
  },

  // Recent transactions prompts
  recentTransactions: {
    template: "Show recent transactions",
    params: [],
    examples: [
      "Show me recent transactions",
      "What did I spend on recently?",
      "Latest expenses"
    ]
  },

  // Monthly summary prompts
  monthlySummary: {
    template: "Generate monthly summary for {month}",
    params: ['month'],
    examples: [
      "Give me a monthly summary",
      "This month's financial overview",
      "Monthly report"
    ]
  },

  // Affordability checks
  afford: {
    template: "Check if I can afford {item} for {amount}",
    params: ['item', 'amount'],
    examples: [
      "Can I afford a bike for $500?",
      "Should I buy a laptop for $1000?",
      "Can I purchase a phone for $800?"
    ]
  },

  // Help prompts
  help: {
    template: "Show help and capabilities",
    params: [],
    examples: [
      "What can you do?",
      "Help",
      "What can I ask you?"
    ]
  }
};

/**
 * Get template by intent
 */
export function getTemplate(intent) {
  return PromptTemplates[intent] || null;
}

/**
 * Get all available intents
 */
export function getAllIntents() {
  return Object.keys(PromptTemplates);
}

/**
 * Get examples for intent
 */
export function getExamples(intent) {
  const template = PromptTemplates[intent];
  return template ? template.examples : [];
}

/**
 * Get random example for intent
 */
export function getRandomExample(intent) {
  const examples = getExamples(intent);
  return examples.length > 0 ? examples[Math.floor(Math.random() * examples.length)] : '';
}

export default PromptTemplates;
