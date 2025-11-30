# Digital Logic Components

**Standards:** IEEE 91, IEC 60617  
**Total Components:** 23  
**File:** `DigitalComponents.js`

## Component Categories

### 1. Logic Gates (7 components)
Following IEEE 91 Distinctive Shape standard with proper inversion bubbles:

| Component | Symbol | Inputs | Outputs | Function |
|-----------|--------|--------|---------|----------|
| AND Gate | & | 2 | 1 | All inputs HIGH → output HIGH |
| OR Gate | ≥1 | 2 | 1 | Any input HIGH → output HIGH |
| NOT Gate | 1 | 1 | 1 | Inverts input |
| NAND Gate | &̅ | 2 | 1 | NOT(AND) - Universal gate |
| NOR Gate | ≥̅1 | 2 | 1 | NOT(OR) - Universal gate |
| XOR Gate | =1 | 2 | 1 | Outputs HIGH when inputs differ |
| XNOR Gate | =̅1 | 2 | 1 | Outputs HIGH when inputs match |

### 2. Combinational Logic (6 components)
IEEE 91 G-Symbol and Functional Blocks:

| Component | Type | Inputs | Outputs | Purpose |
|-----------|------|--------|---------|---------|
| MUX 2:1 | G-Symbol | 3 (D0,D1,SEL) | 1 | Data selector |
| DEMUX 1:2 | G-Symbol | 2 (IN,SEL) | 2 | Data distributor |
| Encoder 4:2 | Coder Block | 4 | 2 | Priority encoder |
| Decoder 2:4 | Coder Block | 2 | 4 | Address decoder |
| Full Adder | Logic Block | 3 (A,B,Cin) | 2 (Sum,Cout) | 1-bit arithmetic |
| 4-bit Comparator | Logic Block | 8 (A[3:0],B[3:0]) | 3 (>,=,<) | Magnitude comparison |

### 3. Sequential Logic (6 components)
IEEE 91 Functional Blocks with clock-edge triggering:

| Component | Type | Inputs | Outputs | State Model |
|-----------|------|--------|---------|-------------|
| SR Latch | Latch | 2 (S,R) | 2 (Q,Q̄) | Two-state, level-sensitive |
| D Flip-Flop | FF | 2 (D,CLK) | 2 (Q,Q̄) | Rising-edge triggered |
| JK Flip-Flop | FF | 3 (J,K,CLK) | 2 (Q,Q̄) | Universal FF, toggles on J=K=1 |
| T Flip-Flop | FF | 2 (T,CLK) | 2 (Q,Q̄) | Toggle on T=1 |
| 4-bit Shift Register | SISO | 2 (DATA,CLK) | 1 | Serial shift-and-store |
| 4-bit Counter | Synchronous | 2 (CLK,RESET) | 4 (Q[3:0]) | Binary up-counter (0-15) |

### 4. IO & Clock Components (4 components)

| Component | Type | Inputs | Outputs | Function |
|-----------|------|--------|---------|----------|
| Logic Input | Source | 0 (user toggle) | 1 | Provides 0 or 1 (click to toggle) |
| Logic Output | Sink | 1 | 0 | LED indicator (glows on HIGH) |
| Clock Source | Generator | 0 (config) | 1 | Square wave (frequency/duty cycle) |
| 3-State Buffer | Buffer | 2 (DATA,EN) | 1 | High-Z when EN=0 |

## Simulation Models

### Boolean Logic
All gates implement proper truth tables:
```javascript
AND: output = input1 & input2
OR:  output = input1 | input2
NOT: output = !input
XOR: output = input1 ^ input2
```

### State Machines
Sequential components maintain internal state:
```javascript
D Flip-Flop: On rising clock edge → Q = D
JK Flip-Flop: On rising edge:
  - J=1, K=0 → Q=1 (Set)
  - J=0, K=1 → Q=0 (Reset)
  - J=1, K=1 → Q=!Q (Toggle)
  - J=0, K=0 → Q=Q (Hold)
```

### Clock Generation
```javascript
Clock Source:
  - Period = 1 / frequency
  - Output HIGH for dutyCycle% of period
  - Output LOW for remaining time
```

## Rendering

All components follow IEEE 91/IEC 60617 standards:
- **Gates:** Distinctive shapes (AND=D-shape, OR=curved, XOR=double-curve)
- **Inversion:** Small circle bubble at output
- **Sequential:** Rectangle with clock triangle (rising edge)
- **Labels:** Component type shown inside symbol
- **Ports:** Red for inputs, Green for outputs

## Usage in Circuit Simulator

1. **Select component** from sidebar category:
   - 🔲 LOGIC GATES
   - 🔀 COMBINATIONAL
   - ⏱️ SEQUENTIAL
   - 🔌 IO & CLOCK

2. **Place on canvas** - Click to position

3. **Connect with wires** - Wire from output port to input port

4. **Simulate** - Logic Input can be toggled, Clock runs automatically

5. **Observe outputs** - Logic Output LEDs glow when HIGH

## Integration

Components are loaded in `index.html`:
```html
<script src="/components/digital/DigitalComponents.js"></script>
```

Merged into main engine in `professional-circuit-engine.js`:
```javascript
Object.assign(PROFESSIONAL_COMPONENTS, DIGITAL_COMPONENTS);
```

## Future Enhancements

- [ ] Multi-input gates (3, 4, 8 inputs)
- [ ] 7-segment display decoder
- [ ] RAM/ROM modules
- [ ] ALU (Arithmetic Logic Unit)
- [ ] BCD converters
- [ ] Schmitt triggers
- [ ] Oscilloscope for waveform display
- [ ] Truth table generator
- [ ] Timing diagram viewer
- [ ] Gate-level simulation engine
