// Professional Circuit Simulator Engine
// IEEE/IEC Standard Symbols | Smart Wire Routing | Professional Grade
// Multi-Domain Architecture: Electrical Control | Electronics | Digital Logic

const API_BASE = 'http://127.0.0.1:8081/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Unified component library - no domain switching needed

// Core State
const state = {
    components: [],
    wires: [],
    wireJunctions: [], // MANUAL junction points only - user must explicitly add
    manualJunctions: [], // Explicitly added connection points {x, y, connectedWires: []}
    nodes: new Map(), // Electrical nodes (connection points)
    selectedComponent: null,
    selectedWire: null,
    tool: 'select',
    isDragging: false,
    isDraggingWaypoint: false,
    draggedWaypointIndex: null,
    dragStart: null,
    wireStart: null,
    wireEnd: null,
    isWiring: false,
    mousePos: { x: 0, y: 0 },
    gridSize: 10,
    snapToGrid: true,
    zoom: 1.0,
    panOffset: { x: 0, y: 0 },
    isPanning: false,
    simulationRunning: false,
    componentCounter: 1,
    showRoutingDebug: false, // Toggle to show wire routing clearance zones
    showWireDebug: false, // Toggle to show wire IDs for debugging
    currentWireColor: '#2563eb', // Default blue wire color
    wireColors: {
        blue: '#2563eb',
        red: '#dc2626',
        green: '#16a34a',
        yellow: '#eab308',
        black: '#000000',
        orange: '#ea580c',
        purple: '#9333ea',
        brown: '#78350f'
    }
};

// Canvas references
let canvas, ctx;

// IEEE/IEC Standard Component Library
const PROFESSIONAL_COMPONENTS = {};

// Merge Electrical Control Library (loaded from electrical-control-components.js)
if (typeof ELECTRICAL_CONTROL_LIBRARY !== 'undefined') {
    Object.assign(PROFESSIONAL_COMPONENTS, ELECTRICAL_CONTROL_LIBRARY);
    console.log('✓ Electrical Control Library merged:', Object.keys(ELECTRICAL_CONTROL_LIBRARY).length, 'components');
    console.log('✓ Electrical components:', Object.keys(ELECTRICAL_CONTROL_LIBRARY));
} else {
    console.error('❌ ELECTRICAL_CONTROL_LIBRARY not found! Check if electrical-control-components.js is loaded.');
}

// Global instances for new modules
let historyManager = null;
let selectionManager = null;
let circuitCalculator = null;
let particleSystem = null;
let effectManager = null;

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    initializeModules();
    initializeEventListeners();
    populateComponentLibrary();
    startRenderLoop();

    if (authToken) checkAuth();

    console.log('✓ Professional Circuit Simulator initialized');
    console.log('✓ Total components:', Object.keys(PROFESSIONAL_COMPONENTS).length);
});

function initializeModules() {
    // Initialize History Manager for Undo/Redo
    if (typeof UndoRedoManager !== 'undefined') {
        historyManager = new UndoRedoManager(50);
        console.log('✓ UndoRedoManager initialized (50 levels)');
    }

    // Initialize Selection Manager for Copy/Paste
    if (typeof SelectionManager !== 'undefined') {
        selectionManager = new SelectionManager(canvas, state);
        console.log('✓ SelectionManager initialized');
    }

    // Initialize Circuit Calculator
    if (typeof CircuitCalculator !== 'undefined') {
        circuitCalculator = new CircuitCalculator();
        window.circuitCalc = circuitCalculator;
        console.log('✓ CircuitCalculator initialized');
    }

    // Initialize Particle System and Effects
    if (typeof ParticleSystem !== 'undefined' && typeof EffectManager !== 'undefined') {
        particleSystem = new ParticleSystem(1000);
        effectManager = new EffectManager(canvas, particleSystem);
        console.log('✓ ParticleSystem initialized (1000 particles)');
        console.log('✓ EffectManager initialized');
    }
}

