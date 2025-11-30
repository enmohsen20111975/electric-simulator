/**
 * 3-Phase Power Flow Calculation Engine
 * Performs electrical calculations for 3-phase AC circuits
 * Based on IEC 60909 short-circuit calculation standards
 */

class PowerFlowCalculator {
    constructor() {
        this.systemVoltage = 400; // Default 400V 3-phase
        this.frequency = 50; // Hz
        this.powerFactor = 0.85; // Typical industrial PF
    }
    
    /**
     * Calculate power flow through entire circuit
     */
    calculateCircuitPowerFlow() {
        if (state.components.length === 0) {
            console.log('No components to analyze');
            return null;
        }
        
        // Find power sources
        const sources = state.components.filter(c => 
            c.type === 'voltage_ac' || c.type === 'voltage_3phase'
        );
        
        if (sources.length === 0) {
            console.log('No power sources found in circuit');
            return null;
        }
        
        // Find all loads (motors, resistive loads, etc.)
        const loads = this.identifyLoads();
        
        // Calculate total load
        const totalLoad = this.calculateTotalLoad(loads);
        
        // Calculate voltage drop in cables
        const voltageDrops = this.calculateVoltageDrops();
        
        // Calculate current in each branch
        const branchCurrents = this.calculateBranchCurrents(loads);
        
        // Calculate power losses
        const losses = this.calculatePowerLosses(branchCurrents);
        
        // Generate analysis report
        const report = {
            timestamp: new Date().toISOString(),
            systemVoltage: this.systemVoltage,
            frequency: this.frequency,
            sources: sources.length,
            loads: loads.length,
            totalLoad: totalLoad,
            voltageDrops: voltageDrops,
            branchCurrents: branchCurrents,
            losses: losses,
            efficiency: this.calculateEfficiency(totalLoad, losses)
        };
        
        console.log('Power Flow Analysis:', report);
        return report;
    }
    
    /**
     * Identify all loads in the circuit
     */
    identifyLoads() {
        const loads = [];
        
        for (const comp of state.components) {
            if (this.isLoad(comp)) {
                const loadData = this.getLoadData(comp);
                if (loadData) {
                    loads.push({
                        component: comp,
                        ...loadData
                    });
                }
            }
        }
        
        return loads;
    }
    
    /**
     * Check if component is a load
     */
    isLoad(component) {
        const loadTypes = [
            'motor_ac_3phase',
            'motor_dc',
            'resistor',
            'capacitor',
            'inductor',
            'vfd_3phase',
            'transformer_1phase',
            'transformer_3phase'
        ];
        return loadTypes.includes(component.type);
    }
    
    /**
     * Extract load parameters from component
     */
    getLoadData(component) {
        const props = component.properties;
        
        switch (component.type) {
            case 'motor_ac_3phase':
                return {
                    type: '3-phase motor',
                    power: props.power?.value || 3, // kW
                    voltage: props.voltage?.value || 400, // V
                    current: props.current?.value || this.calculateMotorCurrent(props.power?.value, props.voltage?.value),
                    powerFactor: 0.85,
                    efficiency: 0.90
                };
                
            case 'motor_dc':
                return {
                    type: 'DC motor',
                    power: props.power?.value || 2.2, // kW
                    voltage: props.voltage?.value || 220, // V
                    current: props.current?.value || (props.power?.value * 1000) / props.voltage?.value,
                    powerFactor: 1.0,
                    efficiency: 0.88
                };
                
            case 'vfd_3phase':
                return {
                    type: 'Variable Frequency Drive',
                    power: props.power?.value || 11, // kW
                    voltage: props.inputVoltage?.value || 400, // V
                    current: props.outputCurrent?.value || this.calculateMotorCurrent(props.power?.value, props.inputVoltage?.value),
                    powerFactor: 0.95, // VFDs have better PF
                    efficiency: 0.96
                };
                
            case 'transformer_3phase':
                return {
                    type: '3-phase transformer',
                    power: props.power?.value || 100, // kVA
                    voltage: props.primaryVoltage?.value || 400, // V
                    current: (props.power?.value * 1000) / (Math.sqrt(3) * (props.primaryVoltage?.value || 400)),
                    powerFactor: 1.0,
                    efficiency: 0.98
                };
                
            case 'resistor':
                if (props.resistance && props.voltage) {
                    const current = props.voltage.value / props.resistance.value;
                    const power = props.voltage.value * current / 1000; // kW
                    return {
                        type: 'Resistive load',
                        power: power,
                        voltage: props.voltage.value,
                        current: current,
                        powerFactor: 1.0,
                        efficiency: 1.0
                    };
                }
                return null;
                
            default:
                return null;
        }
    }
    
