// ── Color Palettes ────────────────────────────────────────────────
const PALETTES = {
    classic: {
        name: 'Classic',
        colors: [[10, 10, 40], [30, 50, 120], [80, 120, 200], [180, 200, 255], [255, 255, 255]],
        css: 'linear-gradient(90deg, #0a0a28, #1e3278, #5078c8, #b4c8ff, #fff)',
    },
    fire: {
        name: 'Fire',
        colors: [[20, 5, 0], [150, 30, 0], [230, 120, 0], [255, 220, 50], [255, 255, 200]],
        css: 'linear-gradient(90deg, #140500, #961e00, #e67800, #ffdc32, #ffffc8)',
    },
    ocean: {
        name: 'Ocean',
        colors: [[0, 10, 30], [0, 60, 100], [0, 150, 140], [80, 220, 200], [200, 255, 250]],
        css: 'linear-gradient(90deg, #000a1e, #003c64, #00968c, #50dcc8, #c8fffa)',
    },
    grayscale: {
        name: 'Gray',
        colors: [[0, 0, 0], [64, 64, 64], [128, 128, 128], [192, 192, 192], [255, 255, 255]],
        css: 'linear-gradient(90deg, #000, #404040, #808080, #c0c0c0, #fff)',
    },
    rainbow: {
        name: 'Rainbow',
        colors: [[255, 0, 0], [255, 200, 0], [0, 200, 50], [0, 100, 255], [180, 0, 255]],
        css: 'linear-gradient(90deg, red, #ffc800, #00c832, #0064ff, #b400ff)',
    },
    mono: {
        name: 'Mono',
        colors: [[0, 0, 0], [0, 40, 60], [0, 100, 150], [50, 180, 220], [200, 240, 255]],
        css: 'linear-gradient(90deg, #000, #00283c, #006496, #32b4dc, #c8f0ff)',
    },
};

// ── Presets ────────────────────────────────────────────────────────
const JULIA_PRESETS = [
    { name: 'Spiral', cr: -0.7, ci: 0.27 },
    { name: 'Dendrite', cr: 0.0, ci: 1.0 },
    { name: 'Dragon', cr: -0.8, ci: 0.156 },
    { name: 'Double Spiral', cr: -0.4, ci: 0.6 },
    { name: 'Siegel Disk', cr: -0.391, ci: -0.587 },
    { name: 'Rabbit', cr: -0.123, ci: 0.745 },
    { name: 'San Marco', cr: -0.75, ci: 0.0 },
    { name: 'Snowflake', cr: 0.285, ci: 0.01 },
];

const BURNING_SHIP_PRESETS = [
    { name: 'Classic Ship', cr: -1.75, ci: 0.0 },
    { name: 'Wings', cr: -1.62, ci: 0.0 },
    { name: 'Tail Feathers', cr: -1.76, ci: 0.08 },
    { name: 'Ghostly Ship', cr: -1.7, ci: 0.05 },
];

// ── State ─────────────────────────────────────────────────────────
const state = {
    fractalType: 'julia',
    palette: 'classic',
    maxIter: 256,
    cReal: -0.7,
    cImag: 0.27,
    juliaView: { xMin: -2, xMax: 2, yMin: -2, yMax: 2 },
    burningView: { xMin: -2.5, xMax: 1.5, yMin: -2, yMax: 1 },
    juliaC: { cr: -0.7, ci: 0.27 },
    burningC: { cr: -1.75, ci: 0.0 },
    activePreset: 0,
};

function getView() {
    return state.fractalType === 'julia' ? state.juliaView : state.burningView;
}
function getDefaultView() {
    return state.fractalType === 'julia'
        ? { xMin: -2, xMax: 2, yMin: -2, yMax: 2 }
        : { xMin: -2.5, xMax: 1.5, yMin: -2, yMax: 1 };
}
function getZoom() {
    const v = getView();
    const def = getDefaultView();
    return (def.xMax - def.xMin) / (v.xMax - v.xMin);
}

// ── DOM refs ──────────────────────────────────────────────────────
const canvas = document.getElementById('fractalCanvas');
const container = document.getElementById('canvasContainer');
const overlay = document.getElementById('canvasOverlay');
const zoomBadge = document.getElementById('zoomBadge');

const crSlider = document.getElementById('crSlider');
const ciSlider = document.getElementById('ciSlider');
const iterSlider = document.getElementById('iterSlider');
const crValueEl = document.getElementById('crValue');
const ciValueEl = document.getElementById('ciValue');
const iterValueEl = document.getElementById('iterValue');

