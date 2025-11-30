/**
 * Industrial Power Sources and Switchgear Components
 * Professional electrical power distribution equipment
 * Following IEC 60909, IEC 61439, IEC 60947 standards
 */

const POWER_SOURCES = {
    // 3-Phase Utility Grid Connection
    utility_grid_3phase: {
        name: '3-Phase Utility Grid',
        symbol: 'GRID',
        category: 'sources',
        width: 80,
        height: 100,
        ports: [
            { id: 'L1', x: -30, y: 40, label: 'L1' },
            { id: 'L2', x: 0, y: 40, label: 'L2' },
            { id: 'L3', x: 30, y: 40, label: 'L3' },
            { id: 'N', x: -15, y: 50, label: 'N' },
            { id: 'PE', x: 15, y: 50, label: 'PE' }
        ],
        properties: {
            voltage: { value: 400, unit: 'V', min: 380, max: 690, label: 'Line Voltage' },
            frequency: { value: 50, unit: 'Hz', min: 50, max: 60, label: 'Frequency' },
            shortCircuitPower: { value: 500, unit: 'MVA', min: 100, max: 5000, label: 'Fault Level' },
            transformerRating: { value: 1000, unit: 'kVA', min: 100, max: 10000, label: 'TX Rating' },
            incomingVoltage: { value: 11, unit: 'kV', min: 0.4, max: 33, label: 'MV Side' }
        },
        description: 'Utility grid connection with transformer',
        draw: drawUtilityGrid3Phase
    },
    
    // Single-Phase AC Source (Residential/Light Commercial)
    utility_grid_1phase: {
        name: 'Single-Phase Utility',
        symbol: 'GRID-1φ',
        category: 'sources',
        width: 60,
        height: 80,
        ports: [
            { id: 'L', x: -15, y: 35, label: 'L' },
            { id: 'N', x: 15, y: 35, label: 'N' },
            { id: 'PE', x: 0, y: 45, label: 'PE' }
        ],
        properties: {
            voltage: { value: 230, unit: 'V', min: 110, max: 240, label: 'Voltage' },
            frequency: { value: 50, unit: 'Hz', min: 50, max: 60, label: 'Frequency' },
            maxCurrent: { value: 100, unit: 'A', min: 16, max: 400, label: 'Service Rating' }
        },
        description: 'Single-phase grid connection',
        draw: drawUtilityGrid1Phase
    },
    
    // Diesel Generator Set
    generator_diesel: {
        name: 'Diesel Generator',
        symbol: 'GEN-D',
        category: 'sources',
        width: 100,
        height: 120,
        ports: [
            { id: 'L1', x: -35, y: 55, label: 'L1' },
            { id: 'L2', x: 0, y: 55, label: 'L2' },
            { id: 'L3', x: 35, y: 55, label: 'L3' },
            { id: 'N', x: -20, y: 65, label: 'N' },
            { id: 'PE', x: 20, y: 65, label: 'PE' }
        ],
        properties: {
            rating: { value: 500, unit: 'kVA', min: 10, max: 5000, label: 'Rated Power' },
            voltage: { value: 400, unit: 'V', min: 380, max: 690, label: 'Output Voltage' },
            frequency: { value: 50, unit: 'Hz', min: 50, max: 60, label: 'Frequency' },
            powerFactor: { value: 0.8, unit: '', min: 0.7, max: 1.0, label: 'Power Factor' },
            fuelCapacity: { value: 500, unit: 'L', min: 50, max: 5000, label: 'Fuel Tank' },
            runHours: { value: 12, unit: 'hrs', min: 1, max: 72, label: 'Runtime @ 100%' }
        },
        description: 'Diesel generator with auto-start',
        draw: drawDieselGenerator
    },
    
    // Gas Generator
    generator_gas: {
        name: 'Gas Generator',
        symbol: 'GEN-G',
        category: 'sources',
        width: 100,
        height: 120,
        ports: [
            { id: 'L1', x: -35, y: 55, label: 'L1' },
            { id: 'L2', x: 0, y: 55, label: 'L2' },
            { id: 'L3', x: 35, y: 55, label: 'L3' },
            { id: 'N', x: -20, y: 65, label: 'N' },
            { id: 'PE', x: 20, y: 65, label: 'PE' }
        ],
        properties: {
            rating: { value: 300, unit: 'kVA', min: 10, max: 3000, label: 'Rated Power' },
            voltage: { value: 400, unit: 'V', min: 380, max: 690, label: 'Output Voltage' },
            frequency: { value: 50, unit: 'Hz', min: 50, max: 60, label: 'Frequency' },
            powerFactor: { value: 0.8, unit: '', min: 0.7, max: 1.0, label: 'Power Factor' },
            fuelType: { value: 'Natural Gas', unit: '', label: 'Fuel Type' }
        },
        description: 'Natural gas generator',
        draw: drawGasGenerator
    },
    
    // UPS System
    ups_3phase: {
        name: 'UPS 3-Phase',
        symbol: 'UPS',
        category: 'sources',
        width: 90,
        height: 110,
        ports: [
            // Input
            { id: 'L1_in', x: -45, y: -30, label: 'L1 IN' },
            { id: 'L2_in', x: -45, y: -10, label: 'L2 IN' },
            { id: 'L3_in', x: -45, y: 10, label: 'L3 IN' },
            { id: 'N_in', x: -45, y: 30, label: 'N IN' },
            // Output
            { id: 'L1_out', x: 45, y: -30, label: 'L1 OUT' },
            { id: 'L2_out', x: 45, y: -10, label: 'L2 OUT' },
            { id: 'L3_out', x: 45, y: 10, label: 'L3 OUT' },
            { id: 'N_out', x: 45, y: 30, label: 'N OUT' },
            { id: 'PE', x: 0, y: 55, label: 'PE' }
        ],
        properties: {
            rating: { value: 200, unit: 'kVA', min: 10, max: 2000, label: 'UPS Rating' },
            voltage: { value: 400, unit: 'V', min: 380, max: 480, label: 'Voltage' },
            backupTime: { value: 15, unit: 'min', min: 5, max: 240, label: 'Backup Time' },
            batteryVoltage: { value: 384, unit: 'Vdc', min: 192, max: 768, label: 'Battery Bus' },
            efficiency: { value: 96, unit: '%', min: 90, max: 99, label: 'Efficiency' }
        },
        description: 'Uninterruptible Power Supply',
        draw: drawUPS3Phase
    }
};

