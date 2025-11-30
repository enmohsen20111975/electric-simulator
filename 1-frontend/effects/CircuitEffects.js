// Circuit Simulator Visual Effects
// Current Flow, Component Glow, Arc Flash, Smoke

class CurrentFlowEffect extends Effect {
    constructor(params, particleSystem) {
        super('currentFlow', params);
        this.particleSystem = particleSystem;
        this.wire = params.wire;
        this.current = params.current || 0;
        this.spawnRate = Math.abs(this.current) * 10; // particles per second
        this.timeSinceSpawn = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);

        if (!this.wire || this.current === 0) {
            this.active = false;
            return;
        }

        this.timeSinceSpawn += deltaTime;
        const spawnInterval = 1 / this.spawnRate;

        while (this.timeSinceSpawn >= spawnInterval) {
            this.spawnParticle();
            this.timeSinceSpawn -= spawnInterval;
        }
    }

    spawnParticle() {
        // Spawn particle along wire path
        const { x1, y1, x2, y2 } = this.wire;
        const t = Math.random();
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;

        // Velocity along wire
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.abs(this.current) * 50;
        const vx = (dx / length) * speed * Math.sign(this.current);
        const vy = (dy / length) * speed * Math.sign(this.current);

        this.particleSystem.addParticle(x, y, vx, vy, {
            color: this.current > 0 ? '#3498db' : '#e74c3c',
            size: 2 + Math.abs(this.current) * 2,
            lifetime: 0.5,
            shape: 'circle'
        });
    }

    render(ctx) {
        // Particles are rendered by particle system
    }
}

class ComponentGlowEffect extends Effect {
    constructor(params, particleSystem) {
        super('componentGlow', params);
        this.component = params.component;
        this.intensity = params.intensity || 0.5;
    }

    update(deltaTime) {
        super.update(deltaTime);

        if (!this.component) {
            this.active = false;
            return;
        }

        // Update intensity based on component power
        if (this.component.power !== undefined) {
            this.intensity = Math.min(1.0, this.component.power / (this.component.maxPower || 1));
        }
    }

    render(ctx) {
        if (!this.component || this.intensity <= 0) return;

        const { x, y, width = 40, height = 40 } = this.component;

        // Create glow effect
        ctx.save();
        ctx.globalAlpha = this.intensity * 0.6;

        // Gradient from hot to cool
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, width);
        if (this.intensity > 0.7) {
            gradient.addColorStop(0, '#e74c3c'); // Red hot
            gradient.addColorStop(0.5, '#f39c12'); // Orange
            gradient.addColorStop(1, 'transparent');
        } else {
            gradient.addColorStop(0, '#f39c12'); // Orange
            gradient.addColorStop(0.5, '#e67e22'); // Dark orange
            gradient.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x - width, y - height, width * 2, height * 2);

        ctx.restore();
    }
}

class ArcFlashEffect extends Effect {
    constructor(params, particleSystem) {
        super('arcFlash', { ...params, duration: 0.2 });
        this.particleSystem = particleSystem;
        this.x1 = params.x1;
        this.y1 = params.y1;
        this.x2 = params.x2;
        this.y2 = params.y2;
        this.segments = [];
        this.generateLightning();
    }

    generateLightning() {
        // Generate jagged lightning bolt
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const segments = Math.floor(distance / 10);

        this.segments = [{ x: this.x1, y: this.y1 }];

        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const x = this.x1 + dx * t + (Math.random() - 0.5) * 20;
            const y = this.y1 + dy * t + (Math.random() - 0.5) * 20;
            this.segments.push({ x, y });
        }

        this.segments.push({ x: this.x2, y: this.y2 });

        // Add flash particles
        this.particleSystem.addBurst(
            (this.x1 + this.x2) / 2,
            (this.y1 + this.y2) / 2,
            20, 100,
            { color: '#ecf0f1', size: 3, lifetime: 0.3 }
        );
    }

    render(ctx) {
        const alpha = 1 - (this.age / this.duration);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#3498db';

        // Draw lightning bolt
        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);
        for (let i = 1; i < this.segments.length; i++) {
            ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }
        ctx.stroke();

        ctx.restore();
    }
}

class SmokeEffect extends Effect {
    constructor(params, particleSystem) {
        super('smoke', params);
        this.particleSystem = particleSystem;
        this.x = params.x;
        this.y = params.y;
        this.intensity = params.intensity || 0.5;
        this.spawnRate = this.intensity * 20;
        this.timeSinceSpawn = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);

        this.timeSinceSpawn += deltaTime;
        const spawnInterval = 1 / this.spawnRate;

        while (this.timeSinceSpawn >= spawnInterval) {
            this.spawnSmoke();
            this.timeSinceSpawn -= spawnInterval;
        }
    }

    spawnSmoke() {
        // Rising smoke particles
        const vx = (Math.random() - 0.5) * 20;
        const vy = -30 - Math.random() * 20; // Rise upward

        const colors = ['#34495e', '#7f8c8d', '#95a5a6'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.particleSystem.addParticle(
            this.x + (Math.random() - 0.5) * 10,
            this.y,
            vx, vy,
            {
                color,
                size: 5 + Math.random() * 5,
                lifetime: 2 + Math.random(),
                friction: 0.95,
                shape: 'circle'
            }
        );
    }

    render(ctx) {
        // Particles are rendered by particle system
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CurrentFlowEffect, ComponentGlowEffect, ArcFlashEffect, SmokeEffect };
}
