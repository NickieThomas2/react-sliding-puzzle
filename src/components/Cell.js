export class Cell {
  constructor(
    pos = { x: -1, y: -1 },
    number,
    back = { x: -1, y: -1 },
    solved = false,
    f = Number.MAX_SAFE_INTEGER
  ) {
    this.pos = pos;
    this.number = number;
    this.back = back;
    this.solved = solved;
    this.f = f;
  }
}
