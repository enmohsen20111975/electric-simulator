// Electrical Control Components - IEEE/IEC Standards
// ABB, Siemens, Schneider Electric Specifications

// ============================================
// MOTORS - AC & DC
// ============================================
const ELECTRICAL_MOTORS = {
    motor_ac_3phase: {
        name: '3-Phase AC Induction Motor',
        symbol: 'M',
        category: 'motors',
        domain: 'electrical',
        manufacturer: 'ABB',
        model: 'M2BAX 100LA',
        width: 80,
        height: 80,
        ports: [
            { id: 'L1', x: -40, y: -20, label: 'L1' },
            { id: 'L2', x: -40, y: 0, label: 'L2' },
            { id: 'L3', x: -40, y: 20, label: 'L3' },
            { id: 'PE', x: -40, y: 40, label: 'PE' }
        ],
        properties: {
            power: { value: 3, unit: 'kW', min: 0.18, max: 315 },
            voltage: { value: 400, unit: 'V', min: 220, max: 690 },
            current: { value: 6.8, unit: 'A', min: 0, max: 600 },
            frequency: { value: 50, unit: 'Hz', min: 50, max: 60 },
            poles: { value: 4, unit: '', min: 2, max: 12 },
            rpm: { value: 1440, unit: 'rpm', min: 0, max: 3600 },
            efficiency: { value: 91.7, unit: '%', min: 80, max: 98 },
            powerFactor: { value: 0.85, unit: '', min: 0, max: 1 },
            torque: { value: 19.9, unit: 'Nm', min: 0, max: 10000 },
            protectionClass: { value: 'IP55', unit: '', options: ['IP55', 'IP65', 'IP66'] }
        },
        specifications: {
            manufacturer: 'ABB',
            series: 'M2BAX',
            frame: '100LA',
            mounting: 'B3 (foot)',
            insulation: 'Class F',
            temperature: 'T40°C ambient',
            altitude: '1000m max',
            duty: 'S1 (continuous)',
            startingMethod: 'DOL / Star-Delta / VFD'
        },
        draw: function(ctx, x, y) {
            if (typeof KiCadSymbols !== 'undefined' && KiCadSymbols.industrial) {
                KiCadSymbols.industrial.motor3Phase(ctx, x, y, 40);
            } else {
                drawMotor3Phase(ctx, x, y);
            }
        }
    },

    motor_dc: {
        name: 'DC Motor',
        symbol: 'M',
        category: 'motors',
        domain: 'electrical',
        manufacturer: 'Siemens',
        model: '1GG5',
        width: 80,
        height: 70,
        ports: [
            { id: 'A+', x: -40, y: -15, label: 'A+' },
            { id: 'A-', x: -40, y: 15, label: 'A-' },
            { id: 'F+', x: 40, y: -15, label: 'F+' },
            { id: 'F-', x: 40, y: 15, label: 'F-' }
        ],
        properties: {
            power: { value: 2.2, unit: 'kW', min: 0.1, max: 200 },
            voltage: { value: 220, unit: 'V', min: 12, max: 600 },
            current: { value: 11.5, unit: 'A', min: 0, max: 1000 },
            rpm: { value: 1500, unit: 'rpm', min: 0, max: 6000 },
            torque: { value: 14, unit: 'Nm', min: 0, max: 5000 }
        },
        specifications: {
            manufacturer: 'Siemens',
            series: '1GG5',
            type: 'Permanent Magnet DC',
            excitation: 'Separate / Series / Shunt',
            duty: 'S1'
        },
        draw: drawMotorDC
    }
};

