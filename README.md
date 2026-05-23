# Expense Tracker

A modern, feature-rich expense tracking application built with React, Vite, and Capacitor. This app helps you manage your finances with AI-powered insights, beautiful visualizations, and cross-platform support.

## Features

- **Expense Tracking**: Add, edit, and categorize expenses with ease
- **AI-Powered Insights**: Get intelligent financial analysis and recommendations
- **Data Visualization**: Interactive charts and graphs using Chart.js
- **Export Data**: Export your financial data to Excel format
- **Cross-Platform**: Works on web and mobile (Android) via Capacitor
- **PWA Support**: Progressive Web App capabilities for offline access
- **Modern UI**: Clean, responsive interface built with React and Lucide icons

## Tech Stack

- **Frontend**: React 19, React Router DOM
- **Build Tool**: Vite 6
- **Mobile Framework**: Capacitor 8 (Android)
- **Visualization**: Chart.js, React Chart.js 2
- **Icons**: Lucide React
- **Data Export**: XLSX
- **PWA**: Vite Plugin PWA

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android builds)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5177`

## Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Mobile Development

### Android Build

1. Sync Capacitor:
```bash
npx cap sync android
```

2. Open in Android Studio:
```bash
npx cap open android
```

3. Build the APK from Android Studio

## Project Structure

```
expense-tracker/
├── src/
│   ├── ai/              # AI services and reasoning
│   ├── components/      # Reusable React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── android/            # Android native project
├── public/             # Static assets
├── dist/               # Production build output
└── docs/               # Documentation files
```

## Documentation

- [AI Assistant Architecture](./AI_ASSISTANT_ARCHITECTURE.md) - AI system design
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Development guidelines
- [Android Integration](./ANDROID_CAPACITOR_INTEGRATION.md) - Mobile setup
- [Security & Privacy](./SECURITY_PRIVACY.md) - Security considerations
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md) - Performance tips
- [Mobile Optimization](./MOBILE_OPTIMIZATION.md) - Mobile-specific optimizations
- [Offline LLM Recommendations](./OFFLINE_LLM_RECOMMENDATIONS.md) - Offline AI features

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and improvements.

## Contributing

Contributions are welcome! Please follow the implementation guidelines and ensure your code adheres to the project's coding standards.

## License

This project is private and proprietary.

## Support

For issues and questions, please refer to the documentation files or contact the development team.
# Expense-Tracker