function initializeCanvas() {
    canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function initializeEventListeners() {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('contextmenu', handleContextMenu);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function populateComponentLibrary() {
    const categories = {
        sources: { name: '⚡ POWER SOURCES', container: null },
        protection: { name: '🛡️ PROTECTION', container: null },
        control: { name: '🔘 SWITCHES & CONTROLS', container: null },
        grounds: { name: '⏚ GROUNDS', container: null },
        motors: { name: '⚙️ MOTORS & DRIVES', container: null },
        transformers: { name: '🔄 TRANSFORMERS', container: null },
        switching: { name: '🔌 SWITCHING DEVICES', container: null },
        measurement: { name: '📏 MEASUREMENT', container: null },
        passive: { name: '📊 PASSIVE COMPONENTS', container: null },
        semiconductors: { name: '💎 SEMICONDUCTORS', container: null },
        ics: { name: '🔧 INTEGRATED CIRCUITS', container: null },
        digital_gates: { name: '🔲 LOGIC GATES', container: null },
        digital_combinational: { name: '🔀 COMBINATIONAL', container: null },
        digital_sequential: { name: '⏱️ SEQUENTIAL', container: null },
        digital_io: { name: '🔌 IO & CLOCK', container: null },
        special: { name: '⭐ SPECIAL', container: null }
    };

    const panel = document.querySelector('.component-panel');
    if (!panel) return;

    panel.innerHTML = '';

    // Create category sections with collapse functionality
    for (const [key, cat] of Object.entries(categories)) {
        const section = document.createElement('div');
        section.className = 'component-category';

        const title = document.createElement('div');
        title.className = 'category-title';
        title.textContent = cat.name;
        title.onclick = function () {
            this.classList.toggle('collapsed');
            content.style.display = content.style.display === 'none' ? 'grid' : 'none';
        };

        const content = document.createElement('div');
        content.className = 'category-content';

        section.appendChild(title);
        section.appendChild(content);
        panel.appendChild(section);
        categories[key].container = content;
    }

    // Add select and wire tools to special
    categories.special.container.innerHTML = `
        <div class="component-item selected" onclick="window.selectTool('select')" data-type="select">
            🖱️<br>Select
        </div>
        <div class="component-item" onclick="window.selectTool('wire')" data-type="wire">
            📍<br>Wire
        </div>
    `;

    // Populate components from PROFESSIONAL_COMPONENTS
    for (const [type, comp] of Object.entries(PROFESSIONAL_COMPONENTS)) {
        const item = document.createElement('div');
        item.className = 'component-item';
        item.setAttribute('data-type', type);
        item.setAttribute('title', comp.name); // Tooltip
        item.innerHTML = `${comp.symbol}<br><small>${comp.name.split(' ')[0]}</small>`;
        item.onclick = () => window.selectTool(type);

        // Map category aliases
        let category = comp.category;
        if (category === 'switches' || category === 'controls') category = 'switching';
        if (category === 'instruments') category = 'measurement';

        if (categories[category]?.container) {
            categories[category].container.appendChild(item);
        }
    }

    // Populate digital components from DIGITAL_COMPONENTS
    if (typeof DIGITAL_COMPONENTS !== 'undefined') {
        for (const [type, comp] of Object.entries(DIGITAL_COMPONENTS)) {
            const item = document.createElement('div');
            item.className = 'component-item';
            item.setAttribute('data-type', type);
            item.setAttribute('title', comp.name);
            item.innerHTML = `${comp.symbol}<br><small>${comp.name.split(' ')[0]}</small>`;
            item.onclick = () => window.selectTool(type);

            if (categories[comp.category]?.container) {
                categories[comp.category].container.appendChild(item);
            }

            // Convert render to draw for compatibility
            if (comp.render && !comp.draw) {
                comp.draw = comp.render;
            }

            // Convert ports object to ports array for compatibility
            if (comp.ports && !Array.isArray(comp.ports)) {
                const portsArray = [];
                for (const [portId, portData] of Object.entries(comp.ports)) {
                    portsArray.push({
                        id: portId,
                        x: portData.x,
                        y: portData.y,
                        label: portId
                    });
                }
                comp.ports = portsArray;
            }

            // Ensure properties object exists
            if (!comp.properties) {
                comp.properties = {};
            }
        }

        // Merge into PROFESSIONAL_COMPONENTS for unified access
        Object.assign(PROFESSIONAL_COMPONENTS, DIGITAL_COMPONENTS);
    }

    // Populate standard passive components
    if (typeof PASSIVE_COMPONENTS_STANDARD !== 'undefined') {
        for (const [type, comp] of Object.entries(PASSIVE_COMPONENTS_STANDARD)) {
            // Compatibility fixes
            if (comp.render && !comp.draw) comp.draw = comp.render;
            if (comp.ports && !Array.isArray(comp.ports)) {
                const portsArray = [];
                for (const [portId, portData] of Object.entries(comp.ports)) {
                    portsArray.push({ id: portId, x: portData.x, y: portData.y, label: portId });
                }
                comp.ports = portsArray;
            }
            if (!comp.properties) comp.properties = {};

            const item = document.createElement('div');
            item.className = 'component-item';
            item.setAttribute('data-type', type);
            item.setAttribute('title', `${comp.name} (${comp.standard})`);
            item.innerHTML = `${comp.symbol}<br><small>${comp.name.split(' ')[0]}</small>`;
            item.onclick = () => window.selectTool(type);

            if (categories[comp.category]?.container) {
                categories[comp.category].container.appendChild(item);
            }
        }

        Object.assign(PROFESSIONAL_COMPONENTS, PASSIVE_COMPONENTS_STANDARD);
        console.log('✅ Loaded', Object.keys(PASSIVE_COMPONENTS_STANDARD).length, 'standard passive components');
    }

    // Populate standard electronic components
    if (typeof ELECTRONIC_COMPONENTS_STANDARD !== 'undefined') {
        for (const [type, comp] of Object.entries(ELECTRONIC_COMPONENTS_STANDARD)) {
            // Compatibility fixes
            if (comp.render && !comp.draw) comp.draw = comp.render;
            if (comp.ports && !Array.isArray(comp.ports)) {
                const portsArray = [];
                for (const [portId, portData] of Object.entries(comp.ports)) {
                    portsArray.push({ id: portId, x: portData.x, y: portData.y, label: portId });
                }
                comp.ports = portsArray;
            }
            if (!comp.properties) comp.properties = {};

            const item = document.createElement('div');
            item.className = 'component-item';
            item.setAttribute('data-type', type);
            item.setAttribute('title', `${comp.name} (${comp.standard})`);
            item.innerHTML = `${comp.symbol}<br><small>${comp.name.split(' ')[0]}</small>`;
            item.onclick = () => window.selectTool(type);

            if (categories[comp.category]?.container) {
                categories[comp.category].container.appendChild(item);
            }
        }

        Object.assign(PROFESSIONAL_COMPONENTS, ELECTRONIC_COMPONENTS_STANDARD);
        console.log('✅ Loaded', Object.keys(ELECTRONIC_COMPONENTS_STANDARD).length, 'standard electronic components');
    }

    // Integrate Sources Standard
    if (window.SOURCES_STANDARD) {
        for (const [type, comp] of Object.entries(window.SOURCES_STANDARD)) {
            // Compatibility fixes
            if (comp.render && !comp.draw) comp.draw = comp.render;
            if (comp.ports && !Array.isArray(comp.ports)) {
                const portsArray = [];
                for (const [portId, portData] of Object.entries(comp.ports)) {
                    portsArray.push({ id: portId, x: portData.x, y: portData.y, label: portId });
                }
                comp.ports = portsArray;
            }
            if (!comp.properties) comp.properties = {};

            const item = document.createElement('div');
            item.className = 'component-item';
            item.setAttribute('data-type', type);
            item.setAttribute('title', `${comp.name} (${comp.standard})`);
            item.innerHTML = `${comp.symbol}<br><small>${comp.name.split(' ')[0]}</small>`;
            item.onclick = () => window.selectTool(type);

            if (categories[comp.category]?.container) {
                categories[comp.category].container.appendChild(item);
            }
        }

        // Apply render to draw mapping for SOURCES_STANDARD before assigning
        for (const type in SOURCES_STANDARD) {
            if (SOURCES_STANDARD[type].render) {
                SOURCES_STANDARD[type].draw = SOURCES_STANDARD[type].render;
            }
        }
        Object.assign(PROFESSIONAL_COMPONENTS, SOURCES_STANDARD);
        console.log('✅ Loaded', Object.keys(SOURCES_STANDARD).length, 'standard source components');
    }

    // Integrate IC Components Standard
    if (window.IC_COMPONENTS_STANDARD) {
        for (const [type, comp] of Object.entries(window.IC_COMPONENTS_STANDARD)) {
            // Compatibility fixes
            if (comp.render && !comp.draw) comp.draw = comp.render;
            if (comp.ports && !Array.isArray(comp.ports)) {
                const portsArray = [];
                for (const [portId, portData] of Object.entries(comp.ports)) {
                    portsArray.push({ id: portId, x: portData.x, y: portData.y, label: portId });
                }
                comp.ports = portsArray;
            }
            if (!comp.properties) comp.properties = {};

            const item = document.createElement('div');
            item.className = 'component-item';
            item.setAttribute('data-type', type);
            item.setAttribute('title', `${comp.name} (${comp.standard})`);
            item.innerHTML = `${comp.symbol}<br><small>${comp.name.split(' ')[0]}</small>`;
            item.onclick = () => window.selectTool(type);

            if (categories[comp.category]?.container) {
                categories[comp.category].container.appendChild(item);
            }
        }

        // Apply render to draw mapping for IC_COMPONENTS_STANDARD before assigning
        for (const type in IC_COMPONENTS_STANDARD) {
            if (IC_COMPONENTS_STANDARD[type].render) {
                IC_COMPONENTS_STANDARD[type].draw = IC_COMPONENTS_STANDARD[type].render;
            }
        }
        Object.assign(PROFESSIONAL_COMPONENTS, IC_COMPONENTS_STANDARD);
        console.log('✅ Loaded', Object.keys(IC_COMPONENTS_STANDARD).length, 'standard IC components');
    }

    // Integrate Protection & Control Components
    if (window.PROTECTION_CONTROL_COMPONENTS_STANDARD) {
        for (const [type, comp] of Object.entries(window.PROTECTION_CONTROL_COMPONENTS_STANDARD)) {
            // Compatibility fixes
            if (comp.render && !comp.draw) comp.draw = comp.render;
            if (comp.ports && !Array.isArray(comp.ports)) {
                const portsArray = [];
                for (const [portId, portData] of Object.entries(comp.ports)) {
                    portsArray.push({ id: portId, x: portData.x, y: portData.y, label: portId });
                }
                comp.ports = portsArray;
            }
            if (!comp.properties) comp.properties = {};

            const item = document.createElement('div');
            item.className = 'component-item';
            item.setAttribute('data-type', type);
            item.setAttribute('title', `${comp.name} (${comp.standard})`);
            item.innerHTML = `${comp.symbol}<br><small>${comp.name.split(' ')[0]}</small>`;
            item.onclick = () => window.selectTool(type);

            if (categories[comp.category]?.container) {
                categories[comp.category].container.appendChild(item);
            }
        }

        // Apply render to draw mapping for PROTECTION_CONTROL_COMPONENTS_STANDARD before assigning
        for (const type in PROTECTION_CONTROL_COMPONENTS_STANDARD) {
            if (PROTECTION_CONTROL_COMPONENTS_STANDARD[type].render) {
                PROTECTION_CONTROL_COMPONENTS_STANDARD[type].draw = PROTECTION_CONTROL_COMPONENTS_STANDARD[type].render;
            }
        }
        Object.assign(PROFESSIONAL_COMPONENTS, PROTECTION_CONTROL_COMPONENTS_STANDARD);
        console.log('✅ Loaded', Object.keys(PROTECTION_CONTROL_COMPONENTS_STANDARD).length, 'protection/control components');
    }
}

window.selectTool = function (tool) {
    state.tool = tool;

    document.querySelectorAll('.component-item').forEach(el => {
        el.classList.remove('selected');
    });

    const btn = document.querySelector(`[data-type="${tool}"]`);
    if (btn) {
        btn.classList.add('selected');
        console.log('✓ Tool selected:', tool, '- Click canvas to place component');
    } else {
        console.warn('⚠️ Tool button not found for:', tool);
    }

    canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
}

// Mouse Handlers
function handleMouseDown(e) {
    const pos = getCanvasPos(e);

    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
        // Pan
        state.isPanning = true;
        state.dragStart = { x: e.clientX - state.panOffset.x, y: e.clientY - state.panOffset.y };
        canvas.style.cursor = 'grab';
        return;
    }

    console.log('Mouse down - Current tool:', state.tool, 'Position:', pos);

    if (state.tool === 'select') {
        handleSelectTool(pos);
    } else if (state.tool === 'wire') {
        handleWireTool(pos);
    } else {
        // Component placement
        handleComponentPlacement(pos);
    }
}

function handleMouseMove(e) {
    const pos = getCanvasPos(e);
    state.mousePos = pos;

    // Update cursor based on what's under mouse
    if (!state.isPanning && !state.isDragging && !state.isDraggingWaypoint && state.tool === 'select') {
        const port = getPortAtPosition(pos);
        if (port) {
            canvas.style.cursor = state.isWiring ? 'crosshair' : 'pointer';
        } else {
            // Check if hovering over a waypoint
            if (state.selectedWire) {
                const waypoint = getWaypointAtPosition(state.selectedWire, pos);
                if (waypoint) {
                    canvas.style.cursor = 'move';
                } else {
                    canvas.style.cursor = state.isWiring ? 'crosshair' : 'default';
                }
            } else {
                canvas.style.cursor = state.isWiring ? 'crosshair' : 'default';
            }
        }
    }

    if (state.isPanning) {
        state.panOffset.x = e.clientX - state.dragStart.x;
        state.panOffset.y = e.clientY - state.dragStart.y;
        return;
    }

    // Handle waypoint dragging with orthogonal constraint
    if (state.isDraggingWaypoint && state.selectedWire && state.draggedWaypointIndex !== null) {
        canvas.style.cursor = 'move';
        const idx = state.draggedWaypointIndex;
        const path = state.selectedWire.path;
        const waypoint = path[idx];

        // Get previous and next points
        const prevPoint = path[idx - 1];
        const nextPoint = path[idx + 1];

        if (!prevPoint || !nextPoint) {
            // Edge case: shouldn't happen as we skip first/last points
            waypoint.x = pos.x;
            waypoint.y = pos.y;
            return;
        }

        // Determine segment orientations
        const prevDx = Math.abs(waypoint.x - prevPoint.x);
        const prevDy = Math.abs(waypoint.y - prevPoint.y);
        const nextDx = Math.abs(nextPoint.x - waypoint.x);
        const nextDy = Math.abs(nextPoint.y - waypoint.y);

        const isPrevHorizontal = prevDx > prevDy;
        const isPrevVertical = prevDy >= prevDx;
        const isNextHorizontal = nextDx > nextDy;
        const isNextVertical = nextDy >= nextDx;

        // Apply constraints to maintain orthogonal routing
        if (isPrevHorizontal && isNextVertical) {
            // H-V corner: can move freely, just keep segments perpendicular
            waypoint.x = pos.x;
            waypoint.y = prevPoint.y; // Keep horizontal with previous
            nextPoint.x = waypoint.x; // Keep next vertical aligned
        } else if (isPrevVertical && isNextHorizontal) {
            // V-H corner: can move freely, just keep segments perpendicular  
            waypoint.y = pos.y;
            waypoint.x = prevPoint.x; // Keep vertical with previous
            nextPoint.y = waypoint.y; // Keep next horizontal aligned
        } else if (isPrevHorizontal && isNextHorizontal) {
            // Both segments horizontal: can only move vertically
            waypoint.y = pos.y;
            nextPoint.y = waypoint.y; // Keep both segments at same height
        } else if (isPrevVertical && isNextVertical) {
            // Both segments vertical: can only move horizontally
            waypoint.x = pos.x;
            nextPoint.x = waypoint.x; // Keep both segments at same X
        }

        // Snap to grid if enabled
        if (state.snapToGrid) {
            waypoint.x = Math.round(waypoint.x / state.gridSize) * state.gridSize;
            waypoint.y = Math.round(waypoint.y / state.gridSize) * state.gridSize;
            if (nextPoint) {
                nextPoint.x = Math.round(nextPoint.x / state.gridSize) * state.gridSize;
                nextPoint.y = Math.round(nextPoint.y / state.gridSize) * state.gridSize;
            }
        }

        return;
    }

    if (state.isDragging && state.selectedComponent) {
        // Save state before first drag (only once)
        if (!state.dragStarted && window.historyManager) {
            window.historyManager.saveState();
            state.dragStarted = true;
        }

        state.selectedComponent.x = pos.x;
        state.selectedComponent.y = pos.y;
        if (state.snapToGrid) snapComponentToGrid(state.selectedComponent);

        // Recalculate wires connected to this component
        const connectedWires = state.wires.filter(w =>
            w.from.componentId === state.selectedComponent.id ||
            w.to.componentId === state.selectedComponent.id
        );

        connectedWires.forEach(wire => {
            wire.path = calculateWirePath(wire.from, wire.to);
        });

        // Update wire intersections
        if (typeof detectWireIntersections === 'function') {
            detectWireIntersections();
        }
    }
}

function handleContextMenu(e) {
    e.preventDefault();
    const canvasPos = getCanvasPosition(e);

    // Add screen coordinates for menu positioning
    canvasPos.screenX = e.clientX;
    canvasPos.screenY = e.clientY;

    // Check if right-clicking on a wire
    const clickedWire = getWireAtPosition(canvasPos);

    if (clickedWire) {
        showJunctionMenu(canvasPos, clickedWire);
    } else {
        // Check if right-clicking on existing junction
        const junction = getJunctionAtPosition(canvasPos);
        if (junction) {
            showRemoveJunctionMenu(canvasPos, junction);
        }
    }
}

function showJunctionMenu(pos, wire) {
    // Remove existing context menu if any
    removeContextMenu();

    const menu = document.createElement('div');
    menu.id = 'junction-context-menu';
    menu.className = 'context-menu';
    menu.style.position = 'fixed';
    menu.style.left = pos.screenX + 'px';
    menu.style.top = pos.screenY + 'px';
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '4px';
    menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    menu.style.padding = '8px 0';
    menu.style.zIndex = '10000';
    menu.style.minWidth = '180px';

    const addJunctionBtn = document.createElement('div');
    addJunctionBtn.className = 'context-menu-item';
    addJunctionBtn.textContent = '⚡ Add Connection Point';
    addJunctionBtn.style.padding = '8px 16px';
    addJunctionBtn.style.cursor = 'pointer';
    addJunctionBtn.style.fontSize = '13px';
    addJunctionBtn.onmouseover = () => addJunctionBtn.style.backgroundColor = '#f0f0f0';
    addJunctionBtn.onmouseout = () => addJunctionBtn.style.backgroundColor = 'white';
    addJunctionBtn.onclick = () => {
        addManualJunction(pos, wire);
        removeContextMenu();
    };

    const cancelBtn = document.createElement('div');
    cancelBtn.className = 'context-menu-item';
    cancelBtn.textContent = '✖ Cancel';
    cancelBtn.style.padding = '8px 16px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.fontSize = '13px';
    cancelBtn.style.borderTop = '1px solid #eee';
    cancelBtn.style.marginTop = '4px';
    cancelBtn.style.paddingTop = '8px';
    cancelBtn.onmouseover = () => cancelBtn.style.backgroundColor = '#f0f0f0';
    cancelBtn.onmouseout = () => cancelBtn.style.backgroundColor = 'white';
    cancelBtn.onclick = () => removeContextMenu();

    menu.appendChild(addJunctionBtn);
    menu.appendChild(cancelBtn);
    document.body.appendChild(menu);

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', removeContextMenu, { once: true });
    }, 100);
}

