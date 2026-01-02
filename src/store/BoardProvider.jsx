import React, { useCallback, useContext } from "react";
import BoardContext from "./board-context";
import ToolboxContext from "./toolbox-context";
import { TA_STATES, TOOLS, TOOL_ACTIONS } from "../constants";
import { useReducer } from "react";
import { createNewElement, getSvgPathFromStroke } from "../util/util";
import { isPointNearElem } from "../util/math";
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
      const curTool = state.activeToolItem;
      if (curTool == TOOLS.ERASE) {
        return { ...state, toolActionState: TA_STATES.HOLDING };
      }
      const toolboxState = action.payload.toolboxState;
      const options = {
        type: curTool,
        stroke: toolboxState[curTool]?.stroke,
        fill: toolboxState[curTool]?.fill,
        size: toolboxState[curTool]?.size,
      };
      if (curTool == TOOLS.BRUSH) options.points = [{ x: cX, y: cY }];
      if (curTool == TOOLS.TEXT) options.text = "";
      const newElem = createNewElement(prevElements.length, cX, cY, cX, cY, options);
      const curElements = [...prevElements, newElem];
      return {
        ...state,
        toolActionState: curTool == TOOLS.TEXT ? TA_STATES.WRITING : TA_STATES.HOLDING,
        elements: [...curElements],
      };
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
        case TOOLS.ERASE: {
          const curElements = [...state.elements];
          let cX = action.payload.clientX;
          let cY = action.payload.clientY;
          const newElements = curElements.filter((elem) => {
            return !isPointNearElem(elem, cX, cY);
          });
          const newHistory = state.history.slice(0, state.index + 1);
          newHistory.push(newElements);
          return { ...state, history: newHistory, index: newHistory.length - 1, elements: newElements };
        }
      }
      break;
    }
    case TOOL_ACTIONS.DRAW_UP: {
      const curElements = [...state.elements];
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(curElements);
      return {
        ...state,
        history: newHistory,
        index: newHistory.length - 1,
        toolActionState: TA_STATES.NONE,
      };
    }
    case TOOL_ACTIONS.CHANGE_TEXT: {
      const curElements = [...state.elements];
      let elemLen = curElements.length;
      const lastElem = curElements[elemLen - 1];
      lastElem.options.text = action.payload.text;
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(curElements);
      return {
        ...state,
        elements: curElements,
        history: newHistory,
        index: newHistory.length - 1,
        toolActionState: TA_STATES.NONE,
      };
    }
    case TOOL_ACTIONS.UNDO: {
      if (state.index - 1 < 0) return state;
      return {
        ...state,
        elements: state.history[state.index - 1],
        index: state.index - 1,
      };
    }
    case TOOL_ACTIONS.REDO: {
      if (state.index + 1 >= state.history.length) return state;
      return {
        ...state,
        elements: state.history[state.index + 1],
        index: state.index + 1,
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
  history: [[]],
  index: 0,
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
    if (boardState.toolActionState == TA_STATES.WRITING) {
      return;
    }
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
    if (boardState.toolActionState == TA_STATES.HOLDING) {
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
    if (boardState.toolActionState == TA_STATES.WRITING) return;
    if (boardState.toolActionType === TA_STATES.DRAWING) {
      dispatchBoardAction({
        type: TOOL_ACTIONS.DRAW_UP,
      });
    }
  };

  const hanldeTextAreaOnBlur = (text) => {
    dispatchBoardAction({
      type: TOOL_ACTIONS.CHANGE_TEXT,
      payload: {
        text,
      },
    });
  };

  const handleUndo = useCallback(() => {
    dispatchBoardAction({
      type: TOOL_ACTIONS.UNDO,
    });
  }, []);

  const handleRedo = useCallback(() => {
    dispatchBoardAction({
      type: TOOL_ACTIONS.REDO,
    });
  }, []);

  const boardContextVal = {
    activeToolItem: boardState.activeToolItem,
    toolActionState: boardState.toolActionState,
    elements: boardState.elements,
    handleToolItemClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    hanldeTextAreaOnBlur,
    handleUndo,
    handleRedo,
  };

  return <BoardContext.Provider value={boardContextVal}>{children}</BoardContext.Provider>;
};

export default BoardProvider;

