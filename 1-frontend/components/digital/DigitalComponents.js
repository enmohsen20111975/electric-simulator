// Digital Logic Components - IEEE 91 & IEC 60617 Standards
// Complete library: Basic Gates, Combinational, Sequential, IO/Clock

// ==================== BASIC GATES ====================
const BASIC_GATES = {
    and_gate: {
        name: 'AND Gate',
        category: 'digital_gates',
        symbol: '&',
        standard: 'IEEE 91, IEC 60617',
        width: 50,
        height: 40,
        ports: [
            { id: 'in1', x: -25, y: -10, label: 'A' },
            { id: 'in2', x: -25, y: 10, label: 'B' },
            { id: 'out', x: 25, y: 0, label: 'Y' }
        ],
        properties: {},
        draw: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // IEEE 91 Distinctive Shape
            ctx.beginPath();
            ctx.moveTo(-25, -20);
            ctx.lineTo(0, -20);
            ctx.arc(0, 0, 20, -Math.PI/2, Math.PI/2);
            ctx.lineTo(-25, 20);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Label
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('&', -10, 5);
            ctx.restore();
        }
    },
    
    or_gate: {
        name: 'OR Gate',
        category: 'digital_gates',
        symbol: '≥1',
        standard: 'IEEE 91, IEC 60617',
        width: 50,
        height: 40,
        ports: [
            { id: 'in1', x: -25, y: -10, label: 'A' },
            { id: 'in2', x: -25, y: 10, label: 'B' },
            { id: 'out', x: 25, y: 0, label: 'Y' }
        ],
        properties: {},
        draw: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // IEEE 91 Distinctive Shape
            ctx.beginPath();
            ctx.moveTo(-25, -20);
            ctx.quadraticCurveTo(5, -20, 25, 0);
            ctx.quadraticCurveTo(5, 20, -25, 20);
            ctx.quadraticCurveTo(-15, 0, -25, -20);
            ctx.fill();
            ctx.stroke();
            // Label
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px Arial';
            ctx.fillText('≥1', -8, 5);
            ctx.restore();
        }
    },
    
    not_gate: {
        name: 'NOT Gate (Inverter)',
        category: 'digital_gates',
        symbol: '1',
        standard: 'IEEE 91, IEC 60617',
        width: 40,
        height: 30,
        ports: [
            { id: 'in', x: -20, y: 0, label: 'A' },
            { id: 'out', x: 23, y: 0, label: 'Y' }
        ],
        properties: {},
        draw: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // Triangle
            ctx.beginPath();
            ctx.moveTo(-20, -15);
            ctx.lineTo(-20, 15);
            ctx.lineTo(15, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Inversion bubble
            ctx.beginPath();
            ctx.arc(18, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    },
    
    nand_gate: {
        name: 'NAND Gate',
        category: 'digital_gates',
        symbol: '&̅',
        standard: 'IEEE 91, IEC 60617',
        inputs: 2,
        outputs: 1,
        width: 50,
        height: 40,
        ports: { in1: { x: -25, y: -10 }, in2: { x: -25, y: 10 }, out: { x: 28, y: 0 } },
        simulate: (inputs) => inputs.every(i => i === 1) ? 0 : 1,
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // AND shape
            ctx.beginPath();
            ctx.moveTo(-25, -20);
            ctx.lineTo(0, -20);
            ctx.arc(0, 0, 20, -Math.PI/2, Math.PI/2);
            ctx.lineTo(-25, 20);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Bubble
            ctx.beginPath();
            ctx.arc(23, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('&', -10, 5);
            ctx.restore();
        }
    },
    
    nor_gate: {
        name: 'NOR Gate',
        category: 'digital_gates',
        symbol: '≥̅1',
        standard: 'IEEE 91, IEC 60617',
        inputs: 2,
        outputs: 1,
        width: 50,
        height: 40,
        ports: { in1: { x: -25, y: -10 }, in2: { x: -25, y: 10 }, out: { x: 28, y: 0 } },
        simulate: (inputs) => inputs.some(i => i === 1) ? 0 : 1,
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // OR shape
            ctx.beginPath();
            ctx.moveTo(-25, -20);
            ctx.quadraticCurveTo(5, -20, 25, 0);
            ctx.quadraticCurveTo(5, 20, -25, 20);
            ctx.quadraticCurveTo(-15, 0, -25, -20);
            ctx.fill();
            ctx.stroke();
            // Bubble
            ctx.beginPath();
            ctx.arc(28, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    },
    
    xor_gate: {
        name: 'XOR Gate',
        category: 'digital_gates',
        symbol: '=1',
        standard: 'IEEE 91, IEC 60617',
        inputs: 2,
        outputs: 1,
        width: 50,
        height: 40,
        ports: { in1: { x: -25, y: -10 }, in2: { x: -25, y: 10 }, out: { x: 25, y: 0 } },
        simulate: (inputs) => (inputs[0] ^ inputs[1]) === 1 ? 1 : 0,
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // OR shape
            ctx.beginPath();
            ctx.moveTo(-25, -20);
            ctx.quadraticCurveTo(5, -20, 25, 0);
            ctx.quadraticCurveTo(5, 20, -25, 20);
            ctx.quadraticCurveTo(-15, 0, -25, -20);
            ctx.fill();
            ctx.stroke();
            // Extra input curve
            ctx.beginPath();
            ctx.moveTo(-30, -20);
            ctx.quadraticCurveTo(-20, 0, -30, 20);
            ctx.stroke();
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px Arial';
            ctx.fillText('=1', -8, 5);
            ctx.restore();
        }
    },
    
    xnor_gate: {
        name: 'XNOR Gate',
        category: 'digital_gates',
        symbol: '=̅1',
        standard: 'IEEE 91, IEC 60617',
        inputs: 2,
        outputs: 1,
        width: 50,
        height: 40,
        ports: { in1: { x: -25, y: -10 }, in2: { x: -25, y: 10 }, out: { x: 28, y: 0 } },
        simulate: (inputs) => (inputs[0] === inputs[1]) ? 1 : 0,
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // XOR shape
            ctx.beginPath();
            ctx.moveTo(-25, -20);
            ctx.quadraticCurveTo(5, -20, 25, 0);
            ctx.quadraticCurveTo(5, 20, -25, 20);
            ctx.quadraticCurveTo(-15, 0, -25, -20);
            ctx.fill();
            ctx.stroke();
            // Extra curve
            ctx.beginPath();
            ctx.moveTo(-30, -20);
            ctx.quadraticCurveTo(-20, 0, -30, 20);
            ctx.stroke();
            // Bubble
            ctx.beginPath();
            ctx.arc(28, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }
};

// ==================== COMBINATIONAL LOGIC ====================
const COMBINATIONAL_COMPONENTS = {
    mux_2to1: {
        name: 'MUX 2:1',
        category: 'digital_combinational',
        symbol: 'MUX',
        standard: 'IEEE 91 G-Symbol',
        inputs: 3, // D0, D1, SEL
        outputs: 1,
        width: 50,
        height: 60,
        ports: { d0: { x: -25, y: -15 }, d1: { x: -25, y: 15 }, sel: { x: 0, y: 30 }, out: { x: 25, y: 0 } },
        simulate: (inputs) => inputs[2] ? inputs[1] : inputs[0],
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // Trapezoid shape
            ctx.beginPath();
            ctx.moveTo(-25, -30);
            ctx.lineTo(25, -15);
            ctx.lineTo(25, 15);
            ctx.lineTo(-25, 30);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 10px Arial';
            ctx.fillText('MUX', -10, 5);
            ctx.font = '8px Arial';
            ctx.fillText('SEL', -8, 25);
            ctx.restore();
        }
    },
    
    demux_1to2: {
        name: 'DEMUX 1:2',
        category: 'digital_combinational',
        symbol: 'DEMUX',
        standard: 'IEEE 91 G-Symbol',
        inputs: 2, // IN, SEL
        outputs: 2,
        width: 50,
        height: 60,
        ports: { in: { x: -25, y: 0 }, sel: { x: 0, y: 30 }, out0: { x: 25, y: -15 }, out1: { x: 25, y: 15 } },
        simulate: (inputs) => inputs[1] ? [0, inputs[0]] : [inputs[0], 0],
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // Reverse trapezoid
            ctx.beginPath();
            ctx.moveTo(-25, -15);
            ctx.lineTo(25, -30);
            ctx.lineTo(25, 30);
            ctx.lineTo(-25, 15);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 9px Arial';
            ctx.fillText('DEMUX', -12, 5);
            ctx.restore();
        }
    },
    
    encoder_4to2: {
        name: 'Encoder 4:2',
        category: 'digital_combinational',
        symbol: 'ENC',
        standard: 'IEEE 91 Coder Block',
        inputs: 4,
        outputs: 2,
        width: 60,
        height: 70,
        ports: { in0: { x: -30, y: -25 }, in1: { x: -30, y: -10 }, in2: { x: -30, y: 10 }, in3: { x: -30, y: 25 }, out0: { x: 30, y: -10 }, out1: { x: 30, y: 10 } },
        simulate: (inputs) => {
            const active = inputs.findIndex(i => i === 1);
            if (active === -1) return [0, 0];
            return [(active >> 1) & 1, active & 1];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-30, -35, 60, 70);
            ctx.strokeRect(-30, -35, 60, 70);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('ENC', -12, 5);
            ctx.font = '8px Arial';
            ctx.fillText('4:2', -8, 18);
            ctx.restore();
        }
    },
    
    decoder_2to4: {
        name: 'Decoder 2:4',
        category: 'digital_combinational',
        symbol: 'DEC',
        standard: 'IEEE 91 Coder Block',
        inputs: 2,
        outputs: 4,
        width: 60,
        height: 70,
        ports: { in0: { x: -30, y: -10 }, in1: { x: -30, y: 10 }, out0: { x: 30, y: -25 }, out1: { x: 30, y: -10 }, out2: { x: 30, y: 10 }, out3: { x: 30, y: 25 } },
        simulate: (inputs) => {
            const index = (inputs[0] << 1) | inputs[1];
            const outputs = [0, 0, 0, 0];
            outputs[index] = 1;
            return outputs;
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-30, -35, 60, 70);
            ctx.strokeRect(-30, -35, 60, 70);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('DEC', -12, 5);
            ctx.font = '8px Arial';
            ctx.fillText('2:4', -8, 18);
            ctx.restore();
        }
    },
    
    full_adder: {
        name: 'Full Adder',
        category: 'digital_combinational',
        symbol: 'FA',
        standard: 'IEEE 91 Logic Block',
        inputs: 3, // A, B, Cin
        outputs: 2, // Sum, Cout
        width: 60,
        height: 60,
        ports: { a: { x: -30, y: -15 }, b: { x: -30, y: 0 }, cin: { x: -30, y: 15 }, sum: { x: 30, y: -10 }, cout: { x: 30, y: 10 } },
        simulate: (inputs) => {
            const sum = inputs[0] ^ inputs[1] ^ inputs[2];
            const carry = (inputs[0] & inputs[1]) | (inputs[1] & inputs[2]) | (inputs[0] & inputs[2]);
            return [sum, carry];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-30, -30, 60, 60);
            ctx.strokeRect(-30, -30, 60, 60);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('FA', -10, 8);
            ctx.font = '8px Arial';
            ctx.fillText('Σ', 22, -8);
            ctx.fillText('C', 22, 12);
            ctx.restore();
        }
    },
    
    comparator_4bit: {
        name: '4-bit Comparator',
        category: 'digital_combinational',
        symbol: 'CMP',
        standard: 'IEEE 91 Logic Block',
        inputs: 8, // A[3:0], B[3:0]
        outputs: 3, // A>B, A=B, A<B
        width: 60,
        height: 80,
        ports: { a: { x: -30, y: -20 }, b: { x: -30, y: 20 }, gt: { x: 30, y: -20 }, eq: { x: 30, y: 0 }, lt: { x: 30, y: 20 } },
        simulate: (inputs) => {
            const a = (inputs[0] << 3) | (inputs[1] << 2) | (inputs[2] << 1) | inputs[3];
            const b = (inputs[4] << 3) | (inputs[5] << 2) | (inputs[6] << 1) | inputs[7];
            return [a > b ? 1 : 0, a === b ? 1 : 0, a < b ? 1 : 0];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-30, -40, 60, 80);
            ctx.strokeRect(-30, -40, 60, 80);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('CMP', -12, 5);
            ctx.font = '10px Arial';
            ctx.fillText('>', 20, -18);
            ctx.fillText('=', 20, 2);
            ctx.fillText('<', 20, 22);
            ctx.restore();
        }
    }
};

