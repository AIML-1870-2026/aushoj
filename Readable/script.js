'use strict';

// ─── State ────────────────────────────────────────────────────────────────────

const state = {
  bg:     { r: 255, g: 255, b: 255 },
  text:   { r: 0,   g: 0,   b: 0   },
  size:   18,
  vision: 'normal'
};

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = {
  'high-contrast': { bg: [255, 255, 255], text: [0,   0,   0  ] },
  'low-contrast':  { bg: [180, 180, 180], text: [150, 150, 150] },
  'classic-blue':  { bg: [0,   70,  127], text: [255, 255, 255] },
  'fail-example':  { bg: [255, 255, 0  ], text: [255, 255, 255] },
  'dark-mode':     { bg: [30,  30,  30 ], text: [220, 220, 220] }
};

// ─── Vision Simulation Matrices ───────────────────────────────────────────────

const MATRICES = {
  protanopia:   {
    r: [0.567, 0.433, 0.000],
    g: [0.558, 0.442, 0.000],
    b: [0.000, 0.242, 0.758]
  },
  deuteranopia: {
    r: [0.625, 0.375, 0.000],
    g: [0.700, 0.300, 0.000],
    b: [0.000, 0.300, 0.700]
  },
  tritanopia: {
    r: [0.950, 0.050, 0.000],
    g: [0.000, 0.433, 0.567],
    b: [0.000, 0.475, 0.525]
  }
};

// ─── WCAG Helpers ─────────────────────────────────────────────────────────────

function toLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(r, g, b) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(l1, l2) {
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

// ─── Vision Simulation ────────────────────────────────────────────────────────

function simulateRGB(r, g, b, vision) {
  if (vision === 'normal') return [r, g, b];

  if (vision === 'monochromacy') {
    const v = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    return [v, v, v];
  }

  const m = MATRICES[vision];
  const clamp = v => Math.round(Math.min(255, Math.max(0, v)));
  return [
    clamp(m.r[0] * r + m.r[1] * g + m.r[2] * b),
    clamp(m.g[0] * r + m.g[1] * g + m.g[2] * b),
    clamp(m.b[0] * r + m.b[1] * g + m.b[2] * b)
  ];
}

// ─── Slider Track Gradient ────────────────────────────────────────────────────

// Makes the slider track display the actual color range for that channel,
// given the current values of the other two channels.
function updateTrack(slider, ch, color) {
  const { r, g, b } = color;
  const from = ch === 'r' ? `rgb(0,${g},${b})`   : ch === 'g' ? `rgb(${r},0,${b})`   : `rgb(${r},${g},0)`;
  const to   = ch === 'r' ? `rgb(255,${g},${b})` : ch === 'g' ? `rgb(${r},255,${b})` : `rgb(${r},${g},255)`;
  slider.style.background = `linear-gradient(to right, ${from}, ${to})`;
}

// ─── DOM References ───────────────────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

const DOM = {
  bgR:  { s: $('bg-r-s'),   n: $('bg-r-n')   },
  bgG:  { s: $('bg-g-s'),   n: $('bg-g-n')   },
  bgB:  { s: $('bg-b-s'),   n: $('bg-b-n')   },
  txR:  { s: $('text-r-s'), n: $('text-r-n') },
  txG:  { s: $('text-g-s'), n: $('text-g-n') },
  txB:  { s: $('text-b-s'), n: $('text-b-n') },
  sizeS:       $('size-s'),
  sizeN:       $('size-n'),
  sizeDisplay: $('size-display'),
  bgSwatch:    $('bg-swatch'),
  txSwatch:    $('text-swatch'),
  previewBox:  $('preview-box'),
  previewText: $('preview-text'),
  ratioValue:  $('ratio-value'),
  ratioFill:   $('ratio-fill'),
  bgLum:       $('bg-lum'),
  txLum:       $('text-lum'),
  bgLumDot:    $('bg-lum-dot'),
  txLumDot:    $('text-lum-dot'),
  badgeNormal:       $('badge-normal'),
  badgeLarge:        $('badge-large'),
  badgeNormalDetail: $('badge-normal-detail'),
  badgeLargeDetail:  $('badge-large-detail'),
  presets: $('presets'),
  simNote: $('sim-note')
};

// ─── Render ───────────────────────────────────────────────────────────────────

function render() {
  const { bg, text, size, vision } = state;
  const simBg   = simulateRGB(bg.r,   bg.g,   bg.b,   vision);
  const simText = simulateRGB(text.r, text.g, text.b, vision);

  // Swatches always show the actual (un-simulated) color
  DOM.bgSwatch.style.background = `rgb(${bg.r},${bg.g},${bg.b})`;
  DOM.txSwatch.style.background = `rgb(${text.r},${text.g},${text.b})`;

  // Luminosity dots show the simulated display color
  DOM.bgLumDot.style.background = `rgb(${simBg[0]},${simBg[1]},${simBg[2]})`;
  DOM.txLumDot.style.background = `rgb(${simText[0]},${simText[1]},${simText[2]})`;

  // Preview
  DOM.previewBox.style.backgroundColor  = `rgb(${simBg[0]},${simBg[1]},${simBg[2]})`;
  DOM.previewText.style.color           = `rgb(${simText[0]},${simText[1]},${simText[2]})`;
  DOM.previewText.style.fontSize        = `${size}px`;

  // WCAG calculations on simulated colors
  const bgL   = luminance(simBg[0],   simBg[1],   simBg[2]);
  const txL   = luminance(simText[0], simText[1], simText[2]);
  const ratio = contrastRatio(bgL, txL);

  DOM.ratioValue.textContent = `${ratio.toFixed(2)}:1`;
  DOM.bgLum.textContent = bgL.toFixed(3);
  DOM.txLum.textContent = txL.toFixed(3);

  // Ratio scale bar — normalize to 1:1 → 21:1 range
  const fillPct = Math.min(100, Math.max(0, (ratio / 21) * 100));
  DOM.ratioFill.style.width = `${fillPct}%`;

  // Color-code the fill by quality
  DOM.ratioFill.style.backgroundColor =
    ratio >= 7.0 ? '#22c55e' :
    ratio >= 4.5 ? '#86efac' :
    ratio >= 3.0 ? '#eab308' :
                   '#ef4444';

  // WCAG AA pass/fail
  const normalPass = ratio >= 4.5;
  const largePass  = ratio >= 3.0;

  // Header ratio badges (compact)
  DOM.badgeNormal.textContent = normalPass ? 'AA Normal ✓' : 'AA Normal ✗';
  DOM.badgeNormal.className   = `badge ${normalPass ? 'pass' : 'fail'}`;
  DOM.badgeLarge.textContent  = largePass  ? 'AA Large ✓'  : 'AA Large ✗';
  DOM.badgeLarge.className    = `badge ${largePass  ? 'pass' : 'fail'}`;

  // Detail cards
  DOM.badgeNormalDetail.textContent = normalPass ? '✓ Pass' : '✗ Fail';
  DOM.badgeNormalDetail.className   = `badge ${normalPass ? 'pass' : 'fail'}`;
  DOM.badgeLargeDetail.textContent  = largePass  ? '✓ Pass' : '✗ Fail';
  DOM.badgeLargeDetail.className    = `badge ${largePass  ? 'pass' : 'fail'}`;

  // Slider track gradients (always use actual colors)
  updateTrack(DOM.bgR.s, 'r', bg);
  updateTrack(DOM.bgG.s, 'g', bg);
  updateTrack(DOM.bgB.s, 'b', bg);
  updateTrack(DOM.txR.s, 'r', text);
  updateTrack(DOM.txG.s, 'g', text);
  updateTrack(DOM.txB.s, 'b', text);

  // Font size display
  DOM.sizeDisplay.textContent = `${size} px`;

  // Simulation mode
  const simActive = vision !== 'normal';
  DOM.simNote.classList.toggle('hidden', !simActive);

  // Disable color controls during simulation (they remain visible to show actual values)
  const colorInputs = [
    DOM.bgR.s, DOM.bgR.n, DOM.bgG.s, DOM.bgG.n, DOM.bgB.s, DOM.bgB.n,
    DOM.txR.s, DOM.txR.n, DOM.txG.s, DOM.txG.n, DOM.txB.s, DOM.txB.n
  ];
  colorInputs.forEach(el => { el.disabled = simActive; });
}

// ─── Bind Slider ↔ Number Input Pairs ────────────────────────────────────────

function bindColorPair(domKey, target, channel) {
  const { s: slider, n: num } = DOM[domKey];

  slider.addEventListener('input', () => {
    const v = parseInt(slider.value, 10);
    num.value = v;
    state[target][channel] = v;
    render();
  });

  num.addEventListener('input', () => {
    let v = parseInt(num.value, 10);
    if (isNaN(v)) return;
    v = Math.min(255, Math.max(0, v));
    num.value    = v;
    slider.value = v;
    state[target][channel] = v;
    render();
  });

  // Re-validate on blur (handle empty field, out-of-range, etc.)
  num.addEventListener('blur', () => {
    const v = parseInt(num.value, 10);
    if (isNaN(v) || num.value === '') {
      num.value    = state[target][channel];
      slider.value = state[target][channel];
    }
  });
}

// ─── Wire Up All Controls ─────────────────────────────────────────────────────

bindColorPair('bgR', 'bg',   'r');
bindColorPair('bgG', 'bg',   'g');
bindColorPair('bgB', 'bg',   'b');
bindColorPair('txR', 'text', 'r');
bindColorPair('txG', 'text', 'g');
bindColorPair('txB', 'text', 'b');

// Font size
DOM.sizeS.addEventListener('input', () => {
  state.size = parseInt(DOM.sizeS.value, 10);
  DOM.sizeN.value = state.size;
  render();
});

DOM.sizeN.addEventListener('input', () => {
  let v = parseInt(DOM.sizeN.value, 10);
  if (isNaN(v)) return;
  v = Math.min(72, Math.max(10, v));
  DOM.sizeN.value    = v;
  DOM.sizeS.value    = v;
  state.size         = v;
  render();
});

DOM.sizeN.addEventListener('blur', () => {
  const v = parseInt(DOM.sizeN.value, 10);
  if (isNaN(v) || DOM.sizeN.value === '') {
    DOM.sizeN.value = state.size;
    DOM.sizeS.value = state.size;
  }
});

// Vision simulation radios
document.querySelectorAll('input[name="vision"]').forEach(radio => {
  radio.addEventListener('change', () => {
    state.vision = radio.value;
    render();
  });
});

// Presets
DOM.presets.addEventListener('change', () => {
  const p = PRESETS[DOM.presets.value];
  if (!p) return;

  [state.bg.r,   state.bg.g,   state.bg.b]   = p.bg;
  [state.text.r, state.text.g, state.text.b] = p.text;

  DOM.bgR.s.value = DOM.bgR.n.value = p.bg[0];
  DOM.bgG.s.value = DOM.bgG.n.value = p.bg[1];
  DOM.bgB.s.value = DOM.bgB.n.value = p.bg[2];
  DOM.txR.s.value = DOM.txR.n.value = p.text[0];
  DOM.txG.s.value = DOM.txG.n.value = p.text[1];
  DOM.txB.s.value = DOM.txB.n.value = p.text[2];

  render();
});

// ─── Initial Render ───────────────────────────────────────────────────────────

render();
