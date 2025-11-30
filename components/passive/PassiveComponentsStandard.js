// Passive Components - IEC 60617 & IEEE 315 Standards
// Complete library: Resistors, Capacitors, Inductors, Transformers

// ==================== RESISTORS ====================
const RESISTORS_STANDARD = {
    resistor_fixed: {
        name: 'Fixed Resistor',
        category: 'passive',
        symbol: 'R',
        standard: 'IEC 60617, IEEE 315',
        value: 1000, // Ohms
        tolerance: 5, // percent
        powerRating: 0.25, // Watts
        width: 60,
        height: 20,
        ports: { p1: { x: -30, y: 0 }, p2: { x: 30, y: 0 } },
        simulate: function(V) {
            // Ohm's Law: V = I * R
            const I = V / this.value;
            const P = V * I;
            if (P > this.powerRating) {
                console.warn(`Resistor overheating: ${P}W > ${this.powerRating}W`);
            }
            return { current: I, power: P, voltage: V };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            // IEC 60617 style (rectangle)
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Draw rectangle
            ctx.fillRect(-20, -8, 40, 16);
            ctx.strokeRect(-20, -8, 40, 16);
            
            // Draw leads
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-20, 0);
            ctx.moveTo(20, 0);
            ctx.lineTo(30, 0);
            ctx.stroke();
            
            // Label
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px Arial';
            ctx.fillText('R', -5, 4);
            
            // Value annotation
            if (component?.value) {
                ctx.font = '8px Arial';
                const val = component.value >= 1e6 ? `${component.value/1e6}MΩ` :
                           component.value >= 1e3 ? `${component.value/1e3}kΩ` :
                           `${component.value}Ω`;
                ctx.fillText(val, -15, -12);
            }
            
            ctx.restore();
        }
    },
    
    potentiometer: {
        name: 'Potentiometer',
        category: 'passive',
        symbol: 'POT',
        standard: 'IEC 60617',
        value: 10000, // Ohms (total resistance)
        position: 0.5, // 0.0 to 1.0 (wiper position)
        width: 60,
        height: 40,
        ports: { p1: { x: -30, y: 0 }, wiper: { x: 0, y: 20 }, p2: { x: 30, y: 0 } },
        simulate: function(V1, V2) {
            // Voltage divider: V_wiper = V1 + (V2-V1) * position
            const R1 = this.value * this.position;
            const R2 = this.value * (1 - this.position);
            const V_wiper = V1 + (V2 - V1) * this.position;
            return { R1, R2, V_wiper };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Rectangle
            ctx.fillRect(-20, -8, 40, 16);
            ctx.strokeRect(-20, -8, 40, 16);
            
            // Leads
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-20, 0);
            ctx.moveTo(20, 0);
            ctx.lineTo(30, 0);
            ctx.stroke();
            
            // Wiper (arrow)
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(0, 8);
            ctx.lineTo(0, 20);
            ctx.moveTo(-3, 12);
            ctx.lineTo(0, 8);
            ctx.lineTo(3, 12);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('POT', -10, 4);
            
            ctx.restore();
        }
    },
    
    rheostat: {
        name: 'Rheostat',
        category: 'passive',
        symbol: 'RH',
        standard: 'IEEE 315',
        value: 100, // Ohms
        position: 0.5,
        width: 60,
        height: 40,
        ports: { p1: { x: -30, y: 0 }, wiper: { x: 0, y: 20 } },
        simulate: function() {
            const R_tap = this.value * this.position;
            return { resistance: R_tap };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Variable resistor symbol
            ctx.fillRect(-20, -8, 40, 16);
            ctx.strokeRect(-20, -8, 40, 16);
            
            // Diagonal arrow
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(-15, -15);
            ctx.lineTo(15, 15);
            ctx.moveTo(10, 10);
            ctx.lineTo(15, 15);
            ctx.lineTo(10, 15);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('RH', -8, 4);
            
            ctx.restore();
        }
    }
};

