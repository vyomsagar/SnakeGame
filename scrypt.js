 // --- Game Constants ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const tileSize = 20;
    const tileCount = canvas.width / tileSize;
    const snakeColor = "#60e891";
    const foodColor = "#ff7889";
    const snakeHeadColor = "#43eecb";
    const gridColor = "rgba(255,255,255,0.08)";
    let snake, direction, food, score, gameOver, nextDirection;

     // --- Initialize Game State ---
    function startGame() {
      snake = [{ x: 10, y: 10 }];
      direction = { x: 0, y: -1 };
      nextDirection = { ...direction };
      placeFood();
      score = 0;
      gameOver = false;
      document.getElementById('gameOver').style.display = 'none';
      document.getElementById('score').textContent = "Score: 0";
      window.requestAnimationFrame(gameLoop);
    }

    function placeFood() {
      while (true) {
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        };
        // Don't put food on the snake
        if (!snake.some(seg => seg.x === food.x && seg.y === food.y)) {
          break;
        }
      }
    }

      // --- Keyboard Controls ---
    window.addEventListener('keydown', e => {
      if (gameOver && e.code === "Space") { startGame(); }
      if (e.key === "ArrowUp" && direction.y !== 1)    nextDirection = { x:0, y:-1 };
      if (e.key === "ArrowDown" && direction.y !== -1) nextDirection = { x:0, y:1 };
      if (e.key === "ArrowLeft" && direction.x !== 1)  nextDirection = { x:-1, y:0 };
      if (e.key === "ArrowRight" && direction.x !== -1)nextDirection = { x:1, y:0 };
    });

    
    // --- Game Loop ---
    let lastFrame = 0;
    let moveInterval = 115; // milliseconds per move (speed)

    function gameLoop(now = 0) {
      if (gameOver) return;
      // Control speed via timestamp diff
      if (now - lastFrame > moveInterval) {
        lastFrame = now;
        update();
        draw();
      }
      window.requestAnimationFrame(gameLoop);
    }


     function update() {
      // Move Snake
      direction = nextDirection;
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
      };
      // Wall Collision
      if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
        return endGame();
      }
      // Self-Collision
      if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        return endGame();
      }
      // Move
      snake.unshift(newHead);

      // Eat Food
      if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        document.getElementById('score').textContent = "Score: " + score;
        placeFood();
      } else {
        snake.pop();
      }
    }

    function draw() {
      // Gradient BG
      const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
      grad.addColorStop(0, "#3d4453");
      grad.addColorStop(1, "#232037");
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,canvas.width,canvas.height);

      // Grid (for style)
      ctx.save();
      ctx.strokeStyle = gridColor;
      for(let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i*tileSize, 0);
        ctx.lineTo(i*tileSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i*tileSize);
        ctx.lineTo(canvas.width, i*tileSize);
        ctx.stroke();
      }
      ctx.restore();

      // Food
      ctx.fillStyle = foodColor;
      ctx.beginPath();
      ctx.arc(
        food.x * tileSize + tileSize/2,
        food.y * tileSize + tileSize/2,
        tileSize * 0.38,
        0, 2*Math.PI
      );
      ctx.fill();

        // Snake
      for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? snakeHeadColor : snakeColor;
        ctx.beginPath();
        ctx.roundRect(
          snake[i].x * tileSize + 2,
          snake[i].y * tileSize + 2,
          tileSize-4, tileSize-4, 6
        );
        ctx.fill();
      }
    }

    function endGame() {
      gameOver = true;
      document.getElementById('gameOver').style.display = '';
    }

    // --- Polyfill for roundRect (if needed) ---
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
      };
    }

     // --- Start ---
    startGame();
    
    
