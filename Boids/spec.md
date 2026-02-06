# Boids Interactive Mini-Lab Specification

## Project Overview
An educational, interactive simulation of Craig Reynolds' Boids flocking algorithm with comprehensive controls, real-time instrumentation, and behavioral presets. The goal is to create an insight-friendly tool for exploring emergent flocking behavior.

---

## Core Requirements

### 1. Simulation Engine

#### Boid Properties
- **Position**: (x, y) coordinates
- **Velocity**: (vx, vy) vector
- **Maximum Speed**: Configurable cap on velocity magnitude
- **Maximum Force**: Configurable cap on steering force

#### Three Fundamental Behaviors
1. **Separation**: Steer away from nearby neighbors
   - Weight: 0.0 - 3.0 (default: 1.5)
   - Calculation: Average repulsion vector from neighbors within personal space

2. **Alignment**: Match velocity with nearby neighbors
   - Weight: 0.0 - 3.0 (default: 1.0)
   - Calculation: Average velocity of neighbors, steer toward it

3. **Cohesion**: Steer toward the average position of neighbors
   - Weight: 0.0 - 3.0 (default: 1.0)
   - Calculation: Center of mass of neighbors, steer toward it

#### Additional Parameters
- **Neighbor Radius**: Detection range for neighbors (20 - 200 pixels, default: 50)
- **Max Speed**: Maximum velocity magnitude (1 - 10 units/frame, default: 4)
- **Max Steering Force**: Constraint on acceleration (0.01 - 0.5, default: 0.1)

#### Boundary Handling
- **Wrap Mode** (default): Boids teleport to opposite edge
- **Bounce Mode**: Boids reflect off edges with velocity reversal

---

### 2. User Interface Controls

#### Parameter Sliders
Each slider must include:
- **Visual slider** with current value display
- **Label** with parameter name
- **Tooltip** (on hover) explaining the parameter in plain English
- **Real-time updates** (no "apply" button needed)

Required sliders:
1. **Separation Weight** (0.0 - 3.0, step: 0.1)
   - Tooltip: "How strongly boids avoid crowding neighbors"
   
2. **Alignment Weight** (0.0 - 3.0, step: 0.1)
   - Tooltip: "How strongly boids match their neighbors' direction"
   
3. **Cohesion Weight** (0.0 - 3.0, step: 0.1)
   - Tooltip: "How strongly boids move toward the group center"
   
4. **Neighbor Radius** (20 - 200 pixels, step: 5)
   - Tooltip: "How far a boid can see to detect neighbors"
   
5. **Max Speed** (1 - 10, step: 0.5)
   - Tooltip: "Maximum velocity of each boid"

#### Behavioral Presets
Three one-click buttons that instantly configure the simulation:

1. **"Schooling"** 🐟
   - Separation: 1.0
   - Alignment: 2.0
   - Cohesion: 1.5
   - Radius: 50
   - Max Speed: 4
   - Description: "Coordinated, fish-like movement"

2. **"Chaotic Swarm"** 🐝
   - Separation: 0.8
   - Alignment: 0.3
   - Cohesion: 0.2
   - Radius: 30
   - Max Speed: 6
   - Description: "Erratic, insect-like buzzing"

3. **"Tight Cluster"** 🦅
   - Separation: 1.2
   - Alignment: 1.0
   - Cohesion: 2.5
   - Radius: 80
   - Max Speed: 3
   - Description: "Dense flock, slow and cohesive"

#### System Controls
- **Reset Button**: Randomize boid positions/velocities with current parameters
- **Pause/Resume Toggle**: Stop/start the simulation loop
- **Boundary Mode Toggle**: Switch between "Wrap" and "Bounce"
- **Boid Count Input**: Number field (10 - 2000, default: 100)

---

### 3. Real-Time Instrumentation

Display panel showing:

1. **FPS** (Frames Per Second)
   - Update every 500ms
   - Color-coded: Green (>55), Yellow (30-55), Red (<30)

2. **Boid Count**
   - Current number of active boids

3. **Average Speed**
   - Mean velocity magnitude across all boids
   - Format: "X.XX units/frame"

4. **Average Neighbor Count**
   - Mean number of neighbors per boid
   - Helps assess flock density and interaction

---

### 4. Visual Design

