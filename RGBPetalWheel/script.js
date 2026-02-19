'use strict';

// =====================================================
// COLOR MATH UTILITIES
// =====================================================

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function relativeLuminance(r, g, b) {
  const linearize = v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(hex1, hex2) {
  const [r1,g1,b1] = hexToRgb(hex1);
  const [r2,g2,b2] = hexToRgb(hex2);
  const L1 = relativeLuminance(r1,g1,b1);
  const L2 = relativeLuminance(r2,g2,b2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// =====================================================
// STATE
// =====================================================

let R = 255, G = 255, B = 255;
let explorerColor = '#ffffff';
let baseColor = '#ff2200';
let currentHarmony = 'complementary';
let palette = [];
let bobTime = 0;

// =====================================================
// CANVAS / SPOTLIGHT EXPLORER
// =====================================================

const canvas = document.getElementById('spotlightCanvas');
const ctx = canvas.getContext('2d');
const W = 800, H = 500;

// Triangular arrangement — converging toward center for best mixing
const CENTER = { x: 400, y: 245 };

// Figures placed exactly 120° apart on a radius-200 circle around CENTER.
// Green at 90° (bottom), Red at 210° (upper-left), Blue at 330° (upper-right).
const figures = [
  {
    x: Math.round(400 + 200 * Math.cos(210 * Math.PI / 180)),
    y: Math.round(245 + 200 * Math.sin(210 * Math.PI / 180)),
    color: [1, 0, 0], name: 'Red',
    get val() { return R; }
  },
  {
    x: Math.round(400 + 200 * Math.cos(90 * Math.PI / 180)),
    y: Math.round(245 + 200 * Math.sin(90 * Math.PI / 180)),
    color: [0, 1, 0], name: 'Green',
    get val() { return G; }
  },
  {
    x: Math.round(400 + 200 * Math.cos(330 * Math.PI / 180)),
    y: Math.round(245 + 200 * Math.sin(330 * Math.PI / 180)),
    color: [0, 0, 1], name: 'Blue',
    get val() { return B; }
  }
];

// Pre-allocate offscreen canvases (one per figure)
const offCanvases = figures.map(() => {
  const oc = document.createElement('canvas');
  oc.width = W; oc.height = H;
  return oc;
});

function drawStickFigure(oc, fig) {
  const [cr, cg, cb] = fig.color.map(c => Math.round(c * 255));
  const colorStr = `rgb(${cr},${cg},${cb})`;

  const dxN = CENTER.x - fig.x;
  const dyN = CENTER.y - fig.y;
  const dist = Math.sqrt(dxN * dxN + dyN * dyN);
  const ux = dxN / dist;
  const uy = dyN / dist;

  oc.save();
  oc.translate(fig.x, fig.y);

  oc.globalAlpha = 1;
  oc.strokeStyle = colorStr;
  oc.fillStyle = colorStr;
  oc.lineWidth = 5;
  oc.lineCap = 'round';
  oc.lineJoin = 'round';

  // Head — filled
  oc.beginPath();
  oc.arc(0, -78, 13, 0, Math.PI * 2);
  oc.fill();

  // Body
  oc.beginPath();
  oc.moveTo(0, -65);
  oc.lineTo(0, -25);
  oc.stroke();

  // Arms — angled toward center
  oc.beginPath();
  oc.moveTo(-6, -52);
  oc.lineTo(-6 + 24 * ux, -52 + 24 * uy);
  oc.stroke();
  oc.beginPath();
  oc.moveTo(6, -52);
  oc.lineTo(6 + 24 * ux, -52 + 24 * uy);
  oc.stroke();

  // Legs
  oc.beginPath();
  oc.moveTo(0, -25);
  oc.lineTo(-18, 10);
  oc.stroke();
  oc.beginPath();
  oc.moveTo(0, -25);
  oc.lineTo(18, 10);
  oc.stroke();

  oc.restore();
}

function drawBeam(oc, fig, intensity, t) {
  if (intensity === 0) return;

  const alpha = intensity / 255;
  const [cr, cg, cb] = fig.color.map(c => Math.round(c * 255));

  const handX = fig.x;
  const handY = fig.y - 52;

  const dx = CENTER.x - handX;
  const dy = CENTER.y - handY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist;
  const uy = dy / dist;

  const armLen = 20;
  const tipX = handX + ux * armLen;
  const tipY = handY + uy * armLen;

  const nx = -uy;
  const ny = ux;
  const halfW = 5;
  const beamLen = dist - armLen;

  const p1 = [tipX + nx * halfW, tipY + ny * halfW];
  const p2 = [tipX - nx * halfW, tipY - ny * halfW];
  const p3 = [CENTER.x - nx * halfW, CENTER.y - ny * halfW];
  const p4 = [CENTER.x + nx * halfW, CENTER.y + ny * halfW];

  oc.save();
  oc.globalCompositeOperation = 'screen';

  // Dim base beam so comets stand out
  const baseGrad = oc.createLinearGradient(tipX, tipY, CENTER.x, CENTER.y);
  baseGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${(alpha * 0.25).toFixed(3)})`);
  baseGrad.addColorStop(1, `rgba(${cr},${cg},${cb},${(alpha * 0.15).toFixed(3)})`);
  oc.beginPath();
  oc.moveTo(...p1); oc.lineTo(...p2); oc.lineTo(...p3); oc.lineTo(...p4);
  oc.closePath();
  oc.fillStyle = baseGrad;
  oc.fill();

  // Clip subsequent drawing to beam shape
  oc.beginPath();
  oc.moveTo(...p1); oc.lineTo(...p2); oc.lineTo(...p3); oc.lineTo(...p4);
  oc.closePath();
  oc.save();
  oc.clip();

  // --- Comet streaks ---
  const numComets = 3;
  const tailLen   = 55;   // px length of each comet tail
  const speed     = 140;  // px per second
  const period    = beamLen + tailLen;

  for (let i = 0; i < numComets; i++) {
    // headD: distance of the bright head from the tip (negative = not yet entered)
    const phase = (t * speed + (period / numComets) * i) % period;
    const headD = phase - tailLen;
    const tailD = headD - tailLen;

    // Smooth fade-in as comet enters, fade-out as tail exits
    const fadeIn  = Math.min(1, phase / 25);
    const fadeOut = Math.min(1, (period - phase) / 25);
    const cAlpha  = alpha * fadeIn * fadeOut;
    if (cAlpha <= 0.01) continue;

    const headX = tipX + ux * headD;
    const headY = tipY + uy * headD;
    const tailX = tipX + ux * tailD;
    const tailY = tipY + uy * tailD;

    // Tapered tail quad (thin at back, wide at head)
    const tailHW = halfW * 0.08;
    const headHW = halfW * 0.9;
    const tailGrad = oc.createLinearGradient(tailX, tailY, headX, headY);
    tailGrad.addColorStop(0,   `rgba(${cr},${cg},${cb},0)`);
    tailGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${(cAlpha * 0.55).toFixed(3)})`);
    tailGrad.addColorStop(1,   `rgba(255,255,255,${(cAlpha * 0.9).toFixed(3)})`);

    oc.beginPath();
    oc.moveTo(tailX + nx * tailHW, tailY + ny * tailHW);
    oc.lineTo(tailX - nx * tailHW, tailY - ny * tailHW);
    oc.lineTo(headX - nx * headHW, headY - ny * headHW);
    oc.lineTo(headX + nx * headHW, headY + ny * headHW);
    oc.closePath();
    oc.fillStyle = tailGrad;
    oc.fill();

    // Bright radial glow at head
    if (headD > -halfW && headD < beamLen + halfW) {
      const glow = oc.createRadialGradient(headX, headY, 0, headX, headY, halfW * 2.2);
      glow.addColorStop(0,   `rgba(255,255,255,${(cAlpha * 0.95).toFixed(3)})`);
      glow.addColorStop(0.35,`rgba(${cr},${cg},${cb},${(cAlpha * 0.6).toFixed(3)})`);
      glow.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
      oc.fillStyle = glow;
      oc.beginPath();
      oc.arc(headX, headY, halfW * 2.2, 0, Math.PI * 2);
      oc.fill();
    }
  }

  oc.restore(); // remove clip
  oc.restore();
}

