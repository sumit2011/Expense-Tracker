# Security & Privacy Documentation

## Overview

This document outlines the security and privacy measures implemented in the AI Financial Assistant to ensure user data protection and system security.

## Privacy Principles

### 1. Local-First Architecture
- **All data stored locally** on user's device
- **No external API calls** to cloud services
- **No data transmission** to third parties
- **User-controlled data** at all times

### 2. Data Minimization
- Only collect necessary financial data
- No personal identification information
- No location tracking
- No behavioral analytics

### 3. Transparency
- Clear data usage policies
- Visible data storage locations
- User-accessible data export
- Easy data deletion

## Data Storage

### Local Storage Locations

#### Web Platform
- **localStorage**: User preferences, chat history
- **IndexedDB**: Large datasets, cached insights
- **SessionStorage**: Temporary session data

#### Mobile Platform (Capacitor)
- **SQLite**: Structured data storage
- **File System**: Model weights (if using LLM)
- **Keychain/Keystore**: Sensitive data encryption keys

### Data Encryption

#### Sensitive Data Protection

```jsx
// Encrypt sensitive data before storage
async function encryptData(data, key) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );
  
  return { iv, encrypted };
}

// Decrypt data when needed
async function decryptData(encryptedData, iv, key) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encryptedData
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
```

#### Key Management

```jsx
// Generate secure key
async function generateKey() {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// Store key securely (mobile)
async function storeKeySecurely(key) {
  if (Capacitor.getPlatform() === 'android') {
    await SecureStorage.set({ key: 'encryption_key', value: key });
  } else {
    // Web fallback with caution
    sessionStorage.setItem('encryption_key', key);
  }
}
```

## Input Validation

### Sanitization

```jsx
// Sanitize user input
function sanitizeInput(input) {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>]/g, '');
  
  // Limit length
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000);
  }
  
  return sanitized.trim();
}

// Validate numeric input
function validateNumber(value) {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0 || num > Number.MAX_SAFE_INTEGER) {
    throw new Error('Invalid number');
  }
  return num;
}

// Validate date input
function validateDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  return date;
}
```

### SQL Injection Prevention

```jsx
// Use parameterized queries
async function safeQuery(db, query, params) {
  // Never concatenate user input into queries
  const result = await db.run(query, params);
  return result;
}

// Example
await safeQuery(db, 
  'INSERT INTO messages (text, type) VALUES (?, ?)',
  [sanitizeInput(userText), messageType]
);
```

## XSS Protection

### Content Security Policy

```jsx
// In index.html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

### Output Encoding

```jsx
// Encode user-generated content before rendering
function encodeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Usage
<div dangerouslySetInnerHTML={{ 
  __html: encodeHTML(userMessage) 
}} />
```

## Authentication & Authorization

### Local Authentication (Optional)

```jsx
// Simple PIN-based authentication
class LocalAuth {
  constructor() {
    this.pin = localStorage.getItem('auth-pin');
  }

  setPin(pin) {
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      throw new Error('Invalid PIN format');
    }
    this.pin = this.hashPin(pin);
    localStorage.setItem('auth-pin', this.pin);
  }

  verifyPin(inputPin) {
    return this.hashPin(inputPin) === this.pin;
  }

  hashPin(pin) {
    // Simple hash for demonstration
    // Use proper crypto in production
    return btoa(pin).split('').reverse().join('');
  }

  clearPin() {
    this.pin = null;
    localStorage.removeItem('auth-pin');
  }
}
```

## Data Retention

### Automatic Cleanup

```jsx
// Clean up old data
class DataCleanup {
  constructor() {
    this.maxHistoryAge = 90 * 24 * 60 * 60 * 1000; // 90 days
    this.maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
  }

  async cleanupOldMessages() {
    const history = await getChatHistory();
    const now = Date.now();
    
    const filtered = history.filter(msg => {
      const msgDate = new Date(msg.timestamp).getTime();
      return now - msgDate < this.maxHistoryAge;
    });
    
    await saveChatHistory(filtered);
  }

  async cleanupExpiredCache() {
    const cache = await getInsightsCache();
    const now = Date.now();
    
    for (const [key, value] of Object.entries(cache)) {
      if (value.expiresAt < now) {
        delete cache[key];
      }
    }
    
    await saveInsightsCache(cache);
  }

