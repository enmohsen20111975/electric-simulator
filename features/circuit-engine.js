// Circuit Simulator Engine - Canvas-based Interactive Designer
// Integrated with Python/FastAPI Backend

const API_BASE = 'http://127.0.0.1:8081/api';
let authToken = null;
let currentUser = null;

// Canvas and State
let canvas, ctx;
let state = {
    components: [],
    wires: [],
    selectedComponent: null,
    selectedWire: null,
    tool: 'select',
    isDragging: false,
    isWiring: false,
    wireStart: null,
    mousePos: { x: 0, y: 0 },
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    simulationRunning: false,
    simulationResults: null,
    dragOffset: { x: 0, y: 0 }
};

// Component Definitions (compatible with existing code)
let COMPONENT_DEFS = {};

// Initialize
window.onload = function() {
    canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    ctx = canvas.getContext('2d');
    
    // Initialize component definitions
    initializeComponents();
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    
    // Check for saved token
    const savedToken = localStorage.getItem('authToken');
    if(savedToken) {
        authToken = savedToken;
        checkAuth();
    }
    
    // Bind toolbar buttons
    bindToolbarButtons();
    
    render();
    console.log('✓ Circuit engine initialized');
};

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Initialize Component Definitions
function initializeComponents() {
    // Use PROFESSIONAL_COMPONENTS from professional-circuit-engine.js
    if (typeof PROFESSIONAL_COMPONENTS !== 'undefined') {
        COMPONENT_DEFS = PROFESSIONAL_COMPONENTS;
        console.log('✓ Loaded components from professional-circuit-engine.js');
    } else if (typeof CIRCUIT_COMPONENT_DEFS !== 'undefined') {
        COMPONENT_DEFS = CIRCUIT_COMPONENT_DEFS;
        console.log('✓ Loaded components from circuit-components.js');
    } else {
        // Fallback definitions with proper circuit symbols
        COMPONENT_DEFS = {
            resistor: {
                label: 'Resistor',
                symbol: 'R',
                props: { resistance: 1000, power: 0.25 },
                terminals: 2,
                draw: drawResistor
            },
            capacitor: {
                label: 'Capacitor',
                symbol: 'C',
                props: { capacitance: 0.0001, voltage: 16 },
                terminals: 2,
                draw: drawCapacitor
            },
            inductor: {
                label: 'Inductor',
                symbol: 'L',
                props: { inductance: 0.001 },
                terminals: 2,
                draw: drawInductor
            },
            battery: {
                label: 'Battery',
                symbol: 'V',
                props: { voltage: 9 },
                terminals: 2,
                draw: drawBattery
            },
            led: {
                label: 'LED',
                symbol: 'LED',
                props: { forwardVoltage: 2.0, color: '#ff0000' },
                terminals: 2,
                draw: drawLED
            },
            diode: {
                label: 'Diode',
                symbol: 'D',
                props: { forwardVoltage: 0.7 },
                terminals: 2,
                draw: drawDiode
            },
            transistor: {
                label: 'Transistor (NPN)',
                symbol: 'Q',
                props: { hfe: 100, vce: 40 },
                terminals: 3,
                draw: drawTransistor
            },
            opamp: {
                label: 'Op-Amp',
                symbol: 'U',
                props: { gain: 100000 },
                terminals: 3,
                draw: drawOpAmp
            },
            switch: {
                label: 'Switch',
                symbol: 'SW',
                props: { closed: false },
                terminals: 2,
                draw: drawSwitch
            },
            voltmeter: {
                label: 'Voltmeter',
                symbol: 'V',
                props: { range: 20 },
                terminals: 2,
                draw: drawVoltmeter
            },
            ammeter: {
                label: 'Ammeter',
                symbol: 'A',
                props: { range: 1 },
                terminals: 2,
                draw: drawAmmeter
            },
            ground: {
                label: 'Ground',
                symbol: 'GND',
                props: {},
                terminals: 1,
                draw: drawGround
            }
        };
        console.log('✓ Using fallback component definitions');
    }
}

