# Neural Network Decision Visualizer - Project Specification

## Executive Summary

**Project:** Interactive neural network visualization for binary decision-making  
**Primary Use Case:** "Should I watch the soccer game today?"  
**Architecture:** 5-input → 4-hidden → 1-output (5-4-1)  
**Key Innovation:** Multi-scenario framework - same network, different decisions  

**Target:**
- Course: Intro to AI/Machine Learning
- Priorities: User experience + Innovation + Design thinking
- Delivery: Live demo + submitted link

**Core Features:**
1. ✅ Real-time animated network visualization with signal flow
2. ✅ Interactive weight training mode (click to edit)
3. ✅ Full mathematical transparency (formulas with actual numbers)
4. ✅ Weight heatmap visualization
5. ✅ Demo scenarios for presentations
6. ✅ **STRETCH:** Multi-scenario system (Soccer → College → Pet → Road Trip → Tech → Custom)

**Personalization:**
- Default weights tuned to user's actual priorities
- Favorite Team > Free Time > Match Importance > Social > Energy
- Free Time acts as hard blocker (realistic decision-making)

---

## Project Overview
An interactive, educational web application that visualizes a simple neural network making real-time decisions. Initially demonstrates "Should I watch the soccer game today?" with personalized weights, then extends to multiple decision scenarios through a flexible multi-scenario system. The application demonstrates neural network concepts through live animations, mathematical transparency, manual weight training, and clean professional design.

## Target Audience
**Course:** Intro to AI/Machine Learning  
**Presentation Format:** Both live in-class demo AND submitted link for exploration  
**Professor Priorities:** User experience/design thinking + Innovation/creative features  
**Student Coding Level:** Advanced (can handle complex architecture)

---

## Design Philosophy

**Visual Style:** Academic/Technical
- Clean, professional diagram aesthetic
- High contrast for readability
- Thoughtful use of color to indicate data flow and strength
- Professional typography (not playful/casual)
- Grid-based layouts
- Resembles quality educational materials from top universities
- Focus on innovation and exceptional UX

**Priority Ranking:**
1. Real-time animated neural network visualization (PRIMARY)
2. Beautiful, polished design (HIGH)
3. Interactive controls and customization (HIGH)
4. Educational explanations with full formulas (HIGH)

**Performance Philosophy:**
- Balance: smooth core experience, optional heavy features
- Butter-smooth animations for main network
- Progressive enhancement for advanced visualizations

---

## Technical Architecture

### Network Structure
```
Input Layer (5 neurons) → Hidden Layer (4 neurons) → Output Layer (1 neuron)
```

**Why this architecture:**
- 5 inputs: Manageable complexity, demonstrates multi-factor decision
- 4 hidden neurons: Shows non-trivial computation without overwhelming visual
- 1 output: Binary decision probability (0-100%)

### Activation Functions
- **Hidden Layer:** ReLU (Rectified Linear Unit) - `f(x) = max(0, x)`
- **Output Layer:** Sigmoid - `f(x) = 1 / (1 + e^(-x))`

### Weight Initialization & Personalization

**Default Weights Based on User's Real Decision-Making:**

The user's actual priority ranking for watching soccer:
1. **Favorite Team Playing** (HIGHEST - will watch even when tired/busy)
2. **Available Free Time** (CRITICAL - hard blocker if missing)
3. **Match Importance** (MODERATE)
4. **Social Factor** (LOW-MODERATE)
5. **Energy Level** (LOWEST - not a blocker)

**Recommended Default Weight Strategy:**

Input-to-Hidden Layer weights should reflect these priorities:
- Favorite Team: Strong positive weights (0.7 to 0.9 range)
- Free Time: Strong positive weights (0.6 to 0.8 range) - but should act as hard requirement
- Match Importance: Moderate weights (0.4 to 0.6 range)
- Social Factor: Lower weights (0.2 to 0.4 range)
- Energy Level: Minimal weights (0.1 to 0.3 range)

Hidden-to-Output Layer: 
- Mix of positive weights to aggregate the hidden neuron outputs
- One or two negative weights to create interesting non-linear behavior

**Training Mode:**
- Users can manually click and edit individual weight values
- Shows how changing weights affects decision-making
- "Reset to My Profile" button returns to personalized defaults
- "Randomize" button creates new random weights (-1 to 1)
- Weight constraints: -2.0 to +2.0 range for stability

---

## Features & Components

### 1. Input Controls (Left Panel)

**Five Input Sliders:**

1. **Favorite Team Playing**
   - Range: 0-100%
   - Label: "Team Interest"
   - Description: "How much do you care about the teams playing?"
   - Default: 50%

