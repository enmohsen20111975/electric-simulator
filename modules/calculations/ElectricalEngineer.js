/**
 * Electrical Engineering Calculations Module
 * Wire Sizing, Motor Starters, Protection, Power Quality
 * Standards: IEC 60038, IEC 60947, IEC 60617, NEC
 */

class ElectricalEngineer {
    constructor() {
        // Standard wire gauges (AWG) with current capacities
        this.wireGauges = {
            18: { diameter: 1.02, currentCapacity: 16, resistance: 6.39 }, // Ohms per 1000ft
            16: { diameter: 1.29, currentCapacity: 22, resistance: 4.02 },
            14: { diameter: 1.63, currentCapacity: 32, resistance: 2.53 },
            12: { diameter: 2.05, currentCapacity: 41, resistance: 1.59 },
            10: { diameter: 2.59, currentCapacity: 55, resistance: 1.00 },
            8: { diameter: 3.26, currentCapacity: 73, resistance: 0.628 },
            6: { diameter: 4.11, currentCapacity: 101, resistance: 0.395 },
            4: { diameter: 5.19, currentCapacity: 135, resistance: 0.249 },
            2: { diameter: 6.54, currentCapacity: 181, resistance: 0.156 },
            0: { diameter: 8.25, currentCapacity: 245, resistance: 0.0983 }
        };

        // Motor full load currents (3-phase, 400V)
        this.motorCurrents = {
            0.75: 1.8,   // 0.75 kW
            1.1: 2.5,
            1.5: 3.4,
            2.2: 4.8,
            3: 6.3,
            4: 8.4,
            5.5: 11,
            7.5: 15,
            11: 22,
            15: 29,
            18.5: 36,
            22: 42,
            30: 57,
            37: 70,
            45: 84,
            55: 103,
            75: 140,
            90: 167,
            110: 204,
            132: 245
        };
    }

    /**
     * Calculate required wire gauge based on current and length
     * @param {number} current - Current in Amperes
     * @param {number} length - Wire length in meters
     * @param {number} maxVoltageDrop - Maximum allowable voltage drop (%)
     * @returns {Object} Wire specification
     */
    calculateWireSize(current, length = 10, maxVoltageDrop = 3) {
        const lengthFeet = length * 3.281; // Convert meters to feet
        
        for (let [awg, specs] of Object.entries(this.wireGauges)) {
            const resistance = specs.resistance / 1000 * lengthFeet; // Ohms
            const voltageDrop = current * resistance * 2; // Round trip
            const voltageDropPercent = (voltageDrop / 120) * 100; // Assuming 120V
            
            if (specs.currentCapacity >= current * 1.25 && voltageDropPercent <= maxVoltageDrop) {
                return {
                    awg: parseInt(awg),
                    diameter: specs.diameter,
                    currentCapacity: specs.currentCapacity,
                    actualVoltageDrop: voltageDrop,
                    voltageDropPercent: voltageDropPercent,
                    resistance: resistance,
                    safe: true
                };
            }
        }
        
        return {
            awg: 0,
            safe: false,
            error: 'Wire gauge too large for this current - use busbar'
        };
    }

    /**
     * Calculate motor starter requirements (DOL)
     * @param {number} motorPower - Motor power in kW
     * @param {number} voltage - Voltage in V (default 400V 3-phase)
     * @returns {Object} Starter specifications
     */
    calculateMotorStarter(motorPower, voltage = 400) {
        const fullLoadCurrent = this.motorCurrents[motorPower] || (motorPower * 1000) / (Math.sqrt(3) * voltage * 0.85);
        
        // IEC 60947 standards
        const startingCurrent = fullLoadCurrent * 6; // Typical 6x FLC for DOL
        const contactor = this.selectContactor(fullLoadCurrent);
        const overload = this.selectOverload(fullLoadCurrent);
        const mcb = this.selectMCB(startingCurrent, fullLoadCurrent);
        
        return {
            motorPower: motorPower,
            fullLoadCurrent: fullLoadCurrent,
            startingCurrent: startingCurrent,
            contactor: contactor,
            overload: overload,
            mcb: mcb,
            wireSize: this.calculateWireSize(fullLoadCurrent * 1.25),
            startingTime: this.estimateStartingTime(motorPower),
            powerFactor: 0.85
        };
    }