// ============================================
// CONTACTORS & RELAYS
// ============================================
const ELECTRICAL_CONTACTORS = {
    contactor_3pole: {
        name: '3-Pole Contactor',
        symbol: 'K',
        category: 'contactors',
        domain: 'electrical',
        manufacturer: 'ABB',
        model: 'AF09-30-10',
        width: 70,
        height: 90,
        ports: [
            { id: 'L1', x: -35, y: -35, label: 'L1' },
            { id: 'L2', x: 0, y: -35, label: 'L2' },
            { id: 'L3', x: 35, y: -35, label: 'L3' },
            { id: 'T1', x: -35, y: 35, label: 'T1' },
            { id: 'T2', x: 0, y: 35, label: 'T2' },
            { id: 'T3', x: 35, y: 35, label: 'T3' },
            { id: 'A1', x: -50, y: 0, label: 'A1' },
            { id: 'A2', x: 50, y: 0, label: 'A2' }
        ],
        properties: {
            ratedCurrent: { value: 9, unit: 'A', min: 6, max: 820 },
            controlVoltage: { value: 230, unit: 'V AC', min: 24, max: 690 },
            poles: { value: 3, unit: '', min: 3, max: 4 },
            auxiliaryContacts: { value: '1NO+1NC', unit: '', options: ['1NO', '1NC', '1NO+1NC', '2NO+2NC'] },
            mechanicalLife: { value: 10000000, unit: 'ops', min: 1000000, max: 10000000 },
            electricalLife: { value: 600000, unit: 'ops', min: 100000, max: 2000000 }
        },
        specifications: {
            manufacturer: 'ABB',
            series: 'AF',
            frame: 'AF09-30-10',
            utilization: 'AC-3 (motors)',
            power_AC3_400V: '4 kW',
            suitableFor: 'Motor control, resistive loads',
            mounting: 'DIN rail / screw',
            overloadProtection: 'Use with thermal relay',
            standards: 'IEC 60947-4-1'
        },
        draw: function(ctx, x, y) {
            if (typeof KiCadSymbols !== 'undefined' && KiCadSymbols.industrial) {
                KiCadSymbols.industrial.contactor(ctx, x, y, 60, 80);
            } else {
                drawContactor3Pole(ctx, x, y);
            }
        }
    },

    relay_control: {
        name: 'Control Relay',
        symbol: 'K',
        category: 'relays',
        domain: 'electrical',
        manufacturer: 'Schneider',
        model: 'RXM4AB2P7',
        width: 50,
        height: 60,
        ports: [
            { id: 'A1', x: -25, y: -20, label: 'A1' },
            { id: 'A2', x: 25, y: -20, label: 'A2' },
            { id: '11', x: -25, y: 20, label: '11' },
            { id: '12', x: -10, y: 20, label: '12' },
            { id: '21', x: 10, y: 20, label: '21' },
            { id: '22', x: 25, y: 20, label: '22' }
        ],
        properties: {
            coilVoltage: { value: 230, unit: 'V AC', min: 12, max: 690 },
            contactRating: { value: 6, unit: 'A', min: 1, max: 16 },
            contacts: { value: '4PDT', unit: '', options: ['SPDT', 'DPDT', '3PDT', '4PDT'] }
        },
        specifications: {
            manufacturer: 'Schneider Electric',
            series: 'Zelio RXM',
            contactConfig: '4 C/O (4NO + 4NC)',
            mechanicalLife: '10M operations',
            electricalLife: '100K operations'
        },
        draw: drawControlRelay
    }
};