const SWITCHGEAR_COMPONENTS = {
    // Main Low Voltage Switchboard
    switchboard_main: {
        name: 'Main LV Switchboard',
        symbol: 'MSB',
        category: 'switchgear',
        width: 120,
        height: 160,
        ports: [
            // Incoming
            { id: 'L1_in', x: -60, y: -70, label: 'L1 IN' },
            { id: 'L2_in', x: -60, y: -50, label: 'L2 IN' },
            { id: 'L3_in', x: -60, y: -30, label: 'L3 IN' },
            { id: 'N_in', x: -60, y: -10, label: 'N IN' },
            { id: 'PE_in', x: -60, y: 10, label: 'PE IN' },
            // Outgoing Feeders (4 feeders)
            { id: 'F1_L1', x: 60, y: -60, label: 'F1' },
            { id: 'F2_L1', x: 60, y: -30, label: 'F2' },
            { id: 'F3_L1', x: 60, y: 0, label: 'F3' },
            { id: 'F4_L1', x: 60, y: 30, label: 'F4' }
        ],
        properties: {
            busbarRating: { value: 2500, unit: 'A', min: 630, max: 6300, label: 'Busbar Rating' },
            voltage: { value: 400, unit: 'V', min: 230, max: 690, label: 'System Voltage' },
            shortCircuitRating: { value: 65, unit: 'kA', min: 25, max: 150, label: 'Fault Rating (Icw)' },
            feeders: { value: 4, unit: '', min: 2, max: 24, label: 'Number of Feeders' },
            ipRating: { value: 'IP42', unit: '', label: 'Enclosure IP' }
        },
        description: 'Main distribution board with busbars',
        draw: drawSwitchboardMain
    },
    
    // Air Circuit Breaker (ACB)
    breaker_acb: {
        name: 'Air Circuit Breaker',
        symbol: 'ACB',
        category: 'protection',
        width: 80,
        height: 100,
        ports: [
            { id: 'L1_in', x: -30, y: -45, label: 'L1' },
            { id: 'L2_in', x: 0, y: -45, label: 'L2' },
            { id: 'L3_in', x: 30, y: -45, label: 'L3' },
            { id: 'N_in', x: -15, y: -35, label: 'N' },
            { id: 'L1_out', x: -30, y: 45, label: 'L1' },
            { id: 'L2_out', x: 0, y: 45, label: 'L2' },
            { id: 'L3_out', x: 30, y: 45, label: 'L3' },
            { id: 'N_out', x: -15, y: 50, label: 'N' }
        ],
        properties: {
            ratedCurrent: { value: 1600, unit: 'A', min: 630, max: 6300, label: 'In' },
            breakingCapacity: { value: 65, unit: 'kA', min: 25, max: 150, label: 'Icu (IEC)' },
            voltage: { value: 690, unit: 'V', min: 400, max: 1000, label: 'Ue' },
            tripUnit: { value: 'Electronic', unit: '', label: 'Protection Type' },
            poles: { value: 4, unit: '', min: 3, max: 4, label: 'Poles' }
        },
        description: 'Withdrawable ACB with electronic trip',
        draw: drawACB
    },
    
    // Vacuum Circuit Breaker (VCB) - Medium Voltage
    breaker_vcb: {
        name: 'Vacuum Circuit Breaker',
        symbol: 'VCB',
        category: 'protection',
        width: 90,
        height: 110,
        ports: [
            { id: 'L1_in', x: -35, y: -50, label: 'L1' },
            { id: 'L2_in', x: 0, y: -50, label: 'L2' },
            { id: 'L3_in', x: 35, y: -50, label: 'L3' },
            { id: 'L1_out', x: -35, y: 50, label: 'L1' },
            { id: 'L2_out', x: 0, y: 50, label: 'L2' },
            { id: 'L3_out', x: 35, y: 50, label: 'L3' }
        ],
        properties: {
            voltage: { value: 12, unit: 'kV', min: 3.6, max: 36, label: 'Rated Voltage' },
            ratedCurrent: { value: 630, unit: 'A', min: 400, max: 3150, label: 'In' },
            breakingCapacity: { value: 25, unit: 'kA', min: 16, max: 50, label: 'Icu' },
            insulationLevel: { value: 75, unit: 'kV', min: 20, max: 170, label: 'BIL' },
            mechanism: { value: 'Spring', unit: '', label: 'Operating Mechanism' }
        },
        description: 'Medium voltage vacuum breaker',
        draw: drawVCB
    },
    
    // HRC Fuse (High Rupturing Capacity)
    fuse_hrc: {
        name: 'HRC Fuse',
        symbol: 'FU',
        category: 'protection',
        width: 60,
        height: 80,
        ports: [
            { id: 'in', x: 0, y: -35, label: 'IN' },
            { id: 'out', x: 0, y: 35, label: 'OUT' }
        ],
        properties: {
            ratedCurrent: { value: 125, unit: 'A', min: 2, max: 1250, label: 'In' },
            voltage: { value: 690, unit: 'V', min: 400, max: 1000, label: 'Ue' },
            breakingCapacity: { value: 120, unit: 'kA', min: 50, max: 200, label: 'Breaking Cap.' },
            fuseType: { value: 'gG', unit: '', label: 'Type (gG/aM/gM)' },
            size: { value: '00', unit: '', label: 'DIN Size' }
        },
        description: 'High rupturing capacity fuse',
        draw: drawHRCFuse
    },
    
    // NH Fuse Base
    fuse_nh_base: {
        name: 'NH Fuse Base',
        symbol: 'NH',
        category: 'protection',
        width: 70,
        height: 90,
        ports: [
            { id: 'L1_in', x: -25, y: -40, label: 'L1' },
            { id: 'L2_in', x: 0, y: -40, label: 'L2' },
            { id: 'L3_in', x: 25, y: -40, label: 'L3' },
            { id: 'L1_out', x: -25, y: 40, label: 'L1' },
            { id: 'L2_out', x: 0, y: 40, label: 'L2' },
            { id: 'L3_out', x: 25, y: 40, label: 'L3' }
        ],
        properties: {
            size: { value: 3, unit: '', min: 0, max: 4, label: 'NH Size (00-4)' },
            ratedCurrent: { value: 250, unit: 'A', min: 6, max: 1250, label: 'Fuse Rating' },
            voltage: { value: 690, unit: 'V', min: 400, max: 1000, label: 'Voltage' },
            utilization: { value: 'gG', unit: '', label: 'Category' }
        },
        description: 'NH (DIN) fuse disconnector',
        draw: drawNHFuseBase
    },
    
    // Busbar System
    busbar_3phase: {
        name: '3-Phase Busbar',
        symbol: 'BB',
        category: 'distribution',
        width: 100,
        height: 40,
        ports: [
            { id: 'L1_in', x: -50, y: -15, label: 'L1' },
            { id: 'L2_in', x: -50, y: 0, label: 'L2' },
            { id: 'L3_in', x: -50, y: 15, label: 'L3' },
            { id: 'L1_out1', x: 50, y: -15, label: 'L1' },
            { id: 'L2_out1', x: 50, y: 0, label: 'L2' },
            { id: 'L3_out1', x: 50, y: 15, label: 'L3' },
            // Tap-off points
            { id: 'tap1', x: -15, y: 20, label: 'T1' },
            { id: 'tap2', x: 0, y: 20, label: 'T2' },
            { id: 'tap3', x: 15, y: 20, label: 'T3' }
        ],
        properties: {
            rating: { value: 2500, unit: 'A', min: 630, max: 6300, label: 'Busbar Rating' },
            material: { value: 'Copper', unit: '', label: 'Material' },
            shortCircuitRating: { value: 65, unit: 'kA', min: 25, max: 150, label: 'Icw 1s' },
            ipRating: { value: 'IP55', unit: '', label: 'IP Rating' }
        },
        description: 'Copper busbar distribution system',
        draw: drawBusbar3Phase
    }
};

