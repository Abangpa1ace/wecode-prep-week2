'use strict';

//tetrominoes
const Z = [
  [
    [1,1,0],
    [0,1,1],
    [0,0,0]
  ],
  [
    [0,0,1],
    [0,1,1],
    [0,1,0]
  ],
  [
    [0,0,0],
    [1,1,0],
    [0,1,1]
  ],
  [
    [0,1,0],
    [1,1,0],
    [1,0,0]
  ],
];

const S = [
  [
    [0,1,1],
    [1,1,0],
    [0,0,0]
  ],
  [
    [0,1,0],
    [0,1,1],
    [0,0,1]
  ],
  [
    [0,0,0],
    [0,1,1],
    [1,1,0]
  ],
  [
    [1,0,0],
    [1,1,0],
    [0,1,0]
  ],
];

const T = [
  [
    [0,1,0],
    [1,1,1],
    [0,0,0]
  ],
  [
    [0,1,0],
    [0,1,1],
    [0,1,0]
  ],
  [
    [0,0,0],
    [1,1,1],
    [0,1,0]
  ],
  [
    [0,1,0],
    [1,1,0],
    [0,1,0]
  ],
];

const O = [
  [
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0]
  ]
]

const L = [
  [
    [0,1,0],
    [0,1,0],
    [0,1,1]
  ],
  [
    [0,0,0],
    [1,1,1],
    [1,0,0]
  ],
  [
    [1,1,0],
    [0,1,0],
    [0,1,0]
  ],
  [
    [0,0,1],
    [1,1,1],
    [0,0,0]
  ],
];

const J = [
  [
    [0,1,0],
    [0,1,0],
    [1,1,0]
  ],
  [
    [1,0,0],
    [1,1,1],
    [0,0,0]
  ],
  [
    [0,1,1],
    [0,1,0],
    [0,1,0]
  ],
  [
    [0,0,0],
    [1,1,1],
    [0,0,1]
  ],
];

const I = [
  [
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0]
  ],
  [
    [0,0,0,0],
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0]
  ],
  [
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0]
  ],
  [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ]
];


//Canvas Drawing

//selectors
const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');
const showscore = document.querySelector('.score');
const refresh = document.getElementById('refresh');
const refreshBtn = document.querySelector('.refresh-btn');

const row = 20;   //row
const col = 10;   //column
const sq = 30;    //square size
const vacant = 'white';   //empty color
const interval = 1000;
let score = 0;
showscore.innerText = score;

//draw a square
function drawSquare(x,y,color) {
  ctx.fillStyle = color;
  ctx.fillRect(x*sq, y*sq, sq, sq);

  ctx.strokeStyle = "black";
  ctx.strokeRect(x*sq, y*sq, sq, sq);
}

//create board array
let board = [];
for(let r=0 ; r<row ; r++) {
  board[r] = [];
  for(let c=0 ; c<col ; c++) {
    board[r][c] = vacant;
  }
}

//draw the board
function drawBoard() {
  for(let r=0 ; r<row ; r++) {
    for(let c=0 ; c<col ; c++) {
      drawSquare(c,r,board[r][c]);
    }
  }
}

drawBoard();

//pieces and colors array
const PIECES = [
  [Z, "red"],
  [S, "green"],
  [T, "orange"],
  [O, "yellow"],
  [L, "purple"],
  [J, "brown"],
  [I, "blue"]
]

//generate random pieces
function randomPiece() {
  let rdm = Math.floor(Math.random() * PIECES.length)
  return new Piece(PIECES[rdm][0], PIECES[rdm][1]);
}

//initiate a piece
let p = randomPiece();

//get object piece
function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];

  //control the pieces
  this.x = col/2 - 1;
  this.y = -1;
}

