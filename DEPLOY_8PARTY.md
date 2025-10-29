# Deploy to 8party.netlify.app

## Option 1: Via Netlify Dashboard (Recommended)

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Create New Site**:
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize if needed
   - Select your repository: `ariacodestudio/magic-8-party`
3. **Configure Build Settings**:
   - Build command: `yarn install && yarn build`
   - Publish directory: `dist`
   - Branch: `main`
4. **Set Site Name**:
   - Click "Site settings" → "Change site name"
   - Enter: `8party`
   - Your site will be available at: `8party.netlify.app`
5. **Set Environment Variables** (if needed):
   - Go to "Site settings" → "Environment variables"
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Key
6. **Deploy**:
   - Netlify will automatically deploy on push to `main`
   - Or click "Deploy site" manually

## Option 2: Via Netlify CLI

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize new site
netlify init

# Follow prompts:
# - Create & configure a new site
# - Site name: 8party
# - Build command: yarn install && yarn build
# - Publish directory: dist

# Deploy
netlify deploy --prod
```

## Verify Deployment

After deployment, visit:
- **Live site**: https://8party.netlify.app
- **Display page**: https://8party.netlify.app/display
- **Mobile page**: https://8party.netlify.app/

## Notes

- Your `netlify.toml` is already configured correctly
- The site will auto-deploy on every push to `main`
- Make sure environment variables are set in Netlify dashboard
- The video file `curtainloop5.mp4` will be served from `/public`

