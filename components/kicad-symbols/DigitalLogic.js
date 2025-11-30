/**
 * KICAD DIGITAL LOGIC COMPONENTS
 * Based on IEC 60617 standards
 * Logic Gates, Flip-Flops, Displays
 */

const KiCadDigitalLogic = {
    
    // AND Gate
    gateAND: function(ctx, x, y, width, height) {
        width = width || 50;
        height = height || 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Body
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2);
        ctx.lineTo(0, -height/2);
        ctx.arc(0, 0, height/2, -Math.PI/2, Math.PI/2);
        ctx.lineTo(-width/2, height/2);
        ctx.closePath();
        ctx.stroke();
        
        // Inputs
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/4);
        ctx.lineTo(-width/2 - 15, -height/4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-width/2, height/4);
        ctx.lineTo(-width/2 - 15, height/4);
        ctx.stroke();
        
        // Output
        ctx.beginPath();
        ctx.moveTo(height/2, 0);
        ctx.lineTo(height/2 + 15, 0);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // OR Gate
    gateOR: function(ctx, x, y, width, height) {
        width = width || 50;
        height = height || 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Body (curved)
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2);
        ctx.quadraticCurveTo(-width/4, 0, -width/2, height/2);
        ctx.bezierCurveTo(width/8, height/2, width/4, height/4, width/2, 0);
        ctx.bezierCurveTo(width/4, -height/4, width/8, -height/2, -width/2, -height/2);
        ctx.stroke();
        
        // Inputs
        ctx.beginPath();
        ctx.moveTo(-width/2 + 5, -height/4);
        ctx.lineTo(-width/2 - 10, -height/4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-width/2 + 5, height/4);
        ctx.lineTo(-width/2 - 10, height/4);
        ctx.stroke();
        
        // Output
        ctx.beginPath();
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2 + 15, 0);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // NOT Gate (Inverter)
    gateNOT: function(ctx, x, y, width, height) {
        width = width || 40;
        height = height || 30;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Triangle
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2);
        ctx.lineTo(-width/2, height/2);
        ctx.lineTo(width/2 - 5, 0);
        ctx.closePath();
        ctx.stroke();
        
        // Inversion bubble
        ctx.beginPath();
        ctx.arc(width/2, 0, 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Input
        ctx.beginPath();
        ctx.moveTo(-width/2, 0);
        ctx.lineTo(-width/2 - 15, 0);
        ctx.stroke();
        
        // Output
        ctx.beginPath();
        ctx.moveTo(width/2 + 5, 0);
        ctx.lineTo(width/2 + 20, 0);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // NAND Gate
    gateNAND: function(ctx, x, y, width, height) {
        width = width || 50;
        height = height || 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Body (AND shape)
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2);
        ctx.lineTo(0, -height/2);
        ctx.arc(0, 0, height/2, -Math.PI/2, Math.PI/2);
        ctx.lineTo(-width/2, height/2);
        ctx.closePath();
        ctx.stroke();
        
        // Inversion bubble
        ctx.beginPath();
        ctx.arc(height/2 + 5, 0, 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inputs
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/4);
        ctx.lineTo(-width/2 - 15, -height/4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-width/2, height/4);
        ctx.lineTo(-width/2 - 15, height/4);
        ctx.stroke();
        
        // Output
        ctx.beginPath();
        ctx.moveTo(height/2 + 10, 0);
        ctx.lineTo(height/2 + 25, 0);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // NOR Gate
    gateNOR: function(ctx, x, y, width, height) {
        width = width || 50;
        height = height || 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Body (OR shape)
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2);
        ctx.quadraticCurveTo(-width/4, 0, -width/2, height/2);
        ctx.bezierCurveTo(width/8, height/2, width/4, height/4, width/2, 0);
        ctx.bezierCurveTo(width/4, -height/4, width/8, -height/2, -width/2, -height/2);
        ctx.stroke();
        
        // Inversion bubble
        ctx.beginPath();
        ctx.arc(width/2 + 5, 0, 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inputs
        ctx.beginPath();
        ctx.moveTo(-width/2 + 5, -height/4);
        ctx.lineTo(-width/2 - 10, -height/4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-width/2 + 5, height/4);
        ctx.lineTo(-width/2 - 10, height/4);
        ctx.stroke();
        
        // Output
        ctx.beginPath();
        ctx.moveTo(width/2 + 10, 0);
        ctx.lineTo(width/2 + 25, 0);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // XOR Gate
    gateXOR: function(ctx, x, y, width, height) {
        width = width || 50;
        height = height || 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Extra input arc (XOR feature)
        ctx.beginPath();
        ctx.moveTo(-width/2 - 5, -height/2);
        ctx.quadraticCurveTo(-width/4 - 5, 0, -width/2 - 5, height/2);
        ctx.stroke();
        
        // Body (OR shape)
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2);
        ctx.quadraticCurveTo(-width/4, 0, -width/2, height/2);
        ctx.bezierCurveTo(width/8, height/2, width/4, height/4, width/2, 0);
        ctx.bezierCurveTo(width/4, -height/4, width/8, -height/2, -width/2, -height/2);
        ctx.stroke();
        
        // Inputs
        ctx.beginPath();
        ctx.moveTo(-width/2 + 5, -height/4);
        ctx.lineTo(-width/2 - 10, -height/4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-width/2 + 5, height/4);
        ctx.lineTo(-width/2 - 10, height/4);
        ctx.stroke();
        
        // Output
        ctx.beginPath();
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2 + 15, 0);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // D Flip-Flop
    flipFlopD: function(ctx, x, y, width, height) {
        width = width || 60;
        height = height || 80;
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Box
        ctx.strokeRect(-width/2, -height/2, width, height);
        
        // D input
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/4);
        ctx.lineTo(-width/2 - 15, -height/4);
        ctx.stroke();
        ctx.font = '14px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('D', -width/2 + 5, -height/4 + 5);
        
        // Clock input (with triangle)
        ctx.beginPath();
        ctx.moveTo(-width/2, height/4);
        ctx.lineTo(-width/2 - 15, height/4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-width/2 + 5, height/4 - 5);
        ctx.lineTo(-width/2, height/4);
        ctx.lineTo(-width/2 + 5, height/4 + 5);
        ctx.stroke();
        ctx.fillText('CLK', -width/2 + 8, height/4 + 5);
        
        // Q output
        ctx.beginPath();
        ctx.moveTo(width/2, -height/4);
        ctx.lineTo(width/2 + 15, -height/4);
        ctx.stroke();
        ctx.fillText('Q', width/2 - 15, -height/4 + 5);
        
        // Q̄ output
        ctx.beginPath();
        ctx.moveTo(width/2, height/4);
        ctx.lineTo(width/2 + 15, height/4);
        ctx.stroke();
        ctx.fillText('Q̄', width/2 - 15, height/4 + 5);
        
        ctx.restore();
    },
    
    // 7-Segment Display
    display7Seg: function(ctx, x, y, width, height, segments) {
        width = width || 40;
        height = height || 60;
        segments = segments || '88888888'; // which segments are on
        ctx.save();
        ctx.translate(x, y);
        
        const segWidth = width * 0.8;
        const segHeight = height * 0.35;
        const segThick = 5;
        
        // Segment positions: a,b,c,d,e,f,g
        const segs = {
            a: {x: 0, y: -height/2, horiz: true},
            b: {x: segWidth/2, y: -segHeight/2, horiz: false},
            c: {x: segWidth/2, y: segHeight/2, horiz: false},
            d: {x: 0, y: height/2, horiz: true},
            e: {x: -segWidth/2, y: segHeight/2, horiz: false},
            f: {x: -segWidth/2, y: -segHeight/2, horiz: false},
            g: {x: 0, y: 0, horiz: true}
        };
        
        // Draw each segment
        Object.keys(segs).forEach((key, idx) => {
            const seg = segs[key];
            const isOn = segments[idx] === '1';
            
            ctx.fillStyle = isOn ? '#FF0000' : '#DDD';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            if (seg.horiz) {
                // Horizontal segment
                ctx.moveTo(seg.x - segWidth/2 + segThick, seg.y);
                ctx.lineTo(seg.x + segWidth/2 - segThick, seg.y);
                ctx.lineTo(seg.x + segWidth/2 - segThick*1.5, seg.y + segThick);
                ctx.lineTo(seg.x - segWidth/2 + segThick*1.5, seg.y + segThick);
            } else {
                // Vertical segment
                ctx.moveTo(seg.x, seg.y - segHeight/2 + segThick);
                ctx.lineTo(seg.x, seg.y + segHeight/2 - segThick);
                ctx.lineTo(seg.x + segThick, seg.y + segHeight/2 - segThick*1.5);
                ctx.lineTo(seg.x + segThick, seg.y - segHeight/2 + segThick*1.5);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
        
        ctx.restore();
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.KiCadDigitalLogic = KiCadDigitalLogic;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KiCadDigitalLogic;
}
