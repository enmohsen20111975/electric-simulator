/**
 * HistoryManager
 * Handles Undo/Redo functionality by maintaining a stack of state snapshots.
 */
class HistoryManager {
    constructor(limit = 50) {
        this.undoStack = [];
        this.redoStack = [];
        this.limit = limit;
    }

    /**
     * Pushes a new state to the undo stack.
     * Clears the redo stack.
     * @param {Object} state - The state object to save.
     */
    push(state) {
        // Deep copy the state to avoid reference issues
        const snapshot = JSON.parse(JSON.stringify(state));
        
        this.undoStack.push(snapshot);
        
        // Enforce limit
        if (this.undoStack.length > this.limit) {
            this.undoStack.shift();
        }
        
        // Clear redo stack on new action
        this.redoStack = [];
        
        console.log('History: State pushed. Undo stack size:', this.undoStack.length);
    }

    /**
     * Undoes the last action.
     * @returns {Object|null} The previous state, or null if undo is not possible.
     */
    undo(currentState) {
        if (this.undoStack.length === 0) return null;

        // Save current state to redo stack before undoing
        const currentSnapshot = JSON.parse(JSON.stringify(currentState));
        this.redoStack.push(currentSnapshot);

        const previousState = this.undoStack.pop();
        console.log('History: Undo. Stack sizes:', this.undoStack.length, this.redoStack.length);
        
        return previousState;
    }

    /**
     * Redoes the last undone action.
     * @returns {Object|null} The next state, or null if redo is not possible.
     */
    redo(currentState) {
        if (this.redoStack.length === 0) return null;

        // Save current state to undo stack before redoing
        const currentSnapshot = JSON.parse(JSON.stringify(currentState));
        this.undoStack.push(currentSnapshot);

        const nextState = this.redoStack.pop();
        console.log('History: Redo. Stack sizes:', this.undoStack.length, this.redoStack.length);
        
        return nextState;
    }

    canUndo() {
        return this.undoStack.length > 0;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryManager;
} else {
    window.HistoryManager = HistoryManager;
}
