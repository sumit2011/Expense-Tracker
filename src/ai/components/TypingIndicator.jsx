/**
 * Typing Indicator Component
 * Shows animated typing indicator
 */

import React from 'react';

export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px', padding: '0 4px' }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '8px'
        }}
      >
        <span style={{ fontSize: '12px', color: 'white' }}>🤖</span>
      </div>
      <div
        style={{
          background: 'var(--panel)',
          padding: '12px 16px',
          borderRadius: '18px 18px 18px 4px',
          border: '1px solid var(--line)',
          boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', gap: '3px' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--muted)',
              animation: 'bounce 1.4s infinite ease-in-out both'
            }}
          />
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--muted)',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '0.16s'
            }}
          />
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--muted)',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '0.32s'
            }}
          />
        </div>
      </div>
    </div>
  );
}
