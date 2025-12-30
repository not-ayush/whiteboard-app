import { TOOLS } from "../constants";
import rough from "roughjs/bin/rough";
import { getArrowHeadsCoors } from "./math";

const gen = rough.generator();

export const createNewElement = (id, x1, y1, x2, y2, options) => {
  let newRoughElem;
  // console.log(options);
  switch (options.type) {
    case TOOLS.LINE:
      newRoughElem = gen.line(x1, y1, x2, y2, { seed: id + 1, strokeWidth: options.size, stroke: options.stroke });
      break;
    case TOOLS.RECTANGLE:
      newRoughElem = gen.rectangle(x1, y1, x2 - x1, y2 - y1, { seed: id + 1, strokeWidth: options.size, stroke: options.stroke, fill: options.fill });
      break;
    case TOOLS.CIRCLE: {
      let cx = (x1 + x2) / 2;
      let cy = (y1 + y2) / 2;
      newRoughElem = gen.ellipse(cx, cy, x2 - x1, y2 - y1, { seed: id + 1, strokeWidth: options.size, stroke: options.stroke, fill: options.fill });
      break;
    }
    case TOOLS.ARROW: {
      const { x3, y3, x4, y4 } = getArrowHeadsCoors(x1, y1, x2, y2, 20);
      newRoughElem = gen.linearPath(
        [
          [x1, y1],
          [x2, y2],
          [x3, y3],
          [x2, y2],
          [x4, y4],
        ],
        { seed: id + 1 }
      );
      break;
    }
    default:
      throw new Error("tool not recognized");
  }

  let newElem = {
    id,
    x1,
    y1,
    x2,
    y2,
    roughElem: newRoughElem,
    options,
  };
  return newElem;
};

