/**
 * KICAD PASSIVE COMPONENTS
 * Based on IEC 60617 standards
 * Resistors, Capacitors, Inductors
 */

const KiCadPassiveComponents = {
    
    // Resistor (IEC zigzag style)
    resistor: function(ctx, x, y, width, height) {
        width = width || 40;
        height = height || 12;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Left lead
        ctx.beginPath();
        ctx.moveTo(-width/2 - 10, 0);
        ctx.lineTo(-width/2, 0);
        ctx.stroke();
        
        // Zigzag body
        ctx.beginPath();
        ctx.moveTo(-width/2, 0);
        const segments = 6;
        for (let i = 0; i <= segments; i++) {
            const xPos = -width/2 + (i * width / segments);
            const yPos = (i % 2 === 0) ? -height/2 : height/2;
            ctx.lineTo(xPos, yPos);
        }
        ctx.lineTo(width/2, 0);
        ctx.stroke();
        
        // Right lead
        ctx.beginPath();
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2 + 10, 0);
        ctx.stroke();
        
        // Terminal dots
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-width/2 - 10, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width/2 + 10, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    },
    
    // Capacitor (two parallel lines)
    capacitor: function(ctx, x, y, width, height, polarized) {
        width = width || 30;
        height = height || 20;
        polarized = polarized || false;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Left lead
        ctx.beginPath();
        ctx.moveTo(-width/2 - 10, 0);
        ctx.lineTo(-width/2, 0);
        ctx.stroke();
        
        // Left plate
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2);
        ctx.lineTo(-width/2, height/2);
        ctx.stroke();
        
        // Right plate (curved if polarized)
        if (polarized) {
            ctx.beginPath();
            ctx.arc(width/2, 0, height/2, -Math.PI/2, Math.PI/2);
            ctx.stroke();
            
            // Plus sign
            ctx.font = '16px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText('+', -width/2 - 15, -height/2 - 10);
        } else {
            ctx.beginPath();
            ctx.moveTo(width/2, -height/2);
            ctx.lineTo(width/2, height/2);
            ctx.stroke();
        }
        
        // Right lead
        ctx.beginPath();
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2 + 10, 0);
        ctx.stroke();
        
        // Terminal dots
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-width/2 - 10, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width/2 + 10, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    },
    
    // Inductor (coil)
    inductor: function(ctx, x, y, width, height) {
        width = width || 40;
        height = height || 15;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Left lead
        ctx.beginPath();
        ctx.moveTo(-width/2 - 10, 0);
        ctx.lineTo(-width/2, 0);
        ctx.stroke();
        
        // Coils
        const coils = 4;
        const coilWidth = width / coils;
        ctx.beginPath();
        ctx.moveTo(-width/2, 0);
        for (let i = 0; i < coils; i++) {
            const startX = -width/2 + i * coilWidth;
            ctx.arc(startX + coilWidth/2, -height/2, height/2, Math.PI, 0, false);
        }
        ctx.stroke();
        
        // Right lead
        ctx.beginPath();
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2 + 10, 0);
        ctx.stroke();
        
        // Terminal dots
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-width/2 - 10, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width/2 + 10, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.KiCadPassiveComponents = KiCadPassiveComponents;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KiCadPassiveComponents;
}