    /**
     * Select appropriate contactor
     */
    selectContactor(current) {
        const standardSizes = [9, 12, 18, 25, 32, 40, 50, 65, 80, 95, 110, 150, 185, 225, 265, 300, 400];
        
        for (let size of standardSizes) {
            if (size >= current * 1.25) {
                return {
                    rating: size,
                    standard: 'IEC 60947-4-1',
                    type: 'AC-3',
                    coilVoltage: 230
                };
            }
        }
        
        return { rating: 400, type: 'AC-3', oversize: true };
    }

    /**
     * Select thermal overload relay
     */
    selectOverload(current) {
        return {
            adjustmentRange: `${(current * 0.8).toFixed(1)}-${(current * 1.2).toFixed(1)}A`,
            setting: current,
            tripClass: 10, // Class 10A - 10 seconds at 7.2x setting
            standard: 'IEC 60947-4-1'
        };
    }

    /**
     * Select MCB (Miniature Circuit Breaker)
     */
    selectMCB(startingCurrent, fullLoadCurrent) {
        // MCB must not trip during motor start (typically 1-3 seconds)
        // Use Type D (10-20x In) for motors
        const standardRatings = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
        
        // MCB rating should be 1.25x FLC and handle starting current
        const minRating = fullLoadCurrent * 1.25;
        
        for (let rating of standardRatings) {
            // Type D MCB trips at 10-20x rating
            if (rating >= minRating && rating * 10 > startingCurrent) {
                return {
                    rating: rating,
                    type: 'D',
                    curve: 'Type D (Motor)',
                    poles: 3,
                    standard: 'IEC 60898',
                    breakingCapacity: 6000 // 6kA typical
                };
            }
        }
        
        return { rating: 125, type: 'D', oversize: true };
    }

    /**
     * Estimate motor starting time
     */
    estimateStartingTime(motorPower) {
        // Empirical formula based on motor size
        if (motorPower <= 5.5) return 0.5;
        if (motorPower <= 15) return 1.0;
        if (motorPower <= 37) return 2.0;
        return 3.0;
    }

    /**
     * Calculate voltage drop in circuit
     */
    calculateVoltageDrop(current, length, wireAWG) {
        const specs = this.wireGauges[wireAWG];
        if (!specs) return null;
        
        const lengthFeet = length * 3.281;
        const resistance = specs.resistance / 1000 * lengthFeet;
        const voltageDrop = current * resistance * 2; // Round trip
        
        return {
            voltageDrop: voltageDrop,
            voltageDropPercent: (voltageDrop / 120) * 100,
            resistance: resistance
        };
    }

    /**
     * Calculate short circuit current
     * @param {number} sourceVoltage - Source voltage (V)
     * @param {number} sourceImpedance - Source impedance (Ohms)
     * @param {number} cableLength - Cable length (m)
     * @param {number} wireAWG - Wire gauge
     * @returns {Object} Short circuit analysis
     */
    calculateShortCircuit(sourceVoltage, sourceImpedance, cableLength, wireAWG) {
        const specs = this.wireGauges[wireAWG];
        if (!specs) return null;
        
        const lengthFeet = cableLength * 3.281;
        const cableResistance = specs.resistance / 1000 * lengthFeet * 2; // Round trip
        const totalImpedance = sourceImpedance + cableResistance;
        const shortCircuitCurrent = sourceVoltage / totalImpedance;
        
        return {
            shortCircuitCurrent: shortCircuitCurrent,
            totalImpedance: totalImpedance,
            breakingCapacityRequired: Math.ceil(shortCircuitCurrent / 1000) * 1000, // kA
            safe: shortCircuitCurrent < 10000 // Less than 10kA
        };
    }

