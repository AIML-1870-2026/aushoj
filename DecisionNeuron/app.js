/* ═══════════════════════════════════════════════════════════════
   SCENARIO DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */
const PRESETS = [
  {
    id: 'soccer', title: 'Watch Soccer Game', emoji: '⚽',
    inputs: [
      { label: 'Favorite Team', desc: 'How much do you care about the teams playing?', default: 50 },
      { label: 'Match Importance', desc: 'Regular season (0%) to Championship finals (100%)', default: 50 },
      { label: 'Free Time', desc: 'How much free time do you have?', default: 70 },
      { label: 'Social Context', desc: 'Are friends watching? Social plans around the game?', default: 30 },
      { label: 'Energy Level', desc: 'How energized vs. tired are you?', default: 60 },
    ],
    weights: {
      ih: [
        [0.85, 0.35, 0.70, 0.90],
        [0.48, 0.42, 0.55, 0.38],
        [0.72, 0.78, 0.60, 0.50],
        [0.25, 0.18, 0.40, 0.48],
        [0.15, 0.12, 0.28, 0.20],
      ],
      ho: [0.65, 0.52, 0.70, -0.30],
      biasH: [0.20, -0.10, 0.05, -0.15],
      biasO: -0.80,
    },
    messages: { high: 'Watch the game! ⚽📺', probHigh: 'Leaning towards watching. Got a good feeling.', mid: "It's a toss-up. Go with your gut.", probLow: 'Probably not worth it tonight.', low: 'Skip it this time.' },
    demos: [
      { name: 'Perfect Match', emoji: '🎯', values: [95,85,90,60,70] },
      { name: 'Busy Day', emoji: '📚', values: [80,70,15,20,30] },
      { name: 'Social Event', emoji: '👥', values: [40,50,85,95,60] },
      { name: 'Energy Crash', emoji: '😴', values: [90,75,80,50,10] },
    ],
  },
  {
    id: 'college', title: 'Choose a College', emoji: '🎓',
    inputs: [
      { label: 'Academic Reputation', desc: 'How strong is the academic program?', default: 50 },
      { label: 'Financial Aid', desc: 'Scholarship and aid quality', default: 50 },
      { label: 'Campus Culture', desc: 'Do you fit in with the campus vibe?', default: 50 },
      { label: 'Distance from Home', desc: 'Closer = higher percentage', default: 50 },
      { label: 'Career Opportunities', desc: 'Internship and job placement rate', default: 50 },
    ],
    weights: {
      ih: [
        [0.90, 0.40, 0.65, 0.80],
        [0.80, 0.85, 0.50, 0.35],
        [0.35, 0.50, 0.75, 0.60],
        [0.20, 0.30, 0.40, 0.25],
        [0.60, 0.45, 0.55, 0.70],
      ],
      ho: [0.70, 0.55, 0.60, -0.25],
      biasH: [0.10, -0.05, 0.15, -0.10],
      biasO: -0.90,
    },
    messages: { high: 'Enroll here! 🎓✨', probHigh: 'Strong contender. Schedule a visit.', mid: 'Worth considering. Visit the campus.', probLow: 'Probably not the one. Keep exploring.', low: 'Keep looking. 🔍' },
    demos: [
      { name: 'Dream School', emoji: '⭐', values: [95,80,90,60,85] },
      { name: 'Budget Pick', emoji: '💰', values: [60,95,50,80,55] },
      { name: 'Far Away', emoji: '✈️', values: [85,70,75,10,80] },
    ],
  },
  {
    id: 'pet', title: 'Adopt a Pet', emoji: '🐕',
    inputs: [
      { label: 'Connection', desc: 'How strong is your bond with this animal?', default: 50 },
      { label: 'Living Space', desc: 'Is your home suitable?', default: 50 },
      { label: 'Financial Readiness', desc: 'Can you afford vet bills, food, etc.?', default: 50 },
      { label: 'Time Available', desc: 'Do you have time for walks, play, care?', default: 50 },
      { label: 'Family Support', desc: 'Does everyone in the household agree?', default: 50 },
    ],
    weights: {
      ih: [
        [0.88, 0.30, 0.75, 0.85],
        [0.50, 0.70, 0.55, 0.40],
        [0.60, 0.80, 0.45, 0.35],
        [0.75, 0.55, 0.80, 0.65],
        [0.40, 0.45, 0.60, 0.50],
      ],
      ho: [0.68, 0.58, 0.65, -0.20],
      biasH: [0.10, -0.15, 0.05, -0.10],
      biasO: -0.85,
    },
    messages: { high: 'Bring them home! 🐕❤️', probHigh: 'Looking good! Prepare your home.', mid: 'Think it over a bit more.', probLow: 'Might want to wait a bit longer.', low: 'Not the right fit right now. 😔' },
    demos: [
      { name: 'Love at First Sight', emoji: '❤️', values: [98,75,65,70,85] },
      { name: 'Tiny Apartment', emoji: '🏢', values: [80,20,70,60,90] },
      { name: 'Tight Budget', emoji: '💸', values: [85,80,15,70,75] },
    ],
  },
  {
    id: 'roadtrip', title: 'Take a Road Trip', emoji: '🚗',
    inputs: [
      { label: 'Destination Appeal', desc: 'How exciting is the destination?', default: 50 },
      { label: 'Budget Available', desc: 'Can you afford gas, food, lodging?', default: 50 },
      { label: 'Weather Forecast', desc: 'Is the weather looking good?', default: 50 },
      { label: 'Travel Companions', desc: 'Got great people to go with?', default: 50 },
      { label: 'Vacation Days Left', desc: 'Do you have PTO available?', default: 50 },
    ],
    weights: {
      ih: [
        [0.85, 0.45, 0.70, 0.80],
        [0.70, 0.82, 0.50, 0.40],
        [0.30, 0.35, 0.65, 0.25],
        [0.40, 0.30, 0.55, 0.60],
        [0.55, 0.68, 0.45, 0.50],
      ],
      ho: [0.62, 0.55, 0.68, -0.28],
      biasH: [0.15, -0.10, 0.10, -0.05],
      biasO: -0.75,
    },
    messages: { high: 'Hit the road! 🚗🛣️', probHigh: 'Looking promising. Start packing!', mid: 'Could go either way. Plan a bit more.', probLow: 'The timing feels off. Maybe next time.', low: 'Stay local this time. 🏠' },
    demos: [
      { name: 'Dream Destination', emoji: '🏔️', values: [95,80,85,70,75] },
      { name: 'Rainy Forecast', emoji: '🌧️', values: [75,70,10,60,80] },
      { name: 'Solo Adventure', emoji: '🧭', values: [80,65,75,15,70] },
    ],
  },
  {
    id: 'tech', title: 'Buy Tech Upgrade', emoji: '💻',
    inputs: [
      { label: 'Performance Gain', desc: 'How big is the speed/quality improvement?', default: 50 },
      { label: 'Price vs Budget', desc: '100% = great deal, 0% = too expensive', default: 50 },
      { label: 'Current Device Age', desc: 'How old is your current device?', default: 50 },
      { label: 'Feature Necessity', desc: 'Do you actually need the new features?', default: 50 },
      { label: 'Reviews/Reputation', desc: 'What are reviewers saying?', default: 50 },
    ],
    weights: {
      ih: [
        [0.82, 0.40, 0.65, 0.78],
        [0.75, 0.85, 0.55, 0.42],
        [0.50, 0.55, 0.70, 0.35],
        [0.45, 0.35, 0.60, 0.65],
        [0.30, 0.40, 0.50, 0.55],
      ],
      ho: [0.60, 0.58, 0.65, -0.22],
      biasH: [0.10, -0.08, 0.12, -0.12],
      biasO: -0.82,
    },
    messages: { high: 'Make the purchase! 💳💻', probHigh: 'Solid buy. Pull the trigger soon.', mid: 'Wait for a sale or compare more.', probLow: "Doesn't quite justify the cost yet.", low: 'Wait for a better time. ⏳' },
    demos: [
      { name: 'Must-Have Upgrade', emoji: '🔥', values: [90,75,85,80,88] },
      { name: 'Overpriced', emoji: '💸', values: [70,15,40,50,60] },
      { name: 'Impulse Buy', emoji: '⚡', values: [55,60,20,30,45] },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   APPLICATION STATE
   ═══════════════════════════════════════════════════════════════ */
let state = {
  scenario: null,
  inputs: [0.5, 0.5, 0.5, 0.5, 0.5],
  weights: { ih: [], ho: [], biasH: [], biasO: 0 },
  activations: { hidden: [0,0,0,0], output: 0 },
  rawSums: { hidden: [0,0,0,0], output: 0 },
  ui: {
    editWeights: false,
    paused: false,
    speed: 1,
    mathOpen: true,
    editingWeight: null,
  },
  customScenarios: [],
  particles: [],
  weightHistory: [],
  historyIndex: -1,
};

/* ═══════════════════════════════════════════════════════════════
   NEURAL NETWORK MATH
   ═══════════════════════════════════════════════════════════════ */
function relu(x) { return Math.max(0, x); }

function sigmoid(x) {
  // Clamp to prevent overflow with extreme weight values
  const clamped = Math.max(-500, Math.min(500, x));
  return 1 / (1 + Math.exp(-clamped));
}

function forwardPass() {
  const { inputs, weights } = state;
  const hidden = [];
  const rawH = [];
  for (let j = 0; j < 4; j++) {
    let sum = weights.biasH[j];
    for (let i = 0; i < 5; i++) {
      sum += inputs[i] * weights.ih[i][j];
    }
    rawH.push(sum);
    hidden.push(relu(sum));
  }
  let sumO = weights.biasO;
  for (let j = 0; j < 4; j++) {
    sumO += hidden[j] * weights.ho[j];
  }
  state.rawSums.hidden = rawH;
  state.rawSums.output = sumO;
  state.activations.hidden = hidden;
  state.activations.output = sigmoid(sumO);
}

/* ═══════════════════════════════════════════════════════════════
   FACTOR IMPORTANCE ANALYSIS
   ═══════════════════════════════════════════════════════════════ */
function computeFactorImportance() {
  const { inputs, weights } = state;
  const importance = [];
  for (let i = 0; i < 5; i++) {
    let totalInfluence = 0;
    for (let j = 0; j < 4; j++) {
      // Contribution = input * weight_ih * weight_ho (end-to-end influence)
      const hiddenContrib = inputs[i] * weights.ih[i][j];
      const activated = relu(hiddenContrib); // simplified per-path activation
      totalInfluence += Math.abs(activated * weights.ho[j]);
    }
    importance.push({
      index: i,
      label: state.scenario.inputs[i].label,
      value: totalInfluence,
      inputValue: inputs[i],
    });
  }
  importance.sort((a, b) => b.value - a.value);
  return importance;
}

/* ═══════════════════════════════════════════════════════════════
   WEIGHT HISTORY (Undo/Redo)
   ═══════════════════════════════════════════════════════════════ */
function pushWeightHistory() {
  // Trim future history if we're not at the end
  state.weightHistory = state.weightHistory.slice(0, state.historyIndex + 1);
  state.weightHistory.push(deepClone(state.weights));
  state.historyIndex = state.weightHistory.length - 1;
  // Keep history manageable
  if (state.weightHistory.length > 50) {
    state.weightHistory.shift();
    state.historyIndex--;
  }
  updateUndoRedoButtons();
}

function undoWeight() {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    state.weights = deepClone(state.weightHistory[state.historyIndex]);
    updateViz();
    updateUndoRedoButtons();
  }
}

function redoWeight() {
  if (state.historyIndex < state.weightHistory.length - 1) {
    state.historyIndex++;
    state.weights = deepClone(state.weightHistory[state.historyIndex]);
    updateViz();
    updateUndoRedoButtons();
  }
}

function updateUndoRedoButtons() {
  const undoBtn = document.getElementById('btn-undo');
  const redoBtn = document.getElementById('btn-redo');
  if (undoBtn) undoBtn.disabled = state.historyIndex <= 0;
  if (redoBtn) redoBtn.disabled = state.historyIndex >= state.weightHistory.length - 1;
}

/* ═══════════════════════════════════════════════════════════════
   SVG NETWORK LAYOUT
   ═══════════════════════════════════════════════════════════════ */
const LAYOUT = {
  input: { x: 130, count: 5, gap: 68, startY: 60 },
  hidden: { x: 350, count: 4, gap: 76, startY: 82 },
  output: { x: 570, count: 1, gap: 0, startY: 196 },
  neuronR: 24,
};
function neuronPos(layer, idx) {
  const L = LAYOUT[layer];
  return { x: L.x, y: L.startY + idx * L.gap };
}

let svgEl, connectionsG, neuronsG, particlesG, labelsG;
const connectionEls = [];
const neuronEls = [];

function buildSVG() {
  svgEl = document.getElementById('network-svg');
  svgEl.innerHTML = '';
  svgEl.setAttribute('role', 'img');
  svgEl.setAttribute('aria-label', 'Neural network visualization showing 5 input neurons connected to 4 hidden neurons connected to 1 output neuron');

  const defs = svgNS('defs');
  svgEl.appendChild(defs);

  connectionsG = svgNS('g'); svgEl.appendChild(connectionsG);
  particlesG = svgNS('g'); svgEl.appendChild(particlesG);
  neuronsG = svgNS('g'); svgEl.appendChild(neuronsG);
  labelsG = svgNS('g'); svgEl.appendChild(labelsG);

  addText(labelsG, LAYOUT.input.x, 22, 'Input Layer', 'layer-label', 'middle');
  addText(labelsG, LAYOUT.hidden.x, 22, 'Hidden Layer', 'layer-label', 'middle');
  addText(labelsG, LAYOUT.output.x, 22, 'Output Layer', 'layer-label', 'middle');

  connectionEls.length = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      const p1 = neuronPos('input', i);
      const p2 = neuronPos('hidden', j);
      const line = svgNS('line', {
        x1: p1.x + LAYOUT.neuronR, y1: p1.y,
        x2: p2.x - LAYOUT.neuronR, y2: p2.y,
        class: 'connection-line',
      });
      line.dataset.layer = 'ih';
      line.dataset.i = i;
      line.dataset.j = j;
      line.setAttribute('role', 'button');
      line.setAttribute('tabindex', '-1');
      line.setAttribute('aria-label', `Weight connection from input ${i+1} to hidden neuron ${j+1}`);
      line.addEventListener('mouseenter', onConnHover);
      line.addEventListener('mouseleave', onConnLeave);
      line.addEventListener('click', onConnClick);
      connectionsG.appendChild(line);
      connectionEls.push({ el: line, layer: 'ih', i, j });
    }
  }
  for (let j = 0; j < 4; j++) {
    const p1 = neuronPos('hidden', j);
    const p2 = neuronPos('output', 0);
    const line = svgNS('line', {
      x1: p1.x + LAYOUT.neuronR, y1: p1.y,
      x2: p2.x - LAYOUT.neuronR, y2: p2.y,
      class: 'connection-line',
    });
    line.dataset.layer = 'ho';
    line.dataset.i = j;
    line.dataset.j = 0;
    line.setAttribute('role', 'button');
    line.setAttribute('tabindex', '-1');
    line.setAttribute('aria-label', `Weight connection from hidden neuron ${j+1} to output`);
    line.addEventListener('mouseenter', onConnHover);
    line.addEventListener('mouseleave', onConnLeave);
    line.addEventListener('click', onConnClick);
    connectionsG.appendChild(line);
    connectionEls.push({ el: line, layer: 'ho', i: j, j: 0 });
  }

  neuronEls.length = 0;
  const layers = ['input', 'hidden', 'output'];
  const counts = [5, 4, 1];
  for (let li = 0; li < 3; li++) {
    for (let ni = 0; ni < counts[li]; ni++) {
      const pos = neuronPos(layers[li], ni);
      const g = svgNS('g');
      g.setAttribute('role', 'img');
      const circle = svgNS('circle', {
        cx: pos.x, cy: pos.y, r: LAYOUT.neuronR,
        class: 'neuron-circle',
        fill: '#21262d', stroke: '#30363d',
      });
      const text = svgNS('text', {
        x: pos.x, y: pos.y,
        class: 'neuron-value',
      });
      text.textContent = '0.00';
      g.appendChild(circle);
      g.appendChild(text);
      neuronsG.appendChild(g);
      neuronEls.push({ g, circle, text, layer: layers[li], idx: ni });

      if (layers[li] === 'input') {
        g.setAttribute('aria-label', `Input neuron ${ni+1}`);
        const lbl = svgNS('text', {
          x: pos.x - LAYOUT.neuronR - 8, y: pos.y,
          class: 'neuron-label-text',
        });
        lbl.id = `input-label-${ni}`;
        lbl.textContent = '';
        labelsG.appendChild(lbl);
      }
      if (layers[li] === 'hidden') {
        g.setAttribute('aria-label', `Hidden neuron ${ni+1} with ReLU activation`);
        const lbl = svgNS('text', {
          x: pos.x, y: pos.y + LAYOUT.neuronR + 14,
          class: 'neuron-label-text',
        });
        lbl.style.textAnchor = 'middle';
        lbl.textContent = `H${ni + 1}`;
        labelsG.appendChild(lbl);
      }
      if (layers[li] === 'output') {
        g.setAttribute('aria-label', 'Output neuron with Sigmoid activation producing decision probability');
        const lbl = svgNS('text', {
          x: pos.x + LAYOUT.neuronR + 8, y: pos.y,
          class: 'neuron-label-text',
        });
        lbl.style.textAnchor = 'start';
        lbl.textContent = 'Decision';
        labelsG.appendChild(lbl);
      }
    }
  }
}

