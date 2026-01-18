# Bakugan Focus

A minimal focus accountability app that helps founders and creators stay consistent on ONE project through a daily yes/no ritual.

## Mission

Help users maintain focus and build streaks by answering one simple question every day: "Did you build today?"

## Features

- **Daily Check-Ins:** Simple YES/NOT YET interface
- **Power Levels:** Gain +1 power for each completed day
- **Streak Tracking:** Build consecutive day streaks
- **Progress Timeline:** Visual history of all check-ins
- **Google Sign-In:** Quick, passwordless authentication via Supabase
- **Dark Mode:** Easy on the eyes, default theme

## Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **Supabase** for authentication and PostgreSQL database
- **Google OAuth** via Supabase Auth
- **React Navigation** for navigation
- **React Native SVG** for custom orb design

## Project Structure

```
bakugan-focus/
├── src/
│   ├── config/
│   │   └── supabase.ts           # Supabase client initialization
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
│   │   ├── authService.ts        # Supabase auth logic
│   │   ├── userService.ts        # User CRUD operations
│   │   └── checkInService.ts     # Check-in logic
│   ├── utils/
│   │   ├── dateUtils.ts          # Date formatting helpers
│   │   └── streakCalculator.ts   # Streak calculation logic
│   └── navigation/
│       └── AppNavigator.tsx      # Navigation setup
├── supabase/
│   └── schema.sql                # Database schema
├── App.tsx                       # Root component
├── app.json                      # Expo configuration
└── metro.config.js               # Metro bundler config
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Supabase account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Your project is already configured with Supabase credentials in `src/config/supabase.ts`.

Follow the detailed instructions in **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** to:

1. Run database schema
2. Enable Google OAuth
3. Configure deep linking
4. Test authentication

### 3. Run Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Run the SQL to create tables and policies

### 4. Run the App

#### iOS (Mac only)

```bash
npx expo prebuild
npx expo run:ios
```

#### Android

```bash
npx expo prebuild
npx expo run:android
```

**Note:** Google Sign-In requires native build (won't work in Expo Go).

## Data Model

### Users Table

```typescript
{
  id: string,              // UUID from Supabase Auth
  email: string,
  created_at: string,      // ISO timestamp
  current_streak: number,
  max_streak: number,
  power: number,
  last_check_in_date: string  // YYYY-MM-DD or null
}
```

### Check-Ins Table

```typescript
{
  id: number,              // Auto-increment
  user_id: string,         // Foreign key to users.id
  date: string,            // YYYY-MM-DD
  completed: boolean,
  created_at: string       // ISO timestamp
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

## Supabase Security

### Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- ✅ Read their own data
- ✅ Insert their own data
- ✅ Update their own data
- ❌ Access other users' data

Policies are automatically created by `supabase/schema.sql`.

## Design Constraints

### What's Included

✅ Daily check-in (YES/NOT YET)
✅ Power level tracking
✅ Streak tracking
✅ Progress timeline
✅ Google Sign-In via Supabase
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

- Verify Google OAuth is enabled in Supabase Dashboard
- Verify redirect URI matches: `https://mmeshpxloyttkoohpobv.supabase.co/auth/v1/callback`
- Verify SHA-1 added to Google Cloud Console (Android)

### "relation 'users' does not exist"

- Run the SQL schema from `supabase/schema.sql`
- Check Supabase Dashboard → SQL Editor

### Check-In Button Not Working

- Check Supabase credentials in `supabase.ts`
- Check RLS policies are enabled
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

- `app.json` - Deep linking configuration
- `src/config/supabase.ts` - Supabase credentials
- `supabase/schema.sql` - Database schema and RLS policies

## Known Issues

1. **Expo Go Limitation:** Google Sign-In requires native build
2. **Timezone:** Uses device local time (not UTC)
3. **Offline:** Requires internet connection for all operations

## Next Steps

- [x] Supabase project created
- [ ] Run database schema
- [ ] Enable Google OAuth in Supabase
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Get SHA-1 and test on devices
- [ ] Build with EAS
- [ ] Submit to TestFlight
- [ ] Submit to Google Play Internal Testing

## Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase setup guide
- **[supabase/schema.sql](./supabase/schema.sql)** - Database schema

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
