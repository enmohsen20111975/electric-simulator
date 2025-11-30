# KiCad Symbols for Circuit Simulator

This directory contains modularized KiCad-style electrical symbols based on IEC 60617 standards.

## Directory Structure

```
kicad-symbols/
├── index.js                  # Main entry point - loads all categories
├── IndustrialComponents.js   # Motors, contactors, circuit breakers, transformers, fuses
├── ControlDevices.js         # Push buttons, pilot lights, emergency stops, selector switches
├── PassiveComponents.js      # Resistors, capacitors, inductors
├── Semiconductors.js         # Diodes, LEDs, transistors, MOSFETs, op-amps
├── DigitalLogic.js          # Logic gates, flip-flops, 7-segment displays
├── Helpers.js               # Wire drawing, junctions, terminals, ground/power symbols
└── README.md                # This file
```

## Usage

### Loading in HTML

Add the script tags in this order:

```html
<!-- Load individual category files -->
<script src="components/kicad-symbols/Helpers.js"></script>
<script src="components/kicad-symbols/PassiveComponents.js"></script>
<script src="components/kicad-symbols/Semiconductors.js"></script>
<script src="components/kicad-symbols/DigitalLogic.js"></script>
<script src="components/kicad-symbols/IndustrialComponents.js"></script>
<script src="components/kicad-symbols/ControlDevices.js"></script>
<!-- Load the main index -->
<script src="components/kicad-symbols/index.js"></script>
```

### Using Symbols in Code

#### Option 1: Direct Category Access (Recommended)
```javascript
// Access via organized categories
const ctx = canvas.getContext('2d');

// Industrial components
KiCadSymbols.industrial.motor3Phase(ctx, 100, 100, 40);
KiCadSymbols.industrial.contactor(ctx, 200, 100, 60, 80);
KiCadSymbols.industrial.circuitBreaker(ctx, 300, 100, 30, 60);

// Control devices
KiCadSymbols.control.pushButtonNO(ctx, 100, 200, 30, '#00AA00');
KiCadSymbols.control.emergencyStop(ctx, 200, 200, 40);
KiCadSymbols.control.pilotLight(ctx, 300, 200, 20, '#FF0000', true);

// Passive components
KiCadSymbols.passive.resistor(ctx, 100, 300, 40, 12);
KiCadSymbols.passive.capacitor(ctx, 200, 300, 30, 20, false);
KiCadSymbols.passive.inductor(ctx, 300, 300, 40, 15);

// Semiconductors
KiCadSymbols.semiconductors.diode(ctx, 100, 400, 30);
KiCadSymbols.semiconductors.led(ctx, 200, 400, 30, '#FF0000');
KiCadSymbols.semiconductors.transistorNPN(ctx, 300, 400, 40);

// Digital logic
KiCadSymbols.digital.gateAND(ctx, 100, 500, 50, 40);
KiCadSymbols.digital.flipFlopD(ctx, 200, 500, 60, 80);

// Helpers
KiCadSymbols.helpers.drawWire(ctx, 0, 0, 100, 100, 'W1', '#000');
KiCadSymbols.helpers.drawJunction(ctx, 100, 100, 4);
KiCadSymbols.helpers.drawGround(ctx, 150, 150, 20);
```

#### Option 2: Backward Compatible (Flat Access)
```javascript
// For backward compatibility with existing code
KiCadSymbols.motor3Phase(ctx, 100, 100, 40);
KiCadSymbols.resistor(ctx, 200, 100, 40, 12);
KiCadSymbols.gateAND(ctx, 300, 100, 50, 40);
```

## Available Components

### Industrial Components (`KiCadSymbols.industrial`)
- `motor3Phase(ctx, x, y, size)` - 3-phase motor with M symbol
- `contactor(ctx, x, y, width, height)` - IEC style contactor/relay
- `circuitBreaker(ctx, x, y, width, height)` - MCB circuit breaker
- `thermalRelay(ctx, x, y, width, height)` - Thermal overload relay
- `transformer3Phase(ctx, x, y, width, height)` - 3-phase transformer
- `fuse(ctx, x, y, width, height)` - IEC style fuse

