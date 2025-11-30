// Additional Professional Electrical Components
// IEEE/IEC Standards - Industrial Grade

// ==================== POWER SOURCES ====================

function draw3PhaseSource(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Three-phase symbol (Y configuration)
    ctx.strokeStyle = '#FF6B6B';
    ctx.fillStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    
    // Center circle
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Three phase lines
    const angles = [270, 150, 30]; // L1, L2, L3
    angles.forEach((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rad) * 30, Math.sin(rad) * 30);
        ctx.stroke();
        
        // Phase labels
        ctx.fillStyle = '#FFF';
        ctx.font = '10px Arial';
        ctx.fillText(`L${i + 1}`, Math.cos(rad) * 35, Math.sin(rad) * 35);
    });
    
    // Neutral point
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Value label
    ctx.fillStyle = '#333';
    ctx.font = '11px Arial';
    const text = `${properties.voltage}`;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 50);
    
    ctx.restore();
}

// ==================== PROTECTION DEVICES ====================

function drawMCB(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#2ECC71';
    ctx.lineWidth = 2;
    
    // Rectangular body
    ctx.strokeRect(-20, -30, 40, 60);
    
    // Trip mechanism (zigzag)
    ctx.beginPath();
    ctx.moveTo(0, -25);
    for (let i = 0; i < 5; i++) {
        ctx.lineTo((i % 2 === 0 ? 5 : -5), -25 + i * 10);
    }
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(0, -35);
    ctx.moveTo(0, 30);
    ctx.lineTo(0, 35);
    ctx.stroke();
    
    // Rating label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 10px Arial';
    const text = properties.rating;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 5);
    
    ctx.restore();
}

function drawMCCB(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#27AE60';
    ctx.lineWidth = 2.5;
    
    // Larger rectangular body
    ctx.strokeRect(-25, -35, 50, 70);
    
    // Three poles indication
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.rect(i * 12 - 5, -25, 10, 50);
        ctx.stroke();
    }
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(0, -35);
    ctx.lineTo(0, -40);
    ctx.moveTo(0, 35);
    ctx.lineTo(0, 40);
    ctx.stroke();
    
    // Rating label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 11px Arial';
    const text = properties.rating;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 32);
    
    ctx.restore();
}

function drawRCCB(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#3498DB';
    ctx.lineWidth = 2;
    
    // Body
    ctx.strokeRect(-30, -30, 60, 60);
    
    // Toroidal core symbol
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Earth leakage symbol
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-5, 0);
    ctx.moveTo(5, 0);
    ctx.lineTo(15, 0);
    ctx.stroke();
    
    // Terminals (L and N)
    ctx.beginPath();
    ctx.moveTo(-10, -30);
    ctx.lineTo(-10, -35);
    ctx.moveTo(10, -30);
    ctx.lineTo(10, -35);
    ctx.moveTo(-10, 30);
    ctx.lineTo(-10, 35);
    ctx.moveTo(10, 30);
    ctx.lineTo(10, 35);
    ctx.stroke();
    
    // Rating
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    const text = properties.rating;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, -20);
    
    ctx.restore();
}

function drawSurgeProtector(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#F39C12';
    ctx.lineWidth = 2;
    
    // Varistor symbol (two arrows)
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, -10);
    // Arrow 1
    ctx.moveTo(-5, -15);
    ctx.lineTo(0, -10);
    ctx.lineTo(5, -15);
    // Arrow 2
    ctx.moveTo(-5, 5);
    ctx.lineTo(0, 10);
    ctx.lineTo(5, 5);
    ctx.moveTo(0, 10);
    ctx.lineTo(0, 20);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, -30);
    ctx.moveTo(0, 20);
    ctx.lineTo(0, 30);
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.font = '9px Arial';
    ctx.fillText('SPD', -10, 0);
    
    ctx.restore();
}

// ==================== MOTORS ====================

function drawMotor1Phase(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#9B59B6';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    // M~ symbol
    ctx.fillStyle = '#9B59B6';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('M', -8, 6);
    ctx.font = '12px Arial';
    ctx.fillText('~', 8, 6);
    
    // Terminals
    ctx.strokeStyle = '#9B59B6';
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-35, 0);
    ctx.moveTo(25, 0);
    ctx.lineTo(35, 0);
    ctx.stroke();
    
    // Power rating
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    const text = properties.power;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 40);
    
    ctx.restore();
}

