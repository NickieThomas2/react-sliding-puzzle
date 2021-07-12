import _ from "lodash";
import { Cell } from "./Cell";

export class SlidingPuzzleSolver {
  constructor(arr, size, history) {
    this.history = _.cloneDeep(history);
    this.arr = _.cloneDeep(arr);
    this.size = size;
    this.solvedArr = this.prepareSolved(this.size);
    this.cellArr = this.preparePuzzleSolver(this.arr);
  }
}

SlidingPuzzleSolver.prototype.prepareSolved = function (size) {
  var solvedArr = new Array(size).fill(null);
  var number = 1;
  for (var i = 0; i < size; i++) {
    solvedArr[i] = new Array(size).fill(null);
    for (var j = 0; j < size; j++) {
      solvedArr[i][j] = number;
      number++;
    }
  }
  solvedArr[size - 1][size - 1] = 0;
  return _.cloneDeep(solvedArr);
};

SlidingPuzzleSolver.prototype.preparePuzzleSolver = function (arr) {
  // const step = this.state.stepNumber;
  // const arr = _.cloneDeep(this.state.history[step].squares);
  var arrCell = new Array(this.size).fill(null);
  for (var i = 0; i < this.size; i++) {
    arrCell[i] = new Array(this.size).fill(null);
    for (var j = 0; j < this.size; j++) {
      arrCell[i][j] = new Cell({ x: j, y: i }, arr[i][j]);
    }
  }
  return _.cloneDeep(arrCell);
};

SlidingPuzzleSolver.prototype.findNumber = function (number) {
  for (var i = 0; i < this.cellArr.length; i++) {
    for (var j = 0; j < this.cellArr.length; j++) {
      if (this.cellArr[i][j].number === number) {
        return _.cloneDeep(this.cellArr[i][j]);
      }
    }
  }
  return new Cell();
};

SlidingPuzzleSolver.prototype.solve = function () {
  for (let i = 0; i < this.size - 2; i++) {
    this.solveTop(i);
    this.solveLeft(i);
  }
  if (!this.solveSmallPuzzle()) return null;
  return _.cloneDeep(this.history);
};

SlidingPuzzleSolver.prototype.solveTop = function (row) {
  for (let i = 0; i < this.size - 2; i++) {
    if (this.cellArr[row][i].solved) {
      continue;
    }
    this.solveNumber(this.solvedArr[row][i], { x: i, y: row });
    this.cellArr[row][i].solved = true;
  }

  this.solveNumber(this.solvedArr[row][this.size - 1], {
    x: this.size - 1,
    y: row + 2,
  });
  this.solveNumber(this.solvedArr[row][this.size - 2], {
    x: this.size - 2,
    y: row + 2,
  });
  this.solveNumber(this.solvedArr[row][this.size - 2], {
    x: this.size - 1,
    y: row,
  });
  this.cellArr[row][this.size - 1].solved = true;

  this.solveNumber(this.solvedArr[row][this.size - 1], {
    x: this.size - 1,
    y: row + 1,
  });
  this.cellArr[row + 1][this.size - 1].solved = true;

  this.solveNumber(this.solvedArr[this.size - 1][this.size - 1], {
    x: this.size - 2,
    y: row,
  });
  this.cellArr[row][this.size - 1].solved = false;
  this.cellArr[row + 1][this.size - 1].solved = false;

  this.swapNumber(this.size - 2, row, this.size - 1, row);
  this.swapNumber(this.size - 1, row, this.size - 1, row + 1);
  this.cellArr[row][this.size - 2].solved = true;
  this.cellArr[row][this.size - 1].solved = true;
};

