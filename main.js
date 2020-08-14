const COLUMNS = 7;
const ROWS = 6;
const SPACE = 100;
let grid = [];
let line = [];
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

    line = [];
    gameFinished = false;
}

function draw() {
    background(0);

    // draw coins + empty spaces:
    for (let i = 0; i < COLUMNS; i++) {
        for (let j = 0; j < ROWS; j++) {
            drawCoin(i, j, grid[i][j], 255, false);
        }
    }

    // draw winning coins:
    for (let coin of line) {
        drawCoin(coin.column, coin.row, grid[coin.column][coin.row], 255, true);
    }

    // hover effect for coins placement:
    let row = getCoinPostion().row;
    let column = getCoinPostion().column;
    if (row >= 0 && !gameFinished) {
        drawCoin(column, row, playerNr, 100, false);
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

function drawCoin(column, row, val, alpha, isStroke) {
    if (val == 0) {
        fill(200);
    } else if (val == 1) {
        fill(255, 0, 0, alpha);
    } else {
        fill(255, 255, 0, alpha);
    }
    if (isStroke) {
        strokeWeight(floor(SPACE * 0.05));
        stroke(0, 0, 255, alpha);
    } else {
        noStroke();
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

    // check vertically
    gameOver = checkLine(column, row, 0, 1);

    // check horizontally
    gameOver = gameOver || checkLine(column, row, 1, 0);

    // check diagonally (upwards + downwards)
    gameOver = gameOver || checkLine(column, row, 1, 1) || checkLine(column, row, 1, -1);

    return gameOver;
}

function checkLine(column, row, dc, dr) {
    let val = grid[column][row];
    let sum = 1;
    line.push({
        column: column,
        row: row
    });

    // move "right"
    for (let i = 1; i < 4; i++) {
        if (column + dc * i >= COLUMNS || row + dr * i >= ROWS || grid[column + dc * i][row + dr * i] != val || sum >= 4) {
            break;
        } else {
            sum++;
            line.push({
                column: column + dc * i,
                row: row + dr * i
            });
        }
    }

    // move "left"
    for (let i = 1; i < 4; i++) {
        if (column - dc * i < 0 || row - dr * i < 0 || grid[column - dc * i][row - dr * i] != val || sum >= 4) {
            break;
        } else {
            sum++;
            line.push({
                column: column - dc * i,
                row: row - dr * i
            });
        }
    }

    if (sum < 4) {
        line = [];
        return false;
    }

    return true;
}