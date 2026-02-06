const Presets = {
    schooling: {
        separationWeight: 1.0,
        alignmentWeight: 2.0,
        cohesionWeight: 1.5,
        neighborRadius: 50,
        maxSpeed: 4
    },
    chaotic: {
        separationWeight: 0.8,
        alignmentWeight: 0.3,
        cohesionWeight: 0.2,
        neighborRadius: 30,
        maxSpeed: 6
    },
    cluster: {
        separationWeight: 1.2,
        alignmentWeight: 1.0,
        cohesionWeight: 2.5,
        neighborRadius: 80,
        maxSpeed: 3
    }
};

function applyPreset(name, params) {
    const preset = Presets[name];
    if (!preset) return;

    params.separationWeight = preset.separationWeight;
    params.alignmentWeight = preset.alignmentWeight;
    params.cohesionWeight = preset.cohesionWeight;
    params.neighborRadius = preset.neighborRadius;
    params.maxSpeed = preset.maxSpeed;

    // Update slider UI
    document.getElementById('separationSlider').value = preset.separationWeight;
    document.getElementById('separationValue').textContent = preset.separationWeight.toFixed(1);

    document.getElementById('alignmentSlider').value = preset.alignmentWeight;
    document.getElementById('alignmentValue').textContent = preset.alignmentWeight.toFixed(1);

    document.getElementById('cohesionSlider').value = preset.cohesionWeight;
    document.getElementById('cohesionValue').textContent = preset.cohesionWeight.toFixed(1);

    document.getElementById('radiusSlider').value = preset.neighborRadius;
    document.getElementById('radiusValue').textContent = preset.neighborRadius;

    document.getElementById('speedSlider').value = preset.maxSpeed;
    document.getElementById('speedValue').textContent = preset.maxSpeed.toFixed(1);

    // Highlight active preset button
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    const btnId = 'preset' + name.charAt(0).toUpperCase() + name.slice(1);
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.add('active');
}
