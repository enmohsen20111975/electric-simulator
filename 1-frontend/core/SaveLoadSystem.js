// Save/Load System - Simulation state persistence
// JSON-based save/load with validation

class SaveLoadSystem {
    constructor() {
        this.currentFile = null;
        this.autoSaveEnabled = false;
        this.autoSaveInterval = null;
    }

    saveSimulation(state, metadata = {}) {
        const saveData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            metadata: {
                name: metadata.name || 'Untitled',
                description: metadata.description || '',
                author: metadata.author || '',
                ...metadata
            },
            state: {
                components: state.components || [],
                wires: state.wires || [],
                settings: state.settings || {},
                zoom: state.zoom || 1.0,
                pan: state.pan || { x: 0, y: 0 }
            }
        };

        return JSON.stringify(saveData, null, 2);
    }

    loadSimulation(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            // Validate version
            if (!data.version) {
                throw new Error('Invalid save file: missing version');
            }

            // Validate required fields
            if (!data.state || !data.state.components) {
                throw new Error('Invalid save file: missing state data');
            }

            return {
                success: true,
                data: data.state,
                metadata: data.metadata,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    saveToFile(state, filename = 'simulation.json', metadata = {}) {
        const jsonData = this.saveSimulation(state, metadata);

        // Create blob and download
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 100);

        this.currentFile = filename;
        return true;
    }

    loadFromFile(file, callback) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const result = this.loadSimulation(e.target.result);
            callback(result);
        };

        reader.onerror = () => {
            callback({
                success: false,
                error: 'Failed to read file'
            });
        };

        reader.readAsText(file);
    }

    enableAutoSave(state, interval = 60000) {
        // Auto-save every minute by default
        this.autoSaveEnabled = true;

        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            this.autoSave(state);
        }, interval);
    }

    disableAutoSave() {
        this.autoSaveEnabled = false;
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    autoSave(state) {
        const jsonData = this.saveSimulation(state, {
            name: 'AutoSave',
            autoSave: true
        });

        // Save to localStorage
        try {
            localStorage.setItem('simulator_autosave', jsonData);
            localStorage.setItem('simulator_autosave_time', Date.now().toString());
            return true;
        } catch (error) {
            console.error('AutoSave failed:', error);
            return false;
        }
    }

    loadAutoSave() {
        try {
            const jsonData = localStorage.getItem('simulator_autosave');
            const timestamp = localStorage.getItem('simulator_autosave_time');

            if (!jsonData) {
                return { success: false, error: 'No autosave found' };
            }

            const result = this.loadSimulation(jsonData);
            if (result.success) {
                result.autoSaveTime = timestamp ? new Date(parseInt(timestamp)) : null;
            }

            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    clearAutoSave() {
        localStorage.removeItem('simulator_autosave');
        localStorage.removeItem('simulator_autosave_time');
    }

    exportToImage(canvas, filename = 'circuit.png') {
        const dataURL = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveLoadSystem };
}
