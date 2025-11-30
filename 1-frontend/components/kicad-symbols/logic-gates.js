// KiCad 74xx Series Logic Gates - Real Data from KiCad Library
// Source: https://gitlab.com/kicad/libraries/kicad-symbols/-/raw/master/74xx.kicad_sym

export const LOGIC_GATES = {
    // NAND Gates
    '74LS00': {
        type: 'NAND',
        gates: 4,
        inputs: 2,
        package: 'DIP-14',
        pins: {
            gate1: { in1: 1, in2: 2, out: 3 },
            gate2: { in1: 4, in2: 5, out: 6 },
            gate3: { in1: 9, in2: 10, out: 8 },
            gate4: { in1: 12, in2: 13, out: 11 },
            vcc: 14,
            gnd: 7
        },
        description: 'Quad 2-input NAND gate',
        datasheet: 'http://www.ti.com/lit/gpn/sn74ls00'
    },
    
    '74LS132': {
        type: 'NAND_SCHMITT',
        gates: 4,
        inputs: 2,
        package: 'DIP-14',
        pins: {
            gate1: { in1: 1, in2: 2, out: 3 },
            gate2: { in1: 4, in2: 5, out: 6 },
            gate3: { in1: 9, in2: 10, out: 8 },
            gate4: { in1: 12, in2: 13, out: 11 },
            vcc: 14,
            gnd: 7
        },
        description: 'Quad 2-input NAND Schmitt trigger',
        datasheet: 'http://www.ti.com/lit/gpn/sn74LS132'
    },

    // NOR Gates
    '74LS02': {
        type: 'NOR',
        gates: 4,
        inputs: 2,
        package: 'DIP-14',
        pins: {
            gate1: { in1: 2, in2: 3, out: 1 },
            gate2: { in1: 5, in2: 6, out: 4 },
            gate3: { in1: 8, in2: 9, out: 10 },
            gate4: { in1: 11, in2: 12, out: 13 },
            vcc: 14,
            gnd: 7
        },
        description: 'Quad 2-input NOR gate',
        datasheet: 'http://www.ti.com/lit/gpn/sn74ls02'
    },

    // AND Gates
    '74LS08': {
        type: 'AND',
        gates: 4,
        inputs: 2,
        package: 'DIP-14',
        pins: {
            gate1: { in1: 1, in2: 2, out: 3 },
            gate2: { in1: 4, in2: 5, out: 6 },
            gate3: { in1: 9, in2: 10, out: 8 },
            gate4: { in1: 12, in2: 13, out: 11 },
            vcc: 14,
            gnd: 7
        },
        description: 'Quad 2-input AND gate',
        datasheet: 'http://www.ti.com/lit/gpn/sn74LS08'
    },

    // OR Gates
    '74LS32': {
        type: 'OR',
        gates: 4,
        inputs: 2,
        package: 'DIP-14',
        pins: {
            gate1: { in1: 1, in2: 2, out: 3 },
            gate2: { in1: 4, in2: 5, out: 6 },
            gate3: { in1: 9, in2: 10, out: 8 },
            gate4: { in1: 12, in2: 13, out: 11 },
            vcc: 14,
            gnd: 7
        },
        description: 'Quad 2-input OR gate',
        datasheet: 'http://www.ti.com/lit/gpn/sn74LS32'
    },

    // XOR Gates
    '74LS86': {
        type: 'XOR',
        gates: 4,
        inputs: 2,
        package: 'DIP-14',
        pins: {
            gate1: { in1: 1, in2: 2, out: 3 },
            gate2: { in1: 4, in2: 5, out: 6 },
            gate3: { in1: 9, in2: 10, out: 8 },
            gate4: { in1: 12, in2: 13, out: 11 },
            vcc: 14,
            gnd: 7
        },
        description: 'Quad 2-input XOR gate',
        datasheet: '74xx/74ls86.pdf'
    },

    // NOT Gates (Inverters)
    '74LS04': {
        type: 'NOT',
        gates: 6,
        inputs: 1,
        package: 'DIP-14',
        pins: {
            gate1: { in: 1, out: 2 },
            gate2: { in: 3, out: 4 },
            gate3: { in: 5, out: 6 },
            gate4: { in: 9, out: 8 },
            gate5: { in: 11, out: 10 },
            gate6: { in: 13, out: 12 },
            vcc: 14,
            gnd: 7
        },
        description: 'Hex inverter',
        datasheet: 'http://www.ti.com/lit/gpn/sn74LS04'
    },

    // Buffer
    '74LS540': {
        type: 'BUFFER_TRISTATE',
        buffers: 8,
        package: 'DIP-20',
        pins: {
            oe1: 1,
            oe2: 19,
            inputs: [2, 4, 6, 8, 11, 13, 15, 17],
            outputs: [18, 16, 14, 12, 9, 7, 5, 3],
            vcc: 20,
            gnd: 10
        },
        description: 'Octal Buffer/Line Driver, 3-state outputs, inverted',
        datasheet: 'http://www.ti.com/lit/gpn/sn74LS540'
    },

    // 3-Input Gates
    '74LS11': {
        type: 'AND3',
        gates: 3,
        inputs: 3,
        package: 'DIP-14',
        pins: {
            gate1: { in1: 1, in2: 2, in3: 13, out: 12 },
            gate2: { in1: 3, in2: 4, in3: 5, out: 6 },
            gate3: { in1: 9, in2: 10, in3: 11, out: 8 },
            vcc: 14,
            gnd: 7
        },
        description: 'Triple 3-input AND gate',
        datasheet: 'http://www.ti.com/lit/gpn/sn74LS11'
    },

    '74LS27': {
        type: 'NOR3',
        gates: 3,
        inputs: 3,
        package: 'DIP-14',
        pins: {
            gate1: { in1: 1, in2: 2, in3: 13, out: 12 },
            gate2: { in1: 3, in2: 4, in3: 5, out: 6 },
            gate3: { in1: 9, in2: 10, in3: 11, out: 8 },
            vcc: 14,
            gnd: 7
        },
        description: 'Triple 3-input NOR gate',
        datasheet: 'http://www.ti.com/lit/gpn/sn74LS27'
    },

    // Flip-Flops
    '74LS74': {
        type: 'FLIPFLOP_D',
        flipflops: 2,
        package: 'DIP-14',
        pins: {
            ff1: { clr: 1, d: 2, clk: 3, set: 4, q: 5, qn: 6 },
            ff2: { clr: 13, d: 12, clk: 11, set: 10, q: 9, qn: 8 },
            vcc: 14,
            gnd: 7
        },
        description: 'Dual D-type positive-edge-triggered flip-flop, preset and clear',
        datasheet: 'http://www.ti.com/lit/gpn/sn74LS74'
    },

    '74LS109': {
        type: 'FLIPFLOP_JK',
        flipflops: 2,
        package: 'DIP-16',
        pins: {
            ff1: { j: 2, k: 3, clk: 1, set: 4, clr: 5, q: 6, qn: 7 },
            ff2: { j: 14, k: 13, clk: 15, set: 12, clr: 11, q: 10, qn: 9 },
            vcc: 16,
            gnd: 8
        },
        description: 'Dual JK positive-edge triggered flip-flop, preset and clear',
        datasheet: 'http://www.ti.com/lit/gpn/sn74LS109'
    }
};

