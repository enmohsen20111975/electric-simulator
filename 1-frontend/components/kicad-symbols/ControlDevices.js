/**
 * KICAD CONTROL DEVICES
 * Based on IEC 60617 standards
 * Buttons, Switches, Indicators
 */

const KiCadControlDevices = {
    
    // Draw push button (normally open)
    pushButtonNO: function(ctx, x, y, size, color) {
        size = size || 30;
        color = color || '#00AA00';
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Top terminal
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(0, -size/2);
        ctx.stroke();
        
        // Contact (open)
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/2, 0);
        ctx.stroke();
        
        // Bottom terminal
        ctx.beginPath();
        ctx.moveTo(0, size/2);
        ctx.lineTo(0, size);
        ctx.stroke();
        
        // Push button actuator (top)
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, -size - 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Arrow showing push direction
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(0, -size - 15);
        ctx.lineTo(0, -size - 25);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -size - 15);
        ctx.lineTo(-3, -size - 20);
        ctx.lineTo(3, -size - 20);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    },
    
    // Draw pilot light indicator
    pilotLight: function(ctx, x, y, size, color, on) {
        size = size || 20;
        color = color || '#00AA00';
        on = on || false;
        ctx.save();
        ctx.translate(x, y);
        
        // Circle
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Fill if on
        if (on) {
            ctx.fillStyle = color;
            ctx.fill();
            
            // Glow effect
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fill();
        } else {
            ctx.fillStyle = '#EEE';
            ctx.fill();
        }
        
        // Cross inside (standard indicator symbol)
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-size/3, -size/3);
        ctx.lineTo(size/3, size/3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size/3, -size/3);
        ctx.lineTo(-size/3, size/3);
        ctx.stroke();
        
        // Terminals
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(0, -size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, size/2);
        ctx.lineTo(0, size);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // Draw emergency stop button
    emergencyStop: function(ctx, x, y, size) {
        size = size || 40;
        ctx.save();
        ctx.translate(x, y);
        
        // Large red button
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fillStyle = '#CC0000';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Mushroom head (wider top)
        ctx.beginPath();
        ctx.arc(0, -5, size/2 + 5, 0, Math.PI * 2);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.stroke();
        
        // NC contact below
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Top terminal
        ctx.beginPath();
        ctx.moveTo(0, size/2 + 10);
        ctx.lineTo(0, size/2 + 20);
        ctx.stroke();
        
        // Contact (closed)
        ctx.beginPath();
        ctx.moveTo(-10, size/2 + 25);
        ctx.lineTo(10, size/2 + 25);
        ctx.stroke();
        
        // Bottom terminal
        ctx.beginPath();
        ctx.moveTo(0, size/2 + 30);
        ctx.lineTo(0, size/2 + 40);
        ctx.stroke();
        
        // Cross mark for NC
        ctx.beginPath();
        ctx.moveTo(-5, size/2 + 20);
        ctx.lineTo(5, size/2 + 30);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(5, size/2 + 20);
        ctx.lineTo(-5, size/2 + 30);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // Draw selector switch (2-position)
    selectorSwitch: function(ctx, x, y, size, position) {
        size = size || 30;
        position = position || 0;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Center pivot
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        
        // Selector arm
        const angle = position === 0 ? -Math.PI/4 : Math.PI/4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        ctx.stroke();
        
        // Position terminals
        ctx.beginPath();
        ctx.arc(Math.cos(-Math.PI/4) * size, Math.sin(-Math.PI/4) * size, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(Math.cos(Math.PI/4) * size, Math.sin(Math.PI/4) * size, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Labels
        ctx.font = '10px Arial';
        ctx.fillText('I', Math.cos(-Math.PI/4) * size - 15, Math.sin(-Math.PI/4) * size);
        ctx.fillText('O', Math.cos(Math.PI/4) * size - 15, Math.sin(Math.PI/4) * size);
        
        ctx.restore();
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.KiCadControlDevices = KiCadControlDevices;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KiCadControlDevices;
}
