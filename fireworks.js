// helper functions
const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = _ => new Date().getTime();

// container
class Birthday {
    constructor() {
        this.resize();
        this.fireworks = [];
        this.counter = 0;
        this.animationFrameId = null; // Store the animation frame ID
    }

    resize() {
        this.width = canvas.width = window.innerWidth;
        let center = this.width / 2 | 0;
        this.spawnA = center - center / 4 | 0;
        this.spawnB = center + center / 4 | 0;

        this.height = canvas.height = window.innerHeight;
        this.spawnC = this.height * .1;
        this.spawnD = this.height * .5;

        // Create the gradient background and apply it
        this.createGradientBackground();
    }
    createGradientBackground() {
        // Create a linear gradient
        const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, 'rgba(243, 254, 184, 0.7)'); // Lighten the original colors
        gradient.addColorStop(0.33, 'rgba(255, 222, 77, 0.7)');
        gradient.addColorStop(0.66, 'rgba(255, 178, 44, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 76, 76, 0.7)');

        // Draw the gradient to cover the canvas
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
    }
    onClick(evt) {
        let x = evt.clientX || evt.touches && evt.touches[0].pageX;
        let y = evt.clientY || evt.touches && evt.touches[0].pageY;

        let count = random(3, 5);
        for (let i = 0; i < count; i++) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                x,
                y,
                random(0, 260),
                random(30, 110)
            ));
        }

        this.counter = -1;
    }

    update(delta) {
        ctx.globalCompositeOperation = 'hard-light';
        ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.globalCompositeOperation = 'lighter';
        for (let firework of this.fireworks) firework.update(delta);

        this.counter += delta * 3;
        if (this.counter >= 1) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                random(0, this.width),
                random(this.spawnC, this.spawnD),
                random(0, 360),
                random(30, 110)
            ));
            this.counter = 0;
        }

        if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead);
    }

    start() {
        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    loop() {
        requestAnimationFrame(this.loop.bind(this));
        let now = timestamp();
        let delta = now - then;

        then = now;
        this.update(delta / 1000);
    }
}

class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
        this.dead = false
        this.offsprings = offsprings

        this.x = x
        this.y = y
        this.targetX = targetX
        this.targetY = targetY

        this.shade = shade
        this.history = []
    }
    update(delta) {
        if (this.dead) return

        let xDiff = this.targetX - this.x
        let yDiff = this.targetY - this.y
        if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) { // is still moving
            this.x += xDiff * 2 * delta
            this.y += yDiff * 2 * delta

            this.history.push({
                x: this.x,
                y: this.y
            })

            if (this.history.length > 20) this.history.shift()

        } else {
            if (this.offsprings && !this.madeChilds) {

                let babies = this.offsprings / 2
                for (let i = 0; i < babies; i++) {
                    let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0
                    let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0

                    birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))

                }

            }
            this.madeChilds = true
            this.history.shift()
        }

        if (this.history.length === 0) this.dead = true
        else if (this.offsprings) {
            for (let i = 0; this.history.length > i; i++) {
                let point = this.history[i]
                ctx.beginPath()
                ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)'
                ctx.arc(point.x, point.y, 1, 0, PI2, false)
                ctx.fill()
            }
        } else {
            ctx.beginPath()
            ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)'
            ctx.arc(this.x, this.y, 1, 0, PI2, false)
            ctx.fill()
        }

    }
}
let canvas = document.getElementById('birthday');
let ctx = canvas.getContext('2d');

let then = timestamp();
let birthday = new Birthday();

window.onresize = debounce(() => birthday.resize(), 100);
document.onclick = evt => birthday.onClick(evt);
document.ontouchstart = evt => birthday.onClick(evt);

birthday.start();

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}





const TwoPI = Math.PI * 2;
var w = window.innerWidth;
var h = window.innerHeight;
var center_x = w / 2;
var center_y = h / 2;

var colors = ['#FF0000', '#E8D45B', '#8CFF00']

// I know the abs is not needed... but oh well
var max_distance = Math.abs(Math.max(center_x, center_y));
var min_distance = Math.abs(Math.min(center_x, center_y));
function Firefly() {
    this.velocity = 0;
    var random_angle = Math.random() * TwoPI;
    this.x = center_x + Math.sin(random_angle) * ((Math.random() * (max_distance - min_distance) + min_distance));
    this.y = center_y + Math.cos(random_angle) * ((Math.random() * (max_distance - min_distance) + min_distance));



    this.angle_of_attack = Math.atan2(this.y - center_y, this.x - center_x);
    this.vel = (Math.random() * 5) + 5;

    this.color = colors[~~(colors.length * Math.random())]


    this.xvel = this.vel * Math.cos(this.angle_of_attack);
    this.yvel = this.vel * Math.sin(this.angle_of_attack);
    this.size = 2 + Math.random() * 2;

    this.phase_diff = Math.random() * TwoPI;

}



Firefly.prototype.move = function (dt) {
    if (isOnHeart(this.x, this.y)) {
        this.size -= 0.001;
        return;
    }
    this.x += this.xvel * dt;
    this.y += this.yvel * dt;
}

Firefly.prototype.render = function (ctx, now) {
    if (this.size < 1) {
        return;
    }
    ctx.globalAlpha = Math.max(Math.abs(Math.sin((now + this.phase_diff) / (~~(this.size * 100)))), 0.4);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20 / this.size;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, TwoPI, false);
    ctx.closePath();
    ctx.fill();
}
