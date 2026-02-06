class Boid {
    constructor(x, y, canvasWidth, canvasHeight) {
        this.position = { x, y };
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 2;
        this.velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
        this.acceleration = { x: 0, y: 0 };
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.trail = [];
        this.neighborCount = 0;
    }

    applyForce(force) {
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }

    separate(boids, params) {
        const steer = { x: 0, y: 0 };
        let count = 0;
        const desiredSep = params.neighborRadius * 0.5;

        for (let i = 0; i < boids.length; i++) {
            const other = boids[i];
            if (other === this) continue;
            const dx = this.position.x - other.position.x;
            const dy = this.position.y - other.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0 && dist < desiredSep) {
                steer.x += dx / dist / dist;
                steer.y += dy / dist / dist;
                count++;
            }
        }

        if (count > 0) {
            steer.x /= count;
            steer.y /= count;
            const mag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
            if (mag > 0) {
                steer.x = (steer.x / mag) * params.maxSpeed - this.velocity.x;
                steer.y = (steer.y / mag) * params.maxSpeed - this.velocity.y;
                const sMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                if (sMag > params.maxForce) {
                    steer.x = (steer.x / sMag) * params.maxForce;
                    steer.y = (steer.y / sMag) * params.maxForce;
                }
            }
        }
        return steer;
    }

    align(boids, params) {
        const avg = { x: 0, y: 0 };
        let count = 0;

        for (let i = 0; i < boids.length; i++) {
            const other = boids[i];
            if (other === this) continue;
            const dx = this.position.x - other.position.x;
            const dy = this.position.y - other.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0 && dist < params.neighborRadius) {
                avg.x += other.velocity.x;
                avg.y += other.velocity.y;
                count++;
            }
        }

        if (count > 0) {
            avg.x /= count;
            avg.y /= count;
            const mag = Math.sqrt(avg.x * avg.x + avg.y * avg.y);
            if (mag > 0) {
                avg.x = (avg.x / mag) * params.maxSpeed;
                avg.y = (avg.y / mag) * params.maxSpeed;
            }
            const steer = {
                x: avg.x - this.velocity.x,
                y: avg.y - this.velocity.y
            };
            const sMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
            if (sMag > params.maxForce) {
                steer.x = (steer.x / sMag) * params.maxForce;
                steer.y = (steer.y / sMag) * params.maxForce;
            }
            return steer;
        }
        return { x: 0, y: 0 };
    }

    cohere(boids, params) {
        const center = { x: 0, y: 0 };
        let count = 0;

        for (let i = 0; i < boids.length; i++) {
            const other = boids[i];
            if (other === this) continue;
            const dx = this.position.x - other.position.x;
            const dy = this.position.y - other.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0 && dist < params.neighborRadius) {
                center.x += other.position.x;
                center.y += other.position.y;
                count++;
            }
        }

        this.neighborCount = count;

        if (count > 0) {
            center.x /= count;
            center.y /= count;
            return this.seek(center, params);
        }
        return { x: 0, y: 0 };
    }

    seek(target, params) {
        const desired = {
            x: target.x - this.position.x,
            y: target.y - this.position.y
        };
        const mag = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
        if (mag === 0) return { x: 0, y: 0 };
        desired.x = (desired.x / mag) * params.maxSpeed;
        desired.y = (desired.y / mag) * params.maxSpeed;
        const steer = {
            x: desired.x - this.velocity.x,
            y: desired.y - this.velocity.y
        };
        const sMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
        if (sMag > params.maxForce) {
            steer.x = (steer.x / sMag) * params.maxForce;
            steer.y = (steer.y / sMag) * params.maxForce;
        }
        return steer;
    }

    avoidObstacles(obstacles, params) {
        const steer = { x: 0, y: 0 };
        for (let i = 0; i < obstacles.length; i++) {
            const ob = obstacles[i];
            const dx = this.position.x - ob.x;
            const dy = this.position.y - ob.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const avoidDist = ob.radius * 2;
            if (dist < avoidDist && dist > 0) {
                const force = (avoidDist - dist) / avoidDist;
                steer.x += (dx / dist) * force * 2;
                steer.y += (dy / dist) * force * 2;
            }
        }
        return steer;
    }

    flock(boids, params, obstacles) {
        const sep = this.separate(boids, params);
        const ali = this.align(boids, params);
        const coh = this.cohere(boids, params);

        sep.x *= params.separationWeight;
        sep.y *= params.separationWeight;
        ali.x *= params.alignmentWeight;
        ali.y *= params.alignmentWeight;
        coh.x *= params.cohesionWeight;
        coh.y *= params.cohesionWeight;

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);

        if (obstacles.length > 0) {
            const avoid = this.avoidObstacles(obstacles, params);
            this.applyForce(avoid);
        }
    }

    update(params) {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > params.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * params.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * params.maxSpeed;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

    handleBoundary(mode) {
        if (mode === 'wrap') {
            if (this.position.x < 0) this.position.x += this.canvasWidth;
            if (this.position.x > this.canvasWidth) this.position.x -= this.canvasWidth;
            if (this.position.y < 0) this.position.y += this.canvasHeight;
            if (this.position.y > this.canvasHeight) this.position.y -= this.canvasHeight;
        } else {
            const margin = 5;
            if (this.position.x < margin) { this.position.x = margin; this.velocity.x *= -1; }
            if (this.position.x > this.canvasWidth - margin) { this.position.x = this.canvasWidth - margin; this.velocity.x *= -1; }
            if (this.position.y < margin) { this.position.y = margin; this.velocity.y *= -1; }
            if (this.position.y > this.canvasHeight - margin) { this.position.y = this.canvasHeight - margin; this.velocity.y *= -1; }
        }
    }

    recordTrail(maxLength) {
        this.trail.push({ x: this.position.x, y: this.position.y });
        if (this.trail.length > maxLength) {
            this.trail.shift();
        }
    }

    getSpeed() {
        return Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    }

    getAngle() {
        return Math.atan2(this.velocity.y, this.velocity.x);
    }
}
