/**
 * Insight Card Component
 * Displays financial insight cards
 */

import React from 'react';

export default function InsightCard({ insight, onClick }) {
  const getIcon = (type) => {
    const icons = {
      budget: '💰',
      savings: '💵',
      trend: '📊',
      category: '🏷️',
      recommendation: '💡',
      alert: '⚠️',
      success: '✅'
    };
    return icons[type] || '📊';
  };

  const getColor = (priority) => {
    const colors = {
      high: 'var(--red)',
      medium: 'var(--orange)',
      low: 'var(--green)'
    };
    return colors[priority] || 'var(--primary)';
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--line)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        touchAction: 'manipulation'
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = 'var(--primary)';
        e.target.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = 'var(--line)';
        e.target.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            fontSize: '24px',
            flexShrink: 0
          }}
        >
          {getIcon(insight.type)}
        </div>
        <div style={{ flex: 1 }}>
          <h4
            style={{
              margin: '0 0 4px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text)'
            }}
          >
            {insight.title}
          </h4>
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              color: 'var(--muted)',
              lineHeight: '1.4'
            }}
          >
            {insight.message}
          </p>
          {insight.action && (
            <p
              style={{
                margin: 0,
                fontSize: '11px',
                color: getColor(insight.priority),
                fontWeight: '500'
              }}
            >
              {insight.action}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
