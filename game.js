let screenWidth = 100;
let screenHeight = 100;
let screenConstraint = 0;
let p5Init = false;

let cellSize = 0;

let startReserved = 1;
let gameOver = false;
let won = false;

let buttonX, buttonY, buttonW;

class MinesweeperRound {
  constructor(width, height, mines) {
    this.mines = mines;
    this.flagged = 0;
    this.width = width;
    this.height = height;
    this.hasStart = false;
    this.gameTimer = 0;
    gameOver = false;
    won = false;

    this.grid = Array();
    this.initGame();
  }

  calculateCellSizes(override) {
    let trF = window.innerHeight / window.innerWidth;
    let trC = this.height / this.width;

    let windowGrabberHeight = document.querySelector(".window-header").getBoundingClientRect().height;
    let borderSize = getComputedStyle(document.documentElement).getPropertyValue("--border-size").split("px")[0];

    if (trF >= trC) {
      cellSize = (window.innerWidth * 0.9 - borderSize * 2) / (this.width + 1);
      screenConstraint = 0;
    } else {
      cellSize = (window.innerHeight * 0.9 - borderSize * 4 - windowGrabberHeight * 3) / (this.height + 3);
      screenConstraint = 1;
    }

    if (!override) {
      cellSize = Math.floor(cellSize);
    } else {
      cellSize = Math.floor(override);
    }

    headerSize = cellSize * 2.5;
    border = cellSize * (5 / 8);

    setCanvasSize(cellSize * this.width + border * 2, cellSize * this.height + headerSize + border * 2);
  }

  initGame() {
    if (cellSize === 0) {
      this.calculateCellSizes();
    }

    this.grid = Array();
    for (let i = 0; i < this.width * this.height; i++) {
      this.grid[i] = new Cell(i % this.width, Math.floor(i / this.width), false);
    }
  }

  winCheck() {
    let incomplete = 0;
    for (let i = 0; i < this.grid.length; i++) {
      let gCell = this.grid[i];
      if (gCell.mine && !gCell.flagged) {
        incomplete++;
      } else if (!gCell.mine && !gCell.revealed) {
        incomplete++;
      }
    }

    if (incomplete == 0 && !gameOver) {
      gameOver = true;
      won = true;
      uploadToLeaderboard();
    }
    return incomplete;
  }

  reserveStart(sX, sY) {
    for (let x = -startReserved; x <= startReserved; x++) {
      for (let y = -startReserved; y <= startReserved; y++) {
        let gX = sX + x;
        let gY = sY + y;
        if (gX < 0 || gX >= game.width || gY < 0 || gY >= game.height) {
          continue;
        }
        this.grid[gX + gY * this.width].reserved = true;
      }
    }
    this.hasStart = true;
  }

  revealCell(x, y) {
    if (!this.hasStart) {
      this.reserveStart(x, y);
      this.seedGame();
    }
    let gCell = this.grid[x + y * this.width];
    if (!gCell.flagged) {
      gCell.revealed = true;
      if (gCell.mine) {
        gCell.revealed = "fatal";
      }
    } else {
      return;
    }
    if (gCell.count == 0) {
      gCell.floodFill();
    }
    if (gCell.mine) {
      for (let i = 0; i < this.grid.length; i++) {
        if (this.grid[i].revealed != "fatal" && this.grid[i].mine) {
          this.grid[i].revealed = true;
        }
        gameOver = true;
      }
    }
  }

  padValue(val, count) {
    let valPadded = String(val);
    if (valPadded.length < count) {
      for (let j = 0; j < count - valPadded.length; j++) {
        valPadded = "0" + valPadded;
      }
    }
    return String(valPadded);
  }

  minesweeperFont(val, x, y, charWidth, charHeight, count) {
    for (let i = 0; i < count; i++) {
      let charX = x + charWidth * i;
      let charY = y;

      val = this.padValue(val, count);
      let numIndex = +val.charAt(i);
      if (val.charAt(i) === "-") {
        numIndex = numImages.length - 1;
      }
      let charImg = numImages[numIndex];
      if (charImg) {
        image(charImg, charX, charY, charWidth, charHeight);
      } else {
        noLoop();
      }
    }
  }

