import React from "react";
import { useRef, useEffect, useContext, useLayoutEffect } from "react";
import rough from "roughjs";
import classes from "./index.module.css";
import BoardContext from "../../store/board-context";
import { TA_STATES, TOOLS } from "../../constants";

const Board = () => {
  const canvasRef = useRef();
  const { toolActionState, elements, handleMouseDown, handleMouseMove, handleMouseUp, hanldeTextAreaOnBlur, handleRedo, handleUndo } =
    useContext(BoardContext);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const textAreaRef = useRef();
  useEffect(() => {
    if (toolActionState == TA_STATES.WRITING) {
      const textarea = textAreaRef.current;
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionState]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      } else if (event.ctrlKey && event.key === "y") {
        handleRedo();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleRedo, handleUndo]);

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
        case TOOLS.TEXT: {
          context.textBaseline = "top";
          context.font = `${elem.options.size}px Arial`;
          context.fillStyle = elem.options.stroke;
          context.fillText(elem.options.text, elem.x2, elem.y2);
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

  return (
    <>
      {toolActionState == TA_STATES.WRITING && (
        <textarea
          type="text"
          className={classes.textElementBox}
          ref={textAreaRef}
          style={{
            top: elements[elements.length - 1].y2,
            left: elements[elements.length - 1].x2,
            fontSize: `${elements[elements.length - 1]?.options?.size}px`,
            color: elements[elements.length - 1]?.options?.stroke,
          }}
          onBlur={(event) => {
            hanldeTextAreaOnBlur(event.target.value);
          }}
        />
      )}
      <canvas id="canvas" ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />;
    </>
  );
};

export default Board;