### Control Devices (`KiCadSymbols.control`)
- `pushButtonNO(ctx, x, y, size, color)` - Normally open push button
- `pilotLight(ctx, x, y, size, color, on)` - Indicator light
- `emergencyStop(ctx, x, y, size)` - Emergency stop button with NC contact
- `selectorSwitch(ctx, x, y, size, position)` - 2-position selector switch

### Passive Components (`KiCadSymbols.passive`)
- `resistor(ctx, x, y, width, height)` - IEC zigzag resistor
- `capacitor(ctx, x, y, width, height, polarized)` - Capacitor (polarized optional)
- `inductor(ctx, x, y, width, height)` - Coil/inductor

### Semiconductors (`KiCadSymbols.semiconductors`)
- `diode(ctx, x, y, size)` - Standard diode
- `led(ctx, x, y, size, color)` - Light emitting diode with arrows
- `zenerDiode(ctx, x, y, size)` - Zener diode with Z-shaped cathode
- `transistorNPN(ctx, x, y, size)` - NPN bipolar transistor
- `mosfetN(ctx, x, y, size)` - N-channel MOSFET
- `opamp(ctx, x, y, width, height)` - Operational amplifier

### Digital Logic (`KiCadSymbols.digital`)
- `gateAND(ctx, x, y, width, height)` - AND logic gate
- `gateOR(ctx, x, y, width, height)` - OR logic gate
- `gateNOT(ctx, x, y, width, height)` - NOT gate (inverter)
- `gateNAND(ctx, x, y, width, height)` - NAND logic gate
- `gateNOR(ctx, x, y, width, height)` - NOR logic gate
- `gateXOR(ctx, x, y, width, height)` - XOR logic gate
- `flipFlopD(ctx, x, y, width, height)` - D flip-flop
- `display7Seg(ctx, x, y, width, height, segments)` - 7-segment display

### Helper Utilities (`KiCadSymbols.helpers`)
- `drawWire(ctx, x1, y1, x2, y2, wireNumber, color)` - Wire with optional label
- `drawJunction(ctx, x, y, size)` - Junction dot
- `drawTerminal(ctx, x, y, size, label)` - Terminal point with optional label
- `drawGround(ctx, x, y, size)` - Ground symbol
- `drawPower(ctx, x, y, size, label)` - Power supply symbol (VCC/VDD)
- `drawConnectionPoint(ctx, x, y, label, direction)` - Labeled connection point

## Component Parameters

All components accept a canvas context (`ctx`) and position parameters. Many also support:
- **size**: Overall size of the component
- **width/height**: Specific dimensions
- **color**: Color for LEDs, buttons, indicators
- **polarized**: Boolean for polarized capacitors
- **on**: Boolean state for indicators
- **position**: Switch position
- **segments**: String of 1s and 0s for 7-segment display
- **label**: Text labels for terminals
- **wireNumber**: Wire identification numbers

## Standards Compliance

All symbols follow IEC 60617 standards as used in KiCad:
- Industrial control symbols for motor control circuits
- Electronic component symbols for circuit diagrams
- Digital logic symbols for logic circuits
- Proper terminal markings and numbering

## Migration from Original kicad-symbols.js

The original monolithic `kicad-symbols.js` file has been split into organized categories. The main `index.js` provides backward compatibility, so existing code should work without changes.

To update your code for better organization:
```javascript
// Old way (still works)
KiCadSymbols.motor3Phase(ctx, x, y, size);

// New way (recommended)
KiCadSymbols.industrial.motor3Phase(ctx, x, y, size);
```

## Benefits of Modular Structure

1. **Better Organization**: Components grouped by type
2. **Easier Maintenance**: Edit individual category files
3. **Selective Loading**: Load only needed categories
4. **Clear Documentation**: Each category is self-contained
5. **Scalability**: Easy to add new components to appropriate categories
