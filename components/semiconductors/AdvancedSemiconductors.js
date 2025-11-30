// Advanced Semiconductor Components
// Transistors, Op-Amps, Voltage Regulators, Optocouplers

class Transistor {
    constructor(type = 'NPN', model = '2N3904') {
        this.type = type; // NPN, PNP, N-MOSFET, P-MOSFET
        this.model = model;
        this.specs = this.getSpecs(model);
        this.terminals = this.getTerminals(type);
    }

    getSpecs(model) {
        const specs = {
            // NPN Transistors
            '2N3904': {
                type: 'NPN',
                vceMax: 40, // V
                icMax: 0.2, // A
                pdMax: 0.625, // W
                hfe: 100, // typical
                vbe: 0.7 // V
            },
            'BC547': {
                type: 'NPN',
                vceMax: 45,
                icMax: 0.1,
                pdMax: 0.5,
                hfe: 200,
                vbe: 0.7
            },
            // PNP Transistors
            '2N3906': {
                type: 'PNP',
                vceMax: 40,
                icMax: 0.2,
                pdMax: 0.625,
                hfe: 100,
                vbe: -0.7
            },
            'BC557': {
                type: 'PNP',
                vceMax: 45,
                icMax: 0.1,
                pdMax: 0.5,
                hfe: 200,
                vbe: -0.7
            },
            // N-MOSFET
            'IRF540N': {
                type: 'N-MOSFET',
                vdsMax: 100,
                idMax: 33,
                pdMax: 130,
                rdsOn: 0.044, // Ω
                vgsThreshold: 4 // V
            },
            // P-MOSFET
            'IRF9540': {
                type: 'P-MOSFET',
                vdsMax: 100,
                idMax: 23,
                pdMax: 140,
                rdsOn: 0.117,
                vgsThreshold: -4
            }
        };

        return specs[model] || specs['2N3904'];
    }

    getTerminals(type) {
        if (type.includes('MOSFET')) {
            return ['drain', 'gate', 'source'];
        } else {
            return ['collector', 'base', 'emitter'];
        }
    }

    calculate(vbe, vce, ib) {
        if (this.type === 'NPN' || this.type === 'PNP') {
            return this.calculateBJT(vbe, vce, ib);
        } else {
            return this.calculateMOSFET(vbe, vce);
        }
    }

    calculateBJT(vbe, vce, ib) {
        const { hfe, vbe: vbeOn, icMax } = this.specs;

        // Check if transistor is in saturation
        const isSaturated = vbe >= Math.abs(vbeOn);

        if (!isSaturated) {
            return {
                ic: 0,
                ie: 0,
                vce: vce,
                region: 'cutoff'
            };
        }

        // Calculate collector current
        let ic = ib * hfe;

        // Limit to max current
        ic = Math.min(ic, icMax);

        // Emitter current
        const ie = ic + ib;

        // Determine operating region
        const region = vce < 0.2 ? 'saturation' : 'active';

        return {
            ic,
            ie,
            ib,
            vce,
            region,
            power: vce * ic
        };
    }

    calculateMOSFET(vgs, vds) {
        const { vgsThreshold, rdsOn, idMax } = this.specs;

        // Check if MOSFET is on
        const isOn = Math.abs(vgs) >= Math.abs(vgsThreshold);

        if (!isOn) {
            return {
                id: 0,
                vds: vds,
                region: 'cutoff'
            };
        }

        // Calculate drain current (simplified)
        let id = Math.abs(vds) / rdsOn;

        // Limit to max current
        id = Math.min(id, idMax);

        return {
            id,
            vds,
            region: 'triode',
            power: vds * id
        };
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        if (this.type.includes('MOSFET')) {
            this.renderMOSFET(ctx);
        } else {
            this.renderBJT(ctx);
        }

        ctx.restore();
    }

