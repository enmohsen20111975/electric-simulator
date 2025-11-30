class SimulationLogPanel {
    constructor() {
        this.panel = null;
        this.isVisible = false;
        this.logs = [];
        this.init();
    }

    init() {
        this.createPanel();
        this.attachToWindowManager();
    }

    createPanel() {
        // Create the panel element
        this.panel = document.createElement('div');
        this.panel.id = 'simulationLogPanel';
        this.panel.className = 'floating-window';
        this.panel.style.cssText = `
            position: absolute;
            right: 300px;
            top: 100px;
            width: 400px;
            max-height: 500px;
            display: none;
        `;

        this.panel.innerHTML = `
            <div class="window-header">
                <span class="window-title">Simulation Log</span>
                <div class="window-controls">
                    <button class="minimize-btn" onclick="simulationLog.toggle()">_</button>
                    <button class="close-btn" onclick="simulationLog.hide()">×</button>
                </div>
            </div>
            <div class="simulation-log-content" style="padding: 15px; overflow-y: auto; max-height: 450px; background: white;">
                <p style="color: #999; text-align: center;">No simulation data yet.<br>Run a simulation to see results.</p>
            </div>
        `;

        document.body.appendChild(this.panel);
    }

    attachToWindowManager() {
        // Make the panel draggable using WindowManager
        if (window.windowManager) {
            window.windowManager.makeDraggable('simulationLogPanel', 'Simulation Log');
        }
    }

    show() {
        this.panel.style.display = 'flex';
        this.isVisible = true;
    }

    hide() {
        this.panel.style.display = 'none';
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    clear() {
        this.logs = [];
        this.updateDisplay();
    }

    addLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.push({ timestamp, message, type });
        this.updateDisplay();
    }

    addSection(title) {
        this.logs.push({ type: 'section', title });
        this.updateDisplay();
    }

    addCalculation(description, formula, result) {
        this.logs.push({
            type: 'calculation',
            description,
            formula,
            result
        });
        this.updateDisplay();
    }

    updateDisplay() {
        const content = this.panel.querySelector('.simulation-log-content');

        if (this.logs.length === 0) {
            content.innerHTML = '<p style="color: #999; text-align: center;">No simulation data yet.<br>Run a simulation to see results.</p>';
            return;
        }

        let html = '';

        this.logs.forEach(log => {
            if (log.type === 'section') {
                html += `
                    <div style="margin: 15px 0 10px 0; padding-bottom: 5px; border-bottom: 2px solid #667eea;">
                        <strong style="color: #667eea; font-size: 14px;">${log.title}</strong>
                    </div>
                `;
            } else if (log.type === 'calculation') {
                html += `
                    <div style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 3px solid #10b981; border-radius: 4px;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">${log.description}</div>
                        <div style="font-family: monospace; font-size: 13px; color: #333; margin: 5px 0;">${log.formula}</div>
                        <div style="font-weight: 600; color: #10b981; margin-top: 5px;">= ${log.result}</div>
                    </div>
                `;
            } else if (log.type === 'error') {
                html += `
                    <div style="margin: 8px 0; padding: 8px; background: #fee; border-left: 3px solid #dc2626; border-radius: 4px;">
                        <span style="color: #dc2626; font-size: 12px;">[${log.timestamp}] ${log.message}</span>
                    </div>
                `;
            } else if (log.type === 'warning') {
                html += `
                    <div style="margin: 8px 0; padding: 8px; background: #fef3c7; border-left: 3px solid #eab308; border-radius: 4px;">
                        <span style="color: #92400e; font-size: 12px;">[${log.timestamp}] ${log.message}</span>
                    </div>
                `;
            } else {
                html += `
                    <div style="margin: 8px 0; padding: 8px; background: #f0f9ff; border-left: 3px solid #2563eb; border-radius: 4px;">
                        <span style="color: #1e40af; font-size: 12px;">[${log.timestamp}] ${log.message}</span>
                    </div>
                `;
            }
        });

        content.innerHTML = html;
        content.scrollTop = content.scrollHeight; // Auto-scroll to bottom
    }

    logSimulationStart(componentCount, wireCount) {
        this.clear();
        this.show();
        this.addSection('🔬 Simulation Started');
        this.addLog(`Circuit contains ${componentCount} components and ${wireCount} wires`);
    }

    logAnalysisStep(step, details) {
        this.addLog(`Step ${step}: ${details}`);
    }

    logNodeVoltage(node, voltage) {
        this.addCalculation(
            `Node ${node} voltage`,
            `V(${node})`,
            `${voltage.toFixed(3)} V`
        );
    }

    logComponentCurrent(componentId, current) {
        this.addCalculation(
            `Current through ${componentId}`,
            `I(${componentId})`,
            `${(current * 1000).toFixed(2)} mA`
        );
    }

    logPowerDissipation(componentId, power) {
        this.addCalculation(
            `Power dissipation in ${componentId}`,
            `P = V × I`,
            `${(power * 1000).toFixed(2)} mW`
        );
    }

    logSimulationComplete(success) {
        this.addSection(success ? '✅ Simulation Complete' : '❌ Simulation Failed');
        if (success) {
            this.addLog('All calculations completed successfully', 'info');
        }
    }
}

// Initialize simulation log panel
window.simulationLog = new SimulationLogPanel();

// Add menu item to toggle simulation log
window.toggleSimulationLog = function () {
    window.simulationLog.toggle();
};
