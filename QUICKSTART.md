# Quick Start Guide

Get Bakugan Focus running in under 10 minutes.

## 5-Minute Firebase Setup

### 1. Create Project (1 min)

1. Visit: https://console.firebase.google.com/
2. Click "Add project" → Name: `bakugan-focus`
3. Disable Analytics → Create

### 2. Enable Auth (1 min)

1. Build → Authentication → Get started
2. Sign-in method → Google → Enable → Save
3. Set support email

### 3. Create Firestore (1 min)

1. Build → Firestore Database → Create database
2. Production mode → us-central1 → Enable
3. Rules tab → Replace with:

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

### 4. Register Apps (2 min)

**Android:**
- Project Settings → Add app → Android
- Package: `com.bakuganfocus.app`
- Download `google-services.json` → Save for later

**iOS:**
- Add app → iOS
- Bundle ID: `com.bakuganfocus.app`
- Download `GoogleService-Info.plist` → Save for later

**Web (for auth):**
- Add app → Web
- Name: `bakugan-focus-web`
- Copy the config object

### 5. Update Code (1 min)

**File: `src/config/firebase.ts`**

Replace placeholder values with your config from Step 4 (Web app):

```typescript
const firebaseConfig = {
  apiKey: "AIza...",              // YOUR VALUE
  authDomain: "bakugan-focus...", // YOUR VALUE
  projectId: "bakugan-focus",
  storageBucket: "...",           // YOUR VALUE
  messagingSenderId: "...",       // YOUR VALUE
  appId: "..."                    // YOUR VALUE
};
```

**File: `src/services/authService.ts`**

Get Web Client ID:
- Firebase Console → Authentication → Sign-in method → Google → Web SDK configuration
- Copy "Web client ID"

```typescript
GoogleSignin.configure({
  webClientId: 'YOUR-WEB-CLIENT-ID.apps.googleusercontent.com',
  iosClientId: 'YOUR-IOS-CLIENT-ID.apps.googleusercontent.com',
});
```

Get iOS Client ID:
- Google Cloud Console → APIs & Services → Credentials
- Find iOS client (format: `123-abc.apps.googleusercontent.com`)

**File: `app.json`**

Update iOS URL scheme (use REVERSED client ID):

```json
"infoPlist": {
  "CFBundleURLTypes": [{
    "CFBundleURLSchemes": ["com.googleusercontent.apps.123-abc"]
  }]
}
```

---

## Run on Simulator (2 min)

### iOS (Mac only)

```bash
npx expo prebuild
npx expo run:ios
```

### Android

```bash
npx expo prebuild
cd android && ./gradlew signingReport  # Copy SHA-1
```

Add SHA-1 to Firebase:
- Project Settings → Android app → Add fingerprint → Paste

Then:
```bash
cd ..
npx expo run:android
```

---

## Move Config Files After Prebuild

```bash
# Android
cp ~/Downloads/google-services.json android/app/

# iOS
cp ~/Downloads/GoogleService-Info.plist ios/
```

---

## Test Checklist

- [ ] App launches
- [ ] Click "Continue with Google"
- [ ] Select Google account
- [ ] Lands on Home screen
- [ ] Shows power: 0, streak: 0
- [ ] Click YES → Power becomes 1
- [ ] Check Firestore → See user document
- [ ] Click Progress → See timeline
- [ ] Sign Out → Returns to login

---

## Common Issues

**"Developer Error" on Android**

→ Add SHA-1 fingerprint to Firebase

**"Sign-in failed" on iOS**

→ Check iOS Client ID in app.json is correct reversed format

**"Network request failed"**

→ Check Firebase credentials in `firebase.ts`

---

## Production Build (EAS)

```bash
npm install -g eas-cli
eas login
eas build:configure

# iOS
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android
```

---

## Full Documentation

For detailed setup: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
For project overview: See [README.md](./README.md)
