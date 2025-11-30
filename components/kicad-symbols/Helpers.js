/**
 * KICAD HELPER UTILITIES
 * Wire drawing, junction dots, and common utilities
 */

const KiCadHelpers = {
    
    // Helper: Draw wire with number label
    drawWire: function(ctx, x1, y1, x2, y2, wireNumber, color) {
        wireNumber = wireNumber || null;
        color = color || '#000';
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        
        // Draw wire
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Wire number label (if provided)
        if (wireNumber !== null) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            
            ctx.fillStyle = '#FFF';
            ctx.fillRect(midX - 10, midY - 8, 20, 16);
            
            ctx.font = '10px Arial';
            ctx.fillStyle = '#0066CC';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(wireNumber, midX, midY);
        }
        
        ctx.restore();
    },
    
    // Helper: Draw junction dot
    drawJunction: function(ctx, x, y, size) {
        size = size || 4;
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },
    
    // Helper: Draw terminal dot
    drawTerminal: function(ctx, x, y, size, label) {
        size = size || 3;
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        if (label) {
            ctx.font = '10px Arial';
            ctx.fillText(label, x + 5, y + 5);
        }
        ctx.restore();
    },
    
    // Helper: Draw ground symbol
    drawGround: function(ctx, x, y, size) {
        size = size || 20;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(0, 0);
        ctx.stroke();
        
        // Horizontal lines (getting smaller)
        for (let i = 0; i < 3; i++) {
            const width = size - (i * size/3);
            ctx.beginPath();
            ctx.moveTo(-width/2, i * 5);
            ctx.lineTo(width/2, i * 5);
            ctx.stroke();
        }
        
        ctx.restore();
    },
    
    // Helper: Draw power symbol (VCC/VDD)
    drawPower: function(ctx, x, y, size, label) {
        size = size || 20;
        label = label || 'VCC';
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 2;
        
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, size/2);
        ctx.stroke();
        
        // Plus symbol or horizontal line
        ctx.beginPath();
        ctx.moveTo(-size/3, 0);
        ctx.lineTo(size/3, 0);
        ctx.stroke();
        
        // Label
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#CC0000';
        ctx.textAlign = 'center';
        ctx.fillText(label, 0, -5);
        
        ctx.restore();
    },
    
    // Helper: Draw connection point
    drawConnectionPoint: function(ctx, x, y, label, direction) {
        direction = direction || 'right';
        ctx.save();
        
        // Draw terminal
        this.drawTerminal(ctx, x, y, 4);
        
        // Draw label
        if (label) {
            ctx.font = '11px Arial';
            ctx.fillStyle = '#000';
            ctx.textBaseline = 'middle';
            
            switch(direction) {
                case 'left':
                    ctx.textAlign = 'right';
                    ctx.fillText(label, x - 8, y);
                    break;
                case 'right':
                    ctx.textAlign = 'left';
                    ctx.fillText(label, x + 8, y);
                    break;
                case 'top':
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(label, x, y - 8);
                    break;
                case 'bottom':
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillText(label, x, y + 8);
                    break;
            }
        }
        
        ctx.restore();
    }
};
    // Ensure global availability for index.js
    window.KiCadHelpers = KiCadHelpers;

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.KiCadHelpers = KiCadHelpers;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KiCadHelpers;
}
