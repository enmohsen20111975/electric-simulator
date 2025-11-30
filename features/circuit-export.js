/**
 * Circuit Export System
 * Export circuits to PDF with professional formatting
 * Uses jsPDF library for vector graphics
 */

class CircuitExporter {
    constructor() {
        this.loadJsPDF();
    }
    
    /**
     * Load jsPDF library dynamically
     */
    loadJsPDF() {
        if (typeof jspdf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('✓ jsPDF library loaded');
                this.jsPDF = window.jspdf.jsPDF;
            };
            script.onerror = () => {
                console.error('✗ Failed to load jsPDF library');
            };
            document.head.appendChild(script);
        } else {
            this.jsPDF = window.jspdf.jsPDF;
        }
    }
    
    /**
     * Export circuit to PDF
     * @param {string} filename - Output filename
     * @param {object} options - Export options
     */
    async exportToPDF(filename = 'circuit-diagram.pdf', options = {}) {
        if (!this.jsPDF) {
            alert('PDF library not loaded yet. Please try again in a moment.');
            return;
        }
        
        const {
            format = 'a4',
            orientation = 'landscape',
            includeTitle = true,
            includeComponentList = true,
            includeDate = true,
            title = 'Circuit Diagram',
            author = 'Circuit Simulator'
        } = options;
        
        // Create PDF document
        const doc = new this.jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: format
        });
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        let yPos = 15;
        
        // Title section
        if (includeTitle) {
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text(title, pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;
            
            if (includeDate) {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                const dateStr = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                doc.text(`Generated: ${dateStr}`, pageWidth / 2, yPos, { align: 'center' });
                yPos += 5;
                
                doc.text(`Author: ${author}`, pageWidth / 2, yPos, { align: 'center' });
                yPos += 10;
            }
            
            // Separator line
            doc.setLineWidth(0.5);
            doc.line(15, yPos, pageWidth - 15, yPos);
            yPos += 8;
        }
        
        // Capture circuit canvas
        const canvasElement = document.getElementById('circuit-canvas');
        if (!canvasElement) {
            console.error('Canvas element not found');
            return;
        }
        
        // Calculate canvas bounds
        const bounds = this.calculateCircuitBounds();
        
        // Create temporary canvas for clean export
        const tempCanvas = document.createElement('canvas');
        const margin = 50;
        tempCanvas.width = bounds.width + margin * 2;
        tempCanvas.height = bounds.height + margin * 2;
        const tempCtx = tempCanvas.getContext('2d');
        
        // White background
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw grid (optional)
        if (state.gridSize > 0) {
            tempCtx.strokeStyle = '#f0f0f0';
            tempCtx.lineWidth = 0.5;
            for (let x = 0; x < tempCanvas.width; x += state.gridSize) {
                tempCtx.beginPath();
                tempCtx.moveTo(x, 0);
                tempCtx.lineTo(x, tempCanvas.height);
                tempCtx.stroke();
            }
            for (let y = 0; y < tempCanvas.height; y += state.gridSize) {
                tempCtx.beginPath();
                tempCtx.moveTo(0, y);
                tempCtx.lineTo(tempCanvas.width, y);
                tempCtx.stroke();
            }
        }
        
        // Save original context and state
        const originalCtx = window.ctx;
        window.ctx = tempCtx;
        
        // Translate to center circuit in canvas
        tempCtx.save();
        tempCtx.translate(margin - bounds.minX, margin - bounds.minY);
        
        // Draw all wires
        for (const wire of state.wires) {
            this.drawWireForExport(tempCtx, wire);
        }
        
        // Draw junction dots
        if (state.wireJunctions && state.wireJunctions.length > 0) {
            tempCtx.fillStyle = '#1e40af';
            tempCtx.strokeStyle = '#ffffff';
            tempCtx.lineWidth = 1.5;
            for (const junction of state.wireJunctions) {
                tempCtx.beginPath();
                tempCtx.arc(junction.x, junction.y, 5, 0, Math.PI * 2);
                tempCtx.fill();
                tempCtx.stroke();
            }
        }
        
        // Draw all components
        for (const comp of state.components) {
            this.drawComponentForExport(tempCtx, comp);
        }
        
        tempCtx.restore();
        
        // Restore original context
        window.ctx = originalCtx;
        
        // Add canvas image to PDF
        const imgData = tempCanvas.toDataURL('image/png');
        const imgWidth = pageWidth - 30;
        const imgHeight = (tempCanvas.height / tempCanvas.width) * imgWidth;
        
        // Check if image fits on page
        if (yPos + imgHeight > pageHeight - 20) {
            // Scale down to fit
            const scale = (pageHeight - yPos - 20) / imgHeight;
            doc.addImage(imgData, 'PNG', 15, yPos, imgWidth * scale, imgHeight * scale);
        } else {
            doc.addImage(imgData, 'PNG', 15, yPos, imgWidth, imgHeight);
        }
        
        yPos += imgHeight + 10;
        
        // Component list on new page
        if (includeComponentList && state.components.length > 0) {
            doc.addPage();
            yPos = 15;
            
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Bill of Materials', 15, yPos);
            yPos += 8;
            
            // Table headers
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('ID', 15, yPos);
            doc.text('Type', 40, yPos);
            doc.text('Description', 80, yPos);
            doc.text('Parameters', 140, yPos);
            yPos += 5;
            
            // Line under headers
            doc.setLineWidth(0.3);
            doc.line(15, yPos, pageWidth - 15, yPos);
            yPos += 5;
            
            // Component rows
            doc.setFont('helvetica', 'normal');
            const componentsByType = {};
            
            for (const comp of state.components) {
                const def = PROFESSIONAL_COMPONENTS[comp.type] || ELECTRICAL_COMPONENTS[comp.type];
                if (!def) continue;
                
                const typeName = def.name || comp.type;
                if (!componentsByType[typeName]) {
                    componentsByType[typeName] = [];
                }
                componentsByType[typeName].push(comp);
            }
            
            for (const [typeName, components] of Object.entries(componentsByType)) {
                for (const comp of components) {
                    if (yPos > pageHeight - 15) {
                        doc.addPage();
                        yPos = 15;
                    }
                    
                    const def = PROFESSIONAL_COMPONENTS[comp.type] || ELECTRICAL_COMPONENTS[comp.type];
                    
                    // Get main parameter
                    let params = '';
                    if (comp.properties) {
                        const paramStrs = [];
                        for (const [key, prop] of Object.entries(comp.properties)) {
                            if (prop.value !== undefined) {
                                paramStrs.push(`${key}: ${prop.value}${prop.unit || ''}`);
                            }
                        }
                        params = paramStrs.slice(0, 2).join(', ');
                    }
                    
                    doc.text(comp.id, 15, yPos);
                    doc.text(typeName, 40, yPos);
                    doc.text(def.description || def.name || '', 80, yPos);
                    doc.text(params, 140, yPos);
                    yPos += 6;
                }
            }
            
            // Summary
            yPos += 5;
            doc.setFont('helvetica', 'bold');
            doc.text(`Total Components: ${state.components.length}`, 15, yPos);
            yPos += 5;
            doc.text(`Total Wires: ${state.wires.length}`, 15, yPos);
        }
        
        // Footer on all pages
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(128);
            doc.text(
                `Page ${i} of ${totalPages} - Generated by Circuit Simulator`,
                pageWidth / 2,
                pageHeight - 5,
                { align: 'center' }
            );
        }
        
        // Save PDF
        doc.save(filename);
        
        console.log(`✓ Exported circuit to ${filename}`);
        if (window.clipboardManager) {
            window.clipboardManager.showNotification('Circuit exported to PDF', 'success');
        }
    }
    
    /**
     * Calculate bounds of all circuit elements
     */
    calculateCircuitBounds() {
        if (state.components.length === 0) {
            return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
        }
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        // Check components
        for (const comp of state.components) {
            const def = PROFESSIONAL_COMPONENTS[comp.type] || ELECTRICAL_COMPONENTS[comp.type];
            if (!def) continue;
            
            const halfWidth = (def.width || 60) / 2;
            const halfHeight = (def.height || 80) / 2;
            
            minX = Math.min(minX, comp.x - halfWidth - 20);
            minY = Math.min(minY, comp.y - halfHeight - 20);
            maxX = Math.max(maxX, comp.x + halfWidth + 20);
            maxY = Math.max(maxY, comp.y + halfHeight + 20);
        }
        
        // Check wires
        for (const wire of state.wires) {
            for (const point of wire.path) {
                minX = Math.min(minX, point.x);
                minY = Math.min(minY, point.y);
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
            }
        }
        
        return {
            minX,
            minY,
            maxX,
            maxY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
    
    /**
     * Draw component for export (clean version without selection highlights)
     */
    drawComponentForExport(ctx, comp) {
        const def = PROFESSIONAL_COMPONENTS[comp.type] || ELECTRICAL_COMPONENTS[comp.type];
        if (!def || !def.draw) return;
        
        ctx.save();
        ctx.translate(comp.x, comp.y);
        ctx.rotate(comp.rotation * Math.PI / 180);
        
        // Draw component body
        def.draw(ctx, 0, 0, comp.rotation, comp);
        
        // Draw ports
        for (const port of comp.ports) {
            const px = port.localX;
            const py = port.localY;
            
            ctx.fillStyle = port.connections && port.connections.length > 0 ? '#10b981' : '#ef4444';
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Port label
            if (port.label) {
                ctx.fillStyle = '#1f2937';
                ctx.font = 'bold 9px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const labelOffsetX = px > 0 ? 10 : (px < 0 ? -10 : 0);
                const labelOffsetY = py > 0 ? 10 : (py < 0 ? -10 : 0);
                
                ctx.fillText(port.label, px + labelOffsetX, py + labelOffsetY);
            }
        }
        
        ctx.restore();
        
        // Component ID and value (always upright)
        ctx.save();
        
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(comp.id, comp.x, comp.y - def.height / 2 - 8);
        
        // Main property value
        const mainProp = Object.keys(comp.properties)[0];
        if (mainProp && comp.properties[mainProp]) {
            const prop = comp.properties[mainProp];
            const value = `${prop.value}${prop.unit}`;
            
            let valueColor = '#059669';
            if (mainProp.includes('current')) valueColor = '#dc2626';
            if (mainProp.includes('voltage')) valueColor = '#2563eb';
            if (mainProp.includes('power')) valueColor = '#7c3aed';
            
            ctx.fillStyle = valueColor;
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(value, comp.x, comp.y + def.height / 2 + 5);
        }
        
        ctx.restore();
    }
    
    /**
     * Draw wire for export
     */
    drawWireForExport(ctx, wire) {
        ctx.strokeStyle = wire.color || '#2563eb';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
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
        
        // Connection points
        ctx.fillStyle = wire.color || '#2563eb';
        for (const point of [wire.path[0], wire.path[wire.path.length - 1]]) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * Export circuit data as JSON
     */
    exportToJSON(filename = 'circuit-data.json') {
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            metadata: {
                title: 'Circuit Diagram',
                author: 'Circuit Simulator',
                componentCount: state.components.length,
                wireCount: state.wires.length
            },
            components: state.components.map(comp => ({
                id: comp.id,
                type: comp.type,
                x: comp.x,
                y: comp.y,
                rotation: comp.rotation,
                properties: comp.properties
            })),
            wires: state.wires.map(wire => ({
                id: wire.id,
                from: wire.from,
                to: wire.to,
                color: wire.color
            }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log(`✓ Exported circuit data to ${filename}`);
        if (window.clipboardManager) {
            window.clipboardManager.showNotification('Circuit data exported', 'success');
        }
    }
    
    /**
     * Export as PNG image
     */
    exportToPNG(filename = 'circuit-diagram.png', scale = 2) {
        const bounds = this.calculateCircuitBounds();
        const margin = 50;
        
        const canvas = document.createElement('canvas');
        canvas.width = (bounds.width + margin * 2) * scale;
        canvas.height = (bounds.height + margin * 2) * scale;
        const exportCtx = canvas.getContext('2d');
        
        exportCtx.scale(scale, scale);
        
        // White background
        exportCtx.fillStyle = '#ffffff';
        exportCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        if (state.gridSize > 0) {
            exportCtx.strokeStyle = '#f0f0f0';
            exportCtx.lineWidth = 0.5;
            for (let x = 0; x < canvas.width / scale; x += state.gridSize) {
                exportCtx.beginPath();
                exportCtx.moveTo(x, 0);
                exportCtx.lineTo(x, canvas.height / scale);
                exportCtx.stroke();
            }
            for (let y = 0; y < canvas.height / scale; y += state.gridSize) {
                exportCtx.beginPath();
                exportCtx.moveTo(0, y);
                exportCtx.lineTo(canvas.width / scale, y);
                exportCtx.stroke();
            }
        }
        
        // Save original context
        const originalCtx = window.ctx;
        window.ctx = exportCtx;
        
        exportCtx.save();
        exportCtx.translate(margin - bounds.minX, margin - bounds.minY);
        
        // Draw wires
        for (const wire of state.wires) {
            this.drawWireForExport(exportCtx, wire);
        }
        
        // Draw junctions
        if (state.wireJunctions && state.wireJunctions.length > 0) {
            exportCtx.fillStyle = '#1e40af';
            exportCtx.strokeStyle = '#ffffff';
            exportCtx.lineWidth = 1.5;
            for (const junction of state.wireJunctions) {
                exportCtx.beginPath();
                exportCtx.arc(junction.x, junction.y, 5, 0, Math.PI * 2);
                exportCtx.fill();
                exportCtx.stroke();
            }
        }
        
        // Draw components
        for (const comp of state.components) {
            this.drawComponentForExport(exportCtx, comp);
        }
        
        exportCtx.restore();
        window.ctx = originalCtx;
        
        // Download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            
            console.log(`✓ Exported circuit to ${filename}`);
            if (window.clipboardManager) {
                window.clipboardManager.showNotification('Circuit exported to PNG', 'success');
            }
        });
    }
}

// Initialize exporter
window.circuitExporter = new CircuitExporter();

// Export functions for toolbar buttons
function exportCircuitToPDF() {
    const title = prompt('Enter circuit title:', 'Circuit Diagram') || 'Circuit Diagram';
    window.circuitExporter.exportToPDF('circuit-diagram.pdf', {
        title: title,
        includeTitle: true,
        includeComponentList: true,
        includeDate: true
    });
}

function exportCircuitToPNG() {
    window.circuitExporter.exportToPNG('circuit-diagram.png', 2);
}

function exportCircuitToJSON() {
    window.circuitExporter.exportToJSON('circuit-data.json');
}

console.log('✓ Circuit Export system initialized');
console.log('  Available functions:');
console.log('    exportCircuitToPDF() - Export as PDF with bill of materials');
console.log('    exportCircuitToPNG() - Export as high-res PNG image');
console.log('    exportCircuitToJSON() - Export circuit data as JSON');
