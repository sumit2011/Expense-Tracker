# Android & Capacitor Integration Guide

## Prerequisites
- Node.js 18+, Android Studio, Java JDK 17+
- Capacitor CLI installed

## Installation
```bash
npm install @capacitor-community/sqlite
npm install @capacitor-community/secure-storage
```

## Configuration
Update `capacitor.config.json`:
```json
{
  "plugins": {
    "SQLite": { "iosDatabaseLocation": "Library" },
    "SecureStorage": {
      "android": {
        "authenticationPromptTitle": "Authentication Required"
      }
    }
  }
}
```

## Permissions
Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Build
```bash
npx cap sync android
cd android
./gradlew assembleRelease
```

## APK Optimization
- Enable ProGuard/R8
- Split by architecture
- Use App Bundle instead of APK

## Battery Optimization
- Use adaptive performance
- Implement battery-aware processing
- Optimize background tasks

See full implementation guide for details.