// Bind toolbar buttons to component placement
function bindToolbarButtons() {
    // Tool buttons
    const toolButtons = document.querySelectorAll('[data-type]');
    toolButtons.forEach(btn => {
        const type = btn.getAttribute('data-type');
        btn.onclick = () => selectTool(type);
    });
}

// Tool Selection
function selectTool(tool) {
    state.tool = tool;
    document.querySelectorAll('.component-item').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Find and select the clicked button
    const btn = document.querySelector(`[data-type="${tool}"]`);
    if (btn) {
        btn.classList.add('selected');
    }
    
    canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
    console.log('Selected tool:', tool);
}

// Mouse Handlers
function handleMouseDown(e) {
    const pos = getMousePos(e);
    
    if (state.tool === 'select') {
        const comp = getComponentAt(pos);
        if (comp) {
            state.selectedComponent = comp;
            state.isDragging = true;
            state.dragOffset = {
                x: pos.x - comp.x,
                y: pos.y - comp.y
            };
            updatePropertiesPanel();
        } else {
            state.selectedComponent = null;
            updatePropertiesPanel();
        }
    } else if (state.tool === 'wire') {
        const comp = getComponentAt(pos);
        if (comp) {
            if (!state.isWiring) {
                state.isWiring = true;
                state.wireStart = { comp, terminal: getNearestTerminal(comp, pos) };
            } else {
                // Complete wire
                const terminal = getNearestTerminal(comp, pos);
                if (state.wireStart.comp !== comp) {
                    state.wires.push({
                        id: Date.now(),
                        from: state.wireStart,
                        to: { comp, terminal }
                    });
                }
                state.isWiring = false;
                state.wireStart = null;
            }
        }
    } else {
        // Place component
        createComponent(state.tool, pos.x, pos.y);
        selectTool('select');
    }
}

function handleMouseMove(e) {
    const pos = getMousePos(e);
    state.mousePos = pos;
    
    if (state.isDragging && state.selectedComponent) {
        state.selectedComponent.x = pos.x - state.dragOffset.x;
        state.selectedComponent.y = pos.y - state.dragOffset.y;
        snapToGrid(state.selectedComponent);
    }
}

function handleMouseUp(e) {
    state.isDragging = false;
}

function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    zoom(delta);
}

// Component Creation
function createComponent(type, x, y) {
    const def = COMPONENT_DEFS[type];
    if (!def) {
        console.warn('Unknown component type:', type);
        return;
    }
    
    // Handle both PROFESSIONAL_COMPONENTS and legacy COMPONENT_DEFS structures
    let props, terminals;

    if (def.properties) {
        // PROFESSIONAL_COMPONENTS structure
        props = {};
        for (const [key, val] of Object.entries(def.properties)) {
            props[key] = val.value;
        }

        // Convert ports to terminals
        terminals = def.ports ? def.ports.map(port => ({
            x: port.x,
            y: port.y,
            id: port.id
        })) : Array(2).fill(0).map((_, i) => ({
            x: i === 0 ? -30 : 30,
            y: 0
        }));
    } else {
        // Legacy COMPONENT_DEFS structure
        props = { ...def.props };
        terminals = Array(def.terminals).fill(0).map((_, i) => ({
            x: i === 0 ? -30 : 30,
            y: 0
        }));
    }

    const component = {
        id: Date.now(),
        type,
        x: Math.round(x / 20) * 20,
        y: Math.round(y / 20) * 20,
        rotation: 0,
        props: props,
        terminals: terminals
    };
    
    state.components.push(component);
    state.selectedComponent = component;
    updatePropertiesPanel();
    console.log('Created component:', type, 'at', component.x, component.y);
}

function getComponentAt(pos) {
    for (let i = state.components.length - 1; i >= 0; i--) {
        const c = state.components[i];
        const distance = Math.hypot(pos.x - c.x, pos.y - c.y);
        if (distance < 40) return c;
    }
    return null;
}

function getNearestTerminal(comp, pos) {
    let nearest = 0;
    let minDist = Infinity;
    
    comp.terminals.forEach((term, idx) => {
        const tx = comp.x + term.x;
        const ty = comp.y + term.y;
        const dist = Math.hypot(pos.x - tx, pos.y - ty);
        if (dist < minDist) {
            minDist = dist;
            nearest = idx;
        }
    });
    
    return nearest;
}

