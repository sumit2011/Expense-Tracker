/**
 * Intent Classifier
 * Classifies user queries into financial intents
 */

import { NLPProcessor } from './nlpProcessor.js';

export class IntentClassifier {
  constructor() {
    this.nlp = new NLPProcessor();
    this.intents = this.initializeIntents();
  }

  /**
   * Initialize intent patterns
   */
  initializeIntents() {
    return {
      // Spending Analysis
      total_expenses: {
        keywords: ['total', 'expense', 'spend', 'spent', 'cost', 'expenditure', 'money went', 'biggest'],
        patterns: ['total expense', 'total spending', 'how much did i spend', 'spent overall', 'where did most of my money go', 'biggest expenses'],
        weight: 1.0
      },
      category_spending: {
        keywords: ['category', 'breakdown', 'categorize', 'wise', 'by category', 'overspending', 'increased'],
        patterns: ['spending by category', 'category breakdown', 'where did i spend', 'what category am i overspending on', 'which category increased'],
        weight: 0.9
      },
      time_period_spending: {
        keywords: ['this month', 'this week', 'this year', 'last month', 'last week', 'daily', 'average', 'highest', 'waste', 'unnecessary'],
        patterns: ['this month', 'this week', 'how much did i spend on', 'daily average', 'highest spending day', 'money wasted', 'unnecessary expenses'],
        weight: 0.9
      },
      
      // Savings
      savings_rate: {
        keywords: ['saving', 'save', 'savings rate', 'percentage', 'decreasing', 'reduce', 'enough', 'improve', 'habits'],
        patterns: ['savings rate', 'how much saving', 'why are my savings decreasing', 'how can i save more', 'how much can i save if i reduce', 'am i saving enough', 'how long will it take to save', 'improve financial habits'],
        weight: 0.8
      },
      
      // Budget
      budget_status: {
        keywords: ['budget', 'limit', 'remaining', 'budgeted', 'allocation', 'afford', 'healthy', 'ideal', 'exceeding', 'safely'],
        patterns: ['budget status', 'how much budget', 'can i afford', 'is my spending healthy', 'ideal monthly budget', 'am i exceeding my income', 'how much money can i safely spend'],
        weight: 0.9
      },
      
      // Predictive / Forecast
      predictions: {
        keywords: ['predict', 'forecast', 'next month', 'future', 'will i', 'run out', 'continue', 'reach goal'],
        patterns: ['predict spending', 'forecast', 'what will my savings look like', 'will i run out of money', 'how much will i spend if this trend continues', 'can i reach my savings goal'],
        weight: 0.8
      },
      
      // Financial Health
      financial_health: {
        keywords: ['health', 'score', 'habits', 'improving', 'change', 'stable', 'doing financially'],
        patterns: ['financial health', 'financial score', 'bad spending habits', 'am i improving financially', 'what should i change', 'how stable is my monthly spending', 'how am i doing financially'],
        weight: 0.8
      },
      
      // Income
      income: {
        keywords: ['income', 'earn', 'earned', 'revenue', 'salary', 'percentage', 'left', 'after salary', 'lost'],
        patterns: ['total income', 'how much income did i receive', 'what percentage of my income am i saving', 'how much salary is left', 'how much money do i spend after receiving salary', 'how much income did i lose to expenses'],
        weight: 1.0
      },
      
      // Trend Detection
      trend_detection: {
        keywords: ['trend', 'compare', 'increase', 'decrease', 'change', 'month over month', 'changed', 'growing', 'repeats', 'subscriptions', 'unusual'],
        patterns: ['spending trend', 'compare month', 'what changed this month', 'category growing fastest', 'which expense repeats most often', 'what subscriptions', 'detect unusual expenses'],
        weight: 0.8
      },
      
      // Smart AI Coaching
      coaching: {
        keywords: ['advice', 'disciplined', 'avoid', 'suggest', 'management', 'impulse', 'invest', '50/30/20'],
        patterns: ['financial advice', 'become financially disciplined', 'what should i avoid spending on', 'suggest ways to reduce expenses', 'better money management', 'how do i stop impulse spending', '50/30/20 rule', 'should i invest or save'],
        weight: 0.7
      },
      
      // Conversational
      conversational: {
        keywords: ['doing', 'summarize', 'tell me', 'focus', 'today', 'advice for me'],
        patterns: ['how am i doing', 'summarize my month', 'tell me about my spending', 'what should i focus on', "give me today's financial insight", 'do you think i spend too much', "what's your advice for me today"],
        weight: 0.7
      },
      
      // Goal-Based
      goal_based: {
        keywords: ['save', 'plan', 'vacation', 'laptop', 'goal', 'emergency', 'emi'],
        patterns: ['can i save', 'help me plan for', 'how much should i save for a laptop', 'create a savings goal', 'track my emergency fund', 'can i afford emi'],
        weight: 0.8
      },
      
      // General
      recent_transactions: {
        keywords: ['recent', 'latest', 'last', 'transaction', 'activity'],
        patterns: ['recent transactions', 'latest spending', 'last expense'],
        weight: 0.8
      },
      monthly_summary: {
        keywords: ['monthly', 'summary', 'month report', 'this month'],
        patterns: ['monthly summary', 'month report', 'this month overview'],
        weight: 0.8
      },
      help: {
        keywords: ['help', 'what can', 'capabilities', 'features', 'assist'],
        patterns: ['help', 'what can you do', 'capabilities'],
        weight: 1.0
      }
    };
  }

  /**
   * Classify intent from query
   */
  classify(query) {
    const normalizedQuery = this.nlp.normalize(query);
    const keywords = this.nlp.extractKeywords(query);
    
    const scores = {};

    for (const [intent, config] of Object.entries(this.intents)) {
      let score = 0;

      // Keyword matching
      config.keywords.forEach(keyword => {
        if (normalizedQuery.includes(keyword)) {
          score += 0.5;
        }
      });

      // Pattern matching
      config.patterns.forEach(pattern => {
        const similarity = this.nlp.calculateSimilarity(normalizedQuery, pattern);
        if (similarity > 0.3) {
          score += similarity * 0.5;
        }
      });

      // Apply weight
      score *= config.weight;

      scores[intent] = score;
    }

    // Find highest scoring intent
    let bestIntent = 'general';
    let highestScore = 0;

    for (const [intent, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        bestIntent = intent;
      }
    }

    // If no clear winner, return general
    if (highestScore < 0.3) {
      bestIntent = 'general';
    }

    return {
      intent: bestIntent,
      confidence: Math.min(highestScore, 1.0),
      scores
    };
  }

  /**
   * Get intent with fallback
   */
  classifyWithFallback(query) {
    const result = this.classify(query);
    
    if (result.confidence < 0.5) {
      return {
        intent: 'general',
        confidence: result.confidence,
        fallback: true,
        originalIntent: result.intent
      };
    }

    return result;
  }

  /**
   * Batch classify multiple queries
   */
  batchClassify(queries) {
    return queries.map(query => this.classify(query));
  }

  /**
   * Get intent statistics
   */
  getIntentStats(queries) {
    const classifications = this.batchClassify(queries);
    const stats = {};

    classifications.forEach(result => {
      stats[result.intent] = (stats[result.intent] || 0) + 1;
    });

    return {
      total: classifications.length,
      distribution: stats,
      averageConfidence: classifications.reduce((sum, r) => sum + r.confidence, 0) / classifications.length
    };
  }
}

export default IntentClassifier;
