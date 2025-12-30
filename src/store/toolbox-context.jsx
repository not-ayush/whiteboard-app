import { createContext } from "react";

const ToolboxContext = createContext({
  toolboxState: {},
  changeStroke: () => {},
  changeFill: () => {},
});

export default ToolboxContext;