// ============================================
// CIRCUIT BREAKERS & PROTECTION
// ============================================
const ELECTRICAL_PROTECTION = {
    mcb_3phase: {
        name: '3-Phase MCB (Miniature Circuit Breaker)',
        symbol: 'Q',
        category: 'breakers',
        domain: 'electrical',
        manufacturer: 'ABB',
        model: 'S203-C16',
        width: 60,
        height: 80,
        ports: [
            { id: 'L1_in', x: -30, y: -40, label: 'L1' },
            { id: 'L2_in', x: 0, y: -40, label: 'L2' },
            { id: 'L3_in', x: 30, y: -40, label: 'L3' },
            { id: 'L1_out', x: -30, y: 40, label: 'L1' },
            { id: 'L2_out', x: 0, y: 40, label: 'L2' },
            { id: 'L3_out', x: 30, y: 40, label: 'L3' }
        ],
        properties: {
            ratedCurrent: { value: 16, unit: 'A', min: 0.5, max: 125 },
            poles: { value: 3, unit: '', min: 1, max: 4 },
            tripCurve: { value: 'C', unit: '', options: ['B', 'C', 'D', 'K', 'Z'] },
            breakingCapacity: { value: 6, unit: 'kA', min: 3, max: 25 },
            voltage: { value: 400, unit: 'V', min: 230, max: 690 }
        },
        specifications: {
            manufacturer: 'ABB',
            series: 'S200',
            standard: 'IEC 60898-1',
            tripCurveDetails: {
                'B': '3-5 In (electronic loads)',
                'C': '5-10 In (standard motors)',
                'D': '10-20 In (high inrush motors)'
            },
            mounting: 'DIN rail 35mm',
            width: '3 modules (54mm)'
        },
        draw: drawMCB3Phase
    },

    mccb_3phase: {
        name: 'MCCB (Molded Case Circuit Breaker)',
        symbol: 'Q',
        category: 'breakers',
        domain: 'electrical',
        manufacturer: 'Siemens',
        model: '3VL1710-1DC36-0AA0',
        width: 80,
        height: 100,
        ports: [
            { id: 'L1_in', x: -30, y: -50, label: 'L1' },
            { id: 'L2_in', x: 0, y: -50, label: 'L2' },
            { id: 'L3_in', x: 30, y: -50, label: 'L3' },
            { id: 'L1_out', x: -30, y: 50, label: 'L1' },
            { id: 'L2_out', x: 0, y: 50, label: 'L2' },
            { id: 'L3_out', x: 30, y: 50, label: 'L3' }
        ],
        properties: {
            ratedCurrent: { value: 100, unit: 'A', min: 16, max: 1600 },
            breakingCapacity: { value: 50, unit: 'kA', min: 25, max: 150 },
            poles: { value: 3, unit: '', min: 3, max: 4 },
            adjustableThermal: { value: true, unit: '', options: [true, false] },
            adjustableMagnetic: { value: true, unit: '', options: [true, false] }
        },
        specifications: {
            manufacturer: 'Siemens',
            series: '3VL',
            standard: 'IEC 60947-2',
            features: 'Electronic trip, adjustable I, adjustable t',
            application: 'Distribution, motor protection'
        },
        draw: drawMCCB
    },

    rcd_3phase: {
        name: 'RCD (Residual Current Device)',
        symbol: 'F',
        category: 'protection',
        domain: 'electrical',
        manufacturer: 'ABB',
        model: 'F204 AC-40/0.03',
        width: 70,
        height: 90,
        ports: [
            { id: 'L1_in', x: -30, y: -45, label: 'L1' },
            { id: 'L2_in', x: -10, y: -45, label: 'L2' },
            { id: 'L3_in', x: 10, y: -45, label: 'L3' },
            { id: 'N_in', x: 30, y: -45, label: 'N' },
            { id: 'L1_out', x: -30, y: 45, label: 'L1' },
            { id: 'L2_out', x: -10, y: 45, label: 'L2' },
            { id: 'L3_out', x: 10, y: 45, label: 'L3' },
            { id: 'N_out', x: 30, y: 45, label: 'N' }
        ],
        properties: {
            ratedCurrent: { value: 40, unit: 'A', min: 16, max: 125 },
            sensitivity: { value: 30, unit: 'mA', min: 10, max: 500 },
            poles: { value: 4, unit: '', min: 2, max: 4 },
            type: { value: 'AC', unit: '', options: ['AC', 'A', 'B'] }
        },
        specifications: {
            manufacturer: 'ABB',
            series: 'F200',
            standard: 'IEC 61008-1',
            typeDetails: {
                'AC': 'Sinusoidal AC fault current',
                'A': 'AC + pulsating DC',
                'B': 'AC + DC (inverters)'
            },
            testButton: 'Included'
        },
        draw: drawRCD
    },

    thermal_overload: {
        name: 'Thermal Overload Relay',
        symbol: 'F',
        category: 'protection',
        domain: 'electrical',
        manufacturer: 'Siemens',
        model: '3RU2126-4AB0',
        width: 60,
        height: 70,
        ports: [
            { id: '1', x: -30, y: -35, label: '1' },
            { id: '3', x: 0, y: -35, label: '3' },
            { id: '5', x: 30, y: -35, label: '5' },
            { id: '2', x: -30, y: 35, label: '2' },
            { id: '4', x: 0, y: 35, label: '4' },
            { id: '6', x: 30, y: 35, label: '6' },
            { id: '95', x: -45, y: 0, label: '95' },
            { id: '96', x: 45, y: 0, label: '96' }
        ],
        properties: {
            adjustmentRange: { value: '20-25', unit: 'A', min: 0.1, max: 820 },
            tripClass: { value: '10A', unit: '', options: ['10A', '10', '20', '30'] },
            resetType: { value: 'Manual', unit: '', options: ['Manual', 'Auto'] }
        },
        specifications: {
            manufacturer: 'Siemens',
            series: '3RU2',
            standard: 'IEC 60947-4-1',
            tripClassDetails: {
                '10A': '2-10s at 7.2x Ie (starting)',
                '10': '4-10s at 7.2x Ie',
                '20': '6-20s at 7.2x Ie',
                '30': '9-30s at 7.2x Ie'
            },
            mounting: 'Direct on contactor'
        },
        draw: drawThermalOverload
    }
};

