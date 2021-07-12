import "../index.css";
import React from "react";
import Board from "./Board";
import _ from "lodash";
import { SlidingPuzzleSolver } from "./SlidingPuzzleSolver";

class App extends React.Component {
  constructor(props) {
    super(props);

    const col = Array(3).fill(null);

    this.state = {
      history: [
        {
          squares: Array(3)
            .fill(null)
            .map(() => col.slice()),
        },
      ],
      solvedArr: Array(3).fill(null),
      size: 3,
      stepNumber: 0,
      counter: 0,
      interval: null,
      temp: 0,
    };
    // this.swap = this.swap.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.solvePuzzle = this.solvePuzzle.bind(this);
  }

  componentDidMount() {
    this.shuffle();
    this.prepareSolved(this.state.size);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  jumpTo(step) {
    if (step > this.state.history.length - 1)
      step = this.state.history.length - 1;
    if (step < 0) step = 0;
    this.setState({
      stepNumber: step,
      temp: step,
    });
  }

  prepareSolved(size) {
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
    this.setState({ solvedArr: _.cloneDeep(solvedArr) });
    return solvedArr;
  }

  solved(arr) {
    if (_.isEqual(this.state.solvedArr, arr)) {
      return true;
    }
    return false;
  }

  swap(row, col) {
    const step = this.state.stepNumber;
    const history = this.state.history.slice(0, step + 1);
    const current = history[step];
    const size = this.state.size;
    const arr = _.cloneDeep(current.squares.slice());
    let hole = {
      x: -1,
      y: -1,
    };

    //find the hole
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr.length; j++) {
        if (arr[i][j] === 0) {
          hole = {
            x: j,
            y: i,
          };
        }
      }
    }

    //check if selected is beside hole
    if (Math.abs(hole.y - row) + Math.abs(hole.x - col) !== 1) {
      return;
    }

    //simple swap the number
    const temp = arr[hole.y][hole.x];
    arr[hole.y][hole.x] = arr[row][col];
    arr[row][col] = temp;

    var newarr = Array(size)
      .fill(0)
      .map(() => new Array(size).fill(0));
    for (i = 0; i < size; i++) {
      for (j = 0; j < size; j++) {
        newarr[i][j] = _.clone(arr[i][j]);
      }
    }

    //save state
    this.setState({
      history: history.concat({ squares: arr }),
      stepNumber: step + 1,
      temp: step + 1,
    });
  }

  shuffle() {
    const size = this.state.size;
    let numbers = _.range(0, size * size);
    //check if puzzle is solveable with inversions
    let invCount = 0;
    while (invCount === 0 || invCount % 2 === 1) {
      invCount = 0;
      numbers = _.shuffle(numbers);
      for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          if (numbers[i] !== 0 && numbers[j] !== 0 && numbers[i] > numbers[j]) {
            invCount++;
          }
        }
      }
    }

    var arr = Array(size)
      .fill(0)
      .map((row) => new Array(size).fill(0));
    let n = 0;
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        arr[i][j] = numbers[n];
        n++;
      }
    }

    //constant delete this
    // arr[0][0] = 4;
    // arr[0][1] = 6;
    // arr[0][2] = 5;
    // arr[1][0] = 7;
    // arr[1][1] = 3;
    // arr[1][2] = 2;
    // arr[2][0] = 0;
    // arr[2][1] = 1;
    // arr[2][2] = 8;

    this.setState({
      history: [{ squares: _.cloneDeep(arr) }],
      stepNumber: 0,
      temp: 0,
    });
  }

  solvePuzzle(arr, size, history) {
    var solve = new SlidingPuzzleSolver(arr, size, history);
    var h = solve.solve();
    this.setState({
      history: h,
    });
    console.log("solved");

    this.interval = setInterval(() => {
      if (this.state.stepNumber < this.state.history.length - 1) {
        this.jumpTo(this.state.stepNumber + 1);
      } else clearInterval(this.state.interval);
    }, 300);
    this.setState({ interval: this.interval });
  }

  handleStepNumberInput(e) {
    this.setState({ temp: e.target.value });
    if (e.key === "Enter") {
      if (
        e.target.value >= 0 &&
        e.target.value < this.state.history.length - 1
      ) {
        this.jumpTo(this.state.temp);
      } else {
        this.setState({ temp: this.state.stepNumber });
      }
    }
  }

  render() {
    const step = this.state.stepNumber;
    const history = this.state.history.slice(0, step + 1);
    const current = history[step];
    const size = this.state.size;
    var button = (
      <button
        onClick={() =>
          this.solvePuzzle(history[history.length - 1].squares, size, history)
        }
      >
        solve
      </button>
    );
    if (this.solved(current.squares)) {
      button = <button onClick={this.shuffle}>restart</button>;
    }

    const moves = (step) => {
      return (
        <div>
          <div>
            <button onClick={() => this.jumpTo(step - 1)}>prev</button>

            <input
              type="text"
              className="lbl"
              value={this.state.temp}
              onChange={(e) => this.handleStepNumberInput(e)}
              onKeyPress={(e) => this.handleStepNumberInput(e)}
            ></input>

            <button onClick={() => this.jumpTo(step + 1)}>next</button>
          </div>
        </div>
      );
    };

    return (
      <div className="game">
        <div className="game-board">
          <Board
            size={size}
            squares={current.squares}
            onClick={(i, j) => this.swap(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{button}</div>
          <div>{moves(step)}</div>
        </div>
      </div>
    );
  }
}

export default App;
