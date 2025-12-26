import React from "react";
import { useRef } from "react";
// import classes from "./index.module.css";

const Board = () => {
  const canvasRef = useRef();

  return (
    <>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
    </>
  );
};

export default Board;
