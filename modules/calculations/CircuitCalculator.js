// Circuit Analysis and Calculation Module
// Provides comprehensive electrical calculations for circuit simulation

class CircuitCalculator {
    constructor() {
        this.tolerance = 1e-6;
        this.maxIterations = 100;
    }

    /**
     * Calculate voltage across a resistor using Ohm's Law
     * V = I * R
     */
    calculateResistorVoltage(current, resistance) {
        return current * resistance;
    }

    /**
     * Calculate current through a resistor using Ohm's Law
     * I = V / R
     */
    calculateResistorCurrent(voltage, resistance) {
        if (resistance === 0) return Infinity;
        return voltage / resistance;
    }

    /**
     * Calculate power dissipation in a resistor
     * P = V * I = I² * R = V² / R
     */
    calculateResistorPower(voltage, current, resistance) {
        return {
            power: voltage * current,
            powerFromCurrent: current * current * resistance,
            powerFromVoltage: (voltage * voltage) / resistance
        };
    }

    /**
     * Calculate resistor thermal state based on power dissipation
     */
    calculateResistorThermalState(actualPower, ratedPower) {
        const ratio = actualPower / ratedPower;

        if (ratio > 2.0) return { state: 'failed', color: 'failed', temperature: 200 };
        if (ratio > 1.5) return { state: 'overheating', color: 'overheating', temperature: 150 };
        if (ratio > 1.0) return { state: 'hot', color: 'hot', temperature: 100 };
        if (ratio > 0.5) return { state: 'warm', color: 'warm', temperature: 60 };
        return { state: 'normal', color: 'normal', temperature: 25 };
    }

    /**
     * Calculate capacitor charge and voltage
     * Q = C * V
     * I = C * dV/dt
     */
    calculateCapacitorState(capacitance, voltage, current, dt) {
        const charge = capacitance * voltage;
        const dV = (current * dt) / capacitance;
        const newVoltage = voltage + dV;

        return {
            charge,
            voltage: newVoltage,
            energy: 0.5 * capacitance * voltage * voltage
        };
    }

    /**
     * Calculate inductor state
     * V = L * dI/dt
     * E = 0.5 * L * I²
     */
    calculateInductorState(inductance, current, voltage, dt) {
        const dI = (voltage * dt) / inductance;
        const newCurrent = current + dI;
        const energy = 0.5 * inductance * current * current;

        return {
            current: newCurrent,
            voltage,
            energy
        };
    }

    /**
     * Calculate LED state based on forward voltage and current
     */
    calculateLEDState(forwardVoltage, current, vf) {
        if (current <= 0) return { state: 'off', brightness: 0, color: 'off' };

        const voltage = current > 0 ? vf : 0;
        const brightness = Math.min(current / 0.02, 1); // Normalize to 20mA

        let state, color;
        if (brightness < 0.1) {
            state = 'dim';
            color = 'dim';
        } else if (brightness < 0.5) {
            state = 'medium';
            color = 'medium';
        } else if (brightness < 1.0) {
            state = 'bright';
            color = 'bright';
        } else {
            state = 'very bright';
            color = 'verybright';
        }

        return { state, brightness, color, voltage };
    }

    /**
     * Solve series circuit
     * Total resistance = R1 + R2 + ... + Rn
     * Current is same through all components
     */
    solveSeriesCircuit(components, voltage) {
        const totalResistance = components.reduce((sum, comp) => {
            return sum + (comp.resistance || 0);
        }, 0);

        const current = voltage / totalResistance;

        return components.map(comp => ({
            ...comp,
            current,
            voltage: current * (comp.resistance || 0),
            power: current * current * (comp.resistance || 0)
        }));
    }

    /**
     * Solve parallel circuit
     * 1/Total resistance = 1/R1 + 1/R2 + ... + 1/Rn
     * Voltage is same across all components
     */
    solveParallelCircuit(components, voltage) {
        const totalConductance = components.reduce((sum, comp) => {
            return sum + (comp.resistance ? 1 / comp.resistance : 0);
        }, 0);

        const totalResistance = 1 / totalConductance;
        const totalCurrent = voltage / totalResistance;

        return components.map(comp => {
            const current = voltage / (comp.resistance || Infinity);
            return {
                ...comp,
                current,
                voltage,
                power: voltage * current
            };
        });
    }

    /**
     * Node voltage analysis using Modified Nodal Analysis (MNA)
     * Solves for node voltages in a complex circuit
     */
    solveNodeVoltages(nodes, components, sources) {
        // Simplified MNA - would need full matrix solver for complex circuits
        const nodeCount = nodes.length;
        const G = Array(nodeCount).fill(0).map(() => Array(nodeCount).fill(0)); // Conductance matrix
        const I = Array(nodeCount).fill(0); // Current vector

        // Build conductance matrix
        components.forEach(comp => {
            if (comp.type === 'resistor' && comp.resistance > 0) {
                const g = 1 / comp.resistance;
                const n1 = comp.node1;
                const n2 = comp.node2;

                if (n1 >= 0 && n1 < nodeCount) G[n1][n1] += g;
                if (n2 >= 0 && n2 < nodeCount) G[n2][n2] += g;
                if (n1 >= 0 && n2 >= 0 && n1 < nodeCount && n2 < nodeCount) {
                    G[n1][n2] -= g;
                    G[n2][n1] -= g;
                }
            }
        });

        // Add current sources
        sources.forEach(source => {
            if (source.type === 'current' && source.node >= 0 && source.node < nodeCount) {
                I[source.node] += source.value;
            }
        });

        // Solve using Gaussian elimination (simplified)
        return this.gaussianElimination(G, I);
    }

    /**
     * Gaussian elimination solver for linear systems
     */
    gaussianElimination(A, b) {
        const n = b.length;
        const x = Array(n).fill(0);

        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                    maxRow = k;
                }
            }

            // Swap rows
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [b[i], b[maxRow]] = [b[maxRow], b[i]];

            // Eliminate column
            for (let k = i + 1; k < n; k++) {
                const factor = A[k][i] / A[i][i];
                b[k] -= factor * b[i];
                for (let j = i; j < n; j++) {
                    A[k][j] -= factor * A[i][j];
                }
            }
        }

        // Back substitution
        for (let i = n - 1; i >= 0; i--) {
            x[i] = b[i];
            for (let j = i + 1; j < n; j++) {
                x[i] -= A[i][j] * x[j];
            }
            x[i] /= A[i][i];
        }

        return x;
    }

    /**
     * Calculate wire current capacity and thermal state
     */
    calculateWireState(current, wireGauge = 22) {
        // AWG wire current capacity (approximate)
        const wireCapacity = {
            18: 10, // 10A
            20: 5,  // 5A
            22: 3,  // 3A
            24: 2,  // 2A
            26: 1   // 1A
        };

        const capacity = wireCapacity[wireGauge] || 3;
        const currentAmp = Math.abs(current);
        const ratio = currentAmp / capacity;

        if (ratio > 2.0) return { state: 'overcurrent', color: 'overcurrent', thickness: 8 };
        if (ratio > 1.5) return { state: 'highcurrent', color: 'highcurrent', thickness: 6 };
        if (ratio > 0.5) return { state: 'mediumcurrent', color: 'mediumcurrent', thickness: 4 };
        if (ratio > 0.1) return { state: 'lowcurrent', color: 'lowcurrent', thickness: 3 };
        return { state: 'noflow', color: 'noflow', thickness: 2 };
    }
}

// Export for use in simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CircuitCalculator;
} else {
    window.CircuitCalculator = CircuitCalculator;
}