// ============================================
// SWITCHES & PUSHBUTTONS
// ============================================
const ELECTRICAL_CONTROLS = {
    pushbutton_no: {
        name: 'Pushbutton (NO)',
        symbol: 'S',
        category: 'switches',
        domain: 'electrical',
        manufacturer: 'ABB',
        model: 'CP1-10G',
        width: 40,
        height: 50,
        ports: [
            { id: '1', x: 0, y: -25, label: '1' },
            { id: '2', x: 0, y: 25, label: '2' }
        ],
        properties: {
            contactType: { value: '1NO', unit: '', options: ['1NO', '1NC', '1NO+1NC'] },
            contactRating: { value: 10, unit: 'A', min: 1, max: 16 },
            color: { value: 'Green', unit: '', options: ['Green', 'Red', 'Yellow', 'Blue', 'Black'] }
        },
        specifications: {
            manufacturer: 'ABB',
            series: 'CP1',
            mounting: '22mm hole',
            standard: 'IEC 60947-5-1',
            illumination: 'Optional LED'
        },
        draw: drawPushbuttonNO
    },

    selector_switch: {
        name: 'Selector Switch',
        symbol: 'S',
        category: 'switches',
        domain: 'electrical',
        manufacturer: 'Schneider',
        model: 'XB4BD33',
        width: 45,
        height: 55,
        ports: [
            { id: '1', x: -20, y: -27, label: '1' },
            { id: '2', x: 0, y: -27, label: '2' },
            { id: '3', x: 20, y: -27, label: '3' },
            { id: '4', x: 0, y: 27, label: '4' }
        ],
        properties: {
            positions: { value: 3, unit: '', min: 2, max: 3 },
            type: { value: 'Maintained', unit: '', options: ['Maintained', 'Spring Return'] },
            contactRating: { value: 10, unit: 'A', min: 1, max: 16 }
        },
        specifications: {
            manufacturer: 'Schneider Electric',
            series: 'Harmony XB4',
            mounting: '22mm',
            standard: 'IEC 60947-5-1'
        },
        draw: drawSelectorSwitch
    },

    emergency_stop: {
        name: 'Emergency Stop Button',
        symbol: 'S',
        category: 'switches',
        domain: 'electrical',
        manufacturer: 'ABB',
        model: 'CEP7-01R',
        width: 50,
        height: 60,
        ports: [
            { id: '11', x: -20, y: -30, label: '11' },
            { id: '12', x: 20, y: -30, label: '12' },
            { id: '21', x: -20, y: 30, label: '21' },
            { id: '22', x: 20, y: 30, label: '22' }
        ],
        properties: {
            contactType: { value: '2NC', unit: '', options: ['1NC', '2NC', '1NO+2NC'] },
            mushroom: { value: '40mm', unit: '', options: ['30mm', '40mm'] },
            resetType: { value: 'Twist', unit: '', options: ['Twist', 'Pull', 'Key'] }
        },
        specifications: {
            manufacturer: 'ABB',
            series: 'CEP',
            standard: 'ISO 13850, IEC 60947-5-5',
            safety: 'Category 0 stop',
            color: 'Red mushroom, yellow base'
        },
        draw: drawEmergencyStop
    }
};

// ============================================
// FUSES
// ============================================
const ELECTRICAL_FUSES = {
    fuse_3phase: {
        name: '3-Phase Fuse Base',
        symbol: 'F',
        category: 'protection',
        domain: 'electrical',
        manufacturer: 'Siemens',
        model: '3NA3',
        width: 60,
        height: 70,
        ports: [
            { id: 'L1_in', x: -30, y: -35, label: 'L1' },
            { id: 'L2_in', x: 0, y: -35, label: 'L2' },
            { id: 'L3_in', x: 30, y: -35, label: 'L3' },
            { id: 'L1_out', x: -30, y: 35, label: 'L1' },
            { id: 'L2_out', x: 0, y: 35, label: 'L2' },
            { id: 'L3_out', x: 30, y: 35, label: 'L3' }
        ],
        properties: {
            fuseSize: { value: 16, unit: 'A', min: 2, max: 160 },
            type: { value: 'gG', unit: '', options: ['gG', 'aM', 'gR'] },
            voltage: { value: 500, unit: 'V', min: 230, max: 690 }
        },
        specifications: {
            manufacturer: 'Siemens',
            series: '3NA3',
            standard: 'IEC 60269',
            fuseTypeDetails: {
                'gG': 'General purpose (cables, distribution)',
                'aM': 'Motor protection (with contactor)',
                'gR': 'Semiconductor protection'
            }
        },
        draw: drawFuse3Phase
    }
};

