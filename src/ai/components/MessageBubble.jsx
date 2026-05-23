/**
 * Message Bubble Component
 * Displays individual chat messages with styling
 */

import React from 'react';

export default function MessageBubble({ message, isUser }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '12px',
        animation: 'fadeInUp 0.3s ease-out',
        padding: '0 4px'
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          background: isUser
            ? 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)'
            : 'var(--panel)',
          color: isUser ? 'white' : 'var(--text)',
          padding: '12px 16px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          boxShadow: isUser
            ? '0 2px 10px rgba(106, 102, 255, 0.3)'
            : '0 1px 6px rgba(0, 0, 0, 0.2)',
          border: !isUser ? '1px solid var(--line)' : 'none',
          wordBreak: 'break-word'
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.4',
            whiteSpace: 'pre-line'
          }}
        >
          {message.text}
        </p>
        <p
          style={{
            fontSize: '10px',
            opacity: 0.7,
            margin: '6px 0 0 0'
          }}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
