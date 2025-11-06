const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const birdImg = new Image();
const pipeImg = new Image();

birdImg.src = 'assets/bird.png';
pipeImg.src = 'assets/pipe.png';

// Game variables
let birdX = 50;
let birdY = 150;
let birdVelocity = 0;
const gravity = 0.4;
let score = 0;
let gap = 100;
let pipes = [];

pipes[0] = {
    x: canvas.width,
    y: 0
};

// Bird flap
document.addEventListener('keydown', () => {
    birdVelocity = -6;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImg, birdX, birdY);

    // Draw pipes
    for (let i = 0; i < pipes.length; i++) {
        // Draw north pipe (flipped)
        ctx.save();
        ctx.translate(pipes[i].x + pipeImg.width, pipes[i].y + pipeImg.height);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, 0, 0);
        ctx.restore();

        // Draw south pipe
        ctx.drawImage(pipeImg, pipes[i].x, pipes[i].y + pipeImg.height + gap);

        pipes[i].x--;

        if (pipes[i].x == 125) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeImg.height) - pipeImg.height
            });
        }

        // Collision detection
        if (birdX + birdImg.width >= pipes[i].x && birdX <= pipes[i].x + pipeImg.width &&
            (birdY <= pipes[i].y + pipeImg.height || birdY + birdImg.height >= pipes[i].y + pipeImg.height + gap) ||
            birdY + birdImg.height >= canvas.height) {
            location.reload(); // Reload the page to restart the game
        }

        if (pipes[i].x == 5) {
            score++;
        }
    }

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Verdana';
    ctx.fillText('Score : ' + score, 10, canvas.height - 20);

    birdY += birdVelocity;
    birdVelocity += gravity;

    requestAnimationFrame(draw);
}

Promise.all([
    new Promise(resolve => birdImg.onload = resolve),
    new Promise(resolve => pipeImg.onload = resolve)
]).then(draw);
