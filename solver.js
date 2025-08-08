async function solveWithoutGuessing1D(board, width, height) {
  let changed = true;

  while (changed) {
    changed = false;

    for (let i = 0; i < board.length; i++) {
      const cell = board[i];
      if (!cell.revealed || cell.mine) continue;

      const neighbors = getNeighbors(cell, board, width, height);
      const hidden = neighbors.filter((n) => !n.revealed && !n.flagged);
      const flagged = neighbors.filter((n) => n.flagged).length;

      const neededMines = cell.count - flagged;
      // await wait(10);

      if (neededMines === hidden.length && neededMines > 0) {
        for (const n of hidden) {
          if (!n.flagged) {
            n.flagged = true;
            changed = true;
          }
        }
      } else if (neededMines === 0 && hidden.length > 0) {
        for (const n of hidden) {
          if (!n.revealed && !n.flagged) {
            n.revealed = true;
            changed = true;

            // Optional: flood reveal
            if (n.count === 0) {
              revealFlood(n, board, width, height);
            }
          }
        }
      }
    }
  }

  // Check if any unrevealed non-mine cells remain
  for (const cell of board) {
    if (!cell.revealed && !cell.mine) {
      return { success: false, reason: "Unrevealed safe cell remains (requires guessing)" };
    }
  }

  return { success: true };
}

function getNeighbors(cell, board, width, height) {
  const neighbors = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = cell.x + dx;
      const ny = cell.y + dy;
      const neighbor = getCell(board, nx, ny, width, height);
      if (neighbor) neighbors.push(neighbor);
    }
  }
  return neighbors;
}

function getIndex(x, y, width) {
  return y * width + x;
}

function inBounds(x, y, width, height) {
  return x >= 0 && y >= 0 && x < width && y < height;
}

function getCell(board, x, y, width, height) {
  if (!inBounds(x, y, width, height)) return null;
  return board[getIndex(x, y, width)];
}

function revealFlood(cell, board, width, height) {
  const queue = [cell];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.pop();
    const key = `${current.x},${current.y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    current.revealed = true;

    if (current.count === 0) {
      const neighbors = getNeighbors(current, board, width, height);
      for (const n of neighbors) {
        if (!n.revealed && !n.flagged) {
          queue.push(n);
        }
      }
    }
  }
}

function validateBoardFromStart(board, width, height, startX, startY) {
  const startCell = getCell(board, startX, startY, width, height);

  if (!startCell) {
    throw new Error("Invalid starting cell");
  }

  // Ensure the starting cell is safe
  if (startCell.mine) {
    return { success: false, reason: "Starting cell was a mine (invalid board)" };
  }

  // Simulate player's first click
  revealFlood(startCell, board, width, height);

  // Now run the logical solver
  return solveWithoutGuessing1D(board, width, height);
}

const wait = (msec) =>
  new Promise((resolve, _) => {
    setTimeout(resolve, msec);
  });
