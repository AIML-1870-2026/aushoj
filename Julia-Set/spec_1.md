# Julia Set Explorer - Specification

## Overview
A web-based interactive Julia Set fractal explorer that prioritizes visual quality and smooth performance. The application allows users to explore various Julia sets through intuitive interactions including click-to-zoom, panning, and parameter adjustments. Additionally, the application includes support for the related Burning Ship fractal as an alternative visualization mode.

## Core Features

### 1. Fractal Rendering
- **Canvas-based rendering** using HTML5 Canvas for optimal performance
- **High-quality visualization** with smooth color gradients
- **Configurable iteration depth** (default: 256, range: 50-1000)
- **Anti-aliasing considerations** for smoother edges at high zoom levels
- **Responsive canvas** that adapts to window size

### 2. Interactive Controls

#### Navigation
- **Click-to-zoom**: Click anywhere on the fractal to zoom in centered on that point
  - Single click: 2x zoom in
  - Shift+click: 2x zoom out
- **Pan/Drag**: Click and drag to move around the complex plane
  - Smooth dragging with visual feedback
  - Cursor changes to indicate drag mode
- **Zoom controls**: 
  - Zoom in/out buttons
  - Reset view button to return to default view
  - Display current zoom level

#### Parameter Controls
- **Julia Set constant (c)**: Two sliders for real and imaginary components
  - Real component range: -2.0 to 2.0
  - Imaginary component range: -2.0 to 2.0
  - Display current values with 3 decimal precision
  - Live update as sliders move (with performance throttling)

#### Visual Customization
- **Color scheme selector**: Dropdown or button group with multiple palettes
  - Classic (blues/purples)
  - Fire (reds/oranges/yellows)
  - Ocean (blues/greens/teals)
  - Grayscale
  - Rainbow spectrum
  - Monochrome (customizable accent color)
- **Iteration depth slider**: Control maximum iterations (50-1000)
  - Higher values = more detail but slower rendering
  - Display current value
  - Visual indicator of performance impact

### 3. Preset Gallery
- **Curated collection** of interesting fractals with thumbnails
- **Mode-specific presets**: Different presets for Julia Set vs Burning Ship mode
- **Quick selection**: Click preset to instantly load that fractal
- **Preset information**: Display name and c-value for each preset

**Julia Set presets:**
  - "Dendrite" (c = 0.0 + 1.0i)
  - "Spiral" (c = -0.7 + 0.27i)
  - "Dragon" (c = -0.8 + 0.156i)
  - "Double Spiral" (c = -0.4 + 0.6i)
  - "Siegel Disk" (c = -0.391 - 0.587i)
  - "Rabbit" (c = -0.123 + 0.745i)
  - "San Marco" (c = -0.75 + 0.0i)
  - "Snowflake" (c = 0.285 + 0.01i)

**Burning Ship presets:**
  - "Classic Ship" (c = -1.75 + 0.0i)
  - "Wings" (c = -1.62 + 0.0i)
  - "Tail Feathers" (c = -1.76 + 0.08i)
  - "Ghostly Ship" (c = -1.7 + 0.05i)

## User Interface Layout

### Main Layout Structure
```
┌─────────────────────────────────────────────────┐
│                   Header Bar                    │
│  [Julia Set Explorer]              [Help Icon]  │
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│              Main Canvas Area                   │
│          (Full-width, responsive)               │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│              Control Panel                      │
│  ┌────────────┬────────────┬──────────────┐    │
│  │  Presets   │ Parameters │ Appearance   │    │
│  └────────────┴────────────┴──────────────┘    │
│  [Tabbed or accordion interface]                │
└─────────────────────────────────────────────────┘
```

### Control Panel Sections

#### Presets Tab/Section
- Grid layout of preset thumbnails (4 columns on desktop, 2 on mobile)
- Presets automatically update based on selected fractal type (Julia Set vs Burning Ship)
- Each preset card shows:
  - Small preview image
  - Preset name
  - c-value (small text)
  - Hover effect for selection

#### Parameters Tab/Section
- **Julia Constant (c)**:
  - Label: "Real part (c_r)"
  - Slider with value display
  - Label: "Imaginary part (c_i)"
  - Slider with value display