2. **Match Importance**
   - Range: 0-100%
   - Label: "Match Importance"
   - Description: "Regular season game (0%) to Championship finals (100%)"
   - Default: 50%

3. **Available Free Time**
   - Range: 0-100%
   - Label: "Free Time"
   - Description: "How much free time do you have?"
   - Default: 70%

4. **Social Factor**
   - Range: 0-100%
   - Label: "Social Context"
   - Description: "Are friends watching? Social plans around the game?"
   - Default: 30%

5. **Energy Level**
   - Range: 0-100%
   - Label: "Energy Level"
   - Description: "How energized vs. tired are you?"
   - Default: 60%

**Slider Design:**
- Show current value next to slider (e.g., "65%")
- Smooth dragging with immediate updates
- Visual feedback on hover
- Consider color coding (low values = red/orange, high = green/blue)

### 2. Neural Network Visualization (Center Panel)

**Visual Requirements:**

**Neurons/Nodes:**
- Circles representing each neuron
- Display activation value inside (rounded to 2 decimals)
- Color intensity based on activation strength
  - Inactive (≈0): Light gray/white
  - Moderately active: Medium blue
  - Highly active (≈1): Bright blue/green
- Subtle pulse/glow animation when values change
- **INTERACTIVE:** Click on a neuron to see detailed activation breakdown in side panel

**Connections/Weights:**
- Lines connecting neurons between layers
- Line thickness proportional to |weight|
- Line color indicates sign:
  - Positive weights: Blue/green gradient
  - Negative weights: Red/orange gradient
- **INTERACTIVE - HOVER:** Hovering over a connection:
  - Highlights the entire pathway (input → hidden → output)
  - Shows weight value in a tooltip
  - Brightens the connection
  - Dims other connections slightly for focus
- **INTERACTIVE - CLICK:** Clicking on a connection:
  - Opens inline weight editor
  - Shows current weight value with +/- buttons or direct input
  - Live updates as you adjust
  - "Lock" icon to prevent accidental changes
- Animated "signal flow" particles moving along connections
  - Speed/brightness based on activation × weight
  - Should flow continuously from input → hidden → output
  - Creates visual understanding of information propagation
  - Pauses on hover to allow inspection

**Layer Labels:**
- Clear labels: "Input Layer", "Hidden Layer", "Output Layer"
- Input neurons labeled with factor names
- Hidden neurons labeled H1, H2, H3, H4
- Output neuron labeled "Decision Probability"

**Layout:**
- Evenly spaced layers (horizontal arrangement)
- Input layer: 5 neurons vertically aligned
- Hidden layer: 4 neurons vertically aligned (centered relative to inputs)
- Output layer: 1 neuron (centered)
- All-to-all connections between adjacent layers (5×4 + 4×1 = 24 total connections)

### 3. Weight Heatmap Visualization (Bottom Panel)

**Interactive Weight Matrix Display:**

Display all network weights as a visual heatmap for quick pattern recognition.

**Input-to-Hidden Weights (5×4 matrix):**
```
         H1    H2    H3    H4
Team    [0.8] [0.3] [0.7] [0.9]
Time    [0.7] [0.8] [0.6] [0.5]
Match   [0.5] [0.4] [0.6] [0.3]
Social  [0.3] [0.2] [0.4] [0.5]
Energy  [0.2] [0.1] [0.3] [0.2]
```

**Hidden-to-Output Weights (4×1 matrix):**
```
H1 → Output: [0.6]
H2 → Output: [0.5]
H3 → Output: [0.7]
H4 → Output: [-0.3]
```

**Visual Design:**
- Each cell is a colored square/rectangle
- Color scale: Deep red (-2.0) → White (0.0) → Deep blue (+2.0)
- Display numeric value inside each cell
- Hover shows which connection it represents
- Click cell to edit that specific weight
- Clear labels for rows (inputs) and columns (hidden neurons)
- Legend showing color scale

**Interaction:**
- Hovering over a cell highlights the corresponding connection in the main network visualization
- Clicking opens inline editor (same as clicking connection in main viz)
- "Download as CSV" option for data analysis

### 4. Output Display (Right Panel)

**Main Decision Display:**
- Large, prominent percentage: "73%" 
- Visual gauge/progress bar (0-100%)
- Text interpretation:
  - 0-30%: "Don't Watch" (red zone)
  - 30-70%: "Maybe Watch" (yellow/orange zone)
  - 70-100%: "Watch the Game!" (green zone)
- Smooth transitions when probability changes