function svgNS(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.setAttribute('class', v);
    else el.setAttribute(k, v);
  }
  return el;
}

function addText(parent, x, y, text, cls, anchor) {
  const t = svgNS('text', { x, y, class: cls });
  t.setAttribute('text-anchor', anchor || 'start');
  t.setAttribute('dominant-baseline', 'central');
  t.textContent = text;
  parent.appendChild(t);
}

/* ═══════════════════════════════════════════════════════════════
   UPDATE VISUALIZATION
   ═══════════════════════════════════════════════════════════════ */
function updateViz() {
  forwardPass();
  updateNeurons();
  updateConnections();
  updateOutput();
  updateMath();
  updateHeatmap();
  updateFactorInsight();
}

function updateNeurons() {
  const { inputs, activations } = state;
  neuronEls.forEach(n => {
    let val;
    if (n.layer === 'input') val = inputs[n.idx];
    else if (n.layer === 'hidden') val = activations.hidden[n.idx];
    else val = activations.output;

    n.text.textContent = val.toFixed(2);
    const intensity = Math.min(1, val);
    // Dark mode: inactive = dark gray, active = bright blue
    const r = Math.round(33 + (31 - 33) * intensity);
    const g = Math.round(38 + (111 - 38) * intensity);
    const b = Math.round(45 + (235 - 45) * intensity);
    n.circle.setAttribute('fill', `rgb(${r},${g},${b})`);
    n.circle.setAttribute('stroke', intensity > 0.5 ? '#58a6ff' : '#30363d');
    n.text.setAttribute('fill', intensity > 0.3 ? 'white' : '#8b949e');
  });
}

