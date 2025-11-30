// StateManager Module - Manages application state
// Isolates state management from rendering and UI logic

(function() {
    'use strict';

    class StateManager {
        constructor() {
            this.state = {
                components: [],
                wires: [],
                tool: 'select',
                selectedComponent: null,
                selectedWire: null,
                hoveredComponent: null,
                isDragging: false,
                isPanning: false,
                isWiring: false,
                wireStart: null,
                dragStart: { x: 0, y: 0 },
                panStart: { x: 0, y: 0 },
                mousePos: { x: 0, y: 0 },
                scale: 1,
                offsetX: 0,
                offsetY: 0,
                simulationRunning: false,
                selectedRealComponent: null
            };
        }

        getState() {
            return this.state;
        }

        setState(updates) {
            Object.assign(this.state, updates);
        }

        // Component management
        addComponent(component) {
            this.state.components.push(component);
            return component;
        }

        removeComponent(component) {
            this.state.components = this.state.components.filter(c => c !== component);
            this.state.wires = this.state.wires.filter(w => 
                w.from.comp !== component && w.to.comp !== component
            );
            if (this.state.selectedComponent === component) {
                this.state.selectedComponent = null;
            }
        }

        getComponentById(id) {
            return this.state.components.find(c => c.id === id);
        }

        // Wire management
        addWire(wire) {
            this.state.wires.push(wire);
            return wire;
        }

        removeWire(wire) {
            this.state.wires = this.state.wires.filter(w => w !== wire);
            if (this.state.selectedWire === wire) {
                this.state.selectedWire = null;
            }
        }

        // Selection management
        selectComponent(component) {
            this.state.selectedComponent = component;
            this.state.selectedWire = null;
        }

        selectWire(wire) {
            this.state.selectedWire = wire;
            this.state.selectedComponent = null;
        }

        clearSelection() {
            this.state.selectedComponent = null;
            this.state.selectedWire = null;
        }

        // Tool management
        setTool(tool) {
            this.state.tool = tool;
        }

        // View management
        zoom(delta) {
            const oldScale = this.state.scale;
            this.state.scale = Math.max(0.1, Math.min(3, this.state.scale + delta));
            const scaleDiff = this.state.scale - oldScale;
            this.state.offsetX -= (window.innerWidth / 2) * scaleDiff / this.state.scale;
            this.state.offsetY -= (window.innerHeight / 2) * scaleDiff / this.state.scale;
        }

        resetView() {
            this.state.scale = 1;
            this.state.offsetX = 0;
            this.state.offsetY = 0;
        }

        // Export/Import state
        exportState() {
            return {
                components: JSON.parse(JSON.stringify(this.state.components)),
                wires: JSON.parse(JSON.stringify(this.state.wires))
            };
        }

        importState(data) {
            if (data.components) {
                this.state.components = JSON.parse(JSON.stringify(data.components));
            }
            if (data.wires) {
                this.state.wires = JSON.parse(JSON.stringify(data.wires));
            }
            this.clearSelection();
        }

        clearAll() {
            this.state.components = [];
            this.state.wires = [];
            this.clearSelection();
        }
    }

    // Export module
    window.StateManager = StateManager;
    console.log('✓ StateManager loaded');

})();
