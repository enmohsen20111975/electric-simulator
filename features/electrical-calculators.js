/**
 * Electrical Calculators Library
 * Ported from electrical-calculations-pro React app
 * Professional electrical engineering calculations
 */

const ElectricalCalculators = {

    /**
     * WIRING CALCULATIONS
     */

    // Voltage Drop Calculator
    voltageDrop: function(phase, voltage, current, length, wireSize, material) {
        // phase: 'single' or 'three'
        // material: 'copper' or 'aluminum'
        
        const rho = material === 'copper' ? 0.0172 : 0.0282; // Resistivity (Ω·mm²/m)
        const phaseMultiplier = phase === 'single' ? 2 : Math.sqrt(3);
        
        const voltageDropV = (phaseMultiplier * rho * length * current) / wireSize;
        const voltageDropPercent = (voltageDropV / voltage) * 100;
        const endVoltage = voltage - voltageDropV;
        
        return {
            voltageDropV: voltageDropV.toFixed(2),
            voltageDropPercent: voltageDropPercent.toFixed(2),
            endVoltage: endVoltage.toFixed(2),
            acceptable: voltageDropPercent <= 3 // IEC standard: max 3%
        };
    },

    // Wire Ampacity (Current Carrying Capacity)
    wireAmpacity: function(wireSize, material, insulation, standard) {
        // standard: 'NEC' or 'IEC'
        // insulation: 'PVC' or 'XLPE'
        
        const necAmpacityCu = {
            '75C':  [20, 25, 35, 50, 65, 85, 115], // 14, 12, 10, 8, 6, 4, 2 AWG
            '90C': [25, 30, 40, 55, 75, 95, 130],
        };
        
        const iecAmpacityCu = {
            'PVC':  [17.5, 24, 32, 41, 57, 76, 96], // 1.5, 2.5, 4, 6, 10, 16, 25 mm²
            'XLPE': [23, 32, 43, 54, 75, 101, 125],
        };
        
        // Simplified lookup - in production, use full tables
        const isCopper = material === 'copper';
        const reduction = isCopper ? 1.0 : 0.78; // Aluminum reduction factor
        
        if (standard === 'NEC') {
            const temp = insulation === 'XLPE' ? '90C' : '75C';
            const awgSizes = { 14: 0, 12: 1, 10: 2, 8: 3, 6: 4, 4: 5, 2: 6 };
            const index = awgSizes[wireSize];
            return necAmpacityCu[temp][index] * reduction;
        } else {
            const temp = insulation === 'XLPE' ? 'XLPE' : 'PVC';
            const mm2Sizes = { 1.5: 0, 2.5: 1, 4: 2, 6: 3, 10: 4, 16: 5, 25: 6 };
            const index = mm2Sizes[wireSize];
            return iecAmpacityCu[temp][index] * reduction;
        }
    },

    // Short Circuit Current
    shortCircuit: function(transformerKVA, voltage, impedance) {
        // impedance in percentage
        const fullLoadCurrent = (transformerKVA * 1000) / (Math.sqrt(3) * voltage);
        const shortCircuitCurrent = (fullLoadCurrent * 100) / impedance;
        
        return {
            fullLoadCurrent: fullLoadCurrent.toFixed(2),
            shortCircuitCurrent: shortCircuitCurrent.toFixed(2),
            faultLevel: (shortCircuitCurrent * voltage * Math.sqrt(3) / 1000).toFixed(2) // kA
        };
    },

    /**
     * ELECTRONICS CALCULATIONS
     */

    // Ohm's Law Calculator
    ohmsLaw: function(voltage, current, resistance, calculate) {
        // calculate: 'voltage', 'current', or 'resistance'
        
        if (calculate === 'voltage') {
            return {
                voltage: (current * resistance).toFixed(3),
                power: (current * current * resistance).toFixed(3)
            };
        } else if (calculate === 'current') {
            return {
                current: (voltage / resistance).toFixed(3),
                power: (voltage * voltage / resistance).toFixed(3)
            };
        } else if (calculate === 'resistance') {
            return {
                resistance: (voltage / current).toFixed(3),
                power: (voltage * current).toFixed(3)
            };
        }
    },

    // LED Resistor Calculator
    ledResistor: function(supplyVoltage, ledVoltage, ledCurrent) {
        // ledCurrent in mA
        const currentA = ledCurrent / 1000;
        const resistor = (supplyVoltage - ledVoltage) / currentA;
        const power = (supplyVoltage - ledVoltage) * currentA;
        
        // Find nearest standard resistor value (E12 series)
        const e12Series = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
        let nearestValue = resistor;
        let multiplier = 1;
        
        while (nearestValue > 100) {
            nearestValue /= 10;
            multiplier *= 10;
        }
        
        const nearest = e12Series.reduce((prev, curr) => 
            Math.abs(curr - nearestValue) < Math.abs(prev - nearestValue) ? curr : prev
        );
        
        const standardResistor = nearest * multiplier;
        
        return {
            calculatedResistor: resistor.toFixed(1),
            standardResistor: standardResistor,
            power: power.toFixed(3),
            recommendedWattage: power < 0.125 ? '1/8W' : power < 0.25 ? '1/4W' : '1/2W'
        };
    },

    // Resistor Color Code Decoder
    resistorColorCode: function(band1, band2, band3, band4) {
        const colorValues = {
            'black': 0, 'brown': 1, 'red': 2, 'orange': 3, 'yellow': 4,
            'green': 5, 'blue': 6, 'violet': 7, 'grey': 8, 'white': 9
        };
        
        const multipliers = {
            'black': 1, 'brown': 10, 'red': 100, 'orange': 1000, 'yellow': 10000,
            'green': 100000, 'blue': 1000000, 'violet': 10000000,
            'gold': 0.1, 'silver': 0.01
        };
        
        const tolerances = {
            'brown': '±1%', 'red': '±2%', 'green': '±0.5%', 'blue': '±0.25%',
            'violet': '±0.1%', 'grey': '±0.05%', 'gold': '±5%', 'silver': '±10%'
        };
        
        const resistance = (colorValues[band1] * 10 + colorValues[band2]) * multipliers[band3];
        const tolerance = tolerances[band4];
        
        let formatted = resistance.toString();
        if (resistance >= 1e6) formatted = (resistance / 1e6).toFixed(1) + 'MΩ';
        else if (resistance >= 1e3) formatted = (resistance / 1e3).toFixed(1) + 'kΩ';
        else formatted = resistance + 'Ω';
        
        return {
            resistance: formatted,
            tolerance: tolerance,
            numericValue: resistance
        };
    },

    // Series Resistors
    seriesResistors: function(resistors) {
        const total = resistors.reduce((sum, r) => sum + r, 0);
        return {
            total: total.toFixed(2),
            power: 'Calculate based on current'
        };
    },

    // Parallel Resistors
    parallelResistors: function(resistors) {
        const total = 1 / resistors.reduce((sum, r) => sum + 1/r, 0);
        return {
            total: total.toFixed(2),
            conductance: (1/total).toFixed(6)
        };
    },

    // Capacitor Series/Parallel
    capacitorSeries: function(capacitors) {
        const total = 1 / capacitors.reduce((sum, c) => sum + 1/c, 0);
        return { total: total.toFixed(6) };
    },

    capacitorParallel: function(capacitors) {
        const total = capacitors.reduce((sum, c) => sum + c, 0);
        return { total: total.toFixed(6) };
    },

    // Inductor Series/Parallel
    inductorSeries: function(inductors) {
        const total = inductors.reduce((sum, l) => sum + l, 0);
        return { total: total.toFixed(6) };
    },

    inductorParallel: function(inductors) {
        const total = 1 / inductors.reduce((sum, l) => sum + 1/l, 0);
        return { total: total.toFixed(6) };
    },

    // Voltage Divider
    voltageDivider: function(vinput, r1, r2) {
        const vout = vinput * (r2 / (r1 + r2));
        const current = vinput / (r1 + r2);
        const power = vinput * current;
        
        return {
            vout: vout.toFixed(3),
            current: current.toFixed(6),
            power: power.toFixed(3)
        };
    },

    // RC Time Constant
    rcTimeConstant: function(resistance, capacitance) {
        // R in Ω, C in F
        const tau = resistance * capacitance;
        const chargeTime = tau * 5; // 99% charge time
        
        return {
            tau: tau.toFixed(6),
            chargeTime: chargeTime.toFixed(6),
            cutoffFrequency: (1 / (2 * Math.PI * tau)).toFixed(2)
        };
    },

    // Resonant Frequency (LC Circuit)
    resonantFrequency: function(inductance, capacitance) {
        // L in H, C in F
        const freq = 1 / (2 * Math.PI * Math.sqrt(inductance * capacitance));
        
        return {
            frequency: freq.toFixed(2),
            wavelength: (299792458 / freq).toFixed(2) // Speed of light / freq
        };
    },

    /**
     * MOTOR CALCULATIONS
     */

    // Motor Power Calculation
    motorPower: function(voltage, current, powerFactor, efficiency, phase) {
        // phase: 'single' or 'three'
        
        let power;
        if (phase === 'single') {
            power = voltage * current * powerFactor / 1000; // kW
        } else {
            power = Math.sqrt(3) * voltage * current * powerFactor / 1000; // kW
        }
        
        const outputPower = power * (efficiency / 100);
        const hp = outputPower * 1.341; // Convert kW to HP
        
        return {
            inputPower: power.toFixed(2),
            outputPower: outputPower.toFixed(2),
            horsepower: hp.toFixed(2),
            losses: (power - outputPower).toFixed(2)
        };
    },

    // Motor Starting Current
    motorStartingCurrent: function(ratedCurrent, startingType) {
        const multipliers = {
            'DOL': 6,      // Direct On Line
            'StarDelta': 2,  // Star-Delta starter
            'SoftStart': 3,  // Soft starter
            'VFD': 1.5      // Variable Frequency Drive
        };
        
        const startingCurrent = ratedCurrent * multipliers[startingType];
        
        return {
            startingCurrent: startingCurrent.toFixed(2),
            multiplier: multipliers[startingType],
            startingType: startingType
        };
    },

    /**
     * POWER CALCULATIONS
     */

    // Three-Phase Power
    threePhasePower: function(voltage, current, powerFactor) {
        const apparentPower = Math.sqrt(3) * voltage * current / 1000; // kVA
        const realPower = apparentPower * powerFactor; // kW
        const reactivePower = Math.sqrt(apparentPower * apparentPower - realPower * realPower); // kVAR
        
        return {
            apparentPower: apparentPower.toFixed(2),
            realPower: realPower.toFixed(2),
            reactivePower: reactivePower.toFixed(2),
            powerFactor: powerFactor
        };
    },

    // Power Factor Correction
    powerFactorCorrection: function(realPower, currentPF, targetPF) {
        const currentReactivePower = realPower * Math.tan(Math.acos(currentPF));
        const targetReactivePower = realPower * Math.tan(Math.acos(targetPF));
        const capacitorKVAR = currentReactivePower - targetReactivePower;
        
        return {
            requiredCapacitance: Math.abs(capacitorKVAR).toFixed(2),
            improvement: ((targetPF - currentPF) / currentPF * 100).toFixed(1)
        };
    },

    /**
     * TRANSFORMER CALCULATIONS
     */

    // Transformer Sizing
    transformerSizing: function(loadKVA, diversityFactor, futureExpansion) {
        const adjustedLoad = loadKVA * diversityFactor;
        const futureLoad = adjustedLoad * (1 + futureExpansion / 100);
        
        // Standard transformer sizes (kVA)
        const standardSizes = [15, 30, 45, 75, 112.5, 150, 225, 300, 500, 750, 1000, 1500, 2000];
        const recommendedSize = standardSizes.find(size => size >= futureLoad) || standardSizes[standardSizes.length - 1];
        
        return {
            currentLoad: loadKVA.toFixed(2),
            adjustedLoad: adjustedLoad.toFixed(2),
            futureLoad: futureLoad.toFixed(2),
            recommendedSize: recommendedSize,
            utilizationPercent: ((futureLoad / recommendedSize) * 100).toFixed(1)
        };
    },

    /**
     * BATTERY CALCULATIONS
     */

    // Battery Life Calculator
    batteryLife: function(batteryCapacity, loadCurrent, efficiency) {
        // batteryCapacity in Ah, loadCurrent in A
        const runTime = (batteryCapacity * efficiency / 100) / loadCurrent;
        
        return {
            runTimeHours: runTime.toFixed(2),
            runTimeMinutes: (runTime * 60).toFixed(0),
            energyAvailable: (batteryCapacity * efficiency / 100).toFixed(2)
        };
    },

    // Battery Bank Sizing
    batteryBankSizing: function(powerWatts, voltage, autonomyHours, dod) {
        // dod = depth of discharge percentage
        const current = powerWatts / voltage;
        const capacityAh = (current * autonomyHours) / (dod / 100);
        
        return {
            current: current.toFixed(2),
            capacityAh: capacityAh.toFixed(2),
            energyWh: (capacityAh * voltage).toFixed(2)
        };
    }
};

// Export for use in circuit simulator
if (typeof window !== 'undefined') {
    window.ElectricalCalculators = ElectricalCalculators;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElectricalCalculators;
}
