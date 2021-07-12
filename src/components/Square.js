import "../index.css";
import React from "react";
import { spring, Motion } from "react-motion";

const squareStyle = {
  background: "#fff",
  border: "1px solid #999",
  float: "left",
  fontSize: "24px",
  fontWeight: "bold",
  lineHeight: "34px",
  height: "34px",
  margin: "-1px -1px",
  padding: "0",
  textAlign: "center",
  width: "34px",
  display: "block",
  position: "absolute",
};

const holeStyle = {
  border: "1px solid #999",
  opacity: 0,
};

class Square extends React.Component {
  render() {
    const motionStyle = {
      translateX: spring(this.props.visualPosition.x),
      translateY: spring(this.props.visualPosition.y),
    };
    const style = {
      ...squareStyle,
      ...(this.props.value === 0 ? holeStyle : {}),
    };
    return (
      <Motion style={motionStyle}>
        {({ translateX, translateY }) => (
          <button
            style={{
              ...style,
              WebkitTransform: `translate3d(${translateX}px, ${translateY}px,0)`,
              transform: `translate3d(${translateX}px, ${translateY}px,0)`,
            }}
            onClick={this.props.onClick}
          >
            {this.props.value}
          </button>
        )}
      </Motion>
    );
  }
}

export default Square;
