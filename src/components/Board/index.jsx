import React from "react";
import { useRef, useEffect, useContext, useLayoutEffect } from "react";
import rough from "roughjs";

import BoardContext from "../../store/board-context";
import { TOOLS } from "../../constants";

const Board = () => {
  const canvasRef = useRef();
  const { elements, handleMouseDown, handleMouseMove, handleMouseUp } = useContext(BoardContext);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();
    let roughCanvas = rough.canvas(canvas);
    elements.forEach((elem) => {
      switch (elem.options.type) {
        case TOOLS.LINE:
        case TOOLS.RECTANGLE:
        case TOOLS.CIRCLE:
        case TOOLS.ARROW: {
          roughCanvas.draw(elem.drawableElem);
          break;
        }
        case TOOLS.BRUSH: {
          context.fillStyle = elem.options.stroke;
          context.fill(elem.drawableElem);
          context.restore();
          break;
        }
        default:
          throw new Error("tool not recognized");
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  return <canvas id="canvas" ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />;
};

export default Board;