- **Iteration Depth**:
  - Label with current value
  - Slider (50-1000)
  - Performance hint (e.g., "Higher = slower")

#### Appearance Tab/Section
- **Fractal Type**:
  - Toggle/selector between "Julia Set" and "Burning Ship"
  - Visual indicator of current mode
  - Smooth transition when switching types
- **Color Scheme**:
  - Visual palette selector (colored buttons/swatches)
  - Currently selected scheme highlighted
- **Zoom Controls**:
  - Zoom In button
  - Zoom Out button
  - Reset View button
  - Current zoom level display (e.g., "Zoom: 4.2x")

## Technical Requirements

### Performance
1. **Rendering optimization**:
   - Use Web Workers for fractal computation (offload from main thread)
   - Implement progressive rendering (low-res preview → high-res final)
   - Debounce parameter changes to avoid excessive re-renders
   - Consider GPU acceleration via WebGL for very high performance (optional enhancement)

2. **Smooth interactions**:
   - Target 60 FPS for animations
   - Use requestAnimationFrame for smooth updates
   - Implement efficient drag handling with transform caching

### Visual Quality
1. **Color rendering**:
   - Smooth color interpolation between gradient stops
   - Support for multiple color palettes with HSV/HSL blending
   - Optional: Add escape-time smoothing for ultra-smooth gradients

2. **Canvas quality**:
   - Use high-DPI canvas on retina displays (scale by devicePixelRatio)
   - Implement proper aspect ratio handling

### Responsive Design
- Mobile-friendly touch interactions
- Adaptive layout for different screen sizes
- Minimum canvas size: 300px × 300px
- Maximum canvas size: Limited by browser/performance

## Algorithm Details

### Julia Set Calculation
For each pixel at position (x, y):
1. Map pixel coordinates to complex plane coordinates (z₀)
2. Apply the iteration: z_{n+1} = z_n² + c
3. Count iterations until |z| > 2 (escape radius) or max iterations reached
4. Map iteration count to color using selected palette

### Burning Ship Fractal Calculation
The Burning Ship fractal uses a modified iteration formula with absolute values:
1. Map pixel coordinates to complex plane coordinates (z₀)
2. Apply the iteration: z_{n+1} = (|Re(z_n)| + i|Im(z_n)|)² + c
   - Take absolute value of both real and imaginary components before squaring
3. Count iterations until |z| > 2 (escape radius) or max iterations reached
4. Map iteration count to color using selected palette

**Key differences from Julia Set:**
- The absolute value operation creates distinctive "ship-like" shapes
- Default viewing area is typically different (Real: [-2.5, 1.5], Imaginary: [-2, 1])
- The fractal is not symmetric like traditional Julia sets
- Often reveals intricate filaments and tendrils

### Burning Ship Presets
When in Burning Ship mode, offer these interesting c-values:
- "Classic Ship" (c = -1.75 + 0.0i)
- "Wings" (c = -1.62 + 0.0i)
- "Tail Feathers" (c = -1.76 + 0.08i)
- "Ghostly Ship" (c = -1.7 + 0.05i)

### Default View Parameters
**Julia Set mode:**
- Initial viewport: Real: [-2, 2], Imaginary: [-2, 2]
- Initial c-value: -0.7 + 0.27i (Spiral fractal)
- Initial iterations: 256
- Initial color scheme: Classic

**Burning Ship mode:**
- Initial viewport: Real: [-2.5, 1.5], Imaginary: [-2, 1]
- Initial c-value: -1.75 + 0.0i (Classic Ship)
- Initial iterations: 256
- Initial color scheme: Fire (recommended for this fractal type)

## Technology Stack
- **HTML5** for structure
- **CSS3** for styling (Flexbox/Grid for layout)
- **Vanilla JavaScript** or modern framework (React preferred for state management)
- **Canvas API** for rendering
- **Web Workers** for computation (optional but recommended)

## Stretch Feature: Burning Ship Fractal

### Overview
The Burning Ship fractal is a fascinating variation of the Julia set that uses absolute values in its iteration formula. This creates distinctive asymmetric patterns that often resemble ships with elaborate sails and rigging, hence the name.