function showRemoveJunctionMenu(pos, junction) {
    removeContextMenu();

    const menu = document.createElement('div');
    menu.id = 'junction-context-menu';
    menu.className = 'context-menu';
    menu.style.position = 'fixed';
    menu.style.left = pos.screenX + 'px';
    menu.style.top = pos.screenY + 'px';
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '4px';
    menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    menu.style.padding = '8px 0';
    menu.style.zIndex = '10000';
    menu.style.minWidth = '180px';

    const removeBtn = document.createElement('div');
    removeBtn.className = 'context-menu-item';
    removeBtn.textContent = '🗑️ Remove Connection Point';
    removeBtn.style.padding = '8px 16px';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.fontSize = '13px';
    removeBtn.style.color = '#dc2626';
    removeBtn.onmouseover = () => removeBtn.style.backgroundColor = '#fef2f2';
    removeBtn.onmouseout = () => removeBtn.style.backgroundColor = 'white';
    removeBtn.onclick = () => {
        removeManualJunction(junction);
        removeContextMenu();
    };

    menu.appendChild(removeBtn);
    document.body.appendChild(menu);

    setTimeout(() => {
        document.addEventListener('click', removeContextMenu, { once: true });
    }, 100);
}

function removeContextMenu() {
    const menu = document.getElementById('junction-context-menu');
    if (menu) {
        menu.remove();
    }
}

function addManualJunction(pos, wire) {
    // Snap to grid
    const x = Math.round(pos.x / state.gridSize) * state.gridSize;
    const y = Math.round(pos.y / state.gridSize) * state.gridSize;

    // Check if junction already exists at this position
    const existing = state.manualJunctions.find(j =>
        Math.abs(j.x - x) < 5 && Math.abs(j.y - y) < 5
    );

    if (existing) {
        console.log('Junction already exists at this position');
        return;
    }

    // Add junction point
    const junction = {
        id: `junction_${Date.now()}`,
        x: x,
        y: y,
        connectedWires: [wire.id]
    };

    state.manualJunctions.push(junction);
    console.log('Manual junction added at:', x, y);
    redraw();
}

function removeManualJunction(junction) {
    const index = state.manualJunctions.findIndex(j => j.id === junction.id);
    if (index !== -1) {
        state.manualJunctions.splice(index, 1);
        console.log('Manual junction removed');
        redraw();
    }
}

function getJunctionAtPosition(pos) {
    for (const junction of state.manualJunctions) {
        const dx = pos.x - junction.x;
        const dy = pos.y - junction.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 8) {
            return junction;
        }
    }
    return null;
}

function getWireAtPosition(pos) {
    for (const wire of state.wires) {
        // Check if point is near wire path
        for (let i = 0; i < wire.path.length - 1; i++) {
            const p1 = wire.path[i];
            const p2 = wire.path[i + 1];

            if (pointNearLineSegment(pos, p1, p2, 8)) {
                return wire;
            }
        }
    }
    return null;
}

function getWaypointAtPosition(wire, pos) {
    if (!wire || !wire.path) return null;

    // Skip first and last points (they are connected to ports)
    for (let i = 1; i < wire.path.length - 1; i++) {
        const waypoint = wire.path[i];
        const dx = pos.x - waypoint.x;
        const dy = pos.y - waypoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) { // 10px click radius for waypoints
            return { index: i, point: waypoint };
        }
    }
    return null;
}

function pointNearLineSegment(point, lineStart, lineEnd, threshold) {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return false;

    const t = Math.max(0, Math.min(1, ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (length * length)));
    const projX = lineStart.x + t * dx;
    const projY = lineStart.y + t * dy;

    const distance = Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
    return distance < threshold;
}

function handleMouseUp(e) {
    // Stop waypoint dragging
    if (state.isDraggingWaypoint) {
        state.isDraggingWaypoint = false;
        state.draggedWaypointIndex = null;
        console.log('✓ Waypoint rerouted');
        // Save to history
        if (window.historyManager) {
            window.historyManager.saveState();
        }
    }

    state.isDragging = false;
    state.dragStarted = false; // Reset drag flag
    state.isPanning = false;
    canvas.style.cursor = state.tool === 'select' ? 'default' : 'crosshair';
}

function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    state.zoom = Math.max(0.1, Math.min(5, state.zoom * delta));
}

function handleKeyDown(e) {
    // Undo/Redo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (historyManager && historyManager.canUndo()) {
            const previousState = historyManager.undo(state);
            if (previousState) {
                Object.assign(state, previousState);
                showToast('⏪ Undo');
            }
        }
        return;
    }

    if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (historyManager && historyManager.canRedo()) {
            const nextState = historyManager.redo(state);
            if (nextState) {
                Object.assign(state, nextState);
                showToast('⏩ Redo');
            }
        }
        return;
    }

    // Copy/Paste
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        if (state.selectedComponent && selectionManager) {
            selectionManager.copy([state.selectedComponent]);
            showToast('📋 Component copied');
        }
        return;
    }

    if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        if (selectionManager) {
            const newComponents = selectionManager.paste({ x: 50, y: 50 });
            if (newComponents.length > 0) {
                newComponents.forEach(comp => {
                    comp.id = 'comp_' + state.componentCounter++;
                    state.components.push(comp);
                });
                saveStateToHistory();
                showToast('📌 Component pasted');
            }
        }
        return;
    }

    // Delete
    if (e.key === 'Delete') {
        if (state.selectedComponent) {
            deleteComponent(state.selectedComponent);
        } else if (state.selectedWire) {
            deleteWire(state.selectedWire.id);
        }
    } else if (e.key === 'r' && state.selectedComponent) {
        rotateComponent(state.selectedComponent, 90);
    } else if (e.key === 'Escape') {
        state.isWiring = false;
        state.wireStart = null;
        state.selectedWire = null;
        selectTool('select');
    } else if (e.key === 'd' && e.ctrlKey) {
        // Ctrl+D: Toggle routing debug mode
        e.preventDefault();
        state.showRoutingDebug = !state.showRoutingDebug;
        console.log('Routing Debug Mode:', state.showRoutingDebug ? 'ON' : 'OFF');
        showToast(state.showRoutingDebug ? '🔍 Routing Debug: ON (red zones = no-wire areas)' : '🔍 Routing Debug: OFF');
    }
}

function handleKeyUp(e) {
    // Handle key releases
}

function showToast(message, duration = 3000) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#1f2937';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.zIndex = '10000';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '500';
    toast.style.animation = 'slideInRight 0.3s ease-out';

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function handleSelectTool(pos) {
    // PRIORITY ORDER: Port > Wire > Component

    // 1. Check for PORT click FIRST - this enables direct wiring without wire tool
    const port = getPortAtPosition(pos);

    if (port) {
        // Port clicked - handle wiring directly in select mode
        if (!state.isWiring) {
            // Start wire from this port
            state.isWiring = true;
            state.wireStart = port;
            canvas.style.cursor = 'crosshair';
            console.log('Wire started from:', port.componentId, port.portId);
        } else {
            // Complete wire to this port
            if (state.wireStart.componentId !== port.componentId) {
                createWire(state.wireStart, port);
                console.log('Wire created to:', port.componentId, port.portId);
            } else {
                console.log('Cannot connect component to itself');
            }
            state.isWiring = false;
            state.wireStart = null;
            canvas.style.cursor = 'default';
        }
        return; // Don't process component/wire selection if port was clicked
    }

    // 2. Check for WIRE WAYPOINT click (if wire is already selected)
    if (state.selectedWire && !state.isWiring) {
        const waypoint = getWaypointAtPosition(state.selectedWire, pos);
        if (waypoint) {
            // Waypoint clicked - start dragging it
            state.isDraggingWaypoint = true;
            state.draggedWaypointIndex = waypoint.index;
            console.log('Waypoint dragging started:', waypoint.index);
            return;
        }
    }

    // 3. Check for WIRE click (if not wiring)
    if (!state.isWiring) {
        const wire = getWireAtPosition(pos);
        if (wire) {
            // Wire clicked - select it
            state.selectedWire = wire;
            state.selectedComponent = null;
            state.components.forEach(c => c.selected = false);

            // Show wire properties and context menu
            updateWirePropertiesPanel(wire);
            showWireContextMenu(pos, wire);

            console.log('Wire selected:', wire.id);
            draw(); // Redraw to highlight selected wire
            return;
        }
    }

    // 4. No port, waypoint, or wire clicked - check for COMPONENT
    const comp = getComponentAtPosition(pos);

    // Check if Ctrl is held for multi-selection
    const isMultiSelect = window.event && (window.event.ctrlKey || window.event.metaKey);

    if (comp) {
        // Cancel any in-progress wiring if we're selecting a component
        if (state.isWiring) {
            state.isWiring = false;
            state.wireStart = null;
            canvas.style.cursor = 'default';
        }

        // Deselect wire if selecting component
        state.selectedWire = null;

        if (isMultiSelect) {
            // Toggle selection
            comp.selected = !comp.selected;
        } else {
            // Single selection - deselect all others
            state.components.forEach(c => c.selected = false);
            comp.selected = true;
            state.selectedComponent = comp;
            state.isDragging = true;
        }
        updatePropertiesPanel();
        updateMeasurements();
    } else {
        // Clicked empty space - deselect everything
        if (state.isWiring) {
            state.isWiring = false;
            state.wireStart = null;
            canvas.style.cursor = 'default';
            console.log('Wiring cancelled');
        }

        // Deselect components and wires if not multi-selecting
        if (!isMultiSelect) {
            state.components.forEach(c => c.selected = false);
            state.selectedComponent = null;
            state.selectedWire = null;
        }
        updatePropertiesPanel();
        updateMeasurements();
    }
}

function handleWireTool(pos) {
    const port = getPortAtPosition(pos);

    if (!port) {
        // Cancel wiring if clicked on empty space
        if (state.isWiring) {
            state.isWiring = false;
            state.wireStart = null;
        }
        return;
    }

    if (!state.isWiring) {
        // Start wire
        state.isWiring = true;
        state.wireStart = port;
        console.log('Wire started from:', port.componentId, port.portId);
    } else {
        // Complete wire
        if (state.wireStart.componentId !== port.componentId) {
            createWire(state.wireStart, port);
            console.log('Wire created to:', port.componentId, port.portId);
        } else {
            console.log('Cannot connect component to itself');
        }
        state.isWiring = false;
        state.wireStart = null;
    }
}

