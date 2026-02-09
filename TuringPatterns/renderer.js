// ============================================================
// Canvas Renderer & Color Mapping
// ============================================================

const Renderer = (function () {
  // --- Color Scheme Definitions ---
  const COLOR_SCHEMES = {
    heatmap: {
      name: 'Heat Map',
      gradient: 'linear-gradient(90deg, #000033, #0000FF, #00FF00, #FFFF00, #FF0000)',
      stops: [
        [0.00, 0, 0, 51],
        [0.25, 0, 0, 255],
        [0.50, 0, 255, 0],
        [0.75, 255, 255, 0],
        [1.00, 255, 0, 0],
      ],
    },
    grayscale: {
      name: 'Grayscale',
      gradient: 'linear-gradient(90deg, #000, #fff)',
      stops: [
        [0.0, 0, 0, 0],
        [1.0, 255, 255, 255],
      ],
    },
    ocean: {
      name: 'Ocean',
      gradient: 'linear-gradient(90deg, #001f3f, #39CCCC, #fff)',
      stops: [
        [0.0, 0, 31, 63],
        [0.5, 57, 204, 204],
        [1.0, 255, 255, 255],
      ],
    },
    magma: {
      name: 'Magma',
      gradient: 'linear-gradient(90deg, #000, #4B0082, #FF6347, #FFFF00)',
      stops: [
        [0.00, 0, 0, 0],
        [0.33, 75, 0, 130],
        [0.66, 255, 99, 71],
        [1.00, 255, 255, 0],
      ],
    },
    mint: {
      name: 'Mint',
      gradient: 'linear-gradient(90deg, #0D4D4D, #7FFF7F, #FFFFCC)',
      stops: [
        [0.0, 13, 77, 77],
        [0.5, 127, 255, 127],
        [1.0, 255, 255, 204],
      ],
    },
  };

  let currentScheme = 'heatmap';
  let colorLUT = new Uint8Array(256 * 3);
  let canvas, ctx, imageData, pixels;
  let gridSize;

  function init(canvasEl, grid) {
    canvas = canvasEl;
    gridSize = grid;
    canvas.width = gridSize;
    canvas.height = gridSize;
    ctx = canvas.getContext('2d');
    imageData = ctx.createImageData(gridSize, gridSize);
    pixels = imageData.data;
    buildLUT();
  }

  // Build a 256-entry color lookup table from the current scheme
  function buildLUT() {
    const stops = COLOR_SCHEMES[currentScheme].stops;
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      let lo = 0;
      let hi = stops.length - 1;
      for (let s = 0; s < stops.length - 1; s++) {
        if (t >= stops[s][0] && t <= stops[s + 1][0]) {
          lo = s;
          hi = s + 1;
          break;
        }
      }
      const range = stops[hi][0] - stops[lo][0];
      const f = range === 0 ? 0 : (t - stops[lo][0]) / range;
      colorLUT[i * 3 + 0] = Math.round(stops[lo][1] + f * (stops[hi][1] - stops[lo][1]));
      colorLUT[i * 3 + 1] = Math.round(stops[lo][2] + f * (stops[hi][2] - stops[lo][2]));
      colorLUT[i * 3 + 2] = Math.round(stops[lo][3] + f * (stops[hi][3] - stops[lo][3]));
    }
  }

  function setColorScheme(key) {
    if (COLOR_SCHEMES[key]) {
      currentScheme = key;
      buildLUT();
    }
  }

  // Render V-grid concentration data to the canvas
  function render(vGrid) {
    const total = gridSize * gridSize;
    for (let i = 0; i < total; i++) {
      const ci = Math.min(255, Math.max(0, (vGrid[i] * 255) | 0));
      const pi = i * 4;
      pixels[pi] = colorLUT[ci * 3];
      pixels[pi + 1] = colorLUT[ci * 3 + 1];
      pixels[pi + 2] = colorLUT[ci * 3 + 2];
      pixels[pi + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Export the current canvas frame as a downloadable PNG
  function exportImage(feedRate, killRate) {
    const link = document.createElement('a');
    const ts = Date.now();
    link.download =
      'turing-pattern-F' + feedRate.toFixed(3) + '-K' + killRate.toFixed(3) + '-' + ts + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function getSchemes() {
    return COLOR_SCHEMES;
  }

  function getCurrentScheme() {
    return currentScheme;
  }

  return {
    init, render, setColorScheme, exportImage,
    getSchemes, getCurrentScheme,
  };
})();
