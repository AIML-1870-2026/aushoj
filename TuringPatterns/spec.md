# Turing Patterns Explorer - Technical Specification

## Project Overview

An interactive web-based simulation of Turing patterns using the Gray-Scott reaction-diffusion model. This application allows users to explore how simple chemical rules create complex patterns found throughout nature - from leopard spots to zebra stripes.

## Core Concept

The simulation models two chemical substances (often called "U" and "V" or "activator" and "inhibitor") that react and diffuse across a 2D grid. Through the interplay of just two parameters - **Feed rate (F)** and **Kill rate (K)** - the system generates diverse patterns including spots, stripes, labyrinths, and waves.

---

## Technical Requirements

### Technology Stack
- **HTML5** - Structure and Canvas element
- **CSS3** - Styling and layout
- **Vanilla JavaScript** - Simulation logic and rendering
- No external dependencies or frameworks required

### Simulation Engine

#### Gray-Scott Model Equations
The simulation implements the Gray-Scott reaction-diffusion equations:

```
dU/dt = D_u * ∇²U - UV² + F(1-U)
dV/dt = D_v * ∇²V + UV² - (F+K)V
```

Where:
- `U` = concentration of substance U (typically visualized)
- `V` = concentration of substance V
- `D_u` = diffusion rate of U (typically 0.16)
- `D_v` = diffusion rate of V (typically 0.08)
- `F` = feed rate (user-adjustable parameter)
- `K` = kill rate (user-adjustable parameter)
- `∇²` = Laplacian operator (approximated using discrete convolution)

#### Implementation Details
- **Grid size:** 256x256 cells (adjustable for performance)
- **Time step:** 1.0 (adjustable for stability)
- **Laplacian kernel:** 3x3 convolution with weights:
  ```
  [0.05, 0.2, 0.05]
  [0.2,  -1,  0.2]
  [0.05, 0.2, 0.05]
  ```
- **Boundary conditions:** Wrapped edges (toroidal topology)
- **Update method:** Euler integration or similar numerical method
- **Frame rate:** Target 30-60 FPS

---

## User Interface Design

### Layout Structure

```
┌─────────────────────────────────────────────────┐
│              Header / Title                      │
├──────────────────────┬──────────────────────────┤
│                      │                          │
│   Simulation Canvas  │    Control Panel         │
│     (main view)      │    - Presets             │
│                      │    - Parameters          │
│                      │    - Color Schemes       │
│                      │    - Tools               │
│                      │    - Info                │
└──────────────────────┴──────────────────────────┘
```

### Canvas (Main Simulation View)

**Specifications:**
- **Size:** 600x600 pixels (or responsive based on viewport)
- **Rendering:** HTML5 Canvas 2D context
- **Visual:** Display concentration of chemical V using color mapping
- **Interactivity:** 
  - Click and drag to disturb the chemical field
  - Draw with different brush sizes
  - Add chemical U or V at click locations

**Interaction Behaviors:**
- **Mouse down + drag:** Paint chemical concentration at cursor position
- **Brush size:** Adjustable radius (5-50 pixels)
- **Chemical type:** Toggle between adding U or V
- **Disturbance strength:** Full saturation (1.0) or adjustable

### Control Panel

#### 1. Pattern Presets Section

**Display:** Grid of labeled buttons or cards

**Presets to include:**
- **Spots** - F: 0.035, K: 0.060 (stable circular patterns)
- **Stripes** - F: 0.035, K: 0.065 (parallel lines)
- **Spirals** - F: 0.014, K: 0.054 (rotating spiral waves)
- **Maze** - F: 0.029, K: 0.057 (labyrinthine patterns)
- **Waves** - F: 0.014, K: 0.045 (dynamic wave fronts)
- **Chaos** - F: 0.026, K: 0.051 (turbulent patterns)

**Behavior:** Clicking preset smoothly transitions F and K to new values

#### 2. Parameter Controls

**Feed Rate (F):**
- Type: Range slider
- Range: 0.000 - 0.100
- Step: 0.001
- Display: Show current value to 3 decimal places
- Label: "Feed Rate (F)"

**Kill Rate (K):**
- Type: Range slider  
- Range: 0.000 - 0.100
- Step: 0.001
- Display: Show current value to 3 decimal places
- Label: "Kill Rate (K)"

**Diffusion Rates (Advanced - optional):**
- D_u slider: 0.01 - 0.30
- D_v slider: 0.01 - 0.30

#### 3. Color Schemes

**Selector:** Dropdown or button group

**Color schemes to implement:**

1. **Grayscale**
   - Low concentration (0.0): Black #000000
   - High concentration (1.0): White #FFFFFF

