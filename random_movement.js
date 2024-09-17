let targetX = 0;
let targetY = 0;

function moveGiraffe() {
    const giraffe = document.getElementById('space-giraffe');
    const currentX = parseFloat(giraffe.style.left) || 0;
    const currentY = parseFloat(giraffe.style.top) || 0;

    // Calculate the distance to the target position, adjusted for scrolling
    const distanceX = (targetX - currentX) * 0.05;
    const distanceY = (targetY + window.scrollY - currentY) * 0.05;

    // Update the giraffe's position with smooth transition
    giraffe.style.left = `${currentX + distanceX}px`;
    giraffe.style.top = `${currentY + distanceY}px`;

    // Continue animating
    requestAnimationFrame(moveGiraffe);
}

// Update target position on mouse move
function updateTargetPosition(event) {
    targetX = event.clientX;
    targetY = event.clientY;
}

// Start moving the giraffe
requestAnimationFrame(moveGiraffe);

// Listen to mouse move events
window.addEventListener('mousemove', updateTargetPosition);
