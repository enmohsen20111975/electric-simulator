# Official KiCad Symbol Integration

## Data Source
- **Repository**: https://gitlab.com/kicad/libraries/kicad-symbols
- **License**: Creative Commons CC-BY-SA 4.0
- **Standard**: IEC 60617 (International Electrotechnical Commission)

## Motor Library Analysis

From the official KiCad Motor.kicad_sym file:

### Available Motor Symbols
1. **Motor_DC** - DC Motor with 2 pins (+, -)
2. **Motor_AC** - AC Motor with 2 pins (single phase)
3. **Fan** variants - Various fan symbols
4. **Motor_Servo** - Servo motors with PWM
5. **Stepper_Motor_bipolar** - 4-wire stepper (4 pins)
6. **Stepper_Motor_unipolar_5pin** - 5-wire stepper
7. **Stepper_Motor_unipolar_6pin** - 6-wire stepper

### Missing from Official KiCad Library
❌ **3-Phase AC Motor** - NOT in Motor.kicad_sym
❌ **Contactor** - Need to check Relay.kicad_sym
❌ **3-Phase Transformer** - Need to check Device.kicad_sym or Transformer.kicad_sym

## Required Symbols for Electrical Control

### 1. 3-Phase AC Motor (Custom - Based on IEC 60617)
**Pinout** (Standard industrial):
- **U** (or U1) - Phase L1 connection
- **V** (or V1) - Phase L2 connection  
- **W** (or W1) - Phase L3 connection
- **PE** - Protective Earth (Ground)

**Symbol Drawing**:
- Circle (rotor)
- "M" inside circle
- "3~" notation (indicates 3-phase AC)
- 4 connection points

### 2. Contactor (Need official KiCad data)
**Pinout** (Standard IEC):
- **L1, L2, L3** - Line inputs (power in)
- **T1, T2, T3** - Load outputs (to motor)
- **A1, A2** - Coil control (24V DC or 230V AC)
- **NO contacts** - Auxiliary normally open (13-14, 23-24, etc.)
- **NC contacts** - Auxiliary normally closed (21-22, 31-32, etc.)

### 3. Circuit Breaker / MCB
**Pinout**:
- **1, 3, 5** - Line inputs (L1, L2, L3)
- **2, 4, 6** - Load outputs (T1, T2, T3)

### 4. Thermal Overload Relay
**Pinout**:
- **1, 3, 5** - Power inputs from contactor
- **2, 4, 6** - Power outputs to motor
- **95, 96** - NC auxiliary contact (trip signal)
- **97, 98** - NO auxiliary contact

## Next Steps

1. **Download official symbols** from GitLab:
   - Relay.kicad_sym (for contactors)
   - Device.kicad_sym (basic components)
   - Transformer.kicad_sym (transformers)

2. **Create 3-Phase Motor** symbol based on IEC 60617 standard
   - Not in official KiCad library
   - Must follow electrical engineering conventions
   - U, V, W, PE pinout (industry standard)

3. **Verify pinout accuracy** from manufacturer datasheets:
   - Siemens 3RT contactors
   - ABB M2BAX motors
   - Schneider TeSys contactors

## Why Official KiCad Symbols?

✅ **Standardized** - IEC 60617 compliance  
✅ **Community reviewed** - Thousands of electrical engineers  
✅ **Accurate pinouts** - No guessing or errors  
✅ **Manufacturer alignment** - Matches real component datasheets  
✅ **Professional quality** - Used in commercial PCB design
