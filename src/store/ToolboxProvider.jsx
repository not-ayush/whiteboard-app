import React from "react";
import ToolboxContext from "./toolbox-context";
import { useReducer } from "react";
import BoardContext from "./board-context";
import { TOOLS, COLORS, TOOLBOX_ACTIONS } from "../constants";

const toolboxReducer = (state, action) => {
  switch (action.type) {
    case TOOLBOX_ACTIONS.CHANGE_STROKE: {
      const newState = { ...state };
      newState[action.payload.tool].stroke = action.payload.stroke;
      return newState;
    }
    default:
      return state;
  }
};

const ToolboxProvider = ({ children }) => {
  // const { activeToolItem } = useContext(BoardContext);
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
      fill: null,
    },
    [TOOLS.CIRCLE]: {
      stroke: COLORS.BLACK,
      size: 1,
      fill: null,
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

  const toolBoxContextVal = { toolboxState, changeStroke };
  return <ToolboxContext value={toolBoxContextVal}>{children}</ToolboxContext>;
};

export default ToolboxProvider;

