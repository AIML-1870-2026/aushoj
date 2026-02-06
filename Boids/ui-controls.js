// Initialize simulation
const sim = new Simulation();

// === Slider bindings ===
function bindSlider(sliderId, valueId, paramKey, format) {
    const slider = document.getElementById(sliderId);
    const valueEl = document.getElementById(valueId);
    slider.addEventListener('input', () => {
        const val = parseFloat(slider.value);
        sim.params[paramKey] = val;
        valueEl.textContent = format ? format(val) : val;
        clearPresetHighlight();
    });
}

function clearPresetHighlight() {
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
}

bindSlider('separationSlider', 'separationValue', 'separationWeight', v => v.toFixed(1));
bindSlider('alignmentSlider', 'alignmentValue', 'alignmentWeight', v => v.toFixed(1));
bindSlider('cohesionSlider', 'cohesionValue', 'cohesionWeight', v => v.toFixed(1));
bindSlider('radiusSlider', 'radiusValue', 'neighborRadius');
bindSlider('speedSlider', 'speedValue', 'maxSpeed', v => v.toFixed(1));

// === Preset buttons ===
document.getElementById('presetSchooling').addEventListener('click', () => {
    applyPreset('schooling', sim.params);
});

document.getElementById('presetChaotic').addEventListener('click', () => {
    applyPreset('chaotic', sim.params);
});

document.getElementById('presetCluster').addEventListener('click', () => {
    applyPreset('cluster', sim.params);
});

// === System controls ===
document.getElementById('pauseBtn').addEventListener('click', () => {
    const paused = sim.togglePause();
    document.getElementById('pauseBtn').textContent = paused ? 'Resume' : 'Pause';
});

document.getElementById('resetBtn').addEventListener('click', () => {
    sim.reset();
});

document.getElementById('boundarySelect').addEventListener('change', (e) => {
    sim.params.boundaryMode = e.target.value;
});

document.getElementById('boidCountInput').addEventListener('change', (e) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count)) {
        sim.setBoidCount(count);
        e.target.value = sim.params.boidCount;
    }
});

// === Theme ===
document.getElementById('themeSelect').addEventListener('change', (e) => {
    setTheme(e.target.value);
    // Force full redraw to clear trails
    sim.draw();
});

// === Trails ===
document.getElementById('trailToggle').addEventListener('change', (e) => {
    sim.showTrails = e.target.checked;
    document.getElementById('trailLengthWrapper').style.display = e.target.checked ? 'flex' : 'none';
    if (!e.target.checked) {
        // Clear trails from boids
        for (let i = 0; i < sim.boids.length; i++) {
            sim.boids[i].trail = [];
        }
    }
});

document.getElementById('trailLengthSlider').addEventListener('input', (e) => {
    sim.trailLength = parseInt(e.target.value, 10);
    document.getElementById('trailLengthValue').textContent = e.target.value;
});

// === Obstacles ===
document.getElementById('obstacleToggle').addEventListener('click', () => {
    sim.obstacleManager.togglePlacementMode();
});

document.getElementById('clearObstacles').addEventListener('click', () => {
    sim.obstacleManager.clearAll();
});

// Canvas click for obstacle placement
sim.canvas.addEventListener('click', (e) => {
    if (!sim.obstacleManager.placementMode) return;
    const rect = sim.canvas.getBoundingClientRect();
    const scaleX = sim.canvas.width / rect.width;
    const scaleY = sim.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    sim.obstacleManager.addObstacle(x, y);
});

// === Chart metric selector ===
document.getElementById('chartMetric').addEventListener('change', (e) => {
    sim.chart.setMetric(e.target.value);
});

// === Keyboard shortcuts ===
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.key === ' ' || e.key === 'p') {
        e.preventDefault();
        const paused = sim.togglePause();
        document.getElementById('pauseBtn').textContent = paused ? 'Resume' : 'Pause';
    }
    if (e.key === 'r') {
        sim.reset();
    }
});

// Start the simulation
sim.start();
