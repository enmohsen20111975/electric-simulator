class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 1000;
        this.init();
    }

    init() {
        // Initialize existing panels as windows
        this.makeDraggable('componentPanel', 'Components');
        this.makeDraggable('propertiesPanel', 'Properties');
    }

    makeDraggable(elementId, title) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Add window class
        element.classList.add('floating-window');

        // Create header if not exists
        let header = element.querySelector('.window-header');
        if (!header) {
            header = document.createElement('div');
            header.className = 'window-header';
            header.innerHTML = `
                <span class="window-title">${title}</span>
                <div class="window-controls">
                    <button class="minimize-btn">_</button>
                    <button class="close-btn">×</button>
                </div>
            `;
            element.insertBefore(header, element.firstChild);
        }

        // Drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        const self = this;

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                self.bringToFront(element);
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, element);
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // Bring to front on click
        element.addEventListener('mousedown', () => this.bringToFront(element));
    }

    bringToFront(element) {
        this.zIndex++;
        element.style.zIndex = this.zIndex;
    }
}

// Initialize
window.windowManager = new WindowManager();