function drawMotor3Phase(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#8E44AD';
    ctx.lineWidth = 2.5;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.stroke();
    
    // 3~ M symbol
    ctx.fillStyle = '#8E44AD';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('M', -6, 8);
    ctx.font = '11px Arial';
    ctx.fillText('3~', -15, -8);
    
    // Three terminals (U, V, W)
    const angles = [270, 150, 30];
    angles.forEach((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * 30, Math.sin(rad) * 30);
        ctx.lineTo(Math.cos(rad) * 40, Math.sin(rad) * 40);
        ctx.stroke();
    });
    
    // Power rating
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    const text = properties.power;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 50);
    
    ctx.restore();
}

function drawDCMotor(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#34495E';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    // M= symbol
    ctx.fillStyle = '#34495E';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('M', -8, 6);
    ctx.font = '14px Arial';
    ctx.fillText('=', 8, 6);
    
    // Armature terminals (left)
    ctx.strokeStyle = '#34495E';
    ctx.beginPath();
    ctx.moveTo(-25, -10);
    ctx.lineTo(-35, -10);
    ctx.moveTo(-25, 10);
    ctx.lineTo(-35, 10);
    ctx.stroke();
    
    // Field terminals (right)
    ctx.beginPath();
    ctx.moveTo(25, -10);
    ctx.lineTo(35, -10);
    ctx.moveTo(25, 10);
    ctx.lineTo(35, 10);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '8px Arial';
    ctx.fillText('A', -35, -12);
    ctx.fillText('F', 35, -12);
    
    ctx.restore();
}

function drawVFD(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#16A085';
    ctx.lineWidth = 2;
    
    // Rectangle
    ctx.strokeRect(-35, -30, 70, 60);
    
    // AC to DC converter (left side)
    ctx.font = '12px Arial';
    ctx.fillStyle = '#16A085';
    ctx.fillText('~', -25, -5);
    ctx.fillText('=', -25, 8);
    
    // DC to AC inverter (right side)
    ctx.fillText('=', 10, -5);
    ctx.fillText('~', 10, 8);
    
    // Input terminals (L1, L2, L3)
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-35, i * 15);
        ctx.lineTo(-40, i * 15);
        ctx.stroke();
    }
    
    // Output terminals (U, V, W)
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(35, i * 15);
        ctx.lineTo(40, i * 15);
        ctx.stroke();
    }
    
    // Rating
    ctx.fillStyle = '#333';
    ctx.font = '9px Arial';
    const text = properties.power;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 25);
    
    ctx.restore();
}

// ==================== TRANSFORMERS ====================

function drawTransformer1Phase(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#E74C3C';
    ctx.lineWidth = 2;
    
    // Primary coil
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(-15, -10 + i * 10, 5, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Secondary coil
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(15, -10 + i * 10, 5, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Core (two vertical lines)
    ctx.beginPath();
    ctx.moveTo(-5, -20);
    ctx.lineTo(-5, 20);
    ctx.moveTo(5, -20);
    ctx.lineTo(5, 20);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-20, -10);
    ctx.lineTo(-40, -10);
    ctx.moveTo(-20, 10);
    ctx.lineTo(-40, 10);
    ctx.moveTo(20, -10);
    ctx.lineTo(40, -10);
    ctx.moveTo(20, 10);
    ctx.lineTo(40, 10);
    ctx.stroke();
    
    // Rating
    ctx.fillStyle = '#333';
    ctx.font = '9px Arial';
    const text = properties.power;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 35);
    
    ctx.restore();
}

function drawTransformer3Phase(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#C0392B';
    ctx.lineWidth = 2;
    
    // Three transformer symbols side by side
    for (let phase = -1; phase <= 1; phase++) {
        const offsetY = phase * 20;
        
        // Primary coil (simplified)
        ctx.beginPath();
        ctx.arc(-20, offsetY, 6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Secondary coil
        ctx.beginPath();
        ctx.arc(20, offsetY, 6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Terminals
        ctx.beginPath();
        ctx.moveTo(-26, offsetY);
        ctx.lineTo(-40, offsetY);
        ctx.moveTo(26, offsetY);
        ctx.lineTo(40, offsetY);
        ctx.stroke();
    }
    
    // Core
    ctx.strokeRect(-8, -28, 16, 56);
    
    // Rating
    ctx.fillStyle = '#333';
    ctx.font = '9px Arial';
    const text = properties.power;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 42);
    
    ctx.restore();
}

function drawCT(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#D35400';
    ctx.lineWidth = 2;
    
    // Toroidal core
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();
    
    // Primary conductor (straight line through center)
    ctx.beginPath();
    ctx.moveTo(-28, 0);
    ctx.lineTo(28, 0);
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Secondary terminals
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, 30);
    ctx.moveTo(0, -20);
    ctx.lineTo(0, -30);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('CT', -8, 5);
    
    // Ratio
    ctx.font = '9px Arial';
    const text = properties.ratio;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, -28);
    
    ctx.restore();
}

