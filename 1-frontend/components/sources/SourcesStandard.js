// Sources & Controlled Sources - IEC 60617 & IEEE 315 Standards
// Complete power source library with dependent sources

// ==================== INDEPENDENT SOURCES ====================
const VOLTAGE_SOURCES = {
    vdc_source: {
        name: 'DC Voltage Source',
        category: 'sources',
        symbol: 'V⎓',
        standard: 'IEC 60617, IEEE 315',
        voltage: 12, // Volts
        width: 50,
        height: 50,
        ports: { positive: { x: 0, y: -25 }, negative: { x: 0, y: 25 } },
        simulate: function() {
            return { voltage: this.voltage, current: 0, power: 0 };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#ff0000';
            ctx.fillStyle = 'transparent';
            ctx.lineWidth = 2;
            
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.stroke();
            
            // + and - symbols
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('+', -5, -5);
            ctx.fillText('−', -5, 15);
            
            // Terminals
            ctx.strokeStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(0, -18);
            ctx.moveTo(0, 18);
            ctx.lineTo(0, 25);
            ctx.stroke();
            
            // Value
            if (component?.voltage) {
                ctx.fillStyle = '#ff0000';
                ctx.font = '10px Arial';
                ctx.fillText(`${component.voltage}V`, 20, 5);
            }
            
            ctx.restore();
        }
    },
    
    vac_source: {
        name: 'AC Voltage Source',
        category: 'sources',
        symbol: 'V~',
        standard: 'IEC 60617, IEEE 315',
        amplitude: 120, // Volts peak
        frequency: 60, // Hz
        phase: 0, // degrees
        width: 50,
        height: 50,
        ports: { positive: { x: 0, y: -25 }, negative: { x: 0, y: 25 } },
        simulate: function(t) {
            const omega = 2 * Math.PI * this.frequency;
            const voltage = this.amplitude * Math.sin(omega * t + this.phase * Math.PI / 180);
            return { voltage, frequency: this.frequency, phase: this.phase };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.stroke();
            
            // Sine wave
            ctx.beginPath();
            for (let i = -10; i <= 10; i++) {
                const angle = i * Math.PI / 10;
                const yPos = 8 * Math.sin(angle);
                if (i === -10) {
                    ctx.moveTo(i, yPos);
                } else {
                    ctx.lineTo(i, yPos);
                }
            }
            ctx.stroke();
            
            // Terminals
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(0, -18);
            ctx.moveTo(0, 18);
            ctx.lineTo(0, 25);
            ctx.stroke();
            
            // Value
            if (component?.amplitude && component?.frequency) {
                ctx.fillStyle = '#ff0000';
                ctx.font = '8px Arial';
                ctx.fillText(`${component.amplitude}V`, 20, 0);
                ctx.fillText(`${component.frequency}Hz`, 20, 10);
            }
            
            ctx.restore();
        }
    },
    
    idc_source: {
        name: 'DC Current Source',
        category: 'sources',
        symbol: 'I⎓',
        standard: 'IEC 60617, IEEE 315',
        current: 0.001, // Amperes (1mA)
        width: 50,
        height: 50,
        ports: { positive: { x: 0, y: -25 }, negative: { x: 0, y: 25 } },
        simulate: function() {
            return { current: this.current, voltage: 0, power: 0 };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.stroke();
            
            // Arrow (upward for current direction)
            ctx.beginPath();
            ctx.moveTo(0, 10);
            ctx.lineTo(0, -10);
            ctx.moveTo(-5, -5);
            ctx.lineTo(0, -10);
            ctx.lineTo(5, -5);
            ctx.stroke();
            
            // Terminals
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(0, -18);
            ctx.moveTo(0, 18);
            ctx.lineTo(0, 25);
            ctx.stroke();
            
            // Value
            if (component?.current) {
                ctx.fillStyle = '#00ffff';
                ctx.font = '8px Arial';
                const val = component.current >= 1 ? `${component.current}A` :
                           component.current >= 1e-3 ? `${component.current*1e3}mA` :
                           `${component.current*1e6}µA`;
                ctx.fillText(val, 20, 5);
            }
            
            ctx.restore();
        }
    },
    
    pulse_source: {
        name: 'Pulse Source',
        category: 'sources',
        symbol: '⎍',
        standard: 'IEEE 315',
        v_low: 0,
        v_high: 5,
        period: 1e-3, // 1ms
        dutyCycle: 50, // percent
        width: 50,
        height: 50,
        ports: { positive: { x: 0, y: -25 }, negative: { x: 0, y: 25 } },
        simulate: function(t) {
            const cyclePos = (t % this.period) / this.period;
            const voltage = cyclePos < (this.dutyCycle / 100) ? this.v_high : this.v_low;
            return { voltage, period: this.period, duty: this.dutyCycle };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.stroke();
            
            // Square wave
            ctx.beginPath();
            ctx.moveTo(-10, 8);
            ctx.lineTo(-10, -8);
            ctx.lineTo(-2, -8);
            ctx.lineTo(-2, 8);
            ctx.lineTo(6, 8);
            ctx.lineTo(6, -8);
            ctx.lineTo(10, -8);
            ctx.stroke();
            
            // Terminals
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(0, -18);
            ctx.moveTo(0, 18);
            ctx.lineTo(0, 25);
            ctx.stroke();
            
            ctx.restore();
        }
    }
};

