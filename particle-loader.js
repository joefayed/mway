// particle-loader.js
const Loadr = new (function Loadr(id) {
    // Constants
    const MAX_SIZE = 24;
    const MAX_PARTICLES = 2500;
    const MIN_VEL = 30;
    const MAX_GENERATION_PER_FRAME = 20;
    const MOUSE_INFLUENCE_RADIUS = 50;
    const ANIMATION_DURATION = 10000; // 10 seconds

    // Variables
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    let particles = [];
    let lastTime = Date.now();
    let mousePos = { x: centerX, y: centerY };
    let mouseActive = false;
    const startTime = Date.now();

    // Function to check if a point is inside the heart shape
    function isInsideHeart(x, y) {
        x = ((x - centerX) / centerX) * 3;
        y = ((y - centerY) / centerY) * -3;

        const x2 = x * x;
        const y2 = y * y;

        return (Math.pow(x2 + y2 - 1, 3) - x2 * y2 * y) < 0;
    }

    // Function to generate random values
    function random(size, freq) {
        let val = 0;
        let iter = freq;

        do {
            size /= iter;
            iter += freq;
            val += size * Math.random();
        } while (size >= 1);

        return val;
    }

    // Particle class definition
    function Particle() {
        let x = centerX;
        let y = centerY;
        const size = Math.floor(random(MAX_SIZE, 2.4));
        let x_vel = ((MAX_SIZE + MIN_VEL - size) / 2) - (Math.random() * (MAX_SIZE + MIN_VEL - size));
        let y_vel = ((MAX_SIZE + MIN_VEL - size) / 2) - (Math.random() * (MAX_SIZE + MIN_VEL - size));
        let nx = x;
        let ny = y;
        const alpha = 0.05 * size;

        this.draw = function () {
            const r = Math.floor(255 * (x / width));
            const g = Math.floor(255 * (1 - y / height));
            const b = 255 - r;
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        };

        this.move = function (dt) {
            // Attraction to mouse if active
            if (mouseActive) {
                const dx = mousePos.x - x;
                const dy = mousePos.y - y;
                const distance = Math.hypot(dx, dy);
                if (distance < MOUSE_INFLUENCE_RADIUS) {
                    const force = (MOUSE_INFLUENCE_RADIUS - distance) / MOUSE_INFLUENCE_RADIUS;
                    const directionX = (dx / distance) * force * dt * 100;
                    const directionY = (dy / distance) * force * dt * 100;

                    nx += directionX;
                    ny += directionY;
                }
            }
            nx += x_vel * dt;
            ny += y_vel * dt;
            if (!isInsideHeart(nx, ny)) {
                if (!isInsideHeart(nx, y)) {
                    x_vel *= -1;
                } else if (!isInsideHeart(x, ny)) {
                    y_vel *= -1;
                } else {
                    [x_vel, y_vel] = [-y_vel, -x_vel]; // Swap velocities
                }
                return;
            }

            x = nx;
            y = ny;
        };
    }

    // Stop method
    this.stop = function () {
        const fadeOutDuration = 1000; // 1 second fade out
        const fadeOutStartTime = Date.now();

        function fadeOut() {
            const now = Date.now();
            const elapsed = now - fadeOutStartTime;
            const progress = elapsed / fadeOutDuration;

            if (progress < 1) {
                ctx.globalAlpha = 1 - progress;
                ctx.clearRect(0, 0, width, height);
                particles.forEach(p => p.draw());
                requestAnimationFrame(fadeOut);
            } else {
                particles = []; // Clear all particles
                ctx.clearRect(0, 0, width, height); // Clear the canvas
                ctx.globalAlpha = 1; // Reset alpha
            }
        }

        fadeOut();
    };

    // Main animation loop
    function tick() {
        // Movement and adding new particles
        const len = particles.length;
        const dead = MAX_PARTICLES - len;
        for (let i = 0; i < dead && i < MAX_GENERATION_PER_FRAME; i++) {
            particles.push(new Particle());
        }

        const now = Date.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        particles.forEach(p => p.move(dt));

        // Drawing
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => p.draw());

        // Check if the animation duration has passed
        if (now - startTime >= ANIMATION_DURATION) {
            // Dispatch an event to indicate the animation is done
            canvas.dispatchEvent(new Event('animationDone'));
        }

        requestAnimationFrame(tick);
    }

    // Start the animation
    this.start = function () {
        tick();
    };

    // Handle mouse movement
    canvas.addEventListener('mousemove', event => {
        const rect = canvas.getBoundingClientRect();
        mousePos.x = event.clientX - rect.left;
        mousePos.y = event.clientY - rect.top;
        mouseActive = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseActive = false;
    });

    // Automatically start the animation
    this.start();

})("loader");
