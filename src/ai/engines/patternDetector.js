/**
 * Pattern Detector Engine
 * Detects spending patterns and behaviors
 */

export class PatternDetector {
  constructor(records, categories) {
    this.records = records || [];
    this.categories = categories || [];
  }

  /**
   * Detect spending patterns by category
   */
  detectCategoryPatterns(records = this.records) {
    const patterns = {};
    const now = new Date();

    this.categories.forEach(category => {
      const categoryRecords = records.filter(r => r.name === category.name && r.amount < 0);
      
      if (categoryRecords.length < 3) return;

      // Analyze timing patterns
      const daysOfWeek = {};
      const hoursOfDay = {};
      
      categoryRecords.forEach(record => {
        const date = new Date(record.date);
        const day = date.getDay();
        const hour = date.getHours();

        daysOfWeek[day] = (daysOfWeek[day] || 0) + 1;
        hoursOfDay[hour] = (hoursOfDay[hour] || 0) + 1;
      });

      const mostCommonDay = Object.entries(daysOfWeek).sort((a, b) => b[1] - a[1])[0];
      const mostCommonHour = Object.entries(hoursOfDay).sort((a, b) => b[1] - a[1])[0];

      patterns[category.name] = {
        frequency: categoryRecords.length,
        totalSpent: categoryRecords.reduce((sum, r) => sum + Math.abs(r.amount), 0),
        avgTransaction: categoryRecords.reduce((sum, r) => sum + Math.abs(r.amount), 0) / categoryRecords.length,
        mostCommonDay: mostCommonDay ? parseInt(mostCommonDay[0]) : null,
        mostCommonHour: mostCommonHour ? parseInt(mostCommonHour[0]) : null
      };
    });

    return patterns;
  }

  /**
   * Detect impulse spending (high-value, infrequent categories)
   */
  detectImpulseSpending(records = this.records, threshold = 2) {
    const categoryStats = {};

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        if (!categoryStats[record.name]) {
          categoryStats[record.name] = {
            total: 0,
            count: 0,
            amounts: []
          };
        }
        categoryStats[record.name].total += Math.abs(record.amount);
        categoryStats[record.name].count += 1;
        categoryStats[record.name].amounts.push(Math.abs(record.amount));
      });

    const impulseCategories = [];

    Object.entries(categoryStats).forEach(([category, stats]) => {
      const avg = stats.total / stats.count;
      const max = Math.max(...stats.amounts);
      
      // If max is significantly higher than average, it might be impulse spending
      if (max > avg * threshold && stats.count >= 2) {
        impulseCategories.push({
          category,
          avg,
          max,
          ratio: (max / avg).toFixed(1),
          count: stats.count
        });
      }
    });

    return impulseCategories.sort((a, b) => b.ratio - a.ratio);
  }

  /**
   * Detect subscription/recurring payments
   */
  detectSubscriptions(records = this.records) {
    const potentialSubscriptions = [];
    const expenseMap = new Map();

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        const key = `${record.name}_${Math.abs(record.amount).toFixed(2)}`;
        if (!expenseMap.has(key)) {
          expenseMap.set(key, {
            name: record.name,
            amount: Math.abs(record.amount),
            dates: [],
            count: 0
          });
        }
        expenseMap.get(key).dates.push(record.date);
        expenseMap.get(key).count += 1;
      });

    expenseMap.forEach(expense => {
      if (expense.count >= 2) {
        const dates = expense.dates.sort((a, b) => new Date(a) - new Date(b));
        const intervals = [];
        
        for (let i = 1; i < dates.length; i++) {
          const daysDiff = Math.floor((new Date(dates[i]) - new Date(dates[i-1])) / (1000 * 60 * 60 * 24));
          intervals.push(daysDiff);
        }

        const avgInterval = intervals.length > 0 
          ? intervals.reduce((sum, val) => sum + val, 0) / intervals.length 
          : 0;

        // Common subscription intervals
        const isMonthly = avgInterval >= 28 && avgInterval <= 35;
        const isYearly = avgInterval >= 360 && avgInterval <= 370;
        const isWeekly = avgInterval >= 6 && avgInterval <= 9;

        if (isMonthly || isYearly || isWeekly) {
          potentialSubscriptions.push({
            ...expense,
            frequency: isMonthly ? 'monthly' : isYearly ? 'yearly' : 'weekly',
            avgInterval: Math.round(avgInterval),
            monthlyCost: isMonthly ? expense.amount : isYearly ? expense.amount / 12 : expense.amount * 4
          });
        }
      }
    });

    return potentialSubscriptions.sort((a, b) => b.monthlyCost - a.monthlyCost);
  }

  /**
   * Detect weekend vs weekday spending patterns
   */
  detectWeekdayWeekendPattern(records = this.records) {
    let weekdayTotal = 0;
    let weekdayCount = 0;
    let weekendTotal = 0;
    let weekendCount = 0;

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        const day = new Date(record.date).getDay();
        const amount = Math.abs(record.amount);

        if (day === 0 || day === 6) {
          weekendTotal += amount;
          weekendCount += 1;
        } else {
          weekdayTotal += amount;
          weekdayCount += 1;
        }
      });

    const weekdayAvg = weekdayCount > 0 ? weekdayTotal / weekdayCount : 0;
    const weekendAvg = weekendCount > 0 ? weekendTotal / weekendCount : 0;

    return {
      weekday: { total: weekdayTotal, count: weekdayCount, avg: weekdayAvg },
      weekend: { total: weekendTotal, count: weekendCount, avg: weekendAvg },
      ratio: weekendAvg > 0 ? (weekdayAvg / weekendAvg).toFixed(2) : 0,
      higherSpending: weekendAvg > weekdayAvg ? 'weekend' : 'weekday'
    };
  }

  /**
   * Detect pay period spending patterns
   */
  detectPayPeriodPattern(records = this.records, payDay = 1) {
    const now = new Date();
    const patterns = {
      firstWeek: { total: 0, count: 0 },
      midMonth: { total: 0, count: 0 },
      endMonth: { total: 0, count: 0 }
    };

    records
      .filter(r => r.amount < 0 && r.type !== 'transfer')
      .forEach(record => {
        const date = new Date(record.date);
        const day = date.getDate();
        const amount = Math.abs(record.amount);

        if (day <= 7) {
          patterns.firstWeek.total += amount;
          patterns.firstWeek.count += 1;
        } else if (day >= 8 && day <= 20) {
          patterns.midMonth.total += amount;
          patterns.midMonth.count += 1;
        } else {
          patterns.endMonth.total += amount;
          patterns.endMonth.count += 1;
        }
      });

    return {
      patterns,
      highestSpending: Object.entries(patterns)
        .sort((a, b) => b[1].total - a[1].total)[0][0]
    };
  }

  /**
   * Generate comprehensive pattern analysis
   */
  generateAnalysis(records = this.records) {
    return {
      categoryPatterns: this.detectCategoryPatterns(records),
      impulseSpending: this.detectImpulseSpending(records),
      subscriptions: this.detectSubscriptions(records),
      weekdayWeekend: this.detectWeekdayWeekendPattern(records),
      payPeriod: this.detectPayPeriodPattern(records)
    };
  }
}

export default PatternDetector;