function handleComponentPlacement(pos) {
    const compDef = PROFESSIONAL_COMPONENTS[state.tool];
    if (!compDef) {
        console.error('❌ Component definition not found for tool:', state.tool);
        console.log('Available components:', Object.keys(PROFESSIONAL_COMPONENTS));
        return;
    }

    console.log('✓ Placing component:', state.tool, 'at position:', pos);

    // Save state before placing component
    if (window.historyManager) {
        window.historyManager.saveState();
    }

    createComponent(state.tool, pos.x, pos.y);
    selectTool('select');
}

// Component Management
function createComponent(type, x, y) {
    const def = PROFESSIONAL_COMPONENTS[type];
    if (!def) return;

    const component = {
        id: `${def.symbol}${state.componentCounter++}`,
        type: type,
        x: x,
        y: y,
        rotation: 0,
        properties: {},
        ports: []
    };

    // Copy properties (handle components without properties)
    if (def.properties && typeof def.properties === 'object') {
        for (const [key, prop] of Object.entries(def.properties)) {
            component.properties[key] = { ...prop };
        }
    }

    // Create ports (handle components without ports)
    if (def.ports && Array.isArray(def.ports)) {
        for (const portDef of def.ports) {
            component.ports.push({
                id: portDef.id,
                componentId: component.id,
                label: portDef.label || '',
                localX: portDef.x,
                localY: portDef.y,
                connections: []
            });
        }
    }

    if (state.snapToGrid) {
        component.x = Math.round(x / state.gridSize) * state.gridSize;
        component.y = Math.round(y / state.gridSize) * state.gridSize;
    }

    state.components.push(component);
    state.selectedComponent = component;
    updatePropertiesPanel();
    updateMeasurements();

    // Save state after adding component
    saveStateToHistory();

    console.log('Created component:', component.id);
}

// Save current state to history
function saveStateToHistory() {
    if (historyManager) {
        historyManager.push({
            components: JSON.parse(JSON.stringify(state.components)),
            wires: JSON.parse(JSON.stringify(state.wires))
        });
    }
}

function deleteComponent(component) {
    saveStateToHistory();

    // Remove connected wires
    state.wires = state.wires.filter(wire =>
        wire.from.componentId !== component.id && wire.to.componentId !== component.id
    );

    state.components = state.components.filter(c => c !== component);
    state.selectedComponent = null;
    updatePropertiesPanel();
    updateMeasurements();
}

function rotateComponent(component, degrees) {
    // Save state before rotation
    if (window.historyManager) {
        window.historyManager.saveState();
    }

    component.rotation = (component.rotation + degrees) % 360;

    // Update all connected wires to recalculate paths
    state.wires.forEach(wire => {
        if (wire.from.componentId === component.id || wire.to.componentId === component.id) {
            wire.path = calculateWirePath(wire.from, wire.to);
        }
    });

    // Update wire intersections
    detectWireIntersections();

    console.log(`Rotated ${component.id} to ${component.rotation}°`);
}

function snapComponentToGrid(component) {
    component.x = Math.round(component.x / state.gridSize) * state.gridSize;
    component.y = Math.round(component.y / state.gridSize) * state.gridSize;
}

// Wire Management with Smart Routing
function createWire(fromPort, toPort) {
    // Save state before creating wire
    if (window.historyManager) {
        window.historyManager.saveState();
    }

    const wire = {
        id: `wire_${Date.now()}`,
        from: {
            componentId: fromPort.componentId,
            portId: fromPort.portId
        },
        to: {
            componentId: toPort.componentId,
            portId: toPort.portId
        },
        path: [],
        color: state.currentWireColor || '#2563eb' // Use selected color
    };

    // Calculate smart routing
    wire.path = calculateWirePath(wire.from, wire.to);

    state.wires.push(wire);

    // Add current flow effect for new wire
    if (effectManager && typeof CurrentFlowEffect !== 'undefined') {
        const wirePoints = wire.path;
        if (wirePoints.length >= 2) {
            effectManager.addEffect('currentFlow', {
                wire: {
                    x1: wirePoints[0].x,
                    y1: wirePoints[0].y,
                    x2: wirePoints[wirePoints.length - 1].x,
                    y2: wirePoints[wirePoints.length - 1].y
                },
                current: 0.5 // Default current magnitude
            });
        }
    }

    // Update port connections
    const fromPortObj = state.components.find(c => c.id === fromPort.componentId)?.ports.find(p => p.id === fromPort.portId);
    const toPortObj = state.components.find(c => c.id === toPort.componentId)?.ports.find(p => p.id === toPort.portId);

    if (fromPortObj) {
        if (!fromPortObj.connections) fromPortObj.connections = [];
        fromPortObj.connections.push(wire.id);
    }
    if (toPortObj) {
        if (!toPortObj.connections) toPortObj.connections = [];
        toPortObj.connections.push(wire.id);
    }

    // Detect and mark wire intersections
    detectWireIntersections();

    console.log('Created wire:', wire.id);
}

function detectWireIntersections() {
    // DISABLED: No automatic junction creation
    // Wire crossings are purely visual - wires pass OVER/UNDER each other
    // NO electrical connection unless user adds manual junction point
    state.wireJunctions = []; // Keep empty - no auto-junctions

    console.log('Wire intersection detection disabled - use manual junctions only');
}

function getLineIntersection(p1, p2, p3, p4) {
    // Check if two line segments intersect
    const x1 = p1.x, y1 = p1.y;
    const x2 = p2.x, y2 = p2.y;
    const x3 = p3.x, y3 = p3.y;
    const x4 = p4.x, y4 = p4.y;

    // Calculate denominator
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (Math.abs(denom) < 0.01) return null; // Parallel or coincident

    // Calculate intersection point
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    // Check if intersection is within both segments
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    }

    return null;
}

function isEndpoint(point, wire) {
    const tolerance = 5;
    const start = wire.path[0];
    const end = wire.path[wire.path.length - 1];

    return (Math.abs(point.x - start.x) < tolerance && Math.abs(point.y - start.y) < tolerance) ||
        (Math.abs(point.x - end.x) < tolerance && Math.abs(point.y - end.y) < tolerance);
}

function calculateWirePath(from, to) {
    const fromPos = getPortWorldPosition(from);
    const toPos = getPortWorldPosition(to);

    // Get component bounding boxes to avoid
    const obstacles = state.components.map(comp => {
        const def = PROFESSIONAL_COMPONENTS[comp.type];
        if (!def) return null;

        // Add padding around component
        const padding = 20;
        return {
            x: comp.x - def.width / 2 - padding,
            y: comp.y - def.height / 2 - padding,
            width: def.width + padding * 2,
            height: def.height + padding * 2,
            componentId: comp.id
        };
    }).filter(o => o !== null);

    // Remove obstacles for the source and destination components
    const filteredObstacles = obstacles.filter(o =>
        o.componentId !== from.componentId && o.componentId !== to.componentId
    );

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;

    // ALWAYS use orthogonal routing (Manhattan/Rectilinear style - no diagonal lines)
    // Determine primary routing direction
    const routeHorizontalFirst = Math.abs(dx) > Math.abs(dy);

    let path;

    if (routeHorizontalFirst) {
        // Horizontal-first routing with multiple waypoints
        const step1X = fromPos.x + dx * 0.5; // Midpoint horizontal

        const proposedPath = [
            fromPos,
            { x: step1X, y: fromPos.y },  // Go horizontal first
            { x: step1X, y: toPos.y },    // Then vertical
            toPos
        ];

        // Check if path intersects obstacles
        if (!pathIntersectsObstacles(proposedPath, filteredObstacles)) {
            path = proposedPath;
        } else {
            // If blocked, try routing with offset
            const offsetY = dy > 0 ? 40 : -40;
            const routeAroundPath = [
                fromPos,
                { x: fromPos.x + 30, y: fromPos.y },           // Exit horizontally
                { x: fromPos.x + 30, y: fromPos.y + offsetY }, // Move up/down
                { x: toPos.x - 30, y: fromPos.y + offsetY },   // Go across
                { x: toPos.x - 30, y: toPos.y },               // Align vertically
                toPos
            ];

            if (!pathIntersectsObstacles(routeAroundPath, filteredObstacles)) {
                path = routeAroundPath;
            } else {
                // Fallback: simple 3-point path
                path = [
                    fromPos,
                    { x: fromPos.x + dx * 0.5, y: fromPos.y },
                    { x: fromPos.x + dx * 0.5, y: toPos.y },
                    toPos
                ];
            }
        }
    } else {
        // Vertical-first routing with multiple waypoints
        const step1Y = fromPos.y + dy * 0.5; // Midpoint vertical

        const proposedPath = [
            fromPos,
            { x: fromPos.x, y: step1Y },  // Go vertical first
            { x: toPos.x, y: step1Y },    // Then horizontal
            toPos
        ];

        // Check if path intersects obstacles
        if (!pathIntersectsObstacles(proposedPath, filteredObstacles)) {
            path = proposedPath;
        } else {
            // If blocked, try routing with offset
            const offsetX = dx > 0 ? 40 : -40;
            const routeAroundPath = [
                fromPos,
                { x: fromPos.x, y: fromPos.y + 30 },           // Exit vertically
                { x: fromPos.x + offsetX, y: fromPos.y + 30 }, // Move left/right
                { x: fromPos.x + offsetX, y: toPos.y - 30 },   // Go down/up
                { x: toPos.x, y: toPos.y - 30 },               // Align horizontally
                toPos
            ];

            if (!pathIntersectsObstacles(routeAroundPath, filteredObstacles)) {
                path = routeAroundPath;
            } else {
                // Fallback: simple 3-point path
                path = [
                    fromPos,
                    { x: fromPos.x, y: fromPos.y + dy * 0.5 },
                    { x: toPos.x, y: fromPos.y + dy * 0.5 },
                    toPos
                ];
            }
        }
    }

    // Optimize path to remove redundant collinear points
    return optimizeWirePath(path);
}

// Remove redundant waypoints from a path (collinear points)
function optimizeWirePath(path) {
    if (path.length <= 2) return path;

    const optimized = [path[0]]; // Always keep first point

    for (let i = 1; i < path.length - 1; i++) {
        const prev = path[i - 1];
        const curr = path[i];
        const next = path[i + 1];

        // Check if current point is on the line between prev and next
        const isHorizontalLine = Math.abs(prev.y - curr.y) < 1 && Math.abs(curr.y - next.y) < 1;
        const isVerticalLine = Math.abs(prev.x - curr.x) < 1 && Math.abs(curr.x - next.x) < 1;

        // Only keep the point if it's a corner (not collinear)
        if (!isHorizontalLine && !isVerticalLine) {
            optimized.push(curr);
        }
    }

    optimized.push(path[path.length - 1]); // Always keep last point
    return optimized;
}

// Helper function to check if a path intersects any obstacles
function pathIntersectsObstacles(path, obstacles) {
    for (let i = 0; i < path.length - 1; i++) {
        const segmentStart = path[i];
        const segmentEnd = path[i + 1];

        for (const obstacle of obstacles) {
            if (lineSegmentIntersectsRect(segmentStart, segmentEnd, obstacle)) {
                return true;
            }
        }
    }
    return false;
}

