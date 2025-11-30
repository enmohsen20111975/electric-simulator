// Undo/Redo Manager - Command pattern for state management
// Supports unlimited undo/redo with state snapshots

class Command {
    constructor(type, data) {
        this.type = type;
        this.data = data;
        this.timestamp = Date.now();
    }

    execute() {
        // Override in subclasses
    }

    undo() {
        // Override in subclasses
    }
}

class AddComponentCommand extends Command {
    constructor(component) {
        super('addComponent', { component });
    }

    execute(state) {
        state.components.push(this.data.component);
    }

    undo(state) {
        const index = state.components.findIndex(c => c.id === this.data.component.id);
        if (index !== -1) {
            state.components.splice(index, 1);
        }
    }
}

class DeleteComponentCommand extends Command {
    constructor(component) {
        super('deleteComponent', { component });
    }

    execute(state) {
        const index = state.components.findIndex(c => c.id === this.data.component.id);
        if (index !== -1) {
            state.components.splice(index, 1);
        }
    }

    undo(state) {
        state.components.push(this.data.component);
    }
}

class MoveComponentCommand extends Command {
    constructor(componentId, oldPos, newPos) {
        super('moveComponent', { componentId, oldPos, newPos });
    }

    execute(state) {
        const comp = state.components.find(c => c.id === this.data.componentId);
        if (comp) {
            comp.x = this.data.newPos.x;
            comp.y = this.data.newPos.y;
        }
    }

    undo(state) {
        const comp = state.components.find(c => c.id === this.data.componentId);
        if (comp) {
            comp.x = this.data.oldPos.x;
            comp.y = this.data.oldPos.y;
        }
    }
}

class UndoRedoManager {
    constructor(maxHistory = 100) {
        this.maxHistory = maxHistory;
        this.undoStack = [];
        this.redoStack = [];
        this.state = null;
    }

    setState(state) {
        this.state = state;
    }

    executeCommand(command) {
        if (!this.state) {
            console.error('State not set');
            return false;
        }

        // Execute the command
        command.execute(this.state);

        // Add to undo stack
        this.undoStack.push(command);

        // Clear redo stack
        this.redoStack = [];

        // Limit history size
        if (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift();
        }

        return true;
    }

    undo() {
        if (this.undoStack.length === 0) {
            return false;
        }

        const command = this.undoStack.pop();
        command.undo(this.state);
        this.redoStack.push(command);

        return true;
    }

    redo() {
        if (this.redoStack.length === 0) {
            return false;
        }

        const command = this.redoStack.pop();
        command.execute(this.state);
        this.undoStack.push(command);

        return true;
    }

    canUndo() {
        return this.undoStack.length > 0;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }

    getHistory() {
        return {
            undoCount: this.undoStack.length,
            redoCount: this.redoStack.length,
            undoStack: this.undoStack.map(cmd => ({
                type: cmd.type,
                timestamp: cmd.timestamp
            })),
            redoStack: this.redoStack.map(cmd => ({
                type: cmd.type,
                timestamp: cmd.timestamp
            }))
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UndoRedoManager,
        Command,
        AddComponentCommand,
        DeleteComponentCommand,
        MoveComponentCommand
    };
}
