# 🚀 Deploy to Netlify - Step by Step

## 📋 Prerequisites

- ✅ App working locally
- ✅ Supabase project set up
- ✅ GitHub account
- ✅ Netlify account (free)

## 🎯 Deployment Steps

### Step 1: Push to GitHub (5 min)

If you haven't already, initialize git and push to GitHub:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Magic 8 Party"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/magic-8-party.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Netlify (2 min)

1. Go to https://netlify.com
2. Sign in (or create account - use GitHub login for easy setup)
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub**
5. Authorize Netlify to access your repos
6. Select your `magic-8-party` repository

### Step 3: Configure Build Settings (1 min)

Netlify should auto-detect settings, but verify:

- **Branch to deploy**: `main`
- **Build command**: `yarn build`
- **Publish directory**: `dist`

Click **"Show advanced"** if you need to set these manually.

### Step 4: Add Environment Variables (2 min) ⚠️ IMPORTANT

Before deploying, add your Supabase credentials:

1. Click **"Add environment variables"**
2. Add these two variables:

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

**Copy the exact values from your `.env` file!**

### Step 5: Deploy! (1 min)

Click **"Deploy site"**

⏳ Wait 2-3 minutes while Netlify:
- Clones your repo
- Installs dependencies
- Builds the app
- Deploys it

### Step 6: Get Your URL (30 sec)

Once deployed, you'll see:
```
✅ Site is live at https://random-name-12345.netlify.app
```

You can customize this:
1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Change to: `magic-8-party` or similar
4. Your new URL: `https://magic-8-party.netlify.app`

### Step 7: Test It! (2 min)

1. Open `https://your-site.netlify.app/display` on a computer
2. Scan the QR code with your phone
3. Click "Ask the 8 Ball"
4. Watch it appear on both screens! 🎉

---

## 🎬 Party Time!

Now you can:
1. **Display on TV**: Open `/display` on any browser, go fullscreen
2. **Share the QR code**: Guests scan and play!
3. **Everyone participates**: Multiple people can ask questions

---

## 🐛 Troubleshooting

### "Build failed"

Check the deploy logs:
- Missing dependencies? → Push `package.json` and `yarn.lock`
- Build errors? → Run `yarn build` locally first

### "Blank page after deploy"

1. Check browser console (F12) for errors
2. Verify environment variables are set in Netlify
3. Make sure you added **VITE_** prefix to variables

### "Supabase errors in production"

1. Go to Netlify dashboard → Site settings → Environment variables
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
3. Redeploy: Deploys → Trigger deploy → Deploy site

### "QR code shows localhost"

This is expected! The QR code uses `window.location.origin`, so it will automatically show the correct URL in production.

### Need to update the site?

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Netlify auto-deploys! ✨
```

---

## 📱 Custom Domain (Optional)

Want `magic8party.com`?

1. Buy domain (Namecheap, Google Domains, etc.)
2. In Netlify: Site settings → Domain management → Add custom domain
3. Follow DNS setup instructions
4. Done! 🎉

---

## 🎊 You're Done!

Your Magic 8 Party is now live and ready for guests!

Share the link and have fun! 🎱✨
