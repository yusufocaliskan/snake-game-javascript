//Initial Const
const ROWS = 30;
const COLMS = 50;
const SIZE = 10;

let snakeCanvas = document.getElementById("canvas");
let cells = new Map();

//Create the cells
for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLMS; j++) {
    let cell = document.createElement("div");
    cell.style.width = SIZE + "px";
    cell.style.height = SIZE + "px";
    cell.style.border = "1px solid #aaa";
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
function drawSnake(snake) {
  //Current snake position
  const snakePosition = new Set();
  for (let [t, l] of snake) {
    let position = `${t}_${l}`;
    snakePosition.add(position);
  }

  //Draw it
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLMS; j++) {
      let position = `${i}_${j}`;
      const cell = cells.get(position);
      cell.style.background = snakePosition.has(position) ? "black" : null;
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
  theSnakeCurrentPosition.shift();

  let head = theSnakeCurrentPosition[theSnakeCurrentPosition.length - 1];
  flushedDirection = currentDirection;
  let nextDirection = currentDirection;
  console.log(directionQueue);
  while (directionQueue.length > 0) {
    let candidateDirection = directionQueue.shift();
    if (areOpposite(candidateDirection, currentDirection)) {
      continue;
    }
    nextDirection = candidateDirection;

    break;
  }

  currentDirection = nextDirection;
  let nextHead = currentDirection(head);

  if (!isValideHead(nextHead)) {
    snakeCanvas.style.borderColor = "red";
    stopGame();
    return;
  }
  theSnakeCurrentPosition.push(nextHead);
  drawSnake(theSnakeCurrentPosition);
  //dump(directionQueue);
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

function dump(queue) {
  const debug = document.getElementById("debug");
  debug.innerText = queue.map((fn) => fn.name).join(", ");
}

function isValideHead([top, right]) {
  if (top >= ROWS || right >= COLMS) {
    return false;
  }
  return true;
}

function stopGame() {
  clearInterval(interval);
}

drawSnake(theSnakeCurrentPosition);
let interval = setInterval(() => {
  move();
}, 100);
