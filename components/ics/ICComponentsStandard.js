// Integrated Circuits - IEC 60617 & IEEE 315 Standards
// Op-Amps, Voltage Regulators, Comparators with behavioral models

// ==================== OPERATIONAL AMPLIFIERS ====================
const OPAMP_COMPONENTS = {
    opamp_ideal: {
        name: 'Ideal Op-Amp',
        category: 'ics',
        symbol: '△',
        standard: 'IEC 60617, IEEE 315',
        gain: 1e6, // Open-loop gain (ideal: infinite)
        bandwidth: 1e6, // Hz
        slewRate: 1e6, // V/µs (ideal: infinite)
        width: 70,
        height: 60,
        ports: { 
            vplus: { x: -35, y: -15 }, 
            vminus: { x: -35, y: 15 }, 
            vout: { x: 35, y: 0 },
            vcc: { x: 0, y: -30 },
            vee: { x: 0, y: 30 }
        },
        simulate: function(Vplus, Vminus, Vcc, Vee) {
            // Ideal Op-Amp: Vout = A * (V+ - V-), with rail limiting
            const Vdiff = Vplus - Vminus;
            let Vout = this.gain * Vdiff;
            
            // Rail limiting
            if (Vout > Vcc - 0.5) Vout = Vcc - 0.5;
            if (Vout < Vee + 0.5) Vout = Vee + 0.5;
            
            // Input impedance: infinite (I+ = I- = 0)
            return { 
                Vout, 
                Vdiff, 
                saturated: Math.abs(Vout) >= (Vcc - 0.5) || Math.abs(Vout) <= (Vee + 0.5),
                I_plus: 0,
                I_minus: 0
            };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Triangle shape
            ctx.beginPath();
            ctx.moveTo(-30, -25);
            ctx.lineTo(-30, 25);
            ctx.lineTo(30, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Input symbols
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('+', -25, -10);
            ctx.fillText('−', -25, 20);
            
            // Input terminals
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-35, -15);
            ctx.lineTo(-30, -15);
            ctx.moveTo(-35, 15);
            ctx.lineTo(-30, 15);
            ctx.stroke();
            
            // Output terminal
            ctx.beginPath();
            ctx.moveTo(30, 0);
            ctx.lineTo(35, 0);
            ctx.stroke();
            
            // Power supply terminals
            ctx.strokeStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(0, -30);
            ctx.lineTo(0, -25);
            ctx.moveTo(0, 25);
            ctx.lineTo(0, 30);
            ctx.stroke();
            
            ctx.fillStyle = '#ff0000';
            ctx.font = '8px Arial';
            ctx.fillText('V+', -8, -26);
            ctx.fillText('V−', -8, 29);
            
            ctx.restore();
        }
    },
    
    opamp_realworld: {
        name: 'Real Op-Amp (LM358)',
        category: 'ics',
        symbol: '△*',
        standard: 'IEC 60617',
        gain: 100000, // Typical open-loop gain
        bandwidth: 1e6, // 1 MHz
        slewRate: 0.5, // V/µs
        inputBias: 45e-9, // 45nA input bias current
        inputOffset: 2e-3, // 2mV input offset voltage
        CMRR: 70, // dB
        width: 70,
        height: 60,
        ports: { 
            vplus: { x: -35, y: -15 }, 
            vminus: { x: -35, y: 15 }, 
            vout: { x: 35, y: 0 },
            vcc: { x: 0, y: -30 },
            vee: { x: 0, y: 30 }
        },
        state: { lastVout: 0 },
        simulate: function(Vplus, Vminus, Vcc, Vee, dt) {
            // Non-ideal model with gain-bandwidth product
            const Vdiff = (Vplus - Vminus) + this.inputOffset;
            
            // Gain-bandwidth limitation
            const GBW = this.gain * this.bandwidth;
            const effectiveGain = Math.min(this.gain, GBW / this.bandwidth);
            
            let Vout = effectiveGain * Vdiff;
            
            // Slew rate limiting
            const maxDelta = this.slewRate * 1e6 * dt; // Convert V/µs to V/s
            if (Math.abs(Vout - this.state.lastVout) > maxDelta) {
                Vout = this.state.lastVout + Math.sign(Vout - this.state.lastVout) * maxDelta;
            }
            
            // Rail limiting
            if (Vout > Vcc - 1.5) Vout = Vcc - 1.5; // Typical 1.5V headroom
            if (Vout < Vee + 1.5) Vout = Vee + 1.5;
            
            this.state.lastVout = Vout;
            
            return {
                Vout,
                Vdiff,
                saturated: Math.abs(Vout) >= (Vcc - 1.5) || Math.abs(Vout) <= (Vee + 1.5),
                I_plus: this.inputBias,
                I_minus: this.inputBias
            };
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
            ctx.moveTo(-30, -25);
            ctx.lineTo(-30, 25);
            ctx.lineTo(30, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('+', -25, -10);
            ctx.fillText('−', -25, 20);
            
            // Model indicator
            ctx.font = '8px Arial';
            ctx.fillText('358', -10, 5);
            
            // Terminals
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-35, -15);
            ctx.lineTo(-30, -15);
            ctx.moveTo(-35, 15);
            ctx.lineTo(-30, 15);
            ctx.moveTo(30, 0);
            ctx.lineTo(35, 0);
            ctx.stroke();
            
            ctx.strokeStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(0, -30);
            ctx.lineTo(0, -25);
            ctx.moveTo(0, 25);
            ctx.lineTo(0, 30);
            ctx.stroke();
            
            ctx.restore();
        }
    }
};

