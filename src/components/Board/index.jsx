import React from "react";
import { useRef, useEffect } from "react";
import rough from 'roughjs';

// import classes from "./index.module.css";

const Board = () => {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let roughCanvas = rough.canvas(canvas);
    let generator = roughCanvas.generator;
    let rect1 = generator.rectangle(10, 10, 100, 100);
    let rect2 = generator.rectangle(10, 120, 100, 100, {fill: 'red'});
    roughCanvas.draw(rect1);
    roughCanvas.draw(rect2);
  }, [])
  

  return (
    <>
      <canvas ref={canvasRef}/>
    </>
  );
};

export default Board;
