
# Traveller's Diary - Genshin Impact Dashboard

**Traveller's Diary** is a modern, immersive web application that serves as a personal dashboard for Genshin Impact players. It visualizes your in-game data, tracks your progress, and provides AI-powered insights using a beautiful, game-inspired UI.

![Project Preview](https://i.imgur.com/your-preview-image.png) *<!-- Replace with actual screenshot -->*

## 🌟 Key Features

### 📊 **Comprehensive Dashboard**
- **At-a-Glance Stats**: View active days, achievements, total characters, and Spiral Abyss progress.
- **Adventure Log**: A timeline of recent milestones like Abyss clears, artifact drops, and exploration feats.
- **Visual Analytics**: Beautiful stat cards for chest counts, oculi collected, and exploration averages.

### 👥 **Character Showcase**
- **Interactive Grid**: Browse your entire roster with elemental filters and search.
- **Detailed Inspector**: Click any character to view detailed stats, including:
  - **Weapon**: Level, refinement, and base stats.
  - **Artifacts**: Equipped sets and main/sub stats.
  - **Constellations**: Toggle status and descriptions.
  - **Combat Stats**: Final calculated HP, ATK, DEF, CR/CD, and more.

### ⚔️ **Combat Analysis**
- **Spiral Abyss**: Detailed breakdown of the current moon phase, including star counts, battles fought, and MVPs (Strongest Strike, Most Defeats, etc.).
- **Imaginarium Theater**: Track seasonal progress, medals, and difficulty tiers for the new combat mode.
- **Stygian Onslaught**: Review records for limited-time hard combat challenges.

### 🌍 **World Exploration**
- **Region Tracking**: Visual progress rings for Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, and Natlan.
- **Deep Dive**: Drill down into specific regions to see sub-area percentages, offering levels (e.g., Tree of Dreams), and boss kill counts.

### 🏆 **Achievements**
- **Tracker**: Searchable and filterable list of all achievement series.
- **Progress Bars**: Visualize completion rates for every category.

### ✨ **Paimon AI Sidekick**
- **Context-Aware Chat**: An always-available AI companion powered by **Puter.js**.
- **Smart Analysis**: Paimon reads your specific account data to give tailored advice on builds, team comps, and what to focus on next.
- **Interactive UI**: Draggable, animated floating widget.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (custom config for Genshin aesthetics), Lucide React (Icons)
- **Routing**: React Router DOM v6
- **AI Integration**: [Puter.js](https://puter.com/) (LLM for Paimon personality)
- **API Proxy**: Vercel Serverless Functions (Node.js) to bridge HoYoLab API CORS restrictions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A HoYoLab account with public battle chronicle data.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/travellers-diary.git
   cd travellers-diary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173`

---

## 🔑 Login Guide

To fetch your data, the app requires your HoYoLab cookies (`ltuid_v2` and `ltoken_v2`). These act as your authentication key.

**How to get your cookies:**

1. Go to [HoYoLab.com](https://www.hoyolab.com/) and log in.
2. Open Developer Tools (Press **F12** or right-click > Inspect).
3. Navigate to the **Application** tab.
4. In the left sidebar, expand **Storage** > **Cookies** > `https://www.hoyolab.com`.
5. Find and copy the values for:
   - `ltuid_v2`
   - `ltoken_v2`
6. Paste these into the login screen of Traveller's Diary.

> **Note**: Your credentials are stored locally in your browser (`localStorage`) and are only sent to the official HoYoLab API via our transparent proxy.

---

## 📂 Project Structure

```
├── api/                  # Vercel Serverless Functions (HoYoLab Proxy)
├── src/
│   ├── components/       # UI Components (Layout, PaimonSidekick, cards)
│   ├── contexts/         # React Context (Auth, Chat)
│   ├── pages/            # Main Route Views (Dashboard, Abyss, etc.)
│   ├── services/         # API logic and AI integration
│   ├── types/            # TypeScript interfaces for Genshin data
│   └── constants.tsx     # Game data constants (Elements, Colors)
├── public/               # Static assets
└── index.html            # Entry point
```

---

## ⚠️ Disclaimer

This project is not affiliated with or endorsed by HoYoverse. "Genshin Impact", game content and materials are trademarks and copyrights of HoYoverse. This is a fan-made project created for educational and entertainment purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
