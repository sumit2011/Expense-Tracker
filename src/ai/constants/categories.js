/**
 * Category Constants
 * Default categories and their metadata
 */

export const DEFAULT_CATEGORIES = [
  {
    name: 'Food & Drink',
    icon: 'utensils',
    tone: 'var(--yellow)',
    type: 'expense',
    description: 'Restaurants, cafes, groceries, and food delivery'
  },
  {
    name: 'Shopping',
    icon: 'bag',
    tone: 'var(--blue)',
    type: 'expense',
    description: 'Clothing, electronics, and retail purchases'
  },
  {
    name: 'Health',
    icon: 'heart',
    tone: 'var(--red)',
    type: 'expense',
    description: 'Medical expenses, pharmacy, and healthcare'
  },
  {
    name: 'Transport',
    icon: 'bus',
    tone: 'var(--green)',
    type: 'expense',
    description: 'Public transport, fuel, and vehicle maintenance'
  },
  {
    name: 'Interest',
    icon: 'dollarBox',
    tone: 'var(--purple)',
    type: 'income',
    description: 'Interest earned from savings and investments'
  },
  {
    name: 'Life & Event',
    icon: 'briefcase',
    tone: 'var(--orange)',
    type: 'expense',
    description: 'Life events, celebrations, and special occasions'
  },
  {
    name: 'Groceries',
    icon: 'shoppingCart',
    tone: 'var(--pink)',
    type: 'expense',
    description: 'Supermarket and grocery store purchases'
  },
  {
    name: 'Salary',
    icon: 'cash',
    tone: 'var(--green)',
    type: 'income',
    description: 'Salary, wages, and regular income'
  },
  {
    name: 'Entertainment',
    icon: 'film',
    tone: 'var(--purple)',
    type: 'expense',
    description: 'Movies, games, concerts, and entertainment'
  },
  {
    name: 'Utilities',
    icon: 'zap',
    tone: 'var(--yellow)',
    type: 'expense',
    description: 'Electricity, water, gas, and internet bills'
  },
  {
    name: 'Education',
    icon: 'book',
    tone: 'var(--blue)',
    type: 'expense',
    description: 'Courses, books, and educational expenses'
  },
  {
    name: 'Travel',
    icon: 'plane',
    tone: 'var(--orange)',
    type: 'expense',
    description: 'Flights, hotels, and travel expenses'
  },
  {
    name: 'Personal',
    icon: 'user',
    tone: 'var(--primary)',
    type: 'expense',
    description: 'Personal care and miscellaneous expenses'
  },
  {
    name: 'Other',
    icon: 'more',
    tone: 'var(--muted)',
    type: 'expense',
    description: 'Uncategorized expenses'
  }
];

export const CATEGORY_GROUPS = {
  ESSENTIALS: ['Food & Drink', 'Groceries', 'Transport', 'Utilities', 'Health'],
  DISCRETIONARY: ['Shopping', 'Entertainment', 'Travel', 'Personal', 'Life & Event'],
  INCOME: ['Salary', 'Interest'],
  OTHER: ['Other', 'Education']
};

export const CATEGORY_BUDGET_RULES = {
  // Recommended budget percentages (50/30/20 rule)
  ESSENTIALS_PERCENTAGE: 50,
  DISCRETIONARY_PERCENTAGE: 30,
  SAVINGS_PERCENTAGE: 20,

  // Default budget limits (can be customized)
  DEFAULT_LIMITS: {
    'Food & Drink': 500,
    'Shopping': 300,
    'Health': 200,
    'Transport': 200,
    'Entertainment': 150,
    'Utilities': 200,
    'Groceries': 400,
    'Personal': 100,
    'Other': 100
  }
};

export const CATEGORY_ANALYSIS_RULES = {
  // Thresholds for category analysis
  HIGH_SPENDING_THRESHOLD: 40, // percentage of total spending
  FREQUENT_SPENDING_THRESHOLD: 10, // transactions per month
  AVERAGE_TRANSACTION_THRESHOLD: 100, // average transaction amount

  // Pattern detection rules
  RECURRING_THRESHOLD: 2, // minimum occurrences to detect recurring
  SIMILAR_AMOUNT_THRESHOLD: 0.1, // 10% variance for recurring detection
  RECURRING_INTERVAL_DAYS: {
    WEEKLY: [6, 8],
    BI_WEEKLY: [13, 16],
    MONTHLY: [28, 35],
    QUARTERLY: [88, 95],
    YEARLY: [360, 370]
  }
};

export default {
  DEFAULT_CATEGORIES,
  CATEGORY_GROUPS,
  CATEGORY_BUDGET_RULES,
  CATEGORY_ANALYSIS_RULES
};
