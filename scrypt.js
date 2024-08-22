const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake, food;
let gameOver = false;

(function setup() {
    canvas.width = 600;
    canvas.height = 600;

    snake = new Snake();
    food = new Food();
    food.pickLocation();
    
    gameLoop();
})();

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "#00FF00";
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    }

    this.update = function() {
        if (gameOver) return; // Prevent updates if game is over

        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x === food.x && this.y === food.y) {
            this.total++;
            food.pickLocation();
        }

        if (this.x >= canvas.width) this.x = 0;
        if (this.y >= canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width - scale;
        if (this.y < 0) this.y = canvas.height - scale;

        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                gameOver = true;
                displayGameOver(this.total);
            }
        }
    }

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    }
}

document.addEventListener('keydown', function(e) {
    const key = e.key.toUpperCase();
    let direction;

    switch (key) {
        case 'ArrowUp':
        case 'W':
            direction = 'Up';
            break;
        case 'ArrowDown':
        case 'S':
            direction = 'Down';
            break;
        case 'ArrowLeft':
        case 'A':
            direction = 'Left';
            break;
        case 'ArrowRight':
        case 'D':
            direction = 'Right';
            break;
        default:
            return;
    }

    snake.changeDirection(direction);
});

function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.update();
        snake.draw();
        food.draw();
        setTimeout(gameLoop, 100);
    }
}

function Food() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
    }

    this.draw = function() {
        const radius = scale / 2; // Radius of the round food

        ctx.beginPath();
        ctx.arc(this.x + radius, this.y + radius, radius, 0, Math.PI * 2); // Draw the circle
        ctx.fillStyle = "#ce7133"; // Food color
        ctx.fill(); // Fill the circle with color
        ctx.strokeStyle = "#ce7139"; // Border color    
        ctx.lineWidth = 2; // Border width
        ctx.stroke(); // Draw the border
        ctx.closePath();
    }
}


function displayGameOver(score) {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const restartButton = document.getElementById('restartButton');

    if (gameOverScreen && scoreDisplay && restartButton) {
        gameOverScreen.style.display = 'block';
        scoreDisplay.textContent = 'Score: ' + score;
    } else {
        console.error('One or more elements not found: gameOverScreen, scoreDisplay, restartButton');
    }
}

function restartGame() {
    gameOver = false;
    snake = new Snake();
    food = new Food();
    food.pickLocation();
    document.getElementById('gameOverScreen').style.display = 'none';
    gameLoop();
}

document.getElementById('restartButton').addEventListener('click', restartGame);
