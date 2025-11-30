// Integration Module for Circuit Calculator
// This file connects CircuitCalculator.js to the circuit simulator UI
// Add this script AFTER CircuitCalculator.js and BEFORE app.js

(function () {
    'use strict';

    // Wait for DOM and calculator to be ready
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof CircuitCalculator === 'undefined') {
            console.error('CircuitCalculator not loaded!');
            return;
        }

        // Create calculator instance
        window.circuitCalc = new CircuitCalculator();

        // Update UI with calculation results
        function updateCalculationUI(results) {
            if (!results) return;

            // Update voltage display
            const voltageDisplay = document.getElementById('voltageDisplay');
            if (voltageDisplay && results.voltage !== undefined) {
                voltageDisplay.textContent = results.voltage.toFixed(2) + ' V';
            }

            // Update current display
            const currentDisplay = document.getElementById('currentDisplay');
            if (currentDisplay && results.current !== undefined) {
                currentDisplay.textContent = (results.current * 1000).toFixed(2) + ' mA';
            }

            // Update power display
            const powerDisplay = document.getElementById('powerDisplay');
            if (powerDisplay && results.power !== undefined) {
                powerDisplay.textContent = (results.power * 1000).toFixed(2) + ' mW';
            }

            // Update status
            const statusDisplay = document.getElementById('statusDisplay');
            if (statusDisplay) {
                if (results.error) {
                    statusDisplay.textContent = 'Error: ' + results.error;
                    statusDisplay.style.color = '#ef4444';
                } else {
                    statusDisplay.textContent = 'OK';
                    statusDisplay.style.color = '#10b981';
                }
            }
        }

        // Calculate circuit values whenever components change
        window.calculateCircuit = function (components, wires) {
            try {
                // Build circuit network from components and wires
                const circuit = buildCircuitNetwork(components, wires);

                // Perform calculations
                const results = window.circuitCalc.analyzeCircuit(circuit);

                // Update UI
                updateCalculationUI(results);

                return results;
            } catch (error) {
                console.error('Circuit calculation error:', error);
                updateCalculationUI({ error: error.message });
                return null;
            }
        };

        // Helper function to build circuit network from components
        function buildCircuitNetwork(components, wires) {
            const network = {
                nodes: [],
                components: [],
                sources: []
            };

            // Process each component
            components.forEach(comp => {
                const compData = {
                    id: comp.id,
                    type: comp.type,
                    value: comp.value || 0,
                    connections: []
                };

                // Find wires connected to this component
                wires.forEach(wire => {
                    if (wire.from === comp.id || wire.to === comp.id) {
                        compData.connections.push({
                            node: wire.from === comp.id ? wire.to : wire.from,
                            terminal: wire.fromTerminal || wire.toTerminal
                        });
                    }
                });

                // Categorize component
                if (comp.type === 'battery' || comp.type === 'functiongen') {
                    network.sources.push(compData);
                } else {
                    network.components.push(compData);
                }
            });

            return network;
        }

        // Auto-calculate on simulation run
        const originalRunSim = window.runSimulation;
        if (originalRunSim) {
            window.runSimulation = function () {
                originalRunSim.apply(this, arguments);

                // Get current circuit state
                if (window.state && window.state.components && window.state.wires) {
                    window.calculateCircuit(window.state.components, window.state.wires);
                }
            };
        }

        console.log('✅ Circuit Calculator integrated successfully');
    });
})();
