const MAX_OBSTACLES = 20;

class ObstacleManager {
    constructor() {
        this.obstacles = [];
        this.placementMode = false;
    }

    togglePlacementMode() {
        this.placementMode = !this.placementMode;
        const canvas = document.getElementById('boidsCanvas');
        const container = document.getElementById('canvas-container');
        const btn = document.getElementById('obstacleToggle');

        if (this.placementMode) {
            canvas.classList.add('obstacle-mode');
            container.classList.add('obstacle-active');
            btn.classList.add('active');
            btn.textContent = 'Placing...';
        } else {
            canvas.classList.remove('obstacle-mode');
            container.classList.remove('obstacle-active');
            btn.classList.remove('active');
            btn.textContent = 'Add Obstacle';
        }
    }

    addObstacle(x, y) {
        if (this.obstacles.length >= MAX_OBSTACLES) return false;
        const radius = 20 + Math.random() * 20;
        this.obstacles.push({ x, y, radius });
        return true;
    }

    clearAll() {
        this.obstacles = [];
    }

    draw(ctx, theme) {
        for (let i = 0; i < this.obstacles.length; i++) {
            const ob = this.obstacles[i];
            ctx.beginPath();
            ctx.arc(ob.x, ob.y, ob.radius, 0, Math.PI * 2);
            ctx.fillStyle = theme.obstacleColor;
            ctx.fill();
            ctx.strokeStyle = theme.obstacleBorder;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    getObstacles() {
        return this.obstacles;
    }
}
