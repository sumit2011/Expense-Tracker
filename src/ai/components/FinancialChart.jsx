/**
 * Financial Chart Component
 * Displays simple financial charts using CSS
 */

import React from 'react';

export default function FinancialChart({ data, type = 'bar' }) {
  const maxValue = Math.max(...data.map(d => d.value));

  if (type === 'bar') {
    return (
      <div style={{ width: '100%', padding: '16px 0' }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px'
            }}
          >
            <div
              style={{
                width: '80px',
                fontSize: '11px',
                color: 'var(--muted)',
                textAlign: 'right',
                paddingRight: '8px',
                flexShrink: 0
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                flex: 1,
                height: '24px',
                background: 'var(--panel-2)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary) 0%, var(--purple) 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <div
              style={{
                width: '60px',
                fontSize: '11px',
                color: 'var(--text)',
                paddingLeft: '8px',
                flexShrink: 0
              }}
            >
              {item.formattedValue}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'line') {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div
        style={{
          width: '100%',
          height: '120px',
          position: 'relative',
          padding: '16px'
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            points={points}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="var(--primary)"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return null;
}
