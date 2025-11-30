# KiCad Symbols Migration Guide

## Overview

The original monolithic `kicad-symbols.js` file (33KB+) has been reorganized into modular category-based files for better maintainability and organization.

## What Changed

### Before (Old Structure)
```
kicad-symbols.js  (single 33KB file with all symbols)
```

### After (New Structure)
```
components/kicad-symbols/
├── index.js                  # Main entry point
├── Helpers.js               # 4KB - Utility functions
├── PassiveComponents.js      # 4KB - R, L, C
├── Semiconductors.js         # 7KB - Diodes, transistors, ICs
├── DigitalLogic.js          # 8KB - Logic gates, flip-flops
├── IndustrialComponents.js   # 7KB - Motors, contactors, breakers
├── ControlDevices.js         # 5KB - Buttons, switches, lights
├── README.md                # Documentation
├── examples.js              # Usage examples
└── MIGRATION.md             # This file
```

## Migration Steps

### Step 1: Update HTML Script Tags

**Old Way:**
```html
<script src="kicad-symbols.js"></script>
```

**New Way:**
```html
<!-- Load modular KiCad symbols -->
<script src="components/kicad-symbols/Helpers.js"></script>
<script src="components/kicad-symbols/PassiveComponents.js"></script>
<script src="components/kicad-symbols/Semiconductors.js"></script>
<script src="components/kicad-symbols/DigitalLogic.js"></script>
<script src="components/kicad-symbols/IndustrialComponents.js"></script>
<script src="components/kicad-symbols/ControlDevices.js"></script>
<script src="components/kicad-symbols/index.js"></script>
```

### Step 2: Update Code (Optional but Recommended)

**Old Way (Still Works):**
```javascript
// Flat namespace - backward compatible
KiCadSymbols.resistor(ctx, x, y, width, height);
KiCadSymbols.motor3Phase(ctx, x, y, size);
KiCadSymbols.gateAND(ctx, x, y, width, height);
```

**New Way (Recommended):**
```javascript
// Organized by category
KiCadSymbols.passive.resistor(ctx, x, y, width, height);
KiCadSymbols.industrial.motor3Phase(ctx, x, y, size);
KiCadSymbols.digital.gateAND(ctx, x, y, width, height);
```

## Category Mapping

### Helpers (Utility Functions)
| Component | Old Access | New Access |
|-----------|-----------|------------|
| Wire | `KiCadSymbols.drawWire()` | `KiCadSymbols.helpers.drawWire()` |
| Junction | `KiCadSymbols.drawJunction()` | `KiCadSymbols.helpers.drawJunction()` |
| Terminal | N/A | `KiCadSymbols.helpers.drawTerminal()` |
| Ground | N/A | `KiCadSymbols.helpers.drawGround()` |
| Power | N/A | `KiCadSymbols.helpers.drawPower()` |
| Connection Point | N/A | `KiCadSymbols.helpers.drawConnectionPoint()` |

### Passive Components
| Component | Old Access | New Access |
|-----------|-----------|------------|
| Resistor | `KiCadSymbols.resistor()` | `KiCadSymbols.passive.resistor()` |
| Capacitor | `KiCadSymbols.capacitor()` | `KiCadSymbols.passive.capacitor()` |
| Inductor | `KiCadSymbols.inductor()` | `KiCadSymbols.passive.inductor()` |

### Semiconductors
| Component | Old Access | New Access |
|-----------|-----------|------------|
| Diode | `KiCadSymbols.diode()` | `KiCadSymbols.semiconductors.diode()` |
| LED | `KiCadSymbols.led()` | `KiCadSymbols.semiconductors.led()` |
| Zener Diode | `KiCadSymbols.zenerDiode()` | `KiCadSymbols.semiconductors.zenerDiode()` |
| NPN Transistor | `KiCadSymbols.transistorNPN()` | `KiCadSymbols.semiconductors.transistorNPN()` |
| N-MOSFET | `KiCadSymbols.mosfetN()` | `KiCadSymbols.semiconductors.mosfetN()` |
| Op-Amp | `KiCadSymbols.opamp()` | `KiCadSymbols.semiconductors.opamp()` |