function updateConnections() {
  connectionEls.forEach(c => {
    let w;
    if (c.layer === 'ih') w = state.weights.ih[c.i][c.j];
    else w = state.weights.ho[c.i];
    const absW = Math.abs(w);
    const thickness = 1 + absW * 3;
    c.el.setAttribute('stroke-width', thickness);
    c.el.setAttribute('stroke', w >= 0
      ? `rgba(16,185,129,${0.25 + absW * 0.5})`
      : `rgba(239,68,68,${0.25 + absW * 0.5})`);
    c.el.setAttribute('aria-label',
      c.layer === 'ih'
        ? `${state.scenario.inputs[c.i].label} to H${c.j+1}: weight ${w.toFixed(3)}`
        : `H${c.i+1} to Output: weight ${w.toFixed(3)}`
    );
  });
}

function updateOutput() {
  const prob = state.activations.output;
  const pct = (prob * 100).toFixed(1);
  const pctInt = Math.round(prob * 100);

  const probEl = document.getElementById('decision-prob');
  probEl.innerHTML = `${pctInt}<span class="pct">%</span>`;
  probEl.setAttribute('aria-label', `Decision probability: ${pctInt} percent`);
  const fill = document.getElementById('gauge-fill');
  fill.style.width = pct + '%';
  fill.setAttribute('aria-valuenow', pctInt);

  let color, zone, msg;
  const sc = state.scenario;
  if (prob >= 0.8) {
    color = '#3fb950'; zone = 'Yes!';
    msg = sc.messages.high;
    fill.style.background = 'linear-gradient(90deg, #56d364, #3fb950)';
  } else if (prob >= 0.6) {
    color = '#58a6ff'; zone = 'Probably';
    msg = sc.messages.probHigh || sc.messages.mid;
    fill.style.background = 'linear-gradient(90deg, #79c0ff, #58a6ff)';
  } else if (prob >= 0.4) {
    color = '#d29922'; zone = 'Maybe';
    msg = sc.messages.mid;
    fill.style.background = 'linear-gradient(90deg, #e3b341, #d29922)';
  } else if (prob >= 0.2) {
    color = '#db6d28'; zone = 'Probably Not';
    msg = sc.messages.probLow || sc.messages.mid;
    fill.style.background = 'linear-gradient(90deg, #e09b69, #db6d28)';
  } else {
    color = '#f85149'; zone = 'No';
    msg = sc.messages.low;
    fill.style.background = 'linear-gradient(90deg, #ff7b72, #f85149)';
  }

  probEl.style.color = color;
  document.getElementById('decision-zone').textContent = zone;
  document.getElementById('decision-zone').style.color = color;
  document.getElementById('decision-message').textContent = msg;
}

