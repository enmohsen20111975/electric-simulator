/**
 * Industrial Circuit Templates
 * Pre-configured circuit patterns for electrical control applications
 * Following IEC 61439 standards for industrial control panels
 */

const CircuitTemplates = {
    // Direct-On-Line (DOL) Motor Starter - Most common motor starting method
    DOL_STARTER: {
        name: 'DOL Motor Starter',
        description: 'Direct-On-Line starter with MCB, Contactor, Thermal Overload, Start/Stop buttons',
        standard: 'IEC 60947-4-1',
        components: [
            // Main Circuit Breaker (MCB)
            {
                type: 'mcb_3phase',
                id: 'MCB1',
                x: 200,
                y: 100,
                rotation: 0,
                properties: {
                    current: { value: 16, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    curve: 'C'
                }
            },
            // Main Contactor (KM1)
            {
                type: 'contactor_3pole',
                id: 'KM1',
                x: 200,
                y: 220,
                rotation: 0,
                properties: {
                    current: { value: 12, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    coilVoltage: { value: 230, unit: 'V' }
                }
            },
            // Thermal Overload Relay (F2)
            {
                type: 'thermal_overload',
                id: 'F2',
                x: 200,
                y: 340,
                rotation: 0,
                properties: {
                    current: { value: 12, unit: 'A' },
                    range: '10-16A',
                    class: '10A'
                }
            },
            // Motor (M1)
            {
                type: 'motor_ac_3phase',
                id: 'M1',
                x: 200,
                y: 460,
                rotation: 0,
                properties: {
                    power: { value: 3, unit: 'kW' },
                    voltage: { value: 400, unit: 'V' },
                    current: { value: 6.5, unit: 'A' },
                    speed: { value: 1440, unit: 'rpm' }
                }
            },
            // Start Button (S1)
            {
                type: 'pushbutton_no',
                id: 'S1',
                x: 80,
                y: 220,
                rotation: 0,
                properties: {
                    type: 'NO',
                    color: 'Green',
                    label: 'START'
                }
            },
            // Stop Button (S2)
            {
                type: 'pushbutton_no',
                id: 'S2',
                x: 80,
                y: 160,
                rotation: 0,
                properties: {
                    type: 'NC',
                    color: 'Red',
                    label: 'STOP'
                }
            }
        ],
        wires: [
            // L1 power rail from MCB to Contactor
            { from: { component: 'MCB1', port: 'L1_out' }, to: { component: 'KM1', port: 'L1_in' } },
            // L2 power rail
            { from: { component: 'MCB1', port: 'L2_out' }, to: { component: 'KM1', port: 'L2_in' } },
            // L3 power rail
            { from: { component: 'MCB1', port: 'L3_out' }, to: { component: 'KM1', port: 'L3_in' } },
            
            // Contactor to Thermal Overload
            { from: { component: 'KM1', port: 'L1_out' }, to: { component: 'F2', port: 'L1_in' } },
            { from: { component: 'KM1', port: 'L2_out' }, to: { component: 'F2', port: 'L2_in' } },
            { from: { component: 'KM1', port: 'L3_out' }, to: { component: 'F2', port: 'L3_in' } },
            
            // Thermal Overload to Motor
            { from: { component: 'F2', port: 'L1_out' }, to: { component: 'M1', port: 'L1' } },
            { from: { component: 'F2', port: 'L2_out' }, to: { component: 'M1', port: 'L2' } },
            { from: { component: 'F2', port: 'L3_out' }, to: { component: 'M1', port: 'L3' } },
            
            // Control circuit (simplified - would need control transformer in real installation)
            { from: { component: 'S2', port: 'out' }, to: { component: 'S1', port: 'in' } },
            { from: { component: 'S1', port: 'out' }, to: { component: 'KM1', port: 'A1' } }
        ],
        notes: [
            'Power circuit rated for 3kW 3-phase motor',
            'MCB provides short-circuit protection',
            'Thermal overload provides motor overload protection',
            'Start button (S1) energizes contactor coil',
            'Stop button (S2) breaks control circuit',
            'Missing: Control transformer, pilot lights, auxiliary contacts for latching'
        ]
    },

    // Star-Delta Motor Starter - For large motors requiring reduced starting current
    STAR_DELTA_STARTER: {
        name: 'Star-Delta Motor Starter',
        description: 'Automatic Star-Delta starter with 3 contactors and timer for smooth motor starting',
        standard: 'IEC 60947-4-1',
        components: [
            // Main Circuit Breaker
            {
                type: 'mcb_3phase',
                id: 'MCB1',
                x: 300,
                y: 80,
                rotation: 0,
                properties: {
                    current: { value: 32, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    curve: 'D'
                }
            },
            // Main Contactor (KM1)
            {
                type: 'contactor_3pole',
                id: 'KM1',
                x: 200,
                y: 200,
                rotation: 0,
                properties: {
                    current: { value: 25, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    coilVoltage: { value: 230, unit: 'V' }
                }
            },
            // Star Contactor (KM2)
            {
                type: 'contactor_3pole',
                id: 'KM2',
                x: 300,
                y: 300,
                rotation: 0,
                properties: {
                    current: { value: 25, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    coilVoltage: { value: 230, unit: 'V' }
                }
            },
            // Delta Contactor (KM3)
            {
                type: 'contactor_3pole',
                id: 'KM3',
                x: 400,
                y: 300,
                rotation: 0,
                properties: {
                    current: { value: 25, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    coilVoltage: { value: 230, unit: 'V' }
                }
            },
            // Thermal Overload Relay
            {
                type: 'thermal_overload',
                id: 'F2',
                x: 200,
                y: 420,
                rotation: 0,
                properties: {
                    current: { value: 25, unit: 'A' },
                    range: '20-32A',
                    class: '10A'
                }
            },
            // Motor (M1) - 11kW rating
            {
                type: 'motor_ac_3phase',
                id: 'M1',
                x: 300,
                y: 540,
                rotation: 0,
                properties: {
                    power: { value: 11, unit: 'kW' },
                    voltage: { value: 400, unit: 'V' },
                    current: { value: 22, unit: 'A' },
                    speed: { value: 1460, unit: 'rpm' }
                }
            },
            // Start Button
            {
                type: 'pushbutton_no',
                id: 'S1',
                x: 100,
                y: 200,
                rotation: 0,
                properties: {
                    type: 'NO',
                    color: 'Green',
                    label: 'START'
                }
            },
            // Stop Button
            {
                type: 'pushbutton_no',
                id: 'S2',
                x: 100,
                y: 140,
                rotation: 0,
                properties: {
                    type: 'NC',
                    color: 'Red',
                    label: 'STOP'
                }
            }
        ],
        wires: [
            // Power distribution from MCB
            { from: { component: 'MCB1', port: 'L1_out' }, to: { component: 'KM1', port: 'L1_in' } },
            { from: { component: 'MCB1', port: 'L2_out' }, to: { component: 'KM1', port: 'L2_in' } },
            { from: { component: 'MCB1', port: 'L3_out' }, to: { component: 'KM1', port: 'L3_in' } },
            
            // Main contactor to thermal overload
            { from: { component: 'KM1', port: 'L1_out' }, to: { component: 'F2', port: 'L1_in' } },
            { from: { component: 'KM1', port: 'L2_out' }, to: { component: 'F2', port: 'L2_in' } },
            { from: { component: 'KM1', port: 'L3_out' }, to: { component: 'F2', port: 'L3_in' } },
            
            // Thermal overload to motor
            { from: { component: 'F2', port: 'L1_out' }, to: { component: 'M1', port: 'L1' } },
            { from: { component: 'F2', port: 'L2_out' }, to: { component: 'M1', port: 'L2' } },
            { from: { component: 'F2', port: 'L3_out' }, to: { component: 'M1', port: 'L3' } }
        ],
        sequence: [
            '1. Press START button (S1)',
            '2. Main contactor KM1 energizes',
            '3. Star contactor KM2 energizes (motor starts in star configuration)',
            '4. Motor accelerates at reduced current (≈33% of DOL current)',
            '5. After timer delay (typically 5-10 seconds):',
            '   - Star contactor KM2 de-energizes',
            '   - Small delay (50-100ms) to prevent short circuit',
            '   - Delta contactor KM3 energizes (motor switches to delta)',
            '6. Motor runs at full speed in delta configuration',
            '7. Press STOP button (S2) to shut down'
        ],
        notes: [
            'Typical starting current: 2-2.5× rated current (vs 5-7× for DOL)',
            'Suitable for motors > 5kW to reduce grid disturbance',
            'Motor must have 6 terminals accessible (U1, V1, W1, U2, V2, W2)',
            'Timer delay typically 5-10 seconds based on load inertia',
            'Mechanical/electrical interlocking required between KM2 and KM3',
            'Missing in diagram: Timer relay, interlocking circuits, control transformer'
        ]
    },

    // Forward-Reverse Motor Control - For bidirectional motor operation
    FORWARD_REVERSE_STARTER: {
        name: 'Forward-Reverse Motor Starter',
        description: 'Reversing motor starter with electrical and mechanical interlocking',
        standard: 'IEC 60947-4-1',
        components: [
            // Main Circuit Breaker
            {
                type: 'mcb_3phase',
                id: 'MCB1',
                x: 300,
                y: 80,
                rotation: 0,
                properties: {
                    current: { value: 16, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    curve: 'C'
                }
            },
            // Forward Contactor (KM1)
            {
                type: 'contactor_3pole',
                id: 'KM1',
                x: 200,
                y: 220,
                rotation: 0,
                properties: {
                    current: { value: 12, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    coilVoltage: { value: 230, unit: 'V' }
                }
            },
            // Reverse Contactor (KM2)
            {
                type: 'contactor_3pole',
                id: 'KM2',
                x: 400,
                y: 220,
                rotation: 0,
                properties: {
                    current: { value: 12, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    coilVoltage: { value: 230, unit: 'V' }
                }
            },
            // Thermal Overload Relay
            {
                type: 'thermal_overload',
                id: 'F2',
                x: 300,
                y: 360,
                rotation: 0,
                properties: {
                    current: { value: 12, unit: 'A' },
                    range: '10-16A',
                    class: '10A'
                }
            },
            // Motor
            {
                type: 'motor_ac_3phase',
                id: 'M1',
                x: 300,
                y: 480,
                rotation: 0,
                properties: {
                    power: { value: 3, unit: 'kW' },
                    voltage: { value: 400, unit: 'V' },
                    current: { value: 6.5, unit: 'A' },
                    speed: { value: 1440, unit: 'rpm' }
                }
            },
            // Forward Button
            {
                type: 'pushbutton_no',
                id: 'S1',
                x: 80,
                y: 220,
                rotation: 0,
                properties: {
                    type: 'NO',
                    color: 'Green',
                    label: 'FORWARD'
                }
            },
            // Reverse Button
            {
                type: 'pushbutton_no',
                id: 'S2',
                x: 80,
                y: 280,
                rotation: 0,
                properties: {
                    type: 'NO',
                    color: 'Yellow',
                    label: 'REVERSE'
                }
            },
            // Stop Button
            {
                type: 'pushbutton_no',
                id: 'S0',
                x: 80,
                y: 160,
                rotation: 0,
                properties: {
                    type: 'NC',
                    color: 'Red',
                    label: 'STOP'
                }
            },
            // Emergency Stop
            {
                type: 'emergency_stop',
                id: 'S3',
                x: 80,
                y: 100,
                rotation: 0,
                properties: {
                    type: 'NC',
                    contacts: '2NC',
                    category: 'Category 0'
                }
            }
        ],
        wires: [
            // Power distribution
            { from: { component: 'MCB1', port: 'L1_out' }, to: { component: 'KM1', port: 'L1_in' } },
            { from: { component: 'MCB1', port: 'L2_out' }, to: { component: 'KM1', port: 'L2_in' } },
            { from: { component: 'MCB1', port: 'L3_out' }, to: { component: 'KM1', port: 'L3_in' } },
            
            // Same power to reverse contactor
            { from: { component: 'MCB1', port: 'L1_out' }, to: { component: 'KM2', port: 'L1_in' } },
            { from: { component: 'MCB1', port: 'L2_out' }, to: { component: 'KM2', port: 'L3_in' } }, // Phase swap L2->L3
            { from: { component: 'MCB1', port: 'L3_out' }, to: { component: 'KM2', port: 'L2_in' } }  // Phase swap L3->L2
        ],
        interlocking: [
            'Electrical interlocking: KM1 NC auxiliary contact in series with KM2 coil',
            'Electrical interlocking: KM2 NC auxiliary contact in series with KM1 coil',
            'Mechanical interlocking: Physical blocking mechanism in contactor housing',
            'Time delay: 100-200ms delay between direction changes to allow motor to stop'
        ],
        notes: [
            'Phase reversal achieved by swapping L2 and L3 phases',
            'Both contactors MUST NOT close simultaneously (causes short circuit)',
            'Mechanical interlocking prevents simultaneous operation',
            'Electrical interlocking uses NC auxiliary contacts',
            'Emergency stop breaks all power circuits',
            'Direction change requires motor to stop first (safety)',
            'Missing in diagram: Interlocking circuits, pilot lights, control transformer'
        ]
    },

    // VFD Motor Drive - Modern variable speed control
    VFD_MOTOR_DRIVE: {
        name: 'VFD Motor Drive System',
        description: 'Variable Frequency Drive with isolation and protection',
        standard: 'IEC 61800-5-1',
        components: [
            // Input Circuit Breaker
            {
                type: 'mccb_3phase',
                id: 'Q1',
                x: 200,
                y: 80,
                rotation: 0,
                properties: {
                    current: { value: 100, unit: 'A' },
                    voltage: { value: 400, unit: 'V' },
                    icn: { value: 36, unit: 'kA' }
                }
            },
            // Input RCD for earth fault protection
            {
                type: 'rcd_3phase',
                id: 'F1',
                x: 200,
                y: 200,
                rotation: 0,
                properties: {
                    current: { value: 63, unit: 'A' },
                    sensitivity: { value: 300, unit: 'mA' },
                    type: 'B'
                }
            },
            // Variable Frequency Drive
            {
                type: 'vfd_3phase',
                id: 'VFD1',
                x: 200,
                y: 340,
                rotation: 0,
                properties: {
                    power: { value: 11, unit: 'kW' },
                    inputVoltage: { value: 400, unit: 'V' },
                    outputCurrent: { value: 25, unit: 'A' },
                    frequency: { value: 50, unit: 'Hz' }
                }
            },
            // Motor
            {
                type: 'motor_ac_3phase',
                id: 'M1',
                x: 200,
                y: 500,
                rotation: 0,
                properties: {
                    power: { value: 11, unit: 'kW' },
                    voltage: { value: 400, unit: 'V' },
                    current: { value: 22, unit: 'A' },
                    speed: { value: 1460, unit: 'rpm' }
                }
            },
            // Start/Stop selector
            {
                type: 'selector_switch',
                id: 'S1',
                x: 60,
                y: 340,
                rotation: 0,
                properties: {
                    positions: 2,
                    label: 'START/STOP',
                    type: 'maintained'
                }
            }
        ],
        wires: [
            // Input power
            { from: { component: 'Q1', port: 'L1_out' }, to: { component: 'F1', port: 'L1_in' } },
            { from: { component: 'Q1', port: 'L2_out' }, to: { component: 'F1', port: 'L2_in' } },
            { from: { component: 'Q1', port: 'L3_out' }, to: { component: 'F1', port: 'L3_in' } },
            
            // RCD to VFD input
            { from: { component: 'F1', port: 'L1_out' }, to: { component: 'VFD1', port: 'L1_in' } },
            { from: { component: 'F1', port: 'L2_out' }, to: { component: 'VFD1', port: 'L2_in' } },
            { from: { component: 'F1', port: 'L3_out' }, to: { component: 'VFD1', port: 'L3_in' } },
            
            // VFD output to motor
            { from: { component: 'VFD1', port: 'U' }, to: { component: 'M1', port: 'L1' } },
            { from: { component: 'VFD1', port: 'V' }, to: { component: 'M1', port: 'L2' } },
            { from: { component: 'VFD1', port: 'W' }, to: { component: 'M1', port: 'L3' } }
        ],
        features: [
            'Soft start/stop - gradual acceleration and deceleration',
            'Speed control - 0-100 Hz output frequency',
            'Energy savings - reduced speed = reduced power consumption',
            'Torque control - constant torque or variable torque modes',
            'Motor protection - overload, overvoltage, undervoltage, phase loss',
            'Braking - DC injection braking or dynamic braking',
            'PID control - automatic speed regulation based on feedback'
        ],
        notes: [
            'VFD provides complete motor protection (no separate overload needed)',
            'RCD Type B required for DC residual currents from VFD',
            'EMC filters recommended to reduce electrical noise',
            'Motor cables should be shielded and properly grounded',
            'Control voltage typically 24V DC from VFD power supply',
            'Programming via keypad, HMI, or industrial network (Profinet, EtherNet/IP)',
            'Missing in diagram: Control wiring, feedback sensors, HMI panel'
        ]
    }
};

/**
 * Load a circuit template into the canvas
 * @param {string} templateKey - Key from CircuitTemplates object
 * @param {number} offsetX - Horizontal offset for template placement
 * @param {number} offsetY - Vertical offset for template placement
 * @returns {object} Loaded components and wires with new IDs
 */
function loadCircuitTemplate(templateKey, offsetX = 0, offsetY = 0) {
    const template = CircuitTemplates[templateKey];
    if (!template) {
        console.error(`Template "${templateKey}" not found`);
        return null;
    }
    
    const loadedComponents = [];
    const loadedWires = [];
    const idMapping = new Map(); // Map template IDs to new component IDs
    
    // Create components
    for (const compTemplate of template.components) {
        const newComp = {
            id: generateUniqueId(),
            type: compTemplate.type,
            x: compTemplate.x + offsetX,
            y: compTemplate.y + offsetY,
            rotation: compTemplate.rotation || 0,
            properties: { ...compTemplate.properties },
            ports: [] // Will be populated by component definition
        };
        
        // Map old ID to new ID
        idMapping.set(compTemplate.id, newComp.id);
        
        // Get component definition and add ports
        const compDef = COMPONENT_LIBRARY[compTemplate.type] || ELECTRICAL_COMPONENTS[compTemplate.type];
        if (compDef) {
            newComp.ports = compDef.ports ? [...compDef.ports] : [];
            newComp.width = compDef.width || 60;
            newComp.height = compDef.height || 80;
        }
        
        loadedComponents.push(newComp);
    }
    
    // Create wires with updated component IDs
    if (template.wires) {
        for (const wireTemplate of template.wires) {
            const fromCompId = idMapping.get(wireTemplate.from.component);
            const toCompId = idMapping.get(wireTemplate.to.component);
            
            if (fromCompId && toCompId) {
                const newWire = {
                    id: generateUniqueId(),
                    from: {
                        componentId: fromCompId,
                        portId: wireTemplate.from.port
                    },
                    to: {
                        componentId: toCompId,
                        portId: wireTemplate.to.port
                    },
                    path: [] // Will be calculated by routing algorithm
                };
                
                loadedWires.push(newWire);
            }
        }
    }
    
    return {
        name: template.name,
        description: template.description,
        components: loadedComponents,
        wires: loadedWires,
        notes: template.notes || [],
        sequence: template.sequence || [],
        interlocking: template.interlocking || []
    };
}

/**
 * Generate unique ID for components/wires
 */
function generateUniqueId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Add template to current circuit
 * @param {string} templateKey - Template to add
 * @param {number} offsetX - X position offset
 * @param {number} offsetY - Y position offset
 */
function addTemplateToCircuit(templateKey, offsetX = 100, offsetY = 100) {
    const loaded = loadCircuitTemplate(templateKey, offsetX, offsetY);
    if (!loaded) return;
    
    // Add components to state
    for (const comp of loaded.components) {
        state.components.push(comp);
    }
    
    // Add wires to state and calculate paths
    for (const wire of loaded.wires) {
        // Find actual component objects
        const fromComp = state.components.find(c => c.id === wire.from.componentId);
        const toComp = state.components.find(c => c.id === wire.to.componentId);
        
        if (fromComp && toComp) {
            // Calculate wire path using routing algorithm
            wire.path = calculateWirePath(wire.from, wire.to, fromComp, toComp);
            state.wires.push(wire);
        }
    }
    
    // Update junction detection
    detectWireIntersections();
    
    // Show info panel with template details
    showTemplateInfo(loaded);
    
    // Redraw canvas
    render();
    
    console.log(`✓ Template "${loaded.name}" loaded successfully`);
    console.log(`  Components: ${loaded.components.length}`);
    console.log(`  Wires: ${loaded.wires.length}`);
    if (loaded.notes.length > 0) {
        console.log(`  Notes:`);
        loaded.notes.forEach(note => console.log(`    - ${note}`));
    }
}

/**
 * Show template information in UI
 */
function showTemplateInfo(templateData) {
    const infoPanel = document.getElementById('template-info-panel');
    if (!infoPanel) {
        // Create info panel if it doesn't exist
        const panel = document.createElement('div');
        panel.id = 'template-info-panel';
        panel.style.cssText = `
            position: absolute;
            top: 100px;
            right: 20px;
            width: 320px;
            max-height: 500px;
            overflow-y: auto;
            background: white;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-family: 'Segoe UI', Arial, sans-serif;
        `;
        document.body.appendChild(panel);
    }
    
    const panel = document.getElementById('template-info-panel');
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="margin: 0; color: #1e40af; font-size: 16px;">${templateData.name}</h3>
            <button onclick="document.getElementById('template-info-panel').remove()" 
                    style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">×</button>
        </div>
        <p style="margin: 0 0 12px 0; color: #666; font-size: 13px;">${templateData.description}</p>
    `;
    
    if (templateData.sequence && templateData.sequence.length > 0) {
        html += `<div style="margin-bottom: 12px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;">Operation Sequence:</h4>
            <ol style="margin: 0; padding-left: 20px; font-size: 12px; color: #444;">
                ${templateData.sequence.map(step => `<li style="margin-bottom: 4px;">${step}</li>`).join('')}
            </ol>
        </div>`;
    }
    
    if (templateData.interlocking && templateData.interlocking.length > 0) {
        html += `<div style="margin-bottom: 12px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #dc2626;">Safety Interlocking:</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #444;">
                ${templateData.interlocking.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
            </ul>
        </div>`;
    }
    
    if (templateData.notes && templateData.notes.length > 0) {
        html += `<div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #059669;">Notes:</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #444;">
                ${templateData.notes.map(note => `<li style="margin-bottom: 4px;">${note}</li>`).join('')}
            </ul>
        </div>`;
    }
    
    panel.innerHTML = html;
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CircuitTemplates, loadCircuitTemplate, addTemplateToCircuit };
}