// Drawing Functions
function drawUtilityGrid3Phase(ctx, x, y, rotation) {
    // Grid symbol with transformer
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    
    // Transformer symbol
    ctx.beginPath();
    ctx.arc(x - 15, y - 20, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 15, y - 20, 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Grid connection lines
    ctx.beginPath();
    ctx.moveTo(x - 30, y - 35);
    ctx.lineTo(x - 30, y - 32);
    ctx.moveTo(x, y - 35);
    ctx.lineTo(x, y - 32);
    ctx.moveTo(x + 30, y - 35);
    ctx.lineTo(x + 30, y - 32);
    ctx.stroke();
    
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#1e40af';
    ctx.textAlign = 'center';
    ctx.fillText('3φ GRID', x, y + 10);
}

function drawUtilityGrid1Phase(ctx, x, y, rotation) {
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    
    // Single circle for 1-phase
    ctx.beginPath();
    ctx.arc(x, y - 15, 18, 0, Math.PI * 2);
    ctx.stroke();
    
    // Sine wave inside
    ctx.beginPath();
    for (let i = -15; i <= 15; i++) {
        const yPos = y - 15 + Math.sin(i / 5) * 8;
        if (i === -15) ctx.moveTo(x + i, yPos);
        else ctx.lineTo(x + i, yPos);
    }
    ctx.stroke();
    
    ctx.font = 'bold 9px Arial';
    ctx.fillStyle = '#1e40af';
    ctx.textAlign = 'center';
    ctx.fillText('1φ', x, y + 8);
}

function drawDieselGenerator(ctx, x, y, rotation) {
    ctx.strokeStyle = '#dc2626';
    ctx.fillStyle = '#fef2f2';
    ctx.lineWidth = 2.5;
    
    // Generator body
    ctx.fillRect(x - 40, y - 40, 80, 80);
    ctx.strokeRect(x - 40, y - 40, 80, 80);
    
    // Rotor symbol
    ctx.beginPath();
    ctx.arc(x, y - 10, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Engine symbol
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x - 15, y + 15, 30, 20);
    
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = '#dc2626';
    ctx.textAlign = 'center';
    ctx.fillText('GEN', x, y - 5);
    ctx.font = '9px Arial';
    ctx.fillText('DIESEL', x, y + 28);
}

function drawGasGenerator(ctx, x, y, rotation) {
    ctx.strokeStyle = '#059669';
    ctx.fillStyle = '#f0fdf4';
    ctx.lineWidth = 2.5;
    
    // Generator body
    ctx.fillRect(x - 40, y - 40, 80, 80);
    ctx.strokeRect(x - 40, y - 40, 80, 80);
    
    // Rotor
    ctx.beginPath();
    ctx.arc(x, y - 10, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Gas symbol
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = '#059669';
    ctx.textAlign = 'center';
    ctx.fillText('GEN', x, y - 5);
    ctx.font = '9px Arial';
    ctx.fillText('GAS', x, y + 28);
}

function drawUPS3Phase(ctx, x, y, rotation) {
    ctx.strokeStyle = '#7c3aed';
    ctx.fillStyle = '#faf5ff';
    ctx.lineWidth = 2.5;
    
    // UPS box
    ctx.fillRect(x - 40, y - 45, 80, 90);
    ctx.strokeRect(x - 40, y - 45, 80, 90);
    
    // Battery symbol
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x + 20, y);
    ctx.moveTo(x - 15, y - 5);
    ctx.lineTo(x - 15, y + 5);
    ctx.moveTo(x + 15, y - 5);
    ctx.lineTo(x + 15, y + 5);
    ctx.stroke();
    
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#7c3aed';
    ctx.textAlign = 'center';
    ctx.fillText('UPS', x, y - 25);
}

function drawSwitchboardMain(ctx, x, y, rotation) {
    ctx.strokeStyle = '#374151';
    ctx.fillStyle = '#f3f4f6';
    ctx.lineWidth = 3;
    
    // Panel enclosure
    ctx.fillRect(x - 55, y - 75, 110, 150);
    ctx.strokeRect(x - 55, y - 75, 110, 150);
    
    // Busbars
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 40, y - 60);
    ctx.lineTo(x - 40, y + 60);
    ctx.moveTo(x - 20, y - 60);
    ctx.lineTo(x - 20, y + 60);
    ctx.moveTo(x, y - 60);
    ctx.lineTo(x, y + 60);
    ctx.stroke();
    
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText('MSB', x, y);
}

