// Variable declarations  

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var pi = Math.PI,
    leftPressed = false,
    rightPressed = false,
    score = 0,
    lives = 3,
    ball = { x: canvas.width/2, y: canvas.height-30, r: 10, dx: 1, dy: -1 }
    paddle = { x: 0, y: 0, w: 100, h: 10 }
    brick = { row: 3, col: 3, w: 0, h: 10, x: 0, y: 0, gapBetween: 10, gapT: 30, gapLR: 30 }, //LR left right, T top only
    paddle.x = (canvas.width - paddle.w) / 2,
    paddle.y = canvas.height - paddle.h,
    brickContainer = canvas.width - 2 * brick.gapLR,
    brick.w = (brickContainer - (brick.col-1) * brick.gapBetween) / brick.col;  //generate brick width

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if(e.keyCode == 37) {
    leftPressed = true;
  } else if(e.keyCode == 39) {
    rightPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.keyCode == 37) {
    leftPressed = false;
  } else if(e.keyCode == 39) {
    rightPressed = false;
  }
}

document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    if(relativeX > 0 && relativeX < paddle.w/2) {
      paddle.x = 0;
    } else if(relativeX < canvas.width && relativeX > canvas.width-paddle.w/2) {
        paddle.x = canvas.width - paddle.w;
    } else {
        paddle.x = relativeX - paddle.w/2;
    }
  }
}

bricks = [];
for(var r = 0; r < brick.row; r++) {
  bricks[r] = [];
  for(var c = 0; c < brick.col; c++) {
    bricks[r][c] =  {x: 0, y: 0, status: 1}
  }
}

function drawBricks() {
  for (var r = 0; r < brick.row; r++) {
    for ( var c = 0; c < brick.col; c++) {
      if(bricks[r][c].status == 1 ) {
        brick.x = brick.gapLR + c * (brick.w + brick.gapBetween);
        brick.y = brick.gapT + r * (brick.h + brick.gapBetween);
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h); // ctx.rect(x1, y1, x2, y2)
        ctx.fillStyle = "#c0392b";
        ctx.fill();
        ctx.closePath();
        bricks[r][c].x = brick.x;
        bricks[r][c].y = brick.y;
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, 2*pi);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#2c3e50";
  ctx.fill();
  ctx.closePath();
}

function brickDetection() {
  for (var r = 0; r < brick.row; r++) {
    for ( var c = 0; c < brick.col; c++) {
      var b = bricks[r][c];
      if(b.status == 1 ) {
        // if ball touches any brick
        if(ball.x > b.x && ball.x < b.x+brick.w && ball.y > b.y && ball.y < b.y+brick.h) {
          ball.dy = -ball.dy;
          b.status = 0;
          score++;
          if(score == brick.row*brick.col) {
            alert("you win");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width-65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  brickDetection();
  drawScore();
  drawLives();

  // top collision detection
  if(ball.y + ball.dy < ball.r) {
    ball.dy = -ball.dy;
  } else if(ball.y + ball.dy > canvas.height-ball.r) {  // bottom collision detections
      if(ball.x > paddle.x && ball.x < paddle.x + paddle.w) { // paddle collision detection
        ball.dy = -ball.dy;
      } else {
        --lives;
        if(!lives) {
          alert("GAME OVER_____Reload Page ?");
          document.location.reload();
        } else {
          ball.x = canvas.width/2;
          ball.y = canvas.height-30;
          ball.dx = 1;
          ball.dy = -1;
          paddle.x = (canvas.width - paddle.w)/2;
        }
      }
  } else if(ball.x + ball.dx < ball.r || ball.x + ball.dx > canvas.width-ball.r) {
      ball.dx = -ball.dx;
  }
  ball.x += ball.dx;
  ball.y += ball.dy;

  if(rightPressed && paddle.x < canvas.width - paddle.w) { paddle.x += 3 }
  if(leftPressed && paddle.x > 0) { paddle.x -= 3 }

  // requestAnimationFrame(draw);
}

setInterval(draw, 5);
// draw();