**Recommendation Text:**
- Dynamic message based on probability
- Examples:
  - 85%: "Strong recommendation: Watch the game!"
  - 45%: "It's a toss-up. Go with your gut."
  - 15%: "Better skip it and stay productive."

### 5. Educational Panel (Toggleable Sidebar)

**Mathematical Breakdown - FULL FORMULAS WITH ACTUAL NUMBERS:**

Show the actual calculations happening in real-time with concrete values.

**Example Display (when sliders are at specific values):**

```
INPUT VALUES:
├─ Favorite Team Playing: 0.80 (80%)
├─ Available Free Time: 0.65 (65%)
├─ Match Importance: 0.50 (50%)
├─ Social Factor: 0.30 (30%)
└─ Energy Level: 0.40 (40%)

HIDDEN LAYER CALCULATIONS:

Neuron H1:
  Weighted Sum = (0.80 × 0.85) + (0.65 × 0.72) + (0.50 × 0.48) + (0.30 × 0.25) + (0.40 × 0.15) + bias(0.2)
                = 0.680 + 0.468 + 0.240 + 0.075 + 0.060 + 0.200
                = 1.723
  Activation (ReLU) = max(0, 1.723) = 1.723

Neuron H2:
  Weighted Sum = (0.80 × 0.35) + (0.65 × 0.78) + (0.50 × 0.42) + (0.30 × 0.18) + (0.40 × 0.12) + bias(-0.1)
                = 0.280 + 0.507 + 0.210 + 0.054 + 0.048 + (-0.100)
                = 0.999
  Activation (ReLU) = max(0, 0.999) = 0.999

[Similar for H3 and H4...]

OUTPUT LAYER CALCULATION:

  Weighted Sum = (1.723 × 0.65) + (0.999 × 0.52) + (H3 × w3) + (H4 × w4) + bias(0.3)
                = 1.120 + 0.519 + ... + 0.300
                = 2.847
  
  Activation (Sigmoid) = 1 / (1 + e^(-2.847))
                       = 1 / (1 + e^(-2.847))
                       = 1 / (1 + 0.058)
                       = 1 / 1.058
                       = 0.945
  
  FINAL PROBABILITY: 94.5%
```

**Interactive Features:**
- Select which hidden neuron to expand (dropdown or tabs)
- All calculations update live as sliders move
- Color-code weights to match visual network
- Highlight formula segments on hover
- "Copy Math" button to export calculations
- Toggle between decimal and percentage display

**Activation Function Explanations:**

**ReLU (Rectified Linear Unit):**
```
f(x) = max(0, x)
```
- Purpose: Introduces non-linearity, passes positive values
- Why we use it: Prevents vanishing gradient in training, computationally efficient
- Visual: Simple graph showing the function

**Sigmoid:**
```
f(x) = 1 / (1 + e^(-x))
```
- Purpose: Squashes any input to 0-1 range (perfect for probability)
- Why we use it: Output layer needs interpretable probability
- Visual: S-curve graph showing the function

**Weight Inspector:**
- Clicking any weight in heatmap or network shows:
  - Current value
  - Input/output neurons it connects
  - Contribution to final decision
  - Edit controls (+/- or direct input)

### 6. Controls & Demo Features

**Training Mode Controls:**
- **"Training Mode" Toggle** - Enables/disables weight editing
  - When ON: Connections and heatmap cells become editable
  - When OFF: Network is locked, prevents accidental changes
- **"Reset to My Profile"** - Returns to personalized default weights
- **"Randomize Weights"** - Generate new random weights (-1 to 1)
- **"Reset Inputs"** - Set all sliders to 50%

**Demo Scenario Buttons:**
For impressive live presentations, add auto-play scenarios:

1. **"Perfect Match"** 🎯
   - Animates sliders to: Team 95%, Time 90%, Match 85%, Social 60%, Energy 70%
   - Shows high probability decision
   - Auto-plays over 2 seconds with smooth transitions

2. **"Busy Day"** 📚
   - Animates sliders to: Team 80%, Time 15%, Match 70%, Social 20%, Energy 30%
   - Demonstrates Free Time as hard blocker
   - Shows how even high interest gets overridden

3. **"Social Event"** 👥
   - Animates sliders to: Team 40%, Time 85%, Match 50%, Social 95%, Energy 60%
   - Shows social factor tipping the scales
   
4. **"Energy Crash"** 😴
   - Animates sliders to: Team 90%, Time 80%, Match 75%, Social 50%, Energy 10%
   - Demonstrates that low energy alone won't stop the decision

