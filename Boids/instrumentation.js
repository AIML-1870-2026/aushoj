class Instrumentation {
    constructor() {
        this.frames = 0;
        this.lastFpsUpdate = performance.now();
        this.fps = 60;
        this.avgSpeed = 0;
        this.avgNeighbors = 0;
        this.speedVariance = 0;
        this.compactness = 0;

        this.fpsEl = document.getElementById('fpsValue');
        this.boidCountEl = document.getElementById('boidCountValue');
        this.avgSpeedEl = document.getElementById('avgSpeedValue');
        this.avgNeighborsEl = document.getElementById('avgNeighborsValue');
    }

    update(boids) {
        this.frames++;
        const now = performance.now();
        const elapsed = now - this.lastFpsUpdate;

        // Update FPS every 500ms
        if (elapsed >= 500) {
            this.fps = Math.round((this.frames * 1000) / elapsed);
            this.frames = 0;
            this.lastFpsUpdate = now;

            this.fpsEl.textContent = this.fps;
            this.fpsEl.className = 'metric-value';
            if (this.fps > 55) {
                this.fpsEl.classList.add('fps-green');
            } else if (this.fps >= 30) {
                this.fpsEl.classList.add('fps-yellow');
            } else {
                this.fpsEl.classList.add('fps-red');
            }
        }

        // Compute metrics
        const n = boids.length;
        this.boidCountEl.textContent = n;

        if (n === 0) {
            this.avgSpeed = 0;
            this.avgNeighbors = 0;
            this.speedVariance = 0;
            this.compactness = 0;
            this.avgSpeedEl.textContent = '0.00';
            this.avgNeighborsEl.textContent = '0';
            return;
        }

        let totalSpeed = 0;
        let totalNeighbors = 0;
        let cx = 0, cy = 0;
        const speeds = new Float64Array(n);

        for (let i = 0; i < n; i++) {
            const s = boids[i].getSpeed();
            speeds[i] = s;
            totalSpeed += s;
            totalNeighbors += boids[i].neighborCount;
            cx += boids[i].position.x;
            cy += boids[i].position.y;
        }

        this.avgSpeed = totalSpeed / n;
        this.avgNeighbors = totalNeighbors / n;

        // Speed variance
        let variance = 0;
        for (let i = 0; i < n; i++) {
            const diff = speeds[i] - this.avgSpeed;
            variance += diff * diff;
        }
        this.speedVariance = variance / n;

        // Compactness (std dev of positions from center of mass)
        cx /= n;
        cy /= n;
        let posVariance = 0;
        for (let i = 0; i < n; i++) {
            const dx = boids[i].position.x - cx;
            const dy = boids[i].position.y - cy;
            posVariance += dx * dx + dy * dy;
        }
        this.compactness = Math.sqrt(posVariance / n);

        this.avgSpeedEl.textContent = this.avgSpeed.toFixed(2);
        this.avgNeighborsEl.textContent = Math.round(this.avgNeighbors);
    }
}