function drawACB(ctx, x, y, rotation) {
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    
    // Breaker box
    ctx.strokeRect(x - 35, y - 40, 70, 80);
    
    // Contact symbol (open)
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 10);
    ctx.lineTo(x - 20, y);
    ctx.moveTo(x - 20, y + 10);
    ctx.lineTo(x - 20, y + 20);
    ctx.stroke();
    
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#1e40af';
    ctx.textAlign = 'center';
    ctx.fillText('ACB', x, y + 5);
}

function drawVCB(ctx, x, y, rotation) {
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 3;
    
    // VCB box
    ctx.strokeRect(x - 40, y - 50, 80, 100);
    
    // Vacuum chamber symbol
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#7c3aed';
    ctx.textAlign = 'center';
    ctx.fillText('VCB', x, y + 5);
    ctx.font = '8px Arial';
    ctx.fillText('12kV', x, y + 35);
}

function drawHRCFuse(ctx, x, y, rotation) {
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    
    // Fuse body
    ctx.strokeRect(x - 15, y - 30, 30, 60);
    
    // Fuse element
    ctx.beginPath();
    ctx.moveTo(x, y - 30);
    ctx.lineTo(x, y + 30);
    ctx.stroke();
    
    ctx.font = 'bold 9px Arial';
    ctx.fillStyle = '#dc2626';
    ctx.textAlign = 'center';
    ctx.fillText('HRC', x, y);
}

