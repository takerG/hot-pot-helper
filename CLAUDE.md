# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**hot-pot-helper** (火锅助手) - 一个多功能火锅辅助应用，包含计时器和蘸料手册两大核心功能。

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Pure CSS with CSS Variables
- **Deployment**: GitHub Pages

## Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production (outputs to docs/)
npm run preview       # Preview production build
npm run deploy        # Build and prepare for GitHub Pages deployment
npm run bump-version  # Increment patch version number
```

## Project Structure

```
src/
  ├── App.jsx          # Main app with navigation and timer logic
  ├── App.css          # Component styles
  ├── SauceGuide.jsx   # Sauce guide feature page
  ├── sauces.js        # Sauce recipe database
  ├── data.js          # Ingredient data for timer
  ├── version.js       # Version injector (auto-generated)
  ├── index.css        # Global styles and CSS variables
  └── main.jsx         # React entry point
docs/                  # Production build output (auto-deployed)
.github/workflows/     # GitHub Actions for CI/CD
VERSION                # Semantic version number (auto-incremented)
```

## Architecture

**Multi-Page Architecture**:
- Single-page app with bottom navigation
- Two main pages: Timer (计时器) and Sauce Guide (蘸料手册)
- Shared header and navigation components

**Timer System** (`src/App.jsx`, `src/data.js`):
- 6 ingredient categories: meats, offal, vegetables, seafood, tofu, staples
- Each ingredient has recommended cooking time in seconds
- Multi-timer support with concurrent timing
- Global interval (1s) updates all active timers
- Timer completion triggers:
  - Audio alarm (two beeps via Web Audio API)
  - Haptic feedback (vibration pattern)
  - Visual changes: green border, background gradient, checkmark badge, enlarged scale

**Sauce Guide** (`src/SauceGuide.jsx`, `src/sauces.js`):
- 3 sauce categories: Classic (经典), Regional (地方特色), Special (特色配方)
- 14+ sauce recipes with detailed ingredients and tips
- Search and favorites functionality (localStorage persistence)
- Soup base pairing recommendations

**Version System**:
- Version stored in `VERSION` file (semantic versioning: X.Y.Z)
- Auto-incremented on each push to main (via GitHub Actions)
- Injected at build time via Rollup replace plugin
- Displayed in footer

## GitHub Pages Deployment

Build output goes to `docs/` directory with base path `/hot-pot-helper/`.

**CI/CD Workflows**:
1. `deploy.yml` - Deploys `docs/` to GitHub Pages on every push
2. `auto-version.yml` - Auto-increments VERSION on non-version commits

**Manual Deploy**:
```bash
npm run bump-version  # Increment version
npm run deploy        # Build to docs/
git add . && git commit -m "..." && git push
```

## Key Features

1. **Bottom Navigation**: Tab-based switching between Timer and Sauce Guide
2. **Multi-Timer**: Start/pause/reset multiple timers simultaneously
3. **Timer Completion Effects**:
   - Green border and background gradient
   - Checkmark badge in top-right corner
   - Ingredient name turns green
   - Reset button turns green
   - Bouncing animation on countdown
4. **Audio/Haptic Alerts**: Two beeps + vibration pattern on completion
5. **Sauce Search & Favorites**: Filter recipes, save favorites to localStorage
6. **Responsive Design**: Mobile-first with CSS grid/flexbox
7. **Safe Area Support**: Handles notch devices with env(safe-area-inset-*)
