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
let finalScore = 0;
let gap = 100;
let pipes = [];
let gameOver = false;

pipes[0] = {
    x: canvas.width,
    y: 0,
    passed: false
};

// Bird flap
document.addEventListener('keydown', (e) => {
    if (gameOver) {
        location.reload();
    }
    if (e.code === 'ArrowUp') {
        birdVelocity = -6;
    } else if (e.code === 'ArrowDown') {
        birdVelocity = 6;
    }
});

function draw() {
    if (gameOver) {
        ctx.fillStyle = '#000';
        ctx.font = '30px Verdana';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 50);
        ctx.font = '20px Verdana';
        ctx.fillText('Final Score: ' + finalScore, canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Press any key to restart', canvas.width / 2 - 120, canvas.height / 2 + 50);
        return;
    }
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
                y: Math.floor(Math.random() * pipeImg.height) - pipeImg.height,
                passed: false
            });
        }

        // Collision detection
        if (birdX + birdImg.width >= pipes[i].x && birdX <= pipes[i].x + pipeImg.width &&
            (birdY <= pipes[i].y + pipeImg.height || birdY + birdImg.height >= pipes[i].y + pipeImg.height + gap)) {
            gameOver = true;
            finalScore = score;
        }

        // Score
        if (!pipes[i].passed && pipes[i].x < birdX) {
            score += 10;
            pipes[i].passed = true;
        }

        // Remove pipes that are off-screen
        if (pipes[i].x < -pipeImg.width) {
            pipes.splice(i, 1);
            i--; // Decrement i to avoid skipping the next pipe
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