// Helper function to check if a line segment intersects a rectangle
function lineSegmentIntersectsRect(p1, p2, rect) {
    // Check if either endpoint is inside the rectangle
    if (pointInRect(p1, rect) || pointInRect(p2, rect)) {
        return true;
    }

    // Check if line segment intersects any of the rectangle's edges
    const rectEdges = [
        { x1: rect.x, y1: rect.y, x2: rect.x + rect.width, y2: rect.y },                    // Top
        { x1: rect.x + rect.width, y1: rect.y, x2: rect.x + rect.width, y2: rect.y + rect.height }, // Right
        { x1: rect.x, y1: rect.y + rect.height, x2: rect.x + rect.width, y2: rect.y + rect.height }, // Bottom
        { x1: rect.x, y1: rect.y, x2: rect.x, y2: rect.y + rect.height }                    // Left
    ];

    for (const edge of rectEdges) {
        if (lineSegmentsIntersect(
            p1.x, p1.y, p2.x, p2.y,
            edge.x1, edge.y1, edge.x2, edge.y2
        )) {
            return true;
        }
    }

    return false;
}

// Helper function to check if a point is inside a rectangle
function pointInRect(point, rect) {
    return point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height;
}

// Helper function to check if two line segments intersect
function lineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));

    if (denom === 0) {
        return false; // Parallel lines
    }

    const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denom;
    const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denom;

    return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
}

// A* Pathfinding for orthogonal wire routing
function findOrthogonalPath(start, end, fromPort, toPort) {
    const gridSize = state.gridSize * 2; // Use 20px grid for routing

    // Snap start and end to grid
    const startGrid = {
        x: Math.round(start.x / gridSize) * gridSize,
        y: Math.round(start.y / gridSize) * gridSize
    };
    const endGrid = {
        x: Math.round(end.x / gridSize) * gridSize,
        y: Math.round(end.y / gridSize) * gridSize
    };

    // A* algorithm
    const openSet = [{ pos: startGrid, g: 0, h: manhattanDistance(startGrid, endGrid), parent: null }];
    const closedSet = new Map();
    const visited = new Set();

    while (openSet.length > 0) {
        // Get node with lowest f score
        openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));
        const current = openSet.shift();

        const key = `${current.pos.x},${current.pos.y}`;
        if (visited.has(key)) continue;
        visited.add(key);

        // Check if reached goal
        if (Math.abs(current.pos.x - endGrid.x) < gridSize &&
            Math.abs(current.pos.y - endGrid.y) < gridSize) {
            return reconstructPath(current);
        }

        closedSet.set(key, current);

        // Explore neighbors (4 directions - orthogonal only)
        const neighbors = [
            { x: current.pos.x + gridSize, y: current.pos.y }, // Right
            { x: current.pos.x - gridSize, y: current.pos.y }, // Left
            { x: current.pos.x, y: current.pos.y + gridSize }, // Down
            { x: current.pos.x, y: current.pos.y - gridSize }  // Up
        ];

        for (const neighbor of neighbors) {
            const nKey = `${neighbor.x},${neighbor.y}`;

            if (visited.has(nKey)) continue;

            // Check if neighbor is blocked by component
            if (isPointInsideAnyComponent(neighbor, fromPort, toPort)) {
                continue;
            }

            // Wire-to-wire spacing check disabled for better routing flexibility

            const g = current.g + gridSize;
            const h = manhattanDistance(neighbor, endGrid);

            // Penalize direction changes to prefer straight lines
            const directionPenalty = getDirectionChangePenalty(current, neighbor);

            openSet.push({
                pos: neighbor,
                g: g + directionPenalty,
                h: h,
                parent: current
            });
        }

        // Prevent infinite loops - max 200 iterations
        if (visited.size > 200) {
            console.warn('A* pathfinding max iterations reached, using fallback');
            return createFallbackPath(start, end);
        }
    }

    // No path found, use fallback
    console.warn('No A* path found, using simple routing');
    return createFallbackPath(start, end);
}

function manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(node) {
    const path = [];
    let current = node;

    while (current.parent) {
        path.unshift(current.pos);
        current = current.parent;
    }

    return path;
}

function getDirectionChangePenalty(current, neighbor) {
    if (!current.parent) return 0;

    // Calculate direction vectors
    const prevDir = {
        x: current.pos.x - current.parent.pos.x,
        y: current.pos.y - current.parent.pos.y
    };
    const newDir = {
        x: neighbor.x - current.pos.x,
        y: neighbor.y - current.pos.y
    };

    // If direction changes, add penalty (prefer straight lines)
    if (prevDir.x !== newDir.x || prevDir.y !== newDir.y) {
        return 50; // Penalty for turning
    }

    return 0;
}

function isTooCloseToExistingWires(point, fromPort, toPort, minDistance) {
    // Disabled - allow wires to route more freely
    return false;
}

function pointToSegmentDistance(point, lineStart, lineEnd) {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) {
        // Line segment is a point
        return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
    }

    // Calculate projection parameter
    const t = Math.max(0, Math.min(1,
        ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (length * length)
    ));

    // Calculate closest point on segment
    const projX = lineStart.x + t * dx;
    const projY = lineStart.y + t * dy;

    // Return distance to closest point
    return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}

function createFallbackPath(start, end) {
    // Simple L-shaped or Z-shaped path as fallback
    const path = [];
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal first
        const midX = start.x + dx / 2;
        path.push({ x: Math.round(midX / state.gridSize) * state.gridSize, y: start.y });
        path.push({ x: Math.round(midX / state.gridSize) * state.gridSize, y: end.y });
    } else {
        // Vertical first
        const midY = start.y + dy / 2;
        path.push({ x: start.x, y: Math.round(midY / state.gridSize) * state.gridSize });
        path.push({ x: end.x, y: Math.round(midY / state.gridSize) * state.gridSize });
    }

    return path;
}

function isPointInsideAnyComponent(point, excludeFromPort, excludeToPort) {
    // Check if point is inside any component body (with clearance margin)
    const clearance = 5; // Very tight clearance for better routing

    for (const comp of state.components) {
        const def = PROFESSIONAL_COMPONENTS[comp.type];
        if (!def) continue;

        // CRITICAL: Skip components we're currently wiring to/from
        // This allows the wire to reach the component's ports
        const isFromComponent = excludeFromPort && comp.id === excludeFromPort.componentId;
        const isToComponent = excludeToPort && comp.id === excludeToPort.componentId;

        if (isFromComponent || isToComponent) {
            // Allow routing NEAR this component to reach its ports
            // Only block if point is FAR from any port
            let nearPort = false;
            for (const port of comp.ports) {
                const portPos = getPortWorldPosition({ componentId: comp.id, portId: port.id });
                const dist = Math.hypot(point.x - portPos.x, point.y - portPos.y);
                if (dist < 30) { // Within 30px of a port - allow routing
                    nearPort = true;
                    break;
                }
            }
            if (nearPort) continue; // Don't block if near a port
        }

        // Apply component rotation to get accurate bounding box
        const angle = (comp.rotation || 0) * Math.PI / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Calculate rotated bounding box with clearance
        const hw = def.width / 2 + clearance;
        const hh = def.height / 2 + clearance;

        // Transform point to component's local coordinate system
        const dx = point.x - comp.x;
        const dy = point.y - comp.y;
        const localX = dx * cos + dy * sin;
        const localY = -dx * sin + dy * cos;

        // Check if point is inside rotated bounding box
        if (Math.abs(localX) <= hw && Math.abs(localY) <= hh) {
            return true; // Point is blocked by this component
        }
    }

    return false; // Point is clear
}

// Get port orientation (which direction it faces)
function getPortOrientation(portRef) {
    const comp = state.components.find(c => c.id === portRef.componentId);
    if (!comp) return 'right';

    const def = PROFESSIONAL_COMPONENTS[comp.type];
    if (!def) return 'right';

    const port = def.ports.find(p => p.id === portRef.portId);
    if (!port) return 'right';

    // Determine orientation based on port position relative to component center
    const angle = (comp.rotation || 0) * Math.PI / 180;
    const rotatedX = port.x * Math.cos(angle) - port.y * Math.sin(angle);
    const rotatedY = port.x * Math.sin(angle) + port.y * Math.cos(angle);

    if (Math.abs(rotatedX) > Math.abs(rotatedY)) {
        return rotatedX > 0 ? 'right' : 'left';
    } else {
        return rotatedY > 0 ? 'down' : 'up';
    }
}

// Get exit point perpendicular to port
function getExitPoint(portPos, orientation, distance) {
    switch (orientation) {
        case 'up': return { x: portPos.x, y: portPos.y - distance };
        case 'down': return { x: portPos.x, y: portPos.y + distance };
        case 'left': return { x: portPos.x - distance, y: portPos.y };
        case 'right': return { x: portPos.x + distance, y: portPos.y };
        default: return null;
    }
}

// Utilities
function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left - state.panOffset.x) / state.zoom,
        y: (e.clientY - rect.top - state.panOffset.y) / state.zoom
    };
}

function getComponentAtPosition(pos) {
    for (let i = state.components.length - 1; i >= 0; i--) {
        const comp = state.components[i];
        const def = PROFESSIONAL_COMPONENTS[comp.type];
        if (!def) continue;

        const dx = pos.x - comp.x;
        const dy = pos.y - comp.y;

        if (Math.abs(dx) < def.width / 2 && Math.abs(dy) < def.height / 2) {
            return comp;
        }
    }
    return null;
}

function getPortAtPosition(pos) {
    // Large detection radius for easy port clicking
    const detectionRadius = 15;

    for (const comp of state.components) {
        for (const port of comp.ports) {
            const portPos = getPortWorldPosition({ componentId: comp.id, portId: port.id });
            const dx = pos.x - portPos.x;
            const dy = pos.y - portPos.y;
            const distance = Math.hypot(dx, dy);

            if (distance < detectionRadius) {
                return {
                    component: comp,
                    port: port,
                    componentId: comp.id,
                    portId: port.id
                };
            }
        }
    }
    return null;
}

function getPortWorldPosition(portRef) {
    const comp = state.components.find(c => c.id === portRef.componentId);
    if (!comp) return { x: 0, y: 0 };

    const port = comp.ports.find(p => p.id === portRef.portId);
    if (!port) return { x: 0, y: 0 };

    // Apply rotation
    const rad = comp.rotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return {
        x: comp.x + port.localX * cos - port.localY * sin,
        y: comp.y + port.localX * sin + port.localY * cos
    };
}