function drawNHFuseBase(ctx, x, y, rotation) {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    
    // NH fuse base
    ctx.strokeRect(x - 30, y - 40, 60, 80);
    
    // 3 fuse positions
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 20, y - 25);
        ctx.lineTo(x + i * 20, y + 25);
        ctx.stroke();
    }
    
    ctx.font = 'bold 9px Arial';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.fillText('NH', x, y + 5);
}

function drawBusbar3Phase(ctx, x, y, rotation) {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    
    // 3 busbars
    ctx.beginPath();
    ctx.moveTo(x - 45, y - 12);
    ctx.lineTo(x + 45, y - 12);
    ctx.moveTo(x - 45, y);
    ctx.lineTo(x + 45, y);
    ctx.moveTo(x - 45, y + 12);
    ctx.lineTo(x + 45, y + 12);
    ctx.stroke();
    
    ctx.font = '8px Arial';
    ctx.fillStyle = '#92400e';
    ctx.textAlign = 'center';
    ctx.fillText('Cu BB', x, y - 25);
}

// Export components
if (typeof PROFESSIONAL_COMPONENTS !== 'undefined') {
    Object.assign(PROFESSIONAL_COMPONENTS, POWER_SOURCES, SWITCHGEAR_COMPONENTS);
}

console.log('✓ Industrial Power Sources and Switchgear loaded');
console.log(`  Power Sources: ${Object.keys(POWER_SOURCES).length}`);
console.log(`  Switchgear: ${Object.keys(SWITCHGEAR_COMPONENTS).length}`);
