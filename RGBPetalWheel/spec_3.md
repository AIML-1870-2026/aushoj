# RGB Color Studio — spec.md

## Overview

An interactive single-page RGB Color Studio that teaches additive color mixing through two connected tools: an **Animated Spotlight Explorer** where overlapping colored lights blend in real time, and a **Palette Generator** that derives harmonious color schemes from whatever color you've mixed. The tool runs entirely in-browser with no dependencies beyond vanilla HTML/CSS/JS.

---

## Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header: "RGB Color Studio"  [dark mode toggle]         │
├───────────────────────────┬─────────────────────────────┤
│   SPOTLIGHT EXPLORER      │   PALETTE GENERATOR         │
│   (left panel ~55%)       │   (right panel ~45%)        │
│                           │                             │
│   canvas + sliders        │   harmony selector          │
│                           │   palette swatches          │
│                           │   hex codes + copy          │
└───────────────────────────┴─────────────────────────────┘
```

On mobile (<768 px) the two panels stack vertically.

---

## Feature List

### Spotlight Explorer
- Dark canvas (800×500) with three stick figures standing at the left, center-left, and right edges, each "owning" one primary color (Red, Green, Blue)
- Each stick figure is drawn in their color: circle head, line body, arms raised forward, legs in a stance
- Each figure shoots a visible **beam** (tapered cone / glowing ray) from their outstretched hands toward the center mixing zone
- Beams are drawn as radial-gradient filled triangular paths that converge toward the canvas center; blended with `globalCompositeOperation = 'screen'` so overlapping beams produce additive mixing (R+G=yellow, G+B=cyan, R+B=magenta, R+G+B=white)
- A glowing **mixing zone** circle at the canvas center pulses and shows the resulting blended color
- Three sliders (0–255) labeled R / G / B control each figure's beam intensity; at 0 the beam disappears and the stick figure dims/slouches; at 255 the beam is fully bright and the figure "leans in"
- Stick figures have a subtle idle bobbing animation (translate Y ±3 px, 1.5 s ease-in-out loop)
- When a slider changes, the corresponding figure's beam width/brightness updates smoothly (canvas redraws at 60 fps via `requestAnimationFrame`)
- Small label above each figure shows their color name and current value (e.g. "Red: 200")
- A **"Send to Palette"** button copies the current mixed color to the Palette Generator as the base color

### Palette Generator
- Base color input: color wheel picker + hex text field (synced with each other)
- "Use Explorer Color" button (populated by "Send to Palette" above)
- Harmony selector: **Complementary | Analogous | Triadic | Split-Complementary | Tetradic**
- Generated palette displayed as 4–6 swatches in a row, each showing:
  - Filled color block (80×80 px)
  - Hex code below
  - Click-to-copy icon (copies hex to clipboard, shows "Copied!" toast for 1.5 s)
- **Randomize** button picks a random hue and re-generates
- Palette swatches animate in one-by-one (staggered fade+slide-up, 80 ms offset each)
- A miniature color wheel SVG (200 px) draws marker dots showing where each palette color sits

### Accessibility Panel (stretch)
- Collapsible section below the palette
- **Contrast Checker**: pick any two palette swatches; display WCAG contrast ratio, AA/AAA pass/fail badges
- **Color Blindness Preview**: toggle Protanopia / Deuteranopia / Tritanopia using CSS filter + SVG matrix to simulate how the palette looks

---

## Interactions

| Action | Result |
|--------|--------|
| Adjust R/G/B slider | Corresponding beam brightens/dims; figure leans in or slouches; mixing zone color updates |
| Slider at 0 | Figure dims and slouches; beam disappears |
| Slider at 255 | Figure leans forward; beam is full brightness |
| Click "Send to Palette" | Palette base color set to mixed color; palette re-generates |
| Change harmony type | Palette re-generates with stagger animation |
| Click swatch | Hex copied to clipboard; toast notification |
| Click "Randomize" | New random hue; palette regenerates |
| Toggle dark mode | CSS custom properties swap light↔dark theme |

---

## Visual Style

- **Dark mode default**: background `#0d0d0d`, panels `#161616`, accent borders `#2a2a2a`
- **Light mode**: background `#f5f5f5`, panels `#ffffff`
- Font: system-ui stack (no external fonts needed)
- Spotlight canvas background: `#000` always (lights-on-dark effect)
- Swatches have `border-radius: 12px`, subtle `box-shadow`
- All interactive elements have visible `:focus-visible` outlines for keyboard accessibility

---

## Technical Notes

- **Single HTML file** (`index.html`) with embedded `<style>` and `<script>` — no build step
- Canvas rendering: draw each stick figure + beam on its own off-screen canvas layer, composite them onto the main canvas with `globalCompositeOperation = 'screen'`, then `requestAnimationFrame` for smooth 60 fps updates. Stick figures are drawn with Canvas 2D path API (arc for head, lineTo for body/limbs). Beam is a filled triangle path with a radial gradient applied via `createRadialGradient` from figure's hands to canvas center.
- Color math helpers:
  - `rgbToHsl(r, g, b)` / `hslToRgb(h, s, l)` for harmony calculations
  - `contrastRatio(c1, c2)` using WCAG relative luminance formula
  - `simulateColorBlindness(imageData, type)` using standard 3×3 matrices
- Harmony generation rotates hue by fixed offsets in HSL space, keeps saturation/lightness constant
- Color wheel SVG: static `<svg>` conic-gradient circle; marker dots positioned with trigonometry
- No external dependencies; optionally use `chroma.js` from CDN if color math gets complex

---

## File Structure

```
rgb-color-studio/
├── index.html   ← entire app (HTML + CSS + JS)
└── README.md    ← brief description + screenshot
```

---

## Success Criteria

1. Dragging any spotlight circle smoothly updates the blended color.
2. Mixing Red + Green spotlights at full intensity produces yellow (`#ffff00`) at the overlap center.
3. All five harmony types generate visually distinct, correct palettes.
4. Clicking a swatch copies its hex code and shows a toast.
5. The contrast checker correctly flags pairs that fail WCAG AA.
6. The page is usable with keyboard only (tab-navigable, visible focus rings).