// Rendering
function startRenderLoop() {
    function render() {
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(state.panOffset.x, state.panOffset.y);
        ctx.scale(state.zoom, state.zoom);

        // Draw grid
        drawGrid();

        // Update and render particle effects BEFORE wires
        if (effectManager && particleSystem) {
            effectManager.update();
            particleSystem.update(1 / 60); // Assuming 60 FPS
            particleSystem.render(ctx);
        }

        // Draw wires
        for (const wire of state.wires) {
            drawWire(wire);
        }

        // Draw MANUAL junction points (user-added connection points only)
        for (const junction of state.manualJunctions) {
            ctx.save();
            ctx.fillStyle = '#10b981'; // Green for electrical connection
            ctx.strokeStyle = '#065f46'; // Dark green outline
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(junction.x, junction.y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        // Draw components
        for (const comp of state.components) {
            drawComponent(comp);
        }

        // Render component glow effects
        if (effectManager) {
            effectManager.render();
        }

        // DEBUG MODE: Show wire routing clearance zones
        if (state.showRoutingDebug) {
            ctx.save();
            for (const comp of state.components) {
                const def = PROFESSIONAL_COMPONENTS[comp.type];
                if (!def) continue;

                const clearance = 5; // Must match isPointInsideAnyComponent
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
                ctx.fillStyle = 'rgba(255, 0, 0, 0.05)';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);

                // Draw clearance zone (no-wire zone)
                const angle = (comp.rotation || 0) * Math.PI / 180;
                ctx.translate(comp.x, comp.y);
                ctx.rotate(angle);
                ctx.strokeRect(-def.width / 2 - clearance, -def.height / 2 - clearance,
                    def.width + clearance * 2, def.height + clearance * 2);
                ctx.fillRect(-def.width / 2 - clearance, -def.height / 2 - clearance,
                    def.width + clearance * 2, def.height + clearance * 2);
                ctx.rotate(-angle);
                ctx.translate(-comp.x, -comp.y);

                ctx.setLineDash([]);
            }
            ctx.restore();
        }

        // Highlight port under mouse when in select mode or wiring
        if (state.tool === 'select' && state.mousePos) {
            const hoveredPort = getPortAtPosition(state.mousePos);
            if (hoveredPort) {
                const portWorldPos = getPortWorldPosition(hoveredPort);
                ctx.save();
                ctx.strokeStyle = state.isWiring ? '#f59e0b' : '#3b82f6';
                ctx.fillStyle = state.isWiring ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(portWorldPos.x, portWorldPos.y, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        }

        // Draw wire in progress
        if (state.isWiring && state.wireStart) {
            drawWireInProgress();
        }

        ctx.restore();

        requestAnimationFrame(render);
    }

    render();
}

function drawGrid() {
    const gridSize = state.gridSize;
    const startX = Math.floor(-state.panOffset.x / state.zoom / gridSize) * gridSize;
    const startY = Math.floor(-state.panOffset.y / state.zoom / gridSize) * gridSize;
    const endX = startX + canvas.width / state.zoom + gridSize;
    const endY = startY + canvas.height / state.zoom + gridSize;

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let x = startX; x < endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
    }

    for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
    }
}

function drawComponent(comp) {
    const def = PROFESSIONAL_COMPONENTS[comp.type];
    if (!def || !def.draw) return;

    // WIRE ROUTING DEBUG MODE: Show clearance zones
    if (state.showRoutingDebug) {
        const clearance = 5; // Must match A* pathfinding clearance
        ctx.fillStyle = 'rgba(220, 38, 38, 0.08)'; // Light red overlay
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        ctx.fillRect(
            comp.x - def.width / 2 - clearance,
            comp.y - def.height / 2 - clearance,
            def.width + clearance * 2,
            def.height + clearance * 2
        );
        ctx.strokeRect(
            comp.x - def.width / 2 - clearance,
            comp.y - def.height / 2 - clearance,
            def.width + clearance * 2,
            def.height + clearance * 2
        );
        ctx.setLineDash([]);

        // Show clearance value
        ctx.fillStyle = '#dc2626';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`NO-ROUTE ZONE (${clearance}px)`, comp.x, comp.y - def.height / 2 - clearance - 5);
    }

    ctx.save();
    ctx.translate(comp.x, comp.y);
    ctx.rotate(comp.rotation * Math.PI / 180);

    // Draw component body
    def.draw(ctx, 0, 0, comp.rotation, comp);

    // Draw ports with improved visibility
    for (const port of comp.ports) {
        const px = port.localX;
        const py = port.localY;

        // Port circle - larger and with white outline for visibility
        const isConnected = port.connections && port.connections.length > 0;
        ctx.fillStyle = isConnected ? '#10b981' : '#ef4444';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Port label (auto-adjust position based on rotation)
        if (port.label) {
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Adjust label position based on port location
            const labelOffsetX = px > 0 ? 12 : (px < 0 ? -12 : 0);
            const labelOffsetY = py > 0 ? 12 : (py < 0 ? -12 : 0);

            ctx.fillText(port.label, px + labelOffsetX, py + labelOffsetY);
        }
    }

    ctx.restore();

    // Draw component ID and value OUTSIDE rotation (always upright)
    ctx.save();

    // Component ID (top)
    ctx.fillStyle = comp === state.selectedComponent ? '#3b82f6' : '#6b7280';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(comp.id, comp.x, comp.y - def.height / 2 - 8);

    // Main property value (bottom) with color coding
    const mainProp = Object.keys(comp.properties)[0];
    if (mainProp && comp.properties[mainProp]) {
        const prop = comp.properties[mainProp];
        const value = `${prop.value}${prop.unit}`;

        // Color code by property type
        let valueColor = '#059669'; // Green for normal values
        if (mainProp.includes('current') || mainProp.includes('Current')) valueColor = '#dc2626'; // Red for current
        if (mainProp.includes('voltage') || mainProp.includes('Voltage')) valueColor = '#2563eb'; // Blue for voltage
        if (mainProp.includes('power') || mainProp.includes('Power')) valueColor = '#7c3aed'; // Purple for power

        ctx.fillStyle = valueColor;
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(value, comp.x, comp.y + def.height / 2 + 5);
    }

    // Selection highlight (for single or multi-select)
    if (comp === state.selectedComponent || comp.selected) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
            comp.x - def.width / 2 - 5,
            comp.y - def.height / 2 - 5,
            def.width + 10,
            def.height + 10
        );
        ctx.setLineDash([]);
    }

    ctx.restore();
}

function drawWire(wire) {
    // PROFESSIONAL WIRE RENDERING
    // ============================
    // - 2.5px line width for visibility
    // - Rounded corners for smooth 90° turns
    // - Subtle shadow for depth
    // - Connection points marked with dots
    // - Highlight selected wire

    const isSelected = state.selectedWire && state.selectedWire.id === wire.id;

    ctx.strokeStyle = wire.color || '#2563eb';
    ctx.lineWidth = isSelected ? 4 : 2.5; // Thicker if selected
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Glow effect for selected wire
    if (isSelected) {
        ctx.shadowColor = wire.color || '#2563eb';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    } else {
        // Shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
    }

    ctx.beginPath();
    for (let i = 0; i < wire.path.length; i++) {
        const point = wire.path[i];
        if (i === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    }
    ctx.stroke();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw connection points at wire ends
    ctx.fillStyle = wire.color || '#2563eb';
    const dotSize = isSelected ? 5 : 4;
    for (const point of [wire.path[0], wire.path[wire.path.length - 1]]) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw waypoint handles if wire is selected (draggable points)
    if (isSelected && wire.path && wire.path.length > 2) {
        ctx.save();
        // Draw draggable waypoint handles (skip first and last - they're connected to ports)
        for (let i = 1; i < wire.path.length - 1; i++) {
            const waypoint = wire.path[i];
            const isDragging = state.isDraggingWaypoint && state.draggedWaypointIndex === i && state.selectedWire.id === wire.id;

            // Outer circle (white border)
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.fillStyle = isDragging ? '#22c55e' : '#3b82f6'; // Green when dragging, blue otherwise

            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Inner dot for better visibility
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // Optional: Draw wire ID for debugging (remove in production)
    if (state.showWireDebug) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        const midPoint = wire.path[Math.floor(wire.path.length / 2)];
        ctx.fillText(wire.id.split('_')[1], midPoint.x, midPoint.y - 8);
    }
}

function drawWireInProgress() {
    if (!state.wireStart || !state.mousePos) return;

    const fromPos = getPortWorldPosition(state.wireStart);

    // Check if mouse is over a valid target port
    const targetPort = getPortAtPosition(state.mousePos);
    const isValidTarget = targetPort && targetPort.componentId !== state.wireStart.componentId;

    // Animated dashed line with color indicating valid/invalid target
    ctx.strokeStyle = isValidTarget ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.setLineDash([10, 5]);

    // Use smart routing if hovering over valid port, simple path otherwise
    let previewPath;

    if (isValidTarget) {
        const toPos = getPortWorldPosition(targetPort);
        // Use actual routing algorithm for preview
        const tempWire = {
            from: state.wireStart,
            to: targetPort
        };
        previewPath = calculateWirePath(tempWire.from, tempWire.to);
    } else {
        // Simple L-shape to mouse cursor
        previewPath = [
            fromPos,
            { x: (fromPos.x + state.mousePos.x) / 2, y: fromPos.y },
            { x: (fromPos.x + state.mousePos.x) / 2, y: state.mousePos.y },
            state.mousePos
        ];
    }

    ctx.beginPath();
    for (let i = 0; i < previewPath.length; i++) {
        if (i === 0) {
            ctx.moveTo(previewPath[i].x, previewPath[i].y);
        } else {
            ctx.lineTo(previewPath[i].x, previewPath[i].y);
        }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw start port highlight
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(fromPos.x, fromPos.y, 8, 0, Math.PI * 2);
    ctx.fill();
}

// Properties Panel
function updatePropertiesPanel() {
    const panel = document.getElementById('propertiesContent');
    if (!panel) return;

    if (!state.selectedComponent) {
        panel.innerHTML = '<p style="color: #999;">Select a component</p>';
        return;
    }

    const comp = state.selectedComponent;
    const def = PROFESSIONAL_COMPONENTS[comp.type];

    let html = `
        <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #667eea;">
            <strong style="color: #667eea;">${def.name}</strong>
            <div style="font-size: 12px; color: #999;">ID: ${comp.id}</div>
        </div>
        
        <!-- Properties -->
        <div style="margin-bottom: 15px;">
            <strong style="font-size: 14px; color: #333;">Properties</strong>
            ${Object.keys(comp.properties).map(key => {
                const prop = comp.properties[key];
                return `
                    <div class="property-row" style="display: flex; align-items: center; margin-top: 8px;">
                        <div class="property-label" style="width: 80px; font-size: 13px; color: #555;">${key}:</div>
                        <input type="number" value="${prop.value}" onchange="updateProperty('${key}', this.value)"
                           style="flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                        <span style="font-size: 12px; color: #999; min-width: 30px;">${prop.unit}</span>
                    </div>
                `;
            }).join('')}
        </div>
        
        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 15px;">
            <button onclick="duplicateComponent()" style="width: 100%; padding: 10px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
                📋 Duplicate
            </button>
            <button onclick="deleteSelectedComponent()" style="width: 100%; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
                🗑️ Delete
            </button>
        </div>
        `;

    panel.innerHTML = html;
}

// Rotation functions
window.rotateComponent = function (degrees) {
    if (state.selectedComponent) {
        state.selectedComponent.rotation = (state.selectedComponent.rotation || 0) + degrees;
        // Normalize to 0-360
        state.selectedComponent.rotation = ((state.selectedComponent.rotation % 360) + 360) % 360;
        updatePropertiesPanel();
        draw();
    }
};

window.setComponentRotation = function (degrees) {
    if (state.selectedComponent) {
        state.selectedComponent.rotation = parseFloat(degrees) || 0;
        draw();
    }
};

// Duplicate component
window.duplicateComponent = function () {
    if (!state.selectedComponent) return;

    const original = state.selectedComponent;
    const newComp = {
        ...original,
        id: `comp_${state.componentCounter++}`,
        x: original.x + 50,
        y: original.y + 50,
        properties: JSON.parse(JSON.stringify(original.properties)),
        ports: JSON.parse(JSON.stringify(original.ports))
    };

    state.components.push(newComp);
    state.selectedComponent = newComp;
    updatePropertiesPanel();
    draw();

    console.log(`✓ Duplicated component: ${newComp.id}`);
};


function updateProperty(key, value) {
    if (state.selectedComponent) {
        state.selectedComponent.properties[key].value = parseFloat(value);
    }
}

function deleteSelectedComponent() {
    if (state.selectedComponent) {
        deleteComponent(state.selectedComponent);
    }
}

// Circuit Actions
window.newCircuit = function () {
    if (confirm('Clear circuit?')) {
        state.components = [];
        state.wires = [];
        state.selectedComponent = null;
        state.componentCounter = 1;
    }
};

window.saveCircuit = async function () {
    if (!authToken) {
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
                wires: state.wires
            })
        });

        if (response.ok) {
            alert('Circuit saved!');
        }
    } catch (error) {
        console.error('Save error:', error);
    }
};

