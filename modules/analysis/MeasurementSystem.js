// Measurement and Data Analysis Module
// Provides real-time measurement, data logging, and analysis capabilities

class MeasurementSystem {
    constructor() {
        this.measurements = new Map();
        this.history = new Map();
        this.maxHistoryLength = 1000;
        this.sampleRate = 60; // Hz
    }

    /**
     * Record a measurement for a component
     */
    recordMeasurement(componentId, type, value, timestamp = Date.now()) {
        if (!this.history.has(componentId)) {
            this.history.set(componentId, {
                voltage: [],
                current: [],
                power: [],
                timestamps: []
            });
        }

        const history = this.history.get(componentId);

        if (history[type]) {
            history[type].push(value);
            history.timestamps.push(timestamp);

            // Limit history length
            if (history[type].length > this.maxHistoryLength) {
                history[type].shift();
                history.timestamps.shift();
            }
        }

        // Update current measurement
        if (!this.measurements.has(componentId)) {
            this.measurements.set(componentId, {});
        }
        this.measurements.get(componentId)[type] = value;
    }

    /**
     * Get current measurement for a component
     */
    getMeasurement(componentId, type) {
        const measurements = this.measurements.get(componentId);
        return measurements ? measurements[type] : null;
    }

    /**
     * Get measurement history for a component
     */
    getHistory(componentId, type, duration = 10000) {
        const history = this.history.get(componentId);
        if (!history || !history[type]) return { values: [], timestamps: [] };

        const now = Date.now();
        const cutoff = now - duration;

        const indices = history.timestamps
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => t >= cutoff)
            .map(({ i }) => i);

        return {
            values: indices.map(i => history[type][i]),
            timestamps: indices.map(i => history.timestamps[i])
        };
    }

    /**
     * Calculate statistics for a measurement
     */
    calculateStatistics(componentId, type, duration = 10000) {
        const { values } = this.getHistory(componentId, type, duration);

        if (values.length === 0) {
            return { min: 0, max: 0, avg: 0, rms: 0, std: 0 };
        }

        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        const rms = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0) / values.length);
        const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
        const std = Math.sqrt(variance);

        return { min, max, avg, rms, std };
    }

    /**
     * Detect peaks in measurement data
     */
    detectPeaks(componentId, type, threshold = 0.8) {
        const { values, timestamps } = this.getHistory(componentId, type);
        const peaks = [];

        for (let i = 1; i < values.length - 1; i++) {
            if (values[i] > values[i - 1] && values[i] > values[i + 1]) {
                if (values[i] >= threshold * Math.max(...values)) {
                    peaks.push({
                        value: values[i],
                        timestamp: timestamps[i],
                        index: i
                    });
                }
            }
        }

        return peaks;
    }

    /**
     * Calculate power factor (for AC circuits)
     */
    calculatePowerFactor(voltage, current, realPower) {
        const apparentPower = voltage * current;
        if (apparentPower === 0) return 1;
        return realPower / apparentPower;
    }

    /**
     * Calculate total harmonic distortion (THD)
     */
    calculateTHD(fundamentalValue, harmonics) {
        const harmonicSum = harmonics.reduce((sum, h) => sum + h * h, 0);
        return Math.sqrt(harmonicSum) / fundamentalValue;
    }

    /**
     * Export measurements to CSV format
     */
    exportToCSV(componentId) {
        const history = this.history.get(componentId);
        if (!history) return '';

        const headers = ['Timestamp', 'Voltage (V)', 'Current (A)', 'Power (W)'];
        const rows = [headers.join(',')];

        for (let i = 0; i < history.timestamps.length; i++) {
            const row = [
                new Date(history.timestamps[i]).toISOString(),
                history.voltage[i] || 0,
                history.current[i] || 0,
                history.power[i] || 0
            ];
            rows.push(row.join(','));
        }

        return rows.join('\n');
    }

    /**
     * Clear all measurements
     */
    clear() {
        this.measurements.clear();
        this.history.clear();
    }

    /**
     * Clear measurements for a specific component
     */
    clearComponent(componentId) {
        this.measurements.delete(componentId);
        this.history.delete(componentId);
    }
}

