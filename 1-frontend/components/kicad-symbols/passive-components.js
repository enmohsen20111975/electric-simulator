// KiCad Passive Components - Real Data from Device.kicad_sym
// Source: https://gitlab.com/kicad/libraries/kicad-symbols/-/raw/master/Device.kicad_sym

export const RESISTORS = {
    'R': {
        type: 'resistor',
        pins: [
            { number: 1, name: '~', type: 'passive', at: [-2.54, 0, 0] },
            { number: 2, name: '~', type: 'passive', at: [2.54, 0, 180] }
        ],
        symbol: 'zigzag', // IEC style
        description: 'Resistor',
        keywords: 'R res resistor',
        datasheet: '~'
    },
    
    'R_US': {
        type: 'resistor',
        pins: [
            { number: 1, name: '~', type: 'passive', at: [-2.54, 0, 0] },
            { number: 2, name: '~', type: 'passive', at: [2.54, 0, 180] }
        ],
        symbol: 'rectangle', // ANSI/IEEE style
        description: 'Resistor, US symbol',
        keywords: 'R res resistor',
        datasheet: '~'
    },
    
    'R_Variable': {
        type: 'resistor_variable',
        pins: [
            { number: 1, name: '~', type: 'passive', at: [0, 2.54, 270] },
            { number: 2, name: '~', type: 'passive', at: [-2.54, -2.54, 90] },
            { number: 3, name: '~', type: 'passive', at: [2.54, -2.54, 90] }
        ],
        description: 'Variable resistor',
        keywords: 'resistor variable potentiometer rheostat',
        datasheet: '~'
    }
};

export const CAPACITORS = {
    'C': {
        type: 'capacitor',
        pins: [
            { number: 1, name: '~', type: 'passive', at: [0, 2.54, 270] },
            { number: 2, name: '~', type: 'passive', at: [0, -2.54, 90] }
        ],
        polarized: false,
        description: 'Unpolarized capacitor',
        keywords: 'cap capacitor',
        datasheet: '~'
    },
    
    'C_Polarized': {
        type: 'capacitor',
        pins: [
            { number: 1, name: '+', type: 'passive', at: [0, 2.54, 270] },
            { number: 2, name: '~', type: 'passive', at: [0, -2.54, 90] }
        ],
        polarized: true,
        description: 'Polarized capacitor',
        keywords: 'cap capacitor electrolytic',
        datasheet: '~'
    },
    
    'C_Variable': {
        type: 'capacitor_variable',
        pins: [
            { number: 1, name: '~', type: 'passive', at: [0, 2.54, 270] },
            { number: 2, name: '~', type: 'passive', at: [0, -2.54, 90] }
        ],
        description: 'Variable capacitor',
        keywords: 'trimmer tuning varicap',
        datasheet: '~'
    }
};

export const INDUCTORS = {
    'L': {
        type: 'inductor',
        pins: [
            { number: 1, name: '1', type: 'passive', at: [-2.54, 0, 0] },
            { number: 2, name: '2', type: 'passive', at: [2.54, 0, 180] }
        ],
        description: 'Inductor',
        keywords: 'inductor choke coil reactor magnetic',
        datasheet: '~'
    },
    
    'L_Coupled': {
        type: 'inductor_coupled',
        pins: [
            { number: 1, name: '1', type: 'passive', at: [-2.54, 2.54, 0] },
            { number: 2, name: '2', type: 'passive', at: [2.54, 2.54, 180] },
            { number: 3, name: '3', type: 'passive', at: [-2.54, -2.54, 0] },
            { number: 4, name: '4', type: 'passive', at: [2.54, -2.54, 180] }
        ],
        description: 'Coupled inductors (transformer)',
        keywords: 'inductor coil transformer coupled magnetic',
        datasheet: '~'
    }
};

export const FUSES = {
    'Fuse': {
        type: 'fuse',
        pins: [
            { number: 1, name: '~', type: 'passive', at: [-2.54, 0, 0] },
            { number: 2, name: '~', type: 'passive', at: [2.54, 0, 180] }
        ],
        description: 'Fuse',
        keywords: 'fuse protection overcurrent',
        datasheet: '~'
    }
};

// Drawing functions
export function drawResistor(ctx, x, y, width = 40, height = 12, style = 'zigzag') {
    ctx.save();
    ctx.translate(x - width/2, y);
    
    if (style === 'zigzag') {
        // IEC style (zigzag)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const segments = 6;
        for (let i = 0; i <= segments; i++) {
            const xPos = (i / segments) * width;
            const yPos = (i % 2 === 0) ? -height/2 : height/2;
            ctx.lineTo(xPos, yPos);
        }
        ctx.lineTo(width, 0);
        ctx.stroke();
    } else {
        // ANSI/IEEE style (rectangle)
        ctx.strokeRect(0, -height/2, width, height);
    }
    
    ctx.restore();
}

export function drawCapacitor(ctx, x, y, width = 30, polarized = false) {
    ctx.save();
    ctx.translate(x, y);
    
    // Two parallel lines
    const gap = 4;
    ctx.beginPath();
    ctx.moveTo(-gap/2, -width/2);
    ctx.lineTo(-gap/2, width/2);
    ctx.moveTo(gap/2, -width/2);
    ctx.lineTo(gap/2, width/2);
    ctx.stroke();
    
    // Add + sign for polarized
    if (polarized) {
        ctx.font = '12px Arial';
        ctx.fillText('+', -gap/2 - 10, -width/2 - 5);
    }
    
    ctx.restore();
}

export function drawInductor(ctx, x, y, width = 40, height = 12) {
    ctx.save();
    ctx.translate(x - width/2, y);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    // Draw coil loops
    const loops = 4;
    const loopWidth = width / loops;
    for (let i = 0; i < loops; i++) {
        const xStart = i * loopWidth;
        ctx.arc(xStart + loopWidth/2, 0, loopWidth/2, Math.PI, 0, false);
    }
    
    ctx.stroke();
    ctx.restore();
}

export function drawFuse(ctx, x, y, width = 30, height = 10) {
    ctx.save();
    ctx.translate(x, y);
    
    // Rectangle for fuse body
    ctx.strokeRect(-width/2, -height/2, width, height);
    
    // Internal connection line
    ctx.beginPath();
    ctx.moveTo(-width/2, 0);
    ctx.lineTo(width/2, 0);
    ctx.stroke();
    
    ctx.restore();
}

export default {
    RESISTORS,
    CAPACITORS,
    INDUCTORS,
    FUSES,
    drawResistor,
    drawCapacitor,
    drawInductor,
    drawFuse
};
