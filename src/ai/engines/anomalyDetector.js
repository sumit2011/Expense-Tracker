/**
 * Anomaly Detector Engine
 * Detects unusual and potentially concerning spending patterns
 */

export class AnomalyDetector {
  constructor(records, categories) {
    this.records = records || [];
    this.categories = categories || [];
  }

  /**
   * Detect anomalies using statistical methods (Z-score)
   */
  detectStatisticalAnomalies(records = this.records, threshold = 2) {
    const expenses = records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .map(r => Math.abs(r.amount));

    if (expenses.length < 3) return [];

    const mean = expenses.reduce((sum, val) => sum + val, 0) / expenses.length;
    const variance = expenses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / expenses.length;
    const stdDev = Math.sqrt(variance);

    const anomalies = records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .filter(r => {
        const zScore = (Math.abs(r.amount) - mean) / stdDev;
        return Math.abs(zScore) > threshold;
      })
      .map(r => ({
        ...r,
        amount: Math.abs(r.amount),
        zScore: ((Math.abs(r.amount) - mean) / stdDev).toFixed(2),
        deviation: ((Math.abs(r.amount) - mean) / mean * 100).toFixed(1)
      }))
      .sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));

    return anomalies;
  }

  /**
   * Detect sudden spending spikes
   */
  detectSpendingSpikes(records = this.records, windowDays = 7, threshold = 2) {
    const now = new Date();
    const spikes = [];

    // Group expenses by day
    const dailyExpenses = {};
    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        const date = new Date(record.date).toDateString();
        dailyExpenses[date] = (dailyExpenses[date] || 0) + Math.abs(record.amount);
      });

    const dailyValues = Object.values(dailyExpenses);
    if (dailyValues.length < windowDays) return [];

    const mean = dailyValues.reduce((sum, val) => sum + val, 0) / dailyValues.length;
    const stdDev = Math.sqrt(dailyValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dailyValues.length);

    Object.entries(dailyExpenses).forEach(([date, amount]) => {
      const zScore = (amount - mean) / stdDev;
      if (Math.abs(zScore) > threshold) {
        spikes.push({
          date,
          amount,
          zScore: zScore.toFixed(2),
          deviation: ((amount - mean) / mean * 100).toFixed(1)
        });
      }
    });

    return spikes.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));
  }

  /**
   * Detect category anomalies
   */
  detectCategoryAnomalies(records = this.records, threshold = 1.5) {
    const categoryStats = {};

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        if (!categoryStats[record.name]) {
          categoryStats[record.name] = {
            amounts: [],
            total: 0,
            count: 0
          };
        }
        const amount = Math.abs(record.amount);
        categoryStats[record.name].amounts.push(amount);
        categoryStats[record.name].total += amount;
        categoryStats[record.name].count += 1;
      });

    const anomalies = [];

    Object.entries(categoryStats).forEach(([category, stats]) => {
      if (stats.amounts.length < 3) return;

      const mean = stats.amounts.reduce((sum, val) => sum + val, 0) / stats.amounts.length;
      const variance = stats.amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / stats.amounts.length;
      const stdDev = Math.sqrt(variance);

      stats.amounts.forEach(amount => {
        const zScore = (amount - mean) / stdDev;
        if (Math.abs(zScore) > threshold) {
          anomalies.push({
            category,
            amount,
            mean,
            zScore: zScore.toFixed(2),
            deviation: ((amount - mean) / mean * 100).toFixed(1)
          });
        }
      });
    });

    return anomalies.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));
  }

  /**
   * Detect frequency anomalies (unusual transaction frequency)
   */
  detectFrequencyAnomalies(records = this.records, threshold = 2) {
    const categoryFrequency = {};

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        if (!categoryFrequency[record.name]) {
          categoryFrequency[record.name] = [];
        }
        categoryFrequency[record.name].push(new Date(record.date));
      });

    const anomalies = [];

    Object.entries(categoryFrequency).forEach(([category, dates]) => {
      if (dates.length < 3) return;

      // Calculate intervals between transactions
      const intervals = [];
      for (let i = 1; i < dates.length; i++) {
        const daysDiff = Math.floor((dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24));
        intervals.push(daysDiff);
      }

      const mean = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);

      intervals.forEach(interval => {
        const zScore = (interval - mean) / stdDev;
        if (Math.abs(zScore) > threshold) {
          anomalies.push({
            category,
            interval,
            meanInterval: mean.toFixed(1),
            zScore: zScore.toFixed(2)
          });
        }
      });
    });

    return anomalies;
  }

  /**
   * Detect unusual spending locations (if available)
   */
  detectLocationAnomalies(records = this.records) {
    // This would require location data in records
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Generate anomaly report
   */
  generateReport(records = this.records) {
    const statisticalAnomalies = this.detectStatisticalAnomalies(records);
    const spendingSpikes = this.detectSpendingSpikes(records);
    const categoryAnomalies = this.detectCategoryAnomalies(records);
    const frequencyAnomalies = this.detectFrequencyAnomalies(records);

    const totalAnomalies = statisticalAnomalies.length + spendingSpikes.length + 
                          categoryAnomalies.length + frequencyAnomalies.length;

    let severity = 'low';
    if (totalAnomalies > 10) severity = 'high';
    else if (totalAnomalies > 5) severity = 'medium';

    return {
      severity,
      totalAnomalies,
      statisticalAnomalies,
      spendingSpikes,
      categoryAnomalies,
      frequencyAnomalies,
      summary: this.generateSummary(statisticalAnomalies, spendingSpikes, categoryAnomalies)
    };
  }

  /**
   * Generate human-readable summary
   */
  generateSummary(statistical, spikes, category) {
    const summary = [];

    if (statistical.length > 0) {
      summary.push(`Found ${statistical.length} transactions with unusual amounts`);
    }

    if (spikes.length > 0) {
      summary.push(`Detected ${spikes.length} daily spending spikes`);
    }

    if (category.length > 0) {
      summary.push(`Found ${category.length} category-specific anomalies`);
    }

    if (summary.length === 0) {
      summary.push('No significant anomalies detected');
    }

    return summary.join('. ');
  }

  /**
   * Get anomaly severity score (0-100)
   */
  getSeverityScore(records = this.records) {
    const report = this.generateReport(records);
    
    let score = 0;
    score += report.statisticalAnomalies.length * 5;
    score += report.spendingSpikes.length * 3;
    score += report.categoryAnomalies.length * 2;
    score += report.frequencyAnomalies.length * 2;

    return Math.min(100, score);
  }
}

export default AnomalyDetector;