// Chart and Visualization Module
class ChartGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.colors = {
            voltage: '#ff0000',
            current: '#0000ff',
            power: '#00ff00',
            grid: '#cccccc',
            text: '#333333'
        };
    }

    /**
     * Draw a time-series chart
     */
    drawTimeSeries(data, options = {}) {
        const {
            width = this.canvas.width,
            height = this.canvas.height,
            margin = { top: 20, right: 20, bottom: 40, left: 60 },
            title = 'Time Series',
            xLabel = 'Time (s)',
            yLabel = 'Value',
            color = '#0000ff'
        } = options;

        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Draw title
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, width / 2, margin.top / 2);

        // Calculate scales
        const xMin = Math.min(...data.timestamps);
        const xMax = Math.max(...data.timestamps);
        const yMin = Math.min(...data.values);
        const yMax = Math.max(...data.values);

        const xScale = plotWidth / (xMax - xMin);
        const yScale = plotHeight / (yMax - yMin);

        // Draw axes
        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(margin.left, margin.top);
        this.ctx.lineTo(margin.left, margin.top + plotHeight);
        this.ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
        this.ctx.stroke();

        // Draw grid
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const y = margin.top + (plotHeight / 10) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(margin.left, y);
            this.ctx.lineTo(margin.left + plotWidth, y);
            this.ctx.stroke();
        }

        // Draw data
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let i = 0; i < data.values.length; i++) {
            const x = margin.left + (data.timestamps[i] - xMin) * xScale;
            const y = margin.top + plotHeight - (data.values[i] - yMin) * yScale;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();

        // Draw labels
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(xLabel, width / 2, height - 10);

        this.ctx.save();
        this.ctx.translate(15, height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(yLabel, 0, 0);
        this.ctx.restore();

        // Draw axis values
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = yMin + (yMax - yMin) * (i / 5);
            const y = margin.top + plotHeight - (plotHeight / 5) * i;
            this.ctx.fillText(value.toFixed(2), margin.left - 5, y + 3);
        }
    }

    /**
     * Draw a multi-series chart
     */
    drawMultiSeries(datasets, options = {}) {
        const {
            width = this.canvas.width,
            height = this.canvas.height,
            margin = { top: 40, right: 100, bottom: 40, left: 60 },
            title = 'Multi-Series Chart',
            xLabel = 'Time (s)',
            yLabel = 'Value'
        } = options;

        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Draw title
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, width / 2, 20);

        // Calculate global scales
        let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
        datasets.forEach(dataset => {
            xMin = Math.min(xMin, ...dataset.timestamps);
            xMax = Math.max(xMax, ...dataset.timestamps);
            yMin = Math.min(yMin, ...dataset.values);
            yMax = Math.max(yMax, ...dataset.values);
        });

        const xScale = plotWidth / (xMax - xMin);
        const yScale = plotHeight / (yMax - yMin);

        // Draw axes
        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(margin.left, margin.top);
        this.ctx.lineTo(margin.left, margin.top + plotHeight);
        this.ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
        this.ctx.stroke();

        // Draw each dataset
        datasets.forEach((dataset, index) => {
            this.ctx.strokeStyle = dataset.color || this.colors[dataset.name] || `hsl(${index * 60}, 70%, 50%)`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            for (let i = 0; i < dataset.values.length; i++) {
                const x = margin.left + (dataset.timestamps[i] - xMin) * xScale;
                const y = margin.top + plotHeight - (dataset.values[i] - yMin) * yScale;

                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();

            // Draw legend
            const legendY = margin.top + index * 20;
            this.ctx.fillStyle = dataset.color || this.colors[dataset.name] || `hsl(${index * 60}, 70%, 50%)`;
            this.ctx.fillRect(width - margin.right + 10, legendY, 15, 10);
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(dataset.name, width - margin.right + 30, legendY + 9);
        });
    }

    /**
     * Draw a bar chart
     */
    drawBarChart(data, options = {}) {
        const {
            width = this.canvas.width,
            height = this.canvas.height,
            margin = { top: 20, right: 20, bottom: 60, left: 60 },
            title = 'Bar Chart',
            color = '#3498db'
        } = options;

        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Draw title
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, width / 2, margin.top / 2);

        const maxValue = Math.max(...data.values);
        const barWidth = plotWidth / data.labels.length - 10;

        // Draw bars
        data.values.forEach((value, index) => {
            const barHeight = (value / maxValue) * plotHeight;
            const x = margin.left + index * (plotWidth / data.labels.length) + 5;
            const y = margin.top + plotHeight - barHeight;

            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, barWidth, barHeight);

            // Draw value on top
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value.toFixed(2), x + barWidth / 2, y - 5);

            // Draw label
            this.ctx.save();
            this.ctx.translate(x + barWidth / 2, height - margin.bottom + 20);
            this.ctx.rotate(-Math.PI / 4);
            this.ctx.fillText(data.labels[index], 0, 0);
            this.ctx.restore();
        });
    }
}

// Export modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MeasurementSystem, ChartGenerator };
} else {
    window.MeasurementSystem = MeasurementSystem;
    window.ChartGenerator = ChartGenerator;
}