function snapToGrid(comp) {
    comp.x = Math.round(comp.x / 20) * 20;
    comp.y = Math.round(comp.y / 20) * 20;
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left - state.offsetX) / state.scale,
        y: (e.clientY - rect.top - state.offsetY) / state.scale
    };
}

// Rendering
function render() {
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(state.offsetX, state.offsetY);
    ctx.scale(state.scale, state.scale);
    
    // Draw wires
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    state.wires.forEach(wire => {
        const fromPos = getTerminalPos(wire.from.comp, wire.from.terminal);
        const toPos = getTerminalPos(wire.to.comp, wire.to.terminal);
        
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
    });
    
    // Draw wire in progress
    if (state.isWiring && state.wireStart) {
        const fromPos = getTerminalPos(state.wireStart.comp, state.wireStart.terminal);
        ctx.strokeStyle = '#f59e0b';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(state.mousePos.x, state.mousePos.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw components
    state.components.forEach(comp => {
        ctx.save();
        ctx.translate(comp.x, comp.y);
        ctx.rotate(comp.rotation);
        
        const def = COMPONENT_DEFS[comp.type];
        if (def && def.draw) {
            def.draw(ctx, comp);
        }
        
        // Draw terminals
        if (comp.terminals) {
            comp.terminals.forEach(term => {
                ctx.fillStyle = '#1e40af';
                ctx.beginPath();
                ctx.arc(term.x, term.y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // Selection highlight
        if (comp === state.selectedComponent) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(-40, -40, 80, 80);
            ctx.setLineDash([]);
        }
        
        ctx.restore();
    });
    
    ctx.restore();
    requestAnimationFrame(render);
}

function getTerminalPos(comp, terminal) {
    const term = comp.terminals[terminal];
    return {
        x: comp.x + term.x,
        y: comp.y + term.y
    };
}

// Component Drawing Functions
function drawResistor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(-20 + i * 8, (i % 2) * 10 - 5);
    }
    ctx.lineTo(30, 0);
    ctx.stroke();
    
    // Label
    if (comp && comp.props) {
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((comp.props.resistance || 1000) + 'Ω', 0, -15);
    }
}

function drawCapacitor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-5, 0);
    ctx.moveTo(-5, -15);
    ctx.lineTo(-5, 15);
    ctx.moveTo(5, -15);
    ctx.lineTo(5, 15);
    ctx.moveTo(5, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    
    // Label
    if (comp && comp.props) {
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        const capValue = (comp.props.capacitance || 0.0001) * 1000000;
        ctx.fillText(capValue.toFixed(1) + 'µF', 0, -20);
    }
}

function drawInductor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-15, 0);
    for (let i = 0; i < 3; i++) {
        ctx.arc(-10 + i * 10, 0, 5, Math.PI, 0, false);
    }
    ctx.lineTo(30, 0);
    ctx.stroke();
}

function drawBattery(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-10, 0);
    ctx.moveTo(-10, -15);
    ctx.lineTo(-10, 15);
    ctx.moveTo(10, -10);
    ctx.lineTo(10, 10);
    ctx.moveTo(10, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    
    // Label
    if (comp && comp.props) {
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((comp.props.voltage || 9) + 'V', 0, -20);
    }
}

function drawLED(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.fillStyle = (comp && comp.props && comp.props.color) ? comp.props.color : '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, -10);
    ctx.lineTo(-15, 10);
    ctx.lineTo(5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(5, -10);
    ctx.lineTo(5, 10);
    ctx.stroke();
    
    // Light rays
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, -10);
    ctx.lineTo(15, -15);
    ctx.moveTo(10, -5);
    ctx.lineTo(15, -10);
    ctx.stroke();
}

function drawDiode(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, -10);
    ctx.lineTo(-15, 10);
    ctx.lineTo(5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(5, -10);
    ctx.lineTo(5, 10);
    ctx.stroke();
}

