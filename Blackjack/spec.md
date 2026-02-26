# Blackjack Game — spec.md

## Overview

A single-player Blackjack game delivered as a **single `index.html` file** (with embedded CSS and JS). Classic Vegas casino aesthetic. Card images are rendered using SVG playing card assets loaded from a CDN or embedded inline. Targets desktop-first with reasonable mobile support.

---

## Visual Design

### Theme
- **Classic Vegas Casino**
- Green felt table texture as the main background (CSS radial/linear gradient simulating felt, or a subtle repeating SVG texture pattern)
- Deep green base: `#1a4a2e` with a darker vignette toward edges
- Gold accent color: `#c9a84c` for borders, headings, chip edges, button highlights
- Off-white/cream card faces: `#fdf6e3`
- Dark charcoal for UI panels/modals: `#1c1c1c` with slight transparency
- Red suits (♥ ♦): `#cc2222`; Black suits (♠ ♣): `#111111`

### Typography
- **Headers/Logo**: Serif font — `Georgia` or Google Font `Playfair Display`
- **UI Labels/Buttons**: Sans-serif — `'Segoe UI'` or `Inter`
- **Card values**: Bold, large, clear

### Card Images
- Use **SVG playing card images** from the open-source [vector-playing-cards](https://code.google.com/archive/p/vector-playing-cards/) set
- Host images via a public CDN or embed inline SVGs for the 52 cards + 1 card back
- Card back: dark blue/red ornate pattern SVG
- Card dimensions: approximately `90px × 126px` (standard 5:7 ratio), scaling gracefully

### Layout
```
┌─────────────────────────────────────────────┐
│              🃏  BLACKJACK  🃏               │  ← Title bar (gold text)
│         Balance: $1,000    Bet: $50          │  ← Status bar
├─────────────────────────────────────────────┤
│                                             │
│          DEALER  [score hidden]             │  ← Dealer area
│          [ 🂠 ] [ 🂡 ]                       │
│                                             │
│  ─────────────────────────────────────────  │  ← Felt divider line (gold)
│                                             │
│          PLAYER  [score: 17]                │  ← Player area
│          [ A♠ ] [ 6♥ ]                      │
│                                             │
├─────────────────────────────────────────────┤
│  Bet: [$10][$25][$50][$100]  [Clear] [Deal] │  ← Betting controls
│       [Hit]  [Stand]  [Double Down]         │  ← Action controls
├─────────────────────────────────────────────┤
│  📊 Stats: Wins: 5 | Losses: 3 | Win%: 63% │  ← Stats bar
│  🕐 History: +$50  -$25  +$100  -$50        │  ← Bet history strip
└─────────────────────────────────────────────┘
```

---

## Animations & Visual Effects

### Card Sliding Animation
- Cards are dealt with a **slide-in from the shoe** (top-right corner of table)
- Each card animates independently with a slight stagger (~100ms between cards)
- CSS `transform: translateX/translateY` + `transition: 0.35s ease-out`
- Cards land in their slot with a subtle bounce (`cubic-bezier`)

### Card Flip Animation
- Dealer's hole card starts face-down (card back image)
- On reveal, plays a **3D flip animation**: `rotateY(0deg)` → `rotateY(90deg)` (swap image mid-flip) → `rotateY(0deg)`
- Duration: ~400ms

### Particle Effects on Win
- On player win: **gold coin/star particles** burst from the card area
- Implemented in vanilla JS using a small canvas overlay or absolutely-positioned `<div>` particles
- ~30–50 particles, randomized velocity, fade out over ~1.2s
- On Blackjack win: larger burst with extra particles and a brief golden glow ring

### Button States
- Hover: gold border glow + slight scale up (`transform: scale(1.05)`)
- Active/pressed: slight scale down
- Disabled: desaturated, `opacity: 0.4`, `cursor: not-allowed`

### Chip Animations
- Clicking a chip denomination adds it to the bet with a brief "toss" animation toward the table center

---

## Game States

The game has **3 distinct phases** with strict button visibility/enabled rules:

### State 1: BETTING
- Visible & enabled: Chip buttons (`$10`, `$25`, `$50`, `$100`), `[Clear Bet]`, `[Deal]`
- Hidden/disabled: `[Hit]`, `[Stand]`, `[Double Down]`
- Current bet displayed prominently above the table
- `[Deal]` disabled if bet is $0

### State 2: PLAYING
- Visible & enabled: `[Hit]`, `[Stand]`
- `[Double Down]` enabled only if player has exactly 2 cards AND has sufficient balance
- Hidden/disabled: All chip buttons, `[Clear Bet]`, `[Deal]`
- Player score updates in real-time as cards are dealt
- Dealer shows one face-up card, one face-down card; dealer score hidden

### State 3: ROUND COMPLETE
- All action buttons hidden
- Outcome banner displayed: **WIN**, **LOSE**, **PUSH**, or **BLACKJACK!**
- Balance updated
- `[Next Round]` / `[New Deal]` button appears prominently
- Particle effects trigger on win
- Brief delay (1.5s) before enabling `[Next Round]` to let animations play

---

## Blackjack Rules

### Deck
- Standard 52-card deck (no Jokers)
- Shuffled using Fisher-Yates algorithm at game start and when deck runs low (< 15 cards remaining)

### Card Values
- Number cards (2–10): face value
- Face cards (J, Q, K): 10
- Ace: 11, reduced to 1 if hand total would exceed 21

### Deal
- Player receives 2 cards face-up
- Dealer receives 1 card face-up, 1 card face-down (hole card)

### Player Actions
- **Hit**: Draw one card. If bust (> 21), round ends immediately — player loses.
- **Stand**: End player turn; dealer plays.
- **Double Down**: Double the current bet, receive exactly one more card, then stand. Only available on the first two cards if balance ≥ current bet.

### Dealer Rules
- Dealer reveals hole card after player stands
- Dealer must **hit on 16 or below**, **stand on 17 or above** (including soft 17)

### Outcomes & Payouts
| Scenario | Result |
|---|---|
| Player Blackjack (A + 10-value), dealer does not | **Win 1.5×** bet (pay 3:2) |
| Both player and dealer Blackjack | **Push** — bet returned |
| Player Blackjack, dealer also has 21 (non-natural) | **Player wins 1.5×** |
| Player > Dealer (no bust) | **Win 1×** bet |
| Player < Dealer (no bust) | **Lose** bet |
| Player bust | **Lose** bet |
| Dealer bust, player did not | **Win 1×** bet |
| Tie (same score, no blackjack) | **Push** — bet returned |

### Starting Balance
- Player starts with **$1,000**
- Minimum bet: $10
- If balance drops to $0, show a "Game Over" modal with `[Restart]` option that resets to $1,000

---

## Keyboard Shortcuts

| Key | Action | Active In State |
|---|---|---|
| `H` | Hit | PLAYING |
| `S` | Stand | PLAYING |
| `D` | Deal / Next Round | BETTING, ROUND COMPLETE |
| `B` | Double Down | PLAYING (when available) |
| `C` | Clear Bet | BETTING |

- Show a small keyboard shortcut legend at the bottom of the UI (collapsible or always visible)

---

## Betting History & Statistics

### Stats (persistent within session, not localStorage)
- **Rounds Played**
- **Wins / Losses / Pushes**
- **Win Percentage** (wins / (wins + losses) × 100)
- **Biggest Single Win** (dollar amount)
- **Current Streak** (e.g., "+3" for 3 wins in a row, "-2" for 2 losses)

### Betting History Strip
- Horizontal scrolling strip showing last 10 round results
- Each entry: colored chip showing `+$X` (green) or `-$X` (red) or `PUSH` (gray)
- Most recent result appears on the right

### Stats Panel
- Displayed below the table in a compact row
- Always visible during gameplay

---

## Edge Cases to Handle

1. **Natural Blackjack detection**: Only on initial 2-card deal; not after hitting to 21
2. **Ace adjustment**: When adding a card causes bust, check if any Ace counted as 11 can be reduced to 1
3. **Dealer hole card reveal**: Animate flip before dealer draws additional cards
4. **Double Down bust**: Player receives one card, if bust → lose doubled bet
5. **Insufficient balance for bet**: Disable chip buttons that would exceed balance
6. **All-in scenario**: Allow player to bet their entire remaining balance
7. **Deck reshuffle**: Reshuffle mid-session if < 15 cards remain; show brief "Shuffling..." message
8. **Rapid clicking prevention**: Disable all buttons during animations to prevent double-actions

---

## File Structure

Single file: `index.html`

```
index.html
├── <head>
│   ├── Google Fonts (Playfair Display)
│   └── <style> — all CSS embedded
└── <body>
    ├── #game-container
    │   ├── #header (title + balance + bet display)
    │   ├── #dealer-area
    │   ├── #player-area
    │   ├── #controls (chip buttons + action buttons)
    │   └── #stats-bar
    ├── #outcome-overlay (win/lose banner)
    ├── #particle-canvas (overlay canvas for win particles)
    └── <script> — all JS embedded
        ├── Card & Deck logic
        ├── Game state machine
        ├── UI rendering functions
        ├── Animation controllers
        └── Stats tracker
```

---

## Testing Scenarios (Required)

| # | Scenario | Expected Result |
|---|---|---|
| 1 | Player dealt A + K (natural blackjack), dealer has 9+7 | Player wins 1.5× bet; "BLACKJACK!" banner shown |
| 2 | Player dealt A + Q, dealer dealt A + J (both blackjack) | Push; bet returned; "PUSH" banner shown |
| 3 | Player hits to exactly 21 (non-natural) | Not counted as blackjack; standard win rules apply |
| 4 | Player has two Aces — first Ace = 11, second reduces to 1 (total 12) | Score shows 12, no bust |
| 5 | Player busts at 22 | Round ends immediately; player loses bet |
| 6 | Dealer has 16, must hit — busts | Player wins 1× bet |
| 7 | Double Down: player doubles $50 bet, receives one card, busts | Player loses $100 |
| 8 | Double Down: player doubles, beats dealer | Player wins $100 (2× original $50) |
| 9 | Balance hits $0 | Game Over modal appears with Restart option |
| 10 | Deck runs below 15 cards | Deck reshuffled; "Shuffling..." message shown |

---

## Notes for Claude Code

- Deliver as a **single `index.html`** file — no external files except CDN fonts and card image assets
- Card SVG images: use `https://deckofcardsapi.com/static/img/` endpoints OR embed a self-contained SVG sprite — prefer a reliable CDN
- Do NOT use `localStorage` — all state lives in JS variables for the session
- Test that all 3 game states correctly enable/disable the right buttons
- Ensure `calculateScore()` correctly handles multiple Aces in a hand
- Use `Fisher-Yates` shuffle for the deck
- Particle effect should use a `<canvas>` element absolutely positioned over the table
