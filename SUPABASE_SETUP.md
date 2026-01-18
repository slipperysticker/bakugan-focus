# Supabase Setup Instructions

Complete guide to setting up Supabase for Bakugan Focus app.

## Prerequisites

✅ Supabase project created
✅ Project URL and anon key already configured in `src/config/supabase.ts`

---

## Step 1: Run Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/mmeshpxloyttkoohpobv
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)

This creates:
- ✅ `users` table
- ✅ `check_ins` table
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Auto-trigger to create user on sign-up

---

## Step 2: Enable Google OAuth

### 2.1 Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**

### 2.2 Configure OAuth Consent Screen

1. Click **"Configure Consent Screen"**
2. Select **"External"**
3. Fill in:
   - App name: `Bakugan Focus`
   - User support email: your email
   - Developer contact: your email
4. Click **"Save and Continue"**
5. Skip scopes → **"Save and Continue"**
6. Add test users (your email) → **"Save and Continue"**

### 2.3 Create OAuth Client ID

1. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
2. Application type: **"Web application"**
3. Name: `Bakugan Focus Web`
4. Authorized JavaScript origins:
   ```
   https://mmeshpxloyttkoohpobv.supabase.co
   ```
5. Authorized redirect URIs:
   ```
   https://mmeshpxloyttkoohpobv.supabase.co/auth/v1/callback
   ```