function drawGround(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 0);
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.moveTo(-10, 5);
    ctx.lineTo(10, 5);
    ctx.moveTo(-5, 10);
    ctx.lineTo(5, 10);
    ctx.stroke();
}

// Properties Panel
function updatePropertiesPanel() {
    const panel = document.getElementById('propertiesContent');
    
    if (!panel) {
        console.warn('Properties panel not found');
        return;
    }
    
    if (!state.selectedComponent) {
        panel.innerHTML = '<p style="color: #999; font-size: 13px;">Select a component to view properties</p>';
        return;
    }
    
    const comp = state.selectedComponent;
    const def = COMPONENT_DEFS[comp.type];
    
    if (!def) {
        panel.innerHTML = '<p style="color: #999; font-size: 13px;">Unknown component type</p>';
        return;
    }
    
    let html = `<div style="margin-bottom: 15px;"><strong>${def.label}</strong></div>`;
    
    if (comp.props && Object.keys(comp.props).length > 0) {
        Object.keys(comp.props).forEach(key => {
            const value = comp.props[key];
            const inputType = typeof value === 'string' ? 'text' : 'number';
            
            html += `
                <div class="property-row" style="margin-bottom: 10px;">
                    <div class="property-label" style="font-size: 12px; color: #666; margin-bottom: 4px;">${key}:</div>
                    <input type="${inputType}" 
                           class="property-input" 
                           style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;" 
                           value="${value}" 
                           onchange="updateComponentProp('${key}', this.value, '${inputType}')">
                </div>
            `;
        });
    } else {
        html += '<p style="color: #999; font-size: 12px;">No properties</p>';
    }
    
    html += `<button class="btn btn-danger" onclick="deleteComponent()" style="width: 100%; margin-top: 15px; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete Component</button>`;
    
    panel.innerHTML = html;
}

function updateComponentProp(key, value, type) {
    if (state.selectedComponent && state.selectedComponent.props) {
        if (type === 'number') {
            state.selectedComponent.props[key] = parseFloat(value) || 0;
        } else {
            state.selectedComponent.props[key] = value;
        }
        console.log('Updated property:', key, '=', value);
    }
}

function deleteComponent() {
    if (state.selectedComponent) {
        state.components = state.components.filter(c => c !== state.selectedComponent);
        state.wires = state.wires.filter(w => 
            w.from.comp !== state.selectedComponent && w.to.comp !== state.selectedComponent
        );
        state.selectedComponent = null;
        updatePropertiesPanel();
    }
}

// Circuit Operations
function newCircuit() {
    if (confirm('Clear current circuit?')) {
        state.components = [];
        state.wires = [];
        state.selectedComponent = null;
        updatePropertiesPanel();
    }
}