// ============================================
// VARIABLE FREQUENCY DRIVES (VFD)
// ============================================
const ELECTRICAL_DRIVES = {
    vfd_3phase: {
        name: 'Variable Frequency Drive (VFD)',
        symbol: 'VFD',
        category: 'drives',
        domain: 'electrical',
        manufacturer: 'ABB',
        model: 'ACS580-01-023A-4',
        width: 100,
        height: 120,
        ports: [
            { id: 'L1', x: -45, y: -55, label: 'L1' },
            { id: 'L2', x: -30, y: -55, label: 'L2' },
            { id: 'L3', x: -15, y: -55, label: 'L3' },
            { id: 'U', x: -45, y: 55, label: 'U' },
            { id: 'V', x: -30, y: 55, label: 'V' },
            { id: 'W', x: -15, y: 55, label: 'W' },
            { id: 'DI1', x: 40, y: -40, label: 'DI1' },
            { id: 'DI2', x: 40, y: -20, label: 'DI2' },
            { id: 'AO1', x: 40, y: 20, label: 'AO1' },
            { id: 'RS485', x: 40, y: 40, label: '485' }
        ],
        properties: {
            power: { value: 11, unit: 'kW', min: 0.75, max: 315 },
            inputVoltage: { value: 400, unit: 'V', min: 380, max: 480 },
            inputCurrent: { value: 23, unit: 'A', min: 0, max: 600 },
            outputFrequency: { value: 50, unit: 'Hz', min: 0, max: 500 },
            overloadCapacity: { value: 150, unit: '%', min: 100, max: 200 },
            controlMode: { value: 'V/f', unit: '', options: ['V/f', 'SVC', 'DTC'] },
            brakeChopper: { value: true, unit: '', options: [true, false] }
        },
        specifications: {
            manufacturer: 'ABB',
            series: 'ACS580',
            type: 'Wall-mounted drive',
            protection: 'IP21 / IP55 kit available',
            standard: 'IEC 61800-3',
            features: 'Built-in EMC filter, Safe torque off, PID, Modbus RTU',
            application: 'HVAC, pumps, fans, conveyors'
        },
        draw: drawVFD
    },

    soft_starter: {
        name: 'Soft Starter',
        symbol: 'SS',
        category: 'drives',
        domain: 'electrical',
        manufacturer: 'Siemens',
        model: '3RW4036-1BB14',
        width: 80,
        height: 100,
        ports: [
            { id: 'L1', x: -35, y: -50, label: 'L1' },
            { id: 'L2', x: -15, y: -50, label: 'L2' },
            { id: 'L3', x: 5, y: -50, label: 'L3' },
            { id: 'T1', x: -35, y: 50, label: 'T1' },
            { id: 'T2', x: -15, y: 50, label: 'T2' },
            { id: 'T3', x: 5, y: 50, label: 'T3' },
            { id: 'A1', x: 35, y: -20, label: 'A1' },
            { id: 'A2', x: 35, y: 20, label: 'A2' }
        ],
        properties: {
            ratedCurrent: { value: 36, unit: 'A', min: 3, max: 1200 },
            power_400V: { value: 18.5, unit: 'kW', min: 1.5, max: 710 },
            startTime: { value: 10, unit: 's', min: 1, max: 60 },
            stopTime: { value: 10, unit: 's', min: 0, max: 60 },
            initialTorque: { value: 30, unit: '%', min: 0, max: 100 }
        },
        specifications: {
            manufacturer: 'Siemens',
            series: 'SIRIUS 3RW40',
            standard: 'IEC 60947-4-2',
            features: 'Torque control, current limiting, soft stop',
            protection: 'Overload, phase loss, overheating',
            mounting: 'DIN rail or screw'
        },
        draw: drawSoftStarter
    }
};

// ============================================
// TRANSFORMERS
// ============================================
const ELECTRICAL_TRANSFORMERS = {
    transformer_1phase: {
        name: 'Control Transformer (1-Phase)',
        symbol: 'T',
        category: 'transformers',
        domain: 'electrical',
        manufacturer: 'ABB',
        model: 'ABT7',
        width: 70,
        height: 80,
        ports: [
            { id: 'L_in', x: -35, y: -30, label: 'L' },
            { id: 'N_in', x: -35, y: -10, label: 'N' },
            { id: 'l_out', x: 35, y: -30, label: 'l' },
            { id: 'n_out', x: 35, y: -10, label: 'n' }
        ],
        properties: {
            primaryVoltage: { value: 230, unit: 'V', min: 110, max: 690 },
            secondaryVoltage: { value: 24, unit: 'V', min: 12, max: 230 },
            power: { value: 100, unit: 'VA', min: 25, max: 10000 },
            frequency: { value: 50, unit: 'Hz', min: 50, max: 60 }
        },
        specifications: {
            manufacturer: 'ABB',
            series: 'ABT7',
            standard: 'IEC 61558-2-6',
            insulation: 'Class II',
            protection: 'Short-circuit proof',
            application: 'Control circuits, PLC power supply'
        },
        draw: drawTransformer1Phase
    },

    transformer_3phase: {
        name: 'Power Transformer (3-Phase)',
        symbol: 'T',
        category: 'transformers',
        domain: 'electrical',
        manufacturer: 'Schneider',
        model: 'TM-H 630',
        width: 90,
        height: 100,
        ports: [
            { id: 'HV_L1', x: -45, y: -40, label: 'L1' },
            { id: 'HV_L2', x: -45, y: -20, label: 'L2' },
            { id: 'HV_L3', x: -45, y: 0, label: 'L3' },
            { id: 'HV_N', x: -45, y: 20, label: 'N' },
            { id: 'LV_l1', x: 45, y: -40, label: 'l1' },
            { id: 'LV_l2', x: 45, y: -20, label: 'l2' },
            { id: 'LV_l3', x: 45, y: 0, label: 'l3' },
            { id: 'LV_n', x: 45, y: 20, label: 'n' }
        ],
        properties: {
            power: { value: 630, unit: 'kVA', min: 50, max: 2500 },
            primaryVoltage: { value: 400, unit: 'V', min: 230, max: 690 },
            secondaryVoltage: { value: 230, unit: 'V', min: 110, max: 690 },
            connection: { value: 'Dyn11', unit: '', options: ['Dyn11', 'Yyn0', 'Yzn11'] },
            impedance: { value: 6, unit: '%', min: 4, max: 10 }
        },
        specifications: {
            manufacturer: 'Schneider Electric',
            series: 'Trihal',
            standard: 'IEC 60076',
            cooling: 'AN (Air Natural)',
            insulation: 'Class H (180°C)',
            application: 'Distribution, industrial plants'
        },
        draw: drawTransformer3Phase
    }
};

