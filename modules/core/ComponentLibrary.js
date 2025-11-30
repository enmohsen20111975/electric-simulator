/**
 * Component Library Module
 * Contains all component definitions and drawing functions
 */

(function () {
    'use strict';

    // Component drawing functions
    function drawResistor(ctx, comp) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        const w = comp.w / 2;

        ctx.beginPath();
        ctx.moveTo(-w, 0);
        ctx.lineTo(-20, 0);

        // IEC Standard: Rectangular box
        ctx.rect(-20, -6, 40, 12);

        ctx.moveTo(20, 0);
        ctx.lineTo(w, 0);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(comp.label || 'R', 0, -12);
    }

    function drawCapacitor(ctx, comp) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        const w = comp.w / 2;

        ctx.beginPath();
        ctx.moveTo(-w, 0);
        ctx.lineTo(-4, 0);

        // Plate 1
        ctx.moveTo(-4, -12);
        ctx.lineTo(-4, 12);

        // Plate 2
        ctx.moveTo(4, -12);
        ctx.lineTo(4, 12);

        ctx.moveTo(4, 0);
        ctx.lineTo(w, 0);
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(comp.label || 'C', 0, -15);
    }

    function drawInductor(ctx, comp) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        const w = comp.w / 2;

        ctx.beginPath();
        ctx.moveTo(-w, 0);
        ctx.lineTo(-20, 0);

        // Coils (semicircles)
        for (let i = 0; i < 4; i++) {
            ctx.arc(-15 + i * 10, 0, 5, Math.PI, 0, false);
        }
        ctx.lineTo(w, 0);
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(comp.label || 'L', 0, -10);
    }

    function drawBattery(ctx, comp) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        const w = comp.w / 2;

        ctx.beginPath();
        // Negative terminal (short thick line)
        ctx.moveTo(-w, 0);
        ctx.lineTo(-6, 0);
        ctx.moveTo(-6, -8);
        ctx.lineTo(-6, 8);

        // Positive terminal (long thin line)
        ctx.moveTo(6, -14);
        ctx.lineTo(6, 14);
        ctx.moveTo(6, 0);
        ctx.lineTo(w, 0);
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.font = '10px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+', 12, -10);
        ctx.fillText(comp.props.voltage + 'V', 0, 25);
    }

    function drawGround(ctx, comp) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 0);
        ctx.moveTo(-12, 0);
        ctx.lineTo(12, 0);
        ctx.moveTo(-7, 4);
        ctx.lineTo(7, 4);
        ctx.stroke();
    }

    // Component Definitions
    const COMPONENT_DEFS = {
        resistor: {
            draw: drawResistor,
            label: 'Resistor',
            props: { resistance: 1000 },
            symbol: 'R',
            terminals: [{ x: -30, y: 0 }, { x: 30, y: 0 }]
        },
        capacitor: {
            draw: drawCapacitor,
            label: 'Capacitor',
            props: { capacitance: 0.0001 },
            symbol: 'C',
            terminals: [{ x: -30, y: 0 }, { x: 30, y: 0 }]
        },
        inductor: {
            draw: drawInductor,
            label: 'Inductor',
            props: { inductance: 0.001 },
            symbol: 'L',
            terminals: [{ x: -30, y: 0 }, { x: 30, y: 0 }]
        },
        battery: {
            draw: drawBattery,
            label: 'Battery',
            props: { voltage: 9 },
            symbol: 'V',
            terminals: [{ x: -30, y: 0 }, { x: 30, y: 0 }]
        },
        ground: {
            draw: drawGround,
            label: 'Ground',
            props: {},
            symbol: 'GND',
            terminals: [{ x: 0, y: -15 }]
        },
        led: {
            draw: drawLED,
            label: 'LED',
            props: { voltage: 2 },
            symbol: 'LED',
            terminals: [{ x: -30, y: 0 }, { x: 30, y: 0 }]
        },
        diode: {
            draw: drawDiode,
            label: 'Diode',
            props: {},
            symbol: 'D',
            terminals: [{ x: -30, y: 0 }, { x: 30, y: 0 }]
        },
        transistor: {
            draw: drawTransistor,
            label: 'Transistor',
            props: { gain: 100 },
            symbol: 'Q',
            terminals: [{ x: -20, y: 0 }, { x: 10, y: -15 }, { x: 10, y: 15 }]
        },
        switch: {
            draw: drawSwitch,
            label: 'Switch',
            props: { closed: false },
            symbol: 'SW',
            terminals: [{ x: -30, y: 0 }, { x: 30, y: 0 }]
        },
        voltmeter: {
            draw: drawVoltmeter,
            label: 'Voltmeter',
            props: {},
            symbol: 'V',
            terminals: [{ x: -20, y: 0 }, { x: 20, y: 0 }]
        },
        ammeter: {
            draw: drawAmmeter,
            label: 'Ammeter',
            props: {},
            symbol: 'A',
            terminals: [{ x: -20, y: 0 }, { x: 20, y: 0 }]
        },
        motor: {
            draw: drawMotor,
            label: 'DC Motor',
            props: { voltage: 12, rpm: 1000 },
            symbol: 'M',
            terminals: [{ x: -20, y: 0 }, { x: 20, y: 0 }]
        },
        oscilloscope: {
            draw: drawOscilloscope,
            label: 'Oscilloscope',
            props: {},
            symbol: 'OSC',
            terminals: [{ x: -25, y: 0 }, { x: 25, y: 0 }]
        },
        functiongen: {
            draw: drawFunctionGen,
            label: 'Function Generator',
            props: { frequency: 1000, amplitude: 5 },
            symbol: 'FG',
            terminals: [{ x: -25, y: 0 }, { x: 25, y: 0 }]
        }
    };

    // Expose globally
    window.ComponentLibrary = {
        COMPONENT_DEFS: COMPONENT_DEFS,
        drawResistor: drawResistor,
        drawCapacitor: drawCapacitor,
        drawInductor: drawInductor,
        drawBattery: drawBattery,
        drawGround: drawGround,
        drawLED: drawLED,
        drawDiode: drawDiode,
        drawTransistor: drawTransistor,
        drawSwitch: drawSwitch,
        drawVoltmeter: drawVoltmeter,
        drawAmmeter: drawAmmeter,
        drawMotor: drawMotor,
        drawOscilloscope: drawOscilloscope,
        drawFunctionGen: drawFunctionGen
    };

    console.log('✓ ComponentLibrary module loaded');

})();