function drawMixingZone(t) {
  const pulse = 0.92 + 0.08 * Math.sin(t * 2.5);
  const r = 44 * pulse;
  const cx = CENTER.x, cy = CENTER.y;

  const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3.2);
  outer.addColorStop(0, `rgba(${R},${G},${B},0.25)`);
  outer.addColorStop(1, `rgba(${R},${G},${B},0)`);
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 3.2, 0, Math.PI * 2);
  ctx.fill();

  const core = ctx.createRadialGradient(cx - 8, cy - 8, 0, cx, cy, r);
  const rB = Math.min(255, R + 70), gB = Math.min(255, G + 70), bB = Math.min(255, B + 70);
  core.addColorStop(0,   `rgba(${rB},${gB},${bB},0.95)`);
  core.addColorStop(0.5, `rgba(${R},${G},${B},0.75)`);
  core.addColorStop(1,   `rgba(${R},${G},${B},0)`);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawLabels(t) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.textAlign = 'center';
  ctx.font = 'bold 13px system-ui, sans-serif';

  figures.forEach((fig, i) => {
    const intensity = fig.val;
    const alpha = 0.25 + 0.75 * (intensity / 255);
    const [cr, cg, cb] = fig.color.map(c => Math.round(c * 255));

    ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
    ctx.fillText(`${fig.name}: ${intensity}`, fig.x, fig.y - 115);
  });
}