// Drawing helper functions
export function drawLogicGate(ctx, x, y, width, height, type) {
    ctx.save();
    ctx.translate(x, y);
    
    switch(type) {
        case 'NAND':
        case 'AND':
            // AND gate shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width * 0.5, 0);
            ctx.arc(width * 0.5, height/2, height/2, -Math.PI/2, Math.PI/2);
            ctx.lineTo(0, height);
            ctx.lineTo(0, 0);
            ctx.stroke();
            
            // Add bubble for NAND
            if (type === 'NAND') {
                ctx.beginPath();
                ctx.arc(width + 5, height/2, 5, 0, 2 * Math.PI);
                ctx.stroke();
            }
            break;
            
        case 'NOR':
        case 'OR':
            // OR gate shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(width * 0.3, 0, width, height/2);
            ctx.quadraticCurveTo(width * 0.3, height, 0, height);
            ctx.quadraticCurveTo(width * 0.2, height/2, 0, 0);
            ctx.stroke();
            
            // Add bubble for NOR
            if (type === 'NOR') {
                ctx.beginPath();
                ctx.arc(width + 5, height/2, 5, 0, 2 * Math.PI);
                ctx.stroke();
            }
            break;
            
        case 'XOR':
            // XOR gate shape (OR with extra arc)
            ctx.beginPath();
            ctx.moveTo(width * 0.1, 0);
            ctx.quadraticCurveTo(width * 0.4, 0, width, height/2);
            ctx.quadraticCurveTo(width * 0.4, height, width * 0.1, height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(width * 0.1, 0);
            ctx.quadraticCurveTo(width * 0.3, height/2, width * 0.1, height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(width * 0.2, height/2, 0, height);
            ctx.stroke();
            break;
            
        case 'NOT':
            // NOT gate (triangle with bubble)
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, height);
            ctx.lineTo(width, height/2);
            ctx.closePath();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(width + 5, height/2, 5, 0, 2 * Math.PI);
            ctx.stroke();
            break;
    }
    
    ctx.restore();
}

export default LOGIC_GATES;