Each scenario:
- Plays over 2-3 seconds with smooth animation
- Updates network visualization in real-time
- Can be paused mid-animation
- Ends with clear probability result

**Animation Controls:**
- **"Pause Signals"** - Stop the flowing particles (keep calculations running)
- **"Animation Speed"** - Slider to control particle flow speed (0.5x to 2x)

**View Options:**
- **"Show All Weights"** - Toggle weight values on all connections
- **"Show Activations"** - Toggle activation values inside neurons
- **"Highlight Mode"** - Dropdown: None | Strongest Paths | Weakest Paths

---

## STRETCH FEATURE: Multi-Scenario Neural Network

**Concept:** Transform the neural network into a general-purpose decision machine that works for ANY binary decision, not just soccer games.

### Feature Overview

The neuron becomes a flexible decision-making framework where users can:
1. Choose from preset decision scenarios
2. Create completely custom scenarios
3. Switch between scenarios seamlessly
4. See how the same network architecture applies to different decisions

**Key Innovation:** Demonstrates that neural networks are general-purpose tools - the same 5-4-1 architecture can model many different decision types by simply changing the context and weights.

---

### Preset Scenarios

**1. ⚽ Watch Soccer Game** (DEFAULT)
```
Decision: "Should I watch the soccer game today?"
Inputs:
  - Favorite Team Playing (0-100%)
  - Available Free Time (0-100%)
  - Match Importance (0-100%)
  - Social Factor (0-100%)
  - Energy Level (0-100%)
Celebration Text (>70%): "Watch the game! 📺⚽"
Decline Text (<30%): "Skip it this time 🚫"
```

**2. 🎓 Choose a College**
```
Decision: "Should I choose this university?"
Inputs:
  - Academic Reputation (0-100%)
  - Financial Aid Offered (0-100%)
  - Campus Culture Fit (0-100%)
  - Distance from Home (closer = higher %)
  - Career Opportunities (0-100%)
Celebration Text: "Enroll here! 🎓✨"
Decline Text: "Keep looking 🔍"
Suggested Weights: Reputation and Financial Aid highest
```

**3. 🐕 Adopt a Pet**
```
Decision: "Should I adopt this pet?"
Inputs:
  - Connection with Animal (0-100%)
  - Living Space Suitability (0-100%)
  - Financial Readiness (0-100%)
  - Time Availability (0-100%)
  - Family Support (0-100%)
Celebration Text: "Bring them home! 🐕❤️"
Decline Text: "Not the right fit 😔"
Suggested Weights: Connection and Time highest
```

**4. 🚗 Take a Road Trip**
```
Decision: "Should I take this road trip?"
Inputs:
  - Destination Appeal (0-100%)
  - Budget Available (0-100%)
  - Weather Forecast (0-100%)
  - Travel Companions (0-100%)
  - Vacation Days Left (0-100%)
Celebration Text: "Hit the road! 🚗🛣️"
Decline Text: "Stay local this time 🏠"
Suggested Weights: Destination and Budget highest
```

**5. 💻 Buy Tech Upgrade**
```
Decision: "Should I buy this tech upgrade?"
Inputs:
  - Performance Improvement (0-100%)
  - Price vs Budget (100% = great deal, 0% = too expensive)
  - Current Device Age (0-100%)
  - Feature Necessity (0-100%)
  - Reviews/Reputation (0-100%)
Celebration Text: "Make the purchase! 💳💻"
Decline Text: "Wait for a better time ⏳"
Suggested Weights: Performance and Price highest
```

---

### Custom Scenario Creator

**UI Panel:** "Create Your Own Scenario"

**Fields:**
1. **Decision Title** (text input)
   - Example: "Should I quit my job?"
   - Placeholder: "What decision are you making?"

2. **Emoji** (emoji picker or text input)
   - Visual identifier for the scenario
   - Default: 🤔

3. **Five Input Labels** (text inputs with descriptions)
   - Input 1: [Label] + [Description]
   - Input 2: [Label] + [Description]
   - etc.
   - Example: 
     - Label: "New Opportunity Quality"
     - Description: "How good is the new job?"

4. **Weight Presets** (optional)
   - Users can set initial weights for their scenario
   - Or leave as "Random" for exploration

5. **Celebration Messages**
   - High Probability (>70%): [text input]
   - Low Probability (<30%): [text input]
   - Mid Probability (30-70%): [text input, optional]

6. **Save Scenario**
   - Saves to browser localStorage
   - Appears in scenario picker dropdown
   - Can be edited/deleted later

---

### Scenario Switching Behavior

**When User Selects a Scenario:**

