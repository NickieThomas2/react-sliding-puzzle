import "../index.css";
import React from "react";
import Square from "./Square";

class Board extends React.Component {
  tiles() {
    let width = this.props.squares.length;
    let col = this.props.squares.length;
    let i = 0;
    let j = 0;
    var rows = [];
    for (let x = 0; x < width * col; x++) {
      if (this.props.squares[i][j] === null) {
        return <div>Loading</div>;
      }
      rows.push(this.renderSquare(i, j));
      j++;
      if (j === width) {
        j = 0;
        i++;
      }
    }
    return rows;
  }
  renderSquare(i, j) {
    let visualPosition = {
      x: 2 + j * 33,
      y: 2 + i * 33,
    };
    return (
      <Square
        value={this.props.squares[i][j]}
        visualPosition={visualPosition}
        onClick={() => this.props.onClick(i, j)}
        key={this.props.squares[i][j]}
      />
    );
  }

  render() {
    const board = {
      clear: "both",
      content: "",
      display: "table",
      border: "2px solid #999",
      padding: 16.5 * this.props.size + "px",
    };
    return (
      <div>
        {this.tiles()}
        <div style={board}></div>
      </div>
    );
  }
}

export default Board;