    /**
     * Calculate motor current using 3-phase formula
     * I = P / (√3 × V × PF × η)
     */
    calculateMotorCurrent(powerKW, voltageV, pf = 0.85, efficiency = 0.90) {
        if (!powerKW || !voltageV) return 0;
        return (powerKW * 1000) / (Math.sqrt(3) * voltageV * pf * efficiency);
    }
    
    /**
     * Calculate total load in circuit
     */
    calculateTotalLoad(loads) {
        let totalPower = 0; // kW
        let totalApparentPower = 0; // kVA
        let totalReactivePower = 0; // kVAR
        
        for (const load of loads) {
            const activePower = load.power; // kW
            const apparentPower = activePower / load.powerFactor; // kVA
            const reactivePower = Math.sqrt(Math.pow(apparentPower, 2) - Math.pow(activePower, 2)); // kVAR
            
            totalPower += activePower;
            totalApparentPower += apparentPower;
            totalReactivePower += reactivePower;
        }
        
        const overallPF = totalPower / totalApparentPower;
        
        return {
            activePower: totalPower.toFixed(2), // kW
            apparentPower: totalApparentPower.toFixed(2), // kVA
            reactivePower: totalReactivePower.toFixed(2), // kVAR
            powerFactor: overallPF.toFixed(3),
            loadCount: loads.length
        };
    }
    
    /**
     * Calculate voltage drops in cable runs
     * Based on IEC 60364-5-52 cable sizing
     */
    calculateVoltageDrops() {
        const drops = [];
        
        // For each wire, calculate voltage drop if current is known
        for (const wire of state.wires) {
            const fromComp = state.components.find(c => c.id === wire.from.componentId);
            const toComp = state.components.find(c => c.id === wire.to.componentId);
            
            if (!fromComp || !toComp) continue;
            
            // Calculate wire length from path
            let wireLength = 0;
            for (let i = 0; i < wire.path.length - 1; i++) {
                const dx = wire.path[i + 1].x - wire.path[i].x;
                const dy = wire.path[i + 1].y - wire.path[i].y;
                wireLength += Math.sqrt(dx * dx + dy * dy);
            }
            
            // Convert pixels to meters (assume 20px = 1 meter for scale)
            wireLength = wireLength / 20;
            
            // Get load current
            const loadData = this.getLoadData(toComp);
            if (!loadData) continue;
            
            // Cable parameters (typical 2.5mm² copper cable)
            const cableResistance = 0.0074; // Ω/m at 20°C for 2.5mm²
            const cableReactance = 0.00008; // Ω/m
            
            const totalResistance = cableResistance * wireLength;
            const totalReactance = cableReactance * wireLength;
            
            // Voltage drop calculation for 3-phase
            // ΔV = √3 × I × (R × cos(φ) + X × sin(φ)) × L
            const cosφ = loadData.powerFactor;
            const sinφ = Math.sqrt(1 - cosφ * cosφ);
            
            const voltageDrop = Math.sqrt(3) * loadData.current * 
                (totalResistance * cosφ + totalReactance * sinφ);
            
            const voltageDropPercent = (voltageDrop / this.systemVoltage) * 100;
            
            drops.push({
                wireId: wire.id,
                from: fromComp.id,
                to: toComp.id,
                length: wireLength.toFixed(2), // meters
                current: loadData.current.toFixed(2), // A
                voltageDrop: voltageDrop.toFixed(2), // V
                voltageDropPercent: voltageDropPercent.toFixed(2), // %
                withinLimits: voltageDropPercent <= 3.0 // IEC limit is 3%
            });
        }
        
        return drops;
    }
    
