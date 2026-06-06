# 🎮 SudokuVerse

> **The Chess.com of Sudoku** — Learn. Solve. Compete. Master.

A beautiful, full-featured Sudoku app with smart hints, error detection, number highlighting, difficulty levels, timers, and more. Built with React + Vite.

---

## 🚀 Live Demo

**Deploy in 2 minutes → [vercel.com](https://vercel.com)**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌱🔥⚡💀 | 4 difficulty levels: Easy → Expert |
| ✅ Green answers | Your correct entries glow green |
| ❌ Red errors | Wrong numbers highlighted in red instantly |
| 🔵 Number highlight | Click any digit → all same numbers highlighted |
| 💡 Smart hints | Limited hints per difficulty, placed with explanation |
| ⏱️ Timer | Track your solve time |
| ↩️ Undo/Redo | Full move history (also Ctrl+Z / Ctrl+Y) |
| 🤖 Auto-solve | Reveal the solution instantly |
| 🏆 Victory screen | S/A/B/C rank based on time |
| ⌨️ Keyboard nav | Arrow keys + number keys + Backspace |
| 📱 Responsive | Works on mobile, tablet, desktop |
| 🎨 Dark theme | Eye-friendly dark UI with glowing accents |

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS** for utility styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Space Mono** + **Outfit** fonts (Google Fonts)
- Pure JS Sudoku engine (backtracking + MRV heuristic)

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/sudokuverse.git
cd sudokuverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production

```bash
npm run build
```

Output goes to `dist/` folder.

---

## 🌐 Deploy to Vercel (FREE — anyone can use the link)

### Option A: One-click deploy from GitHub

1. Push this repo to GitHub (see below)
2. Go to [vercel.com](https://vercel.com) → Sign up free
3. Click **"Add New Project"**
4. Import your GitHub repo
5. Click **Deploy** — done!

Your app gets a live link like `https://sudokuverse-xyz.vercel.app` that works on any device.

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Done in 30 seconds.

---

## 📲 GitHub Upload — Step by Step

### First time setup

```bash
# 1. Initialize git (if not done)
git init

# 2. Add all files
git add .

# 3. First commit
git commit -m "🎮 Initial commit — SudokuVerse v1.0"

# 4. Create repo on GitHub.com
#    → github.com → New repository → name: sudokuverse → Create

# 5. Connect and push
git remote add origin https://github.com/YOUR_USERNAME/sudokuverse.git
git branch -M main
git push -u origin main
```

### After making changes

```bash
git add .
git commit -m "✨ Your change description"
git push
```

---

## 📱 Install as App (PWA)

On mobile (Chrome/Safari):
- Open the Vercel link
- Tap the **Share** button → **"Add to Home Screen"**
- It installs like a native app!

On desktop (Chrome):
- Visit the link
- Click the install icon in the address bar

---

## 🗂️ Project Structure

```
sudokuverse/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx    # Home screen with difficulty selection
│   │   ├── GamePage.jsx       # Main game with all logic
│   │   ├── SudokuBoard.jsx    # 9x9 grid renderer
│   │   ├── SudokuCell.jsx     # Individual cell with all states
│   │   ├── NumberPad.jsx      # 1-9 buttons + actions
│   │   └── VictoryModal.jsx   # Win screen with rank
│   ├── hooks/
│   │   └── useTimer.js        # Timer hook
│   ├── utils/
│   │   └── sudoku.js          # All puzzle logic (generate, solve, validate)
│   ├── styles/
│   │   └── globals.css        # Global styles + CSS variables
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎯 Roadmap

- [ ] Phase 2: User accounts + statistics + leaderboard
- [ ] Phase 3: Multiplayer race mode
- [ ] Phase 4: OCR (scan puzzles from photos)
- [ ] Phase 5: Mobile app (Flutter)

---

## 📄 License

MIT — free to use, modify, and share.

---

**Built for SudokuVerse PRD v1.0**