SlidingPuzzleSolver.prototype.solveLeft = function (col) {
  for (let i = 0; i < this.size - 2; i++) {
    if (this.cellArr[i][col].solved) {
      continue;
    }
    this.solveNumber(this.solvedArr[i][col], { x: col, y: i });
    this.cellArr[i][col].solved = true;
  }

  this.solveNumber(this.solvedArr[this.size - 1][col], {
    x: col + 2,
    y: this.size - 1,
  });
  this.solveNumber(this.solvedArr[this.size - 2][col], {
    x: col + 2,
    y: this.size - 2,
  });
  this.solveNumber(this.solvedArr[this.size - 2][col], {
    x: col,
    y: this.size - 1,
  });
  this.cellArr[this.size - 1][col].solved = true;

  this.solveNumber(this.solvedArr[this.size - 1][col], {
    x: col + 1,
    y: this.size - 1,
  });
  this.cellArr[this.size - 1][col + 1].solved = true;

  this.solveNumber(this.solvedArr[this.size - 1][this.size - 1], {
    x: col,
    y: this.size - 2,
  });
  this.cellArr[this.size - 1][col].solved = false;
  this.cellArr[this.size - 1][col + 1].solved = false;

  this.swapNumber(col, this.size - 2, col, this.size - 1);
  this.swapNumber(col, this.size - 1, col + 1, this.size - 1);
  this.cellArr[this.size - 2][col].solved = true;
  this.cellArr[this.size - 1][col].solved = true;
};

SlidingPuzzleSolver.prototype.solveSmallPuzzle = function () {
  var loop = 0;
  var blank = this.findNumber(0);
  var swapWith = new Cell();
  while (!_.isEqual(this.solvedArr, this.arr)) {
    blank = this.findNumber(0);
    swapWith = new Cell();
    if (loop < 12) {
      if (blank.pos.y === this.size - 2 && blank.pos.x === this.size - 2)
        swapWith = _.cloneDeep(this.cellArr[this.size - 1][this.size - 2]);
      if (blank.pos.y === this.size - 1 && blank.pos.x === this.size - 2)
        swapWith = _.cloneDeep(this.cellArr[this.size - 1][this.size - 1]);
      if (blank.pos.y === this.size - 1 && blank.pos.x === this.size - 1)
        swapWith = _.cloneDeep(this.cellArr[this.size - 2][this.size - 1]);
      if (blank.pos.y === this.size - 2 && blank.pos.x === this.size - 1)
        swapWith = _.cloneDeep(this.cellArr[this.size - 2][this.size - 2]);
    } else {
      if (blank.pos.y === this.size - 1 && blank.pos.x === this.size - 2)
        swapWith = _.cloneDeep(this.cellArr[this.size - 1][this.size - 3]);
      if (blank.pos.y === this.size - 1 && blank.pos.x === this.size - 3)
        swapWith = _.cloneDeep(this.cellArr[this.size - 2][this.size - 1]);
      if (blank.pos.y === this.size - 2 && blank.pos.x === this.size - 3)
        swapWith = _.cloneDeep(this.cellArr[this.size - 2][this.size - 2]);
      if (blank.pos.y === this.size - 2 && blank.pos.x === this.size - 2)
        swapWith = _.cloneDeep(this.cellArr[this.size - 1][this.size - 2]);
    }
    loop++;
    this.swapNumber(blank.pos.x, blank.pos.y, swapWith.pos.x, swapWith.pos.y);
  }
  if (_.isEqual(this.solvedArr, this.arr)) return true;
  return false;
};

SlidingPuzzleSolver.prototype.solveNumber = function (number, target) {
  var nearest = Number.MAX_SAFE_INTEGER;
  while (this.cellArr[target.y][target.x].number !== number) {
    var blankCell = this.findNumber(0);
    var numberCell = this.findNumber(number);

    var blankTarget = new Cell();
    var x = numberCell.pos.x;
    var y = numberCell.pos.y;
    const dx = [0, 0, -1, 1];
    const dy = [-1, 1, 0, 0];
    nearest = Number.MAX_SAFE_INTEGER;
    var vx = 0;
    var vy = 0;
    for (let i = 0; i < 4; i++) {
      vx = x + dx[i];
      vy = y + dy[i];
      if (
        this.isValid(this.size, this.size, vy, vx) &&
        !this.cellArr[vy][vx].solved &&
        nearest > this.manhattanDistance(this.cellArr[vy][vx].pos, target)
      ) {
        blankTarget = this.cellArr[vy][vx];
        nearest = this.manhattanDistance(this.cellArr[vy][vx].pos, target);
      }
    }
    const blankPath = this.aStar(blankTarget, blankCell, numberCell, null);
    for (let i = 0; i < blankPath.length; i++) {
      this.swapNumber(
        blankPath[i].pos.x,
        blankPath[i].pos.y,
        blankCell.pos.x,
        blankCell.pos.y
      );
      blankCell = this.cellArr[blankPath[i].pos.y][blankPath[i].pos.x];
    }
    if (number !== 0) {
      this.swapNumber(
        blankTarget.pos.x,
        blankTarget.pos.y,
        numberCell.pos.x,
        numberCell.pos.y
      );
    }
  }
};

