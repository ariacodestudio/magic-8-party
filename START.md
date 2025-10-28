# 🎱 Quick Start Guide

## What's Not Working?

The app needs Supabase credentials to function. Without them, it can't save or sync answers between devices.

## ✅ Fix It in 5 Minutes

### 1. Set Up Supabase (2 min)

Go to https://supabase.com
- Sign in / Create account
- Click "New Project"
- Name: `Magic 8 Party`
- Pick a password & region
- Wait ~2 minutes for setup

### 2. Create Database (1 min)

In your Supabase dashboard:
- Go to **SQL Editor** (left sidebar)
- Click **New query**
- Paste and run this:

```sql
create table answers (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter publication supabase_realtime add table answers;
alter table answers enable row level security;
create policy "Allow anonymous access" on answers for all using (true);
```

### 3. Get Your API Keys (30 sec)

In Supabase dashboard:
- Go to **Settings** → **API**
- Copy:
  - **Project URL**: `https://xxxxx.supabase.co`
  - **anon public key**: Long string starting with `eyJ...`

### 4. Update .env File (30 sec)

Edit `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Start the App (30 sec)

```bash
yarn dev
```

## 🎯 Test It

1. Open http://localhost:5173/display (TV view)
2. Open http://localhost:5173/ (mobile view)
3. Click "Ask the 8 Ball" on mobile
4. Watch it appear on both screens! ✨

## ❓ Still Not Working?

Check:
- [ ] `.env` file exists in project root (same folder as `package.json`)
- [ ] Supabase project is "Active" (not paused)
- [ ] SQL query ran without errors
- [ ] Copied the correct keys (URL and **anon** key, not service_role)
- [ ] Dev server restarted after updating `.env`

## 🐛 Debugging

Open browser console (F12):
- If you see "Supabase credentials not found" → Check `.env` file
- If you see 404 errors → Check Supabase project URL
- If you see 401 errors → Check anon key is correct

Need more help? See SETUP_GUIDE.md for detailed instructions.