function drawPT(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#E67E22';
    ctx.lineWidth = 2;
    
    // Standard transformer symbol (small)
    // Primary
    ctx.beginPath();
    ctx.arc(-10, -5, 4, 0, Math.PI * 2);
    ctx.arc(-10, 5, 4, 0, Math.PI * 2);
    ctx.stroke();
    
    // Secondary
    ctx.beginPath();
    ctx.arc(10, -5, 4, 0, Math.PI * 2);
    ctx.arc(10, 5, 4, 0, Math.PI * 2);
    ctx.stroke();
    
    // Core
    ctx.beginPath();
    ctx.moveTo(-2, -12);
    ctx.lineTo(-2, 12);
    ctx.moveTo(2, -12);
    ctx.lineTo(2, 12);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-14, -8);
    ctx.lineTo(-35, -8);
    ctx.moveTo(-14, 8);
    ctx.lineTo(-35, 8);
    ctx.moveTo(14, -8);
    ctx.lineTo(35, -8);
    ctx.moveTo(14, 8);
    ctx.lineTo(35, 8);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('PT', -8, -15);
    
    // Ratio
    ctx.font = '8px Arial';
    const text = properties.ratio;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 25);
    
    ctx.restore();
}

// ==================== SWITCHES & CONTROLS ====================

function drawContactor(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#2980B9';
    ctx.lineWidth = 2;
    
    // Main contacts (center)
    ctx.beginPath();
    ctx.moveTo(-10, -20);
    ctx.lineTo(5, -10);
    ctx.moveTo(5, -10);
    ctx.lineTo(5, -5);
    ctx.moveTo(-10, 20);
    ctx.lineTo(-10, 25);
    ctx.stroke();
    
    // Coil (left side) - rectangle
    ctx.strokeRect(-35, -20, 15, 40);
    
    // Coil terminals
    ctx.beginPath();
    ctx.moveTo(-35, -20);
    ctx.lineTo(-40, -20);
    ctx.moveTo(-35, 20);
    ctx.lineTo(-40, 20);
    ctx.stroke();
    
    // Main contact terminals
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(0, -30);
    ctx.moveTo(0, 25);
    ctx.lineTo(0, 30);
    ctx.stroke();
    
    // Auxiliary contact (right)
    ctx.beginPath();
    ctx.moveTo(30, -15);
    ctx.lineTo(35, -10);
    ctx.moveTo(30, 15);
    ctx.lineTo(30, 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(35, -15);
    ctx.lineTo(40, -15);
    ctx.moveTo(35, 15);
    ctx.lineTo(40, 15);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '8px Arial';
    ctx.fillText('A1', -42, -18);
    ctx.fillText('A2', -42, 22);
    ctx.fillText('K', -12, 0);
    
    ctx.restore();
}

function drawRelay(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#3498DB';
    ctx.lineWidth = 1.5;
    
    // Coil (rectangle)
    ctx.strokeRect(-25, -15, 20, 30);
    
    // Coil terminals
    ctx.beginPath();
    ctx.moveTo(-25, -10);
    ctx.lineTo(-30, -10);
    ctx.moveTo(-25, 10);
    ctx.lineTo(-30, 10);
    ctx.stroke();
    
    // Contact set (NC and NO)
    // Common
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(20, -10);
    ctx.stroke();
    
    // NO contact
    ctx.beginPath();
    ctx.moveTo(20, -15);
    ctx.lineTo(30, -15);
    ctx.stroke();
    
    // NC contact
    ctx.beginPath();
    ctx.moveTo(20, 10);
    ctx.lineTo(30, 10);
    ctx.stroke();
    
    // Common terminal
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(10, 5);
    ctx.moveTo(10, 5);
    ctx.lineTo(30, 5);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '7px Arial';
    ctx.fillText('A1', -30, -12);
    ctx.fillText('A2', -30, 12);
    
    ctx.restore();
}

function drawPushButtonNO(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = properties.color === 'Green' ? '#27AE60' : '#E74C3C';
    ctx.lineWidth = 2;
    
    // Contacts (NO - normally open)
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-5, 0);
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, -10);
    ctx.moveTo(5, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    
    // Push button actuator (above)
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, -15);
    ctx.moveTo(-8, -15);
    ctx.lineTo(8, -15);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-25, 0);
    ctx.moveTo(20, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();
    
    // Circle around actuator
    ctx.beginPath();
    ctx.arc(0, -15, 5, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
}

function drawPushButtonNC(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = properties.color === 'Red' ? '#E74C3C' : '#27AE60';
    ctx.lineWidth = 2;
    
    // Contacts (NC - normally closed)
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-5, 0);
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.moveTo(5, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    
    // Diagonal line through contact
    ctx.beginPath();
    ctx.moveTo(-5, -5);
    ctx.lineTo(5, -10);
    ctx.stroke();
    
    // Push button actuator
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, -15);
    ctx.moveTo(-8, -15);
    ctx.lineTo(8, -15);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-25, 0);
    ctx.moveTo(20, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, -15, 5, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
}