// ==================== DEPENDENT SOURCES ====================
const CONTROLLED_SOURCES = {
    vcvs: {
        name: 'VCVS (Voltage-Controlled Voltage Source)',
        category: 'sources',
        symbol: 'E',
        standard: 'IEC 60617',
        gain: 10, // V/V
        width: 60,
        height: 60,
        ports: { 
            vout_pos: { x: 0, y: -30 }, vout_neg: { x: 0, y: 30 },
            vin_pos: { x: -30, y: -10 }, vin_neg: { x: -30, y: 10 }
        },
        simulate: function(Vin) {
            const Vout = this.gain * Vin;
            return { Vout, gain: this.gain, type: 'VCVS' };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 2;
            
            // Diamond shape
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(15, 0);
            ctx.lineTo(0, 20);
            ctx.lineTo(-15, 0);
            ctx.closePath();
            ctx.stroke();
            
            // Label
            ctx.fillStyle = '#ff00ff';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('E', -4, 5);
            
            // Terminals
            ctx.strokeStyle = '#ff00ff';
            ctx.beginPath();
            // Output
            ctx.moveTo(0, -30);
            ctx.lineTo(0, -20);
            ctx.moveTo(0, 20);
            ctx.lineTo(0, 30);
            // Input (control)
            ctx.moveTo(-30, -10);
            ctx.lineTo(-20, -10);
            ctx.moveTo(-30, 10);
            ctx.lineTo(-20, 10);
            ctx.stroke();
            
            // Plus/minus
            ctx.fillStyle = '#ff00ff';
            ctx.font = '10px Arial';
            ctx.fillText('+', -25, -8);
            ctx.fillText('−', -25, 12);
            
            ctx.restore();
        }
    },
    
    vccs: {
        name: 'VCCS (Voltage-Controlled Current Source)',
        category: 'sources',
        symbol: 'G',
        standard: 'IEC 60617',
        transconductance: 0.001, // S (Siemens) = A/V
        width: 60,
        height: 60,
        ports: { 
            iout_pos: { x: 0, y: -30 }, iout_neg: { x: 0, y: 30 },
            vin_pos: { x: -30, y: -10 }, vin_neg: { x: -30, y: 10 }
        },
        simulate: function(Vin) {
            const Iout = this.transconductance * Vin;
            return { Iout, gm: this.transconductance, type: 'VCCS' };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            
            // Diamond
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(15, 0);
            ctx.lineTo(0, 20);
            ctx.lineTo(-15, 0);
            ctx.closePath();
            ctx.stroke();
            
            // Arrow (current)
            ctx.beginPath();
            ctx.moveTo(0, 8);
            ctx.lineTo(0, -8);
            ctx.moveTo(-3, -4);
            ctx.lineTo(0, -8);
            ctx.lineTo(3, -4);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff88';
            ctx.font = 'bold 10px Arial';
            ctx.fillText('G', -4, 18);
            
            ctx.restore();
        }
    },
    
    ccvs: {
        name: 'CCVS (Current-Controlled Voltage Source)',
        category: 'sources',
        symbol: 'H',
        standard: 'IEC 60617',
        transresistance: 1000, // Ohms = V/A
        width: 60,
        height: 60,
        ports: { 
            vout_pos: { x: 0, y: -30 }, vout_neg: { x: 0, y: 30 },
            iin_pos: { x: -30, y: 0 }, iin_neg: { x: 30, y: 0 }
        },
        simulate: function(Iin) {
            const Vout = this.transresistance * Iin;
            return { Vout, rm: this.transresistance, type: 'CCVS' };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#ff8800';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(15, 0);
            ctx.lineTo(0, 20);
            ctx.lineTo(-15, 0);
            ctx.closePath();
            ctx.stroke();
            
            ctx.fillStyle = '#ff8800';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('H', -4, 5);
            
            ctx.restore();
        }
    },
    
    cccs: {
        name: 'CCCS (Current-Controlled Current Source)',
        category: 'sources',
        symbol: 'F',
        standard: 'IEC 60617',
        gain: 50, // A/A (current gain)
        width: 60,
        height: 60,
        ports: { 
            iout_pos: { x: 0, y: -30 }, iout_neg: { x: 0, y: 30 },
            iin_pos: { x: -30, y: 0 }, iin_neg: { x: 30, y: 0 }
        },
        simulate: function(Iin) {
            const Iout = this.gain * Iin;
            return { Iout, beta: this.gain, type: 'CCCS' };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#8800ff';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(15, 0);
            ctx.lineTo(0, 20);
            ctx.lineTo(-15, 0);
            ctx.closePath();
            ctx.stroke();
            
            // Arrow
            ctx.beginPath();
            ctx.moveTo(0, 8);
            ctx.lineTo(0, -8);
            ctx.moveTo(-3, -4);
            ctx.lineTo(0, -8);
            ctx.lineTo(3, -4);
            ctx.stroke();
            
            ctx.fillStyle = '#8800ff';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('F', -4, 18);
            
            ctx.restore();
        }
    }
};

