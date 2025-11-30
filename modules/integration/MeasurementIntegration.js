// Integration Module for Measurement System
// This file connects MeasurementSystem.js to both simulators
// Add this script AFTER MeasurementSystem.js and integration modules

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof MeasurementSystem === 'undefined') {
            console.error('MeasurementSystem not loaded!');
            return;
        }

        // Create measurement system instance
        window.measurementSystem = new MeasurementSystem();

        // Start data logging
        window.measurementSystem.startLogging();

        // Hook into calculation updates
        const originalCalculateCircuit = window.calculateCircuit;
        if (originalCalculateCircuit) {
            window.calculateCircuit = function (components, wires) {
                const results = originalCalculateCircuit.apply(this, arguments);

                if (results && !results.error) {
                    // Log measurements
                    window.measurementSystem.logMeasurement({
                        voltage: results.voltage || 0,
                        current: results.current || 0,
                        power: results.power || 0,
                        timestamp: Date.now()
                    });
                }

                return results;
            };
        }

        const originalCalculateHydraulic = window.calculateHydraulicSystem;
        if (originalCalculateHydraulic) {
            window.calculateHydraulicSystem = function (components, pipes) {
                const results = originalCalculateHydraulic.apply(this, arguments);

                if (results && !results.error) {
                    // Log measurements
                    window.measurementSystem.logMeasurement({
                        pressure: results.pressure || 0,
                        flowRate: results.flowRate || 0,
                        force: results.force || 0,
                        power: results.power || 0,
                        timestamp: Date.now()
                    });
                }

                return results;
            };
        }

        // Export data function
        window.exportMeasurements = function () {
            const data = window.measurementSystem.exportData();
            const blob = new Blob([data], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'measurements_' + Date.now() + '.csv';
            a.click();
            URL.revokeObjectURL(url);
        };

        // Clear data function
        window.clearMeasurements = function () {
            window.measurementSystem.clearData();
            console.log('Measurement data cleared');
        };

        // Get statistics function
        window.getMeasurementStats = function () {
            return window.measurementSystem.getStatistics();
        };

        console.log('✅ Measurement System integrated successfully');
    });
})();