    renderBJT(ctx) {
        const size = 40;

        // Draw circle
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Draw base line
        ctx.beginPath();
        ctx.moveTo(-size / 2, 0);
        ctx.lineTo(-10, 0);
        ctx.stroke();

        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(-10, -15);
        ctx.lineTo(-10, 15);
        ctx.stroke();

        // Draw collector and emitter
        if (this.type === 'NPN') {
            // Collector (top)
            ctx.beginPath();
            ctx.moveTo(-10, -15);
            ctx.lineTo(10, -size / 2);
            ctx.stroke();

            // Emitter (bottom) with arrow
            ctx.beginPath();
            ctx.moveTo(-10, 15);
            ctx.lineTo(10, size / 2);
            ctx.stroke();

            // Arrow on emitter
            ctx.beginPath();
            ctx.moveTo(10, size / 2);
            ctx.lineTo(5, size / 2 - 5);
            ctx.moveTo(10, size / 2);
            ctx.lineTo(10 - 5, size / 2 - 3);
            ctx.stroke();
        } else {
            // PNP - arrow on collector
            ctx.beginPath();
            ctx.moveTo(-10, -15);
            ctx.lineTo(10, -size / 2);
            ctx.stroke();

            // Arrow on collector
            ctx.beginPath();
            ctx.moveTo(-10, -15);
            ctx.lineTo(-5, -15 + 5);
            ctx.moveTo(-10, -15);
            ctx.lineTo(-10 + 5, -15 + 3);
            ctx.stroke();

            // Emitter
            ctx.beginPath();
            ctx.moveTo(-10, 15);
            ctx.lineTo(10, size / 2);
            ctx.stroke();
        }

        // Labels
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '10px Arial';
        ctx.fillText(this.model, -15, -size / 2 - 5);
    }

    renderMOSFET(ctx) {
        const size = 40;

        // Draw circle
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Gate
        ctx.beginPath();
        ctx.moveTo(-size / 2, 0);
        ctx.lineTo(-12, 0);
        ctx.stroke();

        // Gate line
        ctx.beginPath();
        ctx.moveTo(-12, -15);
        ctx.lineTo(-12, 15);
        ctx.stroke();

        // Channel lines
        ctx.beginPath();
        ctx.moveTo(-8, -12);
        ctx.lineTo(-8, -4);
        ctx.moveTo(-8, -2);
        ctx.lineTo(-8, 2);
        ctx.moveTo(-8, 4);
        ctx.lineTo(-8, 12);
        ctx.stroke();

        // Drain and Source
        ctx.beginPath();
        ctx.moveTo(-8, -10);
        ctx.lineTo(10, -size / 2);
        ctx.moveTo(-8, 10);
        ctx.lineTo(10, size / 2);
        ctx.stroke();

        // Arrow (substrate)
        const arrowDir = this.type === 'N-MOSFET' ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(-2, 0);
        ctx.moveTo(-2, 0);
        ctx.lineTo(-4, arrowDir * 3);
        ctx.moveTo(-2, 0);
        ctx.lineTo(-4, -arrowDir * 3);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '10px Arial';
        ctx.fillText(this.model, -15, -size / 2 - 5);
    }
}

class OpAmp {
    constructor(model = 'LM358') {
        this.model = model;
        this.specs = this.getSpecs(model);
    }

    getSpecs(model) {
        const specs = {
            'LM741': {
                channels: 1,
                gainBandwidth: 1e6, // Hz
                slewRate: 0.5e6, // V/s
                inputOffset: 2e-3, // V
                supplyMin: 10,
                supplyMax: 36
            },
            'LM358': {
                channels: 2,
                gainBandwidth: 1e6,
                slewRate: 0.6e6,
                inputOffset: 2e-3,
                supplyMin: 3,
                supplyMax: 32
            },
            'TL072': {
                channels: 2,
                gainBandwidth: 3e6,
                slewRate: 13e6,
                inputOffset: 5e-3,
                supplyMin: 10,
                supplyMax: 36
            }
        };

        return specs[model] || specs['LM358'];
    }