// ==================== CAPACITORS ====================
const CAPACITORS_STANDARD = {
    capacitor_fixed: {
        name: 'Fixed Capacitor',
        category: 'passive',
        symbol: 'C',
        standard: 'IEC 60617, IEEE 315',
        value: 100e-9, // Farads (100nF)
        voltage: 50, // Voltage rating
        width: 50,
        height: 30,
        ports: { p1: { x: -25, y: 0 }, p2: { x: 25, y: 0 } },
        state: { voltage: 0, charge: 0 },
        simulate: function(V, dt) {
            // I = C * dV/dt
            const dV = V - this.state.voltage;
            const I = this.value * (dV / dt);
            this.state.voltage = V;
            this.state.charge = this.value * V;
            
            if (Math.abs(V) > this.voltage) {
                console.warn(`Capacitor overvoltage: ${V}V > ${this.voltage}V`);
            }
            
            return { current: I, charge: this.state.charge, energy: 0.5 * this.value * V * V };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Two parallel lines (IEC 60617)
            ctx.beginPath();
            ctx.moveTo(-5, -15);
            ctx.lineTo(-5, 15);
            ctx.moveTo(5, -15);
            ctx.lineTo(5, 15);
            ctx.stroke();
            
            // Leads
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-5, 0);
            ctx.moveTo(5, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            // Label
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px Arial';
            ctx.fillText('C', -3, -18);
            
            if (component?.value) {
                ctx.font = '8px Arial';
                const val = component.value >= 1e-6 ? `${component.value*1e6}µF` :
                           component.value >= 1e-9 ? `${component.value*1e9}nF` :
                           `${component.value*1e12}pF`;
                ctx.fillText(val, -15, 22);
            }
            
            ctx.restore();
        }
    },
    
    capacitor_polarized: {
        name: 'Polarized Capacitor (Electrolytic)',
        category: 'passive',
        symbol: 'C+',
        standard: 'IEC 60617',
        value: 100e-6, // Farads (100µF)
        voltage: 25,
        width: 50,
        height: 30,
        ports: { positive: { x: -25, y: 0 }, negative: { x: 25, y: 0 } },
        state: { voltage: 0, charge: 0 },
        simulate: function(V, dt) {
            if (V < 0) {
                console.error('Reverse polarity on electrolytic capacitor!');
            }
            const dV = V - this.state.voltage;
            const I = this.value * (dV / dt);
            this.state.voltage = V;
            this.state.charge = this.value * V;
            return { current: I, charge: this.state.charge };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Negative plate (straight line)
            ctx.beginPath();
            ctx.moveTo(-5, -15);
            ctx.lineTo(-5, 15);
            ctx.stroke();
            
            // Positive plate (curved)
            ctx.beginPath();
            ctx.arc(5, 0, 15, -Math.PI/2, Math.PI/2);
            ctx.stroke();
            
            // Leads
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-5, 0);
            ctx.moveTo(20, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            // Plus sign
            ctx.strokeStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-22, 0);
            ctx.moveTo(-26, -4);
            ctx.lineTo(-26, 4);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px Arial';
            ctx.fillText('C+', -3, -18);
            
            ctx.restore();
        }
    }
};