function drawLimitSwitch(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#95A5A6';
    ctx.lineWidth = 2;
    
    // Contact
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-5, 0);
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, -8);
    ctx.moveTo(5, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    
    // Mechanical actuator (lever)
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(10, -18);
    ctx.arc(10, -18, 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // Base rectangle
    ctx.strokeRect(-8, 5, 16, 8);
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-25, 0);
    ctx.moveTo(20, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();
    
    ctx.restore();
}

function drawSelectorSwitch(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#34495E';
    ctx.lineWidth = 2;
    
    // Common point (movable contact)
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Selector arm
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15, -15);
    ctx.stroke();
    
    // Position 1 contact
    ctx.beginPath();
    ctx.arc(-18, -18, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.moveTo(-18, -18);
    ctx.lineTo(-25, -18);
    ctx.stroke();
    
    // Position 2 contact
    ctx.beginPath();
    ctx.arc(18, -18, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.moveTo(18, -18);
    ctx.lineTo(25, -18);
    ctx.stroke();
    
    // Common terminal
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.lineTo(0, 25);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '8px Arial';
    ctx.fillText('1', -28, -15);
    ctx.fillText('2', 22, -15);
    
    ctx.restore();
}

// ==================== MEASUREMENT ====================

function drawWattmeter(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#16A085';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // W symbol
    ctx.fillStyle = '#16A085';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('W', -8, 7);
    
    // Voltage terminals (left)
    ctx.strokeStyle = '#16A085';
    ctx.beginPath();
    ctx.moveTo(-20, -10);
    ctx.lineTo(-30, -10);
    ctx.moveTo(-20, 10);
    ctx.lineTo(-30, 10);
    ctx.stroke();
    
    // Current terminals (right)
    ctx.beginPath();
    ctx.moveTo(20, -10);
    ctx.lineTo(30, -10);
    ctx.moveTo(20, 10);
    ctx.lineTo(30, 10);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '7px Arial';
    ctx.fillText('V', -28, -12);
    ctx.fillText('I', 28, -12);
    
    ctx.restore();
}

function drawMultimeter(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#E67E22';
    ctx.lineWidth = 2;
    
    // Rectangle body
    ctx.strokeRect(-20, -25, 40, 50);
    
    // Display
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(-15, -20, 30, 15);
    
    // Display text
    ctx.fillStyle = '#2ECC71';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('888.8', -14, -9);
    
    // Dial (rotary switch)
    ctx.strokeStyle = '#E67E22';
    ctx.beginPath();
    ctx.arc(0, 8, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-10, 25);
    ctx.lineTo(-10, 30);
    ctx.moveTo(10, 25);
    ctx.lineTo(10, 30);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '7px Arial';
    ctx.fillText('COM', -15, 23);
    ctx.fillText('VΩA', 5, 23);
    
    ctx.restore();
}

// ==================== PASSIVE COMPONENTS (Additional) ====================

function drawHeater(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#E74C3C';
    ctx.lineWidth = 2;
    
    // Zigzag heating element
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    const segments = 8;
    const segmentWidth = 50 / segments;
    for (let i = 0; i <= segments; i++) {
        const x = -25 + i * segmentWidth;
        const y = (i % 2 === 0) ? -8 : 8;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-30, 0);
    ctx.moveTo(25, 8);
    ctx.lineTo(30, 8);
    ctx.stroke();
    
    // Power rating
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    const text = properties.power;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 20);
    
    ctx.restore();
}

function drawLamp(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#F39C12';
    ctx.lineWidth = 2;
    
    // Bulb circle
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Filament (X inside)
    ctx.beginPath();
    ctx.moveTo(-8, -8);
    ctx.lineTo(8, 8);
    ctx.moveTo(-8, 8);
    ctx.lineTo(8, -8);
    ctx.stroke();
    
    // Light rays
    const rays = 6;
    for (let i = 0; i < rays; i++) {
        const angle = (i * 360 / rays) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 17, Math.sin(angle) * 17);
        ctx.lineTo(Math.cos(angle) * 22, Math.sin(angle) * 22);
        ctx.stroke();
    }
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(0, 25);
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -25);
    ctx.stroke();
    
    // Power
    ctx.fillStyle = '#333';
    ctx.font = '9px Arial';
    const text = properties.power;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, 35);
    
    ctx.restore();
}

