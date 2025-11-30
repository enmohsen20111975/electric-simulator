// IEEE/IEC Standard Component Drawing Functions
// Professional-grade circuit symbols

// DC Voltage Source (Battery symbol)
function drawDCVoltageSource(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // + and - symbols
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText('+', 0, -6);
    ctx.fillText('-', 0, 6);
    
    // Terminals
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -20);
    ctx.moveTo(0, 15);
    ctx.lineTo(0, 20);
    ctx.stroke();
}

// AC Voltage Source
function drawACVoltageSource(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Sine wave
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = -10; x <= 10; x++) {
        const y = 6 * Math.sin(x * Math.PI / 8);
        if (x === -10) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -20);
    ctx.moveTo(0, 15);
    ctx.lineTo(0, 20);
    ctx.stroke();
}

// Current Source
function drawCurrentSource(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Arrow
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 8);
    ctx.stroke();
    
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(-3, -4);
    ctx.moveTo(0, -8);
    ctx.lineTo(3, -4);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -20);
    ctx.moveTo(0, 15);
    ctx.lineTo(0, 20);
    ctx.stroke();
}

// Resistor (IEEE standard - zigzag)
function drawResistor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Zigzag pattern
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-20, 0);
    
    const peaks = 6;
    const width = 40;
    const height = 10;
    
    for (let i = 0; i < peaks; i++) {
        const x = -20 + (i * width / peaks);
        const y = (i % 2 === 0) ? height : -height;
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(20, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    
    // Value label
    const val = comp.properties.resistance.value;
    let label = '';
    if (val >= 1e6) label = `${val / 1e6}MΩ`;
    else if (val >= 1e3) label = `${val / 1e3}kΩ`;
    else label = `${val}Ω`;
    
    ctx.font = '10px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -15);
}

// Capacitor (non-polarized)
function drawCapacitor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Two parallel plates
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-5, 0);
    ctx.moveTo(-5, -12);
    ctx.lineTo(-5, 12);
    ctx.moveTo(5, -12);
    ctx.lineTo(5, 12);
    ctx.moveTo(5, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();
    
    // Value label
    const val = comp.properties.capacitance.value;
    let label = '';
    if (val >= 1e6) label = `${val / 1e6}F`;
    else if (val >= 1e3) label = `${val / 1e3}mF`;
    else if (val >= 1) label = `${val}µF`;
    else label = `${val * 1000}nF`;
    
    ctx.font = '10px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -18);
}

// Polarized Capacitor (Electrolytic)
function drawPolarizedCapacitor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Curved plate (negative)
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-8, 0);
    ctx.moveTo(-8, -12);
    ctx.lineTo(-8, 12);
    ctx.stroke();
    
    // Straight plate (positive)
    ctx.beginPath();
    ctx.arc(5, 0, 12, Math.PI / 2, -Math.PI / 2, true);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();
    
    // + symbol
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText('+', -18, -15);
    
    // Value label
    const val = comp.properties.capacitance.value;
    let label = `${val}µF`;
    
    ctx.font = '10px Arial';
    ctx.fillText(label, 0, -20);
}

// Inductor
function drawInductor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Coil loops
    ctx.beginPath();
    ctx.moveTo(-35, 0);
    ctx.lineTo(-25, 0);
    
    const loops = 4;
    const loopWidth = 12;
    const radius = 6;
    
    for (let i = 0; i < loops; i++) {
        const x = -25 + i * loopWidth;
        ctx.arc(x + radius, 0, radius, Math.PI, 0, false);
    }
    
    ctx.lineTo(35, 0);
    ctx.stroke();
    
    // Value label
    const val = comp.properties.inductance.value;
    let label = '';
    if (val >= 1) label = `${val}H`;
    else if (val >= 0.001) label = `${val * 1000}mH`;
    else label = `${val * 1e6}µH`;
    
    ctx.font = '10px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -15);
}

// Diode
function drawDiode(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.lineWidth = 2;
    
    // Triangle (anode side)
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(-10, 10);
    ctx.lineTo(10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Cathode bar
    ctx.beginPath();
    ctx.moveTo(10, -10);
    ctx.lineTo(10, 10);
    ctx.stroke();
    
    // Leads
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-10, 0);
    ctx.moveTo(10, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
}

// LED
function drawLED(ctx, comp) {
    const colors = {
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
        yellow: '#ffff00',
        white: '#ffffff'
    };
    
    const color = colors[comp.properties.color.value] || '#ff0000';
    
    ctx.strokeStyle = '#000';
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    
    // Triangle
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(-10, 10);
    ctx.lineTo(10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Cathode bar
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(10, -10);
    ctx.lineTo(10, 10);
    ctx.stroke();
    
    // Light arrows
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    
    // Arrow 1
    ctx.beginPath();
    ctx.moveTo(5, -12);
    ctx.lineTo(12, -18);
    ctx.moveTo(12, -18);
    ctx.lineTo(10, -16);
    ctx.moveTo(12, -18);
    ctx.lineTo(14, -16);
    ctx.stroke();
    
    // Arrow 2
    ctx.beginPath();
    ctx.moveTo(10, -15);
    ctx.lineTo(17, -21);
    ctx.moveTo(17, -21);
    ctx.lineTo(15, -19);
    ctx.moveTo(17, -21);
    ctx.lineTo(19, -19);
    ctx.stroke();
    
    // Leads
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-10, 0);
    ctx.moveTo(10, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();
}

// Zener Diode
function drawZenerDiode(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.lineWidth = 2;
    
    // Triangle
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(-10, 10);
    ctx.lineTo(10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Zener cathode (Z-shaped)
    ctx.beginPath();
    ctx.moveTo(10, -10);
    ctx.lineTo(10, 10);
    ctx.lineTo(6, 10);
    ctx.moveTo(10, -10);
    ctx.lineTo(14, -10);
    ctx.stroke();
    
    // Leads
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-10, 0);
    ctx.moveTo(10, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
}

// NPN Transistor
function drawNPNTransistor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Base line
    ctx.beginPath();
    ctx.moveTo(-25, -15);
    ctx.lineTo(-25, 15);
    ctx.stroke();
    
    // Base lead
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-25, 0);
    ctx.stroke();
    
    // Collector
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-25, -10);
    ctx.lineTo(5, -25);
    ctx.lineTo(15, -30);
    ctx.stroke();
    
    // Emitter with arrow
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.lineTo(5, 25);
    ctx.lineTo(15, 30);
    ctx.stroke();
    
    // Emitter arrow
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(15, 30);
    ctx.lineTo(8, 24);
    ctx.lineTo(11, 20);
    ctx.closePath();
    ctx.fill();
}

