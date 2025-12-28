import React, { useContext } from "react";
import cx from "classnames";
import classes from "./index.module.css";
import { FaSlash, FaArrowRight } from "react-icons/fa";
import BoardContext from "../../store/board-context";
import { TOOLS } from "../../constants";

const Toolbar = () => {
  const { activeToolItem, handleToolItemClick } = useContext(BoardContext);
  return (
    <div className={classes.container}>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.LINE })} onClick={() => handleToolItemClick(TOOLS.LINE)}>
        <FaSlash />
      </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOLS.ARROW })} onClick={() => handleToolItemClick(TOOLS.ARROW)}>
        <FaArrowRight />
      </div>
    </div>
  );
};

export default Toolbar;