  async runCleanup() {
    await this.cleanupOldMessages();
    await this.cleanupExpiredCache();
  }
}
```

## User Rights

### Data Export

```jsx
// Export all user data
async function exportUserData() {
  const data = {
    chatHistory: await getChatHistory(),
    preferences: await getUserPreferences(),
    insightsCache: await getInsightsCache(),
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expense-tracker-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### Data Deletion

```jsx
// Delete all user data
async function deleteAllData() {
  // Clear localStorage
  localStorage.clear();
  
  // Clear IndexedDB
  const databases = await indexedDB.databases();
  for (const db of databases) {
    indexedDB.deleteDatabase(db.name);
  }
  
  // Clear SQLite (mobile)
  if (Capacitor.getPlatform() !== 'web') {
    await sqliteManager.clearAllCaches();
    await sqliteManager.clearChatHistory();
  }
  
  // Clear session storage
  sessionStorage.clear();
}
```

## Audit Logging

### Security Event Logging

```jsx
class SecurityLogger {
  constructor() {
    this.events = [];
  }

  logEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event.type,
      details: event.details,
      severity: event.severity || 'info'
    };

    this.events.push(logEntry);

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Persist to storage
    this.saveToStorage();
  }

  logFailedLogin() {
    this.logEvent({
      type: 'AUTH_FAILED',
      details: { attempt: 'PIN verification failed' },
      severity: 'warning'
    });
  }

  logDataAccess() {
    this.logEvent({
      type: 'DATA_ACCESS',
      details: { action: 'User accessed financial data' },
      severity: 'info'
    });
  }

  logDataExport() {
    this.logEvent({
      type: 'DATA_EXPORT',
      details: { action: 'User exported data' },
      severity: 'info'
    });
  }

  saveToStorage() {
    localStorage.setItem('security-logs', JSON.stringify(this.events));
  }

  getLogs() {
    return this.events;
  }
}
```

## Network Security

### No External Requests

The AI assistant is designed to work completely offline:

```jsx
// Block any external requests
const originalFetch = window.fetch;

window.fetch = function(...args) {
  const url = args[0];
  
  // Allow only local requests
  if (typeof url === 'string' && !url.startsWith('http://localhost') && !url.startsWith('file://')) {
    console.warn('External request blocked:', url);
    return Promise.reject(new Error('External requests are blocked'));
  }
  
  return originalFetch.apply(this, args);
};
```

## Compliance

### GDPR Compliance

- **Right to access**: Users can export their data
- **Right to deletion**: Users can delete all data
- **Right to portability**: Data export in JSON format
- **Data minimization**: Only necessary data collected
- **Local processing**: No cross-border data transfer

### Best Practices

1. **Never store passwords** - Use device authentication
2. **Encrypt sensitive data** - At rest and in transit
3. **Validate all inputs** - Prevent injection attacks
4. **Implement rate limiting** - Prevent abuse
5. **Regular security audits** - Review code regularly
6. **Keep dependencies updated** - Security patches
7. **Use HTTPS** - If any network requests are needed
8. **Implement CORS** - If serving from different origin

## Security Checklist

- [x] All data stored locally
- [x] No external API calls
- [x] Input validation implemented
- [x] SQL injection prevention
- [x] XSS protection
- [x] Data encryption for sensitive info
- [x] User data export functionality
- [x] User data deletion functionality
- [x] Security event logging
- [x] Regular data cleanup
- [x] CSP headers configured
- [x] Dependencies security audit

## Monitoring

### Security Metrics

```jsx
// Track security-related metrics
const securityMetrics = {
  failedAuthAttempts: 0,
  dataExports: 0,
  dataDeletions: 0,
  suspiciousActivity: 0
};

// Alert on suspicious activity
function checkSecurityMetrics() {
  if (securityMetrics.failedAuthAttempts > 5) {
    alert('Multiple failed authentication attempts detected');
  }
}
```

## Incident Response

### Security Incident Procedure

1. **Identify** the incident
2. **Contain** the impact
3. **Eradicate** the vulnerability
4. **Recover** affected systems
5. **Document** the incident
6. **Review** and improve

## Conclusion

This AI Financial Assistant is designed with privacy and security as core principles. By following local-first architecture, implementing proper input validation, and providing user control over data, we ensure a secure and private financial management experience.

## Resources

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Web Security Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
- [GDPR Compliance](https://gdpr.eu/)
- [Capacitor Security](https://capacitorjs.com/docs/guides/security)