function render(timestamp) {
  bobTime = timestamp / 1000;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  // Pass 1: beams only, composited with screen blend
  figures.forEach((fig, i) => {
    const oc = offCanvases[i];
    const octx = oc.getContext('2d');

    octx.clearRect(0, 0, W, H);
    drawBeam(octx, fig, fig.val, bobTime);

    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(oc, 0, 0);
  });

  drawMixingZone(bobTime);

  // Pass 2: figures on top, composited normally so they sit in front of beams
  figures.forEach((fig, i) => {
    const oc = offCanvases[i];
    const octx = oc.getContext('2d');

    octx.clearRect(0, 0, W, H);
    drawStickFigure(octx, fig);

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(oc, 0, 0);
  });

  drawLabels(bobTime);

  const hex = rgbToHex(R, G, B);
  document.getElementById('mixedSwatch').style.background = hex;
  document.getElementById('mixedHex').textContent = hex;
  explorerColor = hex;

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

// =====================================================
// SLIDER CONTROLS
// =====================================================

// Set the colored track fill for a range slider by updating --fill-pct
function setSliderFill(slider, val) {
  slider.style.setProperty('--fill-pct', `${(val / 255 * 100).toFixed(1)}%`);
}

const sliderR = document.getElementById('sliderR');
const sliderG = document.getElementById('sliderG');
const sliderB = document.getElementById('sliderB');

// Init fills
setSliderFill(sliderR, R);
setSliderFill(sliderG, G);
setSliderFill(sliderB, B);

sliderR.addEventListener('input', e => {
  R = +e.target.value;
  setSliderFill(e.target, R);
  document.getElementById('valR').textContent = R;
});
sliderG.addEventListener('input', e => {
  G = +e.target.value;
  setSliderFill(e.target, G);
  document.getElementById('valG').textContent = G;
});
sliderB.addEventListener('input', e => {
  B = +e.target.value;
  setSliderFill(e.target, B);
  document.getElementById('valB').textContent = B;
});

document.getElementById('randomizeSpotlight').addEventListener('click', () => {
  R = Math.floor(Math.random() * 256);
  G = Math.floor(Math.random() * 256);
  B = Math.floor(Math.random() * 256);
  sliderR.value = R; sliderG.value = G; sliderB.value = B;
  setSliderFill(sliderR, R); setSliderFill(sliderG, G); setSliderFill(sliderB, B);
  document.getElementById('valR').textContent = R;
  document.getElementById('valG').textContent = G;
  document.getElementById('valB').textContent = B;
});

// =====================================================
// PALETTE GENERATOR
// =====================================================

function generatePalette(hex, harmony) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const vs = Math.max(0.55, s);
  const vl = Math.max(0.38, Math.min(0.62, l));

  const make = deg => {
    const hh = ((h + deg) % 360 + 360) % 360;
    const [nr, ng, nb] = hslToRgb(hh, vs, vl);
    return rgbToHex(nr, ng, nb);
  };

  const base = make(0);
  switch (harmony) {
    case 'complementary':
      return [base, make(180), make(30), make(210)];
    case 'analogous':
      return [base, make(30), make(60), make(-30), make(-60)];
    case 'triadic':
      return [base, make(120), make(240), make(60), make(180)];
    case 'split-complementary':
      return [base, make(150), make(210), make(30)];
    case 'tetradic':
      return [base, make(90), make(180), make(270), make(45), make(225)];
    default:
      return [base];
  }
}

function renderPalette() {
  palette = generatePalette(baseColor, currentHarmony);
  const container = document.getElementById('swatchContainer');
  container.innerHTML = '';

  palette.forEach((hex, i) => {
    const swatch = document.createElement('button');
    swatch.className = 'swatch';
    swatch.setAttribute('role', 'listitem');
    swatch.setAttribute('aria-label', `Color ${hex} — click to copy`);
    swatch.innerHTML = `
      <div class="swatch-color" style="background:${hex}">
        <div class="copy-icon" aria-hidden="true">&#128203;</div>
      </div>
      <div class="swatch-hex">${hex}</div>
    `;
    swatch.addEventListener('click', () => copyHex(hex));
    container.appendChild(swatch);
    requestAnimationFrame(() => {
      setTimeout(() => swatch.classList.add('visible'), i * 80);
    });
  });

  updateColorWheel();
  updateContrastSelects();
}

