import React from "react";
import BoardContext from "./board-context";
import TOOLS from "../constants";
import { useReducer } from "react";
import rough from "roughjs/bin/rough";

const gen = rough.generator();
const boardReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_TOOL":
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    case "DRAW_DOWN": {
      const prevElements = state.elements;
      let cX = action.payload.clientX;
      let cY = action.payload.clientY;
      const newElem = {
        id: prevElements.length,
        x1: cX,
        y1: cY,
        x2: cX,
        y2: cY,
        roughElem: gen.line(cX, cY, cX, cY),
      };
      return { ...state, elements: [...prevElements, newElem] };
    }
    default:
      return state;
  }
};

const initialBoardState = {
  activeToolItem: TOOLS.LINE,
  elements: [],
};

const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);

  const handleToolItemClick = (tool) => {
    dispatchBoardAction({
      type: "CHANGE_TOOL",
      payload: {
        tool,
      },
    });
  };

  const handleMouseDown = (event) => {
    dispatchBoardAction({
      type: "DRAW_DOWN",
      payload: {
        clientX: event.clientX,
        clientY: event.clientY,
      },
    });
  };

  const boardContextVal = {
    activeToolItem: boardState.activeToolItem,
    elements: [],
    handleToolItemClick,
    handleMouseDown,
  };

  return <BoardContext.Provider value={boardContextVal}>{children}</BoardContext.Provider>;
};

export default BoardProvider;

