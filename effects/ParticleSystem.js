// Particle System - Core animation engine for visual effects
// Handles particle creation, updates, and rendering

class Particle {
    constructor(x, y, vx, vy, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        // Visual properties
        this.color = options.color || '#3498db';
        this.size = options.size || 3;
        this.alpha = options.alpha || 1.0;

        // Lifetime
        this.lifetime = options.lifetime || 2.0; // seconds
        this.age = 0;
        this.fadeOut = options.fadeOut !== false;

        // Physics
        this.gravity = options.gravity || 0;
        this.friction = options.friction || 0.98;
        this.rotation = options.rotation || 0;
        this.rotationSpeed = options.rotationSpeed || 0;

        // Shape
        this.shape = options.shape || 'circle'; // circle, square, triangle
    }

    update(deltaTime) {
        // Update position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Apply physics
        this.vy += this.gravity * deltaTime;
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Update rotation
        this.rotation += this.rotationSpeed * deltaTime;

        // Update age and alpha
        this.age += deltaTime;

        if (this.fadeOut) {
            const lifeRatio = this.age / this.lifetime;
            this.alpha = 1.0 - lifeRatio;
        }
    }

    render(ctx) {
        if (this.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        switch (this.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'square':
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;

            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, this.size);
                ctx.lineTo(-this.size, this.size);
                ctx.closePath();
                ctx.fill();
                break;
        }

        ctx.restore();
    }

    isDead() {
        return this.age >= this.lifetime;
    }
}

class ParticleSystem {
    constructor(maxParticles = 1000) {
        this.maxParticles = maxParticles;
        this.particles = [];
        this.pool = []; // Object pool for reuse
    }

    addParticle(x, y, vx, vy, options = {}) {
        if (this.particles.length >= this.maxParticles) {
            return null; // At capacity
        }

        // Try to reuse from pool
        let particle;
        if (this.pool.length > 0) {
            particle = this.pool.pop();
            // Reset properties
            particle.x = x;
            particle.y = y;
            particle.vx = vx;
            particle.vy = vy;
            particle.age = 0;
            Object.assign(particle, options);
        } else {
            particle = new Particle(x, y, vx, vy, options);
        }

        this.particles.push(particle);
        return particle;
    }

    addBurst(x, y, count, speed, options = {}) {
        // Create a burst of particles in all directions
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.addParticle(x, y, vx, vy, options);
        }
    }

    addSpray(x, y, count, direction, spread, speed, options = {}) {
        // Create a spray of particles in a cone
        for (let i = 0; i < count; i++) {
            const angle = direction + (Math.random() - 0.5) * spread;
            const particleSpeed = speed * (0.5 + Math.random() * 0.5);
            const vx = Math.cos(angle) * particleSpeed;
            const vy = Math.sin(angle) * particleSpeed;
            this.addParticle(x, y, vx, vy, options);
        }
    }

    update(deltaTime) {
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);

            // Remove dead particles
            if (particle.isDead()) {
                this.pool.push(particle); // Return to pool
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        for (const particle of this.particles) {
            particle.render(ctx);
        }
    }

    clear() {
        // Return all particles to pool
        this.pool.push(...this.particles);
        this.particles = [];
    }

    getCount() {
        return this.particles.length;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Particle, ParticleSystem };
}