SlidingPuzzleSolver.prototype.isValid = function (ROW, COL, row, col) {
  return row >= 0 && row < ROW && col >= 0 && col < COL;
};

SlidingPuzzleSolver.prototype.manhattanDistance = function (p1, p2) {
  return Math.abs(p1.y - p2.y) + Math.abs(p1.x - p2.x);
};

SlidingPuzzleSolver.prototype.aStar = function (
  targetCell,
  blankCell,
  numberCell,
  ignore
) {
  if (
    typeof ignore === "object" ||
    typeof ignore === "undefined" ||
    ignore.length === 0
  ) {
    ignore = new Array(1).fill(null);
  }
  this.cellArr[blankCell.pos.y][blankCell.pos.x].f = 0;
  var openList = [];
  openList.push(_.cloneDeep(this.cellArr[blankCell.pos.y][blankCell.pos.x]));
  while (openList.length > 0) {
    let currentCell = openList.pop();
    if (
      currentCell.pos.x === targetCell.pos.x &&
      currentCell.pos.y === targetCell.pos.y
    ) {
      break;
    }

    var x = currentCell.pos.x;
    var y = currentCell.pos.y;
    const dx = [0, 0, -1, 1];
    const dy = [-1, 1, 0, 0];
    var vx = 0;
    var vy = 0;
    for (let i = 0; i < 4; i++) {
      vx = x + dx[i];
      vy = y + dy[i];
      if (
        this.isValid(this.size, this.size, vy, vx) &&
        !_.isEqual(currentCell.back, this.cellArr[vy][vx].pos) &&
        !_.includes(ignore, this.cellArr[vy][vx].number) &&
        !this.cellArr[vy][vx].solved &&
        !_.isEqual(numberCell.pos, { x: vx, y: vy }) &&
        this.cellArr[vy][vx].f > currentCell.f + 1
      ) {
        this.cellArr[vy][vx].f = currentCell.f + 1;
        this.cellArr[vy][vx].back = _.cloneDeep(currentCell.pos);
        openList.push(_.cloneDeep(this.cellArr[vy][vx]));
        openList.sort((a, b) => {
          return a.f - b.f;
        });
      }
    }
  }

  var result = [];
  targetCell = _.cloneDeep(this.cellArr[targetCell.pos.y][targetCell.pos.x]);
  do {
    result.push(targetCell);
    if (
      this.isValid(this.size, this.size, targetCell.back.y, targetCell.back.x)
    ) {
      targetCell = _.cloneDeep(
        this.cellArr[targetCell.back.y][targetCell.back.x]
      );
    }
  } while (targetCell.back.x !== -1 || targetCell.back.y !== -1);

  for (let i = 0; i < this.size; i++) {
    for (let j = 0; j < this.size; j++) {
      this.cellArr[i][j].back = { x: -1, y: -1 };
      this.cellArr[i][j].f = Number.MAX_SAFE_INTEGER;
    }
  }
  result.reverse();
  return result;
};

SlidingPuzzleSolver.prototype.swapNumber = function (x1, y1, x2, y2) {
  if (x1 === x2 && y1 === y2) return;

  this.arr[y1][x1] += this.arr[y2][x2];
  this.arr[y2][x2] = this.arr[y1][x1] - this.arr[y2][x2];
  this.arr[y1][x1] -= this.arr[y2][x2];

  this.cellArr[y1][x1].number += this.cellArr[y2][x2].number;
  this.cellArr[y2][x2].number =
    this.cellArr[y1][x1].number - this.cellArr[y2][x2].number;
  this.cellArr[y1][x1].number -= this.cellArr[y2][x2].number;

  this.history.push({ squares: _.cloneDeep(this.arr) });
};
