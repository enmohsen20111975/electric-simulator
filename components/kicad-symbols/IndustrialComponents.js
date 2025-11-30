/**
 * KICAD INDUSTRIAL CONTROL COMPONENTS
 * Based on IEC 60617 standards
 * Motors, Contactors, Circuit Breakers, Relays
 */

const KiCadIndustrialComponents = {
    
    /**
     * 3-Phase AC Motor (IEC 60617 Standard)
     * Terminals: U (L1), V (L2), W (L3), PE (Ground)
     * 
     * This symbol follows industrial electrical standards:
     * - IEC 60617 (International)
     * - DIN EN 60617 (European)
     * - Used by ABB, Siemens, Schneider Electric
     * 
     * Terminal naming convention:
     * U/V/W = Modern IEC standard
     * U1/V1/W1 = Alternative notation
     * L1/L2/L3 = Supply lines
     * PE = Protective Earth
     */
    motor3Phase: function(ctx, x, y, size) {
        size = size || 80;
        const radius = size / 2;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.lineWidth = 2;
        
        // Main circle (motor housing)
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Letter "M" for Motor
        ctx.font = `bold ${size * 0.35}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('M', 0, -size * 0.1);
        
        // "3~" symbol (indicates 3-phase AC)
        ctx.font = `${size * 0.22}px Arial`;
        ctx.fillText('3~', 0, size * 0.18);
        
        const terminalLength = size * 0.35;
        
        // U Terminal (Top - connects to L1)
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, -radius - terminalLength);
        ctx.stroke();
        // Terminal connection point
        ctx.beginPath();
        ctx.arc(0, -radius - terminalLength, 3, 0, Math.PI * 2);
        ctx.fill();
        // Label
        ctx.font = `bold ${size * 0.18}px Arial`;
        ctx.fillText('U', -12, -radius - terminalLength - 10);
        
        // V Terminal (Bottom-Left - connects to L2) at 210°
        const vAngle = (210 * Math.PI) / 180;
        const vx = radius * Math.cos(vAngle);
        const vy = radius * Math.sin(vAngle);
        const vx2 = (radius + terminalLength) * Math.cos(vAngle);
        const vy2 = (radius + terminalLength) * Math.sin(vAngle);
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(vx2, vy2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(vx2, vy2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('V', vx2 - 18, vy2 + 5);
        
        // W Terminal (Bottom-Right - connects to L3) at 330°
        const wAngle = (330 * Math.PI) / 180;
        const wx = radius * Math.cos(wAngle);
        const wy = radius * Math.sin(wAngle);
        const wx2 = (radius + terminalLength) * Math.cos(wAngle);
        const wy2 = (radius + terminalLength) * Math.sin(wAngle);
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx2, wy2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(wx2, wy2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('W', wx2 + 12, wy2 + 5);
        
        // PE Terminal (Center-Bottom - Protective Earth)
        ctx.beginPath();
        ctx.moveTo(0, radius);
        ctx.lineTo(0, radius + terminalLength);
        ctx.stroke();
        // Ground symbol (IEC)
        const gndY = radius + terminalLength;
        ctx.beginPath();
        ctx.moveTo(-10, gndY);
        ctx.lineTo(10, gndY);
        ctx.moveTo(-7, gndY + 3);
        ctx.lineTo(7, gndY + 3);
        ctx.moveTo(-4, gndY + 6);
        ctx.lineTo(4, gndY + 6);
        ctx.stroke();
        ctx.fillText('PE', 16, gndY);
        
        ctx.restore();
    },
    
    // Draw contactor/relay (IEC style)
    contactor: function(ctx, x, y, width, height) {
        width = width || 60;
        height = height || 80;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Coil (rectangle at bottom)
        const coilHeight = 30;
        ctx.strokeRect(-width/4, height/2 - coilHeight, width/2, coilHeight);
        
        // Coil terminals A1, A2
        ctx.beginPath();
        ctx.moveTo(-width/4, height/2);
        ctx.lineTo(-width/4, height/2 + 15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width/4, height/2);
        ctx.lineTo(width/4, height/2 + 15);
        ctx.stroke();
        
        // Terminal dots
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-width/4, height/2 + 15, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width/4, height/2 + 15, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Terminal labels
        ctx.font = '10px Arial';
        ctx.fillText('A1', -width/4 - 10, height/2 + 25);
        ctx.fillText('A2', width/4 - 10, height/2 + 25);
        
        // Main contacts (3 pole)
        const contactY = [-height/3, 0, height/3];
        contactY.forEach((cy, idx) => {
            // Fixed contact (top)
            ctx.beginPath();
            ctx.moveTo(-width/3, cy - 15);
            ctx.lineTo(-width/3, cy - 5);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-width/3, cy - 15, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Moving contact (angled)
            ctx.beginPath();
            ctx.moveTo(-width/3, cy - 5);
            ctx.lineTo(width/3 - 10, cy + 5);
            ctx.stroke();
            
            // Fixed contact (bottom)
            ctx.beginPath();
            ctx.moveTo(width/3, cy + 10);
            ctx.lineTo(width/3, cy + 20);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(width/3, cy + 20, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Contact numbers (1-2, 3-4, 5-6)
            ctx.font = '8px Arial';
            ctx.fillText(`${idx*2+1}`, -width/3 - 15, cy - 15);
            ctx.fillText(`${idx*2+2}`, width/3 + 5, cy + 20);
        });
        
        ctx.restore();
    },
    
    // Draw circuit breaker MCB (IEC style)
    circuitBreaker: function(ctx, x, y, width, height) {
        width = width || 30;
        height = height || 60;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Top terminal
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(0, -height/4);
        ctx.stroke();
        
        // Rectangle body
        ctx.strokeRect(-width/2, -height/4, width, height/2);
        
        // Bottom terminal
        ctx.beginPath();
        ctx.moveTo(0, height/4);
        ctx.lineTo(0, height/2);
        ctx.stroke();
        
        // Terminal dots
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, -height/2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, height/2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Breaker symbol inside (thermal + magnetic)
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Q', 0, 0);
        
        ctx.restore();
    },
    
    // Draw thermal overload relay
    thermalRelay: function(ctx, x, y, width, height) {
        width = width || 40;
        height = height || 60;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Bimetallic strip symbol (zigzag line)
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/4, -height/4);
        ctx.lineTo(width/4, 0);
        ctx.lineTo(-width/4, height/4);
        ctx.lineTo(0, height/2);
        ctx.stroke();
        
        // Heater element (wavy line)
        ctx.strokeStyle = '#CC0000';
        ctx.beginPath();
        for (let i = -height/2; i <= height/2; i += 5) {
            const offset = Math.sin(i / 5) * 5;
            if (i === -height/2) {
                ctx.moveTo(offset + 10, i);
            } else {
                ctx.lineTo(offset + 10, i);
            }
        }
        ctx.stroke();
        
        // Terminals
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, -height/2 - 10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, height/2 + 10, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.font = '10px Arial';
        ctx.fillText('F', -20, 0);
        
        ctx.restore();
    },
    
    // Draw transformer (3-phase)
    transformer3Phase: function(ctx, x, y, width, height) {
        width = width || 60;
        height = height || 80;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Iron core (vertical lines)
        for (let i = -5; i <= 5; i += 5) {
            ctx.beginPath();
            ctx.moveTo(i, -height/3);
            ctx.lineTo(i, height/3);
            ctx.stroke();
        }
        
        // Primary winding (left - 3 coils)
        [-height/4, 0, height/4].forEach(cy => {
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(-width/4, cy - 10 + i*7, 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        // Secondary winding (right - 3 coils)
        [-height/4, 0, height/4].forEach(cy => {
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(width/4, cy - 10 + i*7, 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        // Primary terminals (L1, L2, L3)
        [-height/3, 0, height/3].forEach((ty, idx) => {
            ctx.beginPath();
            ctx.moveTo(-width/2, ty);
            ctx.lineTo(-width/4 - 5, ty);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-width/2, ty, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = '10px Arial';
            ctx.fillText(`L${idx+1}`, -width/2 - 15, ty);
        });
        
        // Secondary terminals (U, V, W)
        const labels = ['U', 'V', 'W'];
        [-height/3, 0, height/3].forEach((ty, idx) => {
            ctx.beginPath();
            ctx.moveTo(width/4 + 5, ty);
            ctx.lineTo(width/2, ty);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(width/2, ty, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = '10px Arial';
            ctx.fillText(labels[idx], width/2 + 5, ty);
        });
        
        ctx.restore();
    },
    
    // Draw fuse (IEC style)
    fuse: function(ctx, x, y, width, height) {
        width = width || 40;
        height = height || 20;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Left terminal
        ctx.beginPath();
        ctx.moveTo(-width/2 - 10, 0);
        ctx.lineTo(-width/2, 0);
        ctx.stroke();
        
        // Fuse body (rectangle)
        ctx.strokeRect(-width/2, -height/2, width, height);
        
        // Right terminal
        ctx.beginPath();
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2 + 10, 0);
        ctx.stroke();
        
        // Terminal dots
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-width/2 - 10, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width/2 + 10, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.KiCadIndustrialComponents = KiCadIndustrialComponents;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KiCadIndustrialComponents;
}
