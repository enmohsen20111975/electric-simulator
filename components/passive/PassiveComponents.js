// Passive Electrical Components
// Potentiometers, Thermistors, Varistors, Crystal Oscillators

class Potentiometer {
    constructor(maxResistance = 10000, taper = 'linear') {
        this.maxResistance = maxResistance; // Ω
        this.taper = taper; // linear or logarithmic
        this.position = 0.5; // 0-1 (wiper position)
    }

    getResistance() {
        let resistance;

        if (this.taper === 'logarithmic') {
            // Logarithmic taper (audio taper)
            resistance = this.maxResistance * Math.pow(10, this.position - 1);
        } else {
            // Linear taper
            resistance = this.maxResistance * this.position;
        }

        return {
            resistance,
            position: this.position * 100, // percentage
            maxResistance: this.maxResistance
        };
    }

    setPosition(value) {
        this.position = Math.max(0, Math.min(1, value));
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const size = 40;

        // Draw resistor body
        ctx.strokeStyle = '#ecf0f1';
        ctx.fillStyle = '#8e44ad';
        ctx.lineWidth = 2;

        ctx.fillRect(-size / 2, -10, size, 20);
        ctx.strokeRect(-size / 2, -10, size, 20);

        // Draw wiper (adjustable contact)
        const wiperX = -size / 2 + (size * this.position);
        ctx.strokeStyle = '#3498db';
        ctx.beginPath();
        ctx.moveTo(wiperX, -10);
        ctx.lineTo(wiperX, -25);
        ctx.stroke();

        // Draw adjustment arrow
        ctx.beginPath();
        ctx.moveTo(wiperX - 3, -22);
        ctx.lineTo(wiperX, -25);
        ctx.lineTo(wiperX + 3, -22);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '10px Arial';
        ctx.fillText(`${(this.maxResistance / 1000).toFixed(0)}kΩ`, -15, -30);
        ctx.fillText(`${(this.position * 100).toFixed(0)}%`, -10, 30);

        ctx.restore();
    }
}

class Thermistor {
    constructor(type = 'NTC', r25 = 10000, beta = 3950) {
        this.type = type; // NTC (Negative) or PTC (Positive)
        this.r25 = r25; // Resistance at 25°C in Ω
        this.beta = beta; // Beta coefficient
        this.temperature = 25; // Current temperature in °C
    }

    getResistance(temperature = this.temperature) {
        this.temperature = temperature;
        const t0 = 25 + 273.15; // Reference temp in Kelvin
        const t = temperature + 273.15; // Current temp in Kelvin

        let resistance;

        if (this.type === 'NTC') {
            // Steinhart-Hart equation (simplified)
            resistance = this.r25 * Math.exp(this.beta * (1 / t - 1 / t0));
        } else {
            // PTC - simplified model
            const tempDiff = temperature - 25;
            resistance = this.r25 * (1 + 0.004 * tempDiff);
        }

        return {
            resistance,
            temperature,
            r25: this.r25,
            type: this.type
        };
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const size = 40;

        // Draw resistor body
        ctx.strokeStyle = '#ecf0f1';
        const tempColor = this.temperature > 50 ? '#e74c3c' : '#3498db';
        ctx.fillStyle = tempColor;
        ctx.lineWidth = 2;

        ctx.fillRect(-size / 2, -10, size, 20);
        ctx.strokeRect(-size / 2, -10, size, 20);

        // Draw temperature symbol
        ctx.strokeStyle = '#ecf0f1';
        ctx.font = '16px Arial';
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText('θ', -5, 5);

        // Label
        ctx.font = '10px Arial';
        ctx.fillText(this.type, -10, -15);
        ctx.fillText(`${this.temperature.toFixed(0)}°C`, -15, 30);

        ctx.restore();
    }
}

class Varistor {
    constructor(voltage = 275, energy = 100) {
        this.voltage = voltage; // Clamping voltage in V
        this.energy = energy; // Energy rating in J
        this.isClamping = false;
    }

    calculate(voltage) {
        // Varistor clamps voltage above threshold
        this.isClamping = Math.abs(voltage) > this.voltage;

        if (!this.isClamping) {
            return {
                vOut: voltage,
                current: 0,
                state: 'normal',
                clamping: false
            };
        }

        // Clamping - limit voltage
        const vOut = Math.sign(voltage) * this.voltage;
        const current = (Math.abs(voltage) - this.voltage) / 10; // Simplified

        return {
            vOut,
            current,
            state: 'clamping',
            clamping: true,
            power: (Math.abs(voltage) - this.voltage) * current
        };
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const size = 40;

        // Draw varistor symbol (circle with line through it)
        ctx.strokeStyle = '#ecf0f1';
        ctx.fillStyle = this.isClamping ? '#e74c3c' : '#34495e';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw diagonal line
        ctx.beginPath();
        ctx.moveTo(-size / 3, -size / 3);
        ctx.lineTo(size / 3, size / 3);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '10px Arial';
        ctx.fillText('MOV', -10, -size / 2 - 5);
        ctx.fillText(`${this.voltage}V`, -10, size / 2 + 15);

        ctx.restore();
    }
}

class CrystalOscillator {
    constructor(frequency = 16e6) {
        this.frequency = frequency; // Hz
        this.isOscillating = false;
        this.loadCapacitance = 18e-12; // F (typical)
    }

    calculate(powerOn = true) {
        this.isOscillating = powerOn;

        if (!powerOn) {
            return {
                frequency: 0,
                period: 0,
                oscillating: false
            };
        }

        return {
            frequency: this.frequency,
            period: 1 / this.frequency,
            oscillating: true,
            frequencyMHz: this.frequency / 1e6
        };
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const width = 30;
        const height = 40;

        // Draw crystal package
        ctx.strokeStyle = '#ecf0f1';
        ctx.fillStyle = '#95a5a6';
        ctx.lineWidth = 2;

        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.strokeRect(-width / 2, -height / 2, width, height);

        // Draw crystal symbol inside
        ctx.strokeStyle = '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(-width / 4, -height / 3);
        ctx.lineTo(-width / 4, height / 3);
        ctx.moveTo(width / 4, -height / 3);
        ctx.lineTo(width / 4, height / 3);
        ctx.stroke();

        // Draw waveform if oscillating
        if (this.isOscillating) {
            ctx.strokeStyle = '#3498db';
            ctx.beginPath();
            for (let i = 0; i < 20; i++) {
                const x = -10 + i;
                const y = Math.sin(i * 0.5) * 5;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Label
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '8px Arial';
        const freqMHz = this.frequency / 1e6;
        ctx.fillText(`${freqMHz}MHz`, -12, height / 2 + 12);

        ctx.restore();
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Potentiometer, Thermistor, Varistor, CrystalOscillator };
}
