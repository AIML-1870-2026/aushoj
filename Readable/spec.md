# Readable Explorer – Project Specification

## Overview

A single-page web app called **Readable** that lets users explore how background color, text color, and text size affect readability. It calculates and displays WCAG contrast ratios in real time.

---

## Tech Stack

- Plain HTML, CSS, JavaScript (no frameworks or libraries)
- Single `index.html` file (or split into `index.html`, `style.css`, `script.js`)
- No build tools required – must run by opening `index.html` in a browser

---

## Layout

The page should have two main columns (or stacked sections on mobile):

1. **Controls Panel** – all sliders and inputs
2. **Preview Panel** – text display area + contrast info

---

## Required Features

### 1. Background Color Controls

- Three labeled sliders (R, G, B), each ranging from 0 to 255
- Each slider is synchronized with a number input field (integer only, 0–255)
- Moving the slider updates the input; changing the input updates the slider
- Label: "Background Color"

### 2. Text Color Controls

- Three labeled sliders (R, G, B), each ranging from 0 to 255
- Each slider is synchronized with a number input field (integer only, 0–255)
- Moving the slider updates the input; changing the input updates the slider
- Label: "Text Color"

### 3. Text Size Control

- A single slider ranging from 10 to 72 (px)
- Synchronized with a number input field (integer only)
- Label: "Font Size (px)"

### 4. Text Display Area

- A rectangular region that renders sample text (e.g., "The quick brown fox jumps over the lazy dog")
- Background color, text color, and font size update in real time as controls change
- The sample text should be long enough to demonstrate readability clearly

### 5. Contrast Ratio Display

- Shows the WCAG contrast ratio between the selected background and text colors
- Formatted as `X.XX:1`
- Recalculates automatically on any color change

### 6. Luminosity Displays

- Two text labels showing:
  - Background luminosity (e.g., "Background Luminosity: 0.216")
  - Text luminosity (e.g., "Text Luminosity: 0.733")
- These help the user understand how the contrast ratio is derived

---

## Synchronization Behavior

- Slider → input: when slider moves, corresponding number field updates immediately
- Input → slider: when number field changes, corresponding slider updates immediately
- All color/size changes are reflected in the text display area in real time
- Contrast ratio and luminosity recalculate automatically on every change

---

## Contrast Ratio Calculation (WCAG)

### Step 1: Convert each RGB channel to linear light

```
if (channel / 255 <= 0.04045) {
  linear = (channel / 255) / 12.92;
} else {
  linear = Math.pow(((channel / 255) + 0.055) / 1.055, 2.4);
}
```

### Step 2: Compute relative luminance

```
L = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear
```

### Step 3: Compute contrast ratio

```
ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

Where `L_lighter` is the larger luminance value and `L_darker` is the smaller.

### Step 4: Display

Format as `X.XX:1` (two decimal places).

---

## Stretch Challenge A: Vision Type Simulation

Add a section labeled **"Vision Simulation"** with radio buttons for:

- Normal vision (default)
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Monochromacy (complete color blindness)

### Behavior

- When a non-Normal option is selected, the text display area shows a **simulated version** of the colors as perceived by someone with that vision type
- The actual RGB sliders/inputs remain at their original values and are **disabled** (grayed out) when a simulation is active — only re-enable when "Normal vision" is selected
- The contrast ratio and luminosity displays update to reflect the simulated colors

### Color Transformation Matrices

Use the following Daltonization matrices to transform RGB:

**Protanopia:**
```
R' = 0.567R + 0.433G + 0.000B
G' = 0.558R + 0.442G + 0.000B
B' = 0.000R + 0.242G + 0.758B
```

**Deuteranopia:**
```
R' = 0.625R + 0.375G + 0.000B
G' = 0.700R + 0.300G + 0.000B
B' = 0.000R + 0.300G + 0.700B
```

**Tritanopia:**
```
R' = 0.950R + 0.050G + 0.000B
G' = 0.000R + 0.433G + 0.567B
B' = 0.000R + 0.475G + 0.525B
```

**Monochromacy:**
```
R' = G' = B' = 0.299R + 0.587G + 0.114B
```

Clamp all output values to 0–255.

---

## Stretch Challenge B: WCAG Compliance Indicator

Display a **compliance badge/panel** next to the contrast ratio showing:

| Text Type | Threshold | Status |
|-----------|-----------|--------|
| Normal text (< 24px) | 4.5:1 | ✅ Pass / ❌ Fail |
| Large text (≥ 24px) | 3:1 | ✅ Pass / ❌ Fail |

- Use **green** background for Pass, **red** background for Fail
- Include text labels ("Pass" / "Fail") alongside the color — don't rely on color alone
- Updates in real time with color/size changes

---

## Stretch Challenge C: Preset Color Schemes

Add a **"Presets"** dropdown or button group with the following options:

| Preset Name | Background | Text |
|-------------|------------|------|
| High Contrast (Black/White) | rgb(255,255,255) | rgb(0,0,0) |
| Low Contrast (Gray) | rgb(180,180,180) | rgb(150,150,150) |
| Classic Blue/White | rgb(0,70,127) | rgb(255,255,255) |
| Fail Example | rgb(255,255,0) | rgb(255,255,255) |
| Dark Mode | rgb(30,30,30) | rgb(220,220,220) |

Selecting a preset instantly updates all RGB sliders/inputs and the preview.

---

## Visual Design Guidelines

- Clean, modern aesthetic — light background for the page itself
- Clear section labels for Controls and Preview
- Sliders should be wide enough to be easy to drag
- Color swatches (small colored squares) next to the Background and Text color labels showing the current selected color
- Responsive layout: stacks vertically on small screens
- Font: system-ui or similar readable sans-serif

---

## File Structure

```
readable/
├── index.html
├── style.css
└── script.js
```

---

## Submission

Deploy to GitHub Pages at:
`https://[your-username].github.io/readable/`
