const COLUMNS = 7;
const ROWS = 6;
const SPACE = 100;
let grid = [];
let playerNr;
let gameFinished;

function preload() {
    // random player starts first game
    playerNr = round(random(1, 2));
}

function setup() {
    createCanvas(COLUMNS * SPACE, ROWS * SPACE);

    for (let i = 0; i < COLUMNS; i++) {
        grid[i] = [];
        for (let j = 0; j < ROWS; j++) {
            grid[i][j] = 0;
        }
    }

    gameFinished = false;
}

function draw() {
    background(0);
    noStroke();

    // draw coins + empty spaces:
    for (let i = 0; i < COLUMNS; i++) {
        for (let j = 0; j < ROWS; j++) {
            drawCoin(i, j, grid[i][j], 255);
        }
    }

    // hover effect for coins placement:
    let row = getCoinPostion().row;
    let column = getCoinPostion().column;
    if (row >= 0 && !gameFinished) {
        drawCoin(column, row, playerNr, 100);
    }
}

function mousePressed() {
    let row = getCoinPostion().row;
    let column = getCoinPostion().column;

    if (row == -1)
        return;

    // insert coin:
    grid[column][row] = playerNr;

    // check for game over and start new game:
    if (isWinner(column, row)) {
        gameFinished = true;
        setTimeout(() => {
            let player = "";
            playerNr == 1 ? player = "Yellow" : player = "Red";
            alert("Congratulations! " + player + " is the winner!");
            setup();
        }, 100);
    } else if (isDraw()) {
        gameFinished = true;
        setTimeout(() => {
            alert("Oh no! It is a draw...");
            setup();
        }, 100);
    }

    // next players turn (even if new game is started!)
    playerNr = playerNr % 2 + 1;
}

function getCoinPostion() {
    if (mouseX >= width || mouseX < 0 || mouseY >= height || mouseY < 0)
        return {
            row: -1,
            column: -1
        };

    let column = floor(mouseX / SPACE);
    let row = -1;
    for (let i = 0; i < ROWS; i++) {
        if (grid[column][i] == 0) {
            row = i;
            break;
        }
    }
    return {
        row: row,
        column: column
    }
}

function drawCoin(column, row, val, alpha) {
    if (val == 0) {
        fill(200);
    } else if (val == 1) {
        fill(255, 0, 0, alpha);
    } else {
        fill(255, 255, 0, alpha);
    }
    let cx = SPACE * column + SPACE * 0.5;
    let cy = height - SPACE * row - SPACE * 0.5;
    circle(cx, cy, SPACE * 0.7);
}

function isDraw() {
    for (let i = 0; i < COLUMNS; i++) {
        for (let j = 0; j < ROWS; j++) {
            if (grid[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

function isWinner(column, row) {
    let gameOver = false;
    let val = grid[column][row];
    let sum;

    // check vertically
    sum = 1;
    for (let i = 1; i < 4; i++) {
        if ((column + i) >= COLUMNS || grid[column + i][row] != val) {
            break;
        } else {
            sum++;
        }
    }
    for (let i = 1; i < 4 && i >= 0; i++) {
        if ((column - i) < 0 || grid[column - i][row] != val) {
            break;
        } else {
            sum++;
        }
    }
    gameOver = gameOver || sum >= 4;

    // check horizontally
    sum = 1;
    for (let i = 1; i < 4; i++) {
        if ((row + i) >= ROWS || grid[column][row + i] != val) {
            break;
        } else {
            sum++;
        }
    }
    for (let i = 1; i < 4; i++) {
        if ((row - i) < 0 || grid[column][row - i] != val) {
            break;
        } else {
            sum++;
        }
    }
    gameOver = gameOver || sum >= 4;

    // check diagonally (upwards)
    sum = 1;
    for (let i = 1; i < 4; i++) {
        if ((column + i) >= COLUMNS || (row + i) >= ROWS || grid[column + i][row + i] != val) {
            break;
        } else {
            sum++;
        }
    }
    for (let i = 1; i < 4; i++) {
        if ((column - i) < 0 || (row - i) < 0 || grid[column - i][row - i] != val) {
            break;
        } else {
            sum++;
        }
    }
    gameOver = gameOver || sum >= 4;

    // check diagonally (downwards)
    sum = 1;
    for (let i = 1; i < 4; i++) {
        if ((column + i) >= COLUMNS || (row - i) < 0 || grid[column + i][row - i] != val) {
            break;
        } else {
            sum++;
        }
    }
    for (let i = 1; i < 4; i++) {
        if ((column - i) < 0 || (row + i) >= ROWS || grid[column - i][row + i] != val) {
            break;
        } else {
            sum++;
        }
    }
    gameOver = gameOver || sum >= 4;

    return gameOver;
}