// ============================================================
// Gray-Scott Reaction-Diffusion Simulation Engine
// ============================================================

const Simulation = (function () {
  let GRID = 256;
  let uCurr, vCurr, uNext, vNext;

  // Default parameters
  let feedRate = 0.035;
  let killRate = 0.060;
  let du = 0.16;
  let dv = 0.08;

  function init(gridSize) {
    if (gridSize) GRID = gridSize;

    uCurr = new Float32Array(GRID * GRID);
    vCurr = new Float32Array(GRID * GRID);
    uNext = new Float32Array(GRID * GRID);
    vNext = new Float32Array(GRID * GRID);

    seed();
  }

  // Fill U=1, V=0 everywhere, then seed random patches of V
  function seed() {
    uCurr.fill(1.0);
    vCurr.fill(0.0);

    const numSeeds = 15 + Math.floor(Math.random() * 10);
    for (let s = 0; s < numSeeds; s++) {
      const cx = Math.floor(Math.random() * GRID);
      const cy = Math.floor(Math.random() * GRID);
      const r = 3 + Math.floor(Math.random() * 6);
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy <= r * r) {
            const x = (cx + dx + GRID) % GRID;
            const y = (cy + dy + GRID) % GRID;
            const idx = y * GRID + x;
            uCurr[idx] = 0.5;
            vCurr[idx] = 0.25 + Math.random() * 0.1;
          }
        }
      }
    }
  }

  function clear() {
    uCurr.fill(1.0);
    vCurr.fill(0.0);
  }

  // Run one or more simulation steps using the Gray-Scott model
  // Laplacian kernel:
  //   [0.05, 0.20, 0.05]
  //   [0.20, -1.0, 0.20]
  //   [0.05, 0.20, 0.05]
  // Boundary: toroidal (wrapped edges)
  function step(count) {
    const F = feedRate;
    const K = killRate;
    const Du = du;
    const Dv = dv;
    const N = GRID;

    for (let s = 0; s < count; s++) {
      for (let y = 0; y < N; y++) {
        const yUp = ((y - 1) + N) % N;
        const yDn = (y + 1) % N;

        for (let x = 0; x < N; x++) {
          const xLt = ((x - 1) + N) % N;
          const xRt = (x + 1) % N;
          const i = y * N + x;

          const u = uCurr[i];
          const v = vCurr[i];

          // Laplacian of U
          const lapU =
            0.05 * uCurr[yUp * N + xLt] +
            0.20 * uCurr[yUp * N + x] +
            0.05 * uCurr[yUp * N + xRt] +
            0.20 * uCurr[y * N + xLt] +
            -1.0 * u +
            0.20 * uCurr[y * N + xRt] +
            0.05 * uCurr[yDn * N + xLt] +
            0.20 * uCurr[yDn * N + x] +
            0.05 * uCurr[yDn * N + xRt];

          // Laplacian of V
          const lapV =
            0.05 * vCurr[yUp * N + xLt] +
            0.20 * vCurr[yUp * N + x] +
            0.05 * vCurr[yUp * N + xRt] +
            0.20 * vCurr[y * N + xLt] +
            -1.0 * v +
            0.20 * vCurr[y * N + xRt] +
            0.05 * vCurr[yDn * N + xLt] +
            0.20 * vCurr[yDn * N + x] +
            0.05 * vCurr[yDn * N + xRt];

          const uvv = u * v * v;
          let uNew = u + Du * lapU - uvv + F * (1.0 - u);
          let vNew = v + Dv * lapV + uvv - (F + K) * v;

          // Clamp to [0, 1]
          if (uNew < 0) uNew = 0; else if (uNew > 1) uNew = 1;
          if (vNew < 0) vNew = 0; else if (vNew > 1) vNew = 1;

          uNext[i] = uNew;
          vNext[i] = vNew;
        }
      }

      // Swap buffers
      const tmpU = uCurr; uCurr = uNext; uNext = tmpU;
      const tmpV = vCurr; vCurr = vNext; vNext = tmpV;
    }
  }

  // Paint chemicals at a grid position (for mouse interaction)
  function paint(cx, cy, radius, chemical, strength) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= radius * radius) {
          const x = (cx + dx + GRID) % GRID;
          const y = (cy + dy + GRID) % GRID;
          const idx = y * GRID + x;
          if (chemical === 'V') {
            vCurr[idx] = Math.min(1, vCurr[idx] + strength * 0.5);
            uCurr[idx] = Math.max(0, uCurr[idx] - strength * 0.25);
          } else {
            uCurr[idx] = Math.min(1, uCurr[idx] + strength * 0.5);
            vCurr[idx] = Math.max(0, vCurr[idx] - strength * 0.25);
          }
        }
      }
    }
  }

  // --- Getters / Setters ---
  function getV() { return vCurr; }
  function getGridSize() { return GRID; }
  function setFeed(f) { feedRate = f; }
  function setKill(k) { killRate = k; }
  function setDu(val) { du = val; }
  function setDv(val) { dv = val; }
  function getFeed() { return feedRate; }
  function getKill() { return killRate; }
  function getDu() { return du; }
  function getDv() { return dv; }

  return {
    init, seed, clear, step, paint,
    getV, getGridSize,
    setFeed, setKill, setDu, setDv,
    getFeed, getKill, getDu, getDv,
  };
})();
