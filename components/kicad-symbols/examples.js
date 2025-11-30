/**
 * KICAD SYMBOLS INTEGRATION EXAMPLES
 * Demonstrates how to use KiCad symbols in the circuit simulator
 */

// Example 1: Drawing Individual Components
function exampleBasicComponents(ctx) {
    // Draw a resistor at position (100, 100)
    KiCadSymbols.passive.resistor(ctx, 100, 100, 40, 12);
    
    // Draw a capacitor at position (200, 100)
    KiCadSymbols.passive.capacitor(ctx, 200, 100, 30, 20, false);
    
    // Draw an inductor at position (300, 100)
    KiCadSymbols.passive.inductor(ctx, 300, 100, 40, 15);
}

// Example 2: Creating a Simple Circuit with Wires
function exampleSimpleCircuit(ctx) {
    // Draw a resistor
    KiCadSymbols.passive.resistor(ctx, 150, 100, 40, 12);
    
    // Draw an LED
    KiCadSymbols.semiconductors.led(ctx, 250, 100, 30, '#FF0000');
    
    // Connect with wire (with wire number label)
    KiCadSymbols.helpers.drawWire(ctx, 180, 100, 220, 100, 'W1', '#000');
    
    // Add junction dots
    KiCadSymbols.helpers.drawJunction(ctx, 180, 100, 4);
    KiCadSymbols.helpers.drawJunction(ctx, 220, 100, 4);
    
    // Add power and ground
    KiCadSymbols.helpers.drawPower(ctx, 150, 50, 20, 'VCC');
    KiCadSymbols.helpers.drawGround(ctx, 250, 150, 20);
}

// Example 3: Industrial Control Circuit
function exampleIndustrialControl(ctx) {
    // 3-phase motor
    KiCadSymbols.industrial.motor3Phase(ctx, 300, 200, 40);
    
    // Contactor
    KiCadSymbols.industrial.contactor(ctx, 200, 100, 60, 80);
    
    // Circuit breaker
    KiCadSymbols.industrial.circuitBreaker(ctx, 100, 100, 30, 60);
    
    // Emergency stop button
    KiCadSymbols.control.emergencyStop(ctx, 100, 250, 40);
    
    // Start button (green)
    KiCadSymbols.control.pushButtonNO(ctx, 150, 250, 30, '#00AA00');
    
    // Pilot light (on)
    KiCadSymbols.control.pilotLight(ctx, 200, 250, 20, '#00FF00', true);
}

// Example 4: Digital Logic Circuit
function exampleDigitalLogic(ctx) {
    // AND gate
    KiCadSymbols.digital.gateAND(ctx, 100, 100, 50, 40);
    
    // OR gate
    KiCadSymbols.digital.gateOR(ctx, 200, 100, 50, 40);
    
    // NOT gate
    KiCadSymbols.digital.gateNOT(ctx, 300, 100, 40, 30);
    
    // D Flip-Flop
    KiCadSymbols.digital.flipFlopD(ctx, 100, 200, 60, 80);
    
    // 7-Segment Display showing "8"
    KiCadSymbols.digital.display7Seg(ctx, 250, 200, 40, 60, '1111111');
}

// Example 5: Semiconductor Circuit
function exampleSemiconductors(ctx) {
    // NPN Transistor amplifier circuit
    KiCadSymbols.semiconductors.transistorNPN(ctx, 200, 200, 40);
    
    // Base resistor
    KiCadSymbols.passive.resistor(ctx, 150, 200, 40, 12);
    
    // Collector resistor
    KiCadSymbols.passive.resistor(ctx, 200, 120, 40, 12);
    
    // LED indicator
    KiCadSymbols.semiconductors.led(ctx, 250, 200, 30, '#00FF00');
    
    // Power supply
    KiCadSymbols.helpers.drawPower(ctx, 200, 80, 20, '+12V');
    KiCadSymbols.helpers.drawGround(ctx, 200, 280, 20);
}

// Example 6: Op-Amp Circuit
function exampleOpAmpCircuit(ctx) {
    // Op-amp
    KiCadSymbols.semiconductors.opamp(ctx, 200, 150, 50, 60);
    
    // Input resistor
    KiCadSymbols.passive.resistor(ctx, 120, 135, 40, 12);
    
    // Feedback resistor
    KiCadSymbols.passive.resistor(ctx, 200, 100, 40, 12);
    
    // Input capacitor
    KiCadSymbols.passive.capacitor(ctx, 80, 135, 30, 20, false);
    
    // Wire connections
    KiCadSymbols.helpers.drawWire(ctx, 150, 135, 175, 135, null, '#000');
    KiCadSymbols.helpers.drawJunction(ctx, 175, 135, 4);
}