// ==================== VOLTAGE REGULATORS ====================
const VOLTAGE_REGULATOR_COMPONENTS = {
    lm7805: {
        name: '7805 Voltage Regulator (+5V)',
        category: 'ics',
        symbol: '78XX',
        standard: 'IEEE 315',
        Vout_nominal: 5.0, // Regulated output
        Vdropout: 2.0, // Minimum (Vin - Vout)
        Imax: 1.5, // Maximum current (A)
        lineRegulation: 0.01, // V/V
        loadRegulation: 0.05, // V/A
        width: 70,
        height: 60,
        ports: { 
            vin: { x: -35, y: 0 }, 
            vout: { x: 35, y: 0 },
            gnd: { x: 0, y: 30 }
        },
        state: { temperature: 25 },
        simulate: function(Vin, Iload) {
            let Vout = this.Vout_nominal;
            
            // Check dropout
            if (Vin < (this.Vout_nominal + this.Vdropout)) {
                // Dropout mode - linear passthrough
                Vout = Vin - this.Vdropout;
                return { 
                    Vout, 
                    Iout: Iload, 
                    status: 'dropout',
                    power_dissipated: 0
                };
            }
            
            // Check current limit
            if (Iload > this.Imax) {
                return {
                    Vout: 0,
                    Iout: 0,
                    status: 'overcurrent',
                    power_dissipated: 0
                };
            }
            
            // Line regulation
            Vout += this.lineRegulation * (Vin - (this.Vout_nominal + this.Vdropout));
            
            // Load regulation
            Vout -= this.loadRegulation * Iload;
            
            // Power dissipation
            const Pdiss = (Vin - Vout) * Iload;
            
            // Thermal limiting (simplified)
            if (Pdiss > 10) { // 10W typical max
                return {
                    Vout: 0,
                    Iout: 0,
                    status: 'thermal_shutdown',
                    power_dissipated: 0
                };
            }
            
            return {
                Vout,
                Iout: Iload,
                status: 'normal',
                power_dissipated: Pdiss,
                efficiency: (Vout * Iload) / (Vin * Iload) * 100
            };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#ff8800';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // IC package (rectangle)
            ctx.fillRect(-30, -25, 60, 50);
            ctx.strokeRect(-30, -25, 60, 50);
            
            // Label
            ctx.fillStyle = '#ff8800';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('7805', -15, 0);
            ctx.font = '8px Arial';
            ctx.fillText('+5V', -10, 12);
            
            // Pin labels
            ctx.font = '8px Arial';
            ctx.fillText('IN', -30, -5);
            ctx.fillText('OUT', 18, -5);
            ctx.fillText('GND', -8, 26);
            
            // Terminals
            ctx.strokeStyle = '#ff8800';
            ctx.beginPath();
            ctx.moveTo(-35, 0);
            ctx.lineTo(-30, 0);
            ctx.moveTo(30, 0);
            ctx.lineTo(35, 0);
            ctx.moveTo(0, 25);
            ctx.lineTo(0, 30);
            ctx.stroke();
            
            ctx.restore();
        }
    },
    
    lm7812: {
        name: '7812 Voltage Regulator (+12V)',
        category: 'ics',
        symbol: '78XX',
        standard: 'IEEE 315',
        Vout_nominal: 12.0,
        Vdropout: 2.0,
        Imax: 1.0,
        lineRegulation: 0.01,
        loadRegulation: 0.1,
        width: 70,
        height: 60,
        ports: { 
            vin: { x: -35, y: 0 }, 
            vout: { x: 35, y: 0 },
            gnd: { x: 0, y: 30 }
        },
        simulate: function(Vin, Iload) {
            let Vout = this.Vout_nominal;
            if (Vin < (this.Vout_nominal + this.Vdropout)) {
                Vout = Vin - this.Vdropout;
                return { Vout, Iout: Iload, status: 'dropout' };
            }
            if (Iload > this.Imax) {
                return { Vout: 0, Iout: 0, status: 'overcurrent' };
            }
            Vout += this.lineRegulation * (Vin - (this.Vout_nominal + this.Vdropout));
            Vout -= this.loadRegulation * Iload;
            return { Vout, Iout: Iload, status: 'normal' };
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            ctx.strokeStyle = '#ff8800';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            ctx.fillRect(-30, -25, 60, 50);
            ctx.strokeRect(-30, -25, 60, 50);
            
            ctx.fillStyle = '#ff8800';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('7812', -15, 0);
            ctx.font = '8px Arial';
            ctx.fillText('+12V', -12, 12);
            
            ctx.strokeStyle = '#ff8800';
            ctx.beginPath();
            ctx.moveTo(-35, 0);
            ctx.lineTo(-30, 0);
            ctx.moveTo(30, 0);
            ctx.lineTo(35, 0);
            ctx.moveTo(0, 25);
            ctx.lineTo(0, 30);
            ctx.stroke();
            
            ctx.restore();
        }
    }
};

