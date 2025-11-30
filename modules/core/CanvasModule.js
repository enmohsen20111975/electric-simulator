// Canvas Module - Handles all canvas rendering and drawing operations
// This module isolates rendering logic to prevent breaking the entire app

(function() {
    'use strict';

    class CanvasModule {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.container = null;
            this.COLORS = {
                selection: '#6366f1',
                handle: '#ffffff',
                wire: '#10b981',
                wireActive: '#f59e0b',
                grid: 'rgba(100, 116, 139, 0.1)',
                component: '#64748b',
                terminal: '#ef4444',
                terminalHover: '#f97316'
            };
        }

        init(container) {
            this.container = container;
            this.resizeCanvas();
            return true;
        }

        resizeCanvas() {
            if (!this.container) return;
            this.canvas.width = this.container.clientWidth;
            this.canvas.height = this.container.clientHeight;
        }

        // Clear canvas
        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw grid
        drawGrid(state, gridSize) {
            const { scale, offsetX, offsetY } = state;
            this.ctx.save();
            this.ctx.strokeStyle = this.COLORS.grid;
            this.ctx.lineWidth = 1;

            const startX = Math.floor(-offsetX / gridSize) * gridSize;
            const startY = Math.floor(-offsetY / gridSize) * gridSize;
            const endX = startX + this.canvas.width / scale + gridSize;
            const endY = startY + this.canvas.height / scale + gridSize;

            this.ctx.beginPath();
            for (let x = startX; x < endX; x += gridSize) {
                const screenX = (x + offsetX) * scale;
                this.ctx.moveTo(screenX, 0);
                this.ctx.lineTo(screenX, this.canvas.height);
            }
            for (let y = startY; y < endY; y += gridSize) {
                const screenY = (y + offsetY) * scale;
                this.ctx.moveTo(0, screenY);
                this.ctx.lineTo(this.canvas.width, screenY);
            }
            this.ctx.stroke();
            this.ctx.restore();
        }

        // Apply transformations for world coordinates
        applyTransform(state) {
            this.ctx.save();
            this.ctx.scale(state.scale, state.scale);
            this.ctx.translate(state.offsetX, state.offsetY);
        }

        // Restore transformations
        restoreTransform() {
            this.ctx.restore();
        }

        // Draw wire between two points
        drawWire(from, to, color, isSelected = false) {
            this.ctx.save();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = isSelected ? 3 : 2;
            
            // Draw orthogonal wire (auto-routed)
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            
            // Determine if horizontal-first or vertical-first routing
            const dx = Math.abs(to.x - from.x);
            const dy = Math.abs(to.y - from.y);
            
            if (dx > dy) {
                // Horizontal first
                const midX = (from.x + to.x) / 2;
                this.ctx.lineTo(midX, from.y);
                this.ctx.lineTo(midX, to.y);
            } else {
                // Vertical first
                const midY = (from.y + to.y) / 2;
                this.ctx.lineTo(from.x, midY);
                this.ctx.lineTo(to.x, midY);
            }
            
            this.ctx.lineTo(to.x, to.y);
            this.ctx.stroke();
            this.ctx.restore();
        }

        // Draw terminal point
        drawTerminal(x, y, isHovered = false, isConnected = false) {
            this.ctx.save();
            this.ctx.fillStyle = isHovered ? this.COLORS.terminalHover : this.COLORS.terminal;
            this.ctx.beginPath();
            this.ctx.arc(x, y, isConnected ? 4 : 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (isHovered) {
                this.ctx.strokeStyle = this.COLORS.terminalHover;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 6, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }

        // Draw selection box
        drawSelectionBox(x, y, w, h) {
            this.ctx.save();
            this.ctx.strokeStyle = this.COLORS.selection;
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(x, y, w, h);
            this.ctx.restore();
        }

        // Draw resize handles
        drawHandles(x, y, w, h, handleSize) {
            this.ctx.save();
            this.ctx.fillStyle = this.COLORS.handle;
            this.ctx.strokeStyle = this.COLORS.selection;
            this.ctx.lineWidth = 2;

            const handles = [
                { x: x - handleSize/2, y: y - handleSize/2 },
                { x: x + w - handleSize/2, y: y - handleSize/2 },
                { x: x - handleSize/2, y: y + h - handleSize/2 },
                { x: x + w - handleSize/2, y: y + h - handleSize/2 }
            ];

            handles.forEach(handle => {
                this.ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
                this.ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
            });

            this.ctx.restore();
        }

        // Draw component background box
        drawComponentBox(comp, isSelected = false) {
            this.ctx.save();
            
            if (isSelected) {
                this.ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
                this.ctx.fillRect(comp.x, comp.y, comp.w, comp.h);
            }
            
            this.ctx.strokeStyle = isSelected ? this.COLORS.selection : this.COLORS.component;
            this.ctx.lineWidth = isSelected ? 2 : 1;
            this.ctx.strokeRect(comp.x, comp.y, comp.w, comp.h);
            
            this.ctx.restore();
        }

        // Draw text label
        drawLabel(text, x, y, fontSize = 12, color = '#000') {
            this.ctx.save();
            this.ctx.fillStyle = color;
            this.ctx.font = `${fontSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(text, x, y);
            this.ctx.restore();
        }

        // Draw component with rotation
        drawRotatedComponent(comp, drawFunc) {
            this.ctx.save();
            
            const centerX = comp.x + comp.w / 2;
            const centerY = comp.y + comp.h / 2;
            
            if (comp.rotation) {
                this.ctx.translate(centerX, centerY);
                this.ctx.rotate(comp.rotation);
                this.ctx.translate(-centerX, -centerY);
            }
            
            // Call the specific component drawing function
            if (typeof drawFunc === 'function') {
                drawFunc(this.ctx, comp);
            }
            
            this.ctx.restore();
        }

        // Get mouse position relative to canvas
        getMousePos(e, state) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left - state.offsetX * state.scale) / state.scale,
                y: (e.clientY - rect.top - state.offsetY * state.scale) / state.scale
            };
        }
    }

    // Export module
    window.CanvasModule = CanvasModule;
    console.log('✓ CanvasModule loaded');

})();
