const canvas = document.getElementById('drawingCanvas');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');

let isDrawing = false;
let currentPath = null;
let paths = [];

const svgNS = "http://www.w3.org/2000/svg";

sizeSlider.addEventListener('input', function() {
    sizeValue.textContent = this.value;
});

function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.viewBox.baseVal.width / rect.width;
    const scaleY = canvas.viewBox.baseVal.height / rect.height;
    
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

canvas.addEventListener('mousedown', function(e) {
    isDrawing = true;
    const pos = getMousePosition(e);
    
    currentPath = document.createElementNS(svgNS, 'path');
    currentPath.setAttribute('fill', 'none');
    currentPath.setAttribute('stroke', colorPicker.value);
    currentPath.setAttribute('stroke-width', sizeSlider.value);
    currentPath.setAttribute('stroke-linecap', 'round');
    currentPath.setAttribute('stroke-linejoin', 'round');
    
    currentPath.setAttribute('d', `M ${pos.x} ${pos.y}`);
    
    canvas.appendChild(currentPath);
});

canvas.addEventListener('mousemove', function(e) {
    if (!isDrawing || !currentPath) return;
    
    const pos = getMousePosition(e);
    
    const currentD = currentPath.getAttribute('d');
    currentPath.setAttribute('d', `${currentD} L ${pos.x} ${pos.y}`);
});

canvas.addEventListener('mouseup', function() {
    if (isDrawing && currentPath) {
        paths.push(currentPath);
        currentPath = null;
    }
    isDrawing = false;
});

canvas.addEventListener('mouseleave', function() {
    if (isDrawing && currentPath) {
        paths.push(currentPath);
        currentPath = null;
    }
    isDrawing = false;
});

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

undoBtn.addEventListener('click', function() {
    if (paths.length > 0) {
        const lastPath = paths.pop();
        canvas.removeChild(lastPath);
    }
});
clearBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all drawings?')) {
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }
        paths = [];
    }
});