# Magic 8 Party 🎱

A minimal real-time web experience where guests at a party can ask the Magic 8 Ball from their phones and see the answers appear on a TV screen.

## 🎯 Features

- 📱 Mobile-friendly interface for guests to ask questions
- 📺 Fullscreen TV display showing real-time answers
- 🌐 QR code for easy guest access
- ⚡ Real-time synchronization via Supabase
- 🎨 Minimalist black & white design with neon blue accents
- ✨ Smooth Framer Motion animations

## 🧱 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **Animation**: Framer Motion
- **Backend**: Supabase (Realtime)
- **QR Code**: qrcode.react
- **Package Manager**: Yarn
- **Deployment**: Netlify (frontend) + Supabase (backend)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd 8ball
```

2. Install dependencies:
```bash
yarn install
```

3. Set up Supabase:

   a. Create a new Supabase project
   
   b. Create the `answers` table:
   ```sql
   create table answers (
     id uuid default gen_random_uuid() primary key,
     message text not null,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```
   
   c. Enable Realtime for the answers table:
   ```sql
   alter publication supabase_realtime add table answers;
   ```

4. Configure environment variables:
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
```bash
yarn dev
```

The app will be available at `http://localhost:5173`

## 📄 Pages

### `/` - Mobile Page
- Shows the Magic 8 Ball graphic
- "Ask the 8 Ball" button that randomizes an answer
- Animations for shaking and displaying results

### `/display` - TV Display
- Fullscreen mode optimized for TVs
- Large Magic 8 Ball graphic
- Displays the most recent answer in real-time
- QR code linking to the main page
- Click anywhere to toggle fullscreen

## 🎨 Design

- **Color Scheme**: Black background, white text, neon blue (`#00ffff`) accents
- **Typography**: Bold, centered text
- **Animations**: Shake effect, fade/scale transitions
- **Responsive**: Optimized for both mobile and large displays

## 📦 Building for Production

```bash
yarn build
```

The production build will be in the `dist` directory.

## 🚢 Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `yarn build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Supabase

The Supabase backend is already deployed as part of your Supabase project. Make sure:
- The `answers` table exists
- Realtime is enabled for the table
- Your API credentials are correctly set in Netlify

## 🧪 Testing the Flow

1. Open `/display` on a TV or large screen
2. Scan the QR code with your phone
3. Click "Ask the 8 Ball" on your phone
4. Watch the answer appear on both devices in real-time!

## 📝 Project Structure

```
8ball/
├── src/
│   ├── components/
│   │   └── ui/         # shadcn/ui components
│   ├── data/
│   │   └── answers.ts  # Magic 8 Ball responses
│   ├── lib/
│   │   ├── supabase.ts # Supabase client
│   │   └── utils.ts     # Utility functions
│   ├── pages/
│   │   ├── MobilePage.tsx   # Mobile guest interface
│   │   └── DisplayPage.tsx  # TV display interface
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── netlify.toml
└── README.md
```

## 🎱 Magic 8 Ball Answers

- It is certain.
- Without a doubt.
- Yes – definitely.
- You may rely on it.
- Most likely.
- Outlook good.
- Reply hazy, try again.
- Ask again later.
- Better not tell you now.
- My reply is no.
- Outlook not so good.
- Very doubtful.

## ✨ Enhancements

- Animated 8 Ball shaking before displaying results
- Real-time synchronization across all connected devices
- Fullscreen support for TV displays
- Responsive design for all screen sizes

## 📄 License

MIT

---

Made with ❤️ for party magic! 🎉