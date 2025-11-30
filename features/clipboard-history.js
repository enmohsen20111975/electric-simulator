/**
 * Keyboard Shortcuts and Copy/Paste System
 * Implements Ctrl+C, Ctrl+V, Ctrl+Z, Ctrl+Y, Delete functionality
 */

class ClipboardManager {
    constructor() {
        this.clipboard = null; // Stores copied components
        this.initKeyboardListeners();
    }
    
    initKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Prevent actions when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const ctrl = e.ctrlKey || e.metaKey; // Support both Ctrl and Cmd (Mac)
            
            // Copy: Ctrl+C
            if (ctrl && e.key === 'c') {
                e.preventDefault();
                this.copySelection();
            }
            
            // Paste: Ctrl+V
            if (ctrl && e.key === 'v') {
                e.preventDefault();
                this.paste();
            }
            
            // Cut: Ctrl+X
            if (ctrl && e.key === 'x') {
                e.preventDefault();
                this.cutSelection();
            }
            
            // Delete: Delete or Backspace
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                this.deleteSelection();
            }
            
            // Undo: Ctrl+Z
            if (ctrl && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (window.historyManager) {
                    window.historyManager.undo();
                }
            }
            
            // Redo: Ctrl+Y or Ctrl+Shift+Z
            if ((ctrl && e.key === 'y') || (ctrl && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                if (window.historyManager) {
                    window.historyManager.redo();
                }
            }
            
            // Select All: Ctrl+A
            if (ctrl && e.key === 'a') {
                e.preventDefault();
                this.selectAll();
            }
            
            // Escape: Deselect all
            if (e.key === 'Escape') {
                e.preventDefault();
                this.deselectAll();
            }
        });
    }
    
    /**
     * Copy selected components to clipboard
     */
    copySelection() {
        const selected = state.components.filter(c => c.selected);
        if (selected.length === 0) {
            console.log('No components selected to copy');
            return;
        }
        
        // Deep clone selected components
        this.clipboard = {
            components: selected.map(comp => ({
                ...comp,
                id: comp.id, // Keep original ID for reference
                ports: comp.ports ? [...comp.ports] : [],
                properties: comp.properties ? { ...comp.properties } : {}
            })),
            wires: [] // Will store wires between copied components
        };
        
        // Find wires connecting selected components
        const selectedIds = new Set(selected.map(c => c.id));
        this.clipboard.wires = state.wires.filter(wire => 
            selectedIds.has(wire.from.componentId) && 
            selectedIds.has(wire.to.componentId)
        ).map(wire => ({
            from: { ...wire.from },
            to: { ...wire.to },
            color: wire.color
        }));
        
        console.log(`✓ Copied ${this.clipboard.components.length} components and ${this.clipboard.wires.length} wires`);
        
        // Visual feedback
        this.showNotification(`Copied ${this.clipboard.components.length} component(s)`, 'success');
    }
    
    /**
     * Paste components from clipboard with offset
     */
    paste() {
        if (!this.clipboard || this.clipboard.components.length === 0) {
            console.log('Clipboard is empty');
            this.showNotification('Nothing to paste', 'warning');
            return;
        }
        
        // Save state for undo
        if (window.historyManager) {
            window.historyManager.saveState();
        }
        
        // Calculate paste offset (20px down and right)
        const offset = { x: 20, y: 20 };
        
        // Map old IDs to new IDs
        const idMapping = new Map();
        
        // Deselect all current components
        state.components.forEach(c => c.selected = false);
        
        // Create new components with new IDs and offset positions
        const pastedComponents = this.clipboard.components.map(comp => {
            const newId = generateUniqueId();
            idMapping.set(comp.id, newId);
            
            const newComp = {
                ...comp,
                id: newId,
                x: comp.x + offset.x,
                y: comp.y + offset.y,
                selected: true, // Select pasted components
                ports: comp.ports ? comp.ports.map(p => ({ ...p })) : []
            };
            
            return newComp;
        });
        
        // Add pasted components to state
        state.components.push(...pastedComponents);
        
        // Create wires with updated component IDs
        const pastedWires = this.clipboard.wires.map(wire => {
            const newFromId = idMapping.get(wire.from.componentId);
            const newToId = idMapping.get(wire.to.componentId);
            
            if (!newFromId || !newToId) return null;
            
            const newWire = {
                id: generateUniqueId(),
                from: {
                    componentId: newFromId,
                    portId: wire.from.portId
                },
                to: {
                    componentId: newToId,
                    portId: wire.to.portId
                },
                color: wire.color || '#2563eb',
                path: []
            };
            
            // Find component objects for path calculation
            const fromComp = state.components.find(c => c.id === newFromId);
            const toComp = state.components.find(c => c.id === newToId);
            
            if (fromComp && toComp && typeof calculateWirePath === 'function') {
                newWire.path = calculateWirePath(newWire.from, newWire.to, fromComp, toComp);
            }
            
            return newWire;
        }).filter(w => w !== null);
        
        // Add wires to state
        state.wires.push(...pastedWires);
        
        // Update junction detection
        if (typeof detectWireIntersections === 'function') {
            detectWireIntersections();
        }
        
        console.log(`✓ Pasted ${pastedComponents.length} components and ${pastedWires.length} wires`);
        this.showNotification(`Pasted ${pastedComponents.length} component(s)`, 'success');
        
        // Redraw
        if (typeof render === 'function') {
            render();
        }
    }
    
    /**
     * Cut selected components (copy + delete)
     */
    cutSelection() {
        const selected = state.components.filter(c => c.selected);
        if (selected.length === 0) {
            console.log('No components selected to cut');
            return;
        }
        
        // Save state for undo
        if (window.historyManager) {
            window.historyManager.saveState();
        }
        
        this.copySelection();
        this.deleteSelection();
        
        this.showNotification(`Cut ${selected.length} component(s)`, 'success');
    }
    
    /**
     * Delete selected components and associated wires
     */
    deleteSelection() {
        const selected = state.components.filter(c => c.selected);
        if (selected.length === 0 && !state.selectedWire) {
            console.log('Nothing selected to delete');
            return;
        }
        
        // Save state for undo
        if (window.historyManager) {
            window.historyManager.saveState();
        }
        
        let deletedCount = 0;
        
        // Delete selected components
        if (selected.length > 0) {
            const selectedIds = new Set(selected.map(c => c.id));
            
            // Remove components
            state.components = state.components.filter(c => !c.selected);
            deletedCount = selected.length;
            
            // Remove wires connected to deleted components
            state.wires = state.wires.filter(wire => 
                !selectedIds.has(wire.from.componentId) && 
                !selectedIds.has(wire.to.componentId)
            );
            
            state.selectedComponent = null;
        }
        
        // Delete selected wire
        if (state.selectedWire) {
            state.wires = state.wires.filter(w => w.id !== state.selectedWire.id);
            state.selectedWire = null;
            deletedCount++;
        }
        
        // Update junction detection
        if (typeof detectWireIntersections === 'function') {
            detectWireIntersections();
        }
        
        console.log(`✓ Deleted ${deletedCount} item(s)`);
        this.showNotification(`Deleted ${deletedCount} item(s)`, 'info');
        
        // Redraw
        if (typeof render === 'function') {
            render();
        }
    }
    
    /**
     * Select all components
     */
    selectAll() {
        state.components.forEach(c => c.selected = true);
        console.log(`✓ Selected all ${state.components.length} components`);
        
        if (typeof render === 'function') {
            render();
        }
    }
    
    /**
     * Deselect all components
     */
    deselectAll() {
        state.components.forEach(c => c.selected = false);
        state.selectedComponent = null;
        state.selectedWire = null;
        
        if (typeof render === 'function') {
            render();
        }
    }
    
    /**
     * Show notification toast
     */
    showNotification(message, type = 'info') {
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Remove after 2 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// ====================================================================
// NOTE: HistoryManager is loaded from core/UndoRedoManager.js
// The duplicate class that was here has been removed to prevent conflicts
// ====================================================================

// Initialize managers
window.clipboardManager = new ClipboardManager();
// NOTE: historyManager is initialized in professional-circuit-engine.js from core/UndoRedoManager.js

console.log('✓ Clipboard manager initialized');
console.log('  Keyboard shortcuts:');
console.log('    Ctrl+C - Copy');
console.log('    Ctrl+V - Paste');
console.log('    Ctrl+X - Cut');
console.log('    Delete/Backspace - Delete');
console.log('    Ctrl+Z - Undo');
console.log('    Ctrl+Y or Ctrl+Shift+Z - Redo');
console.log('    Ctrl+A - Select All');
console.log('    Escape - Deselect All');