// PNP Transistor
function drawPNPTransistor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Base line
    ctx.beginPath();
    ctx.moveTo(-25, -15);
    ctx.lineTo(-25, 15);
    ctx.stroke();
    
    // Base lead
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-25, 0);
    ctx.stroke();
    
    // Collector
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-25, -10);
    ctx.lineTo(5, -25);
    ctx.lineTo(15, -30);
    ctx.stroke();
    
    // Collector arrow
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(-25, -10);
    ctx.lineTo(-18, -14);
    ctx.lineTo(-21, -10);
    ctx.closePath();
    ctx.fill();
    
    // Emitter
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.lineTo(5, 25);
    ctx.lineTo(15, 30);
    ctx.stroke();
}

// N-Channel MOSFET
function drawNMOSFET(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Gate
    ctx.beginPath();
    ctx.moveTo(-25, -25);
    ctx.lineTo(-25, 25);
    ctx.stroke();
    
    // Gate lead
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-25, 0);
    ctx.stroke();
    
    // Channel segments
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, -20);
    ctx.lineTo(-15, -12);
    ctx.moveTo(-15, -8);
    ctx.lineTo(-15, 8);
    ctx.moveTo(-15, 12);
    ctx.lineTo(-15, 20);
    ctx.stroke();
    
    // Drain
    ctx.beginPath();
    ctx.moveTo(-15, -20);
    ctx.lineTo(10, -20);
    ctx.lineTo(20, -30);
    ctx.stroke();
    
    // Source
    ctx.beginPath();
    ctx.moveTo(-15, 20);
    ctx.lineTo(10, 20);
    ctx.lineTo(20, 30);
    ctx.stroke();
    
    // Body diode
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, 5);
    ctx.lineTo(-5, 15);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.stroke();
}

// Op-Amp
function drawOpAmp(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Triangle
    ctx.beginPath();
    ctx.moveTo(-30, -30);
    ctx.lineTo(-30, 30);
    ctx.lineTo(30, 0);
    ctx.closePath();
    ctx.stroke();
    
    // + and - inputs
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('-', -20, -15);
    ctx.fillText('+', -20, 15);
    
    // Input leads
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-35, -15);
    ctx.lineTo(-30, -15);
    ctx.moveTo(-35, 15);
    ctx.lineTo(-30, 15);
    ctx.stroke();
    
    // Output lead
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(35, 0);
    ctx.stroke();
    
    // Power supply leads
    ctx.beginPath();
    ctx.moveTo(0, -35);
    ctx.lineTo(0, -30);
    ctx.moveTo(0, 35);
    ctx.lineTo(0, 30);
    ctx.stroke();
}

// Voltmeter
function drawVoltmeter(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
    
    // V symbol
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V', 0, 0);
    
    // Terminals
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(0, -20);
    ctx.moveTo(0, 18);
    ctx.lineTo(0, 20);
    ctx.stroke();
}

// Ammeter
function drawAmmeter(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
    
    // A symbol
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', 0, 0);
    
    // Terminals
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(0, -20);
    ctx.moveTo(0, 18);
    ctx.lineTo(0, 20);
    ctx.stroke();
}

// Ground
function drawGround(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, 0);
    ctx.stroke();
    
    // Ground bars (decreasing width)
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.moveTo(-8, 5);
    ctx.lineTo(8, 5);
    ctx.moveTo(-4, 10);
    ctx.lineTo(4, 10);
    ctx.stroke();
}

// Switch (SPST)
function drawSwitch(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    const isClosed = comp.properties.state.value;
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-15, 0);
    ctx.moveTo(15, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();
    
    // Contact points
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-15, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(15, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Switch arm
    ctx.lineWidth = 2;
    ctx.strokeStyle = isClosed ? '#000' : '#666';
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    if (isClosed) {
        ctx.lineTo(15, 0);
    } else {
        ctx.lineTo(10, -8);
    }
    ctx.stroke();
}

// Fuse
function drawFuse(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Rectangle
    ctx.beginPath();
    ctx.rect(-15, -5, 30, 10);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-15, 0);
    ctx.moveTo(15, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    
    // Fuse element
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();
}
