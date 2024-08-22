const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;

(function setup() {
    canvas.width = 600;
    canvas.height = 600;
    snake = new Snake();
    snake.draw();
})();

function Snake() {
    this.x = 0; //current position of snake
    this.y = 0;
    this.xSpeed = scale * 1;//speed of snake
    this.ySpeed = 0;

    this.draw = function() {
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(this.x, this.y, scale, scale);
    }

    this.update = function() {//update the podition of snake
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
}


Snake.prototype.update = function() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x >= canvas.width) {this.x = 0;}
    if (this.y >= canvas.height) {this.y = 0;}
    if (this.x < 0) {this.x = canvas.width - scale;}
    if (this.y < 0) {this.y = canvas.height - scale;}
}

Snake.prototype.changeDirection = function(direction) {
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

document.addEventListener('keydown', function(e) {
    const direction = e.key.replace('Arrow', '');
    snake.changeDirection(direction);
});


(function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();

    setTimeout(gameLoop, 100);
})();


//food for snake

function Food() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
    }

    this.draw = function() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

let food = new Food();
food.pickLocation();

Snake.prototype.update = function() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x === food.x && this.y === food.y) {
        food.pickLocation();
    }

    if (this.x >= canvas.width) this.x = 0;
    if (this.y >= canvas.height) this.y = 0;
    if (this.x < 0) this.x = canvas.width - scale;
    if (this.y < 0) this.y = canvas.height - scale;
}


//movement

this.total = 0;
this.tail = [];

Snake.prototype.update = function() {
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
            this.total = 0;
            this.tail = [];
        }
    }
}

Snake.prototype.draw = function() {
    ctx.fillStyle = "#00FF00";

    for (let i = 0; i < this.tail.length; i++) {
        ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

    ctx.fillRect(this.x, this.y, scale, scale);
}


