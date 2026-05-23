/**
 * Analysis Thresholds
 * Threshold values for financial analysis and anomaly detection
 */

export const BUDGET_THRESHOLDS = {
  // Budget health score thresholds
  HEALTH_EXCELLENT: 80,
  HEALTH_GOOD: 60,
  HEALTH_FAIR: 40,
  HEALTH_POOR: 0,

  // Budget utilization thresholds
  UTILIZATION_LOW: 30,
  UTILIZATION_WARNING: 80,
  UTILIZATION_CRITICAL: 100,

  // Budget pacing thresholds
  PACING_AHEAD: 1.2,
  PACING_BEHIND: 0.8,
  PACING_ON_TRACK: 1.0
};

export const SAVINGS_THRESHOLDS = {
  // Savings rate thresholds
  RATE_POOR: 10,
  RATE_FAIR: 20,
  RATE_GOOD: 30,
  RATE_EXCELLENT: 40,

  // Emergency fund thresholds
  EMERGENCY_FUND_MIN_MONTHS: 3,
  EMERGENCY_FUND_IDEAL_MONTHS: 6,
  EMERGENCY_FUND_EXCELLENT_MONTHS: 12,

  // Savings consistency thresholds
  CONSISTENCY_EXCELLENT: 80,
  CONSISTENCY_GOOD: 60,
  CONSISTENCY_FAIR: 40,
  CONSISTENCY_POOR: 0
};

export const SPENDING_THRESHOLDS = {
  // Spending change thresholds
  INCREASE_HIGH: 20,
  INCREASE_MEDIUM: 10,
  INCREASE_LOW: 5,
  DECREASE_HIGH: -20,
  DECREASE_MEDIUM: -10,
  DECREASE_LOW: -5,

  // Category dominance thresholds
  DOMINANCE_HIGH: 50,
  DOMINANCE_MEDIUM: 40,
  DOMINANCE_LOW: 30,

  // Transaction amount thresholds
  HIGH_VALUE_TRANSACTION: 3, // multiplier of average
  VERY_HIGH_VALUE_TRANSACTION: 5, // multiplier of average

  // Spending volatility thresholds
  VOLATILITY_HIGH: 30,
  VOLATILITY_MEDIUM: 20,
  VOLATILITY_LOW: 10
};

export const ANOMALY_THRESHOLDS = {
  // Z-score thresholds
  Z_SCORE_WARNING: 2,
  Z_SCORE_CRITICAL: 3,
  Z_SCORE_SEVERE: 4,

  // Frequency anomaly thresholds
  FREQUENCY_DEVIATION: 2,

  // Pattern anomaly thresholds
  PATTERN_DEVIATION: 1.5,

  // Severity levels
  SEVERITY_LOW: 5,
  SEVERITY_MEDIUM: 10,
  SEVERITY_HIGH: 20
};

export const INSIGHT_THRESHOLDS = {
  // Minimum data points for analysis
  MIN_TRANSACTIONS_FOR_ANALYSIS: 3,
  MIN_MONTHS_FOR_TREND: 3,
  MIN_MONTHS_FOR_FORECAST: 6,

  // Confidence thresholds
  CONFIDENCE_HIGH: 0.8,
  CONFIDENCE_MEDIUM: 0.6,
  CONFIDENCE_LOW: 0.4,

  // Insight priority thresholds
  PRIORITY_HIGH: 0.8,
  PRIORITY_MEDIUM: 0.5,
  PRIORITY_LOW: 0.3
};

export const PERFORMANCE_THRESHOLDS = {
  // Response time thresholds (ms)
  RESPONSE_TIME_EXCELLENT: 500,
  RESPONSE_TIME_GOOD: 1000,
  RESPONSE_TIME_FAIR: 2000,
  RESPONSE_TIME_POOR: 3000,

  // Memory usage thresholds (MB)
  MEMORY_USAGE_LOW: 50,
  MEMORY_USAGE_MEDIUM: 100,
  MEMORY_USAGE_HIGH: 200,

  // Cache size thresholds
  CACHE_SIZE_MAX: 1000,
  CACHE_SIZE_WARNING: 800,
  CACHE_SIZE_CRITICAL: 950
};

export const MOBILE_THRESHOLDS = {
  // Screen size thresholds
  SCREEN_WIDTH_SMALL: 375,
  SCREEN_WIDTH_MEDIUM: 768,
  SCREEN_WIDTH_LARGE: 1024,

  // Touch target size
  TOUCH_TARGET_MIN: 44,

  // Font size thresholds
  FONT_SIZE_MIN: 14,
  FONT_SIZE_BODY: 16,
  FONT_SIZE_HEADING: 20,

  // Animation duration thresholds
  ANIMATION_DURATION_FAST: 200,
  ANIMATION_DURATION_NORMAL: 300,
  ANIMATION_DURATION_SLOW: 500
};

export const BATTERY_THRESHOLDS = {
  // Battery impact levels
  IMPACT_LOW: 1, // % per hour
  IMPACT_MEDIUM: 3,
  IMPACT_HIGH: 5,

  // Processing intervals
  PROCESSING_INTERVAL_ACTIVE: 1000, // ms
  PROCESSING_INTERVAL_BACKGROUND: 60000, // ms
  PROCESSING_INTERVAL_IDLE: 300000, // ms

  // Optimization thresholds
  OPTIMIZE_WHEN_BELOW: 20, // battery percentage
  REDUCE_FEATURES_WHEN_BELOW: 10 // battery percentage
};

export default {
  BUDGET_THRESHOLDS,
  SAVINGS_THRESHOLDS,
  SPENDING_THRESHOLDS,
  ANOMALY_THRESHOLDS,
  INSIGHT_THRESHOLDS,
  PERFORMANCE_THRESHOLDS,
  MOBILE_THRESHOLDS,
  BATTERY_THRESHOLDS
};