// ==================== SEQUENTIAL LOGIC ====================
const SEQUENTIAL_COMPONENTS = {
    sr_latch: {
        name: 'SR Latch',
        category: 'digital_sequential',
        symbol: 'SR',
        standard: 'IEEE 91 Functional Block',
        inputs: 2, // S, R
        outputs: 2, // Q, Q̄
        width: 60,
        height: 60,
        state: { q: 0, qbar: 1 },
        ports: { s: { x: -30, y: -15 }, r: { x: -30, y: 15 }, q: { x: 30, y: -15 }, qbar: { x: 30, y: 15 } },
        simulate: function(inputs) {
            if (inputs[0] && inputs[1]) return [undefined, undefined]; // Invalid
            if (inputs[0]) { this.state.q = 1; this.state.qbar = 0; }
            if (inputs[1]) { this.state.q = 0; this.state.qbar = 1; }
            return [this.state.q, this.state.qbar];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-30, -30, 60, 60);
            ctx.strokeRect(-30, -30, 60, 60);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('SR', -10, 5);
            ctx.font = '10px Arial';
            ctx.fillText('S', -25, -12);
            ctx.fillText('R', -25, 18);
            ctx.fillText('Q', 18, -12);
            ctx.fillText('Q̄', 18, 18);
            ctx.restore();
        }
    },
    
    d_flipflop: {
        name: 'D Flip-Flop',
        category: 'digital_sequential',
        symbol: 'D',
        standard: 'IEEE 91 Functional Block',
        inputs: 2, // D, CLK
        outputs: 2, // Q, Q̄
        width: 60,
        height: 70,
        state: { q: 0, qbar: 1, lastClk: 0 },
        ports: { d: { x: -30, y: -15 }, clk: { x: -30, y: 15 }, q: { x: 30, y: -15 }, qbar: { x: 30, y: 15 } },
        simulate: function(inputs) {
            // Rising edge detection
            if (inputs[1] && !this.state.lastClk) {
                this.state.q = inputs[0];
                this.state.qbar = inputs[0] ? 0 : 1;
            }
            this.state.lastClk = inputs[1];
            return [this.state.q, this.state.qbar];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-30, -35, 60, 70);
            ctx.strokeRect(-30, -35, 60, 70);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('D', -8, 5);
            ctx.font = '10px Arial';
            ctx.fillText('D', -25, -12);
            ctx.fillText('Q', 18, -12);
            ctx.fillText('Q̄', 18, 18);
            // Clock triangle
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(-30, 10);
            ctx.lineTo(-25, 15);
            ctx.lineTo(-30, 20);
            ctx.stroke();
            ctx.restore();
        }
    },
    
    jk_flipflop: {
        name: 'JK Flip-Flop',
        category: 'digital_sequential',
        symbol: 'JK',
        standard: 'IEEE 91 Functional Block',
        inputs: 3, // J, K, CLK
        outputs: 2,
        width: 60,
        height: 80,
        state: { q: 0, qbar: 1, lastClk: 0 },
        ports: { j: { x: -30, y: -20 }, k: { x: -30, y: 0 }, clk: { x: -30, y: 20 }, q: { x: 30, y: -15 }, qbar: { x: 30, y: 15 } },
        simulate: function(inputs) {
            if (inputs[2] && !this.state.lastClk) {
                if (inputs[0] && inputs[1]) {
                    // Toggle
                    this.state.q = this.state.q ? 0 : 1;
                    this.state.qbar = this.state.q ? 0 : 1;
                } else if (inputs[0]) {
                    this.state.q = 1; this.state.qbar = 0;
                } else if (inputs[1]) {
                    this.state.q = 0; this.state.qbar = 1;
                }
            }
            this.state.lastClk = inputs[2];
            return [this.state.q, this.state.qbar];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-30, -40, 60, 80);
            ctx.strokeRect(-30, -40, 60, 80);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('JK', -10, 5);
            ctx.font = '10px Arial';
            ctx.fillText('J', -25, -18);
            ctx.fillText('K', -25, 2);
            ctx.fillText('Q', 18, -12);
            ctx.fillText('Q̄', 18, 18);
            // Clock
            ctx.beginPath();
            ctx.moveTo(-30, 15);
            ctx.lineTo(-25, 20);
            ctx.lineTo(-30, 25);
            ctx.stroke();
            ctx.restore();
        }
    },
    
    t_flipflop: {
        name: 'T Flip-Flop',
        category: 'digital_sequential',
        symbol: 'T',
        standard: 'IEEE 91 Functional Block',
        inputs: 2, // T, CLK
        outputs: 2,
        width: 60,
        height: 70,
        state: { q: 0, qbar: 1, lastClk: 0 },
        ports: { t: { x: -30, y: -15 }, clk: { x: -30, y: 15 }, q: { x: 30, y: -15 }, qbar: { x: 30, y: 15 } },
        simulate: function(inputs) {
            if (inputs[1] && !this.state.lastClk && inputs[0]) {
                this.state.q = this.state.q ? 0 : 1;
                this.state.qbar = this.state.q ? 0 : 1;
            }
            this.state.lastClk = inputs[1];
            return [this.state.q, this.state.qbar];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-30, -35, 60, 70);
            ctx.strokeRect(-30, -35, 60, 70);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('T', -8, 5);
            ctx.restore();
        }
    },
    
    shift_register_4bit: {
        name: '4-bit Shift Register (SISO)',
        category: 'digital_sequential',
        symbol: 'SHIFT',
        standard: 'IEEE 91 Shift Register',
        inputs: 2, // DATA, CLK
        outputs: 1,
        width: 80,
        height: 50,
        state: { bits: [0, 0, 0, 0], lastClk: 0 },
        ports: { data: { x: -40, y: 0 }, clk: { x: 0, y: 25 }, out: { x: 40, y: 0 } },
        simulate: function(inputs) {
            if (inputs[1] && !this.state.lastClk) {
                this.state.bits.unshift(inputs[0]);
                this.state.bits.pop();
            }
            this.state.lastClk = inputs[1];
            return [this.state.bits[3]];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-40, -25, 80, 50);
            ctx.strokeRect(-40, -25, 80, 50);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 10px Arial';
            ctx.fillText('SHIFT REG', -25, 5);
            ctx.font = '8px Arial';
            ctx.fillText('4-BIT', -15, 15);
            ctx.restore();
        }
    },
    
    counter_4bit: {
        name: '4-bit Counter',
        category: 'digital_sequential',
        symbol: 'CTR',
        standard: 'IEEE 91 Counter',
        inputs: 2, // CLK, RESET
        outputs: 4, // Q0, Q1, Q2, Q3
        width: 70,
        height: 80,
        state: { count: 0, lastClk: 0 },
        ports: { clk: { x: -35, y: 0 }, reset: { x: -35, y: 20 }, q0: { x: 35, y: -25 }, q1: { x: 35, y: -10 }, q2: { x: 35, y: 10 }, q3: { x: 35, y: 25 } },
        simulate: function(inputs) {
            if (inputs[1]) {
                this.state.count = 0;
            } else if (inputs[0] && !this.state.lastClk) {
                this.state.count = (this.state.count + 1) % 16;
            }
            this.state.lastClk = inputs[0];
            return [
                this.state.count & 1,
                (this.state.count >> 1) & 1,
                (this.state.count >> 2) & 1,
                (this.state.count >> 3) & 1
            ];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-35, -40, 70, 80);
            ctx.strokeRect(-35, -40, 70, 80);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('CTR', -12, 0);
            ctx.font = '8px Arial';
            ctx.fillText('4-BIT', -12, 12);
            ctx.restore();
        }
    }
};

