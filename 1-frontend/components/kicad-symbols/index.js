/**
 * KICAD SYMBOLS - MAIN INDEX
 * Consolidates all KiCad symbol categories
 * Based on IEC 60617 standards used in KiCad
 * All symbols drawn with canvas paths
 * 
 * Categories:
 * - Industrial Components: Motors, Contactors, Circuit Breakers, Transformers
 * - Control Devices: Buttons, Switches, Indicators
 * - Passive Components: Resistors, Capacitors, Inductors
 * - Semiconductors: Diodes, LEDs, Transistors, Op-Amps
 * - Digital Logic: Logic Gates, Flip-Flops, Displays
 * - Helpers: Wire drawing, junctions, terminals, ground/power symbols
 */

// Import all symbol categories
// Note: These files should be loaded before this index file

const KiCadSymbols = {
    // Industrial Control Components
    industrial: {
        motor3Phase: KiCadIndustrialComponents.motor3Phase,
        contactor: KiCadIndustrialComponents.contactor,
        circuitBreaker: KiCadIndustrialComponents.circuitBreaker,
        thermalRelay: KiCadIndustrialComponents.thermalRelay,
        transformer3Phase: KiCadIndustrialComponents.transformer3Phase,
        fuse: KiCadIndustrialComponents.fuse
    },
    
    // Control Devices
    control: {
        pushButtonNO: KiCadControlDevices.pushButtonNO,
        pilotLight: KiCadControlDevices.pilotLight,
        emergencyStop: KiCadControlDevices.emergencyStop,
        selectorSwitch: KiCadControlDevices.selectorSwitch
    },
    
    // Passive Components
    passive: {
        resistor: KiCadPassiveComponents.resistor,
        capacitor: KiCadPassiveComponents.capacitor,
        inductor: KiCadPassiveComponents.inductor
    },
    
    // Semiconductors
    semiconductors: {
        diode: KiCadSemiconductors.diode,
        led: KiCadSemiconductors.led,
        zenerDiode: KiCadSemiconductors.zenerDiode,
        transistorNPN: KiCadSemiconductors.transistorNPN,
        mosfetN: KiCadSemiconductors.mosfetN,
        opamp: KiCadSemiconductors.opamp
    },
    
    // Digital Logic
    digital: {
        gateAND: KiCadDigitalLogic.gateAND,
        gateOR: KiCadDigitalLogic.gateOR,
        gateNOT: KiCadDigitalLogic.gateNOT,
        gateNAND: KiCadDigitalLogic.gateNAND,
        gateNOR: KiCadDigitalLogic.gateNOR,
        gateXOR: KiCadDigitalLogic.gateXOR,
        flipFlopD: KiCadDigitalLogic.flipFlopD,
        display7Seg: KiCadDigitalLogic.display7Seg
    },
    
    // Helper utilities
    helpers: {
        drawWire: KiCadHelpers.drawWire,
        drawJunction: KiCadHelpers.drawJunction,
        drawTerminal: KiCadHelpers.drawTerminal,
        drawGround: KiCadHelpers.drawGround,
        drawPower: KiCadHelpers.drawPower,
        drawConnectionPoint: KiCadHelpers.drawConnectionPoint
    },
    
    // Convenience methods for backward compatibility with original kicad-symbols.js
    motor3Phase: function(ctx, x, y, size) {
        return KiCadIndustrialComponents.motor3Phase(ctx, x, y, size);
    },
    contactor: function(ctx, x, y, width, height) {
        return KiCadIndustrialComponents.contactor(ctx, x, y, width, height);
    },
    circuitBreaker: function(ctx, x, y, width, height) {
        return KiCadIndustrialComponents.circuitBreaker(ctx, x, y, width, height);
    },
    thermalRelay: function(ctx, x, y, width, height) {
        return KiCadIndustrialComponents.thermalRelay(ctx, x, y, width, height);
    },
    pushButtonNO: function(ctx, x, y, size, color) {
        return KiCadControlDevices.pushButtonNO(ctx, x, y, size, color);
    },
    pilotLight: function(ctx, x, y, size, color, on) {
        return KiCadControlDevices.pilotLight(ctx, x, y, size, color, on);
    },
    fuse: function(ctx, x, y, width, height) {
        return KiCadIndustrialComponents.fuse(ctx, x, y, width, height);
    },
    transformer3Phase: function(ctx, x, y, width, height) {
        return KiCadIndustrialComponents.transformer3Phase(ctx, x, y, width, height);
    },
    emergencyStop: function(ctx, x, y, size) {
        return KiCadControlDevices.emergencyStop(ctx, x, y, size);
    },
    selectorSwitch: function(ctx, x, y, size, position) {
        return KiCadControlDevices.selectorSwitch(ctx, x, y, size, position);
    },
    drawWire: function(ctx, x1, y1, x2, y2, wireNumber, color) {
        return KiCadHelpers.drawWire(ctx, x1, y1, x2, y2, wireNumber, color);
    },
    drawJunction: function(ctx, x, y, size) {
        return KiCadHelpers.drawJunction(ctx, x, y, size);
    },
    resistor: function(ctx, x, y, width, height) {
        return KiCadPassiveComponents.resistor(ctx, x, y, width, height);
    },
    capacitor: function(ctx, x, y, width, height, polarized) {
        return KiCadPassiveComponents.capacitor(ctx, x, y, width, height, polarized);
    },
    inductor: function(ctx, x, y, width, height) {
        return KiCadPassiveComponents.inductor(ctx, x, y, width, height);
    },
    diode: function(ctx, x, y, size) {
        return KiCadSemiconductors.diode(ctx, x, y, size);
    },
    led: function(ctx, x, y, size, color) {
        return KiCadSemiconductors.led(ctx, x, y, size, color);
    },
    zenerDiode: function(ctx, x, y, size) {
        return KiCadSemiconductors.zenerDiode(ctx, x, y, size);
    },
    transistorNPN: function(ctx, x, y, size) {
        return KiCadSemiconductors.transistorNPN(ctx, x, y, size);
    },
    mosfetN: function(ctx, x, y, size) {
        return KiCadSemiconductors.mosfetN(ctx, x, y, size);
    },
    opamp: function(ctx, x, y, width, height) {
        return KiCadSemiconductors.opamp(ctx, x, y, width, height);
    },
    gateAND: function(ctx, x, y, width, height) {
        return KiCadDigitalLogic.gateAND(ctx, x, y, width, height);
    },
    gateOR: function(ctx, x, y, width, height) {
        return KiCadDigitalLogic.gateOR(ctx, x, y, width, height);
    },
    gateNOT: function(ctx, x, y, width, height) {
        return KiCadDigitalLogic.gateNOT(ctx, x, y, width, height);
    },
    gateNAND: function(ctx, x, y, width, height) {
        return KiCadDigitalLogic.gateNAND(ctx, x, y, width, height);
    },
    gateNOR: function(ctx, x, y, width, height) {
        return KiCadDigitalLogic.gateNOR(ctx, x, y, width, height);
    },
    gateXOR: function(ctx, x, y, width, height) {
        return KiCadDigitalLogic.gateXOR(ctx, x, y, width, height);
    },
    flipFlopD: function(ctx, x, y, width, height) {
        return KiCadDigitalLogic.flipFlopD(ctx, x, y, width, height);
    },
    display7Seg: function(ctx, x, y, width, height, segments) {
        return KiCadDigitalLogic.display7Seg(ctx, x, y, width, height, segments);
    }
};

// Export
if (typeof window !== 'undefined') {
    window.KiCadSymbols = KiCadSymbols;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KiCadSymbols;
}
