# Bakugan Focus

A minimal focus accountability app that helps founders and creators stay consistent on ONE project through a daily yes/no ritual.

## Mission

Help users maintain focus and build streaks by answering one simple question every day: "Did you build today?"

## Features

- **Daily Check-Ins:** Simple YES/NOT YET interface
- **Power Levels:** Gain +1 power for each completed day
- **Streak Tracking:** Build consecutive day streaks
- **Progress Timeline:** Visual history of all check-ins
- **Google Sign-In:** Quick, passwordless authentication
- **Dark Mode:** Easy on the eyes, default theme

## Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **Firebase Authentication** with Google Sign-In
- **Cloud Firestore** for data storage
- **React Navigation** for navigation
- **React Native SVG** for custom orb design

## Project Structure

```
bakugan-focus/
├── src/
│   ├── config/
│   │   └── firebase.ts           # Firebase initialization
│   ├── contexts/
│   │   └── AuthContext.tsx       # Auth state management
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── components/
│   │   ├── BakuganOrb.tsx        # Custom SVG orb
│   │   └── TimelineIcon.tsx      # Timeline icons
│   ├── screens/
│   │   ├── LoginScreen.tsx       # Google Sign-In
│   │   ├── HomeScreen.tsx        # Main check-in screen
│   │   └── ProgressScreen.tsx    # Timeline view
│   ├── services/
│   │   ├── authService.ts        # Google auth logic
│   │   ├── userService.ts        # User CRUD operations
│   │   └── checkInService.ts     # Check-in logic
│   ├── utils/
│   │   ├── dateUtils.ts          # Date formatting helpers
│   │   └── streakCalculator.ts   # Streak calculation logic
│   └── navigation/
│       └── AppNavigator.tsx      # Navigation setup
├── App.tsx                       # Root component
├── app.json                      # Expo configuration
└── metro.config.js               # Metro bundler config
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Firebase account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Follow the detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to:

1. Create Firebase project
2. Enable Google Authentication
3. Set up Firestore database
4. Register Android and iOS apps
5. Update configuration files

**Files to update after Firebase setup:**

- `src/config/firebase.ts` - Add Firebase credentials
- `src/services/authService.ts` - Add Google Client IDs
- `app.json` - Add iOS URL scheme

### 3. Run Prebuild

Generate native iOS and Android folders:

```bash
npx expo prebuild
```

### 4. Get Android SHA-1

```bash
cd android
./gradlew signingReport
```

Copy the SHA-1 hash and add it to Firebase Console.

### 5. Move Config Files

After prebuild, move Firebase config files:

```bash
# Android
cp path/to/google-services.json android/app/

# iOS
cp path/to/GoogleService-Info.plist ios/
```

## Running the App

### iOS (Mac only)

```bash
npx expo run:ios
```

### Android

```bash
npx expo run:android
```

### Expo Go (Limited)

Google Sign-In won't work in Expo Go. Use native builds or expo-dev-client instead.

## Data Model

### User Document (`users/{uid}`)

```typescript
{
  uid: string,
  createdAt: Timestamp,
  currentStreak: number,
  maxStreak: number,
  power: number,
  lastCheckInDate: string  // YYYY-MM-DD
}
```

### CheckIn Document (`checkIns/{uid}_{YYYY-MM-DD}`)

```typescript
{
  uid: string,
  date: string,  // YYYY-MM-DD
  completed: true
}
```

## Core Logic

### Streak Calculation

- **Consecutive day:** Last check-in was yesterday → Streak + 1
- **Missed day(s):** Gap detected → Streak resets to 1
- **Same day:** Already checked in → Prevented by validation

### Check-In Rules

- One check-in per calendar day (device local time)
- YES button increments power by +1
- YES button updates streak based on last check-in
- NOT YET button does nothing (allows return later)
- After check-in, YES button becomes "DONE TODAY" and disables

## Building for Production

### Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Configure EAS

```bash
eas build:configure
```

### Build iOS (TestFlight)

```bash
eas build --profile production --platform ios
eas submit --platform ios
```

### Build Android (Internal Testing)

```bash
eas build --profile production --platform android
eas submit --platform android
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /checkIns/{checkInId} {
      allow read, write: if request.auth != null &&
        checkInId.matches('^' + request.auth.uid + '_.*$');
    }
  }
}
```

## Design Constraints

### What's Included

✅ Daily check-in (YES/NOT YET)
✅ Power level tracking
✅ Streak tracking
✅ Progress timeline
✅ Google Sign-In
✅ Dark mode theme
✅ Custom Bakugan-inspired orb

### What's NOT Included

❌ Task lists or notes
❌ Timers or reminders
❌ Social features
❌ Notifications
❌ Settings screens
❌ Analytics
❌ Additional gamification

## Troubleshooting

### Google Sign-In Fails

- Verify Web Client ID in `authService.ts`
- Verify iOS Client ID in `app.json` is reversed format
- Verify Android SHA-1 added to Firebase Console

### "Network request failed"

- Check internet connection
- Verify Firestore security rules are published
- Verify Firebase API key is correct

### Check-In Button Not Working

- Check Firebase credentials in `firebase.ts`
- Check Firestore security rules allow write
- Check console for error messages

## Key Files Reference

### Critical Logic

- `src/services/checkInService.ts` - Check-in creation and validation
- `src/utils/streakCalculator.ts` - Streak reset logic
- `src/screens/HomeScreen.tsx` - Main UI and check-in flow

### Visual Components

- `src/components/BakuganOrb.tsx` - Power-based color changes
- `src/screens/ProgressScreen.tsx` - Timeline rendering

### Configuration

- `app.json` - OAuth deep linking configuration
- `src/config/firebase.ts` - Firebase credentials
- `metro.config.js` - ES module resolution fix

## Known Issues

1. **Expo Go Limitation:** Google Sign-In requires native build or expo-dev-client
2. **Timezone:** Uses device local time (not UTC)
3. **Offline:** Requires internet connection for all operations

## Next Steps

- [ ] Complete Firebase setup
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Create app icons (512x512)
- [ ] Create splash screen
- [ ] Build with EAS
- [ ] Submit to TestFlight
- [ ] Submit to Google Play Internal Testing

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