    /**
     * Calculate power factor correction
     */
    calculatePowerFactorCorrection(activePower, reactivePower) {
        const apparentPower = Math.sqrt(activePower ** 2 + reactivePower ** 2);
        const powerFactor = activePower / apparentPower;
        const targetPF = 0.95;
        
        // Required capacitance to improve PF
        const requiredReactivePower = activePower * (Math.tan(Math.acos(powerFactor)) - Math.tan(Math.acos(targetPF)));
        
        return {
            currentPF: powerFactor,
            targetPF: targetPF,
            requiredKVAR: requiredReactivePower / 1000,
            improvement: ((targetPF - powerFactor) / powerFactor * 100).toFixed(1) + '%'
        };
    }

    /**
     * Star-Delta starter calculations
     */
    calculateStarDeltaStarter(motorPower, voltage = 400) {
        const fullLoadCurrent = this.motorCurrents[motorPower] || (motorPower * 1000) / (Math.sqrt(3) * voltage * 0.85);
        
        // Star mode reduces current by 1/√3
        const starCurrent = fullLoadCurrent * 6 / Math.sqrt(3); // Starting current in star
        const deltaCurrent = fullLoadCurrent * 6; // Starting current in delta
        
        return {
            motorPower: motorPower,
            fullLoadCurrent: fullLoadCurrent,
            starStartingCurrent: starCurrent,
            deltaStartingCurrent: deltaCurrent,
            currentReduction: ((deltaCurrent - starCurrent) / deltaCurrent * 100).toFixed(1) + '%',
            contactors: {
                main: this.selectContactor(fullLoadCurrent),
                star: this.selectContactor(starCurrent / Math.sqrt(3)),
                delta: this.selectContactor(fullLoadCurrent)
            },
            timer: {
                starTime: '5-10 seconds',
                transitionTime: '50ms'
            },
            mcb: this.selectMCB(starCurrent, fullLoadCurrent)
        };
    }

    /**
     * VFD (Variable Frequency Drive) sizing
     */
    calculateVFDSizing(motorPower, voltage = 400) {
        const fullLoadCurrent = this.motorCurrents[motorPower] || (motorPower * 1000) / (Math.sqrt(3) * voltage * 0.85);
        
        // VFD should be rated 10-20% higher than motor
        const vfdRating = motorPower * 1.15;
        
        return {
            motorPower: motorPower,
            vfdRating: vfdRating,
            fullLoadCurrent: fullLoadCurrent,
            vfdCurrent: fullLoadCurrent * 1.15,
            advantages: [
                'Soft start - reduced mechanical stress',
                'Energy savings at partial load',
                'Speed control',
                'No starting current surge'
            ],
            inputFilter: 'Required for THD < 5%',
            outputFilter: 'Recommended for cable > 50m',
            breakingResistor: motorPower > 7.5 ? 'Required' : 'Optional'
        };
    }

    /**
     * Cable tray sizing
     */
    calculateCableTray(cables) {
        const totalArea = cables.reduce((sum, cable) => {
            const specs = this.wireGauges[cable.awg];
            return sum + (specs ? Math.PI * (specs.diameter / 2) ** 2 : 0);
        }, 0);
        
        // 40% fill ratio for cable tray
        const requiredArea = totalArea / 0.4;
        const requiredWidth = Math.sqrt(requiredArea);
        
        const standardWidths = [100, 150, 200, 300, 400, 600]; // mm
        const selectedWidth = standardWidths.find(w => w >= requiredWidth) || 600;
        
        return {
            totalCableArea: totalArea,
            requiredTrayArea: requiredArea,
            selectedWidth: selectedWidth,
            fillRatio: (totalArea / (selectedWidth * 50)) * 100 // Assuming 50mm depth
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElectricalEngineer;
}
