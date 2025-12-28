import { createContext } from "react";

const BoardContext = createContext({
  activeToolItem: "",
  elements: [],
  handleToolItemClick: () => {},
  handleMouseDown: () => {},
});

export default BoardContext;

