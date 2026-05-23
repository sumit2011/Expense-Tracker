# Mobile Optimization Guide

## Touch Targets
Minimum 44x44px for all interactive elements.

## Responsive Design
```jsx
const isMobile = window.innerWidth < 768;
{isMobile ? <MobileView /> : <DesktopView />}
```

## Virtual Scrolling
For long lists of messages/transactions.

## Font Sizes
- Body: 16px minimum
- Headings: 20px minimum
- Touch-friendly: 14px minimum

## Animations
- Fast: 200ms
- Normal: 300ms
- Slow: 500ms

## Performance
- Optimize images
- Minimize re-renders
- Use CSS transforms instead of layout changes
