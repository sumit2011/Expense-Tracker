/**
 * Trend Predictor Engine
 * Predicts future spending based on historical patterns
 */

export class TrendPredictor {
  constructor(records) {
    this.records = records || [];
  }

  /**
   * Calculate moving average
   */
  calculateMovingAverage(data, window = 3) {
    const movingAverages = [];
    
    for (let i = window - 1; i < data.length; i++) {
      const windowData = data.slice(i - window + 1, i + 1);
      const avg = windowData.reduce((sum, val) => sum + val, 0) / window;
      movingAverages.push(avg);
    }

    return movingAverages;
  }

  /**
   * Predict next month's spending using linear regression
   */
  predictNextMonthSpending(records = this.records, months = 6) {
    const monthlyData = [];
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

      monthlyData.unshift(monthExpenses);
    }

    if (monthlyData.length < 2) {
      return {
        predicted: 0,
        confidence: 0,
        method: 'insufficient_data'
      };
    }

    // Simple linear regression
    const n = monthlyData.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = monthlyData;

    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + (val * y[i]), 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predicted = slope * n + intercept;
    
    // Calculate confidence based on variance
    const mean = y.reduce((sum, val) => sum + val, 0) / n;
    const variance = y.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const confidence = Math.max(0, Math.min(1, 1 - (stdDev / mean)));

    return {
      predicted: Math.max(0, predicted),
      confidence: confidence.toFixed(2),
      method: 'linear_regression',
      trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
      slope,
      monthlyData
    };
  }

  /**
   * Predict category-wise spending
   */
  predictCategorySpending(category, records = this.records, months = 6) {
    const monthlyData = [];
    const now = new Date();

    for (let i = 0; i < months; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthExpenses = records
        .filter(r => {
          const date = new Date(r.date);
          return r.name === category && r.amount < 0 && r.type !== 'transfer' &&
                 date >= month && date <= endOfMonth;
        })
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);

      monthlyData.unshift(monthExpenses);
    }

    if (monthlyData.length < 2) {
      return {
        category,
        predicted: 0,
        confidence: 0
      };
    }

    const avg = monthlyData.reduce((sum, val) => sum + val, 0) / monthlyData.length;
    const trend = monthlyData[monthlyData.length - 1] > monthlyData[0] ? 'increasing' : 'decreasing';
    
    // Simple prediction based on average and trend
    const predicted = trend === 'increasing' ? avg * 1.1 : avg * 0.9;

    return {
      category,
      predicted: Math.max(0, predicted),
      average: avg,
      trend,
      confidence: 0.7
    };
  }

  /**
   * Detect seasonal patterns
   */
  detectSeasonalPatterns(records = this.records) {
    const monthlyTotals = {};
    const now = new Date();

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = { total: 0, count: 0, month: date.getMonth() };
        }
        
        monthlyTotals[monthKey].total += Math.abs(record.amount);
        monthlyTotals[monthKey].count += 1;
      });

    // Group by month (0-11) to find seasonal patterns
    const monthGroups = {};
    Object.values(monthlyTotals).forEach(data => {
      if (!monthGroups[data.month]) {
        monthGroups[data.month] = [];
      }
      monthGroups[data.month].push(data.total);
    });

    const patterns = [];
    Object.entries(monthGroups).forEach(([month, totals]) => {
      if (totals.length >= 2) {
        const avg = totals.reduce((sum, val) => sum + val, 0) / totals.length;
        const monthName = new Date(2024, month).toLocaleString('en-US', { month: 'long' });
        
        patterns.push({
          month: parseInt(month),
          monthName,
          average: avg,
          dataPoints: totals.length
        });
      }
    });

    return patterns.sort((a, b) => b.average - a.average);
  }

  /**
   * Generate spending forecast
   */
  generateForecast(records = this.records, futureMonths = 3) {
    const overallPrediction = this.predictNextMonthSpending(records);
    const seasonalPatterns = this.detectSeasonalPatterns(records);
    
    const forecast = [];
    const now = new Date();

    for (let i = 1; i <= futureMonths; i++) {
      const futureMonth = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthIndex = futureMonth.getMonth();
      
      // Base prediction on overall trend
      let predicted = overallPrediction.predicted;
      
      // Adjust for seasonal patterns if available
      const seasonalData = seasonalPatterns.find(p => p.month === monthIndex);
      if (seasonalData) {
        const seasonalAdjustment = seasonalData.average / overallPrediction.monthlyData.reduce((sum, val) => sum + val, 0) / overallPrediction.monthlyData.length;
        predicted *= seasonalAdjustment;
      }

      forecast.push({
        month: futureMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        predicted: Math.max(0, predicted),
        confidence: overallPrediction.confidence
      });
    }

    return {
      overallPrediction,
      seasonalPatterns,
      monthlyForecast: forecast
    };
  }

  /**
   * Analyze spending velocity
   */
  analyzeSpendingVelocity(records = this.records, weeks = 4) {
    const weeklyData = [];
    const now = new Date();

    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - 6);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (i * 7));

      const weekExpenses = records
        .filter(r => {
          const date = new Date(r.date);
          return r.amount < 0 && r.type !== 'transfer' &&
                 date >= weekStart && date <= weekEnd;
        })
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);

      weeklyData.unshift(weekExpenses);
    }

    if (weeklyData.length < 2) {
      return { velocity: 0, trend: 'stable' };
    }

    const recentAvg = weeklyData.slice(-2).reduce((sum, val) => sum + val, 0) / 2;
    const earlierAvg = weeklyData.slice(0, -2).reduce((sum, val) => sum + val, 0) / (weeklyData.length - 2);
    
    const velocity = ((recentAvg - earlierAvg) / earlierAvg) * 100;
    const trend = velocity > 10 ? 'accelerating' : velocity < -10 ? 'decelerating' : 'stable';

    return {
      velocity: velocity.toFixed(1),
      trend,
      weeklyData,
      recentAvg,
      earlierAvg
    };
  }
}

export default TrendPredictor;
