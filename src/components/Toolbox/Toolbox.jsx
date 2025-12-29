import React from "react";
import BoardContext from "../../store/board-context";
import { useContext } from "react";
import ToolboxContext from "../../store/toolbox-context";
import cx from "classnames";
import classes from "./Toolbox.module.css";
import { COLORS } from "../../constants";

const Toolbox = () => {
  const { activeToolItem } = useContext(BoardContext);
  const { toolboxState, changeStroke } = useContext(ToolboxContext);

  const strokeColor = toolboxState[activeToolItem]?.stroke;

  return (
    <div className={classes.container}>
      <div className={classes.selectOptionContainer}>
        <div className={classes.toolBoxLabel}>Stroke Color</div>
        <div className={classes.colorsContainer}>
          {Object.keys(COLORS).map((k) => {
            return (
              <div
                key={k}
                className={cx(classes.colorBox, {
                  [classes.activeColorBox]: strokeColor === COLORS[k],
                })}
                style={{ backgroundColor: COLORS[k] }}
                onClick={() => changeStroke(activeToolItem, COLORS[k])}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Toolbox;