// Example 7: Motor Control Circuit with Complete Wiring
function exampleCompleteMotorControl(ctx) {
    // Main components
    const circuitBreakerX = 100;
    const contactorX = 200;
    const motorX = 350;
    const startY = 100;
    
    // Circuit breaker
    KiCadSymbols.industrial.circuitBreaker(ctx, circuitBreakerX, startY, 30, 60);
    
    // Contactor
    KiCadSymbols.industrial.contactor(ctx, contactorX, startY, 60, 80);
    
    // Thermal relay
    KiCadSymbols.industrial.thermalRelay(ctx, 280, startY, 40, 60);
    
    // 3-phase motor
    KiCadSymbols.industrial.motor3Phase(ctx, motorX, 180, 40);
    
    // Control buttons
    KiCadSymbols.control.emergencyStop(ctx, 100, 250, 30);
    KiCadSymbols.control.pushButtonNO(ctx, 150, 250, 25, '#00AA00');  // Start
    KiCadSymbols.control.pilotLight(ctx, 200, 250, 20, '#FF0000', false);  // Indicator
    
    // Wiring (simplified)
    KiCadSymbols.helpers.drawWire(ctx, circuitBreakerX, startY + 30, contactorX - 30, startY, 'L1', '#000');
    KiCadSymbols.helpers.drawJunction(ctx, contactorX - 30, startY, 4);
}

// Example 8: Using Connection Points with Labels
function exampleLabeledConnections(ctx) {
    // Component
    KiCadSymbols.semiconductors.transistorNPN(ctx, 200, 200, 40);
    
    // Labeled connection points
    KiCadSymbols.helpers.drawConnectionPoint(ctx, 220, 165, 'Vcc', 'top');
    KiCadSymbols.helpers.drawConnectionPoint(ctx, 180, 200, 'Input', 'left');
    KiCadSymbols.helpers.drawConnectionPoint(ctx, 220, 235, 'GND', 'bottom');
    KiCadSymbols.helpers.drawConnectionPoint(ctx, 235, 200, 'Out', 'right');
}

// Example 9: Creating a Component Palette
function exampleComponentPalette(ctx) {
    const spacing = 100;
    let x = 50;
    let y = 50;
    
    // Row 1: Passive components
    KiCadSymbols.passive.resistor(ctx, x, y, 40, 12);
    KiCadSymbols.passive.capacitor(ctx, x + spacing, y, 30, 20, false);
    KiCadSymbols.passive.inductor(ctx, x + spacing * 2, y, 40, 15);
    
    // Row 2: Semiconductors
    y += spacing;
    KiCadSymbols.semiconductors.diode(ctx, x, y, 30);
    KiCadSymbols.semiconductors.led(ctx, x + spacing, y, 30, '#FF0000');
    KiCadSymbols.semiconductors.transistorNPN(ctx, x + spacing * 2, y, 40);
    
    // Row 3: Logic gates
    y += spacing;
    KiCadSymbols.digital.gateAND(ctx, x, y, 50, 40);
    KiCadSymbols.digital.gateOR(ctx, x + spacing, y, 50, 40);
    KiCadSymbols.digital.gateNOT(ctx, x + spacing * 2, y, 40, 30);
}

// Example 10: Backward Compatible Usage
function exampleBackwardCompatible(ctx) {
    // Old way (still works for compatibility)
    KiCadSymbols.resistor(ctx, 100, 100, 40, 12);
    KiCadSymbols.led(ctx, 200, 100, 30, '#00FF00');
    KiCadSymbols.gateAND(ctx, 300, 100, 50, 40);
    
    // New organized way (recommended)
    KiCadSymbols.passive.resistor(ctx, 100, 200, 40, 12);
    KiCadSymbols.semiconductors.led(ctx, 200, 200, 30, '#00FF00');
    KiCadSymbols.digital.gateAND(ctx, 300, 200, 50, 40);
}

// Utility: Render all examples on a canvas
function renderAllExamples(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // Render an example (change function name to test different examples)
    exampleComponentPalette(ctx);
}

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.KiCadExamples = {
        exampleBasicComponents,
        exampleSimpleCircuit,
        exampleIndustrialControl,
        exampleDigitalLogic,
        exampleSemiconductors,
        exampleOpAmpCircuit,
        exampleCompleteMotorControl,
        exampleLabeledConnections,
        exampleComponentPalette,
        exampleBackwardCompatible,
        renderAllExamples
    };
}