/* ═══════════════════════════════════════════════════════════════
   FACTOR INSIGHT PANEL
   ═══════════════════════════════════════════════════════════════ */
function updateFactorInsight() {
  const container = document.getElementById('factor-insight');
  if (!container) return;
  const factors = computeFactorImportance();
  const maxVal = factors[0]?.value || 1;

  let html = '';
  factors.forEach((f, idx) => {
    const pct = maxVal > 0 ? (f.value / maxVal * 100).toFixed(0) : 0;
    const rank = idx === 0 ? 'top-factor' : '';
    html += `<div class="factor-row ${rank}">
      <span class="factor-rank">#${idx+1}</span>
      <span class="factor-name">${f.label}</span>
      <div class="factor-bar-bg"><div class="factor-bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  });
  container.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════════
   MATH PANEL
   ═══════════════════════════════════════════════════════════════ */
function toggleMath() {
  state.ui.mathOpen = !state.ui.mathOpen;
  document.getElementById('math-content').classList.toggle('open', state.ui.mathOpen);
  document.getElementById('math-arrow').classList.toggle('open', state.ui.mathOpen);
  document.querySelector('.math-toggle').setAttribute('aria-expanded', state.ui.mathOpen);
}

function updateMath() {
  const { inputs, weights, activations, rawSums } = state;
  const sc = state.scenario;

  let inputsHTML = '<b>INPUT VALUES:</b>\n';
  for (let i = 0; i < 5; i++) {
    inputsHTML += `├─ ${sc.inputs[i].label}: <span class="highlight">${inputs[i].toFixed(2)}</span> (${(inputs[i]*100).toFixed(0)}%)\n`;
  }
  document.getElementById('math-inputs').innerHTML = inputsHTML;

  let hiddenHTML = '<b>HIDDEN LAYER (ReLU):</b>\n\n';
  for (let j = 0; j < 4; j++) {
    hiddenHTML += `<b>Neuron H${j+1}:</b>\n`;
    hiddenHTML += '  Sum = ';
    const parts = [];
    for (let i = 0; i < 5; i++) {
      const w = weights.ih[i][j];
      parts.push(`(${inputs[i].toFixed(2)} × <span class="${w>=0?'pos':'neg'}">${w.toFixed(2)}</span>)`);
    }
    hiddenHTML += parts.join(' + ') + ` + bias(${weights.biasH[j].toFixed(2)})\n`;
    hiddenHTML += `      = <span class="highlight">${rawSums.hidden[j].toFixed(3)}</span>\n`;
    hiddenHTML += `  ReLU = max(0, ${rawSums.hidden[j].toFixed(3)}) = <span class="highlight">${activations.hidden[j].toFixed(3)}</span>\n\n`;
  }
  document.getElementById('math-hidden').innerHTML = hiddenHTML;

  let outHTML = '<b>OUTPUT LAYER (Sigmoid):</b>\n\n';
  outHTML += '  Sum = ';
  const oParts = [];
  for (let j = 0; j < 4; j++) {
    const w = weights.ho[j];
    oParts.push(`(${activations.hidden[j].toFixed(3)} × <span class="${w>=0?'pos':'neg'}">${w.toFixed(2)}</span>)`);
  }
  outHTML += oParts.join(' + ') + ` + bias(${weights.biasO.toFixed(2)})\n`;
  outHTML += `      = <span class="highlight">${rawSums.output.toFixed(3)}</span>\n\n`;
  outHTML += `  Sigmoid = 1 / (1 + e<sup>−${rawSums.output.toFixed(3)}</sup>)\n`;
  outHTML += `          = 1 / (1 + ${Math.exp(-rawSums.output).toFixed(4)})\n`;
  outHTML += `          = <span class="highlight" style="font-size:14px">${activations.output.toFixed(4)}</span>  →  <b>${(activations.output*100).toFixed(1)}%</b>\n`;
  document.getElementById('math-output').innerHTML = outHTML;
}

/* ═══════════════════════════════════════════════════════════════
   WEIGHT HEATMAP
   ═══════════════════════════════════════════════════════════════ */
function buildHeatmap() {
  const container = document.getElementById('heatmap-container');
  container.innerHTML = '';

  // Input→Hidden
  const sec1 = document.createElement('div');
  sec1.className = 'heatmap-section';
  sec1.innerHTML = '<h4>Input → Hidden Weights</h4>';
  const grid1 = document.createElement('div');
  grid1.className = 'heatmap-grid';
  grid1.style.gridTemplateColumns = '70px repeat(4, 48px)';
  grid1.setAttribute('role', 'grid');
  grid1.setAttribute('aria-label', 'Input to Hidden layer weight matrix');

  grid1.appendChild(emptyDiv());
  for (let j = 0; j < 4; j++) {
    const h = document.createElement('div');
    h.className = 'heatmap-col-label';
    h.textContent = `H${j+1}`;
    h.setAttribute('role', 'columnheader');
    grid1.appendChild(h);
  }
  for (let i = 0; i < 5; i++) {
    const lbl = document.createElement('div');
    lbl.className = 'heatmap-label';
    lbl.id = `hm-label-${i}`;
    lbl.textContent = state.scenario.inputs[i].label;
    lbl.setAttribute('role', 'rowheader');
    grid1.appendChild(lbl);
    for (let j = 0; j < 4; j++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.id = `hm-ih-${i}-${j}`;
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('aria-label', `${state.scenario.inputs[i].label} to H${j+1}`);
      cell.addEventListener('click', () => openHeatmapEditor('ih', i, j));
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openHeatmapEditor('ih', i, j); }
      });
      cell.addEventListener('mouseenter', () => highlightConn('ih', i, j));
      cell.addEventListener('mouseleave', clearHighlight);
      grid1.appendChild(cell);
    }
  }
  sec1.appendChild(grid1);
  container.appendChild(sec1);

  // Hidden→Output
  const sec2 = document.createElement('div');
  sec2.className = 'heatmap-section';
  sec2.innerHTML = '<h4>Hidden → Output Weights</h4>';
  const grid2 = document.createElement('div');
  grid2.className = 'heatmap-grid';
  grid2.style.gridTemplateColumns = '70px 48px';
  grid2.setAttribute('role', 'grid');
  grid2.setAttribute('aria-label', 'Hidden to Output layer weight matrix');

  grid2.appendChild(emptyDiv());
  const oh = document.createElement('div');
  oh.className = 'heatmap-col-label';
  oh.textContent = 'Output';
  oh.setAttribute('role', 'columnheader');
  grid2.appendChild(oh);

  for (let j = 0; j < 4; j++) {
    const lbl = document.createElement('div');
    lbl.className = 'heatmap-label';
    lbl.textContent = `H${j+1}`;
    lbl.setAttribute('role', 'rowheader');
    grid2.appendChild(lbl);
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.id = `hm-ho-${j}`;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('aria-label', `H${j+1} to Output`);
    cell.addEventListener('click', () => openHeatmapEditor('ho', j, 0));
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openHeatmapEditor('ho', j, 0); }
    });
    cell.addEventListener('mouseenter', () => highlightConn('ho', j, 0));
    cell.addEventListener('mouseleave', clearHighlight);
    grid2.appendChild(cell);
  }
  sec2.appendChild(grid2);
  container.appendChild(sec2);

  // Biases
  const sec3 = document.createElement('div');
  sec3.className = 'heatmap-section';
  sec3.innerHTML = '<h4>Biases</h4>';
  const grid3 = document.createElement('div');
  grid3.className = 'heatmap-grid';
  grid3.style.gridTemplateColumns = '70px repeat(4, 48px)';
  grid3.setAttribute('role', 'grid');
  grid3.setAttribute('aria-label', 'Bias values for hidden neurons');
  grid3.appendChild(emptyDiv());
  for (let j = 0; j < 4; j++) {
    const h = document.createElement('div');
    h.className = 'heatmap-col-label';
    h.textContent = `H${j+1}`;
    h.setAttribute('role', 'columnheader');
    grid3.appendChild(h);
  }
  const blbl = document.createElement('div');
  blbl.className = 'heatmap-label';
  blbl.textContent = 'Hidden';
  blbl.setAttribute('role', 'rowheader');
  grid3.appendChild(blbl);
  for (let j = 0; j < 4; j++) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.id = `hm-bh-${j}`;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Hidden neuron ${j+1} bias`);
    grid3.appendChild(cell);
  }
  sec3.appendChild(grid3);
  container.appendChild(sec3);
}