1. **Visual Transition** (300ms smooth animation):
   - Network fades slightly
   - Input panel slides/fades
   - New labels appear

2. **UI Updates:**
   - All input slider labels change
   - Slider descriptions update
   - Decision title updates (e.g., "Soccer Game Decision" → "College Choice Decision")
   - Celebration/decline text updates
   - Emoji indicator changes

3. **Weight Handling:**
   - Load scenario's suggested weights (or user's saved weights)
   - If switching from another scenario, ask: "Keep current weights or load [Scenario] defaults?"
   - Heatmap updates to show new weight configuration

4. **Calculations:**
   - Network immediately recalculates with current slider positions
   - User can adjust sliders for the new scenario
   - All math displays update to reflect new context

5. **Persistence:**
   - Current scenario saves to localStorage
   - On page reload, returns to last-used scenario
   - Each scenario remembers its last input values

---

### Implementation Details

**Data Structure:**
```javascript
const scenario = {
  id: 'soccer-game',
  title: 'Watch Soccer Game',
  emoji: '⚽',
  inputs: [
    { label: 'Favorite Team Playing', description: 'How much you care about the teams', default: 50 },
    { label: 'Available Free Time', description: 'How busy you are', default: 70 },
    // ... 5 total
  ],
  weights: {
    inputToHidden: [[...], [...], ...], // 5x4 matrix
    hiddenToOutput: [...], // 4x1 matrix
    biases: { hidden: [...], output: 0.0 }
  },
  messages: {
    high: 'Watch the game! 📺⚽',
    mid: "It's a toss-up. Go with your gut.",
    low: 'Skip it this time 🚫'
  }
};
```

**Storage:**
```javascript
// Built-in scenarios
const PRESET_SCENARIOS = [soccerGame, chooseCollege, adoptPet, roadTrip, techUpgrade];

// User-created scenarios
localStorage.getItem('custom-scenarios'); // Array of scenario objects
localStorage.getItem('current-scenario-id'); // Active scenario
```

**UI Location:**
- **Scenario Picker:** Dropdown or tab bar at top of interface
- **Custom Creator:** Modal or collapsible panel
- **Scenario Indicator:** Always visible showing current scenario (emoji + title)

---

### Educational Value of Multi-Scenario Feature

**Demonstrates:**
1. **Transfer Learning Concept:** Same architecture, different applications
2. **Weight Importance:** How different scenarios need different weight configurations
3. **Generalization:** Neural networks aren't domain-specific
4. **Real-World Applications:** Shows practical use of AI beyond technical examples

**Professor Impact:**
- Shows deep understanding that NNs are general-purpose tools
- Demonstrates software engineering (modularity, data structures)
- Innovation points for going beyond assignment requirements
- UX excellence in allowing exploration

---

## Visual Design Specifications

### Color Palette

**Primary (Academic Blue):**
- #2563EB (primary blue for active neurons)
- #1E40AF (darker blue for accents)
- #DBEAFE (light blue backgrounds)

**Neutral:**
- #F9FAFB (light background)
- #E5E7EB (borders, inactive elements)
- #6B7280 (text secondary)
- #111827 (text primary)

**Semantic:**
- Positive weights: #10B981 (green)
- Negative weights: #EF4444 (red)
- Warning/Maybe zone: #F59E0B (amber)

### Typography

**Headings:**
- Font: "IBM Plex Sans" or "Inter" (professional, technical)
- Weights: 600 for headings, 400 for body

**Mathematical Text:**
- Font: "JetBrains Mono" or "Fira Code" (monospace for formulas)

**Sizes:**
- Main title: 32px
- Section headers: 20px
- Body text: 16px
- Labels: 14px
- Neuron values: 12px

### Animations

**Timing:**
- Slider changes: Instant update to calculations
- Visual updates: 300ms ease-out transitions
- Signal flow: Continuous animation at 2-3 seconds per full traversal
- Neuron pulse on change: 500ms

**Effects:**
- Neurons: Subtle glow/shadow based on activation
- Connections: Gradient flow effect for signals
- Particles: Small circles (3-5px) with trail effect
- Hover states: Scale slightly (1.05x), show details

### Layout

**Responsive Grid:**
```
Desktop (>1024px):
[Input Panel (25%)] [Network Viz (50%)] [Output + Info (25%)]

Tablet (768-1024px):
[Input Panel (30%)] [Network Viz (70%)]
[Output Panel (100%)]

Mobile (<768px):
[Input Sliders (100%)]
[Network Viz (100%)]
[Output (100%)]
```