function updateColorWheel() {
  const markersG = document.getElementById('wheelMarkers');
  const NS = 'http://www.w3.org/2000/svg';
  markersG.innerHTML = '';

  palette.forEach((hex, i) => {
    const [r, g, b] = hexToRgb(hex);
    const [h, s] = rgbToHsl(r, g, b);
    const radius = 38 + 52 * Math.max(0.3, s);
    const angle = (h - 90) * Math.PI / 180;
    const mx = 100 + radius * Math.cos(angle);
    const my = 100 + radius * Math.sin(angle);

    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', mx);
    dot.setAttribute('cy', my);
    dot.setAttribute('r', i === 0 ? 9 : 6);
    dot.setAttribute('fill', hex);
    dot.setAttribute('stroke', '#fff');
    dot.setAttribute('stroke-width', i === 0 ? '2.5' : '1.5');
    markersG.appendChild(dot);
  });
}

// =====================================================
// COPY & TOAST
// =====================================================

function copyHex(hex) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(hex).catch(() => fallbackCopy(hex));
  } else {
    fallbackCopy(hex);
  }
  showToast(`Copied ${hex}`);
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1500);
}

// =====================================================
// COLOR INPUT SYNC
// =====================================================

document.getElementById('colorPicker').addEventListener('input', e => {
  baseColor = e.target.value;
  document.getElementById('hexInput').value = baseColor;
  renderPalette();
});

document.getElementById('hexInput').addEventListener('input', e => {
  const hex = e.target.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    baseColor = hex;
    document.getElementById('colorPicker').value = hex;
    renderPalette();
  }
});

document.getElementById('sendToPalette').addEventListener('click', () => {
  baseColor = explorerColor;
  document.getElementById('colorPicker').value = baseColor;
  document.getElementById('hexInput').value = baseColor;
  renderPalette();
  showToast('Color sent to palette!');
});

document.getElementById('copyPaletteColor').addEventListener('click', () => {
  copyHex(baseColor);
});

document.getElementById('randomize').addEventListener('click', () => {
  const h = Math.random() * 360;
  const [nr, ng, nb] = hslToRgb(h, 0.82, 0.52);
  baseColor = rgbToHex(nr, ng, nb);
  document.getElementById('colorPicker').value = baseColor;
  document.getElementById('hexInput').value = baseColor;
  renderPalette();
});

// Harmony buttons
document.querySelectorAll('.harmony-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.harmony-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentHarmony = btn.dataset.harmony;
    renderPalette();
  });
});

// =====================================================
// DARK MODE
// =====================================================

let isDark = true;
document.getElementById('darkToggle').addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  document.getElementById('darkToggle').textContent = isDark ? '\u2600\uFE0F Light Mode' : '\uD83C\uDF19 Dark Mode';
});

// =====================================================
// ACCESSIBILITY PANEL
// =====================================================

const accessToggle = document.getElementById('accessToggle');
accessToggle.addEventListener('click', () => {
  const content = document.getElementById('accessContent');
  const isOpen = content.classList.toggle('open');
  document.getElementById('accessArrow').textContent = isOpen ? '\u25B2' : '\u25BC';
  accessToggle.setAttribute('aria-expanded', isOpen);
});

function updateContrastSelects() {
  const s1 = document.getElementById('contrastC1');
  const s2 = document.getElementById('contrastC2');
  const opts = palette.map(hex => `<option value="${hex}">${hex}</option>`).join('');
  s1.innerHTML = opts;
  s2.innerHTML = opts;
  if (palette.length > 1) s2.selectedIndex = 1;
  checkContrast();
}

function checkContrast() {
  const c1 = document.getElementById('contrastC1').value;
  const c2 = document.getElementById('contrastC2').value;
  if (!c1 || !c2) return;
  const ratio = contrastRatio(c1, c2);
  const aa  = ratio >= 4.5;
  const aaa = ratio >= 7;
  document.getElementById('contrastResult').innerHTML = `
    <span class="contrast-ratio">${ratio.toFixed(2)}:1</span>
    <span class="badge ${aa  ? 'pass' : 'fail'}">AA ${aa  ? '&#10003;' : '&#10007;'}</span>
    <span class="badge ${aaa ? 'pass' : 'fail'}">AAA ${aaa ? '&#10003;' : '&#10007;'}</span>
  `;
}

document.getElementById('contrastC1').addEventListener('change', checkContrast);
document.getElementById('contrastC2').addEventListener('change', checkContrast);

// Color blindness simulation
document.querySelectorAll('.cb-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cb-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.cb;
    const container = document.getElementById('swatchContainer');
    container.style.filter = (mode === 'none') ? '' : `url(#${mode})`;
  });
});

// =====================================================
// INIT
// =====================================================

renderPalette();