function emptyDiv() {
  return document.createElement('div');
}

function updateHeatmap() {
  const { weights } = state;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = document.getElementById(`hm-ih-${i}-${j}`);
      if (cell) colorizeCell(cell, weights.ih[i][j]);
    }
  }
  for (let j = 0; j < 4; j++) {
    const cell = document.getElementById(`hm-ho-${j}`);
    if (cell) colorizeCell(cell, weights.ho[j]);
  }
  for (let j = 0; j < 4; j++) {
    const cell = document.getElementById(`hm-bh-${j}`);
    if (cell) colorizeCell(cell, weights.biasH[j]);
  }
}

function colorizeCell(cell, w) {
  cell.textContent = w.toFixed(2);
  cell.setAttribute('aria-label', `${cell.getAttribute('aria-label')?.split(':')[0] || 'Weight'}: ${w.toFixed(2)}`);
  const t = (w + 2) / 4;
  let r, g, b;
  if (t < 0.5) {
    const s = t / 0.5;
    r = Math.round(220 + (249 - 220) * s);
    g = Math.round(38 + (249 - 38) * s);
    b = Math.round(38 + (249 - 38) * s);
  } else {
    const s = (t - 0.5) / 0.5;
    r = Math.round(249 + (37 - 249) * s);
    g = Math.round(249 + (99 - 249) * s);
    b = Math.round(249 + (235 - 249) * s);
  }
  cell.style.background = `rgb(${r},${g},${b})`;
  cell.style.color = (t > 0.35 && t < 0.65) ? '#374151' : 'white';
  cell.style.textShadow = (t > 0.35 && t < 0.65) ? 'none' : '0 1px 2px rgba(0,0,0,.3)';
}

/* ═══════════════════════════════════════════════════════════════
   CONNECTION INTERACTIONS
   ═══════════════════════════════════════════════════════════════ */
