// ============================================================
// Main Application - Turing Patterns Explorer
// ============================================================

(function () {
  'use strict';

  var GRID = 256;
  var canvas = document.getElementById('simCanvas');

  function resizeCanvas() {
    var wrapper = canvas.parentElement;
    var maxW = wrapper.clientWidth - 48;
    var maxH = wrapper.clientHeight - 48;
    var size = Math.floor(Math.min(maxW, maxH));
    size = Math.max(size, 256);
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  Simulation.init(GRID);
  Renderer.init(canvas, GRID);
  UI.init();
  UI.bindCanvasInteraction(canvas, GRID);

  var lastTime = performance.now();
  var frameCount = 0;
  var fpsAccum = 0;
  var fpsDisplay = document.getElementById('fpsDisplay');

  function loop(now) {
    requestAnimationFrame(loop);

    frameCount++;
    fpsAccum += now - lastTime;
    lastTime = now;
    if (fpsAccum >= 1000) {
      fpsDisplay.textContent = frameCount + ' FPS';
      frameCount = 0;
      fpsAccum = 0;
    }

    if (UI.isRunning()) {
      var steps = Math.max(1, Math.round(UI.getSpeed() * 8));
      Simulation.step(steps);
    }

    Renderer.render(Simulation.getV());
  }

  requestAnimationFrame(loop);
})();