  drawHUD() {
    let cellAnti = (10 / 16) * cellSize;
    if (!gameOver && this.hasStart && !document.hidden && document.hasFocus()) {
      this.gameTimer += deltaTime;
    }

    fill(192);
    rect(0, 0, border + this.width * cellSize + border, border + headerSize);

    for (let i = 0; i < 2; i++) {
      for (let h = 0; h < this.height + 5; h++) {
        let spriteX = i > 0 ? cellAnti + (i * this.width + 1 - 1) * cellSize : 0;
        image(edgeSide, spriteX, cellSize * h, cellAnti, cellSize);
      }
    }

    for (let h = 0; h < 3; h++) {
      for (let i = 0; i < this.width + 2; i++) {
        let flipX, flipY;
        let isHEdge = i == 0 || i == this.width + 1;
        let isVEdge = h == 0 || h == 2;
        let spriteW, spriteH;
        let spriteImg;
        if (isHEdge && !isVEdge) {
          // Corner Middle
          spriteW = cellAnti;
          spriteH = cellAnti;
          if (i == 0) {
            // Corner 3
            spriteImg = corner3;
          } else {
            // Corner 4
            spriteImg = corner4;
          }
        } else if (isHEdge && isVEdge) {
          // Corner Outter
          spriteW = cellAnti;
          spriteH = cellAnti;
          // spriteImg = corner;
          if (h == 0) {
            // Top Row
            if (i == 0) {
              // Corner 1
              spriteImg = corner1;
            } else {
              // Corner 2
              spriteImg = corner2;
            }
          } else {
            //Bottom Row
            if (i == 0) {
              // Corner 5
              spriteImg = corner5;
            } else {
              // Corner 6
              spriteImg = corner6;
            }
          }
        } else if (isVEdge) {
          // Vertical Edge
          spriteW = cellSize;
          spriteH = cellAnti;
          spriteImg = edge;
        } else if (!isVEdge && !isHEdge) {
          // Center Row
          spriteW = cellSize;
          spriteH = cellAnti;
          spriteImg = edge;
        }

        let spriteX = i > 0 ? cellAnti + (i - 1) * cellSize : 0;
        let spriteY = 0;
        if (h == 1) {
          spriteY = headerSize; //- border;
        } else if (h == 2) {
          spriteY = this.height * cellSize + headerSize + border;
          if (isHEdge) flipX = false;
        }
        if (i == 0 || i == 31) {
        }
        image(spriteImg, spriteX, spriteY, spriteW, spriteH); //((flipX == -1) ? -spriteX : spriteX), ((flipY == -1) ? -spriteY - spriteH : spriteY - spriteH), spriteW, spriteH);
      }
    }
    //image(edge, 0, headerSize - border, cellSize, cellAnti);
    // rect(0, headerSize - border, screenWidth, border);

    push();
    translate(border, border);
    let faceImg;
    if (!gameOver) {
      if (mouseIsPressed) {
        faceImg = facePeek;
      } else {
        faceImg = faceNormal;
      }
    } else {
      if (won) {
        faceImg = faceWin;
      } else {
        faceImg = faceDead;
      }
    }
    let faceSize = (cellSize * 52) / 32;
    buttonX = (cellSize * game.width) / 2 - faceSize / 2;
    buttonY = (headerSize - border) / 2 - faceSize / 2;
    buttonW = faceSize;
    image(faceImg, buttonX, buttonY, buttonW, buttonW);

    pop();

    let textW = (26 / 32) * cellSize;
    let textH = (46 / 26) * textW;
    let textY = (headerSize - textH + border) / 2;
    if (this.mines != undefined && this.flagged != undefined) {
      this.minesweeperFont(Math.floor(this.gameTimer / 1000), textY, textY, textW, textH, 3);
      this.minesweeperFont(this.mines - this.flagged, width - textW * 3 - textY, textY, textW, textH, 3);
    }
  }

  peekCell(x, y) {
    let gX = x * cellSize;
    let gY = y * cellSize + headerSize;
    let gCell = this.grid[x + y * this.width];
    if (!gCell.revealed && !gCell.flagged && !gCell.marked) {
      image(clearedCell, gX, gY, cellSize, cellSize);
    }
  }

  flagCell(x, y) {
    let gCell = this.grid[x + y * this.width];

    if (this.mines - this.flagged <= 0 && !gCell.flagged) {
      return;
    }

    if (!gCell.revealed) {
      gCell.flagged = !gCell.flagged;
      if (gCell.flagged) {
        this.flagged++;
      } else {
        this.flagged--;
      }
    }
  }

  unmarkCell(x, y) {
    let gCell = this.grid[x + y * this.width];
    if (gCell.marked && !gCell.revealed && !gCell.flagged) {
      gCell.flagged = false;
      gCell.marked = false;
    }
  }

  markCell(x, y) {
    let gCell = this.grid[x + y * this.width];
    if (!gCell.revealed && gCell.flagged) {
      if (gCell.flagged) {
        gCell.flagged = false;
        gCell.marked = true;
        this.flagged--;
      } else {
        gCell.flagged = true;
        gCell.marked = false;
        this.flagged--;
      }
    }
  }

  seedGame() {
    let rejects = 0;
    for (let i = 0; i < this.mines; 0) {
      let mI = Math.floor(Math.random() * this.grid.length);

      if (this.grid[mI].count >= 0 && !this.grid[mI].reserved && !this.grid[mI].mine) {
        this.grid[mI].mine = true;
        i++;
      } else {
        rejects++;
        continue;
      }

      if (rejects >= this.mines * 5) break;
    }

    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i].calculateNearby();
    }
  }

  drawGame() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let cell = this.grid[x + y * this.width];
        cell.draw();
      }
    }
  }
}

function isMobile() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}
