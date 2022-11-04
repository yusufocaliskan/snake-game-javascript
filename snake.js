//Initial Const
const ROWS = 30;
const COLMS = 50;
const SIZE = 10;
let snakeCanvas = document.getElementById("canvas");
let cells = new Map();

//GAME STATS
let score = 0;

//Create the cells
for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLMS; j++) {
    let cell = document.createElement("div");
    cell.style.width = SIZE + "px";
    cell.style.height = SIZE + "px";
    cell.style.border = "1px solid rgb(115, 202, 115)";
    cell.style.position = "absolute";
    cell.style.top = `${i * SIZE}px`;
    cell.style.left = `${j * SIZE}px`;

    //append it to the canvas
    snakeCanvas.appendChild(cell);

    let position = `${i}_${j}`;
    cells.set(position, cell);
    //also create an array aswell
  }
}

//Drawing the snake based on the coordination
function drawSnake(snake, food) {
  //Current snake position
  //getSnakePosition(snake);
  const snakePosition = new Set();
  for (let [t, l] of snake) {
    let position = `${t}_${l}`;
    snakePosition.add(position);
  }

  //Draw it
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLMS; j++) {
      let position = getKey([i, j]);
      const cell = cells.get(position);
      let foodPosition = getKey(currentFood);

      cell.style.background =
        foodPosition == position || snakePosition.has(position)
          ? "black"
          : null;
    }
  }
}

//Draw the snake
const theSnakeCurrentPosition = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
];

let currentFood = createNewFoodPosition();

//Controllls
let moveUp = ([t, r]) => [t - 1, r];
let moveDown = ([t, r]) => [t + 1, r];
let moveRight = ([t, r]) => [t, r + 1];
let moveLeft = ([t, r]) => [t, r - 1];
let currentDirection = moveRight;
let flushedDirection;
let directionQueue = [];

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "W":
    case "w":
      if (flushedDirection !== moveDown) {
        directionQueue.push(moveUp);
      }

      break;
    case "ArrowLeft":
    case "A":
    case "a":
      if (flushedDirection !== moveRight) {
        directionQueue.push(moveLeft);
      }
      break;
    case "ArrowDown":
    case "S":
    case "s":
      if (flushedDirection !== moveUp) {
        directionQueue.push(moveDown);
      }

      break;
    case "ArrowRight":
    case "D":
    case "d":
      if (flushedDirection != moveLeft) {
        directionQueue.push(moveRight);
      }
      break;
  }
  // dump(directionQueue);
});

//Moving the snake
function move() {
  let head = theSnakeCurrentPosition[theSnakeCurrentPosition.length - 1];
  flushedDirection = currentDirection;
  let nextDirection = currentDirection;
  while (directionQueue.length > 0) {
    let candidateDirection = directionQueue.shift();

    if (!areOpposite(candidateDirection, currentDirection)) {
      nextDirection = candidateDirection;
      break;
    }
  }

  const snakePossition = getSnakePosition(theSnakeCurrentPosition);
  currentDirection = nextDirection;
  let nextHead = currentDirection(head);

  //Food eat by the snake!
  if (getKey(nextHead) === getKey(currentFood)) {
    currentFood = createNewFoodPosition();
    console.log(currentFood);
    score++;
    //Create tail
    // const tail = createTail(theSnakeCurrentPosition);
    // theSnakeCurrentPosition.push(tail);
    updateScore();
  } else {
    //Let it to be created a tail.
    theSnakeCurrentPosition.shift();
  }

  //is head the wall or itself?
  if (!isValideHead(snakePossition, nextHead)) {
    stopGame();
    return;
  }

  theSnakeCurrentPosition.push(nextHead);
  drawSnake(theSnakeCurrentPosition);
  //dump(directionQueue);
}

function createTail(snake) {
  const first = snake[0];

  const top = first[0] - 1;
  const left = first[1] - 1;
  return [top, left];
}

function getKey([t, l]) {
  return `${t}_${l}`;
}

function areOpposite(dir1, dir2) {
  if (dir1 === moveLeft && dir2 === moveRight) {
    return true;
  }
  if (dir1 === moveRight && dir2 === moveLeft) {
    return true;
  }
  if (dir1 === moveUp && dir2 === moveDown) {
    return true;
  }
  if (dir1 === moveDown && dir2 === moveUp) {
    return true;
  }

  return false;
}

function getSnakePosition(snake) {
  let snakePosition = new Set();
  for (let [top, right] of snake) {
    let position = `${top}_${right}`;
    snakePosition.add(position);
  }
  return snakePosition;
}

/**
 * is it hit the vals?
 * @returns boolean
 */
function isValideHead(snake, [top, right]) {
  if (top < 0 || right < 0) {
    return false;
  }

  if (top >= ROWS || right >= COLMS) {
    return false;
  }
  let position = `${top}_${right}`;
  if (snake.has(position)) {
    return false;
  }

  return true;
}

function createNewFoodPosition() {
  const top = Math.floor(Math.random() * ROWS);
  const left = Math.floor(Math.random() * COLMS);
  return [top, left];
}

/**
 * Stoping the game..
 */
function stopGame() {
  clearInterval(interval);
  snakeCanvas.style.borderColor = "red";
  updateScore();
  score = 0;
}

function updateScore() {
  const scoreElement = document.querySelector(".score span");
  scoreElement.innerText = score;
}

function dump(queue) {
  const debug = document.getElementById("debug");
  debug.innerText = queue.map((fn) => fn.name).join(", ");
}

//Draw the snaakkkke ssss...
drawSnake(theSnakeCurrentPosition);
let interval = setInterval(() => {
  move();
}, 100);