// ==================== INDUCTORS ====================
const INDUCTORS_STANDARD = {
    inductor_fixed: {
        name: 'Fixed Inductor',
        category: 'passive',
        symbol: 'L',
        standard: 'IEC 60617, IEEE 315',
        value: 10e-3, // Henries (10mH)
        resistance: 0.1, // DC resistance (Ohms)
        width: 60,
        height: 30,
        ports: { p1: { x: -30, y: 0 }, p2: { x: 30, y: 0 } },
        state: { current: 0, flux: 0 },
        simulate: function(V, dt) {
            // V = L * dI/dt
            const dI = (V - this.resistance * this.state.current) / this.value * dt;
            this.state.current += dI;
            this.state.flux = this.value * this.state.current;
            
            const energy = 0.5 * this.value * this.state.current * this.state.current;
            return { current: this.state.current, flux: this.state.flux, energy };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = 'transparent';
            ctx.lineWidth = 2;
            
            // Draw coil (3 loops)
            const loops = 3;
            const loopWidth = 12;
            const startX = -(loops * loopWidth) / 2;
            
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(startX, 0);
            
            for (let i = 0; i < loops; i++) {
                const x1 = startX + i * loopWidth;
                ctx.arc(x1 + loopWidth/2, 0, loopWidth/2, Math.PI, 0, false);
            }
            
            ctx.lineTo(30, 0);
            ctx.stroke();
            
            // Label
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px Arial';
            ctx.fillText('L', -5, -12);
            
            if (component?.value) {
                ctx.font = '8px Arial';
                const val = component.value >= 1 ? `${component.value}H` :
                           component.value >= 1e-3 ? `${component.value*1e3}mH` :
                           `${component.value*1e6}µH`;
                ctx.fillText(val, -12, 18);
            }
            
            ctx.restore();
        }
    },
    
    inductor_tapped: {
        name: 'Tapped Inductor',
        category: 'passive',
        symbol: 'L⊤',
        standard: 'IEC 60617',
        value: 10e-3, // Total inductance
        tapPosition: 0.5, // 0.0 to 1.0
        width: 60,
        height: 40,
        ports: { p1: { x: -30, y: 0 }, tap: { x: 0, y: 20 }, p2: { x: 30, y: 0 } },
        state: { current: 0 },
        simulate: function() {
            const L1 = this.value * this.tapPosition;
            const L2 = this.value * (1 - this.tapPosition);
            return { L1, L2 };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Coil
            const loops = 3;
            const loopWidth = 12;
            const startX = -(loops * loopWidth) / 2;
            
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(startX, 0);
            
            for (let i = 0; i < loops; i++) {
                const x1 = startX + i * loopWidth;
                ctx.arc(x1 + loopWidth/2, 0, loopWidth/2, Math.PI, 0, false);
            }
            
            ctx.lineTo(30, 0);
            ctx.stroke();
            
            // Tap
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 20);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px Arial';
            ctx.fillText('L', -5, -12);
            
            ctx.restore();
        }
    },
    
    inductor_core: {
        name: 'Inductor with Core',
        category: 'passive',
        symbol: 'L⊓',
        standard: 'IEC 60617',
        value: 100e-3,
        coreType: 'iron', // iron, ferrite, air
        width: 60,
        height: 35,
        ports: { p1: { x: -30, y: 0 }, p2: { x: 30, y: 0 } },
        state: { current: 0 },
        simulate: function(V, dt) {
            const dI = V / this.value * dt;
            this.state.current += dI;
            return { current: this.state.current };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Coil
            const loops = 3;
            const loopWidth = 12;
            const startX = -(loops * loopWidth) / 2;
            
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(startX, 0);
            
            for (let i = 0; i < loops; i++) {
                const x1 = startX + i * loopWidth;
                ctx.arc(x1 + loopWidth/2, 0, loopWidth/2, Math.PI, 0, false);
            }
            
            ctx.lineTo(30, 0);
            ctx.stroke();
            
            // Core (parallel lines below coil)
            ctx.strokeStyle = '#888888';
            ctx.beginPath();
            ctx.moveTo(-20, 8);
            ctx.lineTo(20, 8);
            ctx.moveTo(-20, 11);
            ctx.lineTo(20, 11);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px Arial';
            ctx.fillText('L', -5, -12);
            
            ctx.restore();
        }
    }
};

