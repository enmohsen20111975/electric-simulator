/**
 * SelectionManager
 * Handles selection logic, group selection, and copy/paste operations.
 */
class SelectionManager {
    constructor(canvas, state) {
        this.canvas = canvas;
        this.state = state;
        this.clipboard = null;
        this.selectionStart = null;
        this.isSelecting = false;
    }

    /**
     * Handles mouse down for selection.
     * @param {Object} pos - Mouse position {x, y}
     * @param {boolean} isMultiSelect - Whether Shift/Ctrl is pressed
     */
    handleMouseDown(pos, isMultiSelect) {
        // If clicking on empty space, start box selection
        this.selectionStart = { ...pos };
        this.isSelecting = true;

        if (!isMultiSelect) {
            // Clear existing selection if not multi-select
            // This logic might be handled by the main app, but helper can flag it
        }
    }

    /**
     * Handles mouse move for box selection.
     * @param {Object} pos - Current mouse position
     * @returns {Object|null} Selection box {x, y, w, h} or null
     */
    handleMouseMove(pos) {
        if (!this.isSelecting || !this.selectionStart) return null;

        const x = Math.min(this.selectionStart.x, pos.x);
        const y = Math.min(this.selectionStart.y, pos.y);
        const w = Math.abs(pos.x - this.selectionStart.x);
        const h = Math.abs(pos.y - this.selectionStart.y);

        return { x, y, w, h };
    }

    /**
     * Handles mouse up to finalize selection.
     * @param {Object} pos - Mouse position
     * @param {Array} components - List of all components
     * @returns {Array} List of newly selected components
     */
    handleMouseUp(pos, components) {
        if (!this.isSelecting || !this.selectionStart) {
            this.isSelecting = false;
            return [];
        }

        const box = this.handleMouseMove(pos);
        this.isSelecting = false;
        this.selectionStart = null;

        if (!box) return [];

        // Find components within the box
        return components.filter(comp => {
            return comp.x >= box.x &&
                comp.x + comp.w <= box.x + box.w &&
                comp.y >= box.y &&
                comp.y + comp.h <= box.y + box.h;
        });
    }

    /**
     * Copies selected components to clipboard.
     * @param {Array} selectedComponents 
     */
    copy(selectedComponents) {
        if (!selectedComponents || selectedComponents.length === 0) return;

        // Deep copy to avoid reference issues
        this.clipboard = JSON.parse(JSON.stringify(selectedComponents));
        console.log('Clipboard: Copied', this.clipboard.length, 'components');
    }

    /**
     * Pastes components from clipboard.
     * @param {Object} offset - Offset to paste at {x, y}
     * @returns {Array} New components to add
     */
    paste(offset = { x: 20, y: 20 }) {
        if (!this.clipboard || this.clipboard.length === 0) return [];

        // Create new instances with new IDs and offset positions
        const newComponents = this.clipboard.map(comp => {
            const newComp = JSON.parse(JSON.stringify(comp));
            newComp.id = Date.now() + Math.random(); // Ensure unique ID
            newComp.x += offset.x;
            newComp.y += offset.y;
            return newComp;
        });

        console.log('Clipboard: Pasting', newComponents.length, 'components');
        return newComponents;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SelectionManager;
} else {
    window.SelectionManager = SelectionManager;
}