// ============================================
// PLCs & AUTOMATION
// ============================================
const ELECTRICAL_AUTOMATION = {
    plc_cpu: {
        name: 'PLC CPU',
        symbol: 'PLC',
        category: 'automation',
        domain: 'electrical',
        manufacturer: 'Siemens',
        model: 'S7-1200 CPU 1214C',
        width: 90,
        height: 70,
        ports: [
            { id: 'L+', x: -45, y: -25, label: 'L+' },
            { id: 'M', x: -45, y: 25, label: 'M' },
            { id: 'DI0', x: 45, y: -25, label: 'DI0' },
            { id: 'DI1', x: 45, y: -10, label: 'DI1' },
            { id: 'DQ0', x: 45, y: 10, label: 'DQ0' },
            { id: 'DQ1', x: 45, y: 25, label: 'DQ1' }
        ],
        properties: {
            powerSupply: { value: 24, unit: 'V DC', min: 20.4, max: 28.8 },
            digitalInputs: { value: 14, unit: '', min: 6, max: 14 },
            digitalOutputs: { value: 10, unit: '', min: 4, max: 10 },
            analogInputs: { value: 2, unit: '', min: 0, max: 8 },
            memory: { value: 75, unit: 'KB', min: 50, max: 150 },
            scanTime: { value: 0.1, unit: 'ms', min: 0.05, max: 1 }
        },
        specifications: {
            manufacturer: 'Siemens',
            series: 'SIMATIC S7-1200',
            standard: 'IEC 61131-3',
            programming: 'LAD, FBD, STL, SCL',
            communication: 'PROFINET, Ethernet, RS485',
            protection: 'IP20',
            application: 'Machine control, building automation'
        },
        draw: drawPLC
    }
};

// ============================================
// DRAWING FUNCTIONS
// ============================================

function drawMotor3Phase(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Motor circle
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 35, 0, Math.PI * 2);
    ctx.stroke();
    
    // Motor symbol "M"
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', 0, 0);
    
    // 3~ symbol
    ctx.font = '12px Arial';
    ctx.fillText('3~', 0, 18);
    
    ctx.restore();
}

function drawMotorDC(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Motor circle
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.stroke();
    
    // DC symbol
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', 0, -5);
    
    // DC line
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, 10);
    ctx.lineTo(15, 10);
    ctx.stroke();
    
    ctx.restore();
}

function drawContactor3Pole(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Contactor rectangle
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-30, -40, 60, 80);
    
    // 3 poles (switches)
    for (let i = 0; i < 3; i++) {
        const px = -25 + i * 25;
        ctx.beginPath();
        ctx.moveTo(px, -20);
        ctx.lineTo(px, 20);
        ctx.stroke();
        
        // Contact
        ctx.beginPath();
        ctx.arc(px, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Coil symbol at bottom
    ctx.strokeStyle = '#d00';
    ctx.beginPath();
    ctx.arc(0, 30, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
}

function drawControlRelay(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-20, -25, 40, 50);
    
    // Coil
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('K', 0, 5);
    
    ctx.restore();
}

function drawMCB3Phase(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // MCB body
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-25, -35, 50, 70);
    
    // Trip curve indicator
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('C', 0, -10);
    
    // Current rating
    ctx.font = '12px Arial';
    ctx.fillText(component.properties.ratedCurrent.value + 'A', 0, 10);
    
    ctx.restore();
}

