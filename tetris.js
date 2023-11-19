/* Define the colors of the tetrominoes */
const colors = [
  null,
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "yellow",
  "cyan",
];

/* Define the shapes of the tetrominoes */
const shapes = [
  null,
  [[1, 1, 1, 1]], // I
  [
    [2, 0, 0],
    [2, 2, 2],
  ], // J
  [
    [0, 0, 3],
    [3, 3, 3],
  ], // L
  [
    [4, 4],
    [4, 4],
  ], // O
  [
    [0, 5, 5],
    [5, 5, 0],
  ], // S
  [
    [6, 6, 6],
    [0, 6, 0],
  ], // T
  [
    [7, 7, 0],
    [0, 7, 7],
  ], // Z
];

// Get the canvas element and its context
const canvas = document.getElementById("board");
const context = canvas.getContext("2d");

// Calculate the size of each square
const squareSize = 20;

// Draw a square on the canvas
function drawSquare(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
}

// Create the board matrix
const rows = 20;
const columns = 10;
let board = [];
for (let y = 0; y < rows; y++) {
  board[y] = [];
  for (let x = 0; x < columns; x++) {
    board[y][x] = 0;
  }
}

// Draw the board on the canvas
function drawBoard() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      drawSquare(x, y, colors[board[y][x]]);
    }
  }
}

// Draw the initial board
drawBoard();

// Create a tetromino object
function Tetromino(shape, color) {
  this.shape = shape;
  this.color = color;
  this.x = 0;
  this.y = 0;
}

// Generate a random tetromino
function randomTetromino() {
  let index = Math.floor(Math.random() * shapes.length);
  return new Tetromino(shapes[index], colors[index]);
}

// Create a new tetromino
let tetromino = randomTetromino();

// Draw a tetromino on the canvas
function drawTetromino() {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x] > 0) {
        drawSquare(tetromino.x + x, tetromino.y + y, tetromino.color);
      }
    }
  }
}

// Erase a tetromino from the canvas
function eraseTetromino() {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x] > 0) {
        drawSquare(tetromino.x + x, tetromino.y + y, "black");
      }
    }
  }
}

// Move a tetromino down by one row
function moveDown() {
  // Check if the tetromino can move down
  if (!collision(0, 1, tetromino.shape)) {
    // Erase the current position
    eraseTetromino();
    // Update the y coordinate
    tetromino.y++;
    // Draw the new position
    drawTetromino();
  } else {
    // Lock the tetromino on the board
    lockTetromino();
    // Remove any full rows
    removeRows();
    // Create a new tetromino
    tetromino = randomTetromino();
  }
}

// Move a tetromino left by one column
function moveLeft() {
  // Check if the tetromino can move left
  if (!collision(-1, 0, tetromino.shape)) {
    // Erase the current position
    eraseTetromino();
    // Update the x coordinate
    tetromino.x--;
    // Draw the new position
    drawTetromino();
  }
}

// Move a tetromino right by one column
function moveRight() {
  // Check if the tetromino can move right
  if (!collision(1, 0, tetromino.shape)) {
    // Erase the current position
    eraseTetromino();
    // Update the x coordinate
    tetromino.x++;
    // Draw the new position
    drawTetromino();
  }
}

// Rotate a tetromino clockwise
function rotate() {
  // Clone the original shape
  let shape = JSON.parse(JSON.stringify(tetromino.shape));
  // Transpose the matrix
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < y; x++) {
      [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
    }
  }
  // Reverse the order of the columns
  shape.forEach((row) => row.reverse());
  // Check if the rotation is valid
  if (!collision(0, 0, shape)) {
    // Erase the current position
    eraseTetromino();
    // Update the shape
    tetromino.shape = shape;
    // Draw the new position
    drawTetromino();
  }
}

// Check if a tetromino collides with the board or the edges
function collision(x, y, shape) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      // Ignore empty squares
      if (shape[r][c] === 0) {
        continue;
      }
      // Calculate the coordinates of the square
      let newX = tetromino.x + c + x;
      let newY = tetromino.y + r + y;
      // Check if the square is outside the board
      if (newX < 0 || newX >= columns || newY >= rows) {
        return true;
      }
      // Check if the square is already occupied
      if (board[newY][newX] !== 0) {
        return true;
      }
    }
  }
  return false;
}

// Lock a tetromino on the board
function lockTetromino() {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      // Ignore empty squares
      if (tetromino.shape[y][x] === 0) {
        continue;
      }
      // Check if the game is over
      if (tetromino.y + y < 0) {
        alert("Game Over!");
        // Stop the animation
        cancelAnimationFrame(requestId);
        return;
      }
      // Lock the square on the board
      board[tetromino.y + y][tetromino.x + x] = tetromino.shape[y][x];
    }
  }
}

// Remove any full rows from the board
function removeRows() {
  // Keep track of the number of rows removed
  let rowCount = 0;
  // Loop through the rows from bottom to top
  for (let y = rows - 1; y >= 0; y--) {
    // Check if the row is full
    let isFull = true;
    for (let x = 0; x < columns; x++) {
      if (board[y][x] === 0) {
        isFull = false;
        break;
      }
    }
    // If the row is full, remove it
    if (isFull) {
      // Increment the row count
      rowCount++;
      // Move all the rows above down by one
      for (let y2 = y; y2 > 0; y2--) {
        for (let x = 0; x < columns; x++) {
          board[y2][x] = board[y2 - 1][x];
        }
      }
      // Fill the top row with zeros
      for (let x = 0; x < columns; x++) {
        board[0][x] = 0;
      }
      // Move the loop index back by one
      y++;
    }
  }
  // Update the score based on the number of rows removed
  switch (rowCount) {
    case 1:
      score += 10;
      break;
    case 2:
      score += 25;
      break;
    case 3:
      score += 50;
      break;
    case 4:
      score += 100;
      break;
  }
  // Update the score display
  document.getElementById("score").innerHTML = "Score: " + score;
}

// Control the tetromino with keyboard keys
document.addEventListener("keydown", control);

function control(event) {
  // Check the key code
  switch (event.keyCode) {
    case 37: // Left arrow
      moveLeft();
      break;
    case 38: // Up arrow
      rotate();
      break;
    case 39: // Right arrow
      moveRight();
      break;
    case 40: // Down arrow
      moveDown();
      break;
  }
}

// Animate the game
let score = 0;
let dropStart = Date.now();
let speed = 1000;
let requestId;

function animate() {
  // Request the next animation frame
  requestId = requestAnimationFrame(animate);
  // Check the time elapsed since the last drop
  let now = Date.now();
  let delta = now - dropStart;
  // If the time elapsed is greater than the speed, drop the tetromino
  if (delta > speed) {
    moveDown();
    // Reset the drop start time
    dropStart = Date.now();
  }
}

// Start the animation
animate();
