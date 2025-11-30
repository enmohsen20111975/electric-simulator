// Electronic Components - IEC 60617 & IEEE 315 Standards
// Active semiconductor devices with SPICE-level models

// ==================== DIODES ====================
const DIODES_STANDARD = {
    diode_standard: {
        name: 'Standard Rectifier Diode',
        category: 'semiconductors',
        symbol: '▷|',
        standard: 'IEC 60617, IEEE 315',
        Is: 1e-12, // Saturation current (A)
        n: 1.0, // Ideality factor
        Vt: 0.026, // Thermal voltage at 25°C (V)
        width: 50,
        height: 30,
        ports: { anode: { x: -25, y: 0 }, cathode: { x: 25, y: 0 } },
        simulate: function(V) {
            // Shockley Diode Equation: I = Is * (exp(V/(n*Vt)) - 1)
            const exponent = V / (this.n * this.Vt);
            if (exponent > 30) {
                // Prevent overflow, use linear approximation
                return { current: this.Is * Math.exp(30) * (exponent - 29), voltage: V, state: 'forward' };
            }
            const I = this.Is * (Math.exp(exponent) - 1);
            const state = V > 0.7 ? 'forward' : V < -50 ? 'breakdown' : 'reverse';
            return { current: I, voltage: V, state, power: V * I };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Triangle (anode side)
            ctx.beginPath();
            ctx.moveTo(-10, -12);
            ctx.lineTo(-10, 12);
            ctx.lineTo(5, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Vertical line (cathode)
            ctx.beginPath();
            ctx.moveTo(5, -12);
            ctx.lineTo(5, 12);
            ctx.stroke();
            
            // Leads
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-10, 0);
            ctx.moveTo(5, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            ctx.restore();
        }
    },
    
    zener_diode: {
        name: 'Zener Diode',
        category: 'semiconductors',
        symbol: '▷⌶',
        standard: 'IEC 60617',
        Is: 1e-12,
        n: 1.0,
        Vt: 0.026,
        Vz: 5.1, // Zener voltage (V)
        width: 50,
        height: 30,
        ports: { anode: { x: -25, y: 0 }, cathode: { x: 25, y: 0 } },
        simulate: function(V) {
            if (V > 0.7) {
                // Forward bias (normal diode)
                const I = this.Is * (Math.exp(V / (this.n * this.Vt)) - 1);
                return { current: I, voltage: V, state: 'forward' };
            } else if (V < -this.Vz) {
                // Reverse breakdown (Zener region)
                const I = -(Math.abs(V) - this.Vz) / 10; // Simplified model
                return { current: I, voltage: V, state: 'zener' };
            } else {
                // Reverse bias (off)
                return { current: -this.Is, voltage: V, state: 'reverse' };
            }
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Triangle
            ctx.beginPath();
            ctx.moveTo(-10, -12);
            ctx.lineTo(-10, 12);
            ctx.lineTo(5, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Z-shaped cathode
            ctx.beginPath();
            ctx.moveTo(5, -12);
            ctx.lineTo(5, 0);
            ctx.lineTo(10, 12);
            ctx.moveTo(0, 12);
            ctx.lineTo(5, 12);
            ctx.stroke();
            
            // Leads
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-10, 0);
            ctx.moveTo(10, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('Z', 8, -15);
            
            ctx.restore();
        }
    },
    
    schottky_diode: {
        name: 'Schottky Diode',
        category: 'semiconductors',
        symbol: '▷S',
        standard: 'IEC 60617',
        Is: 1e-8, // Higher saturation current
        n: 1.0,
        Vt: 0.026,
        Vf: 0.3, // Lower forward voltage
        width: 50,
        height: 30,
        ports: { anode: { x: -25, y: 0 }, cathode: { x: 25, y: 0 } },
        simulate: function(V) {
            const I = this.Is * (Math.exp(V / (this.n * this.Vt)) - 1);
            return { current: I, voltage: V, Vf: this.Vf };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Triangle
            ctx.beginPath();
            ctx.moveTo(-10, -12);
            ctx.lineTo(-10, 12);
            ctx.lineTo(5, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // S-shaped cathode
            ctx.beginPath();
            ctx.moveTo(0, -12);
            ctx.lineTo(5, -12);
            ctx.lineTo(5, 12);
            ctx.lineTo(10, 12);
            ctx.stroke();
            
            // Leads
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-10, 0);
            ctx.moveTo(5, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            ctx.restore();
        }
    },
    
    led: {
        name: 'LED (Light-Emitting Diode)',
        category: 'semiconductors',
        symbol: 'LED',
        standard: 'IEC 60617',
        Is: 1e-12,
        n: 2.0, // Higher ideality factor
        Vt: 0.026,
        Vf: 2.0, // Forward voltage (red LED)
        color: '#ff0000',
        width: 50,
        height: 30,
        ports: { anode: { x: -25, y: 0 }, cathode: { x: 25, y: 0 } },
        state: { on: false },
        simulate: function(V) {
            const I = this.Is * (Math.exp(V / (this.n * this.Vt)) - 1);
            this.state.on = V > this.Vf && I > 0.001; // 1mA threshold
            return { current: I, voltage: V, on: this.state.on };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            const isOn = component?.state?.on || false;
            ctx.strokeStyle = isOn ? component?.color || '#ff0000' : '#00ff00';
            ctx.fillStyle = isOn ? component?.color || '#ff0000' : '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Triangle
            ctx.beginPath();
            ctx.moveTo(-10, -12);
            ctx.lineTo(-10, 12);
            ctx.lineTo(5, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Cathode line
            ctx.beginPath();
            ctx.moveTo(5, -12);
            ctx.lineTo(5, 12);
            ctx.stroke();
            
            // Light rays
            if (isOn) {
                ctx.strokeStyle = component?.color || '#ff0000';
                ctx.beginPath();
                ctx.moveTo(5, -8);
                ctx.lineTo(15, -15);
                ctx.moveTo(13, -15);
                ctx.lineTo(15, -15);
                ctx.lineTo(15, -13);
                ctx.moveTo(8, -3);
                ctx.lineTo(18, -10);
                ctx.moveTo(16, -10);
                ctx.lineTo(18, -10);
                ctx.lineTo(18, -8);
                ctx.stroke();
                
                ctx.shadowColor = component?.color || '#ff0000';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Leads
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-10, 0);
            ctx.moveTo(5, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            ctx.restore();
        }
    },
    
    photodiode: {
        name: 'Photodiode',
        category: 'semiconductors',
        symbol: '◁☼',
        standard: 'IEC 60617',
        Is: 1e-12,
        n: 1.0,
        Vt: 0.026,
        responsivity: 0.5, // A/W
        width: 50,
        height: 30,
        ports: { anode: { x: -25, y: 0 }, cathode: { x: 25, y: 0 } },
        state: { lightIntensity: 0 }, // W/m²
        simulate: function(V) {
            // Reverse current proportional to light
            const I_dark = this.Is * (Math.exp(V / (this.n * this.Vt)) - 1);
            const I_photo = this.responsivity * this.state.lightIntensity;
            const I = I_dark - I_photo; // Reverse current
            return { current: I, voltage: V, lightIntensity: this.state.lightIntensity };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Diode symbol
            ctx.beginPath();
            ctx.moveTo(-10, -12);
            ctx.lineTo(-10, 12);
            ctx.lineTo(5, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(5, -12);
            ctx.lineTo(5, 12);
            ctx.stroke();
            
            // Incoming light arrows
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(-20, -15);
            ctx.lineTo(-10, -5);
            ctx.moveTo(-12, -9);
            ctx.lineTo(-10, -5);
            ctx.lineTo(-14, -7);
            ctx.moveTo(-15, -10);
            ctx.lineTo(-5, 0);
            ctx.moveTo(-7, -4);
            ctx.lineTo(-5, 0);
            ctx.lineTo(-9, -2);
            ctx.stroke();
            
            // Leads
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-10, 0);
            ctx.moveTo(5, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            ctx.restore();
        }
    }
};

// ==================== TRANSISTORS ====================
const TRANSISTORS_STANDARD = {
    bjt_npn: {
        name: 'NPN Bipolar Junction Transistor',
        category: 'semiconductors',
        symbol: 'NPN',
        standard: 'IEC 60617, IEEE 315',
        Is: 1e-14, // Saturation current
        beta: 100, // Current gain (hFE)
        Vbe: 0.7, // Base-emitter voltage
        width: 60,
        height: 60,
        ports: { collector: { x: 0, y: -30 }, base: { x: -30, y: 0 }, emitter: { x: 0, y: 30 } },
        simulate: function(Vbe, Vce) {
            // Ebers-Moll Model (simplified)
            if (Vbe > 0.7) {
                // Active region
                const Ib = (Vbe - this.Vbe) / 1000; // Simplified
                const Ic = this.beta * Ib;
                const Ie = Ic + Ib;
                const region = Vce > 0.2 ? 'active' : 'saturation';
                return { Ib, Ic, Ie, region, Vce, Vbe };
            } else {
                // Cutoff
                return { Ib: 0, Ic: 0, Ie: 0, region: 'cutoff', Vce, Vbe };
            }
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Base line (vertical)
            ctx.beginPath();
            ctx.moveTo(-10, -20);
            ctx.lineTo(-10, 20);
            ctx.stroke();
            
            // Collector
            ctx.beginPath();
            ctx.moveTo(-10, -10);
            ctx.lineTo(0, -20);
            ctx.lineTo(0, -30);
            ctx.stroke();
            
            // Emitter
            ctx.beginPath();
            ctx.moveTo(-10, 10);
            ctx.lineTo(0, 20);
            ctx.lineTo(0, 30);
            ctx.stroke();
            
            // Arrow on emitter (pointing out for NPN)
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(0, 20);
            ctx.lineTo(-3, 16);
            ctx.lineTo(3, 16);
            ctx.closePath();
            ctx.fill();
            
            // Base lead
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-10, 0);
            ctx.stroke();
            
            // Labels
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('C', 3, -25);
            ctx.fillText('B', -28, -3);
            ctx.fillText('E', 3, 28);
            
            ctx.restore();
        }
    },
    
    bjt_pnp: {
        name: 'PNP Bipolar Junction Transistor',
        category: 'semiconductors',
        symbol: 'PNP',
        standard: 'IEC 60617, IEEE 315',
        Is: 1e-14,
        beta: 100,
        Veb: 0.7,
        width: 60,
        height: 60,
        ports: { collector: { x: 0, y: -30 }, base: { x: -30, y: 0 }, emitter: { x: 0, y: 30 } },
        simulate: function(Veb, Vec) {
            if (Veb > 0.7) {
                const Ib = (Veb - this.Veb) / 1000;
                const Ic = this.beta * Ib;
                const Ie = Ic + Ib;
                const region = Vec > 0.2 ? 'active' : 'saturation';
                return { Ib, Ic, Ie, region, Vec, Veb };
            } else {
                return { Ib: 0, Ic: 0, Ie: 0, region: 'cutoff', Vec, Veb };
            }
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Base line
            ctx.beginPath();
            ctx.moveTo(-10, -20);
            ctx.lineTo(-10, 20);
            ctx.stroke();
            
            // Collector
            ctx.beginPath();
            ctx.moveTo(-10, -10);
            ctx.lineTo(0, -20);
            ctx.lineTo(0, -30);
            ctx.stroke();
            
            // Emitter
            ctx.beginPath();
            ctx.moveTo(-10, 10);
            ctx.lineTo(0, 20);
            ctx.lineTo(0, 30);
            ctx.stroke();
            
            // Arrow on emitter (pointing in for PNP)
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-10, 10);
            ctx.lineTo(-7, 14);
            ctx.lineTo(-13, 14);
            ctx.closePath();
            ctx.fill();
            
            // Base lead
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-10, 0);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('C', 3, -25);
            ctx.fillText('B', -28, -3);
            ctx.fillText('E', 3, 28);
            
            ctx.restore();
        }
    },
    
    mosfet_nch_enh: {
        name: 'N-Channel Enhancement MOSFET',
        category: 'semiconductors',
        symbol: 'NMOS',
        standard: 'IEC 60617, IEEE 315',
        Vth: 2.0, // Threshold voltage
        Kn: 0.001, // Transconductance parameter
        lambda: 0.01, // Channel-length modulation
        width: 60,
        height: 70,
        ports: { drain: { x: 20, y: -30 }, gate: { x: -30, y: 0 }, source: { x: 20, y: 30 }, body: { x: -10, y: 0 } },
        simulate: function(Vgs, Vds) {
            // Shichman-Hodges Model
            if (Vgs < this.Vth) {
                // Cutoff
                return { Id: 0, region: 'cutoff', Vgs, Vds };
            } else if (Vds < (Vgs - this.Vth)) {
                // Linear (Triode)
                const Id = this.Kn * ((Vgs - this.Vth) * Vds - 0.5 * Vds * Vds) * (1 + this.lambda * Vds);
                return { Id, region: 'linear', Vgs, Vds };
            } else {
                // Saturation
                const Id = 0.5 * this.Kn * Math.pow(Vgs - this.Vth, 2) * (1 + this.lambda * Vds);
                return { Id, region: 'saturation', Vgs, Vds };
            }
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Gate
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-10, 0);
            ctx.moveTo(-10, -25);
            ctx.lineTo(-10, 25);
            ctx.stroke();
            
            // Channel (broken line for enhancement)
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(0, -10);
            ctx.moveTo(0, -5);
            ctx.lineTo(0, 5);
            ctx.moveTo(0, 10);
            ctx.lineTo(0, 20);
            ctx.stroke();
            
            // Drain
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(20, -20);
            ctx.lineTo(20, -30);
            ctx.stroke();
            
            // Source
            ctx.beginPath();
            ctx.moveTo(0, 20);
            ctx.lineTo(20, 20);
            ctx.lineTo(20, 30);
            ctx.stroke();
            
            // Arrow (source, pointing in for NMOS)
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(5, -3);
            ctx.lineTo(5, 3);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('D', 22, -28);
            ctx.fillText('G', -28, -3);
            ctx.fillText('S', 22, 32);
            
            ctx.restore();
        }
    },
    
    mosfet_pch_enh: {
        name: 'P-Channel Enhancement MOSFET',
        category: 'semiconductors',
        symbol: 'PMOS',
        standard: 'IEC 60617, IEEE 315',
        Vth: -2.0,
        Kp: 0.0005,
        lambda: 0.01,
        width: 60,
        height: 70,
        ports: { drain: { x: 20, y: -30 }, gate: { x: -30, y: 0 }, source: { x: 20, y: 30 } },
        simulate: function(Vsg, Vsd) {
            if (Vsg < Math.abs(this.Vth)) {
                return { Id: 0, region: 'cutoff', Vsg, Vsd };
            } else if (Vsd < (Vsg - Math.abs(this.Vth))) {
                const Id = this.Kp * ((Vsg - Math.abs(this.Vth)) * Vsd - 0.5 * Vsd * Vsd);
                return { Id, region: 'linear', Vsg, Vsd };
            } else {
                const Id = 0.5 * this.Kp * Math.pow(Vsg - Math.abs(this.Vth), 2);
                return { Id, region: 'saturation', Vsg, Vsd };
            }
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Gate
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-10, 0);
            ctx.moveTo(-10, -25);
            ctx.lineTo(-10, 25);
            ctx.stroke();
            
            // Channel (broken)
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(0, -10);
            ctx.moveTo(0, -5);
            ctx.lineTo(0, 5);
            ctx.moveTo(0, 10);
            ctx.lineTo(0, 20);
            ctx.stroke();
            
            // Drain/Source
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(20, -20);
            ctx.lineTo(20, -30);
            ctx.moveTo(0, 20);
            ctx.lineTo(20, 20);
            ctx.lineTo(20, 30);
            ctx.stroke();
            
            // Arrow (pointing out for PMOS)
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-5, 0);
            ctx.lineTo(0, -3);
            ctx.lineTo(0, 3);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('D', 22, -28);
            ctx.fillText('G', -28, -3);
            ctx.fillText('S', 22, 32);
            
            ctx.restore();
        }
    },
    
    jfet_n: {
        name: 'N-Channel JFET',
        category: 'semiconductors',
        symbol: 'JFET-N',
        standard: 'IEC 60617',
        Vp: -4.0, // Pinch-off voltage
        Idss: 0.010, // Drain saturation current
        width: 60,
        height: 70,
        ports: { drain: { x: 20, y: -30 }, gate: { x: -30, y: 0 }, source: { x: 20, y: 30 } },
        simulate: function(Vgs, Vds) {
            // Quadratic Model
            if (Vgs <= this.Vp) {
                return { Id: 0, region: 'cutoff', Vgs, Vds };
            } else {
                const Id = this.Idss * Math.pow(1 - Vgs / this.Vp, 2);
                const region = Vds > (Vgs - this.Vp) ? 'saturation' : 'linear';
                return { Id, region, Vgs, Vds };
            }
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Gate
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-5, 0);
            ctx.stroke();
            
            // Channel (solid for JFET)
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(0, 25);
            ctx.stroke();
            
            // Drain/Source
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(20, -20);
            ctx.lineTo(20, -30);
            ctx.moveTo(0, 20);
            ctx.lineTo(20, 20);
            ctx.lineTo(20, 30);
            ctx.stroke();
            
            // Arrow on gate (pointing in for N-channel)
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-5, 0);
            ctx.lineTo(0, -3);
            ctx.lineTo(0, 3);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('D', 22, -28);
            ctx.fillText('G', -28, -3);
            ctx.fillText('S', 22, 32);
            
            ctx.restore();
        }
    }
};