function onConnHover(e) {
  const { layer, i, j } = e.target.dataset;
  let w;
  if (layer === 'ih') w = state.weights.ih[+i][+j];
  else w = state.weights.ho[+i];

  const tooltip = document.getElementById('weight-tooltip');
  const label = layer === 'ih'
    ? `${state.scenario.inputs[+i].label} → H${+j+1}: ${w.toFixed(3)}`
    : `H${+i+1} → Output: ${w.toFixed(3)}`;
  tooltip.textContent = label;
  tooltip.classList.add('visible');

  const rect = e.target.getBoundingClientRect();
  const panelRect = document.querySelector('.network-panel').getBoundingClientRect();
  tooltip.style.left = (rect.left + rect.right) / 2 - panelRect.left - 50 + 'px';
  tooltip.style.top = (rect.top + rect.bottom) / 2 - panelRect.top - 30 + 'px';

  highlightConn(layer, +i, +j);
}

function onConnLeave() {
  document.getElementById('weight-tooltip').classList.remove('visible');
  clearHighlight();
}

function highlightConn(layer, i, j) {
  connectionEls.forEach(c => {
    let match = false;
    if (layer === 'ih') {
      match = (c.layer === 'ih' && c.i === i && c.j === j) ||
              (c.layer === 'ho' && c.i === j);
    } else {
      match = (c.layer === 'ho' && c.i === i);
    }
    c.el.style.opacity = match ? '1' : '0.15';
  });
}

function clearHighlight() {
  connectionEls.forEach(c => c.el.style.opacity = '1');
}

function onConnClick(e) {
  if (!state.ui.editWeights) return;
  const { layer, i, j } = e.target.dataset;
  openWeightEditor(layer, +i, +j, e);
}

function openHeatmapEditor(layer, i, j) {
  if (!state.ui.editWeights) return;
  state.ui.editingWeight = { layer, i, j };
  const ed = document.getElementById('weight-editor');
  ed.classList.add('open');
  const w = layer === 'ih' ? state.weights.ih[i][j] : state.weights.ho[i];
  const title = layer === 'ih'
    ? `${state.scenario.inputs[i].label} → H${j+1}`
    : `H${i+1} → Output`;
  document.getElementById('we-title').textContent = title;
  document.getElementById('we-value').textContent = w.toFixed(3);
  document.getElementById('we-input').value = w.toFixed(2);
  ed.style.left = '50%';
  ed.style.top = '50%';
  ed.style.transform = 'translate(-50%, -50%)';
}

function openWeightEditor(layer, i, j, event) {
  state.ui.editingWeight = { layer, i, j };
  const ed = document.getElementById('weight-editor');
  ed.classList.add('open');
  const w = layer === 'ih' ? state.weights.ih[i][j] : state.weights.ho[i];
  const title = layer === 'ih'
    ? `${state.scenario.inputs[i].label} → H${j+1}`
    : `H${i+1} → Output`;
  document.getElementById('we-title').textContent = title;
  document.getElementById('we-value').textContent = w.toFixed(3);
  document.getElementById('we-input').value = w.toFixed(2);

  const rect = event.target.getBoundingClientRect();
  const panelRect = document.querySelector('.network-panel').getBoundingClientRect();
  ed.style.left = (rect.left + rect.right) / 2 - panelRect.left - 90 + 'px';
  ed.style.top = (rect.top + rect.bottom) / 2 - panelRect.top + 10 + 'px';
  ed.style.transform = 'none';
}

function closeWeightEditor() {
  document.getElementById('weight-editor').classList.remove('open');
  state.ui.editingWeight = null;
}

function adjustWeight(delta) {
  if (!state.ui.editingWeight) return;
  const { layer, i, j } = state.ui.editingWeight;
  let w = layer === 'ih' ? state.weights.ih[i][j] : state.weights.ho[i];
  w = Math.max(-2, Math.min(2, w + delta));
  if (layer === 'ih') state.weights.ih[i][j] = w;
  else state.weights.ho[i] = w;
  document.getElementById('we-value').textContent = w.toFixed(3);
  document.getElementById('we-input').value = w.toFixed(2);
  pushWeightHistory();
  updateViz();
}