function drawMCCB(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // MCCB body (larger)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeRect(-35, -45, 70, 90);
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MCCB', 0, 0);
    
    ctx.restore();
}

function drawRCD(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-30, -40, 60, 80);
    
    // RCD symbol
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RCD', 0, -5);
    ctx.font = '11px Arial';
    ctx.fillText(component.properties.sensitivity.value + 'mA', 0, 10);
    
    ctx.restore();
}

function drawThermalOverload(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-25, -30, 50, 60);
    
    // Thermal symbol
    ctx.fillStyle = '#d00';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('F', 0, 5);
    
    ctx.restore();
}

function drawPushbuttonNO(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Button circle
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -10, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // NO contact
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 10);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.arc(0, 10, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawSelectorSwitch(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Selector base
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Pointer
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(8, -8);
    ctx.stroke();
    
    ctx.restore();
}

function drawEmergencyStop(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Red mushroom
    ctx.fillStyle = '#f00';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -15, 18, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Yellow base
    ctx.fillStyle = '#ff0';
    ctx.fillRect(-15, -5, 30, 20);
    ctx.strokeRect(-15, -5, 30, 20);
    
    ctx.restore();
}

function drawFuse3Phase(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Fuse body
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-25, -30, 50, 60);
    
    // Fuse rating
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(component.properties.fuseSize.value + 'A', 0, 5);
    
    ctx.restore();
}

function drawVFD(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // VFD body
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeRect(-45, -55, 90, 110);
    
    // Display screen
    ctx.fillStyle = '#0a0';
    ctx.fillRect(-35, -40, 50, 25);
    
    // VFD text
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VFD', 0, 0);
    
    // Power rating
    ctx.font = '11px Arial';
    ctx.fillText(component.properties.power.value + 'kW', 0, 20);
    
    // Input/Output indicators
    ctx.font = '9px Arial';
    ctx.fillText('IN', -30, -50);
    ctx.fillText('OUT', -30, 50);
    
    ctx.restore();
}

function drawSoftStarter(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Soft starter body
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-35, -45, 70, 90);
    
    // Thyristor symbol (simplified)
    ctx.strokeStyle = '#d00';
    ctx.beginPath();
    ctx.moveTo(-15, -15);
    ctx.lineTo(15, -15);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.stroke();
    
    // Text
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SS', 0, 20);
    ctx.font = '10px Arial';
    ctx.fillText(component.properties.ratedCurrent.value + 'A', 0, 35);
    
    ctx.restore();
}