### Digital Logic
| Component | Old Access | New Access |
|-----------|-----------|------------|
| AND Gate | `KiCadSymbols.gateAND()` | `KiCadSymbols.digital.gateAND()` |
| OR Gate | `KiCadSymbols.gateOR()` | `KiCadSymbols.digital.gateOR()` |
| NOT Gate | `KiCadSymbols.gateNOT()` | `KiCadSymbols.digital.gateNOT()` |
| NAND Gate | `KiCadSymbols.gateNAND()` | `KiCadSymbols.digital.gateNAND()` |
| NOR Gate | `KiCadSymbols.gateNOR()` | `KiCadSymbols.digital.gateNOR()` |
| XOR Gate | `KiCadSymbols.gateXOR()` | `KiCadSymbols.digital.gateXOR()` |
| D Flip-Flop | `KiCadSymbols.flipFlopD()` | `KiCadSymbols.digital.flipFlopD()` |
| 7-Segment Display | `KiCadSymbols.display7Seg()` | `KiCadSymbols.digital.display7Seg()` |

### Industrial Components
| Component | Old Access | New Access |
|-----------|-----------|------------|
| 3-Phase Motor | `KiCadSymbols.motor3Phase()` | `KiCadSymbols.industrial.motor3Phase()` |
| Contactor | `KiCadSymbols.contactor()` | `KiCadSymbols.industrial.contactor()` |
| Circuit Breaker | `KiCadSymbols.circuitBreaker()` | `KiCadSymbols.industrial.circuitBreaker()` |
| Thermal Relay | `KiCadSymbols.thermalRelay()` | `KiCadSymbols.industrial.thermalRelay()` |
| Transformer | `KiCadSymbols.transformer3Phase()` | `KiCadSymbols.industrial.transformer3Phase()` |
| Fuse | `KiCadSymbols.fuse()` | `KiCadSymbols.industrial.fuse()` |

### Control Devices
| Component | Old Access | New Access |
|-----------|-----------|------------|
| Push Button NO | `KiCadSymbols.pushButtonNO()` | `KiCadSymbols.control.pushButtonNO()` |
| Pilot Light | `KiCadSymbols.pilotLight()` | `KiCadSymbols.control.pilotLight()` |
| Emergency Stop | `KiCadSymbols.emergencyStop()` | `KiCadSymbols.control.emergencyStop()` |
| Selector Switch | `KiCadSymbols.selectorSwitch()` | `KiCadSymbols.control.selectorSwitch()` |

## Benefits of New Structure

### 1. Better Organization
Components are grouped by function making them easier to find and understand.

### 2. Smaller File Sizes
- Each category file is 4-8KB instead of one 33KB file
- Faster loading times
- Can load only what you need

### 3. Easier Maintenance
- Edit specific category without affecting others
- Clear separation of concerns
- Better code documentation

### 4. Backward Compatible
- Old flat access still works
- No breaking changes
- Migrate at your own pace

### 5. Extensibility
- Easy to add new components to appropriate category
- Clear structure for contributions
- Better testing isolation

## Selective Loading

If you only need specific categories, load just those:

```html
<!-- Only load what you need -->
<script src="components/kicad-symbols/Helpers.js"></script>
<script src="components/kicad-symbols/PassiveComponents.js"></script>
<script src="components/kicad-symbols/index.js"></script>
```

Then in code:
```javascript
// Only passive components are available
KiCadSymbols.passive.resistor(ctx, x, y, 40, 12);
KiCadSymbols.passive.capacitor(ctx, x, y, 30, 20, false);
```

## Testing Your Migration

1. **Load all new files** in your HTML
2. **Test existing code** - it should work without changes
3. **Gradually update** to use new organized structure
4. **Remove old file** once fully migrated

## Rollback Plan

If you encounter issues:

1. Keep the old `kicad-symbols.js` file
2. Comment out new script tags
3. Uncomment old script tag
4. Report issues on GitHub

## Questions?

Check:
- `components/kicad-symbols/README.md` - Full documentation
- `components/kicad-symbols/examples.js` - Usage examples
- Original `kicad-symbols.js` - Has deprecation notice with links

## Timeline

- **Current**: Both old and new work side-by-side
- **Phase 1** (Now): Start using new organized structure
- **Phase 2** (Future): Old flat access deprecated but still works
- **Phase 3** (Future): Old file removed, only new structure

Take your time - there's no rush to migrate!
