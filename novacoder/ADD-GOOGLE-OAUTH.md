# Add Google OAuth to NOVA AI (Lovable App)

## 📍 Where to Add Credentials

Your NOVA AI app uses **Supabase** for authentication. You need to add Google OAuth credentials in **two places**:

1. **Supabase Dashboard** (Main setup)
2. **Local `.env` file** (Optional, for local testing)

---

## Method 1: Supabase Dashboard (Recommended)

### Step 1: Go to Supabase Dashboard

**Your Project URL:**
```
https://supabase.com/dashboard/project/cssbdczcgkfpczucdpub
```

Or go to: https://supabase.com/dashboard and select your project

### Step 2: Navigate to Authentication

1. In the left sidebar, click **"Authentication"**
2. Click **"Providers"** tab
3. Scroll down to find **"Google"**

### Step 3: Enable Google Provider

1. Click on **"Google"** to expand it
2. Toggle **"Enable Sign in with Google"** to ON
3. You'll see two fields:

```
┌─────────────────────────────────────────────┐
│ Google OAuth Client ID                      │
│ ┌─────────────────────────────────────────┐ │
│ │ Paste your Client ID here              │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Google OAuth Client Secret                  │
│ ┌─────────────────────────────────────────┐ │
│ │ Paste your Client Secret here          │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Save]                                      │
└─────────────────────────────────────────────┘
```

### Step 4: Add Your Google Credentials

**Client ID:**
```
123456789.apps.googleusercontent.com
```
(Paste the Client ID you got from Google Cloud Console)

**Client Secret:**
```
GOCSPX-xxxxxxxxxxxxx
```
(Paste the Client Secret you got from Google Cloud Console)

### Step 5: Get Redirect URL

Supabase will show you a **Callback URL** like:
```
https://cssbdczcgkfpczucdpub.supabase.co/auth/v1/callback
```

**Copy this URL!** You need to add it to Google Console.

### Step 6: Click "Save"

---

## Method 2: Add to Google Console

### Step 1: Go to Google Cloud Console

https://console.cloud.google.com/apis/credentials

### Step 2: Edit Your OAuth Client

Click on your OAuth client (e.g., "NOVA AI Web Client")

### Step 3: Add Supabase Redirect URI

Under **"Authorized redirect URIs"**, click **"+ ADD URI"** and add:

```
https://cssbdczcgkfpczucdpub.supabase.co/auth/v1/callback
```

### Step 4: Add Your App Domains

Under **"Authorized JavaScript origins"**, add:

```
https://novacoder13.lovable.app
https://cssbdczcgkfpczucdpub.supabase.co
http://localhost:5173
```

### Step 5: Save

Click **"SAVE"** at the bottom

---

## Method 3: Local Environment (Optional)

If you want to test locally, you can add to your `.env` file:

### Edit `novacoder/.env`

Add these lines:

```env
# Existing Supabase config
VITE_SUPABASE_PROJECT_ID="cssbdczcgkfpczucdpub"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://cssbdczcgkfpczucdpub.supabase.co"

# Add Google OAuth (optional for local testing)
VITE_GOOGLE_CLIENT_ID="123456789.apps.googleusercontent.com"
```

**Note:** You don't need the Client Secret in `.env` - Supabase handles it server-side.

---

## Complete Setup Checklist

### ✅ In Google Cloud Console:

1. [ ] OAuth consent screen configured
2. [ ] OAuth client created
3. [ ] Authorized JavaScript origins added:
   - `https://novacoder13.lovable.app`
   - `https://cssbdczcgkfpczucdpub.supabase.co`
   - `http://localhost:5173`
4. [ ] Authorized redirect URIs added:
   - `https://cssbdczcgkfpczucdpub.supabase.co/auth/v1/callback`
   - `https://novacoder13.lovable.app/auth/callback` (if needed)
   - `http://localhost:5173/auth/callback` (if needed)

### ✅ In Supabase Dashboard:

1. [ ] Go to Authentication → Providers
2. [ ] Enable Google provider
3. [ ] Add Google Client ID
4. [ ] Add Google Client Secret
5. [ ] Save changes

### ✅ In Your Code:

Your Lovable app should already have the Google sign-in button configured. If not, check `src/` for authentication components.

---

## Testing Your Setup

### Step 1: Run Locally

```bash
cd novacoder
npm install
npm run dev
```

### Step 2: Test Sign In

1. Visit: http://localhost:5173
2. Click **"Sign in with Google"** button
3. Select your Google account
4. Grant permissions
5. You should be signed in! ✅

### Step 3: Test on Production

1. Deploy to Vercel (if not already):
   ```bash
   vercel --prod
   ```

2. Visit: https://novacoder13.lovable.app
3. Test Google sign-in

---

## Troubleshooting

### Error: "Invalid OAuth client"

**Solution:**
1. Check Client ID and Secret in Supabase
2. Make sure they match Google Console
3. No extra spaces or characters

### Error: "redirect_uri_mismatch"

**Solution:**
1. Copy the EXACT callback URL from Supabase
2. Add it to Google Console redirect URIs
3. Format: `https://cssbdczcgkfpczucdpub.supabase.co/auth/v1/callback`

### Error: "Access blocked"

**Solution:**
1. Check OAuth consent screen is complete
2. Add your email as a test user (if in testing mode)
3. Verify all required fields are filled

### Sign-in button not working

**Solution:**
1. Check browser console for errors
2. Verify Supabase keys in `.env` are correct
3. Make sure you ran `npm install`
4. Restart dev server

---

## Quick Links

**Supabase Dashboard:**
https://supabase.com/dashboard/project/cssbdczcgkfpczucdpub

**Supabase Auth Settings:**
https://supabase.com/dashboard/project/cssbdczcgkfpczucdpub/auth/providers

**Google Cloud Console:**
https://console.cloud.google.com/apis/credentials

**Your App (Local):**
http://localhost:5173

**Your App (Production):**
https://novacoder13.lovable.app

---

## Important URLs for Google Console

### Authorized JavaScript Origins:
```
https://novacoder13.lovable.app
https://cssbdczcgkfpczucdpub.supabase.co
http://localhost:5173
```

### Authorized Redirect URIs:
```
https://cssbdczcgkfpczucdpub.supabase.co/auth/v1/callback
```

---

## Summary

**Where to add credentials:**
1. **Supabase Dashboard** → Authentication → Providers → Google
   - Add Client ID
   - Add Client Secret
   - Copy callback URL

2. **Google Console** → Credentials → Your OAuth Client
   - Add Supabase callback URL to redirect URIs
   - Add your domains to JavaScript origins

**That's it!** Your NOVA AI app will now support Google sign-in. 🎉

---

## Next Steps

1. **Configure Supabase** with Google credentials
2. **Update Google Console** with Supabase callback URL
3. **Test locally** at http://localhost:5173
4. **Deploy to production** with `vercel --prod`
5. **Test production** at https://novacoder13.lovable.app

Your Lovable app already has the UI for Google sign-in - you just need to connect the credentials!