// ==================== SEMICONDUCTORS (Additional) ====================

function drawSCR(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#9B59B6';
    ctx.fillStyle = '#9B59B6';
    ctx.lineWidth = 2;
    
    // Diode symbol (triangle and line)
    ctx.beginPath();
    ctx.moveTo(-10, -8);
    ctx.lineTo(-10, 8);
    ctx.lineTo(5, 0);
    ctx.closePath();
    ctx.fill();
    
    // Cathode line
    ctx.beginPath();
    ctx.moveTo(5, -8);
    ctx.lineTo(5, 8);
    ctx.stroke();
    
    // Gate terminal
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(0, 20);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-25, 0);
    ctx.moveTo(5, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '8px Arial';
    ctx.fillText('A', -22, -5);
    ctx.fillText('K', 18, -5);
    ctx.fillText('G', 2, 28);
    
    ctx.restore();
}

function drawTRIAC(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#8E44AD';
    ctx.fillStyle = '#8E44AD';
    ctx.lineWidth = 2;
    
    // Two diodes in anti-parallel
    // Diode 1 (up)
    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.lineTo(-8, -2);
    ctx.lineTo(3, -6);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(3, -10);
    ctx.lineTo(3, -2);
    ctx.stroke();
    
    // Diode 2 (down)
    ctx.beginPath();
    ctx.moveTo(3, 2);
    ctx.lineTo(3, 10);
    ctx.lineTo(-8, 6);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-8, 2);
    ctx.lineTo(-8, 10);
    ctx.stroke();
    
    // Gate terminal
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(12, 18);
    ctx.stroke();
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-8, -6);
    ctx.lineTo(-25, -6);
    ctx.moveTo(3, 6);
    ctx.lineTo(25, 6);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '7px Arial';
    ctx.fillText('MT1', -25, -8);
    ctx.fillText('MT2', 18, 8);
    ctx.fillText('G', 13, 22);
    
    ctx.restore();
}

// ==================== INTEGRATED CIRCUITS (Additional) ====================

function drawPLC(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    
    // Main body
    ctx.strokeRect(-35, -35, 70, 70);
    
    // PLC label
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('PLC', -15, 5);
    
    // Input terminals (left)
    for (let i = 0; i < 4; i++) {
        const y = -30 + i * 20;
        ctx.beginPath();
        ctx.moveTo(-35, y);
        ctx.lineTo(-40, y);
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.font = '7px Arial';
        ctx.fillText(`I${i}`, -33, y + 3);
    }
    
    // Output terminals (right)
    for (let i = 0; i < 4; i++) {
        const y = -30 + i * 20;
        ctx.beginPath();
        ctx.moveTo(35, y);
        ctx.lineTo(40, y);
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.font = '7px Arial';
        ctx.fillText(`Q${i}`, 25, y + 3);
    }
    
    // Status LEDs
    ctx.fillStyle = '#2ECC71';
    ctx.beginPath();
    ctx.arc(-10, -25, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.arc(10, -25, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// ==================== SPECIAL (Additional) ====================

function drawEarth(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#27AE60';
    ctx.lineWidth = 2.5;
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, 0);
    ctx.stroke();
    
    // Three horizontal lines (earth symbol)
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.moveTo(-8, 5);
    ctx.lineTo(8, 5);
    ctx.moveTo(-4, 10);
    ctx.lineTo(4, 10);
    ctx.stroke();
    
    // Terminal
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -20);
    ctx.stroke();
    
    // PE label
    ctx.fillStyle = '#27AE60';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('PE', -8, 22);
    
    ctx.restore();
}

function drawJunction(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.fillStyle = '#2C3E50';
    
    // Junction dot
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawBusbar(ctx, x, y, rotation, properties) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.strokeStyle = '#95A5A6';
    ctx.fillStyle = '#BDC3C7';
    ctx.lineWidth = 3;
    
    // Thick horizontal bar
    ctx.fillRect(-40, -6, 80, 12);
    ctx.strokeRect(-40, -6, 80, 12);
    
    // Connection points
    for (let i = -2; i <= 2; i++) {
        const x = i * 20;
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, -6);
        ctx.lineTo(x, 6);
        ctx.stroke();
    }
    
    // Rating label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 9px Arial';
    const text = properties.rating;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, -12);
    
    ctx.restore();
}