// ==================== COMPARATORS ====================
const COMPARATOR_COMPONENTS = {
    comparator_basic: {
        name: 'Voltage Comparator',
        category: 'ics',
        symbol: 'CMP',
        standard: 'IEC 60617',
        hysteresis: 0, // Volts (0 = no hysteresis)
        Voh: 5.0, // Output high voltage
        Vol: 0.0, // Output low voltage
        width: 70,
        height: 60,
        ports: { 
            vplus: { x: -35, y: -15 }, 
            vminus: { x: -35, y: 15 }, 
            vout: { x: 35, y: 0 }
        },
        state: { output: 0 },
        simulate: function(Vplus, Vminus) {
            // Simple comparator: output = HIGH if V+ > V-, else LOW
            const Vdiff = Vplus - Vminus;
            
            if (this.hysteresis > 0) {
                // With hysteresis (Schmitt trigger)
                if (Vdiff > this.hysteresis / 2) {
                    this.state.output = this.Voh;
                } else if (Vdiff < -this.hysteresis / 2) {
                    this.state.output = this.Vol;
                }
                // Else maintain previous state
            } else {
                // No hysteresis
                this.state.output = Vdiff > 0 ? this.Voh : this.Vol;
            }
            
            return {
                Vout: this.state.output,
                Vdiff,
                state: this.state.output === this.Voh ? 'HIGH' : 'LOW'
            };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            const isHigh = component?.state?.output === component?.Voh;
            ctx.strokeStyle = isHigh ? '#00ff00' : '#888888';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Triangle
            ctx.beginPath();
            ctx.moveTo(-30, -25);
            ctx.lineTo(-30, 25);
            ctx.lineTo(30, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = isHigh ? '#00ff00' : '#888888';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('+', -25, -10);
            ctx.fillText('−', -25, 20);
            
            // CMP label
            ctx.font = '8px Arial';
            ctx.fillText('CMP', -10, 5);
            
            // Terminals
            ctx.strokeStyle = isHigh ? '#00ff00' : '#888888';
            ctx.beginPath();
            ctx.moveTo(-35, -15);
            ctx.lineTo(-30, -15);
            ctx.moveTo(-35, 15);
            ctx.lineTo(-30, 15);
            ctx.moveTo(30, 0);
            ctx.lineTo(35, 0);
            ctx.stroke();
            
            // Output indicator
            if (isHigh) {
                ctx.fillStyle = '#00ff00';
                ctx.beginPath();
                ctx.arc(28, 0, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    },
    
    comparator_hysteresis: {
        name: 'Schmitt Trigger Comparator',
        category: 'ics',
        symbol: 'ST',
        standard: 'IEC 60617',
        hysteresis: 0.5, // 500mV hysteresis
        Voh: 5.0,
        Vol: 0.0,
        width: 70,
        height: 60,
        ports: { 
            vin: { x: -35, y: 0 }, 
            vout: { x: 35, y: 0 },
            vref: { x: 0, y: 30 }
        },
        state: { output: 0, threshold_high: 2.5, threshold_low: 2.0 },
        simulate: function(Vin, Vref) {
            // Schmitt trigger with hysteresis
            this.state.threshold_high = Vref + this.hysteresis / 2;
            this.state.threshold_low = Vref - this.hysteresis / 2;
            
            if (Vin > this.state.threshold_high) {
                this.state.output = this.Voh;
            } else if (Vin < this.state.threshold_low) {
                this.state.output = this.Vol;
            }
            // Else maintain state
            
            return {
                Vout: this.state.output,
                state: this.state.output === this.Voh ? 'HIGH' : 'LOW',
                Vth_high: this.state.threshold_high,
                Vth_low: this.state.threshold_low
            };
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            
            const isHigh = component?.state?.output === component?.Voh;
            ctx.strokeStyle = isHigh ? '#00ff00' : '#888888';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            
            // Triangle with hysteresis symbol
            ctx.beginPath();
            ctx.moveTo(-30, -25);
            ctx.lineTo(-30, 25);
            ctx.lineTo(30, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Hysteresis symbol (double arrow)
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(-15, -10);
            ctx.lineTo(-5, -10);
            ctx.moveTo(-12, -13);
            ctx.lineTo(-8, -10);
            ctx.lineTo(-12, -7);
            ctx.moveTo(-15, 10);
            ctx.lineTo(-5, 10);
            ctx.moveTo(-8, 7);
            ctx.lineTo(-12, 10);
            ctx.lineTo(-8, 13);
            ctx.stroke();
            
            ctx.fillStyle = isHigh ? '#00ff00' : '#888888';
            ctx.font = '8px Arial';
            ctx.fillText('ST', 5, 5);
            
            // Terminals
            ctx.strokeStyle = isHigh ? '#00ff00' : '#888888';
            ctx.beginPath();
            ctx.moveTo(-35, 0);
            ctx.lineTo(-30, 0);
            ctx.moveTo(30, 0);
            ctx.lineTo(35, 0);
            ctx.stroke();
            
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(0, 25);
            ctx.lineTo(0, 30);
            ctx.stroke();
            
            ctx.restore();
        }
    }
};

// Combine all IC components
const IC_COMPONENTS_STANDARD = {
    ...OPAMP_COMPONENTS,
    ...VOLTAGE_REGULATOR_COMPONENTS,
    ...COMPARATOR_COMPONENTS
};

// Export
if (typeof window !== 'undefined') {
    window.IC_COMPONENTS_STANDARD = IC_COMPONENTS_STANDARD;
}
