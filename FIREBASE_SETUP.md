# Firebase Setup Instructions

Complete guide to setting up Firebase for Bakugan Focus app.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: `bakugan-focus`
4. **Disable** Google Analytics (not needed for MVP)
5. Click **"Create project"**
6. Wait for project creation to complete

---

## Step 2: Enable Authentication

1. In Firebase Console, click **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Find **"Google"** in the providers list
5. Click on Google provider
6. Toggle **"Enable"**
7. Set **"Project support email"** (your email)
8. Click **"Save"**

---

## Step 3: Create Firestore Database

1. In Firebase Console, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll set custom rules next)
4. Choose location: `us-central1` (or closest to your target users)
5. Click **"Enable"**
6. Wait for database creation

### Set Firestore Security Rules

1. In Firestore Database, click **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - user can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // CheckIns collection - user can only read/write their own check-ins
    match /checkIns/{checkInId} {
      allow read, write: if request.auth != null &&
        checkInId.matches('^' + request.auth.uid + '_.*$');
    }
  }
}
```

3. Click **"Publish"**

---

## Step 4: Register Android App

1. In Firebase Console, click **"Project Overview"** (gear icon) → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click **Android icon** (robot)
4. Android package name: `com.bakuganfocus.app`
5. App nickname: `Bakugan Focus Android`
6. **Skip SHA-1 for now** (we'll add it after prebuild)
7. Click **"Register app"**
8. **Download `google-services.json`**
9. Save this file (you'll move it after prebuild)
10. Click **"Continue"** and **"Finish"**

---

## Step 5: Register iOS App

1. In same **"Project settings"** page
2. Click **iOS icon** (Apple)
3. iOS bundle ID: `com.bakuganfocus.app`
4. App nickname: `Bakugan Focus iOS`
5. Click **"Register app"**
6. **Download `GoogleService-Info.plist`**
7. Save this file (you'll move it after prebuild)
8. Click **"Continue"** and **"Finish"**

---

## Step 6: Get Firebase Configuration

1. In **"Project settings"** → **"General"** tab
2. Scroll to **"Your apps"**
3. Find the **Web app** section (if not there, click "Add app" → Web)
4. Click on your web app to expand it
5. Find **"SDK setup and configuration"**
6. Select **"Config"** (not npm)
7. You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "bakugan-focus.firebaseapp.com",
  projectId: "bakugan-focus",
  storageBucket: "bakugan-focus.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

8. **Copy these values** - you'll need them next

---

## Step 7: Update Firebase Config in Code

1. Open `src/config/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR-ACTUAL-API-KEY",
  authDomain: "bakugan-focus.firebaseapp.com",
  projectId: "bakugan-focus",
  storageBucket: "bakugan-focus.firebasestorage.app",
  messagingSenderId: "YOUR-ACTUAL-SENDER-ID",
  appId: "YOUR-ACTUAL-APP-ID"
};
```

---

## Step 8: Get Google Sign-In Client IDs

### Get Web Client ID

1. In Firebase Console → **"Authentication"** → **"Sign-in method"**
2. Click on **"Google"** provider
3. Expand **"Web SDK configuration"**
4. Copy the **"Web client ID"** (format: `123456789-abc.apps.googleusercontent.com`)

### Get iOS Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **"APIs & Services"** → **"Credentials"**
4. Find the iOS client ID (format: `123456789-xyz.apps.googleusercontent.com`)
5. Copy it

---

## Step 9: Update Google Sign-In Config in Code

### Update authService.ts

1. Open `src/services/authService.ts`
2. Find the `GoogleSignin.configure()` call
3. Replace placeholder values:

```typescript
GoogleSignin.configure({
  webClientId: 'YOUR-WEB-CLIENT-ID.apps.googleusercontent.com',  // From Step 8
  iosClientId: 'YOUR-IOS-CLIENT-ID.apps.googleusercontent.com',  // From Step 8
});
```

### Update app.json

1. Open `app.json`
2. Find two places with `YOUR-IOS-CLIENT-ID`
3. Replace with your iOS client ID (from Step 8)

**Important:** Use the **REVERSED** format for iOS URL schemes:
- If your iOS client ID is: `123456789-abc.apps.googleusercontent.com`
- Use: `com.googleusercontent.apps.123456789-abc`

---

## Step 10: Run Prebuild

Now that all packages are installed, run prebuild to generate native folders:

```bash
npx expo prebuild
```

This creates the `android/` and `ios/` folders.

---

## Step 11: Add Android SHA-1 Fingerprint

### Get SHA-1 Hash

```bash
cd android
./gradlew signingReport
```

Look for the **debug keystore** section and copy the **SHA-1** hash (format: `A1:B2:C3:...`)

### Add to Firebase

1. Firebase Console → **"Project settings"**
2. Scroll to **"Your apps"** → Android app
3. Click **gear icon** → **"Add fingerprint"**
4. Paste SHA-1 hash
5. Click **"Save"**

### Download Updated google-services.json

1. In same Android app settings, click **"google-services.json"**
2. Download the updated file
3. Replace existing file:

```bash
cp ~/Downloads/google-services.json /path/to/bakugan-focus/android/app/google-services.json
```

---

## Step 12: Move iOS Config File

```bash
cp ~/Downloads/GoogleService-Info.plist /path/to/bakugan-focus/ios/GoogleService-Info.plist
```

---

## Step 13: Test the Setup

### Run on iOS

```bash
npx expo run:ios
```

### Run on Android

```bash
npx expo run:android
```

### Test Google Sign-In

1. Click **"Continue with Google"** button
2. Select Google account
3. Should successfully sign in and navigate to Home screen
4. Check Firestore Console - you should see a new document in `users` collection

---

## Troubleshooting

### "Unable to sign in with Google"

- **Check:** Web Client ID in `authService.ts` matches Firebase Console
- **Check:** iOS Client ID in `app.json` is correct and reversed
- **Check:** Android SHA-1 fingerprint added to Firebase

### "Firebase: Error (auth/invalid-api-key)"

- **Check:** `src/config/firebase.ts` has correct `apiKey`
- **Check:** API key is enabled in Google Cloud Console

### "Network request failed"

- **Check:** Internet connection
- **Check:** Firestore security rules are published
- **Check:** Firebase project is active (not deleted)

### Google Sign-In shows "Developer Error"

- **Android:** SHA-1 fingerprint not added or incorrect
- **iOS:** Bundle ID doesn't match Firebase iOS app configuration

---

## Production SHA-1 (Before Release)

For production builds via EAS:

```bash
eas credentials
```

Select your project, then:
- Choose "Android"
- Choose "Keystore"
- Copy the SHA-1 hash
- Add it to Firebase Console (same as Step 11)

---

## Next Steps

After Firebase is configured:

1. Test all 3 screens work
2. Test check-in creates Firestore documents
3. Test streak calculation
4. Test progress timeline
5. Build production version with EAS

---

## Quick Reference

### Firebase Console URLs

- **Project Overview:** https://console.firebase.google.com/project/bakugan-focus
- **Authentication:** https://console.firebase.google.com/project/bakugan-focus/authentication
- **Firestore:** https://console.firebase.google.com/project/bakugan-focus/firestore

### Files to Update

1. `src/config/firebase.ts` - Firebase config
2. `src/services/authService.ts` - Google Client IDs
3. `app.json` - iOS URL scheme
4. `android/app/google-services.json` - After prebuild
5. `ios/GoogleService-Info.plist` - After prebuild
