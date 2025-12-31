import React from "react";
import ToolboxContext from "./toolbox-context";
import { useReducer } from "react";
import { TOOLS, COLORS, TOOLBOX_ACTIONS } from "../constants";

const toolboxReducer = (state, action) => {
  switch (action.type) {
    case TOOLBOX_ACTIONS.CHANGE_STROKE: {
      const newState = { ...state };
      newState[action.payload.tool].stroke = action.payload.stroke;
      return newState;
    }
    case TOOLBOX_ACTIONS.CHANGE_FILL: {
      const newState = { ...state };
      newState[action.payload.tool].fill = action.payload.fill;
      return newState;
    }
    case TOOLBOX_ACTIONS.CHANGE_SIZE: {
      const newState = { ...state };
      newState[action.payload.tool].size = action.payload.size;
      return newState;
    }
    default:
      return state;
  }
};

const ToolboxProvider = ({ children }) => {
  const intialToolboxState = {
    [TOOLS.LINE]: {
      stroke: COLORS.BLACK,
      size: 1,
    },
    [TOOLS.ARROW]: {
      stroke: COLORS.BLACK,
      size: 1,
    },
    [TOOLS.RECTANGLE]: {
      stroke: COLORS.BLACK,
      size: 1,
      fill: COLORS.WHITE,
    },
    [TOOLS.CIRCLE]: {
      stroke: COLORS.BLACK,
      size: 1,
      fill: COLORS.WHITE,
    },
    [TOOLS.BRUSH]: {
      stroke: COLORS.BLACK,
      size: 1,
    },
  };
  const [toolboxState, dispatchToolboxAction] = useReducer(toolboxReducer, intialToolboxState);

  const changeStroke = (tool, color) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_STROKE,
      payload: {
        tool,
        stroke: color,
      },
    });
  };

  const changeFill = (tool, fill) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_FILL,
      payload: {
        tool,
        fill,
      },
    });
  };

  const changeSize = (tool, size) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_SIZE,
      payload: {
        tool,
        size,
      },
    });
  };

  const toolBoxContextVal = { toolboxState, changeStroke, changeFill, changeSize };
  return <ToolboxContext value={toolBoxContextVal}>{children}</ToolboxContext>;
};

export default ToolboxProvider;

