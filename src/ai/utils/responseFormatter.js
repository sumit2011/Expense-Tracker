/**
 * Response Formatter
 * Formats AI responses for better readability
 */

export class ResponseFormatter {
  constructor() {
    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  /**
   * Format currency
   */
  formatCurrency(amount, currency = 'USD') {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(amount);
    } catch {
      return `$${amount.toFixed(2)}`;
    }
  }

  /**
   * Format percentage
   */
  formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Format number with commas
   */
  formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }

  /**
   * Format date
   */
  formatDate(date, format = 'short') {
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

  /**
   * Format time
   */
  formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format duration
   */
  formatDuration(seconds) {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }

  /**
   * Format list as bullet points
   */
  formatAsList(items, prefix = '•') {
    return items.map(item => `${prefix} ${item}`).join('\n');
  }

  /**
   * Format key-value pairs
   */
  formatAsKeyValue(pairs) {
    return Object.entries(pairs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }

  /**
   * Format table
   */
  formatAsTable(headers, rows) {
    const columnWidths = headers.map((header, i) => {
      const maxWidth = Math.max(
        header.length,
        ...rows.map(row => String(row[i]).length)
      );
      return maxWidth + 2;
    });

    const headerRow = headers
      .map((header, i) => header.padEnd(columnWidths[i]))
      .join('|');

    const separator = columnWidths.map(width => '-'.repeat(width - 1)).join('|');

    const dataRows = rows.map(row =>
      row
        .map((cell, i) => String(cell).padEnd(columnWidths[i]))
        .join('|')
    );

    return [headerRow, separator, ...dataRows].join('\n');
  }

  /**
   * Format insight card
   */
  formatInsightCard(insight) {
    const lines = [];
    
    if (insight.title) {
      lines.push(`📊 ${insight.title}`);
    }
    
    if (insight.value) {
      lines.push(`   ${insight.value}`);
    }
    
    if (insight.description) {
      lines.push(`   ${insight.description}`);
    }
    
    if (insight.trend) {
      const trendIcon = insight.trend === 'up' ? '📈' : insight.trend === 'down' ? '📉' : '➡️';
      lines.push(`   ${trendIcon} ${insight.trend}`);
    }

    return lines.join('\n');
  }

  /**
   * Format budget status
   */
  formatBudgetStatus(budget) {
    const statusIcon = budget.status === 'exceeded' ? '❌' : budget.status === 'warning' ? '⚠️' : '✅';
    const percentage = this.formatPercentage(budget.percentage);
    
    return `${statusIcon} ${budget.name}: ${this.formatCurrency(budget.spent)}/${this.formatCurrency(budget.limit)} (${percentage})`;
  }

  /**
   * Format trend
   */
  formatTrend(trend, change) {
    const icon = trend === 'increased' ? '📈' : trend === 'decreased' ? '📉' : '➡️';
    const formattedChange = this.formatCurrency(Math.abs(change));
    const direction = trend === 'increased' ? 'increased by' : trend === 'decreased' ? 'decreased by' : 'remained at';
    
    return `${icon} ${direction} ${formattedChange}`;
  }

  /**
   * Format recommendation
   */
  formatRecommendation(rec) {
    const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
    return `${priorityIcon} ${rec.message}`;
  }

  /**
   * Format anomaly
   */
  formatAnomaly(anomaly) {
    const severityIcon = anomaly.severity === 'high' ? '🔴' : anomaly.severity === 'medium' ? '🟡' : '🟢';
    return `${severityIcon} ${anomaly.message}`;
  }

  /**
   * Truncate text with ellipsis
   */
  truncate(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Highlight keywords in text
   */
  highlightKeywords(text, keywords) {
    let highlighted = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlighted = highlighted.replace(regex, '**$1**');
    });
    return highlighted;
  }

  /**
   * Format response for mobile
   */
  formatForMobile(response) {
    // Shorten paragraphs
    let formatted = response.replace(/\n\n+/g, '\n\n');
    
    // Limit line length
    const lines = formatted.split('\n');
    const wrappedLines = lines.map(line => {
      if (line.length > 50) {
        const words = line.split(' ');
        const wrapped = [];
        let currentLine = '';
        
        words.forEach(word => {
          if ((currentLine + ' ' + word).length > 50) {
            wrapped.push(currentLine.trim());
            currentLine = word;
          } else {
            currentLine += ' ' + word;
          }
        });
        
        if (currentLine.trim()) {
          wrapped.push(currentLine.trim());
        }
        
        return wrapped.join('\n');
      }
      return line;
    });

    return wrappedLines.join('\n');
  }

  /**
   * Add emoji to response
   */
  addEmoji(text, emoji) {
    return `${emoji} ${text}`;
  }

  /**
   * Format section header
   */
  formatSectionHeader(text) {
    return `\n${'='.repeat(text.length + 4)}\n  ${text}\n${'='.repeat(text.length + 4)}\n`;
  }
}

export default ResponseFormatter;
