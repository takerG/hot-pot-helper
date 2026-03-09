# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**hot-pot-timer** - 火锅计时器，一个用于火锅食材涮煮计时的移动端 Web 应用。

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Pure CSS with CSS Variables

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (outputs to docs/)
npm run preview  # Preview production build
npm run deploy   # Build for GitHub Pages deployment
```

## GitHub Pages Deployment

The project is configured for GitHub Pages hosting:
- Build output goes to `docs/` directory
- Uses relative paths (`base: './'`) for portable deployment
- To deploy: push the `docs` folder to the `main` branch
- In GitHub repo settings: Settings → Pages → Source → Deploy from branch → main → /docs

Build artifacts in `docs/`:
```
docs/
  ├── index.html          # Entry point
  └── assets/             # Compiled CSS and JS bundles
      ├── index-*.css
      └── index-*.js
```

## Project Structure

```
src/
  ├── App.jsx       # Main application component with timer logic
  ├── App.css       # Component styles
  ├── data.js       # Ingredient data organized by categories
  ├── index.css     # Global styles and CSS variables
  └── main.jsx      # React entry point
```

## Architecture

**Data Model** (`src/data.js`):
- Ingredients organized into 6 categories: meats (肉类), offal (内脏), vegetables (蔬菜), seafood (海鲜), tofu (豆制品), staple (主食)
- Each ingredient has an id, name, and recommended cooking time in seconds

**Timer System** (`src/App.jsx`):
- Supports multiple concurrent timers
- Each timer tracks: isActive (running state), timeLeft (remaining seconds)
- Global interval updates all active timers every second
- Timer completion triggers audio alarm (two beeps) and haptic feedback (vibration pattern)

**Responsive Design**:
- Mobile-first CSS with flexbox and grid layouts
- CSS variables for theming
- Safe area insets for notch devices
- Category tabs with horizontal scrolling on mobile

## Key Features

1. **Category Navigation**: Tab-based navigation between ingredient categories
2. **Multi-timer**: Start/pause/reset multiple timers simultaneously
3. **Visual Feedback**: Progress bars, pulsing borders for active timers
4. **Audio Alerts**: Web Audio API beep sounds on timer completion
5. **Haptic Feedback**: Vibration API for mobile devices
6. **Active Timers Overview**: Shows summary of all running timers at top
