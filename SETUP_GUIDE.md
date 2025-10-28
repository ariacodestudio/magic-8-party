# 🎱 Magic 8 Party - Setup Guide

This guide will walk you through setting up your Magic 8 Party app with Supabase.

## 📋 Prerequisites

- Node.js 18+ installed
- Yarn package manager installed
- A Supabase account (free tier works great!)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Set Up Supabase

#### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Organization**: Select or create one
   - **Name**: Magic 8 Party (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
5. Click "Create new project"

#### Step 2: Create the Answers Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Paste this SQL:

```sql
create table answers (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable realtime
alter publication supabase_realtime add table answers;

-- Set up Row Level Security (RLS) - allow public read/write for demo
alter table answers enable row level security;

create policy "Allow anonymous access" on answers
  for all using (true);
```

4. Click "Run" (or press Cmd/Ctrl + Enter)

#### Step 3: Get Your API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (the `anon` `public` key)

#### Step 4: Configure Environment Variables

1. Create a `.env` file in the root of your project:

```bash
touch .env
```

2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace `xxxxx` and `your-anon-key-here` with your actual values!

### 3. Run the Development Server

```bash
yarn dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Test the App

1. Open `http://localhost:5173/display` in a browser window (this simulates the TV)
2. Open `http://localhost:5173/` in another browser window or your phone
3. Click "Ask the 8 Ball" on the mobile view
4. Watch the answer appear on both screens!

## 🎬 How to Use at a Party

### Setup (Before the party)

1. **Deploy the app**:
   - Push code to GitHub
   - Connect to Netlify
   - Add environment variables in Netlify dashboard
   - Deploy!

2. **Access the TV view**:
   - Open the deployed URL on a smart TV or connected device
   - Navigate to `/display`
   - Make it fullscreen (click anywhere)

### During the party

1. **Guests scan the QR code** from the TV screen
2. **They click "Ask the 8 Ball"** on their phones
3. **Answers appear on the TV** in real-time! 🎉

## 🐛 Troubleshooting

### "Supabase credentials not found" warning

- Check that your `.env` file exists in the root directory
- Verify the variable names are correct: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Make sure the `.env` file is in the same directory as `package.json`
- Restart the dev server after creating/modifying `.env`

### No answers appearing on TV

- Check browser console for errors
- Verify Supabase table exists and RLS policies are set
- Make sure realtime is enabled for the `answers` table
- Check that you're using the correct Supabase project

### QR code not working

- Make sure you're testing with the production URL (not localhost)
- Verify the URL in the QR code matches your deployed site
- Check that your phone can access the internet

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules .yarn yarn.lock
yarn install
```

## 📦 Building for Production

```bash
yarn build
```

The output will be in the `dist/` directory.

## 🚢 Deployment

### Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and sign in
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Configure:
   - Build command: `yarn build`
   - Publish directory: `dist`
6. Go to "Site settings" → "Environment variables"
7. Add:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
8. Click "Deploy site"

### Manual Build

If deploying manually (e.g., to a VPS):

```bash
# Build the app
yarn build

# The dist folder contains your production-ready files
# Upload to your hosting service
```

## ✅ Checklist

- [ ] Supabase project created
- [ ] `answers` table created with SQL
- [ ] Realtime enabled on the table
- [ ] RLS policies configured
- [ ] `.env` file created with credentials
- [ ] App runs locally (`yarn dev`)
- [ ] Can add answers via mobile page
- [ ] Answers appear on display page
- [ ] Deployed to Netlify
- [ ] Environment variables set in Netlify
- [ ] Production URL works on phone
- [ ] QR code scanned and working

## 🎉 Next Steps

Once everything is working:

1. Share the TV screen at your party
2. Let guests scan and ask questions
3. Have fun! 🎱

## 💡 Tips

- Test with multiple devices to simulate multiple guests
- Keep the TV view in fullscreen for best effect
- The app works offline for displaying cached answers, but needs internet for new ones
- Consider adding your party's branding colors!

---

Need help? Check the [README.md](./README.md) for more details.
