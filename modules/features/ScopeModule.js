/**
 * Oscilloscope Module - Optional Feature
 * Can be enabled/disabled without affecting core simulator
 * Exposed as global: window.ScopeModule
 */

(function() {
    'use strict';

class ScopeModule {
    constructor(canvas, state) {
        this.canvas = canvas;
        this.state = state;
        this.scopeCanvas = null;
        this.scopeCtx = null;
        this.scopeData = [];
        this.timeScale = 10;
        this.voltScale = 5;
        this.recording = false;
        this.maxDataPoints = 500;
        this.enabled = false;
        
        console.log('✓ ScopeModule loaded (disabled by default)');
    }

    /**
     * Initialize the oscilloscope UI and controls
     */
    init() {
        try {
            // Create scope tab dynamically
            this.createScopeTab();
            
            // Create scope panel HTML
            this.createScopePanel();
            
            // Setup canvas
            this.scopeCanvas = document.getElementById('scopeCanvas');
            if (!this.scopeCanvas) {
                console.warn('Scope canvas not found, module disabled');
                return false;
            }
            
            this.scopeCtx = this.scopeCanvas.getContext('2d');
            
            // Setup controls
            this.setupControls();
            
            // Setup panel switching
            this.setupPanelTabs();
            
            this.enabled = true;
            console.log('✓ ScopeModule initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize ScopeModule:', error);
            this.enabled = false;
            return false;
        }
    }

    /**
     * Create scope tab button dynamically
     */
    createScopeTab() {
        const tabsContainer = document.querySelector('.panel-tabs');
        if (!tabsContainer) return;
        
        // Check if tab already exists
        if (document.querySelector('[data-panel="scope"]')) return;
        
        const scopeTab = document.createElement('button');
        scopeTab.className = 'panel-tab';
        scopeTab.setAttribute('data-panel', 'scope');
        scopeTab.innerHTML = '<i class="fas fa-chart-line"></i> Scope';
        tabsContainer.appendChild(scopeTab);
    }

    /**
     * Create scope panel HTML dynamically
     */
    createScopePanel() {
        const rightPanel = document.querySelector('.right-panel');
        if (!rightPanel) return;
        
        // Check if panel already exists
        if (document.getElementById('scopeView')) return;
        
        const scopeView = document.createElement('div');
        scopeView.id = 'scopeView';
        scopeView.className = 'panel-view';
        scopeView.style.display = 'none';
        scopeView.innerHTML = `
            <div class="scope-panel">
                <div class="scope-header">
                    <h3><i class="fas fa-chart-line"></i> Oscilloscope</h3>
                    <button id="scopeClear" class="scope-btn" title="Clear traces">
                        <i class="fas fa-eraser"></i>
                    </button>
                </div>
                <canvas id="scopeCanvas" width="280" height="350"></canvas>
                <div class="scope-controls">
                    <div class="scope-control-row">
                        <label>Time: <span id="timeScaleValue">10ms</span></label>
                        <input type="range" id="timeScale" min="1" max="100" value="10">
                    </div>
                    <div class="scope-control-row">
                        <label>Voltage: <span id="voltScaleValue">5V</span></label>
                        <input type="range" id="voltScale" min="1" max="20" value="5">
                    </div>
                    <div class="scope-waveforms" id="scopeWaveforms">
                        <!-- Waveform indicators added dynamically -->
                    </div>
                </div>
            </div>
        `;
        
        rightPanel.appendChild(scopeView);
    }

    /**
     * Setup panel tab switching
     */
    setupPanelTabs() {
        const tabs = document.querySelectorAll('.panel-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const panel = tab.getAttribute('data-panel');
                this.switchPanel(panel);
            });
        });
    }

    /**
     * Switch between panels
     */
    switchPanel(panelName) {
        // Hide all panels
        document.querySelectorAll('.panel-view').forEach(view => {
            view.style.display = 'none';
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected panel
        const targetView = panelName === 'scope' ? 
            document.getElementById('scopeView') : 
            document.getElementById('propertiesView');
        
        if (targetView) {
            targetView.style.display = 'block';
        }
        
        // Activate tab
        const activeTab = document.querySelector(`[data-panel="${panelName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    /**
     * Setup scope controls
     */
    setupControls() {
        // Time scale
        const timeScaleSlider = document.getElementById('timeScale');
        const timeScaleValue = document.getElementById('timeScaleValue');
        if (timeScaleSlider && timeScaleValue) {
            timeScaleSlider.addEventListener('input', (e) => {
                this.timeScale = parseInt(e.target.value);
                timeScaleValue.textContent = this.timeScale + 'ms';
                this.redraw();
            });
        }

        // Voltage scale
        const voltScaleSlider = document.getElementById('voltScale');
        const voltScaleValue = document.getElementById('voltScaleValue');
        if (voltScaleSlider && voltScaleValue) {
            voltScaleSlider.addEventListener('input', (e) => {
                this.voltScale = parseInt(e.target.value);
                voltScaleValue.textContent = this.voltScale + 'V';
                this.redraw();
            });
        }

        // Clear button
        const clearBtn = document.getElementById('scopeClear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clear();
            });
        }
    }

    /**
     * Add a voltage measurement to the scope
     */
    recordVoltage(componentId, voltage, timestamp) {
        if (!this.enabled || !this.recording) return;
        
        this.scopeData.push({
            componentId,
            voltage,
            timestamp: timestamp || Date.now()
        });
        
        // Limit data points
        if (this.scopeData.length > this.maxDataPoints) {
            this.scopeData.shift();
        }
        
        this.redraw();
    }

    /**
     * Start recording
     */
    startRecording() {
        this.recording = true;
        console.log('Scope recording started');
    }

    /**
     * Stop recording
     */
    stopRecording() {
        this.recording = false;
        console.log('Scope recording stopped');
    }

    /**
     * Clear all traces
     */
    clear() {
        this.scopeData = [];
        this.redraw();
    }

    /**
     * Redraw the oscilloscope display
     */
    redraw() {
        if (!this.scopeCtx || !this.scopeCanvas) return;
        
        const ctx = this.scopeCtx;
        const width = this.scopeCanvas.width;
        const height = this.scopeCanvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw center line
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        
        // Draw waveform data
        if (this.scopeData.length > 1) {
            ctx.strokeStyle = '#0f0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const startTime = this.scopeData[0].timestamp;
            
            this.scopeData.forEach((point, i) => {
                const x = ((point.timestamp - startTime) / this.timeScale) % width;
                const y = height / 2 - (point.voltage / this.voltScale) * (height / 2);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        }
    }

    /**
     * Update with simulation results
     */
    update(components, simulationResults) {
        if (!this.enabled || !this.recording) return;
        
        const timestamp = Date.now();
        
        // Record voltage for each component
        components.forEach(comp => {
            if (comp.type === 'voltmeter' || comp.type === 'resistor') {
                const voltage = simulationResults.voltages?.[comp.id] || 0;
                this.recordVoltage(comp.id, voltage, timestamp);
            }
        });
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.clear();
        this.recording = false;
        this.enabled = false;
        
        // Remove dynamically created elements
        const scopeView = document.getElementById('scopeView');
        if (scopeView) {
            scopeView.remove();
        }
        
        const scopeTab = document.querySelector('[data-panel="scope"]');
        if (scopeTab) {
            scopeTab.remove();
        }
        
        console.log('✓ ScopeModule destroyed');
    }
}

// Expose globally for non-module usage
window.ScopeModule = ScopeModule;

})();
