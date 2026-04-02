// Defensive handling for missing canvas elements and resize events
const canvas = document.getElementById('myCanvas');

if(canvas) {
    const context = canvas.getContext('2d');
    // ... your existing drawing code ...  
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // ... possibly redraw ...
    });
} else {
    console.error('Canvas element not found!');
}