    /**
     * Calculate current in each branch
     */
    calculateBranchCurrents(loads) {
        const currents = {};
        
        for (const load of loads) {
            const compId = load.component.id;
            currents[compId] = {
                componentId: compId,
                type: load.type,
                current: load.current.toFixed(2),
                power: load.power.toFixed(2),
                powerFactor: load.powerFactor.toFixed(2)
            };
        }
        
        return currents;
    }
    
    /**
     * Calculate power losses in cables and components
     */
    calculatePowerLosses(branchCurrents) {
        let cableLosses = 0; // W
        let componentLosses = 0; // W
        
        // Cable losses: P = 3 × I² × R
        for (const wire of state.wires) {
            const toComp = state.components.find(c => c.id === wire.to.componentId);
            if (!toComp) continue;
            
            const currentData = branchCurrents[toComp.id];
            if (!currentData) continue;
            
            // Calculate wire length
            let wireLength = 0;
            for (let i = 0; i < wire.path.length - 1; i++) {
                const dx = wire.path[i + 1].x - wire.path[i].x;
                const dy = wire.path[i + 1].y - wire.path[i].y;
                wireLength += Math.sqrt(dx * dx + dy * dy);
            }
            wireLength = wireLength / 20; // Convert to meters
            
            const cableResistance = 0.0074 * wireLength; // 2.5mm² copper
            const current = parseFloat(currentData.current);
            const loss = 3 * Math.pow(current, 2) * cableResistance; // 3-phase
            
            cableLosses += loss;
        }
        
        // Component losses (based on efficiency)
        const loads = this.identifyLoads();
        for (const load of loads) {
            const inputPower = load.power * 1000; // Convert to W
            const outputPower = inputPower * load.efficiency;
            const loss = inputPower - outputPower;
            componentLosses += loss;
        }
        
        return {
            cableLosses: (cableLosses / 1000).toFixed(3), // kW
            componentLosses: (componentLosses / 1000).toFixed(3), // kW
            totalLosses: ((cableLosses + componentLosses) / 1000).toFixed(3) // kW
        };
    }
    
    /**
     * Calculate overall system efficiency
     */
    calculateEfficiency(totalLoad, losses) {
        const inputPower = parseFloat(totalLoad.activePower);
        const lossesKW = parseFloat(losses.totalLosses);
        const outputPower = inputPower - lossesKW;
        const efficiency = (outputPower / inputPower) * 100;
        
        return {
            inputPower: inputPower.toFixed(2),
            outputPower: outputPower.toFixed(2),
            efficiency: efficiency.toFixed(2) + '%'
        };
    }
    