6. Click **"Create"**
7. **Copy Client ID and Client Secret** (you'll need these next)

### 2.4 Create iOS OAuth Client (for mobile)

1. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
2. Application type: **"iOS"**
3. Name: `Bakugan Focus iOS`
4. Bundle ID: `com.bakuganfocus.app`
5. Click **"Create"**

### 2.5 Create Android OAuth Client (for mobile)

1. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
2. Application type: **"Android"**
3. Name: `Bakugan Focus Android`
4. Package name: `com.bakuganfocus.app`
5. **SHA-1 fingerprint**: Leave blank for now (we'll add after prebuild)
6. Click **"Create"**

### 2.6 Enable Google Provider in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **"Google"** provider
3. Click to expand
4. Toggle **"Enable Sign in with Google"**
5. Paste **Client ID** (from Step 2.3)
6. Paste **Client Secret** (from Step 2.3)
7. Click **"Save"**

---

## Step 3: Configure Deep Linking

Update `app.json` with your Supabase URL:

```json
{
  "expo": {
    "scheme": "bakuganfocus",
    "ios": {
      "bundleIdentifier": "com.bakuganfocus.app",
      "infoPlist": {
        "CFBundleURLTypes": [{
          "CFBundleURLSchemes": ["bakuganfocus"]
        }]
      }
    },
    "android": {
      "package": "com.bakuganfocus.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "bakuganfocus"
            }
          ],
          "category": [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ]
    }
  }
}
```

---

## Step 4: Build and Get Android SHA-1

### 4.1 Run Prebuild

```bash
npx expo prebuild
```

### 4.2 Get SHA-1 Fingerprint

```bash
cd android
./gradlew signingReport
```

Look for the **debug keystore** SHA-1 hash (format: `A1:B2:C3:...`)

### 4.3 Add SHA-1 to Google Cloud

1. Go back to Google Cloud Console → Credentials
2. Find your **Android OAuth Client**
3. Click **Edit**
4. Add the **SHA-1 fingerprint**
5. Click **"Save"**

---

## Step 5: Test Authentication

### Run on iOS

```bash
npx expo run:ios
```

### Run on Android

```bash
npx expo run:android
```

### Test Flow

1. Click **"Continue with Google"**
2. Should open Google OAuth in browser
3. Select Google account
4. Should redirect back to app
5. Should land on Home screen
6. Check Supabase Dashboard → **Authentication** → **Users** (should see new user)
7. Check **Table Editor** → **users** table (should see user record)

---

## Step 6: Verify Database

### Check Tables

1. Go to Supabase Dashboard → **Table Editor**
2. You should see:
   - ✅ `users` table
   - ✅ `check_ins` table

### Test Check-In

1. In the app, click **"YES"** button
2. Go to Supabase Dashboard → **Table Editor** → **check_ins**
3. You should see a new record with:
   - `user_id`: your user ID
   - `date`: today's date
   - `completed`: true

4. Go to **users** table
5. You should see updated:
   - `power`: 1
   - `current_streak`: 1
   - `last_check_in_date`: today

---

## Troubleshooting

### "Invalid login credentials"

- **Check:** Google OAuth credentials in Supabase Dashboard
- **Check:** Redirect URI matches exactly: `https://mmeshpxloyttkoohpobv.supabase.co/auth/v1/callback`
- **Check:** Client ID and Secret are correct

### "Failed to open URL"

- **Check:** URL scheme in app.json matches (`bakuganfocus`)
- **Check:** Prebuild was run after updating app.json
- **Rebuild:** `npx expo prebuild --clean && npx expo run:ios`

### Google Sign-In shows blank screen

- **Android:** SHA-1 fingerprint not added to Google Cloud Console
- **iOS:** Bundle ID doesn't match (`com.bakuganfocus.app`)

### "relation 'users' does not exist"

- **Fix:** Run the SQL schema from Step 1
- **Check:** Go to Supabase Dashboard → SQL Editor → run `supabase/schema.sql`

### Row Level Security errors

- **Check:** RLS policies were created (they're in the schema.sql)
- **Verify:** Go to Supabase Dashboard → Authentication → Policies
- **Fix:** Re-run the schema.sql file

---

## Database Schema Reference

### users table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (from auth.users) |
| email | TEXT | User email |
| created_at | TIMESTAMPTZ | Account creation time |
| current_streak | INTEGER | Current consecutive days |
| max_streak | INTEGER | Highest streak achieved |
| power | INTEGER | Total check-ins (never decreases) |
| last_check_in_date | DATE | Last check-in date (YYYY-MM-DD) |

### check_ins table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Auto-increment primary key |
| user_id | UUID | Foreign key to users.id |
| date | DATE | Check-in date (YYYY-MM-DD) |
| completed | BOOLEAN | Always true |
| created_at | TIMESTAMPTZ | Record creation time |

**Unique constraint:** `(user_id, date)` - prevents duplicate check-ins

---

## Row Level Security Policies

All tables have RLS enabled. Users can only:
- ✅ Read their own data
- ✅ Insert their own data
- ✅ Update their own data
- ❌ Access other users' data

---

## Production Considerations

### Before deploying to production:

1. **Update OAuth credentials** for production domain
2. **Get production SHA-1** from EAS build:
   ```bash
   eas credentials
   ```
3. **Add production SHA-1** to Google Cloud Console
4. **Test on real devices** (not just simulators)
5. **Monitor Supabase Dashboard** for errors
6. **Set up database backups** (Supabase does this automatically on paid plans)

---

## Quick Reference

### Supabase Dashboard URLs

- **Project**: https://supabase.com/dashboard/project/mmeshpxloyttkoohpobv
- **SQL Editor**: https://supabase.com/dashboard/project/mmeshpxloyttkoohpobv/sql
- **Table Editor**: https://supabase.com/dashboard/project/mmeshpxloyttkoohpobv/editor
- **Authentication**: https://supabase.com/dashboard/project/mmeshpxloyttkoohpobv/auth/users
- **API Docs**: https://supabase.com/dashboard/project/mmeshpxloyttkoohpobv/api

### Files Already Configured

- ✅ `src/config/supabase.ts` - Project URL and anon key
- ✅ `supabase/schema.sql` - Database schema
- ✅ All services rewritten for Supabase
- ✅ All screens updated for PostgreSQL field names

---

## Next Steps

1. Run SQL schema (Step 1)
2. Enable Google OAuth (Step 2)
3. Test on simulator (Step 5)
4. Get SHA-1 and test on device (Step 4)
5. Verify all features work
6. Build for production with EAS
