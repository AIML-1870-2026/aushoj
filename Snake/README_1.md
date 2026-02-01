# 🐍 NEON SERPENT - A Snake Odyssey

A cyberpunk-themed enhanced version of the classic Snake game, featuring neon aesthetics, power-ups, progressive difficulty, and polished visual effects.

![Neon Serpent Game](https://img.shields.io/badge/Game-Neon%20Serpent-ff006e?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 🎮 Play Now

**[Live Demo](https://your-username.github.io/neon-serpent/)** ← Click to play!

## ✨ Features

### Core Gameplay
- Classic snake mechanics with modern enhancements
- Progressive difficulty - speed increases as you score
- Wrap-around edges instead of wall death
- Strategic obstacle placement

### Power-Up System
- ⚡ **Speed Boost** - Increase your speed temporarily
- 🐌 **Slow-Mo** - Slow down time for precise control
- 🛡️ **Invincible** - Pass through obstacles and yourself
- 📏 **Shrink** - Reduce snake length for tight escapes

### Visual Polish
- Neon cyberpunk aesthetic with glowing effects
- Particle explosions when eating food
- Smooth gradient animations
- Retro CRT scanline effect
- Responsive design for all screen sizes

### Audio
- Procedural sound effects using Web Audio API
- Satisfying eating sounds
- Power-up collection melodies
- Game over sound effects

### QoL Features
- Persistent high score (localStorage)
- Pause functionality
- Mobile touch controls with swipe gestures
- Keyboard shortcuts for all actions

## 🎯 Controls

### Desktop
- **Arrow Keys** or **WASD** - Move snake
- **Spacebar** - Pause/Resume
- **R** - Restart game

### Mobile
- **Swipe** in any direction to move snake
- Tap to start/restart

## 🚀 Local Development

### Prerequisites
None! Just a modern web browser.

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/your-username/neon-serpent.git
cd neon-serpent
```

2. Open `index.html` in your browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or simply drag and drop `index.html` into your browser.

## 📦 Deployment to GitHub Pages

### Option 1: GitHub Web Interface

1. Create a new repository on GitHub
2. Upload `index.html` to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch"
5. Choose `main` branch and `/` (root) folder
6. Click Save
7. Your game will be live at `https://your-username.github.io/repository-name/`

### Option 2: Command Line

```bash
# Initialize git repository
git init

# Add files
git add index.html README.md spec.md

# Commit
git commit -m "Initial commit: Neon Serpent game"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/your-username/neon-serpent.git

# Push to GitHub
git branch -M main
git push -u origin main

# Enable GitHub Pages
# Go to repository Settings → Pages
# Select main branch, root folder, and save
```

### Option 3: Using Claude Code

Ask Claude Code:
```
Deploy this Snake game to GitHub Pages. Create a new repository called 
"neon-serpent" and enable GitHub Pages.
```

## 📁 Project Structure

```
neon-serpent/
├── index.html          # Complete game (HTML + CSS + JS in one file)
├── spec.md            # Game design specification
└── README.md          # This file
```

## 🎨 Design Philosophy

**Emergent Complexity from Simple Rules**

This game demonstrates how complex, engaging gameplay emerges from just a few simple mechanics:
- Eat food → Grow longer
- Don't hit yourself
- Avoid obstacles

The challenge naturally escalates as success makes the game harder. Each piece of food makes navigation more difficult, creating an elegant difficulty curve without artificial gating.

**Distinctive Visual Identity**

Avoided generic "AI slop" aesthetics by committing to a bold neon cyberpunk theme:
- Custom font pairing (Orbitron + Share Tech Mono)
- Cohesive neon color palette
- Retro CRT scanline effects
- Smooth gradient animations
- Particle effects and visual juice

## 🔧 Technical Details

- **Pure Vanilla JavaScript** - No frameworks or libraries
- **HTML5 Canvas** - Smooth rendering with 60 FPS target
- **Web Audio API** - Procedural sound generation
- **CSS Grid & Flexbox** - Responsive layout
- **LocalStorage API** - High score persistence
- **Touch Events** - Mobile gesture support

## 🏆 High Score System

Your high score is automatically saved to your browser's localStorage. Scores persist between sessions on the same device/browser.

To reset your high score, open browser console and run:
```javascript
localStorage.removeItem('snakeHighScore');
```

## 📝 Assignment Compliance

This project fulfills all requirements from the Snake Quest assignment:

✅ Enhanced Snake game with unique features  
✅ Created with AI collaboration  
✅ Design specification documented (spec.md)  
✅ Single HTML file for easy deployment  
✅ Responsive design with mobile support  
✅ Deployed to GitHub Pages  
✅ Demonstrates emergent behavior principles  

### Enhancements Implemented
- Dynamic difficulty progression
- Power-up system with 4 types
- Particle effects and animations
- Sound effects
- Pause functionality
- Mobile touch controls
- Persistent high scores
- Obstacle system
- Two food types with different point values
- Custom theme and visual polish

## 🎓 What I Learned

- How simple rules create complex, emergent gameplay
- Effective collaboration with AI for creative coding
- Importance of clear specifications before coding
- Web Audio API for procedural sound design
- Canvas rendering optimization techniques
- Touch event handling for mobile support

## 🚀 Future Enhancements

Potential additions for continued development:
- [ ] Multiplayer mode (local two-player)
- [ ] AI opponent snake
- [ ] Procedural level generation
- [ ] Achievement system
- [ ] More power-up types
- [ ] Customizable themes/skins
- [ ] Level progression system
- [ ] Leaderboard with name entry

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Created as part of the Code Quest assignment
- Inspired by the classic Snake game (1976 - present)
- Developed with assistance from Claude AI
- Fonts: Orbitron and Share Tech Mono from Google Fonts

---

**Enjoy the game! May your snake grow long and your reflexes stay sharp!** 🐍✨