    /**
     * Display analysis results in UI panel
     */
    displayAnalysisResults(report) {
        if (!report) {
            alert('No analysis results available. Add power sources and loads to your circuit.');
            return;
        }
        
        // Create or update analysis panel
        let panel = document.getElementById('analysis-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'analysis-panel';
            panel.style.cssText = `
                position: fixed;
                top: 120px;
                right: 20px;
                width: 380px;
                max-height: 600px;
                overflow-y: auto;
                background: white;
                border: 2px solid #2563eb;
                border-radius: 8px;
                padding: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                font-family: 'Segoe UI', Arial, sans-serif;
            `;
            document.body.appendChild(panel);
        }
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">
                <h3 style="margin: 0; color: #1e40af; font-size: 16px;">⚡ Power Flow Analysis</h3>
                <button onclick="document.getElementById('analysis-panel').remove()" 
                        style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">×</button>
            </div>
            
            <div style="margin-bottom: 12px; padding: 10px; background: #f0f9ff; border-left: 3px solid #2563eb; border-radius: 4px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">System Configuration</div>
                <div style="font-weight: 600; color: #1e40af;">
                    ${report.systemVoltage}V / ${report.frequency}Hz 3-Phase
                </div>
            </div>
            
            <div style="margin-bottom: 12px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;">Total Load</h4>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 6px; border: 1px solid #e5e7eb;">Active Power</td>
                        <td style="padding: 6px; border: 1px solid #e5e7eb; font-weight: 600; text-align: right;">${report.totalLoad.activePower} kW</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #e5e7eb;">Apparent Power</td>
                        <td style="padding: 6px; border: 1px solid #e5e7eb; font-weight: 600; text-align: right;">${report.totalLoad.apparentPower} kVA</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 6px; border: 1px solid #e5e7eb;">Reactive Power</td>
                        <td style="padding: 6px; border: 1px solid #e5e7eb; font-weight: 600; text-align: right;">${report.totalLoad.reactivePower} kVAR</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #e5e7eb;">Power Factor</td>
                        <td style="padding: 6px; border: 1px solid #e5e7eb; font-weight: 600; text-align: right; color: ${parseFloat(report.totalLoad.powerFactor) >= 0.85 ? '#059669' : '#dc2626'};">${report.totalLoad.powerFactor}</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 6px; border: 1px solid #e5e7eb;">Load Count</td>
                        <td style="padding: 6px; border: 1px solid #e5e7eb; font-weight: 600; text-align: right;">${report.totalLoad.loadCount}</td>
                    </tr>
                </table>
            </div>
            
            ${report.voltageDrops.length > 0 ? `
            <div style="margin-bottom: 12px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;">Voltage Drops</h4>
                <div style="max-height: 150px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 4px;">
                    ${report.voltageDrops.map(drop => `
                        <div style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-size: 11px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                                <span style="font-weight: 600;">${drop.from} → ${drop.to}</span>
                                <span style="color: ${drop.withinLimits ? '#059669' : '#dc2626'}; font-weight: 600;">
                                    ${drop.voltageDropPercent}%
                                </span>
                            </div>
                            <div style="color: #666;">
                                Length: ${drop.length}m | Current: ${drop.current}A | Drop: ${drop.voltageDrop}V
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 6px; padding: 6px; background: #fef3c7; border-left: 3px solid #f59e0b; font-size: 11px; border-radius: 3px;">
                    ⚠️ IEC 60364 limit: 3% voltage drop
                </div>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 12px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;">Power Losses</h4>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 6px; border: 1px solid #e5e7eb;">Cable Losses</td>
                        <td style="padding: 6px; border: 1px solid #e5e7eb; font-weight: 600; text-align: right; color: #dc2626;">${report.losses.cableLosses} kW</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #e5e7eb;">Component Losses</td>
                        <td style="padding: 6px; border: 1px solid #e5e7eb; font-weight: 600; text-align: right; color: #dc2626;">${report.losses.componentLosses} kW</td>
                    </tr>
                    <tr style="background: #fee2e2;">
                        <td style="padding: 6px; border: 1px solid #e5e7eb; font-weight: 600;">Total Losses</td>
                        <td style="padding: 6px; border: 1px solid #e5e7eb; font-weight: 600; text-align: right; color: #dc2626;">${report.losses.totalLosses} kW</td>
                    </tr>
                </table>
            </div>
            
            <div style="padding: 12px; background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%); border-radius: 6px; border: 1px solid #059669;">
                <div style="font-size: 12px; color: #065f46; margin-bottom: 4px;">System Efficiency</div>
                <div style="font-size: 24px; font-weight: 700; color: #059669;">
                    ${report.efficiency.efficiency}
                </div>
                <div style="font-size: 11px; color: #065f46; margin-top: 4px;">
                    Input: ${report.efficiency.inputPower} kW → Output: ${report.efficiency.outputPower} kW
                </div>
            </div>
            
            <div style="margin-top: 12px; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 10px; color: #666; text-align: center;">
                Analysis based on IEC 60909 standards<br>
                Generated: ${new Date(report.timestamp).toLocaleString()}
            </div>
        `;
        
        console.log('✓ Analysis results displayed');
    }
}

// Initialize calculator
window.powerFlowCalculator = new PowerFlowCalculator();

// Function for toolbar button
function analyzePowerFlow() {
    const report = window.powerFlowCalculator.calculateCircuitPowerFlow();
    window.powerFlowCalculator.displayAnalysisResults(report);
}

console.log('✓ 3-Phase Power Flow Calculator initialized');
console.log('  Functions available:');
console.log('    analyzePowerFlow() - Analyze circuit and show results');
