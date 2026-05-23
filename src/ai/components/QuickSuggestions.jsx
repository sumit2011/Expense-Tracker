/**
 * Quick Suggestions Component
 * Displays clickable suggestion chips
 */

import React from 'react';

export default function QuickSuggestions({ suggestions, onSelect }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            style={{
              background: 'var(--panel-2)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '6px 12px',
              fontSize: '11px',
              color: 'var(--muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--primary)';
              e.target.style.color = 'white';
              e.target.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--panel-2)';
              e.target.style.color = 'var(--muted)';
              e.target.style.borderColor = 'var(--line)';
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
