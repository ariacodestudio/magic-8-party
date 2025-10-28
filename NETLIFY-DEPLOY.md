# 🚀 Quick Netlify Deployment

Your code is ready! Follow these steps:

## ✅ Pre-Deployment Checklist

- ✅ Git initialized and committed
- ✅ Build tested and working
- ✅ `.env` file exists locally (not committed)
- ✅ Supabase project set up
- ✅ App works locally

## 📝 Step-by-Step Deployment

### Step 1: Create GitHub Repository (2 min)

1. Go to https://github.com/new
2. Repository name: `magic-8-party` (or your choice)
3. Make it **Public** or **Private** (your choice)
4. **DO NOT** check any boxes (no README, no .gitignore, no license)
5. Click **"Create repository"**

### Step 2: Push Your Code (1 min)

Copy and run these commands (GitHub will show them too):

```bash
cd /Users/biancamontesanti/8ball

# Add your GitHub repo (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/magic-8-party.git

# Push to GitHub
git push -u origin main
```

If you have SSH set up, use:
```bash
git remote add origin git@github.com:YOUR_USERNAME/magic-8-party.git
git push -u origin main
```

### Step 3: Deploy to Netlify (5 min)

#### A. Sign in to Netlify
1. Go to https://app.netlify.com
2. Sign in (use GitHub login for easier setup)

#### B. Import Project
1. Click **"Add new site"** button (top right)
2. Select **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify (if first time)
5. Find and select your `magic-8-party` repository

#### C. Configure Build Settings
Should auto-detect, but verify:
- **Branch**: `main`
- **Build command**: `yarn build`
- **Publish directory**: `dist`

#### D. Add Environment Variables ⚠️ CRITICAL!
1. Click **"Add environment variables"** (or "Show advanced")
2. Add these TWO variables from your `.env` file:

```
Name: VITE_SUPABASE_URL
Value: (paste from your .env file)

Name: VITE_SUPABASE_ANON_KEY  
Value: (paste from your .env file)
```

**Where to find these?**
```bash
cat /Users/biancamontesanti/8ball/.env
```

#### E. Deploy!
1. Click **"Deploy site"**
2. Wait 2-3 minutes...
3. 🎉 Your site is live!

### Step 4: Get Your URL

Netlify gives you a random URL like:
```
https://random-name-12345.netlify.app
```

**To customize it:**
1. Go to **Site settings** → **Domain management**  
2. Click **"Options"** → **"Edit site name"**
3. Change to something like: `magic-8-party` or `8ball-party`
4. Save!

Your new URL:
```
https://magic-8-party.netlify.app
```

### Step 5: Test Your Deployed App! 🎉

Open these URLs:

**TV View (big screen):**
```
https://your-site.netlify.app/display
```

**Mobile View (scan QR or share link):**
```
https://your-site.netlify.app/
```

The QR code on the TV view will automatically show your production URL!

---

## 🎬 Party Time!

1. **On TV/projector**: Open `/display`, go fullscreen (click anywhere)
2. **Guests**: Scan QR code or visit the URL
3. **Everyone**: Click "Ask the 8 Ball" and watch magic happen! ✨

---

## 🔄 Making Updates

After you make changes locally:

```bash
git add .
git commit -m "Your update message"
git push
```

Netlify will **automatically redeploy**! Takes ~2 minutes.

---

## 🐛 Troubleshooting

### Build fails on Netlify
- Check deploy logs in Netlify dashboard
- Verify `package.json` and `yarn.lock` are committed
- Try `yarn build` locally first

### Blank page after deploy
1. Check browser console (F12)
2. Verify environment variables in Netlify:
   - Go to Site settings → Environment variables
   - Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist
3. Redeploy: Deploys → Trigger deploy

### Supabase connection errors
1. Check Supabase project is active (not paused)
2. Verify environment variables match your `.env` file exactly
3. Check Supabase dashboard for API key (Settings → API)

### Need to see environment variables?
```bash
cat .env
```

---

## 📱 Share Your App

Once deployed, share:
- Direct link: `https://your-site.netlify.app`
- QR code: Display `/display` page on screen
- Instructions: "Scan QR code or visit [your-site.netlify.app]"

---

## 🎊 You're Live!

Your Magic 8 Party is now on the internet! 🌐

Have fun at your party! 🎱✨
