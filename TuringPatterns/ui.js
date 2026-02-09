// ============================================================
// UI Controls & Event Handlers
// ============================================================

const UI = (function () {
  const PRESETS = [
    { name: 'Spots', f: 0.035, k: 0.060 },
    { name: 'Stripes', f: 0.035, k: 0.065 },
    { name: 'Spirals', f: 0.014, k: 0.054 },
    { name: 'Maze', f: 0.029, k: 0.057 },
    { name: 'Waves', f: 0.014, k: 0.045 },
    { name: 'Chaos', f: 0.026, k: 0.051 },
  ];

  let brushSize = 15;
  let brushStrength = 1.0;
  let brushChem = 'V';
  let speed = 1;
  let running = true;

  function init() {
    buildPresets();
    buildColorButtons();
    bindSliders();
    bindPlaybackControls();
    bindBrushControls();
    bindExport();
    buildParamMap();
    bindCanvasHint();
  }

  // --- Presets ---
  function buildPresets() {
    var grid = document.getElementById('presetGrid');
    PRESETS.forEach(function (p, i) {
      var btn = document.createElement('button');
      btn.className = 'preset-btn' + (i === 0 ? ' active' : '');
      // Wrap text in spans for z-index layering over ::after pseudo
      var nameSpan = document.createElement('span');
      nameSpan.textContent = p.name;
      var small = document.createElement('small');
      small.textContent = 'F:' + p.f.toFixed(3) + ' K:' + p.k.toFixed(3);
      btn.appendChild(nameSpan);
      btn.appendChild(small);

      btn.addEventListener('click', function () {
        Simulation.setFeed(p.f);
        Simulation.setKill(p.k);
        document.getElementById('feedSlider').value = p.f;
        document.getElementById('killSlider').value = p.k;
        document.getElementById('feedVal').textContent = p.f.toFixed(3);
        document.getElementById('killVal').textContent = p.k.toFixed(3);
        grid.querySelectorAll('.preset-btn').forEach(function (b, j) {
          b.classList.toggle('active', j === i);
        });
        drawParamMap();
      });
      grid.appendChild(btn);
    });
  }

  // --- Color Scheme Buttons ---
  function buildColorButtons() {
    var grid = document.getElementById('colorGrid');
    var schemes = Renderer.getSchemes();
    var currentKey = Renderer.getCurrentScheme();

    Object.keys(schemes).forEach(function (key) {
      var scheme = schemes[key];
      var btn = document.createElement('button');
      btn.className = 'color-btn' + (key === currentKey ? ' active' : '');

      var swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.background = scheme.gradient;
      btn.appendChild(swatch);
      btn.appendChild(document.createTextNode(scheme.name));

      btn.addEventListener('click', function () {
        Renderer.setColorScheme(key);
        grid.querySelectorAll('.color-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      });
      grid.appendChild(btn);
    });
  }

  // --- Sliders ---
  function bindSliders() {
    bindSlider('feedSlider', 'feedVal', function (v) { Simulation.setFeed(v); drawParamMap(); }, fmt3);
    bindSlider('killSlider', 'killVal', function (v) { Simulation.setKill(v); drawParamMap(); }, fmt3);
    bindSlider('duSlider', 'duVal', function (v) { Simulation.setDu(v); }, fmt3);
    bindSlider('dvSlider', 'dvVal', function (v) { Simulation.setDv(v); }, fmt3);
    bindSlider('speedSlider', 'speedVal', function (v) { speed = v; }, function (v) { return v.toFixed(1) + 'x'; });
    bindSlider('brushSizeSlider', 'brushSizeVal', function (v) { brushSize = v; }, function (v) { return Math.round(v).toString(); });
    bindSlider('brushStrSlider', 'brushStrVal', function (v) { brushStrength = v; }, fmt2);
  }

  function bindSlider(sliderId, valId, setter, formatter) {
    var slider = document.getElementById(sliderId);
    var valEl = document.getElementById(valId);
    slider.addEventListener('input', function () {
      var v = parseFloat(slider.value);
      setter(v);
      valEl.textContent = formatter(v);
      if (sliderId === 'feedSlider' || sliderId === 'killSlider') {
        document.querySelectorAll('.preset-btn').forEach(function (b) {
          b.classList.remove('active');
        });
      }
    });
  }

  function fmt3(v) { return v.toFixed(3); }
  function fmt2(v) { return v.toFixed(2); }

  // --- Playback Controls ---
  function bindPlaybackControls() {
    var playBtn = document.getElementById('playBtn');
    var playIcon = document.getElementById('playIcon');
    var pauseIcon = document.getElementById('pauseIcon');
    var statusPill = document.getElementById('statusPill');
    var statusDot = statusPill.querySelector('.status-dot');
    var statusText = statusPill.querySelector('.status-text');

    playBtn.addEventListener('click', function () {
      running = !running;
      playIcon.style.display = running ? 'none' : 'block';
      pauseIcon.style.display = running ? 'block' : 'none';
      playBtn.title = running ? 'Pause' : 'Play';

      statusDot.classList.toggle('running', running);
      statusText.textContent = running ? 'Running' : 'Paused';
    });

    document.getElementById('resetBtn').addEventListener('click', function () {
      Simulation.seed();
    });

    document.getElementById('clearBtn').addEventListener('click', function () {
      Simulation.clear();
    });
  }

  // --- Brush ---
  function bindBrushControls() {
    var toggle = document.getElementById('brushToggle');
    toggle.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        brushChem = btn.dataset.chem;
        toggle.querySelectorAll('button').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });
  }

  // --- Export ---
  function bindExport() {
    document.getElementById('saveBtn').addEventListener('click', function () {
      Renderer.exportImage(Simulation.getFeed(), Simulation.getKill());
    });

    document.getElementById('shareBtn').addEventListener('click', function () {
      var txt =
        'F: ' + Simulation.getFeed().toFixed(3) +
        ', K: ' + Simulation.getKill().toFixed(3) +
        ', Du: ' + Simulation.getDu().toFixed(3) +
        ', Dv: ' + Simulation.getDv().toFixed(3);
      navigator.clipboard.writeText(txt).then(function () {
        var btn = document.getElementById('shareBtn');
        var origHTML = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
        setTimeout(function () { btn.innerHTML = origHTML; }, 1500);
      });
    });
  }

  // --- Canvas Hint (auto-hide on first interaction) ---
  function bindCanvasHint() {
    var hint = document.getElementById('canvasHint');
    if (!hint) return;
    var hidden = false;
    document.getElementById('simCanvas').addEventListener('mousedown', function () {
      if (!hidden) {
        hint.classList.add('hidden');
        hidden = true;
      }
    });
  }

  // --- Parameter Space Map ---
  var pmCanvas, pmCtx;

  function buildParamMap() {
    pmCanvas = document.getElementById('paramMap');
    pmCtx = pmCanvas.getContext('2d');
    drawParamMap();

    pmCanvas.addEventListener('click', function (e) {
      var rect = pmCanvas.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var newF = Math.max(0, Math.min(0.1, px * 0.1));
      var newK = Math.max(0, Math.min(0.1, (1 - py) * 0.1));

      Simulation.setFeed(newF);
      Simulation.setKill(newK);

      document.getElementById('feedSlider').value = newF;
      document.getElementById('killSlider').value = newK;
      document.getElementById('feedVal').textContent = newF.toFixed(3);
      document.getElementById('killVal').textContent = newK.toFixed(3);

      document.querySelectorAll('.preset-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      drawParamMap();
    });
  }

  function drawParamMap() {
    var w = pmCanvas.width;
    var h = pmCanvas.height;
    var pmImageData = pmCtx.createImageData(w, h);
    var pd = pmImageData.data;

    for (var py = 0; py < h; py++) {
      for (var px = 0; px < w; px++) {
        var f = (px / w) * 0.1;
        var k = (1 - py / h) * 0.1;
        var pi = (py * w + px) * 4;

        var r = 12, g = 12, b = 18;

        var d1 = Math.sqrt(Math.pow(f - 0.035, 2) + Math.pow(k - 0.060, 2));
        var d2 = Math.sqrt(Math.pow(f - 0.035, 2) + Math.pow(k - 0.065, 2));
        var d3 = Math.sqrt(Math.pow(f - 0.014, 2) + Math.pow(k - 0.054, 2));
        var d4 = Math.sqrt(Math.pow(f - 0.029, 2) + Math.pow(k - 0.057, 2));
        var d5 = Math.sqrt(Math.pow(f - 0.014, 2) + Math.pow(k - 0.045, 2));
        var d6 = Math.sqrt(Math.pow(f - 0.026, 2) + Math.pow(k - 0.051, 2));

        var minD = Math.min(d1, d2, d3, d4, d5, d6);
        var intensity = Math.max(0, 1 - minD / 0.02);

        // Use indigo/violet palette matching the accent color
        if (minD === d1)      { r += intensity * 90;  g += intensity * 60;  b += intensity * 220; }
        else if (minD === d2) { r += intensity * 60;  g += intensity * 180; b += intensity * 140; }
        else if (minD === d3) { r += intensity * 200; g += intensity * 80;  b += intensity * 120; }
        else if (minD === d4) { r += intensity * 80;  g += intensity * 130; b += intensity * 220; }
        else if (minD === d5) { r += intensity * 60;  g += intensity * 120; b += intensity * 200; }
        else if (minD === d6) { r += intensity * 180; g += intensity * 90;  b += intensity * 100; }

        var bandDist = Math.abs(k - (0.06 + f * 0.5));
        var bandIntensity = Math.max(0, 1 - bandDist / 0.03) * 0.25;
        r += bandIntensity * 30;
        g += bandIntensity * 30;
        b += bandIntensity * 50;

        pd[pi]     = Math.min(255, r);
        pd[pi + 1] = Math.min(255, g);
        pd[pi + 2] = Math.min(255, b);
        pd[pi + 3] = 255;
      }
    }
    pmCtx.putImageData(pmImageData, 0, 0);

    // Preset labels
    pmCtx.font = '500 9px Inter, sans-serif';
    pmCtx.textAlign = 'center';
    PRESETS.forEach(function (p) {
      var px = (p.f / 0.1) * w;
      var py = (1 - p.k / 0.1) * h;
      pmCtx.fillStyle = 'rgba(255,255,255,0.9)';
      pmCtx.beginPath();
      pmCtx.arc(px, py, 3, 0, Math.PI * 2);
      pmCtx.fill();
      pmCtx.fillStyle = 'rgba(255,255,255,0.6)';
      pmCtx.fillText(p.name, px, py - 7);
    });

    // Current position
    var cpx = (Simulation.getFeed() / 0.1) * w;
    var cpy = (1 - Simulation.getKill() / 0.1) * h;
    pmCtx.strokeStyle = '#a5b4fc';
    pmCtx.lineWidth = 2;
    pmCtx.beginPath();
    pmCtx.arc(cpx, cpy, 7, 0, Math.PI * 2);
    pmCtx.stroke();
    pmCtx.fillStyle = '#6366f1';
    pmCtx.beginPath();
    pmCtx.arc(cpx, cpy, 3, 0, Math.PI * 2);
    pmCtx.fill();
  }

  // --- Mouse Interaction on Canvas ---
  function bindCanvasInteraction(canvasEl, gridSize) {
    var mouseDown = false;

    function paintAt(ex, ey) {
      var rect = canvasEl.getBoundingClientRect();
      var scaleX = gridSize / rect.width;
      var scaleY = gridSize / rect.height;
      var cx = Math.floor((ex - rect.left) * scaleX);
      var cy = Math.floor((ey - rect.top) * scaleY);
      var r = Math.round(brushSize * scaleX);
      Simulation.paint(cx, cy, r, brushChem, brushStrength);
    }

    canvasEl.addEventListener('mousedown', function (e) {
      mouseDown = true;
      paintAt(e.clientX, e.clientY);
    });
    canvasEl.addEventListener('mousemove', function (e) {
      if (mouseDown) paintAt(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', function () { mouseDown = false; });

    canvasEl.addEventListener('touchstart', function (e) {
      e.preventDefault();
      mouseDown = true;
      paintAt(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    canvasEl.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (mouseDown) paintAt(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    canvasEl.addEventListener('touchend', function () { mouseDown = false; });
  }

  function isRunning() { return running; }
  function getSpeed() { return speed; }

  return {
    init, bindCanvasInteraction,
    isRunning, getSpeed,
    PRESETS,
  };
})();
