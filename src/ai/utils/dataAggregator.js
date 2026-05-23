/**
 * Data Aggregator
 * Aggregates and transforms financial data for analysis
 */

export class DataAggregator {
  constructor(records, categories, budgets) {
    this.records = records || [];
    this.categories = categories || [];
    this.budgets = budgets || {};
  }

  /**
   * Aggregate records by time period
   */
  aggregateByPeriod(period = 'month') {
    const aggregated = {};
    const now = new Date();

    this.records.forEach(record => {
      const date = new Date(record.date);
      let key;

      switch (period) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${date.getMonth()}`;
          break;
        case 'quarter':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
          break;
        case 'year':
          key = `${date.getFullYear()}`;
          break;
        default:
          key = `${date.getFullYear()}-${date.getMonth()}`;
      }

      if (!aggregated[key]) {
        aggregated[key] = {
          period: key,
          income: 0,
          expenses: 0,
          transfers: 0,
          transactions: 0
        };
      }

      if (record.type === 'transfer') {
        aggregated[key].transfers += Math.abs(record.amount);
      } else if (record.amount > 0) {
        aggregated[key].income += record.amount;
      } else {
        aggregated[key].expenses += Math.abs(record.amount);
      }

      aggregated[key].transactions += 1;
    });

    return Object.values(aggregated).sort((a, b) => a.period.localeCompare(b.period));
  }

  /**
   * Aggregate by category
   */
  aggregateByCategory(records = this.records) {
    const aggregated = {};

    records
      .filter(r => r.type !== 'transfer')
      .forEach(record => {
        const category = record.name;
        const amount = Math.abs(record.amount);

        if (!aggregated[category]) {
          aggregated[category] = {
            category,
            total: 0,
            count: 0,
            avg: 0,
            min: Infinity,
            max: -Infinity
          };
        }

        aggregated[category].total += amount;
        aggregated[category].count += 1;
        aggregated[category].min = Math.min(aggregated[category].min, amount);
        aggregated[category].max = Math.max(aggregated[category].max, amount);
      });

    Object.values(aggregated).forEach(cat => {
      cat.avg = cat.total / cat.count;
    });

    return Object.values(aggregated).sort((a, b) => b.total - a.total);
  }

  /**
   * Aggregate by account
   */
  aggregateByAccount(records = this.records) {
    const aggregated = {};

    records.forEach(record => {
      const account = record.account || 'Unknown';
      const amount = record.amount;

      if (!aggregated[account]) {
        aggregated[account] = {
          account,
          income: 0,
          expenses: 0,
          balance: 0,
          transactions: 0
        };
      }

      if (amount > 0) {
        aggregated[account].income += amount;
      } else {
        aggregated[account].expenses += Math.abs(amount);
      }

      aggregated[account].balance += amount;
      aggregated[account].transactions += 1;
    });

    return Object.values(aggregated).sort((a, b) => b.balance - a.balance);
  }

  /**
   * Aggregate by day of week
   */
  aggregateByDayOfWeek(records = this.records) {
    const aggregated = {
      0: { day: 'Sunday', total: 0, count: 0, income: 0, expenses: 0 },
      1: { day: 'Monday', total: 0, count: 0, income: 0, expenses: 0 },
      2: { day: 'Tuesday', total: 0, count: 0, income: 0, expenses: 0 },
      3: { day: 'Wednesday', total: 0, count: 0, income: 0, expenses: 0 },
      4: { day: 'Thursday', total: 0, count: 0, income: 0, expenses: 0 },
      5: { day: 'Friday', total: 0, count: 0, income: 0, expenses: 0 },
      6: { day: 'Saturday', total: 0, count: 0, income: 0, expenses: 0 }
    };

    records
      .filter(r => r.type !== 'transfer')
      .forEach(record => {
        const day = new Date(record.date).getDay();
        const amount = record.amount;

        aggregated[day].count += 1;
        
        if (amount > 0) {
          aggregated[day].income += amount;
        } else {
          aggregated[day].expenses += Math.abs(amount);
        }
        
        aggregated[day].total += Math.abs(amount);
      });

    return Object.values(aggregated);
  }

  /**
   * Aggregate by hour of day
   */
  aggregateByHourOfDay(records = this.records) {
    const aggregated = {};

    for (let i = 0; i < 24; i++) {
      aggregated[i] = {
        hour: i,
        total: 0,
        count: 0,
        income: 0,
        expenses: 0
      };
    }

    records
      .filter(r => r.type !== 'transfer')
      .forEach(record => {
        const hour = new Date(record.date).getHours();
        const amount = record.amount;

        aggregated[hour].count += 1;
        
        if (amount > 0) {
          aggregated[hour].income += amount;
        } else {
          aggregated[hour].expenses += Math.abs(amount);
        }
        
        aggregated[hour].total += Math.abs(amount);
      });

    return Object.values(aggregated);
  }

  /**
   * Calculate running totals
   */
  calculateRunningTotals(data, valueKey = 'total') {
    let runningTotal = 0;
    
    return data.map(item => {
      runningTotal += item[valueKey];
      return {
        ...item,
        runningTotal
      };
    });
  }

  /**
   * Calculate moving average
   */
  calculateMovingAverage(data, valueKey = 'total', window = 3) {
    const movingAverages = [];

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const windowData = data.slice(start, i + 1);
      const avg = windowData.reduce((sum, item) => sum + item[valueKey], 0) / windowData.length;
      
      movingAverages.push({
        ...data[i],
        movingAverage: avg
      });
    }

    return movingAverages;
  }

  /**
   * Calculate percentage change
   */
  calculatePercentageChange(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Calculate growth rates
   */
  calculateGrowthRates(data, valueKey = 'total') {
    const growthRates = [];

    for (let i = 1; i < data.length; i++) {
      const current = data[i][valueKey];
      const previous = data[i - 1][valueKey];
      const growthRate = this.calculatePercentageChange(current, previous);

      growthRates.push({
        ...data[i],
        growthRate,
        previousValue: previous
      });
    }

    return growthRates;
  }

  /**
   * Get top N items by value
   */
  getTopN(data, valueKey = 'total', n = 5) {
    return data
      .sort((a, b) => b[valueKey] - a[valueKey])
      .slice(0, n);
  }

  /**
   * Get bottom N items by value
   */
  getBottomN(data, valueKey = 'total', n = 5) {
    return data
      .sort((a, b) => a[valueKey] - b[valueKey])
      .slice(0, n);
  }

  /**
   * Filter data by date range
   */
  filterByDateRange(data, startDate, endDate, dateKey = 'date') {
    return data.filter(item => {
      const date = new Date(item[dateKey]);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  }

  /**
   * Group data by key
   */
  groupBy(data, key) {
    const grouped = {};

    data.forEach(item => {
      const groupKey = item[key];
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(item);
    });

    return grouped;
  }

  /**
   * Sum values by key
   */
  sumBy(data, valueKey) {
    return data.reduce((sum, item) => sum + item[valueKey], 0);
  }

  /**
   * Average values by key
   */
  averageBy(data, valueKey) {
    if (data.length === 0) return 0;
    return this.sumBy(data, valueKey) / data.length;
  }

  /**
   * Get comprehensive data summary
   */
  getDataSummary() {
    return {
      byPeriod: {
        daily: this.aggregateByPeriod('day'),
        weekly: this.aggregateByPeriod('week'),
        monthly: this.aggregateByPeriod('month'),
        quarterly: this.aggregateByPeriod('quarter'),
        yearly: this.aggregateByPeriod('year')
      },
      byCategory: this.aggregateByCategory(),
      byAccount: this.aggregateByAccount(),
      byDayOfWeek: this.aggregateByDayOfWeek(),
      byHourOfDay: this.aggregateByHourOfDay()
    };
  }
}

export default DataAggregator;