// ==================== THYRISTORS ====================
const THYRISTORS_STANDARD = {
    scr: {
        name: 'SCR (Silicon-Controlled Rectifier)',
        category: 'semiconductors',
        symbol: 'SCR',
        standard: 'IEC 60617, IEEE 315',
        Vt: 0.7, // Trigger voltage
        Ih: 0.005, // Holding current
        width: 60,
        height: 70,
        ports: { anode: { x: 0, y: -35 }, gate: { x: -30, y: 10 }, cathode: { x: 0, y: 35 } },
        state: { latched: false },
        simulate: function(Vak, Vg, Ia) {
            // Two-transistor model with latching
            if (!this.state.latched) {
                // Turn on if gate triggered
                if (Vg > this.Vt && Vak > 0) {
                    this.state.latched = true;
                }
            }
            
            if (this.state.latched) {
                // Turn off if current below holding current
                if (Ia < this.Ih) {
                    this.state.latched = false;
                    return { current: 0, state: 'off', Vak };
                } else {
                    // Conducting
                    return { current: Ia, state: 'on', Vak: 1.0 }; // ~1V drop when on
                }
            } else {
                return { current: 0, state: 'off', Vak };
            }
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            const isOn = component?.state?.latched || false;
            ctx.strokeStyle = isOn ? '#ff0000' : '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Diode triangle
            ctx.beginPath();
            ctx.moveTo(-15, -10);
            ctx.lineTo(-15, 10);
            ctx.lineTo(10, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Cathode line
            ctx.beginPath();
            ctx.moveTo(-20, 10);
            ctx.lineTo(15, 10);
            ctx.stroke();
            
            // Anode/Cathode leads
            ctx.beginPath();
            ctx.moveTo(0, -35);
            ctx.lineTo(0, -10);
            ctx.moveTo(0, 10);
            ctx.lineTo(0, 35);
            ctx.stroke();
            
            // Gate
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(-30, 10);
            ctx.lineTo(-15, 5);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('A', 3, -30);
            ctx.fillText('G', -28, 8);
            ctx.fillText('K', 3, 32);
            
            ctx.restore();
        }
    },
    
    triac: {
        name: 'TRIAC',
        category: 'semiconductors',
        symbol: 'TRIAC',
        standard: 'IEC 60617',
        Vt: 0.7,
        Ih: 0.005,
        width: 60,
        height: 70,
        ports: { mt1: { x: 0, y: -35 }, gate: { x: -30, y: 0 }, mt2: { x: 0, y: 35 } },
        state: { latched: false },
        simulate: function(V, Vg, I) {
            // Bidirectional thyristor
            if (!this.state.latched && Math.abs(Vg) > this.Vt && V != 0) {
                this.state.latched = true;
            }
            
            if (this.state.latched) {
                if (Math.abs(I) < this.Ih) {
                    this.state.latched = false;
                    return { current: 0, state: 'off' };
                } else {
                    return { current: I, state: 'on' };
                }
            } else {
                return { current: 0, state: 'off' };
            }
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Two back-to-back thyristors
            // Upper
            ctx.beginPath();
            ctx.moveTo(-10, -15);
            ctx.lineTo(-10, -5);
            ctx.lineTo(5, -10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(-15, -5);
            ctx.lineTo(10, -5);
            ctx.stroke();
            
            // Lower
            ctx.beginPath();
            ctx.moveTo(10, 15);
            ctx.lineTo(10, 5);
            ctx.lineTo(-5, 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(15, 5);
            ctx.lineTo(-10, 5);
            ctx.stroke();
            
            // Terminals
            ctx.beginPath();
            ctx.moveTo(0, -35);
            ctx.lineTo(0, -15);
            ctx.moveTo(0, 15);
            ctx.lineTo(0, 35);
            ctx.stroke();
            
            // Gate
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-10, 0);
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('MT1', -8, -30);
            ctx.fillText('G', -28, -3);
            ctx.fillText('MT2', -8, 32);
            
            ctx.restore();
        }
    }
};

// Combine all electronic components
const ELECTRONIC_COMPONENTS_STANDARD = {
    ...DIODES_STANDARD,
    ...TRANSISTORS_STANDARD,
    ...THYRISTORS_STANDARD
};

// Export
if (typeof window !== 'undefined') {
    window.ELECTRONIC_COMPONENTS_STANDARD = ELECTRONIC_COMPONENTS_STANDARD;
}