### What Makes It Special
- **Asymmetric beauty**: Unlike Julia sets, the Burning Ship is not symmetric, creating unique organic shapes
- **Fine structures**: Produces incredibly detailed filaments and tendrils at high zoom levels
- **Different character**: While Julia sets can be elegant and symmetric, Burning Ship fractals are often dramatic and angular
- **Historical significance**: Discovered by Michael Michelitsch and Otto E. Rössler in 1992

### Mathematical Difference
The key modification is applying absolute value to both components before squaring:
- **Julia Set**: z_{n+1} = z_n² + c
- **Burning Ship**: z_{n+1} = (|Re(z_n)| + i|Im(z_n)|)² + c

This seemingly simple change produces radically different structures.

### Implementation Strategy
The Burning Ship fractal shares most of the infrastructure with the Julia Set implementation:
- Same canvas rendering system
- Same zoom/pan controls
- Same color mapping
- Same Web Worker optimization (if implemented)

Only the iteration formula and default viewing parameters differ, making it an ideal stretch feature that adds significant visual variety without major architectural changes.

---

## User Experience Enhancements
1. **Loading indicators**: Show spinner or progress during rendering
2. **Keyboard shortcuts**:
   - Space: Reset view
   - +/-: Zoom in/out
   - Arrow keys: Pan
3. **Tooltips**: Contextual help for controls
4. **URL state**: Save current view parameters in URL for sharing (optional)
5. **Animations**: Smooth transitions when switching presets

## Performance Targets
- Initial render: < 500ms on modern hardware
- Re-render on parameter change: < 200ms at default resolution
- Smooth dragging: maintain 30+ FPS
- Support canvas up to 2000x2000 pixels

## Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Minimum: ES6+ support, Canvas API, Web Workers

## Future Enhancements (Out of Scope for v1)
- Mandelbrot set explorer mode
- Animation of parameter changes
- Image export functionality (high-resolution)
- Custom color palette creation
- Julia set location indicator on Mandelbrot set
- Fractal zoom animations/videos
- Educational mode with iteration path visualizer
- Additional fractal types (Tricorn, Multibrot, etc.)

---

## Implementation Notes for Claude Code

### File Structure Suggestion
```
julia-explorer/
├── index.html           # Main HTML structure
├── styles.css           # All styling
├── app.js              # Main application logic
├── fractal-worker.js   # Web Worker for computation (optional)
└── README.md           # Usage instructions
```

### Key Implementation Priorities
1. Get basic Julia Set rendering working first (single-threaded is fine initially)
2. Implement zoom and pan interactions
3. Add parameter controls
4. Integrate preset gallery
5. Implement Burning Ship fractal mode with mode switcher
6. Optimize with Web Workers if performance issues arise
7. Polish visual appearance and add color schemes

### Burning Ship Implementation Notes
- **Shared rendering pipeline**: Use the same canvas/worker infrastructure for both fractal types
- **Mode flag**: Pass fractal type ("julia" or "burningship") to rendering function
- **Algorithm switch**: In the iteration loop, apply absolute value before squaring when in Burning Ship mode
- **Viewport management**: Remember separate viewport states for each mode (users may want different zoom levels)
- **Preset switching**: When toggling fractal type, load the default preset for that mode
- **Visual feedback**: Consider a subtle visual indicator showing current fractal type

### Code Example for Burning Ship Iteration
```javascript
// Julia Set iteration
zReal = zReal * zReal - zImag * zImag + cReal;
zImag = 2 * zRealTemp * zImag + cImag;

// Burning Ship iteration (with absolute values)
const absReal = Math.abs(zReal);
const absImag = Math.abs(zImag);
zReal = absReal * absReal - absImag * absImag + cReal;
zImag = 2 * absReal * absImag + cImag;
```

### Testing Checklist
- [ ] Fractal renders correctly at default parameters (Julia Set)
- [ ] Burning Ship fractal renders with correct absolute value algorithm
- [ ] Click-to-zoom works and centers properly on both fractal types
- [ ] Pan/drag updates view smoothly
- [ ] Parameter sliders update fractal in real-time
- [ ] Presets load correct fractals and switch based on mode
- [ ] Fractal type toggle smoothly switches between Julia Set and Burning Ship
- [ ] Viewport and parameters are preserved when switching modes
- [ ] Color schemes apply correctly to both fractal types
- [ ] UI is responsive on mobile devices
- [ ] Performance is acceptable on target hardware for both modes