async function saveCircuit() {
    if (!authToken) {
        alert('Please login to save circuits');
        showLoginModal();
        return;
    }
    
    const name = prompt('Circuit name:');
    if (!name) return;
    
    try {
        const response = await fetch(`${API_BASE}/circuits/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name,
                description: '',
                components: state.components,
                wires: state.wires,
                settings: { zoom: state.scale, offset: state.offset }
            })
        });
        
        if (response.ok) {
            alert('Circuit saved successfully!');
        } else {
            alert('Failed to save circuit');
        }
    } catch (error) {
        console.error('Save error:', error);
        alert('Error saving circuit');
    }
}

async function loadCircuit() {
    if (!authToken) {
        alert('Please login to load circuits');
        showLoginModal();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/circuits/`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const circuits = await response.json();
        
        if (circuits.length === 0) {
            alert('No saved circuits found');
            return;
        }
        
        const list = circuits.map((c, i) => `${i + 1}. ${c.name}`).join('\n');
        const index = prompt(`Select circuit:\n${list}\n\nEnter number:`);
        
        if (index && circuits[parseInt(index) - 1]) {
            const circuit = circuits[parseInt(index) - 1];
            const detailResponse = await fetch(`${API_BASE}/circuits/${circuit.id}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            const data = await detailResponse.json();
            state.components = data.components || [];
            state.wires = data.wires || [];
            alert('Circuit loaded!');
        }
    } catch (error) {
        console.error('Load error:', error);
        alert('Error loading circuit');
    }
}

function resetCanvas() {
    state.scale = 1;
    state.offsetX = 0;
    state.offsetY = 0;
    console.log('Canvas reset');
}

function zoom(delta) {
    state.scale = Math.max(0.5, Math.min(2, state.scale + delta));
    console.log('Zoom:', state.scale.toFixed(2));
}

// Simulation
async function runSimulation() {
    if (!authToken) {
        alert('Please login to run simulations');
        showLoginModal();
        return;
    }
    
    // First save the circuit temporarily
    const tempCircuit = {
        name: 'temp_simulation',
        description: 'Temporary circuit for simulation',
        components: state.components,
        wires: state.wires
    };
    
    try {
        const createResponse = await fetch(`${API_BASE}/circuits/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(tempCircuit)
        });
        
        const circuit = await createResponse.json();
        
        // Run simulation
        const simResponse = await fetch(`${API_BASE}/simulation/${circuit.id}/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                simulation_type: 'dc',
                duration: 1.0,
                time_step: 0.001
            })
        });
        
        const results = await simResponse.json();
        state.simulationResults = results;
        state.simulationRunning = true;
        
        // Update measurements
        document.getElementById('voltageDisplay').textContent = 
            results.results?.voltages ? Object.values(results.results.voltages)[0]?.toFixed(2) + 'V' : '--';
        document.getElementById('currentDisplay').textContent = 
            results.results?.currents ? Object.values(results.results.currents)[0]?.toFixed(3) + 'A' : '--';
        
        alert('Simulation completed!');
    } catch (error) {
        console.error('Simulation error:', error);
        alert('Simulation failed');
    }
}

function stopSimulation() {
    state.simulationRunning = false;
    state.simulationResults = null;
}

// Authentication
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.access_token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            closeModal('loginModal');
            alert('Login successful!');
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login error');
    }
}

async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            currentUser = await response.json();
        } else {
            authToken = null;
            localStorage.removeItem('authToken');
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

// Additional Component Drawing Functions
function drawTransistor(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.lineWidth = 2;
    
    // Base line
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-5, 0);
    ctx.moveTo(-5, -15);
    ctx.lineTo(-5, 15);
    ctx.stroke();
    
    // Collector
    ctx.beginPath();
    ctx.moveTo(-5, -10);
    ctx.lineTo(10, -20);
    ctx.lineTo(10, -30);
    ctx.stroke();
    
    // Emitter with arrow
    ctx.beginPath();
    ctx.moveTo(-5, 10);
    ctx.lineTo(10, 20);
    ctx.lineTo(10, 30);
    ctx.stroke();
    
    // Arrow
    ctx.beginPath();
    ctx.moveTo(10, 20);
    ctx.lineTo(6, 15);
    ctx.moveTo(10, 20);
    ctx.lineTo(5, 19);
    ctx.stroke();
}

function drawOpAmp(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Triangle
    ctx.beginPath();
    ctx.moveTo(-20, -20);
    ctx.lineTo(-20, 20);
    ctx.lineTo(20, 0);
    ctx.closePath();
    ctx.stroke();
    
    // + and - symbols
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('+', -15, 12);
    ctx.fillText('-', -15, -8);
    
    // Terminals
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.lineTo(-20, 10);
    ctx.moveTo(-25, -10);
    ctx.lineTo(-20, -10);
    ctx.moveTo(20, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
}

function drawSwitch(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    const closed = comp && comp.props && comp.props.closed;
    
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-10, 0);
    ctx.stroke();
    
    // Switch contact
    ctx.beginPath();
    if (closed) {
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
    } else {
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, -8);
    }
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    
    // Contact points
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-10, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, 0, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawVoltmeter(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // V symbol
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V', 0, 0);
    
    // Terminals
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -25);
    ctx.moveTo(0, 15);
    ctx.lineTo(0, 25);
    ctx.stroke();
}

function drawAmmeter(ctx, comp) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // A symbol
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', 0, 0);
    
    // Terminals
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -25);
    ctx.moveTo(0, 15);
    ctx.lineTo(0, 25);
    ctx.stroke();
}