// ==================== MEASUREMENT INSTRUMENTS ====================
const MEASUREMENT_INSTRUMENTS = {
    ammeter: {
        name: 'Ammeter',
        category: 'measurement',
        symbol: 'A',
        standard: 'IEC 60617, IEEE 315',
        resistance: 0, // Ideal: zero resistance
        width: 50,
        height: 50,
        ports: { p1: { x: -25, y: 0 }, p2: { x: 25, y: 0 } },
        state: { current: 0 },
        simulate: function(I) {
            this.state.current = I;
            return { current: I, voltage_drop: I * this.resistance };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.stroke();
            
            // Letter A
            ctx.fillStyle = '#00ffff';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('A', -6, 6);
            
            // Terminals
            ctx.strokeStyle = '#00ffff';
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-18, 0);
            ctx.moveTo(18, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            // Reading
            if (component?.state?.current !== undefined) {
                ctx.fillStyle = '#00ffff';
                ctx.font = '8px Arial';
                const val = Math.abs(component.state.current) >= 1 ? `${component.state.current.toFixed(2)}A` :
                           Math.abs(component.state.current) >= 1e-3 ? `${(component.state.current*1e3).toFixed(1)}mA` :
                           `${(component.state.current*1e6).toFixed(0)}µA`;
                ctx.fillText(val, -15, -22);
            }
            
            ctx.restore();
        }
    },
    
    voltmeter: {
        name: 'Voltmeter',
        category: 'measurement',
        symbol: 'V',
        standard: 'IEC 60617, IEEE 315',
        resistance: 1e9, // Ideal: infinite resistance
        width: 50,
        height: 50,
        ports: { positive: { x: 0, y: -25 }, negative: { x: 0, y: 25 } },
        state: { voltage: 0 },
        simulate: function(V) {
            this.state.voltage = V;
            const I = V / this.resistance;
            return { voltage: V, current: I };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.stroke();
            
            // Letter V
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('V', -6, 6);
            
            // Terminals
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(0, -18);
            ctx.moveTo(0, 18);
            ctx.lineTo(0, 25);
            ctx.stroke();
            
            // Reading
            if (component?.state?.voltage !== undefined) {
                ctx.fillStyle = '#ffff00';
                ctx.font = '8px Arial';
                ctx.fillText(`${component.state.voltage.toFixed(2)}V`, 20, 5);
            }
            
            ctx.restore();
        }
    },
    
    wattmeter: {
        name: 'Wattmeter',
        category: 'measurement',
        symbol: 'W',
        standard: 'IEC 60617',
        width: 60,
        height: 60,
        ports: { 
            v_pos: { x: -30, y: -15 }, v_neg: { x: -30, y: 15 },
            i_in: { x: 30, y: -15 }, i_out: { x: 30, y: 15 }
        },
        state: { power: 0 },
        simulate: function(V, I) {
            this.state.power = V * I;
            return { power: this.state.power, voltage: V, current: I };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 2;
            
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, 22, 0, Math.PI * 2);
            ctx.stroke();
            
            // Letter W
            ctx.fillStyle = '#ff00ff';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('W', -7, 6);
            
            // Terminals
            ctx.strokeStyle = '#ff00ff';
            ctx.beginPath();
            ctx.moveTo(-30, -15);
            ctx.lineTo(-22, -15);
            ctx.moveTo(-30, 15);
            ctx.lineTo(-22, 15);
            ctx.moveTo(30, -15);
            ctx.lineTo(22, -15);
            ctx.moveTo(30, 15);
            ctx.lineTo(22, 15);
            ctx.stroke();
            
            // Reading
            if (component?.state?.power !== undefined) {
                ctx.fillStyle = '#ff00ff';
                ctx.font = '8px Arial';
                const val = Math.abs(component.state.power) >= 1 ? `${component.state.power.toFixed(2)}W` :
                           Math.abs(component.state.power) >= 1e-3 ? `${(component.state.power*1e3).toFixed(1)}mW` :
                           `${(component.state.power*1e6).toFixed(0)}µW`;
                ctx.fillText(val, -12, -28);
            }
            
            ctx.restore();
        }
    }
};

// Combine all sources
const SOURCES_STANDARD = {
    ...VOLTAGE_SOURCES,
    ...CONTROLLED_SOURCES,
    ...MEASUREMENT_INSTRUMENTS
};

// Export
if (typeof window !== 'undefined') {
    window.SOURCES_STANDARD = SOURCES_STANDARD;
}
