import React, { useContext } from "react";
import cx from "classnames";
import classes from "./index.module.css";
import { FaSlash, FaRegCircle, FaArrowRight, FaPaintBrush, FaEraser, FaUndoAlt, FaRedoAlt, FaFont, FaDownload } from "react-icons/fa";

import { LuRectangleHorizontal } from "react-icons/lu";
import BoardContext from "../../store/board-context";
import { TOOLS } from "../../constants";

const Toolbar = () => {
  const { activeToolItem, handleToolItemClick, handleUndo, handleRedo } = useContext(BoardContext);

  const handleDownload = () => {
    const canvasElem = document.getElementById("canvas");
    const data = canvasElem.toDataURL("image/jpg");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "board.png";
    anchor.click();
  };

  return (
    <div className={classes.container}>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.BRUSH })} onClick={() => handleToolItemClick(TOOLS.BRUSH)}>
        <FaPaintBrush />
      </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.LINE })} onClick={() => handleToolItemClick(TOOLS.LINE)}>
        <FaSlash />
      </div>
      <div
        className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.RECTANGLE })}
        onClick={() => handleToolItemClick(TOOLS.RECTANGLE)}
      >
        <LuRectangleHorizontal />
      </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.CIRCLE })} onClick={() => handleToolItemClick(TOOLS.CIRCLE)}>
        <FaRegCircle />
      </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.ARROW })} onClick={() => handleToolItemClick(TOOLS.ARROW)}>
        <FaArrowRight />
      </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.ERASE })} onClick={() => handleToolItemClick(TOOLS.ERASE)}>
        <FaEraser />
      </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.TEXT })} onClick={() => handleToolItemClick(TOOLS.TEXT)}>
        <FaFont />
      </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.UNDO })} onClick={handleUndo}>
        <FaUndoAlt />
      </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.REDO })} onClick={handleRedo}>
        <FaRedoAlt />
      </div>
      <div className={cx(classes.toolItem)} onClick={handleDownload}>
        <FaDownload />
      </div>
    </div>
  );
};

export default Toolbar;