    calculate(vPlus, vMinus, vSupplyPlus, vSupplyMinus) {
        const { inputOffset } = this.specs;

        // Ideal op-amp with offset
        const vDiff = (vPlus - vMinus) + inputOffset;

        // Open-loop gain (very high)
        const openLoopGain = 100000;

        // Output voltage (before saturation)
        let vOut = vDiff * openLoopGain;

        // Saturation limits (rail-to-rail - 1.5V)
        const vOutMax = vSupplyPlus - 1.5;
        const vOutMin = vSupplyMinus + 1.5;

        // Clamp output
        vOut = Math.max(vOutMin, Math.min(vOutMax, vOut));

        return {
            vOut,
            vDiff,
            saturated: vOut >= vOutMax || vOut <= vOutMin
        };
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const width = 50;
        const height = 60;

        // Draw triangle
        ctx.strokeStyle = '#ecf0f1';
        ctx.fillStyle = '#34495e';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(-width / 2, -height / 2);
        ctx.lineTo(-width / 2, height / 2);
        ctx.lineTo(width / 2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw + and - symbols
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '16px Arial';
        ctx.fillText('+', -width / 2 + 5, -height / 4 + 5);
        ctx.fillText('-', -width / 2 + 5, height / 4 + 5);

        // Model label
        ctx.font = '10px Arial';
        ctx.fillText(this.model, -15, 0);

        ctx.restore();
    }
}

class VoltageRegulator {
    constructor(model = '7805') {
        this.model = model;
        this.specs = this.getSpecs(model);
    }

    getSpecs(model) {
        const specs = {
            '7805': { vOut: 5, vDropout: 2, iMax: 1.5 },
            '7812': { vOut: 12, vDropout: 2, iMax: 1.5 },
            '7815': { vOut: 15, vDropout: 2, iMax: 1.5 },
            'LM317': { vOut: 'adjustable', vDropout: 3, iMax: 1.5, vRef: 1.25 }
        };

        return specs[model] || specs['7805'];
    }

    calculate(vIn, iLoad, r1 = 240, r2 = 240) {
        const { vOut, vDropout, iMax, vRef } = this.specs;

        // Calculate output voltage
        let vOutActual;
        if (this.model === 'LM317') {
            // Adjustable: Vout = Vref * (1 + R2/R1)
            vOutActual = vRef * (1 + r2 / r1);
        } else {
            vOutActual = vOut;
        }

        // Check dropout
        const isRegulating = vIn >= (vOutActual + vDropout);

        // Check current limit
        const isOverCurrent = iLoad > iMax;

        if (!isRegulating) {
            return {
                vOut: vIn - vDropout,
                iOut: iLoad,
                status: 'dropout',
                power: (vIn - vDropout) * iLoad
            };
        }

        if (isOverCurrent) {
            return {
                vOut: vOutActual,
                iOut: iMax,
                status: 'current_limit',
                power: (vIn - vOutActual) * iMax
            };
        }

        return {
            vOut: vOutActual,
            iOut: iLoad,
            status: 'normal',
            power: (vIn - vOutActual) * iLoad
        };
    }

    render(ctx, x, y, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const width = 40;
        const height = 50;

        // Draw IC package
        ctx.strokeStyle = '#ecf0f1';
        ctx.fillStyle = '#2c3e50';
        ctx.lineWidth = 2;

        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.strokeRect(-width / 2, -height / 2, width, height);

        // Draw pins
        ctx.beginPath();
        ctx.moveTo(-width / 2, -height / 3);
        ctx.lineTo(-width / 2 - 10, -height / 3);
        ctx.moveTo(-width / 2, 0);
        ctx.lineTo(-width / 2 - 10, 0);
        ctx.moveTo(-width / 2, height / 3);
        ctx.lineTo(-width / 2 - 10, height / 3);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(this.model, -15, 5);

        ctx.font = '8px Arial';
        ctx.fillText('IN', -width / 2 + 2, -height / 3 + 3);
        ctx.fillText('GND', -width / 2 + 2, 3);
        ctx.fillText('OUT', -width / 2 + 2, height / 3 + 3);

        ctx.restore();
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Transistor, OpAmp, VoltageRegulator };
}
