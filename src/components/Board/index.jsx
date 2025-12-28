import React from "react";
import { useRef, useEffect, useContext } from "react";
import rough from "roughjs";

import BoardContext from "../../store/board-context";
// import classes from "./index.module.css";

const Board = () => {
  const canvasRef = useRef();
  const { elements, handleMouseDown } = useContext(BoardContext);
  console.log(elements);
  console.log("test");

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();
    let roughCanvas = rough.canvas(canvas);
    elements.forEach((elem) => {
      roughCanvas.draw(elem.roughElem);
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  return <canvas ref={canvasRef} onMouseDown={handleMouseDown} />;
};

export default Board;