//fill a piece
Piece.prototype.fill = function(color) {
  for(let r=0 ; r<this.activeTetromino.length ; r++) {
    for(let c=0 ; c<this.activeTetromino.length ; c++) {
      if(this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
}

//draw & undraw a piece to the board
Piece.prototype.unDraw = function() {
  this.fill(vacant);
}

Piece.prototype.draw = function() {
  this.fill(this.color);
}

//move down the piece
Piece.prototype.moveDown = function() {
  if(!this.collision(0, 1, this.activeTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  }
  else {
    //lock the piece and generate new piece
    this.lock();
    p = randomPiece();
  }
}

//move right the piece
Piece.prototype.moveRight = function() {
  if(!this.collision(1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x++;
    this.draw();
  }
}

//move left the piece
Piece.prototype.moveLeft = function() {
  if(!this.collision(-1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
}

//rotate the piece
Piece.prototype.rotate = function() {
  let nextTetromino = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];    //0~3 rotating code
  let kick = 0;

  // move the piece when wall kick
  if(this.collision(0, 0, nextTetromino)) {
    if(this.x > col/2) {    // right wall kick
      kick = -1;
    }
    else {                  // left wall kick
      kick = 1;
    }
  }
  
  if(!this.collision(kick, 0, nextTetromino)) {
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
}

//lock the piece
Piece.prototype.lock = function() {
  for(let r=0 ; r<this.activeTetromino.length ; r++) {
    for(let c=0 ; c<this.activeTetromino.length ; c++) {
      
      //skip the vacant
      if(!this.activeTetromino[r][c]) { continue; }
      
      // pieces to lock on top = gameover
      if(this.y + r < 0) {
        //alert gameover
        showGameOver();
        break;
      }

      // piece locking
      board[this.y+r][this.x+c] = this.color;
    }
  }

  //remove full rows
  for (let r=0 ; r<row ; r++) {
    let isRowFull = true;
    for(let c=0 ; c<col ; c++) {
      isRowFull = isRowFull && (board[r][c] !== vacant);
    }
    if (isRowFull) {
      //if row is full, we move down above ones
      for (let y=r ; y>1 ; y--) {
        for(let c=0 ; c<col ; c++) {
          board[y][c] = board[y-1][c];
        }
      }
      // the top row vacant
      for(let c=0 ; c<col ; c++) {
        board[0][c] = vacant;
      }

      score += 10;
      showscore.innerText = score;
    }
  }
  drawBoard();
}

//collision detect
Piece.prototype.collision = function(x,y,piece) {
  for(let r=0 ; r<piece.length ; r++) {
    for(let c=0 ; c<piece.length ; c++) {

      //if the square is vacant, skip it
      if(!piece[r][c]) { continue; }
      
      //coordinates of the piece after movement
      let newX = this.x + c + x;
      let newY = this.y + r + y;

      //conditions
      if (newX < 0 || newX >= col || newY >= row) {
        return true;
      }

      // another condition(newY < 0) -> remain the piece
      if (newY < 0) { continue; }
      if (board[newY][newX] !== vacant) {
        return true;
      }
    }
  }
  return false;
}

//control the piece(down, left, right, rotate)
document.addEventListener('keydown', controlPiece)

function controlPiece(event) {
  if(event.keyCode === 37) {        // left arrow
    p.moveLeft();
    // dropStart = Date.now();
  }
  else if(event.keyCode === 38) {   // up arrow(rotate)
    p.rotate();
    // dropStart = Date.now();
  }
  else if(event.keyCode === 39) {   // right arrow
    p.moveRight();
    // dropStart = Date.now();
  }
  else if(event.keyCode === 40) {      // down arrow
    p.moveDown();
    // dropStart = Date.now();
  }
}

//game over function
function showGameOver() {
  gameOver = true;
  refresh.style.display = 'flex';
  refreshBtn.addEventListener('click', () => {
    location.reload();
  })
}

//dropping the piece every 1sec
let gameOver = false;
// let dropStart = Date.now();

// function drop() {
//   let now = Date.now();
//   let delta = now - dropStart;
//   if (delta > interval) {   //1000ms = 1s
//     p.moveDown();
//     dropStart = Date.now();
//   }
//   if (!gameOver) {
//     requestAnimationFrame(drop);
//   }
// }

function drop() {
  const moveDowns = setInterval(() => {
    p.moveDown()
    if (gameOver === true) {
      clearInterval(moveDowns);
    }
  }, interval);
}

drop();