// ── WebGL Setup ───────────────────────────────────────────────────
const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: false })
         || canvas.getContext('experimental-webgl');

if (!gl) {
    overlay.classList.add('visible');
    overlay.querySelector('span').textContent = 'WebGL not supported';
}

// -- Shaders --
const VERT_SRC = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
    v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5); // flip y for screen coords
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG_SRC = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_viewMin;   // (xMin, yMin)
uniform vec2 u_viewMax;   // (xMax, yMax)
uniform vec2 u_c;         // Julia constant
uniform int  u_maxIter;
uniform int  u_fractalType; // 0 = julia, 1 = burning ship
uniform vec3 u_palette[5];

vec3 mapColor(float smoothIter, float maxIter) {
    if (smoothIter >= maxIter) return vec3(0.0);
    float t = mod(smoothIter * 0.12, 4.0);
    int seg = int(floor(t));
    float frac = t - floor(t);
    vec3 c0, c1;
    // Manual palette indexing (WebGL1 doesn't support dynamic array indexing)
    if (seg == 0) { c0 = u_palette[0]; c1 = u_palette[1]; }
    else if (seg == 1) { c0 = u_palette[1]; c1 = u_palette[2]; }
    else if (seg == 2) { c0 = u_palette[2]; c1 = u_palette[3]; }
    else { c0 = u_palette[3]; c1 = u_palette[4]; }
    return mix(c0, c1, frac);
}