2. **Heat Map**
   - 0.0: Dark blue #000033
   - 0.25: Blue #0000FF
   - 0.5: Green #00FF00
   - 0.75: Yellow #FFFF00
   - 1.0: Red #FF0000

3. **Ocean**
   - 0.0: Deep blue #001f3f
   - 0.5: Cyan #39CCCC
   - 1.0: White #FFFFFF

4. **Magma**
   - 0.0: Black #000000
   - 0.33: Purple #4B0082
   - 0.66: Orange #FF6347
   - 1.0: Yellow #FFFF00

5. **Mint** (custom)
   - 0.0: Dark green #0D4D4D
   - 0.5: Mint #7FFF7F
   - 1.0: Pale yellow #FFFFCC

**Implementation:** Use linear interpolation between color stops based on V concentration

#### 4. Simulation Controls

**Buttons:**
- **Play/Pause** - Toggle simulation running
- **Reset** - Reinitialize grid with random seed
- **Clear** - Set all cells to zero
- **Randomize** - Generate new random initial conditions

**Speed Control:**
- Slider for simulation speed (0.5x - 4x)
- Affects time step multiplier

**Brush Tools:**
- Brush size slider (5-50 pixels)
- Chemical selector (Add U / Add V)
- Brush strength slider (0.0 - 1.0)

#### 5. Save/Export

**Features:**
- **Save Image** button: Download current canvas as PNG
- **Share Parameters** button: Copy F/K values to clipboard
- Filename format: `turing-pattern-F{value}-K{value}-{timestamp}.png`

#### 6. Parameter Space Map (Stretch Feature)

**Visual:** Small diagram showing F/K parameter space

**Appearance:**
- 200x200 pixel grid
- X-axis: Feed rate (F) from 0.00 to 0.10
- Y-axis: Kill rate (K) from 0.00 to 0.10
- Background: Gradient or small preview of patterns at each region
- Current position marker: Highlighted dot

**Interaction:**
- Click anywhere on map to jump to those F/K values
- Animated transition to new parameters

**Pattern regions to indicate:**
- Spots region (around F=0.035, K=0.060)
- Stripes region (F=0.035, K=0.065)
- Spiral region (F=0.014, K=0.054)
- Maze region (F=0.029, K=0.057)

---

## Visual Design

### Color Palette

**UI Colors:**
- Background: #1a1a1a (dark) or #f5f5f5 (light)
- Panel background: #2a2a2a (dark) or #ffffff (light)
- Text: #e0e0e0 (dark mode) or #333333 (light mode)
- Accent: #3b82f6 (blue)
- Button hover: #2563eb

### Typography
- **Headings:** Sans-serif, bold, 18-24px
- **Body text:** Sans-serif, 14-16px
- **Labels:** Sans-serif, 12-14px
- **Monospace:** For parameter values, code snippets

### Spacing
- Panel padding: 20px
- Button margin: 10px
- Section spacing: 30px
- Control spacing: 15px

---

## Information Panel

### Educational Content

**Section: "What are Turing Patterns?"**
> Brief explanation of reaction-diffusion systems and Alan Turing's 1952 discovery. How two chemicals with simple rules create complex patterns found in nature.

**Section: "How it Works"**
> Simple explanation of the Gray-Scott model, what F and K represent, and how different values create different patterns.

**Section: "Pattern Guide"**
> Visual reference showing what patterns emerge from different parameter combinations:
> - Low K values → Spots and isolated features
> - Medium K values → Stripes and maze-like patterns  
> - High K values → Waves and spiral dynamics
> - F controls scale and growth rate

**Toggle:** Collapsible info panel to maximize canvas space

---

## Initialization

### Default State
- **Grid:** 256x256 cells
- **F:** 0.035 (spots pattern)
- **K:** 0.060 (spots pattern)
- **D_u:** 0.16
- **D_v:** 0.08
- **Color scheme:** Heat map
- **Initial condition:** Random noise with some seed structures

### Seed Generation
- Fill U grid with 1.0 (full concentration)
- Fill V grid with 0.0 (empty)
- Add random patches where V = 1.0 (10-20 random circles)
- Or: Perlin noise initialization for smoother starts

---

## Performance Considerations

### Optimization Strategies
1. **Use typed arrays:** Float32Array for chemical concentrations
2. **Double buffering:** Swap read/write buffers each frame
3. **Efficient rendering:** Only update canvas when changed
4. **Worker threads (optional):** Offload simulation to Web Worker
5. **Adaptive quality:** Reduce grid resolution on slower devices
6. **Frame skip:** If FPS drops, calculate multiple updates per render

### Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use requestAnimationFrame for smooth animation
- Graceful degradation for older browsers

---

## Stretch Features (Optional Enhancements)

### Advanced Features

1. **Multi-Simulation Comparison**
   - Side-by-side view of two simulations
   - Compare different parameter sets simultaneously
   - Synchronized interaction

2. **Parameter Animation**
   - Animate F and K along a path through parameter space
   - Create morphing patterns
   - Record animation as GIF or video

3. **Multiple Chemical Models**
   - Implement alternative reaction-diffusion systems
   - Brusselator model
   - Schnakenberg model
   - FitzHugh-Nagumo model
   - Model selector in UI

4. **Advanced Brush Tools**
   - Shape stamps (circles, squares, lines)
   - Symmetry modes (radial, bilateral)
   - Gradient brush
   - Eraser tool

5. **Pattern Library**
   - Save favorite parameter combinations
   - Gallery view of saved patterns
   - Export/import parameter presets as JSON
   - Community sharing (with backend)

6. **High-Resolution Export**
   - Render at higher resolution for printing
   - Export as SVG (vector graphics)
   - Custom size export dialog

7. **3D Visualization**
   - Height map representation of concentration
   - WebGL rendering
   - Rotating 3D view

8. **Sound Synthesis**
   - Map pattern activity to audio parameters
   - Sonification of chemical concentrations
   - Generative audio from pattern evolution

---

## File Structure

```
turing-explorer/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── script.js           # Main application logic
├── simulation.js       # Gray-Scott model implementation
├── renderer.js         # Canvas rendering and color mapping
├── ui.js              # UI controls and event handlers
└── README.md          # Documentation and usage guide
```

**Alternative (single-file):**
- `index.html` - Self-contained application with embedded CSS and JS

---

## Testing Checklist

### Functionality
- [ ] Simulation runs at stable frame rate
- [ ] Pattern presets load correctly
- [ ] Parameter sliders update simulation in real-time
- [ ] Mouse interaction draws on canvas
- [ ] Color schemes apply correctly
- [ ] Play/pause controls work
- [ ] Reset generates new patterns
- [ ] Save image downloads PNG file

### Visual Quality
- [ ] Patterns match expected morphology
- [ ] Colors render smoothly without banding
- [ ] UI is readable and well-organized
- [ ] Responsive layout works on different screen sizes

### Performance
- [ ] Maintains 30+ FPS on target hardware
- [ ] No memory leaks during extended use
- [ ] Quick parameter transitions

### User Experience
- [ ] Controls are intuitive
- [ ] Feedback is immediate
- [ ] Information is helpful
- [ ] No unexpected behavior

---

## Deployment

### GitHub Pages
1. Create repository: `turing-patterns-explorer`
2. Push all files to main branch
3. Enable GitHub Pages in repository settings
4. Site will be live at: `username.github.io/turing-patterns-explorer`

### Alternative Hosting
- Netlify (drag-and-drop deployment)
- Vercel (automatic deployment from GitHub)
- CodePen/JSFiddle (for quick demos)

---

## References and Resources

### Scientific Background
- Turing, A. M. (1952). "The Chemical Basis of Morphogenesis"
- Gray-Scott model documentation
- Reaction-diffusion pattern formation theory

### Implementation Guides
- Canvas 2D rendering documentation
- Numerical methods for PDEs
- WebGL for high-performance graphics

### Inspiration
- Karl Sims' reaction-diffusion explorer
- Processing sketches by Daniel Shiffman
- Jonathan McCabe's multi-scale Turing patterns

---

## Success Criteria

A successful Turing Patterns Explorer will:

1. ✅ Accurately simulate the Gray-Scott reaction-diffusion model
2. ✅ Generate recognizable patterns (spots, stripes, mazes, spirals)
3. ✅ Provide intuitive controls for exploring parameter space
4. ✅ Run smoothly at interactive frame rates
5. ✅ Allow users to disturb and interact with the simulation
6. ✅ Include multiple color schemes for visualization
7. ✅ Save generated patterns as images
8. ✅ Educate users about Turing patterns and emergent complexity

---

## Future Enhancements

- Mobile touch controls
- Undo/redo system
- Time-lapse recording
- Pattern analysis (symmetry detection, fractal dimension)
- Social sharing integration
- Tutorial/guided tour mode
- Accessibility features (keyboard controls, screen reader support)
- Dark/light theme toggle

---

**Document Version:** 1.0  
**Last Updated:** 2025-02-05  
**Author:** Joshua Mammen
**Project Type:** Educational Interactive Simulation  

