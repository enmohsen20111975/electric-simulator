// Protection & Control Components - IEC 60617 & IEEE 315 Standards
// Fuses, Circuit Breakers, Switches, Relays

// ==================== PROTECTION DEVICES ====================
const PROTECTION_COMPONENTS = {
    fuse: {
        name: 'Fuse',
        category: 'protection',
        symbol: 'F',
        standard: 'IEC 60617-11-05-02',
        rating: 1.0, // Amperes
        blowTime: 0.1, // Seconds at 200% rating
        resistance: 0.01, // Ohms (intact)
        width: 50,
        height: 30,
        ports: { 
            left: { x: -25, y: 0 }, 
            right: { x: 25, y: 0 } 
        },
        state: { blown: false, I_squared_t: 0 },
        simulate: function(I, dt) {
            if (this.state.blown) {
                return { 
                    R: 1e9, // Open circuit
                    V: 0, 
                    status: 'blown',
                    power: 0
                };
            }
            
            // I²t integration for thermal fusing
            this.state.I_squared_t += I * I * dt;
            
            // Blow condition: I²t exceeds rating
            const I_squared_t_rating = (2 * this.rating) ** 2 * this.blowTime;
            if (this.state.I_squared_t > I_squared_t_rating) {
                this.state.blown = true;
                return { 
                    R: 1e9, 
                    V: 0, 
                    status: 'BLOWN!',
                    power: 0
                };
            }
            
            const V = I * this.resistance;
            return {
                R: this.resistance,
                V,
                I,
                status: I > this.rating * 1.5 ? 'warning' : 'normal',
                power: V * I,
                I_squared_t: this.state.I_squared_t
            };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            const isBlown = component?.state?.blown;
            ctx.strokeStyle = isBlown ? '#ff0000' : '#00ff00';
            ctx.lineWidth = 2;
            
            // Fuse symbol (rectangle with line)
            ctx.strokeRect(-15, -10, 30, 20);
            
            if (!isBlown) {
                ctx.beginPath();
                ctx.moveTo(-10, 0);
                ctx.lineTo(10, 0);
                ctx.stroke();
            } else {
                // Blown indicator (break symbol)
                ctx.strokeStyle = '#ff0000';
                ctx.beginPath();
                ctx.moveTo(-10, 0);
                ctx.lineTo(-3, 0);
                ctx.moveTo(3, 0);
                ctx.lineTo(10, 0);
                ctx.stroke();
                
                // Spark
                ctx.strokeStyle = '#ff8800';
                ctx.beginPath();
                ctx.moveTo(-1, -3);
                ctx.lineTo(1, 3);
                ctx.lineTo(-1, 3);
                ctx.stroke();
            }
            
            // Terminals
            ctx.strokeStyle = isBlown ? '#ff0000' : '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-15, 0);
            ctx.moveTo(15, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            ctx.restore();
        }
    },
    
    circuit_breaker: {
        name: 'Circuit Breaker',
        category: 'protection',
        symbol: 'CB',
        standard: 'IEC 60617-11-05-01',
        rating: 10.0, // Amperes
        tripCurve: 'C', // B, C, D curves
        tripTime: 0.01, // Seconds at 5x rating
        mechanicalDelay: 0.005, // Mechanical trip delay
        width: 50,
        height: 40,
        ports: { 
            left: { x: -25, y: 0 }, 
            right: { x: 25, y: 0 } 
        },
        state: { tripped: false, closed: true, I_history: [] },
        simulate: function(I, dt) {
            if (this.state.tripped || !this.state.closed) {
                return { 
                    R: 1e9,
                    V: 0, 
                    status: this.state.tripped ? 'tripped' : 'open',
                    canReset: true
                };
            }
            
            // Store current history for thermal-magnetic trip
            this.state.I_history.push({ I, t: dt });
            if (this.state.I_history.length > 100) {
                this.state.I_history.shift();
            }
            
            // Instantaneous magnetic trip (10x-20x rating)
            if (Math.abs(I) > this.rating * 10) {
                this.state.tripped = true;
                return { R: 1e9, V: 0, status: 'MAGNETIC_TRIP', canReset: false };
            }
            
            // Thermal trip (integral of I²t)
            let I_squared_t = 0;
            for (let h of this.state.I_history) {
                I_squared_t += h.I * h.I * h.t;
            }
            
            const tripThreshold = this.getCurveThreshold();
            if (I_squared_t > tripThreshold) {
                this.state.tripped = true;
                return { R: 1e9, V: 0, status: 'THERMAL_TRIP', canReset: true };
            }
            
            const R = 0.005; // Contact resistance
            const V = I * R;
            return { 
                R, 
                V, 
                I, 
                status: I > this.rating ? 'overload' : 'normal',
                power: V * I
            };
        },
        getCurveThreshold: function() {
            // Trip curves: B=3-5x, C=5-10x, D=10-20x
            const curves = { B: 4, C: 7, D: 15 };
            const multiplier = curves[this.tripCurve] || 7;
            return (multiplier * this.rating) ** 2 * this.tripTime;
        },
        reset: function() {
            if (this.state.canReset) {
                this.state.tripped = false;
                this.state.I_history = [];
            }
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            const isTripped = component?.state?.tripped;
            const isClosed = component?.state?.closed && !isTripped;
            ctx.strokeStyle = isTripped ? '#ff0000' : (isClosed ? '#00ff00' : '#888888');
            ctx.lineWidth = 2;
            
            // CB housing
            ctx.strokeRect(-20, -15, 40, 30);
            
            // Switch contact
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            if (isClosed) {
                ctx.lineTo(15, 0);
            } else {
                ctx.lineTo(0, -8);
            }
            ctx.stroke();
            
            // Terminals
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-20, 0);
            ctx.moveTo(20, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            // Label
            ctx.fillStyle = isTripped ? '#ff0000' : '#00ff00';
            ctx.font = '8px Arial';
            ctx.fillText('CB', -6, 12);
            
            ctx.restore();
        }
    }
};

// ==================== SWITCHES ====================
const SWITCH_COMPONENTS = {
    spst_switch: {
        name: 'SPST Switch',
        category: 'control',
        symbol: 'SW',
        standard: 'IEC 60617-07-01-01',
        contactResistance: 0.001, // Ohms
        bounceTime: 0.001, // Seconds
        width: 50,
        height: 30,
        ports: { 
            left: { x: -25, y: 0 }, 
            right: { x: 25, y: 0 } 
        },
        state: { closed: false, bouncing: false },
        toggle: function() {
            this.state.closed = !this.state.closed;
            this.state.bouncing = true;
            setTimeout(() => { this.state.bouncing = false; }, this.bounceTime * 1000);
        },
        simulate: function() {
            if (this.state.bouncing) {
                // Random contact during bounce
                const R = Math.random() > 0.5 ? this.contactResistance : 1e9;
                return { R, status: 'bouncing' };
            }
            
            const R = this.state.closed ? this.contactResistance : 1e9;
            return { 
                R, 
                status: this.state.closed ? 'closed' : 'open'
            };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            const isClosed = component?.state?.closed;
            ctx.strokeStyle = isClosed ? '#00ff00' : '#888888';
            ctx.lineWidth = 2;
            
            // Switch contact
            ctx.beginPath();
            ctx.arc(-15, 0, 2, 0, Math.PI * 2);
            ctx.arc(15, 0, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(-13, 0);
            if (isClosed) {
                ctx.lineTo(13, 0);
            } else {
                ctx.lineTo(5, -10);
            }
            ctx.stroke();
            
            // Terminals
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-17, 0);
            ctx.moveTo(17, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();
            
            ctx.restore();
        }
    },
    
    spdt_switch: {
        name: 'SPDT Switch',
        category: 'control',
        symbol: 'SPDT',
        standard: 'IEC 60617-07-01-02',
        contactResistance: 0.001,
        width: 60,
        height: 50,
        ports: { 
            common: { x: -30, y: 0 }, 
            no: { x: 30, y: -15 },
            nc: { x: 30, y: 15 }
        },
        state: { position: 'nc' }, // 'nc' or 'no'
        toggle: function() {
            this.state.position = this.state.position === 'nc' ? 'no' : 'nc';
        },
        simulate: function() {
            return {
                R_no: this.state.position === 'no' ? this.contactResistance : 1e9,
                R_nc: this.state.position === 'nc' ? this.contactResistance : 1e9,
                status: this.state.position === 'nc' ? 'NC_closed' : 'NO_closed'
            };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            const position = component?.state?.position || 'nc';
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Contacts
            ctx.beginPath();
            ctx.arc(-20, 0, 2, 0, Math.PI * 2);
            ctx.arc(20, -15, 2, 0, Math.PI * 2);
            ctx.arc(20, 15, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Arm
            ctx.strokeStyle = position === 'no' ? '#00ff00' : '#ffff00';
            ctx.beginPath();
            ctx.moveTo(-18, 0);
            if (position === 'no') {
                ctx.lineTo(18, -15);
            } else {
                ctx.lineTo(18, 15);
            }
            ctx.stroke();
            
            // Terminals
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-22, 0);
            ctx.moveTo(22, -15);
            ctx.lineTo(30, -15);
            ctx.moveTo(22, 15);
            ctx.lineTo(30, 15);
            ctx.stroke();
            
            // Labels
            ctx.fillStyle = '#888888';
            ctx.font = '8px Arial';
            ctx.fillText('C', -35, 5);
            ctx.fillText('NO', 32, -12);
            ctx.fillText('NC', 32, 18);
            
            ctx.restore();
        }
    }
};

// ==================== RELAYS ====================
const RELAY_COMPONENTS = {
    relay_spst: {
        name: 'SPST Relay',
        category: 'control',
        symbol: 'K',
        standard: 'IEC 60617-07-03-01',
        coilResistance: 100, // Ohms
        coilInductance: 0.1, // Henries
        pickupVoltage: 9.0, // Volts
        dropoutVoltage: 3.0, // Volts
        contactResistance: 0.01,
        operateTime: 0.01, // Seconds
        releaseTime: 0.005,
        width: 70,
        height: 60,
        ports: { 
            coil_plus: { x: -35, y: -20 },
            coil_minus: { x: -35, y: 20 },
            contact_left: { x: 35, y: -10 },
            contact_right: { x: 35, y: 10 }
        },
        state: { energized: false, contacts_closed: false, I_coil: 0 },
        simulate: function(V_coil, dt) {
            // Coil circuit (RL circuit)
            const tau = this.coilInductance / this.coilResistance;
            const I_steady = V_coil / this.coilResistance;
            this.state.I_coil += (I_steady - this.state.I_coil) * (dt / tau);
            
            // Relay actuation
            if (V_coil >= this.pickupVoltage && !this.state.energized) {
                setTimeout(() => {
                    this.state.energized = true;
                    this.state.contacts_closed = true;
                }, this.operateTime * 1000);
            }
            
            if (V_coil < this.dropoutVoltage && this.state.energized) {
                setTimeout(() => {
                    this.state.energized = false;
                    this.state.contacts_closed = false;
                }, this.releaseTime * 1000);
            }
            
            const R_contact = this.state.contacts_closed ? this.contactResistance : 1e9;
            
            return {
                I_coil: this.state.I_coil,
                V_coil,
                coil_power: V_coil * this.state.I_coil,
                R_contact,
                energized: this.state.energized,
                contacts_closed: this.state.contacts_closed
            };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            const isEnergized = component?.state?.energized;
            const contactsClosed = component?.state?.contacts_closed;
            
            // Coil
            ctx.strokeStyle = isEnergized ? '#ff8800' : '#888888';
            ctx.lineWidth = 2;
            ctx.strokeRect(-30, -25, 20, 50);
            
            // Coil windings
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.arc(-20, -20 + i * 10, 3, 0, Math.PI * 2);
            }
            ctx.stroke();
            
            // Coil terminals
            ctx.beginPath();
            ctx.moveTo(-35, -20);
            ctx.lineTo(-30, -20);
            ctx.moveTo(-35, 20);
            ctx.lineTo(-30, 20);
            ctx.stroke();
            
            // Contact
            ctx.strokeStyle = contactsClosed ? '#00ff00' : '#888888';
            ctx.beginPath();
            ctx.arc(20, -10, 2, 0, Math.PI * 2);
            ctx.arc(20, 10, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(18, -10);
            if (contactsClosed) {
                ctx.lineTo(18, 10);
            } else {
                ctx.lineTo(10, -5);
            }
            ctx.stroke();
            
            // Contact terminals
            ctx.beginPath();
            ctx.moveTo(22, -10);
            ctx.lineTo(35, -10);
            ctx.moveTo(22, 10);
            ctx.lineTo(35, 10);
            ctx.stroke();
            
            // Label
            ctx.fillStyle = isEnergized ? '#ff8800' : '#888888';
            ctx.font = '8px Arial';
            ctx.fillText('K', -25, 0);
            
            ctx.restore();
        }
    }
};

// ==================== GROUND SYMBOLS ====================
const GROUND_COMPONENTS = {
    ground_earth: {
        name: 'Earth Ground',
        category: 'grounds',
        symbol: '⏚',
        standard: 'IEC 60417-5017',
        voltage: 0, // Reference node
        width: 30,
        height: 40,
        ports: { 
            node: { x: 0, y: -20 } 
        },
        simulate: function() {
            return { V: 0, isReference: true };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Connection line
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(0, 0);
            ctx.stroke();
            
            // Earth symbol (three horizontal lines)
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(15, 0);
            ctx.moveTo(-10, 5);
            ctx.lineTo(10, 5);
            ctx.moveTo(-5, 10);
            ctx.lineTo(5, 10);
            ctx.stroke();
            
            ctx.restore();
        }
    },
    
    ground_chassis: {
        name: 'Chassis Ground',
        category: 'grounds',
        symbol: '⏚',
        standard: 'IEC 60417-5018',
        voltage: 0,
        width: 30,
        height: 40,
        ports: { 
            node: { x: 0, y: -20 } 
        },
        simulate: function() {
            return { V: 0, isReference: true, type: 'chassis' };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(0, 0);
            ctx.stroke();
            
            // Chassis symbol (rectangle with diagonal lines)
            ctx.strokeRect(-12, 0, 24, 8);
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(-4, 8);
            ctx.moveTo(0, 0);
            ctx.lineTo(4, 8);
            ctx.moveTo(8, 0);
            ctx.lineTo(12, 8);
            ctx.stroke();
            
            ctx.restore();
        }
    },
    
    ground_signal: {
        name: 'Signal Ground',
        category: 'grounds',
        symbol: '⏚',
        standard: 'IEC 60617-02-15-01',
        voltage: 0,
        width: 30,
        height: 30,
        ports: { 
            node: { x: 0, y: -15 } 
        },
        simulate: function() {
            return { V: 0, isReference: true, type: 'signal' };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(0, 0);
            ctx.stroke();
            
            // Signal ground (inverted triangle)
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(10, 0);
            ctx.lineTo(0, 10);
            ctx.closePath();
            ctx.stroke();
            
            ctx.restore();
        }
    }
};

// Combine all protection/control components
const PROTECTION_CONTROL_COMPONENTS_STANDARD = {
    ...PROTECTION_COMPONENTS,
    ...SWITCH_COMPONENTS,
    ...RELAY_COMPONENTS,
    ...GROUND_COMPONENTS
};

// Export
if (typeof window !== 'undefined') {
    window.PROTECTION_CONTROL_COMPONENTS_STANDARD = PROTECTION_CONTROL_COMPONENTS_STANDARD;
}
