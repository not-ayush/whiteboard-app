import React, { useState } from "react";
import cx from "classnames";
import classes from "./index.module.css";
import { FaSlash, FaArrowRight } from "react-icons/fa";

const Toolbar = () => {
  const [activeToolItem, setActiveTool] = useState("LINE");
  return (
    <div className={classes.container}>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === "LINE" })} onClick={() => setActiveTool("LINE")}>
        <FaSlash />
      </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === "ARROW" })} onClick={() => setActiveTool("ARROW")}>
        <FaArrowRight />
      </div>
    </div>
  );
};

export default Toolbar;