function setWeight(val) {
  if (!state.ui.editingWeight) return;
  const num = parseFloat(val);
  if (isNaN(num)) return;
  const { layer, i, j } = state.ui.editingWeight;
  let w = Math.max(-2, Math.min(2, num));
  if (layer === 'ih') state.weights.ih[i][j] = w;
  else state.weights.ho[i] = w;
  document.getElementById('we-value').textContent = w.toFixed(3);
  pushWeightHistory();
  updateViz();
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLE ANIMATION SYSTEM
   ═══════════════════════════════════════════════════════════════ */
function initParticles() {
  state.particles = [];
  particlesG.innerHTML = '';
  connectionEls.forEach(c => {
    const p1 = c.layer === 'ih' ? neuronPos('input', c.i) : neuronPos('hidden', c.i);
    const p2 = c.layer === 'ih' ? neuronPos('hidden', c.j) : neuronPos('output', 0);
    const particle = {
      el: svgNS('circle', { r: 3, fill: '#58a6ff', opacity: 0 }),
      x1: p1.x + LAYOUT.neuronR, y1: p1.y,
      x2: p2.x - LAYOUT.neuronR, y2: p2.y,
      t: Math.random(),
      speed: 0.3 + Math.random() * 0.3,
      layer: c.layer, i: c.i, j: c.j,
    };
    particlesG.appendChild(particle.el);
    state.particles.push(particle);
  });
}

let lastTime = 0;
function animateParticles(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (!state.ui.paused) {
    state.particles.forEach(p => {
      let w, activation;
      if (p.layer === 'ih') {
        w = Math.abs(state.weights.ih[p.i][p.j]);
        activation = state.inputs[p.i];
      } else {
        w = Math.abs(state.weights.ho[p.i]);
        activation = state.activations.hidden[p.i];
      }

      const strength = w * activation;
      if (strength < 0.01) {
        p.el.setAttribute('opacity', 0);
        return;
      }

      p.t += dt * p.speed * state.ui.speed * (0.5 + strength);
      if (p.t > 1) p.t -= 1;

      const x = p.x1 + (p.x2 - p.x1) * p.t;
      const y = p.y1 + (p.y2 - p.y1) * p.t;
      p.el.setAttribute('cx', x);
      p.el.setAttribute('cy', y);

      const wVal = p.layer === 'ih' ? state.weights.ih[p.i][p.j] : state.weights.ho[p.i];
      p.el.setAttribute('fill', wVal >= 0 ? '#34D399' : '#F87171');
      p.el.setAttribute('opacity', Math.min(0.9, 0.2 + strength * 0.7));
      p.el.setAttribute('r', 2 + strength * 2);
    });
  }

  requestAnimationFrame(animateParticles);
}

/* ═══════════════════════════════════════════════════════════════
   UI BUILDERS
   ═══════════════════════════════════════════════════════════════ */
function buildSliders() {
  const container = document.getElementById('sliders-container');
  container.innerHTML = '';
  const sc = state.scenario;
  for (let i = 0; i < 5; i++) {
    const inp = sc.inputs[i];
    const div = document.createElement('div');
    div.className = 'slider-group';
    div.innerHTML = `
      <div class="slider-label">
        <span class="name">${inp.label}</span>
        <span class="value" id="sv-${i}">${(state.inputs[i]*100).toFixed(0)}%</span>
      </div>
      <div class="slider-desc">${inp.desc}</div>
      <input type="range" min="0" max="100" value="${(state.inputs[i]*100).toFixed(0)}"
             id="slider-${i}" oninput="onSlider(${i}, this.value)"
             aria-label="${inp.label}: ${inp.desc}"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="${(state.inputs[i]*100).toFixed(0)}">
    `;
    container.appendChild(div);
  }
  for (let i = 0; i < 5; i++) {
    const lbl = document.getElementById(`input-label-${i}`);
    if (lbl) {
      const text = sc.inputs[i].label;
      lbl.textContent = text.length > 14 ? text.slice(0, 13) + '\u2026' : text;
    }
  }
}

function buildDemoButtons() {
  const container = document.getElementById('demo-buttons');
  container.innerHTML = '';
  const sc = state.scenario;
  if (!sc.demos) return;
  sc.demos.forEach((d, idx) => {
    const btn = document.createElement('button');
    btn.className = 'demo-btn';
    btn.innerHTML = `<span class="demo-emoji">${d.emoji}</span>${d.name}`;
    btn.setAttribute('aria-label', `Run demo: ${d.name}`);
    btn.onclick = () => runDemo(idx);
    container.appendChild(btn);
  });
}

function buildScenarioBar() {
  const bar = document.getElementById('scenario-bar');
  bar.innerHTML = '<label>Scenario:</label>';
  const all = [...PRESETS, ...state.customScenarios];
  all.forEach(s => {
    const isCustom = s.id.startsWith('custom-');
    const wrapper = document.createElement('div');
    wrapper.className = 'scenario-btn-wrapper';

    const btn = document.createElement('button');
    btn.className = 'scenario-btn' + (state.scenario && state.scenario.id === s.id ? ' active' : '');
    btn.innerHTML = `<span class="s-emoji">${s.emoji}</span>${s.title}`;
    btn.setAttribute('aria-label', `Switch to scenario: ${s.title}`);
    btn.setAttribute('aria-pressed', state.scenario && state.scenario.id === s.id ? 'true' : 'false');
    btn.onclick = () => switchScenario(s.id);
    wrapper.appendChild(btn);

    if (isCustom) {
      const delBtn = document.createElement('button');
      delBtn.className = 'scenario-delete-btn';
      delBtn.innerHTML = '&times;';
      delBtn.title = `Delete "${s.title}"`;
      delBtn.setAttribute('aria-label', `Delete custom scenario: ${s.title}`);
      delBtn.onclick = (e) => { e.stopPropagation(); deleteCustomScenario(s.id); };
      wrapper.appendChild(delBtn);
    }
    bar.appendChild(wrapper);
  });

  const custom = document.createElement('button');
  custom.className = 'scenario-btn custom-scenario-btn';
  custom.textContent = '+ Custom';
  custom.setAttribute('aria-label', 'Create a custom scenario');
  custom.onclick = openCustomModal;
  bar.appendChild(custom);
}

/* ═══════════════════════════════════════════════════════════════
   SCENARIO MANAGEMENT
   ═══════════════════════════════════════════════════════════════ */
function switchScenario(id) {
  const all = [...PRESETS, ...state.customScenarios];
  const sc = all.find(s => s.id === id);
  if (!sc) return;
  state.scenario = sc;
  state.weights = deepClone(sc.weights);
  state.inputs = sc.inputs.map(inp => inp.default / 100);

  // Reset weight history for new scenario
  state.weightHistory = [deepClone(state.weights)];
  state.historyIndex = 0;

  document.getElementById('header-emoji').textContent = sc.emoji;
  document.getElementById('header-scenario-title').textContent = sc.title;

  buildSliders();
  buildDemoButtons();
  buildScenarioBar();
  buildHeatmap();
  updateViz();
  initParticles();
  updateUndoRedoButtons();

  localStorage.setItem('nn-current-scenario', id);
}

function loadCustomScenarios() {
  try {
    const data = localStorage.getItem('nn-custom-scenarios');
    if (data) state.customScenarios = JSON.parse(data);
  } catch (e) { state.customScenarios = []; }
}

function deleteCustomScenario(id) {
  const idx = state.customScenarios.findIndex(s => s.id === id);
  if (idx === -1) return;
  const name = state.customScenarios[idx].title;
  if (!confirm(`Delete custom scenario "${name}"?`)) return;
  state.customScenarios.splice(idx, 1);
  localStorage.setItem('nn-custom-scenarios', JSON.stringify(state.customScenarios));
  // If we deleted the active scenario, switch to first preset
  if (state.scenario && state.scenario.id === id) {
    switchScenario(PRESETS[0].id);
  } else {
    buildScenarioBar();
  }
}

/* ═══════════════════════════════════════════════════════════════
   INPUT HANDLERS
   ═══════════════════════════════════════════════════════════════ */
function onSlider(i, val) {
  state.inputs[i] = val / 100;
  document.getElementById(`sv-${i}`).textContent = `${val}%`;
  const slider = document.getElementById(`slider-${i}`);
  if (slider) slider.setAttribute('aria-valuenow', val);
  updateViz();
}

/* ═══════════════════════════════════════════════════════════════
   CONTROLS
   ═══════════════════════════════════════════════════════════════ */
function toggleEditWeights() {
  state.ui.editWeights = !state.ui.editWeights;
  const btn = document.getElementById('btn-edit-weights');
  btn.classList.toggle('edit-weights-active', state.ui.editWeights);
  btn.textContent = state.ui.editWeights ? 'Editing ON' : 'Edit Weights';
  document.body.classList.toggle('edit-mode', state.ui.editWeights);
  if (!state.ui.editWeights) closeWeightEditor();
}

function resetToProfile() {
  state.weights = deepClone(state.scenario.weights);
  pushWeightHistory();
  closeWeightEditor();
  updateViz();
}

function randomizeWeights() {
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 4; j++)
      state.weights.ih[i][j] = (Math.random() * 2 - 1);
  for (let j = 0; j < 4; j++)
    state.weights.ho[j] = (Math.random() * 2 - 1);
  for (let j = 0; j < 4; j++)
    state.weights.biasH[j] = (Math.random() * 0.4 - 0.2);
  state.weights.biasO = (Math.random() * 0.4 - 0.2);
  pushWeightHistory();
  closeWeightEditor();
  updateViz();
}

