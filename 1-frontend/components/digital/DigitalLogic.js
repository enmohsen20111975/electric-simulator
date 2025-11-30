// Digital Logic Gates and Components
// AND, OR, NOT, NAND, NOR, XOR, XNOR, Flip-Flops, 555 Timer

class LogicGate {
    constructor(type = 'AND', inputs = 2) {
        this.type = type;
        this.inputs = inputs;
        this.inputStates = new Array(inputs).fill(false);
    }

    calculate(...inputs) {
        this.inputStates = inputs;

        switch (this.type) {
            case 'AND':
                return inputs.every(i => i);
            case 'OR':
                return inputs.some(i => i);
            case 'NOT':
                return !inputs[0];
            case 'NAND':
                return !inputs.every(i => i);
            case 'NOR':
                return !inputs.some(i => i);
            case 'XOR':
                return inputs.reduce((a, b) => a !== b, false);
            case 'XNOR':
                return !inputs.reduce((a, b) => a !== b, false);
            default:
                return false;
        }
    }

    getTruthTable() {
        const rows = Math.pow(2, this.inputs);
        const table = [];

        for (let i = 0; i < rows; i++) {
            const inputs = [];
            for (let j = this.inputs - 1; j >= 0; j--) {
                inputs.push(Boolean((i >> j) & 1));
            }
            const output = this.calculate(...inputs);
            table.push({ inputs, output });
        }

        return table;
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const width = 50;
        const height = 40;

        ctx.strokeStyle = '#ecf0f1';
        ctx.fillStyle = '#34495e';
        ctx.lineWidth = 2;

        switch (this.type) {
            case 'AND':
            case 'NAND':
                this.renderAND(ctx, width, height);
                break;
            case 'OR':
            case 'NOR':
                this.renderOR(ctx, width, height);
                break;
            case 'NOT':
                this.renderNOT(ctx, width, height);
                break;
            case 'XOR':
            case 'XNOR':
                this.renderXOR(ctx, width, height);
                break;
        }

        // Add bubble for inverted gates
        if (['NAND', 'NOR', 'XNOR', 'NOT'].includes(this.type)) {
            ctx.beginPath();
            ctx.arc(width / 2 + 3, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // Label
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(this.type, -width / 4, 5);

        ctx.restore();
    }

    renderAND(ctx, width, height) {
        ctx.beginPath();
        ctx.moveTo(-width / 2, -height / 2);
        ctx.lineTo(0, -height / 2);
        ctx.arc(0, 0, height / 2, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(-width / 2, height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    renderOR(ctx, width, height) {
        ctx.beginPath();
        ctx.moveTo(-width / 2, -height / 2);
        ctx.quadraticCurveTo(0, -height / 2, width / 2, 0);
        ctx.quadraticCurveTo(0, height / 2, -width / 2, height / 2);
        ctx.quadraticCurveTo(-width / 4, 0, -width / 2, -height / 2);
        ctx.fill();
        ctx.stroke();
    }

    renderNOT(ctx, width, height) {
        ctx.beginPath();
        ctx.moveTo(-width / 2, -height / 2);
        ctx.lineTo(-width / 2, height / 2);
        ctx.lineTo(width / 2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    renderXOR(ctx, width, height) {
        // Draw OR shape
        this.renderOR(ctx, width, height);

        // Add extra curve at input
        ctx.beginPath();
        ctx.moveTo(-width / 2 - 5, -height / 2);
        ctx.quadraticCurveTo(-width / 2 - 2, 0, -width / 2 - 5, height / 2);
        ctx.stroke();
    }
}

class FlipFlop {
    constructor(type = 'D') {
        this.type = type; // SR, D, JK, T
        this.state = { Q: false, Qbar: true };
    }

    calculate(inputs, clock) {
        // Only update on clock edge (rising edge)
        if (!clock) return this.state;

        switch (this.type) {
            case 'SR':
                return this.calculateSR(inputs.S, inputs.R);
            case 'D':
                return this.calculateD(inputs.D);
            case 'JK':
                return this.calculateJK(inputs.J, inputs.K);
            case 'T':
                return this.calculateT(inputs.T);
            default:
                return this.state;
        }
    }

    calculateSR(S, R) {
        if (S && R) {
            // Invalid state
            return { Q: undefined, Qbar: undefined, error: 'Invalid SR input' };
        } else if (S) {
            this.state = { Q: true, Qbar: false };
        } else if (R) {
            this.state = { Q: false, Qbar: true };
        }
        // else hold current state
        return this.state;
    }

    calculateD(D) {
        this.state = { Q: D, Qbar: !D };
        return this.state;
    }

    calculateJK(J, K) {
        if (J && K) {
            // Toggle
            this.state = { Q: !this.state.Q, Qbar: this.state.Q };
        } else if (J) {
            this.state = { Q: true, Qbar: false };
        } else if (K) {
            this.state = { Q: false, Qbar: true };
        }
        // else hold
        return this.state;
    }

    calculateT(T) {
        if (T) {
            this.state = { Q: !this.state.Q, Qbar: this.state.Q };
        }
        return this.state;
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const width = 60;
        const height = 80;

        // Draw rectangle
        ctx.strokeStyle = '#ecf0f1';
        ctx.fillStyle = '#2c3e50';
        ctx.lineWidth = 2;

        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.strokeRect(-width / 2, -height / 2, width, height);

        // Labels
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(this.type, -10, -height / 2 + 15);

        ctx.font = '12px Arial';
        ctx.fillText('Q', width / 2 - 15, -height / 4);
        ctx.fillText('Q̄', width / 2 - 15, height / 4);

        // Clock symbol
        ctx.beginPath();
        ctx.moveTo(-width / 2 + 5, height / 2 - 10);
        ctx.lineTo(-width / 2 + 10, height / 2 - 15);
        ctx.lineTo(-width / 2 + 15, height / 2 - 10);
        ctx.stroke();

        ctx.restore();
    }
}

class Timer555 {
    constructor(mode = 'astable') {
        this.mode = mode; // astable or monostable
        this.r1 = 10000; // Ω
        this.r2 = 10000; // Ω
        this.c = 10e-6; // F
    }

    calculateFrequency() {
        if (this.mode === 'astable') {
            // f = 1.44 / ((R1 + 2*R2) * C)
            const freq = 1.44 / ((this.r1 + 2 * this.r2) * this.c);
            const dutyCycle = (this.r1 + this.r2) / (this.r1 + 2 * this.r2);

            return {
                frequency: freq,
                period: 1 / freq,
                dutyCycle: dutyCycle * 100,
                tHigh: 0.693 * (this.r1 + this.r2) * this.c,
                tLow: 0.693 * this.r2 * this.c
            };
        } else {
            // Monostable: T = 1.1 * R * C
            const pulseWidth = 1.1 * this.r1 * this.c;

            return {
                pulseWidth,
                mode: 'monostable'
            };
        }
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const width = 70;
        const height = 90;

        // Draw IC package
        ctx.strokeStyle = '#ecf0f1';
        ctx.fillStyle = '#2c3e50';
        ctx.lineWidth = 2;

        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.strokeRect(-width / 2, -height / 2, width, height);

        // Draw notch at top
        ctx.beginPath();
        ctx.arc(0, -height / 2, 5, 0, Math.PI, true);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('555', -12, 5);

        ctx.font = '8px Arial';
        ctx.fillText(this.mode, -20, 20);

        ctx.restore();
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LogicGate, FlipFlop, Timer555 };
}