window.loadCircuit = async function () {
    if (!authToken) {
        showLoginModal();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/circuits/`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const circuits = await response.json();
        if (circuits.length === 0) {
            alert('No saved circuits');
            return;
        }

        const list = circuits.map((c, i) => `${i + 1}. ${c.name}`).join('\n');
        const index = prompt(`Select circuit:\n${list}`);

        if (index && circuits[parseInt(index) - 1]) {
            const circuit = circuits[parseInt(index) - 1];
            const detailResponse = await fetch(`${API_BASE}/circuits/${circuit.id}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            const data = await detailResponse.json();
            state.components = data.components || [];
            state.wires = data.wires || [];
        }
    } catch (error) {
        console.error('Load error:', error);
    }
};

window.runSimulation = async function () {
    alert('Running simulation...');
    // Implement simulation
};

window.stopSimulation = function () {
    state.simulationRunning = false;
};

window.resetCanvas = function () {
    state.zoom = 1.0;
    state.panOffset = { x: 0, y: 0 };
};

window.zoom = function (delta) {
    state.zoom = Math.max(0.1, Math.min(5, state.zoom + delta));
};

// Authentication
window.showLoginModal = function () {
    document.getElementById('loginModal').classList.add('active');
};

window.closeModal = function (id) {
    document.getElementById(id).classList.remove('active');
};

window.login = async function () {
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
        }
    } catch (error) {
        console.error('Login error:', error);
    }
};

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
        console.error('Auth error:', error);
    }
}


// Category Collapse/Expand
document.addEventListener('DOMContentLoaded', function () {
    // Add click handlers to category titles
    document.querySelectorAll('.category-title').forEach(title => {
        title.addEventListener('click', function () {
            this.classList.toggle('collapsed');
            const content = this.nextElementSibling;
            if (content && content.classList.contains('category-content')) {
                content.style.display = content.style.display === 'none' ? 'grid' : 'none';
            }
        });
    });
});

// Wire Routing Debug Mode
window.toggleWireDebug = function () {
    if (!state.showRoutingDebug) {
        state.showRoutingDebug = true;
        document.getElementById('debugBtn').style.background = '#10b981';
        document.getElementById('debugBtn').style.color = 'white';
        document.getElementById('debugBtn').style.borderColor = '#10b981';
        console.log('✓ Wire routing debug mode ENABLED - showing clearance zones');
    } else {
        state.showRoutingDebug = false;
        document.getElementById('debugBtn').style.background = '';
        document.getElementById('debugBtn').style.color = '';
        document.getElementById('debugBtn').style.borderColor = '';
        console.log('✗ Wire routing debug mode DISABLED');
    }
    draw();
};

// Set wire color
window.setWireColor = function (color) {
    state.currentWireColor = color;
    console.log(`Wire color set to: ${color}`);

    // Visual feedback - highlight selected color button
    document.querySelectorAll('.toolbar button[onclick^="setWireColor"]').forEach(btn => {
        if (btn.onclick.toString().includes(color)) {
            btn.style.border = '3px solid #000';
            btn.style.boxShadow = '0 0 10px ' + color;
        } else {
            btn.style.border = '1px solid #ddd';
            btn.style.boxShadow = 'none';
        }
    });
};

// Update measurements display
function updateMeasurements() {
    if (!state.selectedComponent) {
        document.getElementById('voltageDisplay').textContent = '--';
        document.getElementById('currentDisplay').textContent = '--';
        document.getElementById('powerDisplay').textContent = '--';
        return;
    }

    const comp = state.selectedComponent;
    const def = PROFESSIONAL_COMPONENTS[comp.type];

    if (!def) return;

    // Display component properties as measurements (with safety checks)
    if (def.properties && def.properties.voltage) {
        document.getElementById('voltageDisplay').textContent =
            def.properties.voltage.value + ' ' + def.properties.voltage.unit;
    } else {
        document.getElementById('voltageDisplay').textContent = '--';
    }

    if (def.properties && def.properties.current) {
        document.getElementById('currentDisplay').textContent =
            def.properties.current.value + ' ' + def.properties.current.unit;
    } else {
        document.getElementById('currentDisplay').textContent = '--';
    }

    if (def.properties && def.properties.power) {
        document.getElementById('powerDisplay').textContent =
            def.properties.power.value + ' ' + def.properties.power.unit;
    } else {
        document.getElementById('powerDisplay').textContent = '--';
    }
}

// Wire properties panel
function updateWirePropertiesPanel(wire) {
    const panel = document.getElementById('propertiesContent');
    if (!panel) return;

    const fromComp = state.components.find(c => c.id === wire.from.componentId);
    const toComp = state.components.find(c => c.id === wire.to.componentId);

    panel.innerHTML = `
        <div style="margin-bottom: 15px;">
            <strong style="color: #667eea;">Wire Selected</strong>
        </div>
        <div class="property-row">
            <div class="property-label">Wire ID:</div>
            <div style="font-family: monospace; font-size: 11px;">${wire.id}</div>
        </div>
        <div class="property-row">
            <div class="property-label">From:</div>
            <div>${fromComp ? fromComp.type : 'Unknown'} (${wire.from.portId})</div>
        </div>
        <div class="property-row">
            <div class="property-label">To:</div>
            <div>${toComp ? toComp.type : 'Unknown'} (${wire.to.portId})</div>
        </div>
        <div class="property-row">
            <div class="property-label">Color:</div>
            <select id="wireColorSelect" onchange="changeWireColor('${wire.id}', this.value)" style="width: 100%; padding: 5px;">
                <option value="#2563eb" ${wire.color === '#2563eb' ? 'selected' : ''}>🔵 Blue</option>
                <option value="#dc2626" ${wire.color === '#dc2626' ? 'selected' : ''}>🔴 Red</option>
                <option value="#16a34a" ${wire.color === '#16a34a' ? 'selected' : ''}>🟢 Green</option>
                <option value="#eab308" ${wire.color === '#eab308' ? 'selected' : ''}>🟡 Yellow</option>
                <option value="#000000" ${wire.color === '#000000' ? 'selected' : ''}>⚫ Black</option>
                <option value="#ea580c" ${wire.color === '#ea580c' ? 'selected' : ''}>🟠 Orange</option>
                <option value="#9333ea" ${wire.color === '#9333ea' ? 'selected' : ''}>🟣 Purple</option>
                <option value="#78350f" ${wire.color === '#78350f' ? 'selected' : ''}>🟤 Brown</option>
            </select>
        </div>
        <div class="property-row" style="margin-top: 15px;">
            <button onclick="deleteWire('${wire.id}')" style="width: 100%; padding: 10px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">
                🗑️ Delete Wire
            </button>
        </div>
        <div class="property-row">
            <button onclick="rerouteWire('${wire.id}')" style="width: 100%; padding: 10px; background: #7c3aed; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px;">
                🔄 Re-route Wire
            </button>
        </div>
    `;
}

