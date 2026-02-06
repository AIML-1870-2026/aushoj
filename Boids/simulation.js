class Simulation {
    constructor() {
        this.canvas = document.getElementById('boidsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.boids = [];
        this.paused = false;
        this.showTrails = false;
        this.trailLength = 20;

        this.params = {
            separationWeight: 1.5,
            alignmentWeight: 1.0,
            cohesionWeight: 1.0,
            neighborRadius: 50,
            maxSpeed: 4,
            maxForce: 0.1,
            boundaryMode: 'wrap',
            boidCount: 100
        };

        this.obstacleManager = new ObstacleManager();
        this.instrumentation = new Instrumentation();
        this.chart = new LiveChart('chartCanvas');

        this.chartFrameCounter = 0;
        this.animFrameId = null;

        this.initBoids(this.params.boidCount);
    }

    initBoids(count) {
        this.boids = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.boids.push(new Boid(x, y, this.canvas.width, this.canvas.height));
        }
    }

    reset() {
        this.initBoids(this.params.boidCount);
    }

    setBoidCount(count) {
        count = Math.max(10, Math.min(2000, count));
        this.params.boidCount = count;

        if (this.boids.length < count) {
            while (this.boids.length < count) {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height;
                this.boids.push(new Boid(x, y, this.canvas.width, this.canvas.height));
            }
        } else if (this.boids.length > count) {
            this.boids.length = count;
        }
    }

    togglePause() {
        this.paused = !this.paused;
        return this.paused;
    }

    step() {
        const obstacles = this.obstacleManager.getObstacles();

        // Use spatial grid for performance with many boids
        const grid = this.buildGrid();

        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            const neighbors = this.getNeighbors(boid, grid);
            boid.flock(neighbors, this.params, obstacles);
        }

        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            boid.update(this.params);
            boid.handleBoundary(this.params.boundaryMode);
            if (this.showTrails) {
                boid.recordTrail(this.trailLength);
            }
        }
    }

    buildGrid() {
        const cellSize = this.params.neighborRadius;
        const cols = Math.ceil(this.canvas.width / cellSize);
        const rows = Math.ceil(this.canvas.height / cellSize);
        const grid = new Array(cols * rows);

        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            const col = Math.floor(boid.position.x / cellSize);
            const row = Math.floor(boid.position.y / cellSize);
            const clamped = Math.max(0, Math.min(col, cols - 1)) + Math.max(0, Math.min(row, rows - 1)) * cols;

            if (!grid[clamped]) grid[clamped] = [];
            grid[clamped].push(boid);
        }

        grid._cols = cols;
        grid._rows = rows;
        grid._cellSize = cellSize;
        return grid;
    }

    getNeighbors(boid, grid) {
        const cellSize = grid._cellSize;
        const cols = grid._cols;
        const rows = grid._rows;
        const col = Math.floor(boid.position.x / cellSize);
        const row = Math.floor(boid.position.y / cellSize);
        const neighbors = [];

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                let nc = col + dx;
                let nr = row + dy;

                if (this.params.boundaryMode === 'wrap') {
                    nc = ((nc % cols) + cols) % cols;
                    nr = ((nr % rows) + rows) % rows;
                } else {
                    if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
                }

                const idx = nc + nr * cols;
                const cell = grid[idx];
                if (cell) {
                    for (let i = 0; i < cell.length; i++) {
                        if (cell[i] !== boid) neighbors.push(cell[i]);
                    }
                }
            }
        }

        return neighbors;
    }

    draw() {
        const theme = getTheme();
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Always fully clear, then draw trails from stored positions
        ctx.fillStyle = theme.canvasBg;
        ctx.fillRect(0, 0, w, h);

        // Draw subtle grid
        ctx.strokeStyle = theme.gridColor;
        ctx.lineWidth = 0.5;
        const gridSpacing = 50;
        for (let x = 0; x < w; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Draw obstacles
        this.obstacleManager.draw(ctx, theme);

        // Set up glow if neon theme
        if (theme.glow) {
            ctx.shadowColor = theme.glowColor;
            ctx.shadowBlur = theme.glowBlur;
        }

        // Draw trails with per-segment alpha fading
        if (this.showTrails) {
            ctx.lineWidth = 1;
            for (let i = 0; i < this.boids.length; i++) {
                const boid = this.boids[i];
                const trail = boid.trail;
                if (trail.length < 2) continue;

                for (let j = 1; j < trail.length; j++) {
                    // Skip segment if it wraps across canvas
                    const segDx = Math.abs(trail[j].x - trail[j - 1].x);
                    const segDy = Math.abs(trail[j].y - trail[j - 1].y);
                    if (segDx > w / 2 || segDy > h / 2) continue;

                    ctx.globalAlpha = (j / trail.length) * 0.5;
                    ctx.strokeStyle = theme.trailColor;
                    ctx.beginPath();
                    ctx.moveTo(trail[j - 1].x, trail[j - 1].y);
                    ctx.lineTo(trail[j].x, trail[j].y);
                    ctx.stroke();
                }
            }
            ctx.globalAlpha = 1;
        }

        // Draw boids
        ctx.fillStyle = theme.boidColor;
        const size = 6;

        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            const angle = boid.getAngle();
            const x = boid.position.x;
            const y = boid.position.y;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // Bird shape with body, wings, and tail
            ctx.beginPath();
            // Head/beak
            ctx.moveTo(size * 1.2, 0);
            // Top of head to left wing
            ctx.lineTo(size * 0.3, -size * 0.15);
            ctx.lineTo(-size * 0.2, -size * 0.9);     // left wingtip
            ctx.lineTo(-size * 0.1, -size * 0.15);    // wing back to body
            // Tail
            ctx.lineTo(-size * 0.7, -size * 0.25);    // tail top
            ctx.lineTo(-size * 0.9, 0);               // tail tip
            ctx.lineTo(-size * 0.7, size * 0.25);     // tail bottom
            // Right wing
            ctx.lineTo(-size * 0.1, size * 0.15);     // body to wing
            ctx.lineTo(-size * 0.2, size * 0.9);      // right wingtip
            ctx.lineTo(size * 0.3, size * 0.15);      // wing back to head
            ctx.closePath();

            ctx.fillStyle = theme.boidColor;
            ctx.fill();

            if (theme.boidStroke) {
                ctx.strokeStyle = theme.boidStroke;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            ctx.restore();
        }

        // Reset shadow
        if (theme.glow) {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
    }

    loop() {
        if (!this.paused) {
            this.step();
            this.instrumentation.update(this.boids);

            this.chartFrameCounter++;
            if (this.chartFrameCounter >= 3) {
                this.chart.pushValue(this.instrumentation);
                this.chart.draw();
                this.chartFrameCounter = 0;
            }
        }

        this.draw();
        this.animFrameId = requestAnimationFrame(() => this.loop());
    }

    start() {
        this.loop();
    }
}