function drawTransformer1Phase(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Primary coil
    ctx.beginPath();
    ctx.arc(-15, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Secondary coil
    ctx.beginPath();
    ctx.arc(15, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Core (two vertical lines)
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 20);
    ctx.moveTo(3, -20);
    ctx.lineTo(3, 20);
    ctx.stroke();
    
    // Voltage labels
    ctx.fillStyle = '#000';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(component.properties.primaryVoltage.value + 'V', -15, -18);
    ctx.fillText(component.properties.secondaryVoltage.value + 'V', 15, -18);
    
    ctx.restore();
}

function drawTransformer3Phase(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-40, -45, 80, 90);
    
    // Three coil symbols
    for (let i = 0; i < 3; i++) {
        const yPos = -20 + i * 20;
        // Primary
        ctx.beginPath();
        ctx.arc(-20, yPos, 6, 0, Math.PI * 2);
        ctx.stroke();
        // Secondary
        ctx.beginPath();
        ctx.arc(20, yPos, 6, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Core
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(0, 30);
    ctx.stroke();
    
    // Rating
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(component.properties.power.value + 'kVA', 0, 42);
    
    ctx.restore();
}

function drawPLC(ctx, x, y, rotation, component) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // PLC body
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-40, -30, 80, 60);
    
    // Display area
    ctx.fillStyle = '#004';
    ctx.fillRect(-30, -20, 35, 15);
    
    // LED indicators
    ctx.fillStyle = '#0f0';
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(-25 + i * 8, 10, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // PLC text
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PLC', 15, 0);
    
    // Model
    ctx.font = '8px Arial';
    ctx.fillText('S7-1200', 15, 15);
    
    ctx.restore();
}

// ============================================
// TIMER RELAYS & DELAY MODULES
// ============================================
const ELECTRICAL_TIMERS = {
    timer_relay_on_delay: {
        name: 'Timer Relay (On-Delay)',
        symbol: 'KT',
        category: 'timers',
        domain: 'electrical',
        manufacturer: 'Schneider Electric',
        model: 'RE7TA11BU',
        width: 60,
        height: 70,
        ports: [
            { id: 'A1', x: -30, y: -25, label: 'A1' },
            { id: 'A2', x: 30, y: -25, label: 'A2' },
            { id: '15', x: -30, y: 20, label: '15' },
            { id: '16', x: -30, y: 30, label: '16' },
            { id: '25', x: 30, y: 20, label: '25' },
            { id: '26', x: 30, y: 30, label: '26' }
        ],
        properties: {
            timeRange: { value: 10, unit: 's', min: 0.1, max: 300 },
            controlVoltage: { value: 24, unit: 'V DC', min: 24, max: 230 },
            contactRating: { value: 5, unit: 'A', min: 0, max: 10 }
        },
        specifications: {
            manufacturer: 'Schneider Electric',
            series: 'Zelio Time',
            model: 'RE7TA11BU',
            mounting: 'DIN rail',
            accuracy: '±5%',
            standard: 'IEC 60255'
        },
        draw: function(ctx, x, y) {
            ctx.save();
            ctx.translate(x, y);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            
            // Coil
            ctx.strokeRect(-28, -28, 56, 22);
            ctx.font = '12px Arial';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.fillText('KT', 0, -13);
            
            // Timer symbol
            ctx.beginPath();
            ctx.arc(0, 5, 10, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(0, -2);
            ctx.lineTo(5, 2);
            ctx.stroke();
            
            // Contacts
            ctx.strokeRect(-32, 18, 8, 14);
            ctx.strokeRect(24, 18, 8, 14);
            
            ctx.restore();
        }
    }
};

// ============================================
// PILOT LIGHTS & INDICATORS
// ============================================
const ELECTRICAL_INDICATORS = {
    pilot_light_red: {
        name: 'Pilot Light (Red)',
        symbol: 'H',
        category: 'indicators',
        domain: 'electrical',
        manufacturer: 'Schneider Electric',
        model: 'XB4BVB4',
        width: 40,
        height: 40,
        ports: [
            { id: '1', x: 0, y: -20, label: '1' },
            { id: '2', x: 0, y: 20, label: '2' }
        ],
        properties: {
            voltage: { value: 230, unit: 'V AC', min: 24, max: 230 },
            current: { value: 0.02, unit: 'A', min: 0, max: 0.5 },
            color: { value: 'Red', unit: '', options: ['Red', 'Green', 'Yellow', 'Blue', 'White'] }
        },
        specifications: {
            manufacturer: 'Schneider Electric',
            series: 'Harmony XB4',
            ledType: 'LED',
            protection: 'IP65',
            mounting: 'Panel 22mm'
        },
        draw: function(ctx, x, y) {
            ctx.save();
            ctx.translate(x, y);
            
            // Light body
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Shine effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(-3, -3, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.restore();
        }
    },
    
    pilot_light_green: {
        name: 'Pilot Light (Green)',
        symbol: 'H',
        category: 'indicators',
        domain: 'electrical',
        manufacturer: 'Schneider Electric',
        model: 'XB4BVB3',
        width: 40,
        height: 40,
        ports: [
            { id: '1', x: 0, y: -20, label: '1' },
            { id: '2', x: 0, y: 20, label: '2' }
        ],
        properties: {
            voltage: { value: 230, unit: 'V AC', min: 24, max: 230 },
            current: { value: 0.02, unit: 'A', min: 0, max: 0.5 },
            color: { value: 'Green', unit: '', options: ['Red', 'Green', 'Yellow', 'Blue', 'White'] }
        },
        specifications: {
            manufacturer: 'Schneider Electric',
            series: 'Harmony XB4',
            ledType: 'LED',
            protection: 'IP65',
            mounting: 'Panel 22mm'
        },
        draw: function(ctx, x, y) {
            ctx.save();
            ctx.translate(x, y);
            
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(-3, -3, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.restore();
        }
    }
};

// Export all components
const ELECTRICAL_CONTROL_LIBRARY = {
    ...ELECTRICAL_MOTORS,
    ...ELECTRICAL_CONTACTORS,
    ...ELECTRICAL_PROTECTION,
    ...ELECTRICAL_CONTROLS,
    ...ELECTRICAL_FUSES,
    ...ELECTRICAL_DRIVES,
    ...ELECTRICAL_TRANSFORMERS,
    ...ELECTRICAL_AUTOMATION,
    ...ELECTRICAL_TIMERS,
    ...ELECTRICAL_INDICATORS
};

// Make available globally
if (typeof window !== 'undefined') {
    window.ELECTRICAL_CONTROL_LIBRARY = ELECTRICAL_CONTROL_LIBRARY;
}