function resetInputs() {
  state.inputs = state.scenario.inputs.map(inp => inp.default / 100);
  buildSliders();
  updateViz();
}

function togglePause() {
  state.ui.paused = !state.ui.paused;
  const btn = document.getElementById('btn-pause');
  btn.classList.toggle('active', state.ui.paused);
  btn.textContent = state.ui.paused ? 'Resume Signals' : 'Pause Signals';
}

function setSpeed(val) {
  state.ui.speed = parseFloat(val);
}

/* ═══════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
   ═══════════════════════════════════════════════════════════════ */
function handleKeyboard(e) {
  // Don't trigger shortcuts when typing in inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key.toLowerCase()) {
    case 'e':
      e.preventDefault();
      toggleEditWeights();
      break;
    case 'r':
      e.preventDefault();
      resetInputs();
      break;
    case ' ':
      e.preventDefault();
      togglePause();
      break;
    case 'z':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.shiftKey) redoWeight();
        else undoWeight();
      }
      break;
    case 'y':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        redoWeight();
      }
      break;
    case 'escape':
      closeWeightEditor();
      closeCustomModal();
      break;
  }
}

/* ═══════════════════════════════════════════════════════════════
   DEMO SCENARIOS (Animated)
   ═══════════════════════════════════════════════════════════════ */
let demoAnimation = null;
function runDemo(idx) {
  const demo = state.scenario.demos[idx];
  if (!demo) return;
  if (demoAnimation) cancelAnimationFrame(demoAnimation);

  const startVals = [...state.inputs];
  const targetVals = demo.values.map(v => v / 100);
  const duration = 2000;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    for (let i = 0; i < 5; i++) {
      const val = startVals[i] + (targetVals[i] - startVals[i]) * ease;
      state.inputs[i] = val;
      const slider = document.getElementById(`slider-${i}`);
      if (slider) {
        slider.value = (val * 100).toFixed(0);
        slider.setAttribute('aria-valuenow', (val * 100).toFixed(0));
      }
      const sv = document.getElementById(`sv-${i}`);
      if (sv) sv.textContent = `${(val*100).toFixed(0)}%`;
    }
    updateViz();

    if (t < 1) demoAnimation = requestAnimationFrame(animate);
    else demoAnimation = null;
  }
  demoAnimation = requestAnimationFrame(animate);
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM SCENARIO MODAL
   ═══════════════════════════════════════════════════════════════ */
function openCustomModal() {
  document.getElementById('custom-modal').classList.add('open');
  const fields = document.getElementById('custom-inputs-fields');
  fields.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    fields.innerHTML += `
      <div class="input-pair">
        <input type="text" placeholder="Label ${i+1}" id="ci-label-${i}" aria-label="Input factor ${i+1} label">
        <input type="text" placeholder="Description" id="ci-desc-${i}" aria-label="Input factor ${i+1} description">
      </div>`;
  }
  // Clear previous values
  document.getElementById('custom-title').value = '';
  document.getElementById('custom-emoji').value = '';
  document.getElementById('custom-msg-high').value = '';
  document.getElementById('custom-msg-low').value = '';
}

function closeCustomModal() {
  document.getElementById('custom-modal').classList.remove('open');
}

function saveCustomScenario() {
  const title = document.getElementById('custom-title').value.trim();
  const emoji = document.getElementById('custom-emoji').value.trim() || '\uD83E\uDD14';
  if (!title) {
    document.getElementById('custom-title').focus();
    document.getElementById('custom-title').style.borderColor = '#EF4444';
    setTimeout(() => document.getElementById('custom-title').style.borderColor = '', 2000);
    return;
  }

  const inputs = [];
  for (let i = 0; i < 5; i++) {
    const label = document.getElementById(`ci-label-${i}`).value.trim() || `Factor ${i+1}`;
    const desc = document.getElementById(`ci-desc-${i}`).value.trim() || '';
    inputs.push({ label, desc, default: 50 });
  }

  const scenario = {
    id: 'custom-' + Date.now(),
    title, emoji, inputs,
    weights: {
      ih: Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => +(Math.random() * 1.6 - 0.3).toFixed(2))),
      ho: Array.from({ length: 4 }, () => +(Math.random() * 1.4 - 0.2).toFixed(2)),
      biasH: Array.from({ length: 4 }, () => +(Math.random() * 0.4 - 0.2).toFixed(2)),
      biasO: +(Math.random() * 0.4 - 0.2).toFixed(2),
    },
    messages: {
      high: document.getElementById('custom-msg-high').value.trim() || 'Go for it!',
      probHigh: 'Looking good. Lean towards yes.',
      mid: 'Could go either way.',
      probLow: 'Not feeling great about this one.',
      low: document.getElementById('custom-msg-low').value.trim() || 'Better not.',
    },
    demos: [],
  };

  state.customScenarios.push(scenario);
  localStorage.setItem('nn-custom-scenarios', JSON.stringify(state.customScenarios));
  closeCustomModal();
  switchScenario(scenario.id);
}

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════ */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ═══════════════════════════════════════════════════════════════
   INITIALIZATION
   ═══════════════════════════════════════════════════════════════ */
function init() {
  loadCustomScenarios();
  buildSVG();

  const lastId = localStorage.getItem('nn-current-scenario') || 'soccer';
  const all = [...PRESETS, ...state.customScenarios];
  const sc = all.find(s => s.id === lastId) || PRESETS[0];
  switchScenario(sc.id);

  // Start with math panel collapsed to fit on one page
  state.ui.mathOpen = false;
  document.getElementById('math-content').classList.remove('open');
  document.getElementById('math-arrow').classList.remove('open');

  // Register keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);

  requestAnimationFrame(animateParticles);
}

init();
