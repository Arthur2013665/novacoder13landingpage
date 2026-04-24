# Add Authorized Callback URL - Quick Guide

## 🎯 Your Supabase Callback URL

Since Lovable already configured your credentials, you just need to add this callback URL to Google Console:

```
https://cssbdczcgkfpczucdpub.supabase.co/auth/v1/callback
```

---

## Step-by-Step

### Step 1: Go to Google Cloud Console

**Direct link:**
https://console.cloud.google.com/apis/credentials

### Step 2: Click Your OAuth Client

Look for your OAuth client in the list (probably named "NOVA AI Web Client" or similar) and click on it.

### Step 3: Add Callback URL

Scroll down to **"Authorized redirect URIs"**

Click **"+ ADD URI"**

Paste this EXACT URL:
```
https://cssbdczcgkfpczucdpub.supabase.co/auth/v1/callback
```

### Step 4: Save

Scroll to the bottom and click **"SAVE"**

---

## Complete List of URIs to Add

### Authorized JavaScript Origins:
```
https://novacoder13.lovable.app
https://cssbdczcgkfpczucdpub.supabase.co
http://localhost:5173
```

### Authorized Redirect URIs:
```
https://cssbdczcgkfpczucdpub.supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
```

---

## Test It

After adding the callback URL:

1. Wait 1-2 minutes for changes to propagate
2. Go to your app: https://novacoder13.lovable.app
3. Click "Sign in with Google"
4. Should work! ✅

---

## If You Get Errors

### "redirect_uri_mismatch"

The error message will show the exact URI it's trying to use. Copy that EXACT URI and add it to Google Console.

### "invalid_client"

Your credentials might not be set up in Supabase yet. Check:
https://supabase.com/dashboard/project/cssbdczcgkfpczucdpub/auth/providers

---

That's it! Just add the callback URL and you're done. 🚀
