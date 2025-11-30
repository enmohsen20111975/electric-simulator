// Effect Manager - Coordinates all visual effects
// Manages effect lifecycle and rendering

class Effect {
    constructor(type, params = {}) {
        this.type = type;
        this.id = Math.random().toString(36).substr(2, 9);
        this.params = params;
        this.age = 0;
        this.duration = params.duration || Infinity;
        this.active = true;
    }

    update(deltaTime) {
        this.age += deltaTime;
        if (this.age >= this.duration) {
            this.active = false;
        }
    }

    render(ctx) {
        // Override in subclasses
    }

    isActive() {
        return this.active;
    }

    stop() {
        this.active = false;
    }
}

class EffectManager {
    constructor(canvas, particleSystem) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particleSystem = particleSystem;
        this.effects = new Map();
        this.lastTime = performance.now();
    }

    addEffect(type, params = {}) {
        const effectClass = this.getEffectClass(type);
        if (!effectClass) {
            console.warn(`Unknown effect type: ${type}`);
            return null;
        }

        const effect = new effectClass(params, this.particleSystem);
        this.effects.set(effect.id, effect);
        return effect.id;
    }

    getEffectClass(type) {
        // Map effect types to classes
        const effectMap = {
            'currentFlow': CurrentFlowEffect,
            'componentGlow': ComponentGlowEffect,
            'arcFlash': ArcFlashEffect,
            'smoke': SmokeEffect,
            'fluidFlow': FluidFlowEffect,
            'leak': LeakEffect,
            'pressureWave': PressureWaveEffect,
            'cavitation': CavitationEffect
        };

        return effectMap[type];
    }

    removeEffect(id) {
        const effect = this.effects.get(id);
        if (effect) {
            effect.stop();
            this.effects.delete(id);
        }
    }

    update() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Update all effects
        for (const [id, effect] of this.effects) {
            effect.update(deltaTime);

            // Remove inactive effects
            if (!effect.isActive()) {
                this.effects.delete(id);
            }
        }

        // Update particle system
        if (this.particleSystem) {
            this.particleSystem.update(deltaTime);
        }
    }

    render() {
        // Render all effects
        for (const effect of this.effects.values()) {
            effect.render(this.ctx);
        }

        // Render particles
        if (this.particleSystem) {
            this.particleSystem.render(this.ctx);
        }
    }

    clear() {
        this.effects.clear();
        if (this.particleSystem) {
            this.particleSystem.clear();
        }
    }

    getEffectCount() {
        return this.effects.size;
    }

    getParticleCount() {
        return this.particleSystem ? this.particleSystem.getCount() : 0;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Effect, EffectManager };
}