// ==================== IO & CLOCK COMPONENTS ====================
const IO_CLOCK_COMPONENTS = {
    logic_input: {
        name: 'Logic Input',
        category: 'digital_io',
        symbol: '0/1',
        standard: 'Simple Pin',
        inputs: 0,
        outputs: 1,
        width: 40,
        height: 40,
        state: { value: 0 },
        ports: { out: { x: 20, y: 0 } },
        simulate: function() {
            return [this.state.value];
        },
        toggle: function() {
            this.state.value = this.state.value ? 0 : 1;
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            const color = component?.state?.value ? '#00ff00' : '#ff0000';
            ctx.strokeStyle = color;
            ctx.fillStyle = component?.state?.value ? '#00ff00' : '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(component?.state?.value || 0, -5, 6);
            ctx.restore();
        }
    },
    
    logic_output: {
        name: 'Logic Output',
        category: 'digital_io',
        symbol: 'LED',
        standard: 'Monitored Node',
        inputs: 1,
        outputs: 0,
        width: 40,
        height: 40,
        state: { value: 0 },
        ports: { in: { x: -20, y: 0 } },
        simulate: function(inputs) {
            this.state.value = inputs[0];
            return [];
        },
        render: (ctx, x, y, rotation = 0, component) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            const lit = component?.state?.value;
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = lit ? '#00ff00' : '#1a1a2e';
            ctx.lineWidth = 2;
            // LED shape
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            if (lit) {
                ctx.shadowColor = '#00ff00';
                ctx.shadowBlur = 20;
                ctx.fill();
            }
            ctx.restore();
        }
    },
    
    clock_source: {
        name: 'Clock Source',
        category: 'digital_io',
        symbol: '⏰',
        standard: 'Pulse Waveform',
        inputs: 0,
        outputs: 1,
        width: 50,
        height: 40,
        state: { frequency: 1, dutyCycle: 50, phase: 0 },
        ports: { out: { x: 25, y: 0 } },
        simulate: function(time) {
            const period = 1 / this.state.frequency;
            const cyclePosition = (time % period) / period;
            const value = cyclePosition < (this.state.dutyCycle / 100) ? 1 : 0;
            return [value];
        },
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ffff';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.fillRect(-25, -20, 50, 40);
            ctx.strokeRect(-25, -20, 50, 40);
            // Draw clock waveform
            ctx.strokeStyle = '#00ffff';
            ctx.beginPath();
            ctx.moveTo(-20, 5);
            ctx.lineTo(-20, -5);
            ctx.lineTo(-10, -5);
            ctx.lineTo(-10, 5);
            ctx.lineTo(0, 5);
            ctx.lineTo(0, -5);
            ctx.lineTo(10, -5);
            ctx.lineTo(10, 5);
            ctx.lineTo(20, 5);
            ctx.stroke();
            ctx.fillStyle = '#00ffff';
            ctx.font = '8px Arial';
            ctx.fillText('CLK', -10, 15);
            ctx.restore();
        }
    },
    
    tristate_buffer: {
        name: '3-State Buffer',
        category: 'digital_io',
        symbol: '▷',
        standard: 'IEEE 91 Triangle',
        inputs: 2, // DATA, ENABLE
        outputs: 1,
        width: 50,
        height: 40,
        ports: { data: { x: -25, y: 0 }, enable: { x: 0, y: 20 }, out: { x: 25, y: 0 } },
        simulate: (inputs) => inputs[1] ? [inputs[0]] : ['Z'], // High-Z state
        render: (ctx, x, y, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.strokeStyle = '#00ff00';
            ctx.fillStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            // Triangle
            ctx.beginPath();
            ctx.moveTo(-25, -15);
            ctx.lineTo(-25, 15);
            ctx.lineTo(20, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Enable line
            ctx.strokeStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(0, 15);
            ctx.lineTo(0, 20);
            ctx.stroke();
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px Arial';
            ctx.fillText('EN', -3, 13);
            ctx.restore();
        }
    }
};

// Combine all components
const DIGITAL_COMPONENTS = {
    ...BASIC_GATES,
    ...COMBINATIONAL_COMPONENTS,
    ...SEQUENTIAL_COMPONENTS,
    ...IO_CLOCK_COMPONENTS
};

// Export for use in main engine
if (typeof window !== 'undefined') {
    window.DIGITAL_COMPONENTS = DIGITAL_COMPONENTS;
}