// ==================== TRANSFORMERS ====================
const TRANSFORMERS_STANDARD = {
    transformer_ideal: {
        name: 'Ideal Transformer',
        category: 'transformers',
        symbol: '⧉',
        standard: 'IEC 60617, IEEE 315',
        turnsRatio: 1, // N1:N2 (e.g., 2 means 2:1 stepdown)
        width: 80,
        height: 60,
        ports: { 
            p1: { x: -40, y: -15 }, p2: { x: -40, y: 15 },
            s1: { x: 40, y: -15 }, s2: { x: 40, y: 15 }
        },
        simulate: function(V_primary, I_primary) {
            // Ideal transformer equations
            const V_secondary = V_primary / this.turnsRatio;
            const I_secondary = I_primary * this.turnsRatio;
            const power = V_primary * I_primary; // Conserved
            
            return { 
                V_secondary, 
                I_secondary, 
                power,
                ratio: this.turnsRatio 
            };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = 'transparent';
            ctx.lineWidth = 2;
            
            // Primary coil (left)
            ctx.beginPath();
            ctx.moveTo(-40, -15);
            ctx.lineTo(-25, -15);
            for (let i = 0; i < 3; i++) {
                ctx.arc(-25, -10 + i*10, 5, Math.PI, 0, false);
            }
            ctx.lineTo(-25, 15);
            ctx.lineTo(-40, 15);
            ctx.stroke();
            
            // Secondary coil (right)
            ctx.beginPath();
            ctx.moveTo(40, -15);
            ctx.lineTo(25, -15);
            for (let i = 0; i < 3; i++) {
                ctx.arc(25, -10 + i*10, 5, 0, Math.PI, true);
            }
            ctx.lineTo(25, 15);
            ctx.lineTo(40, 15);
            ctx.stroke();
            
            // Core (vertical lines)
            ctx.strokeStyle = '#888888';
            ctx.beginPath();
            ctx.moveTo(-5, -25);
            ctx.lineTo(-5, 25);
            ctx.moveTo(5, -25);
            ctx.lineTo(5, 25);
            ctx.stroke();
            
            // Labels
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('P', -35, -20);
            ctx.fillText('S', 30, -20);
            
            if (component?.turnsRatio) {
                ctx.fillText(`1:${component.turnsRatio}`, -10, -28);
            }
            
            ctx.restore();
        }
    },
    
    transformer_realworld: {
        name: 'Real Transformer',
        category: 'transformers',
        symbol: '⧉*',
        standard: 'IEC 60617',
        turnsRatio: 1,
        resistance_primary: 0.1,
        resistance_secondary: 0.1,
        leakage_inductance: 1e-6,
        magnetizing_inductance: 100e-3,
        core_loss: 0.01, // Watts
        width: 80,
        height: 60,
        ports: { 
            p1: { x: -40, y: -15 }, p2: { x: -40, y: 15 },
            s1: { x: 40, y: -15 }, s2: { x: 40, y: 15 }
        },
        simulate: function(V_primary, I_primary) {
            // Non-ideal model
            const V_drop_primary = I_primary * this.resistance_primary;
            const V_ideal = V_primary - V_drop_primary;
            
            const V_secondary_ideal = V_ideal / this.turnsRatio;
            const I_secondary_ideal = I_primary * this.turnsRatio;
            
            const V_drop_secondary = I_secondary_ideal * this.resistance_secondary;
            const V_secondary = V_secondary_ideal - V_drop_secondary;
            
            const power_loss = Math.pow(I_primary, 2) * this.resistance_primary + 
                              Math.pow(I_secondary_ideal, 2) * this.resistance_secondary + 
                              this.core_loss;
            
            const efficiency = (V_secondary * I_secondary_ideal) / (V_primary * I_primary) * 100;
            
            return { 
                V_secondary, 
                I_secondary: I_secondary_ideal,
                power_loss,
                efficiency
            };
        },
        render: (ctx, x, y, rotation = 0) => {
            // Same as ideal transformer, but with '*' marker
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = 'transparent';
            ctx.lineWidth = 2;
            
            // Primary
            ctx.beginPath();
            ctx.moveTo(-40, -15);
            ctx.lineTo(-25, -15);
            for (let i = 0; i < 3; i++) {
                ctx.arc(-25, -10 + i*10, 5, Math.PI, 0, false);
            }
            ctx.lineTo(-25, 15);
            ctx.lineTo(-40, 15);
            ctx.stroke();
            
            // Secondary
            ctx.beginPath();
            ctx.moveTo(40, -15);
            ctx.lineTo(25, -15);
            for (let i = 0; i < 3; i++) {
                ctx.arc(25, -10 + i*10, 5, 0, Math.PI, true);
            }
            ctx.lineTo(25, 15);
            ctx.lineTo(40, 15);
            ctx.stroke();
            
            // Core
            ctx.strokeStyle = '#888888';
            ctx.beginPath();
            ctx.moveTo(-5, -25);
            ctx.lineTo(-5, 25);
            ctx.moveTo(5, -25);
            ctx.lineTo(5, 25);
            ctx.stroke();
            
            // Non-ideal marker
            ctx.fillStyle = '#ff0000';
            ctx.font = '12px Arial';
            ctx.fillText('*', 0, 30);
            
            ctx.restore();
        }
    }
};

// Combine all passive components
const PASSIVE_COMPONENTS_STANDARD = {
    ...RESISTORS_STANDARD,
    ...CAPACITORS_STANDARD,
    ...INDUCTORS_STANDARD,
    ...TRANSFORMERS_STANDARD
};

// Export
if (typeof window !== 'undefined') {
    window.PASSIVE_COMPONENTS_STANDARD = PASSIVE_COMPONENTS_STANDARD;
}
