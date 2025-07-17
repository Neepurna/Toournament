# 🏆 Toournament - Decentralized Tournament Platform

A modern, responsive web application for decentralized tournaments with quiz games, built with React, TypeScript, and Material UI.

## 🎮 Features

### 🏠 **Landing Page**
- Wallet connection interface
- Modern, minimalist design
- MetaMask integration

### 🎯 **Main Navigation**
- **Solo Adventure**: Single-player practice mode
- **Tournament**: Competitive quiz battles
- **Vault**: NFT and rewards management
- **Profile**: User stats and achievements

### 🧠 **The Ultimate Quiz**
- **Practice Mode**: Survival quiz with exponential difficulty
- **Quiz Royale**: Competitive tournament mode (coming soon)

### 🎲 **Practice Quiz Game**
- **Survival Mode**: One wrong answer = Game Over
- **Timer System**: +5 seconds for correct answers
- **Exponential Difficulty**: 5 levels from Easy to Genius
- **30+ Questions**: Covering science, history, literature, and more
- **Streak Scoring**: Bonus points for consecutive correct answers
- **Instant Feedback**: No submit button - instant results

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Material UI
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Blockchain**: Hardhat, Ethers.js
- **Smart Contracts**: Solidity

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Neepurna/Toournament.git
cd Toournament
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3001`

## 🎲 How to Play

### Practice Mode
1. Navigate to **Tournament** → **Select Games** → **The Ultimate Quiz** → **Practice Mode**
2. Click **START PRACTICE** to begin
3. Answer questions by clicking on your choice
4. Get **+5 seconds** for each correct answer
5. **One wrong answer ends the game!**
6. Watch difficulty increase every 5 questions
7. Build streaks for bonus points

### Difficulty Levels
- **Level 1 (Easy)**: 30 sec limit, 100 pts base
- **Level 2 (Medium)**: 25 sec limit, 200 pts base
- **Level 3 (Hard)**: 20 sec limit, 400 pts base
- **Level 4 (Expert)**: 15 sec limit, 800 pts base
- **Level 5 (Genius)**: 10 sec limit, 1600 pts base

## 📁 Project Structure

```
Toournament/
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main app component
│   │   ├── HomePage.tsx         # Home page with navigation
│   │   ├── LandingPage.tsx      # Wallet connection page
│   │   ├── SelectGames.tsx      # Game selection page
│   │   ├── UltimateQuiz.tsx     # Quiz mode selection
│   │   ├── PracticeQuiz.tsx     # Practice quiz game
│   │   └── data/
│   │       └── quizData.ts      # Quiz questions database
│   ├── index.html
│   └── vite.config.ts
├── contracts/                   # Smart contracts
├── scripts/                     # Deployment scripts
├── test/                        # Test files
└── package.json
```

## 🎨 Design Features

- **Dark Theme**: Monochrome design with accent colors
- **Responsive Layout**: Works on desktop and mobile
- **Material UI Components**: Modern, consistent UI
- **Smooth Animations**: Hover effects and transitions
- **Visual Feedback**: Color-coded answers and timers

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests (placeholder)

## 📊 Game Statistics Tracking

- **Total Questions Answered**
- **Correct Answer Percentage**
- **Highest Streak**
- **Final Score**
- **Time Played**

## 🚧 Coming Soon

- **Quiz Royale**: Competitive multiplayer mode
- **The Amazing Race**: Adventure-style challenges
- **Mythical Combat**: Strategic battle game
- **Leaderboards**: Global rankings
- **NFT Rewards**: Unique collectibles
- **User Profiles**: Detailed statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🎯 Demo

Visit the live demo: [Coming Soon]

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for the decentralized gaming community**