#### Canvas
- **Size**: 1200×700 pixels (responsive scaling optional)
- **Background**: Dark (#1a1a2e) for contrast
- **Grid**: Optional subtle grid overlay

#### Boid Rendering
- **Shape**: Small triangle (5-8px) pointing in velocity direction
- **Color**: Bright, contrasting (cyan #00d9ff or configurable)
- **Velocity indicator**: Optional small line showing direction

#### UI Layout
```
+--------------------------------------------------+
|  BOIDS MINI-LAB       [Theme ▼] [Pause] [Reset] |
+--------------------------------------------------+
|                                                   |
|                                                   |
|            CANVAS (Simulation Area)               |
|          (Click to place obstacles)               |
|                                                   |
+--------------------------------------------------+
| CONTROLS                    | INSTRUMENTATION    |
|                             |                    |
| [Sliders Panel]             | FPS: 60            |
| - Separation                | Boids: 100         |
| - Alignment                 | Avg Speed: 3.42    |
| - Cohesion                  | Avg Neighbors: 4   |
| - Radius                    |                    |
| - Max Speed                 | [Boundary: Wrap ▼] |
|                             |                    |
| PRESETS                     | CHART [Metric ▼]  |
| [Schooling] [Chaotic]       | ┌───────────────┐ |
| [Cluster]                   | │  ╱╲  ╱╲       │ |
|                             | │ ╱  ╲╱  ╲      │ |
| [☐ Show Trails]             | │╱      ╲        │ |
| [Add Obstacle] [Clear All]  | └───────────────┘ |
+--------------------------------------------------+
```

---

## Stretch Challenges (3 Selected Features)

### A. Obstacle Avoidance 🚧
**Goal**: Add static circular obstacles that boids must navigate around

**Implementation**:
- Click canvas to place obstacles (radius: 20-60px)
- Avoidance force: Steer away when within 2× obstacle radius
- Priority: Obstacle avoidance force > flocking forces
- UI: "Add Obstacle" mode toggle, "Clear All Obstacles" button
- Visual: Draw obstacles as semi-transparent circles with subtle border
- Max obstacles: 20 (prevent performance degradation)

**Insight**: Observe how flocking adapts to environmental constraints

---

### B. Live Charting 📊
**Goal**: Visualize simulation metrics over time

**Implementation**:
- Small line chart (300×150px) in instrumentation panel
- Configurable metric dropdown:
  1. **Average neighbor count** (measures flock density)
  2. **Speed variance** (measures coordination - low variance = synchronized movement)
  3. **Flock compactness** (standard deviation of positions from center of mass)
- Rolling 200-frame window (approx. 3-4 seconds at 60 FPS)
- Use library: Chart.js (lightweight) or pure canvas plotting
- Color-coded zones (e.g., highlight "optimal schooling" range)
- Auto-scale Y-axis to fit data range

**Insight**: Quantify emergent behavior patterns and observe how parameter changes affect metrics

---

### C. Trails & Themes 🎨
**Goal**: Visual customization and motion history

**Implementation**:

**Motion Trails**:
- Toggle: "Show Trails" checkbox (on/off)
- Draw fading polyline behind each boid (last 20 positions)
- Alpha fade: 1.0 → 0.0 over trail length
- Performance optimization: Use canvas `globalAlpha` or clear with semi-transparent overlay
- Trail length adjustable: 10-50 positions

**Theme Toggle** (3 options):
1. **Minimal** (default):
   - Dark bg (#1a1a2e), cyan/white boids (#00d9ff)
   - Simple triangles, clean UI
   - High contrast for readability
   
2. **Neon**:
   - Black bg (#000), neon cyan/magenta boids
   - Glow effects (canvas shadow blur)
   - Trails prominent and vibrant
   - Synthwave aesthetic with purple/pink accents
   
3. **Nature**:
   - Sky blue bg (#87CEEB), brown/green boids (#8B4513 / #228B22)
   - Subtle shadows on boids
   - Organic, calming color palette
   - UI uses earth tones

- Themes affect: Canvas background, boid colors, trail colors, UI accent colors, control panel styling

**Insight**: Aesthetic appeal aids engagement and makes different behaviors more visually distinct

---

## Technical Stack Recommendations

### Core Technologies
- **HTML5 Canvas**: Primary rendering
- **Vanilla JavaScript**: Simulation logic (ES6+)
- **CSS3**: UI styling and layout

### Optional Libraries
- **UI Framework**: None required, but consider:
  - Minimal: Pure CSS + vanilla JS
  - Enhanced: Tailwind CSS for styling
- **Charting** (for Live Charting): Chart.js (recommended for simplicity)
- **Performance Monitoring**: stats.js for FPS display (or build custom)

### File Structure
```
boids-mini-lab/
├── index.html          # Main HTML structure
├── styles.css          # UI and canvas styling
├── boid.js             # Boid class definition
├── simulation.js       # Main simulation loop
├── ui-controls.js      # Slider/button handlers
├── instrumentation.js  # Metrics calculation
├── presets.js          # Preset configurations
├── obstacles.js        # Obstacle placement and avoidance
├── chart.js            # Live charting implementation
└── themes.js           # Theme and trail rendering
```

---

## Performance Targets

- **60 FPS** sustained with 100 boids (naive algorithm)
- **60 FPS** sustained with 500+ boids (with spatial partitioning)
- **UI response time**: <50ms for all slider updates
- **Memory**: <100MB for 1000 boids

---

## Testing Scenarios

1. **Behavioral Validation**:
   - Schooling preset → coordinated parallel movement
   - Chaotic preset → high-speed, erratic paths
   - Tight cluster → slow-moving, dense group

2. **Edge Cases**:
   - 0 neighbors → boids wander randomly
   - All weights = 0 → straight-line motion
   - Max speed = 0.1 → verify no NaN/frozen state

3. **Performance**:
   - 100, 500, 1000, 2000 boids → measure FPS degradation
   - Spatial partitioning → verify speedup

4. **UI/UX**:
   - All tooltips display correctly
   - Sliders update simulation in real-time
   - Pause/resume maintains state

---

## Accessibility Considerations

- **Keyboard Navigation**: All controls accessible via Tab
- **ARIA Labels**: Sliders and buttons properly labeled
- **High Contrast**: Option for high-contrast theme
- **Motion Sensitivity**: Warning about moving content, pause on load option
- **Screen Reader**: Instrumentation values announced on change

---

## Educational Value

This mini-lab teaches:
- **Emergence**: Complex group behavior from simple rules
- **Parameter Sensitivity**: How small changes create dramatic effects
- **Algorithmic Optimization**: O(n²) → O(n) via spatial partitioning
- **Multi-threading**: Web Workers for performance
- **Data Visualization**: Real-time metrics and charting

---

## Success Criteria

**Minimum Viable Product**:
- ✅ 5 parameter sliders with tooltips
- ✅ 3 behavioral presets working correctly
- ✅ 4 instrumentation readouts accurate
- ✅ Pause/Reset/Boundary toggle functional
- ✅ Smooth 60 FPS with 100 boids

**Enhanced Version** (3 stretch challenges):
- ✅ Obstacle Avoidance: Click-to-place obstacles with proper avoidance behavior
- ✅ Live Charting: Real-time metrics visualization with 3 selectable metrics
- ✅ Trails & Themes: Motion trails toggle + 3 complete visual themes
- ✅ All stretch features fully integrated with UI
- ✅ Documentation/tooltips for new features

**Exemplary Version**:
- ✅ Highly polished UI across all 3 themes
- ✅ Smooth performance with trails enabled (100+ boids at 60 FPS)
- ✅ Comprehensive tooltips/help system
- ✅ Intuitive obstacle placement and management

---

## Timeline Estimate

- **Core Requirements**: 6-8 hours
  - Simulation engine: 2-3 hours
  - UI controls: 2 hours
  - Instrumentation: 1 hour
  - Polish/testing: 1-2 hours

- **Stretch Challenges**: 5-6 hours
  - Obstacle Avoidance: 2 hours
  - Live Charting: 2 hours
  - Trails & Themes: 1.5-2 hours

**Total for MVP + 3 stretch challenges**: ~11-14 hours

---

## Inspiration & References

- **Original Paper**: Reynolds, C. (1987). "Flocks, herds and schools: A distributed behavioral model"
- **Interactive Demos**:
  - https://eater.net/boids
  - https://vimeo.com/58291553
- **Optimization Resources**:
  - Red Blob Games: Spatial Hashing
  - GameDev tutorials on quadtrees

---

## Future Enhancements (Beyond Scope)

- 3D visualization (Three.js/WebGL)
- Spatial partitioning optimization (uniform grid or quadtree for 1000+ boids)
- Perception cone (field-of-view based neighbor detection)
- Leaders & predators (hierarchical flocking behavior)
- Multi-species flocks with different parameters
- Machine learning: Evolve optimal parameters via genetic algorithm
- Multi-user: Collaborative flock control
- Preset export/import with URL sharing
- VR/AR: Immersive flocking experience
- Sound: Procedural audio based on flock density/speed

---

## Deliverables

1. **index.html**: Single-page application
2. **README.md**: Setup instructions, feature overview, controls guide
3. **demo.gif**: 10-second animated demo showing presets
4. **spec.md**: This document

---

*End of Specification*

**Good luck building your Boids Mini-Lab! 🐦✨**
