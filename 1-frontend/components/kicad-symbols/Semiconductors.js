/**
 * KICAD SEMICONDUCTOR COMPONENTS
 * Based on IEC 60617 standards
 * Diodes, LEDs, Transistors, MOSFETs
 */

const KiCadSemiconductors = {
    
    // Diode
    diode: function(ctx, x, y, size) {
        size = size || 30;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Left lead (cathode)
        ctx.beginPath();
        ctx.moveTo(-size/2 - 10, 0);
        ctx.lineTo(-size/2, 0);
        ctx.stroke();
        
        // Triangle (anode)
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/3);
        ctx.lineTo(-size/2, size/3);
        ctx.lineTo(size/2, 0);
        ctx.closePath();
        ctx.fillStyle = '#000';
        ctx.fill();
        
        // Cathode line
        ctx.beginPath();
        ctx.moveTo(size/2, -size/3);
        ctx.lineTo(size/2, size/3);
        ctx.stroke();
        
        // Right lead
        ctx.beginPath();
        ctx.moveTo(size/2, 0);
        ctx.lineTo(size/2 + 10, 0);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // LED
    led: function(ctx, x, y, size, color) {
        size = size || 30;
        color = color || '#FF0000';
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Left lead
        ctx.beginPath();
        ctx.moveTo(-size/2 - 10, 0);
        ctx.lineTo(-size/2, 0);
        ctx.stroke();
        
        // Triangle
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/3);
        ctx.lineTo(-size/2, size/3);
        ctx.lineTo(size/2, 0);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
        
        // Cathode line
        ctx.beginPath();
        ctx.moveTo(size/2, -size/3);
        ctx.lineTo(size/2, size/3);
        ctx.stroke();
        
        // Light arrows
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 2; i++) {
            const startX = size/4 + i * 8;
            const startY = -size/2 - i * 8;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + 8, startY - 8);
            ctx.stroke();
            // Arrow head
            ctx.beginPath();
            ctx.moveTo(startX + 8, startY - 8);
            ctx.lineTo(startX + 5, startY - 6);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(startX + 8, startY - 8);
            ctx.lineTo(startX + 6, startY - 5);
            ctx.stroke();
        }
        
        // Right lead
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(size/2, 0);
        ctx.lineTo(size/2 + 10, 0);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // Zener diode
    zenerDiode: function(ctx, x, y, size) {
        size = size || 30;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Left lead
        ctx.beginPath();
        ctx.moveTo(-size/2 - 10, 0);
        ctx.lineTo(-size/2, 0);
        ctx.stroke();
        
        // Triangle
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/3);
        ctx.lineTo(-size/2, size/3);
        ctx.lineTo(size/2, 0);
        ctx.closePath();
        ctx.fillStyle = '#000';
        ctx.fill();
        
        // Cathode line with Z shape
        ctx.beginPath();
        ctx.moveTo(size/2, -size/3);
        ctx.lineTo(size/2, size/3);
        ctx.lineTo(size/2 + 5, size/3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size/2 - 5, -size/3);
        ctx.lineTo(size/2, -size/3);
        ctx.stroke();
        
        // Right lead
        ctx.beginPath();
        ctx.moveTo(size/2, 0);
        ctx.lineTo(size/2 + 10, 0);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // NPN Transistor
    transistorNPN: function(ctx, x, y, size) {
        size = size || 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Base line
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/4);
        ctx.lineTo(-size/2, size/4);
        ctx.stroke();
        
        // Base terminal
        ctx.beginPath();
        ctx.moveTo(-size/2 - 10, 0);
        ctx.lineTo(-size/2, 0);
        ctx.stroke();
        
        // Collector
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/4);
        ctx.lineTo(size/2, -size/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size/2, -size/2);
        ctx.lineTo(size/2, -size/2 - 10);
        ctx.stroke();
        
        // Emitter with arrow
        ctx.beginPath();
        ctx.moveTo(-size/2, size/4);
        ctx.lineTo(size/2, size/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size/2, size/2);
        ctx.lineTo(size/2, size/2 + 10);
        ctx.stroke();
        
        // Emitter arrow
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(size/2, size/2 + 10);
        ctx.lineTo(size/2 - 5, size/2 + 3);
        ctx.lineTo(size/2 + 5, size/2 + 3);
        ctx.closePath();
        ctx.fill();
        
        // Labels
        ctx.font = '10px Arial';
        ctx.fillText('C', size/2 + 5, -size/2 - 10);
        ctx.fillText('B', -size/2 - 20, 0);
        ctx.fillText('E', size/2 + 5, size/2 + 15);
        
        ctx.restore();
    },
    
    // N-Channel MOSFET
    mosfetN: function(ctx, x, y, size) {
        size = size || 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Gate
        ctx.beginPath();
        ctx.moveTo(-size/2 - 10, 0);
        ctx.lineTo(-size/3, 0);
        ctx.stroke();
        
        // Gate vertical
        ctx.beginPath();
        ctx.moveTo(-size/3, -size/3);
        ctx.lineTo(-size/3, size/3);
        ctx.stroke();
        
        // Source, drain, body lines
        ctx.beginPath();
        ctx.moveTo(-size/6, -size/3);
        ctx.lineTo(-size/6, -size/4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size/6, -size/8);
        ctx.lineTo(-size/6, size/8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size/6, size/4);
        ctx.lineTo(-size/6, size/3);
        ctx.stroke();
        
        // Drain
        ctx.beginPath();
        ctx.moveTo(-size/6, -size/3);
        ctx.lineTo(size/3, -size/3);
        ctx.lineTo(size/3, -size/2 - 10);
        ctx.stroke();
        
        // Source
        ctx.beginPath();
        ctx.moveTo(-size/6, size/3);
        ctx.lineTo(size/3, size/3);
        ctx.lineTo(size/3, size/2 + 10);
        ctx.stroke();
        
        // Body (connected to source)
        ctx.beginPath();
        ctx.moveTo(-size/6, 0);
        ctx.lineTo(size/3, 0);
        ctx.stroke();
        
        // Arrow (body to channel)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(-size/6, 0);
        ctx.lineTo(-size/6 - 5, -3);
        ctx.lineTo(-size/6 - 5, 3);
        ctx.closePath();
        ctx.fill();
        
        // Labels
        ctx.font = '10px Arial';
        ctx.fillText('D', size/3 + 5, -size/2 - 10);
        ctx.fillText('G', -size/2 - 20, 0);
        ctx.fillText('S', size/3 + 5, size/2 + 15);
        
        ctx.restore();
    },
    
    // Op-Amp
    opamp: function(ctx, x, y, width, height) {
        width = width || 50;
        height = height || 60;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Triangle body
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2);
        ctx.lineTo(-width/2, height/2);
        ctx.lineTo(width/2, 0);
        ctx.closePath();
        ctx.stroke();
        
        // Input terminals
        // Positive input
        ctx.beginPath();
        ctx.moveTo(-width/2, height/4);
        ctx.lineTo(-width/2 - 10, height/4);
        ctx.stroke();
        ctx.font = '16px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('+', -width/2 + 5, height/4 + 5);
        
        // Negative input
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/4);
        ctx.lineTo(-width/2 - 10, -height/4);
        ctx.stroke();
        ctx.fillText('−', -width/2 + 5, -height/4 + 5);
        
        // Output
        ctx.beginPath();
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2 + 10, 0);
        ctx.stroke();
        
        // Power supply pins (optional)
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(0, -height/2 - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, height/2);
        ctx.lineTo(0, height/2 + 10);
        ctx.stroke();
        
        ctx.restore();
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.KiCadSemiconductors = KiCadSemiconductors;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KiCadSemiconductors;
}
