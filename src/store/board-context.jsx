import { createContext } from "react";

const BoardContext = createContext({
  activeToolItem: "",
  toolActionState: "",
  elements: [],
  handleToolItemClick: () => {},
  handleMouseDown: () => {},
  handleMouseUp: () => {},
  handleMouseMove: () => {},
  hanldeTextAreaOnBlur: () => {},
});

export default BoardContext;