// Wire context menu
function showWireContextMenu(pos, wire) {
    // Remove existing menu if any
    const existing = document.getElementById('wireContextMenu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.id = 'wireContextMenu';
    menu.style.cssText = `
        position: fixed;
        left: ${pos.x}px;
        top: ${pos.y}px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 44px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        min-width: 150px;
    `;

    menu.innerHTML = `
        <div onclick="changeWireColorMenu('${wire.id}')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            🎨 Change Color
        </div>
        <div onclick="rerouteWire('${wire.id}')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            🔄 Re-route
        </div>
        <div onclick="deleteWire('${wire.id}')" style="padding: 10px; cursor: pointer; color: #dc2626;">
            🗑️ Delete
        </div>
    `;

    document.body.appendChild(menu);

    // Close menu when clicking elsewhere
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Wire operations
window.deleteWire = function (wireId) {
    const wireIndex = state.wires.findIndex(w => w.id === wireId);
    if (wireIndex === -1) return;

    const wire = state.wires[wireIndex];

    // Remove from port connections
    const fromComp = state.components.find(c => c.id === wire.from.componentId);
    const toComp = state.components.find(c => c.id === wire.to.componentId);

    if (fromComp) {
        const port = fromComp.ports.find(p => p.id === wire.from.portId);
        if (port && port.connections) {
            port.connections = port.connections.filter(id => id !== wireId);
        }
    }

    if (toComp) {
        const port = toComp.ports.find(p => p.id === wire.to.portId);
        if (port && port.connections) {
            port.connections = port.connections.filter(id => id !== wireId);
        }
    }

    state.wires.splice(wireIndex, 1);
    state.selectedWire = null;

    updatePropertiesPanel();
    draw();

    console.log('Wire deleted:', wireId);
};

window.changeWireColor = function (wireId, color) {
    const wire = state.wires.find(w => w.id === wireId);
    if (wire) {
        wire.color = color;
        draw();
        console.log(`Wire ${wireId} color changed to ${color}`);
        if (wire) {
            updateWirePropertiesPanel(wire);
        }
    }
};

// Undo/Redo Functions
window.undo = function () {
    if (historyManager && historyManager.canUndo()) {
        const previousState = historyManager.undo(state);
        if (previousState) {
            state.components = previousState.components || [];
            state.wires = previousState.wires || [];
            state.selectedComponent = null;
            state.selectedWire = null;
            updatePropertiesPanel();
            showToast('⏪ Undo');
        }
    } else {
        showToast('⚠️ Nothing to undo');
    }
};

window.redo = function () {
    if (historyManager && historyManager.canRedo()) {
        const nextState = historyManager.redo(state);
        if (nextState) {
            state.components = nextState.components || [];
            state.wires = nextState.wires || [];
            state.selectedComponent = null;
            state.selectedWire = null;
            updatePropertiesPanel();
            showToast('⏩ Redo');
        }
    } else {
        showToast('⚠️ Nothing to redo');
    }
};

// New circuit with history clear
window.newCircuit = function () {
    if (confirm('Clear circuit and start new?')) {
        state.components = [];
        state.wires = [];
        state.selectedComponent = null;
        state.selectedWire = null;
        if (historyManager) {
            historyManager.undoStack = [];
            historyManager.redoStack = [];
        }
        updatePropertiesPanel();
        showToast('📄 New circuit created');
    }
};

// Reset canvas
window.resetCanvas = function () {
    state.zoom = 1.0;
    state.panOffset = { x: 0, y: 0 };
    showToast('🔄 Canvas reset');
};

// Template functions
window.toggleTemplateMenu = function () {
    const menu = document.getElementById('templateMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
};

window.toggleExportMenu = function () {
    const menu = document.getElementById('exportMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
};

window.addTemplateToCircuit = function (templateType, x, y) {
    console.log('Adding template:', templateType, 'at', x, y);

    const templates = {
        DOL_STARTER: [
            { type: 'mcb_3phase', x: x, y: y },
            { type: 'contactor_3pole', x: x, y: y + 100 },
            { type: 'thermal_overload', x: x, y: y + 200 },
            { type: 'motor_ac_3phase', x: x, y: y + 300 }
        ],
        STAR_DELTA_STARTER: [
            { type: 'mcb_3phase', x: x, y: y },
            { type: 'contactor_3pole', x: x - 100, y: y + 100 },
            { type: 'contactor_3pole', x: x, y: y + 100 },
            { type: 'contactor_3pole', x: x + 100, y: y + 100 },
            { type: 'motor_ac_3phase', x: x, y: y + 250 }
        ],
        FORWARD_REVERSE_STARTER: [
            { type: 'mcb_3phase', x: x, y: y },
            { type: 'contactor_3pole', x: x - 80, y: y + 100 },
            { type: 'contactor_3pole', x: x + 80, y: y + 100 },
            { type: 'motor_ac_3phase', x: x, y: y + 250 }
        ],
        VFD_MOTOR_DRIVE: [
            { type: 'mcb_3phase', x: x, y: y },
            { type: 'vfd_3phase', x: x, y: y + 120 },
            { type: 'motor_ac_3phase', x: x, y: y + 280 }
        ]
    };

    const template = templates[templateType];
    if (!template) {
        showToast('❌ Template not found');
        return;
    }

    saveStateToHistory();

    template.forEach(compDef => {
        const def = PROFESSIONAL_COMPONENTS[compDef.type];
        if (!def) {
            console.warn('Component type not found:', compDef.type);
            return;
        }

        const component = {
            id: 'comp_' + state.componentCounter++,
            type: compDef.type,
            x: compDef.x,
            y: compDef.y,
            rotation: 0,
            properties: JSON.parse(JSON.stringify(def.properties || {})),
            ports: JSON.parse(JSON.stringify(def.ports || []))
        };

        state.components.push(component);
    });

    showToast(`✅ Added ${templateType.replace(/_/g, ' ')}`);
};

// Simulation functions
window.runSimulation = function () {
    if (state.simulationRunning) {
        showToast('⚠️ Simulation already running');
        return;
    }

    if (state.components.length === 0) {
        showToast('⚠️ No components to simulate');
        return;
    }

    state.simulationRunning = true;
    showToast('▶️ Running DC Analysis...');
    console.log('🔬 Simulation started');

    try {
        // Initialize advanced circuit solver
        if (typeof AdvancedCircuitSolver === 'undefined') {
            console.error('AdvancedCircuitSolver not loaded');
            showToast('❌ Simulation engine not loaded');
            state.simulationRunning = false;
            return;
        }

        const solver = new AdvancedCircuitSolver();
        const results = solver.simulate(state.components, state.wires, 'dc');

        if (!results.success) {
            showToast('❌ ' + results.error);
            console.error('Simulation failed:', results.error);
            state.simulationRunning = false;
            return;
        }

        // Update component display with results
        state.components.forEach(comp => {
            if (results.currents[comp.id] !== undefined) {
                comp.simulatedCurrent = results.currents[comp.id];
                comp.simulatedPower = results.powers[comp.id];
            }
            if (comp.nodes && comp.nodes[0] !== undefined) {
                comp.simulatedVoltage = results.voltages[comp.nodes[0]] || 0;
            }
        });

        // Display results in panel
        updateSimulationResults(results);

        // Show warnings and errors
        if (results.warnings && results.warnings.length > 0) {
            console.warn('⚠️ Simulation warnings:', results.warnings);
            results.warnings.forEach(w => {
                showToast('⚠️ ' + w.message, 'warning');
            });
        }

        if (results.errors && results.errors.length > 0) {
            console.error('❌ Simulation errors:', results.errors);
            results.errors.forEach(e => {
                showToast('❌ ' + e.message, 'error');
            });
        }

        showToast('✅ Simulation completed successfully');
        console.log('✅ Simulation results:', results);

    } catch (error) {
        console.error('Simulation error:', error);
        showToast('❌ Simulation error: ' + error.message);
        state.simulationRunning = false;
    }
};

window.stopSimulation = function () {
    if (!state.simulationRunning) {
        showToast('⚠️ No simulation running');
        return;
    }

    state.simulationRunning = false;
    showToast('⏹️ Simulation stopped');
    console.log('Simulation stopped');
};

window.analyzePowerFlow = function () {
    if (state.components.length === 0) {
        showToast('⚠️ No components to analyze');
        return;
    }

    showToast('📊 Performing electrical analysis...');
    console.log('🔍 Power flow analysis started');

    try {
        // Initialize electrical engineer
        if (typeof ElectricalEngineer === 'undefined') {
            console.error('ElectricalEngineer not loaded');
            showToast('❌ Electrical calculator not loaded');
            return;
        }

        const engineer = new ElectricalEngineer();
        const analysis = {
            motors: [],
            wireValidation: [],
            protection: [],
            recommendations: []
        };

        // Analyze motors
        state.components.forEach(comp => {
            if (comp.type === 'motor_ac_3phase') {
                const power = parseFloat(comp.properties?.power?.value || 5.5);
                const starter = engineer.calculateMotorStarter(power);

                analysis.motors.push({
                    id: comp.id,
                    power: power,
                    starter: starter
                });

                console.log(`Motor ${comp.id}:`, starter);

                // Add recommendations
                analysis.recommendations.push({
                    component: comp.id,
                    type: 'MOTOR_STARTER',
                    message: `Motor ${power}kW requires:
                        • Contactor: ${starter.contactor.rating}A
                        • Overload: ${starter.overload.setting}A
                        • MCB: ${starter.mcb.rating}A Type ${starter.mcb.type}
                        • Wire: AWG ${starter.wireSize.awg}`
                });
            }
        });

        // Validate wires
        state.wires.forEach((wire, idx) => {
            if (wire.from && wire.to) {
                const comp = wire.from.comp;
                if (comp.simulatedCurrent) {
                    const current = Math.abs(comp.simulatedCurrent);
                    const length = Math.sqrt(
                        Math.pow(wire.to.comp.x - wire.from.comp.x, 2) +
                        Math.pow(wire.to.comp.y - wire.from.comp.y, 2)
                    ) / 20; // Approximate meters

                    const wireSpec = engineer.calculateWireSize(current, length);

                    if (!wireSpec.safe) {
                        analysis.recommendations.push({
                            component: `Wire ${idx}`,
                            type: 'WIRE_SIZING',
                            message: `Wire undersized for ${current.toFixed(2)}A - use AWG ${wireSpec.awg} or larger`
                        });
                    }

                    analysis.wireValidation.push(wireSpec);
                }
            }
        });

        // Display analysis report
        displayAnalysisReport(analysis);
        showToast('✅ Analysis complete - see console');
        console.log('📊 Electrical Analysis Report:', analysis);

    } catch (error) {
        console.error('Analysis error:', error);
        showToast('❌ Analysis error: ' + error.message);
    }
};

window.toggleWireDebug = function () {
    state.showRoutingDebug = !state.showRoutingDebug;
    const btn = document.getElementById('debugBtn');
    if (btn) {
        btn.style.background = state.showRoutingDebug ? '#ef4444' : '';
        btn.style.color = state.showRoutingDebug ? 'white' : '';
    }
    showToast(state.showRoutingDebug ? '🔧 Debug Mode: ON' : '🔧 Debug Mode: OFF');
};

// Export functions
window.exportCircuitToPDF = async function () {
    showToast('📄 Generating PDF report...');

    try {
        // Check if jsPDF is available
        if (typeof jspdf === 'undefined') {
            // Dynamically load jsPDF
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Circuit Simulator - Professional Report', 20, 20);

        // Date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

        // Circuit diagram (canvas snapshot)
        const canvasData = canvas.toDataURL('image/png');
        doc.addImage(canvasData, 'PNG', 20, 40, 170, 100);

        // Components list
        doc.setFontSize(14);
        doc.text('Bill of Materials (BOM)', 20, 150);
        doc.setFontSize(10);

        let y = 160;
        state.components.forEach((comp, idx) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            const compDef = PROFESSIONAL_COMPONENTS[comp.type] || ELECTRICAL_CONTROL_COMPONENTS[comp.type];
            if (compDef) {
                doc.text(`${idx + 1}. ${compDef.name}`, 25, y);
                y += 7;
            }
        });

        // Save PDF
        doc.save('circuit-report.pdf');
        showToast('✅ PDF exported successfully');

    } catch (error) {
        console.error('PDF export error:', error);
        showToast('❌ PDF export failed: ' + error.message);
    }
};

window.exportCircuitToPNG = function () {
    try {
        // Create a high-resolution canvas
        const scale = 2;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width * scale;
        tempCanvas.height = canvas.height * scale;
        const tempCtx = tempCanvas.getContext('2d');

        // Scale and draw
        tempCtx.scale(scale, scale);
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, canvas.width, canvas.height);
        tempCtx.drawImage(canvas, 0, 0);

        // Download
        tempCanvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'circuit.png';
            a.click();
            showToast('🖼️ Circuit exported to PNG');
        });

    } catch (error) {
        console.error('PNG export error:', error);
        showToast('❌ PNG export failed');
    }
};

window.exportCircuitToJSON = function () {
    const data = {
        components: state.components,
        wires: state.wires,
        version: '1.0'
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.json';
    a.click();
    showToast('💾 Circuit exported to JSON');
};

window.saveCircuit = function () {
    exportCircuitToJSON();
};

window.loadCircuit = function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                state.components = data.components || [];
                state.wires = data.wires || [];
                state.selectedComponent = null;
                state.selectedWire = null;
                updatePropertiesPanel();
                showToast('📂 Circuit loaded');
            } catch (err) {
                showToast('❌ Invalid circuit file');
                console.error(err);
            }
        };
        input.readAsText(file);
    };
    input.click();
};

// Helper function to update simulation results display
function updateSimulationResults(results) {
    // Update selected component panel if a component is selected
    if (state.selectedComponent) {
        const comp = state.selectedComponent;
        const voltage = comp.simulatedVoltage || 0;
        const current = comp.simulatedCurrent || 0;
        const power = comp.simulatedPower || 0;

        // Update measurement displays
        const voltageDisplay = document.getElementById('voltageDisplay');
        const currentDisplay = document.getElementById('currentDisplay');
        const powerDisplay = document.getElementById('powerDisplay');

        if (voltageDisplay) voltageDisplay.textContent = voltage.toFixed(3) + ' V';
        if (currentDisplay) currentDisplay.textContent = (current * 1000).toFixed(2) + ' mA';
        if (powerDisplay) powerDisplay.textContent = (power * 1000).toFixed(2) + ' mW';
    }
}

// Helper function to display analysis report
function displayAnalysisReport(analysis) {
    console.log('═══════════════════════════════════════════');
    console.log('📊 ELECTRICAL ANALYSIS REPORT');
    console.log('═══════════════════════════════════════════');

    if (analysis.motors.length > 0) {
        console.log('\n🔌 MOTOR ANALYSIS:');
        analysis.motors.forEach(motor => {
            console.log(`\nMotor ${motor.id} (${motor.power} kW):`);
            console.log(`  Full Load Current: ${motor.starter.fullLoadCurrent.toFixed(2)} A`);
            console.log(`  Starting Current: ${motor.starter.startingCurrent.toFixed(2)} A`);
            console.log(`  Contactor: ${motor.starter.contactor.rating}A (${motor.starter.contactor.type})`);
            console.log(`  Overload: ${motor.starter.overload.setting.toFixed(1)}A`);
            console.log(`  MCB: ${motor.starter.mcb.rating}A Type ${motor.starter.mcb.type}`);
            console.log(`  Wire Size: AWG ${motor.starter.wireSize.awg}`);
        });
    }

    if (analysis.recommendations.length > 0) {
        console.log('\n⚠️  RECOMMENDATIONS:');
        analysis.recommendations.forEach((rec, idx) => {
            console.log(`\n${idx + 1}. ${rec.type} - ${rec.component}`);
            console.log(`   ${rec.message}`);
        });
    }

    console.log('\n═══════════════════════════════════════════');
}

// Initialize when DOM is ready
console.log('✅ Professional Circuit Engine loaded');
