import React, { useContext } from "react";
import BoardContext from "./board-context";
import ToolboxContext from "./toolbox-context";
import { TA_STATES, TOOLS, TOOL_ACTIONS } from "../constants";
import { useReducer } from "react";
import { createNewElement, getSvgPathFromStroke } from "../util/util";
import getStroke from "perfect-freehand";

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
      const toolboxState = action.payload.toolboxState;
      const options = {
        type: state.activeToolItem,
        stroke: toolboxState[state.activeToolItem]?.stroke,
        fill: toolboxState[state.activeToolItem]?.fill,
        size: toolboxState[state.activeToolItem]?.size,
        points: [{ x: cX, y: cY }], // used for brush
      };
      const newElem = createNewElement(prevElements.length, cX, cY, cX, cY, options);
      return { ...state, toolActionState: TA_STATES.DRAWING, elements: [...prevElements, newElem] };
    }
    case TOOL_ACTIONS.DRAW_MOVE: {
      switch (state.activeToolItem) {
        case TOOLS.LINE:
        case TOOLS.RECTANGLE:
        case TOOLS.CIRCLE:
        case TOOLS.ARROW: {
          const curElements = [...state.elements];
          let elemLen = curElements.length;
          const lastElem = curElements[elemLen - 1];
          let cX = action.payload.clientX;
          let cY = action.payload.clientY;
          const options = {
            ...lastElem.options,
          };
          const newElem = createNewElement(curElements.length, lastElem.x1, lastElem.y1, cX, cY, options);
          curElements[elemLen - 1] = newElem;

          return {
            ...state,
            elements: [...curElements],
          };
        }
        case TOOLS.BRUSH: {
          /* 
          add new point to element.options.points array 
          */
          const curElements = [...state.elements];
          let elemLen = curElements.length;
          let cX = action.payload.clientX;
          let cY = action.payload.clientY;
          const lastElem = curElements[elemLen - 1];
          const points = [...lastElem.options.points, { x: cX, y: cY }];
          lastElem.options.points = points;
          lastElem.drawableElem = new Path2D(getSvgPathFromStroke(getStroke(points)));
          return {
            ...state,
            elements: [...curElements],
          };
        }
      }
      break;
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
  const { toolboxState } = useContext(ToolboxContext);
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
        toolboxState,
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