void main() {
    vec2 z = mix(u_viewMin, u_viewMax, v_uv);
    float cR = u_c.x;
    float cI = u_c.y;

    float iter = 0.0;
    float maxF = float(u_maxIter);
    float zr = z.x, zi = z.y;
    float zr2, zi2;

    if (u_fractalType == 1) {
        // Burning Ship
        for (int i = 0; i < 1000; i++) {
            if (i >= u_maxIter) break;
            float ar = abs(zr);
            float ai = abs(zi);
            zr2 = ar * ar;
            zi2 = ai * ai;
            if (zr2 + zi2 > 4.0) break;
            zi = 2.0 * ar * ai + cI;
            zr = zr2 - zi2 + cR;
            iter += 1.0;
        }
    } else {
        // Julia Set
        for (int i = 0; i < 1000; i++) {
            if (i >= u_maxIter) break;
            zr2 = zr * zr;
            zi2 = zi * zi;
            if (zr2 + zi2 > 4.0) break;
            zi = 2.0 * zr * zi + cI;
            zr = zr2 - zi2 + cR;
            iter += 1.0;
        }
    }

    // Smooth iteration count
    float smoothIter = iter;
    if (iter < maxF) {
        float modulus = sqrt(zr * zr + zi * zi);
        smoothIter = iter + 1.0 - log(log(modulus)) / log(2.0);
    }

    vec3 col = mapColor(smoothIter, maxF);
    gl_FragColor = vec4(col, 1.0);
}`;

function compileShader(src, type) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
    }
    return s;
}

const vert = compileShader(VERT_SRC, gl.VERTEX_SHADER);
const frag = compileShader(FRAG_SRC, gl.FRAGMENT_SHADER);
const program = gl.createProgram();
gl.attachShader(program, vert);
gl.attachShader(program, frag);
gl.linkProgram(program);
gl.useProgram(program);

// Fullscreen quad
const quadBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
const aPos = gl.getAttribLocation(program, 'a_pos');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

// Uniform locations
const loc = {
    viewMin:     gl.getUniformLocation(program, 'u_viewMin'),
    viewMax:     gl.getUniformLocation(program, 'u_viewMax'),
    c:           gl.getUniformLocation(program, 'u_c'),
    maxIter:     gl.getUniformLocation(program, 'u_maxIter'),
    fractalType: gl.getUniformLocation(program, 'u_fractalType'),
    palette:     gl.getUniformLocation(program, 'u_palette'),
};

// ── Rendering ─────────────────────────────────────────────────────
let renderTimer = null;
let renderRAF = null;

function requestRender(immediate) {
    if (renderTimer) clearTimeout(renderTimer);
    if (renderRAF) cancelAnimationFrame(renderRAF);
    if (immediate) {
        renderRAF = requestAnimationFrame(render);
    } else {
        renderTimer = setTimeout(() => {
            renderRAF = requestAnimationFrame(render);
        }, 16);
    }
}

function getAdjustedView() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    const view = getView();
    const viewW = view.xMax - view.xMin;
    const viewH = view.yMax - view.yMin;
    const canvasAspect = w / h;
    const viewAspect = viewW / viewH;

    let xMin = view.xMin, xMax = view.xMax, yMin = view.yMin, yMax = view.yMax;
    if (canvasAspect > viewAspect) {
        const newW = viewH * canvasAspect;
        const cx = (xMin + xMax) / 2;
        xMin = cx - newW / 2;
        xMax = cx + newW / 2;
    } else {
        const newH = viewW / canvasAspect;
        const cy = (yMin + yMax) / 2;
        yMin = cy - newH / 2;
        yMax = cy + newH / 2;
    }
    return { xMin, xMax, yMin, yMax };
}

function render() {
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);

    const av = getAdjustedView();

    // Set uniforms
    gl.uniform2f(loc.viewMin, av.xMin, av.yMin);
    gl.uniform2f(loc.viewMax, av.xMax, av.yMax);
    gl.uniform2f(loc.c, state.cReal, state.cImag);
    gl.uniform1i(loc.maxIter, state.maxIter);
    gl.uniform1i(loc.fractalType, state.fractalType === 'burningship' ? 1 : 0);

    // Palette as normalized floats
    const colors = PALETTES[state.palette].colors;
    const flat = [];
    for (const c of colors) { flat.push(c[0] / 255, c[1] / 255, c[2] / 255); }
    gl.uniform3fv(loc.palette, flat);

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    zoomBadge.textContent = `Zoom: ${getZoom().toFixed(1)}x`;
}

// ── Zoom / Pan ────────────────────────────────────────────────────
const MAX_ZOOM = 2048;

function zoomAt(cx, cy, factor) {
    const newZoom = getZoom() * factor;
    if (newZoom > MAX_ZOOM || newZoom < 0.5) return;
    const view = getView();
    const w = view.xMax - view.xMin;
    const h = view.yMax - view.yMin;
    const centerX = view.xMin + cx * w;
    const centerY = view.yMin + cy * h;
    const newW = w / factor;
    const newH = h / factor;
    view.xMin = centerX - newW / 2;
    view.xMax = centerX + newW / 2;
    view.yMin = centerY - newH / 2;
    view.yMax = centerY + newH / 2;
    requestRender(true);
}

function pan(dxRatio, dyRatio) {
    const view = getView();
    const w = view.xMax - view.xMin;
    const h = view.yMax - view.yMin;
    view.xMin -= dxRatio * w;
    view.xMax -= dxRatio * w;
    view.yMin -= dyRatio * h;
    view.yMax -= dyRatio * h;
    requestRender(true);
}

function resetView() {
    Object.assign(getView(), getDefaultView());
    requestRender(true);
}

// ── Canvas Interactions ───────────────────────────────────────────
let isDragging = false;
let dragStart = null;
let dragMoved = false;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragMoved = false;
    dragStart = { x: e.clientX, y: e.clientY };
    container.classList.add('dragging');
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
    pan(dx / container.clientWidth, dy / container.clientHeight);
    dragStart = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('dragging');
    if (!dragMoved) {
        const rect = canvas.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width;
        const cy = (e.clientY - rect.top) / rect.height;
        zoomAt(cx, cy, e.shiftKey ? 0.5 : 2);
    }
});

// Touch support
let lastTouchDist = null;
let lastTouchCenter = null;

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        dragMoved = false;
        dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        lastTouchDist = Math.hypot(dx, dy);
        lastTouchCenter = {
            x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
            y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
    }
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - dragStart.x;
        const dy = e.touches[0].clientY - dragStart.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
        pan(dx / container.clientWidth, dy / container.clientHeight);
        dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && lastTouchDist) {
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        const dist = Math.hypot(dx, dy);
        const rect = canvas.getBoundingClientRect();
        const cx = (lastTouchCenter.x - rect.left) / rect.width;
        const cy = (lastTouchCenter.y - rect.top) / rect.height;
        zoomAt(cx, cy, dist / lastTouchDist);
        lastTouchDist = dist;
        lastTouchCenter = {
            x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
            y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
    }
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
        if (isDragging && !dragMoved) {
            const rect = canvas.getBoundingClientRect();
            zoomAt(
                (dragStart.x - rect.left) / rect.width,
                (dragStart.y - rect.top) / rect.height,
                2,
            );
        }
        isDragging = false;
        lastTouchDist = null;
    }
});

// ── Keyboard shortcuts ────────────────────────────────────────────
window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    switch (e.key) {
        case ' ':  e.preventDefault(); resetView(); break;
        case '+': case '=': zoomAt(0.5, 0.5, 2); break;
        case '-': zoomAt(0.5, 0.5, 0.5); break;
        case 'ArrowUp':    e.preventDefault(); pan(0, 0.1); break;
        case 'ArrowDown':  e.preventDefault(); pan(0, -0.1); break;
        case 'ArrowLeft':  e.preventDefault(); pan(0.1, 0); break;
        case 'ArrowRight': e.preventDefault(); pan(-0.1, 0); break;
    }
});

// ── Slider Controls ───────────────────────────────────────────────
function updateSliderDisplay() {
    crValueEl.textContent = state.cReal.toFixed(3);
    ciValueEl.textContent = state.cImag.toFixed(3);
    iterValueEl.textContent = state.maxIter;
    crSlider.value = state.cReal;
    ciSlider.value = state.cImag;
    iterSlider.value = state.maxIter;
}

crSlider.addEventListener('input', () => {
    state.cReal = parseFloat(crSlider.value);
    crValueEl.textContent = state.cReal.toFixed(3);
    saveCForMode();
    requestRender(true);
});

ciSlider.addEventListener('input', () => {
    state.cImag = parseFloat(ciSlider.value);
    ciValueEl.textContent = state.cImag.toFixed(3);
    saveCForMode();
    requestRender(true);
});

iterSlider.addEventListener('input', () => {
    state.maxIter = parseInt(iterSlider.value);
    iterValueEl.textContent = state.maxIter;
    requestRender(true);
});

function saveCForMode() {
    if (state.fractalType === 'julia') {
        state.juliaC = { cr: state.cReal, ci: state.cImag };
    } else {
        state.burningC = { cr: state.cReal, ci: state.cImag };
    }
}

// ── Tabs ──────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach((tc) => tc.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
});

// ── Zoom Buttons ──────────────────────────────────────────────────
document.getElementById('zoomInBtn').addEventListener('click', () => zoomAt(0.5, 0.5, 2));
document.getElementById('zoomOutBtn').addEventListener('click', () => zoomAt(0.5, 0.5, 0.5));
document.getElementById('resetBtn').addEventListener('click', resetView);

// ── Fractal Type Toggle ───────────────────────────────────────────
document.querySelectorAll('.type-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        if (btn.dataset.type === state.fractalType) return;
        document.querySelectorAll('.type-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.fractalType = btn.dataset.type;

        const saved = state.fractalType === 'julia' ? state.juliaC : state.burningC;
        state.cReal = saved.cr;
        state.cImag = saved.ci;
        updateSliderDisplay();

        if (state.fractalType === 'burningship' && state.palette === 'classic') {
            selectPalette('fire');
        } else if (state.fractalType === 'julia' && state.palette === 'fire') {
            selectPalette('classic');
        }

        buildPresets();
        state.activePreset = 0;
        highlightPreset();
        requestRender(true);
    });
});

// ── Color Palettes UI ─────────────────────────────────────────────
function buildPalettes() {
    const grid = document.getElementById('paletteGrid');
    grid.innerHTML = '';
    for (const [key, pal] of Object.entries(PALETTES)) {
        const swatch = document.createElement('div');
        swatch.className = 'palette-swatch' + (key === state.palette ? ' active' : '');
        swatch.style.background = pal.css;
        swatch.dataset.name = pal.name;
        swatch.title = pal.name;
        swatch.addEventListener('click', () => selectPalette(key));
        grid.appendChild(swatch);
    }
}

function selectPalette(key) {
    state.palette = key;
    document.querySelectorAll('.palette-swatch').forEach((s, i) => {
        s.classList.toggle('active', Object.keys(PALETTES)[i] === key);
    });
    requestRender(true);
    buildPresets();
    highlightPreset();
}

// ── Preset Thumbnails (CPU — tiny 80x80, not worth GPU context) ──
function renderThumbnail(cvs, cr, ci, fractalType) {
    const size = 80;
    cvs.width = size;
    cvs.height = size;
    const tCtx = cvs.getContext('2d');
    const imgData = tCtx.createImageData(size, size);
    const palette = PALETTES[state.palette].colors;

    const view = fractalType === 'julia'
        ? { xMin: -2, xMax: 2, yMin: -2, yMax: 2 }
        : { xMin: -2.5, xMax: 1.5, yMin: -2, yMax: 1 };
    const xScale = (view.xMax - view.xMin) / size;
    const yScale = (view.yMax - view.yMin) / size;
    const maxIter = 80;

    for (let py = 0; py < size; py++) {
        for (let px = 0; px < size; px++) {
            let zReal = view.xMin + px * xScale;
            let zImag = view.yMin + py * yScale;
            let iter = 0;
            let zr2, zi2;

            if (fractalType === 'burningship') {
                while (iter < maxIter) {
                    const ar = Math.abs(zReal);
                    const ai = Math.abs(zImag);
                    zr2 = ar * ar;
                    zi2 = ai * ai;
                    if (zr2 + zi2 > 4) break;
                    zImag = 2 * ar * ai + ci;
                    zReal = zr2 - zi2 + cr;
                    iter++;
                }
            } else {
                while (iter < maxIter) {
                    zr2 = zReal * zReal;
                    zi2 = zImag * zImag;
                    if (zr2 + zi2 > 4) break;
                    zImag = 2 * zReal * zImag + ci;
                    zReal = zr2 - zi2 + cr;
                    iter++;
                }
            }

            const idx = (py * size + px) * 4;
            if (iter >= maxIter) {
                imgData.data[idx] = imgData.data[idx + 1] = imgData.data[idx + 2] = 0;
            } else {
                const t = (iter * 0.12) % (palette.length - 1);
                const seg = Math.floor(t);
                const frac = t - seg;
                const c0 = palette[Math.min(seg, palette.length - 1)];
                const c1 = palette[Math.min(seg + 1, palette.length - 1)];
                imgData.data[idx] = c0[0] + (c1[0] - c0[0]) * frac;
                imgData.data[idx + 1] = c0[1] + (c1[1] - c0[1]) * frac;
                imgData.data[idx + 2] = c0[2] + (c1[2] - c0[2]) * frac;
            }
            imgData.data[idx + 3] = 255;
        }
    }
    tCtx.putImageData(imgData, 0, 0);
}

function buildPresets() {
    const grid = document.getElementById('presetGrid');
    grid.innerHTML = '';
    const presets = state.fractalType === 'julia' ? JULIA_PRESETS : BURNING_SHIP_PRESETS;

    presets.forEach((preset, i) => {
        const card = document.createElement('div');
        card.className = 'preset-card';
        card.dataset.index = i;

        const thumb = document.createElement('canvas');
        renderThumbnail(thumb, preset.cr, preset.ci, state.fractalType);

        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = preset.name;

        const cVal = document.createElement('div');
        cVal.className = 'c-val';
        cVal.textContent = `c = ${preset.cr} + ${preset.ci}i`;

        card.appendChild(thumb);
        card.appendChild(name);
        card.appendChild(cVal);

        card.addEventListener('click', () => {
            state.cReal = preset.cr;
            state.cImag = preset.ci;
            saveCForMode();
            state.activePreset = i;
            updateSliderDisplay();
            resetView();
            highlightPreset();
        });

        grid.appendChild(card);
    });
}

function highlightPreset() {
    document.querySelectorAll('.preset-card').forEach((card, i) => {
        card.classList.toggle('active', i === state.activePreset);
    });
}

// ── Help Modal ────────────────────────────────────────────────────
const helpModal = document.getElementById('helpModal');
document.getElementById('helpBtn').addEventListener('click', () => helpModal.classList.add('visible'));
document.getElementById('helpClose').addEventListener('click', () => helpModal.classList.remove('visible'));
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.classList.remove('visible');
});

// ── Menu Toggle ───────────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const controlsPanel = document.getElementById('controls');

menuToggle.addEventListener('click', () => {
    const isOpen = !controlsPanel.classList.contains('collapsed');
    controlsPanel.classList.toggle('collapsed', isOpen);
    menuToggle.classList.toggle('open', !isOpen);
    // Re-render after transition since canvas size changes
    setTimeout(() => requestRender(true), 400);
});

// ── Resize ────────────────────────────────────────────────────────
window.addEventListener('resize', () => requestRender(true));

// ── Init ──────────────────────────────────────────────────────────
buildPalettes();
buildPresets();
highlightPreset();
updateSliderDisplay();
requestRender(true);
