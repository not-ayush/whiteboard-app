import React from "react";
import BoardContext from "./board-context";
import { TA_STATES, TOOLS, TOOL_ACTIONS } from "../constants";
import { useReducer } from "react";
import rough from "roughjs/bin/rough";

const gen = rough.generator();
const boardReducer = (state, action) => {
  switch (action.type) {
    case TOOL_ACTIONS.CHANGE_TOOL:
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    case TOOL_ACTIONS.DRAW_DOWN: {
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
      return { ...state, toolActionState: TA_STATES.DRAWING, elements: [...prevElements, newElem] };
    }
    case TOOL_ACTIONS.DRAW_MOVE: {
      const curElements = [...state.elements];
      let elemLen = curElements.length;
      // if (elemLen == 0) return state;
      const lastElem = curElements[elemLen - 1];
      let cX = action.payload.clientX;
      let cY = action.payload.clientY;
      (lastElem.x2 = cX), (lastElem.y2 = cY), (lastElem.roughElem = gen.line(lastElem.x1, lastElem.y1, cX, cY));

      return {
        ...state,
        elements: curElements,
      };
    }
    case TOOL_ACTIONS.DRAW_UP: {
      return {
        ...state,
        toolActionState: TA_STATES.NONE,
      };
    }
    default:
      return state;
  }
};

const initialBoardState = {
  activeToolItem: TOOLS.LINE,
  toolActionState: TA_STATES.NONE,
  elements: [],
};

const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);

  const handleToolItemClick = (tool) => {
    dispatchBoardAction({
      type: TOOL_ACTIONS.CHANGE_TOOL,
      payload: {
        tool,
      },
    });
  };

  const handleMouseDown = (event) => {
    dispatchBoardAction({
      type: TOOL_ACTIONS.DRAW_DOWN,
      payload: {
        clientX: event.clientX,
        clientY: event.clientY,
      },
    });
  };

  const handleMouseMove = (event) => {
    if (boardState.toolActionState == TA_STATES.DRAWING) {
      dispatchBoardAction({
        type: TOOL_ACTIONS.DRAW_MOVE,
        payload: {
          clientX: event.clientX,
          clientY: event.clientY,
        },
      });
    }
  };

  const handleMouseUp = () => {
    dispatchBoardAction({
      type: TOOL_ACTIONS.DRAW_UP,
    });
  };

  const boardContextVal = {
    activeToolItem: boardState.activeToolItem,
    elements: boardState.elements,
    // toolActionState: boardState.toolActionState,
    handleToolItemClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };

  return <BoardContext.Provider value={boardContextVal}>{children}</BoardContext.Provider>;
};

export default BoardProvider;