**Spacing:**
- Use 8px grid system
- Generous whitespace around components
- Panels have 24px padding
- Sections separated by 32px

---

## Implementation Notes

### Technology Stack Recommendations

**Frontend Framework:**
- React (with hooks) for state management
- OR vanilla JavaScript with well-organized modules

**Visualization:**
- SVG for neural network diagram (scalable, crisp)
- Canvas could work but SVG better for interactive elements
- CSS animations for smooth transitions

**Styling:**
- Tailwind CSS (utility-first, rapid development)
- OR custom CSS with CSS variables for theming

**Math:**
- Native JavaScript Math object is sufficient
- No need for heavy ML libraries (we're simulating, not training)

### Code Structure

```
/src
  /components
    - NetworkVisualization.jsx (main SVG network)
    - InputSliders.jsx (5 slider controls)
    - OutputDisplay.jsx (decision probability)
    - EducationalPanel.jsx (math breakdown)
    - Controls.jsx (buttons, options)
  /utils
    - neuralNetwork.js (calculation logic)
    - animations.js (signal flow helpers)
  /styles
    - main.css (or Tailwind)
  App.jsx (main component orchestration)
```

### State Management

**Global State:**
```javascript
{
  // Current scenario
  currentScenario: {
    id: 'soccer-game',
    title: 'Watch Soccer Game',
    emoji: '⚽',
    inputs: [...], // 5 input configurations
    messages: { high: '...', mid: '...', low: '...' }
  },
  
  // Input values
  inputs: [0.5, 0.5, 0.7, 0.3, 0.6], // 5 slider values (0-1 range)
  
  // Network parameters
  weights: {
    inputToHidden: [[...], [...], ...], // 5x4 matrix
    hiddenToOutput: [...], // 4x1 matrix
  },
  biases: {
    hidden: [...], // 4 values
    output: 0.0 // 1 value
  },
  
  // Computed values
  activations: {
    hidden: [...], // 4 calculated values
    output: 0.0 // final probability
  },
  
  // UI state
  uiState: {
    trainingModeEnabled: false,
    showWeights: true,
    showActivations: true,
    showMath: true,
    isPaused: false,
    selectedNeuron: null,
    editingWeight: null, // { layer: 'input-hidden', from: 2, to: 3 }
    highlightMode: 'none', // 'none' | 'strongest' | 'weakest'
    animationSpeed: 1.0,
  },
  
  // Multi-scenario
  scenarios: {
    presets: [...], // Built-in scenarios
    custom: [...], // User-created scenarios from localStorage
  }
}
```

### Calculation Flow

1. User adjusts slider → Update `inputs` array
2. Calculate hidden layer:
   - For each hidden neuron: weighted sum of inputs + bias
   - Apply ReLU activation
3. Calculate output layer:
   - Weighted sum of hidden activations + bias
   - Apply Sigmoid activation
4. Update visualization (trigger re-render)
5. Animations play automatically

---

## Success Criteria

**Functional Requirements:**
✅ All 5 sliders update network in real-time
✅ Network calculations are mathematically correct
✅ Probability output ranges 0-100% smoothly
✅ Animations flow continuously and clearly
✅ Educational panel shows accurate formulas with actual numbers
✅ Weight editing works (click connections or heatmap cells)
✅ Hover highlighting works on connections
✅ Demo scenarios auto-play smoothly
✅ Multi-scenario switching updates entire UI seamlessly
✅ Custom scenario creation and persistence works

**Visual/UX Requirements:**
✅ Professional, academic appearance
✅ Smooth, polished animations (60fps or gracefully degraded)
✅ Clear visual hierarchy
✅ Intuitive controls
✅ Responsive on different screen sizes
✅ Heatmap clearly shows weight patterns
✅ Interactive elements have clear affordances (hover states, cursors)

**Educational Value:**
✅ Clearly demonstrates neural network concept
✅ Shows all layers and connections
✅ Explains activation functions with formulas
✅ Displays mathematical operations with real numbers
✅ Allows experimentation (adjusting weights)
✅ Multi-scenario feature demonstrates generalizability

**Innovation & UX (Professor Priorities):**
✅ Weight heatmap provides novel visualization
✅ Interactive training mode is engaging
✅ Demo scenarios enable compelling presentations
✅ Multi-scenario feature shows creative thinking
✅ Personalized default weights add authenticity
✅ Smooth transitions and polish throughout

---

## Optional Enhancements (If Time Permits)

1. **Preset Scenarios:**
   - Buttons like "Big Match" (sets team interest high, match importance high)
   - "Busy Day" (sets free time low, energy low)
   - "Friends Night" (sets social factor high)

2. **Historical Tracking:**
   - Graph showing how decision probability changed over time
   - Record previous slider configurations

3. **Export/Share:**
   - Generate shareable link with current configuration
   - Download network diagram as PNG

4. **Mini-Tutorial:**
   - Guided tour explaining each component
   - Tooltips on first visit

5. **Multiple Networks:**
   - Compare two different network architectures side-by-side
   - Show how different hidden layer sizes affect decisions

6. **Mobile Optimization:**
   - Touch-friendly sliders
   - Simplified view for small screens

---

## File Deliverables

When implementing with Claude Code, you'll want to create:

1. `index.html` - Main HTML structure
2. `styles.css` - All styling (or use Tailwind CDN)
3. `app.js` - Main application logic
4. `neuralNetwork.js` - Neural network calculations
5. `README.md` - Usage instructions, explanation

Or if using React:
1. React component files as outlined above
2. Package.json with dependencies
3. README.md

---

## Testing Checklist

**Core Functionality:**
- [ ] All sliders move smoothly (0-100)
- [ ] Network recalculates instantly on input change
- [ ] Animations don't lag or stutter (or degrade gracefully)
- [ ] Math panel shows correct calculations with actual numbers
- [ ] All activation values are accurate

**Interactive Features:**
- [ ] Hovering over connections highlights pathways
- [ ] Clicking connections opens weight editor
- [ ] Weight editing updates network immediately
- [ ] Heatmap cells are clickable and editable
- [ ] Heatmap hover highlights corresponding network connection
- [ ] Training mode toggle enables/disables editing

**Controls:**
- [ ] "Reset to My Profile" restores personalized weights
- [ ] "Randomize Weights" generates valid random weights
- [ ] "Reset Inputs" sets all sliders to 50%
- [ ] Demo scenarios animate smoothly
- [ ] Animation pause/speed controls work
- [ ] View toggles (show weights, activations) work

**Multi-Scenario Feature:**
- [ ] Can switch between preset scenarios
- [ ] Scenario switching updates all UI elements
- [ ] Custom scenario creator works
- [ ] Custom scenarios save to localStorage
- [ ] Custom scenarios load on page reload
- [ ] Scenario picker shows all available scenarios
- [ ] Each scenario has correct input labels and messages

**Visual Polish:**
- [ ] Looks professional on laptop screen (1920x1080 and 1366x768)
- [ ] Responsive layout works on tablet (if time permits)
- [ ] No console errors
- [ ] All hover states are clear
- [ ] Transitions are smooth
- [ ] Colors match the academic aesthetic
- [ ] Typography is readable and professional

**Demo Readiness:**
- [ ] "Perfect Match" scenario demonstrates high probability
- [ ] "Busy Day" scenario demonstrates hard blocker concept
- [ ] Page loads quickly
- [ ] No initialization lag
- [ ] Can switch scenarios during presentation
- [ ] Educational panel is easy to toggle

---

## Presentation Tips for Professor

**Suggested Demo Flow:**

**1. Introduction (30 seconds)**
- Start with Soccer Game scenario at default values
- Briefly explain: "I've built an interactive neural network that makes binary decisions"
- "It's personalized to my actual decision-making patterns"

**2. Basic Demonstration (1 minute)**
- Adjust one slider at a time to show reactivity
- Point out the signal flow animation
- Highlight the probability updating in real-time
- Run "Perfect Match" demo scenario

**3. Training Mode (1 minute)**
- Toggle Training Mode ON
- Click a connection to edit a weight
- Show how changing weights affects the decision
- Demonstrate weight heatmap
- "This shows how the network 'learns' what factors matter"

**4. Educational Panel (30 seconds)**
- Open the math panel
- Point to the full formulas with actual numbers
- Explain ReLU and Sigmoid briefly
- "All calculations are transparent and mathematically correct"

**5. Multi-Scenario Innovation (1-2 minutes) - THE WOW FACTOR**
- "But the real innovation is this: the same network architecture can make any decision"
- Switch to College Choice scenario
  - Show how labels change
  - Point out different weights for different decision types
- Switch to Pet Adoption scenario
- Quick demo of custom scenario creator
- "This demonstrates that neural networks are general-purpose tools"

**6. Wrap-up (30 seconds)**
- Hover over connections to show pathway highlighting
- Run "Busy Day" scenario to show hard blocker concept
- Mention code quality and architecture if asked

**Key Talking Points:**

**Technical:**
- "5-input, 4-hidden, 1-output architecture (5-4-1)"
- "ReLU activation in hidden layer prevents vanishing gradient"
- "Sigmoid output gives interpretable probability (0-1 range)"
- "All-to-all connectivity: 24 total weighted connections"
- "Real-time forward propagation on every input change"

**Design/UX:**
- "Interactive weight editing demonstrates manual 'training'"
- "Heatmap visualization provides quick pattern recognition"
- "Demo scenarios enable reproducible presentations"
- "Multi-scenario feature shows network generalizability"

**Innovation:**
- "Personalized default weights based on my actual preferences"
- "Same architecture, different applications - transfer learning concept"
- "Custom scenario creator makes it a tool anyone can use"
- "Focuses on UX and educational value, not just technical implementation"

**If Professor Asks About...**

*Code Quality:*
- "Modular architecture with clear separation of concerns"
- "State management handles complex interactions"
- "Performant animations with CSS and requestAnimationFrame"
- "LocalStorage for scenario persistence"

*ML Concepts:*
- "Demonstrates forward propagation clearly"
- "Weight matrices show network parameters"
- "Activation functions introduce non-linearity"
- "Though not trained via backprop, shows how weights affect output"

*Future Enhancements:*
- "Could add backpropagation visualization"
- "Could show gradient descent training in real-time"
- "Could export network as JSON for reuse"
- "Could add more complex architectures (multiple hidden layers)"

---

## Implementation Priority Guide for Claude Code

When building this project, tackle features in this order:

### Phase 1: Core Foundation (MUST HAVE)
1. **Basic Network Visualization**
   - SVG-based 5-4-1 network layout
   - Static neurons and connections
   - Proper positioning and labels

2. **Input Sliders**
   - 5 functional sliders (0-100%)
   - Real-time value display
   - Soccer game scenario labels

3. **Forward Propagation**
   - Correct ReLU and Sigmoid calculations
   - Weight matrix multiplication
   - Live probability output

4. **Basic Animations**
   - Signal flow particles
   - Smooth transitions on value changes
   - Neuron color based on activation

### Phase 2: Interactivity (SHOULD HAVE)
5. **Weight Heatmap**
   - Visual grid of all weights
   - Color coding (-2 to +2 scale)
   - Display numeric values

6. **Mathematical Panel**
   - Full formulas with actual numbers
   - Real-time calculation display
   - ReLU and Sigmoid explanations

7. **Hover Interactions**
   - Connection highlighting
   - Pathway visualization
   - Tooltip with weight values

8. **Training Mode**
   - Click to edit weights
   - Weight editor UI
   - Immediate network updates

### Phase 3: Polish & Demo (SHOULD HAVE)
9. **Demo Scenarios**
   - 4 preset scenarios (Perfect Match, Busy Day, etc.)
   - Smooth animation of sliders
   - Auto-play functionality

10. **Controls Panel**
    - Reset to My Profile
    - Randomize Weights
    - Reset Inputs
    - Animation controls

11. **Personalized Weights**
    - Default weights reflecting user priorities
    - Team Interest and Free Time weighted highest

### Phase 4: Innovation (STRETCH - NICE TO HAVE)
12. **Multi-Scenario Feature**
    - 5 preset scenarios (Soccer, College, Pet, Road Trip, Tech)
    - Scenario switcher UI
    - All UI updates on scenario change

13. **Custom Scenario Creator**
    - Modal/panel for creation
    - All input fields
    - localStorage persistence

14. **Advanced Features**
    - Drag neuron positions (if time)
    - Export network configuration
    - Mobile responsiveness

### Technical Implementation Notes

**For Claude Code to prioritize:**
- Start with React for easier state management
- Use Tailwind CSS for rapid styling
- SVG for network visualization (not Canvas)
- CSS animations for smooth performance
- LocalStorage for scenario persistence
- RequestAnimationFrame for particle animations

**If running short on time:**
- Multi-scenario can be simplified to just scenario switching (no custom creator)
- Demo scenarios can be reduced to 2 instead of 4
- Mobile responsiveness can be deprioritized
- Advanced interactions (drag neurons) can be skipped

**Critical for success:**
- Network math MUST be correct
- Animations MUST be smooth
- Weight editing MUST work
- Demo scenarios for live presentation

---

## Questions for Claude Code Implementation

When you paste this into Claude Code, consider asking:

1. "Should we use React or vanilla JavaScript?"
2. "Should the network weights be truly random or pre-tuned for sensible decisions?"
3. "How complex should the particle animations be?"
4. "Should we include a training simulation mode?"

Good luck with your project! This spec should give Claude Code everything needed to build an impressive neural network visualizer.
