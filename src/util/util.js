import { TOOLS } from "../constants";
import rough from "roughjs/bin/rough";

const gen = rough.generator();

const getArrowHeadsCoors = (x1, y1, x2, y2) => {
  const angle = Math.atan((y2 - y1) / (x2 - x1));
  const arrowDist = 20;
  const x3 = x2 - arrowDist * Math.cos(angle - Math.PI / 6);
  const y3 = y2 - arrowDist * Math.sin(angle - Math.PI / 6);
  const x4 = x2 - arrowDist * Math.cos(angle + Math.PI / 6);
  const y4 = y2 - arrowDist * Math.sin(angle + Math.PI / 6);
  return {
    x3,
    y3,
    x4,
    y4,
  };
};

export const createNewElement = (id, x1, y1, x2, y2, { type }) => {
  let newRoughElem;
  switch (type) {
    case TOOLS.LINE:
      newRoughElem = gen.line(x1, y1, x2, y2, { seed: id + 1 });
      break;
    case TOOLS.RECTANGLE:
      newRoughElem = gen.rectangle(x1, y1, x2 - x1, y2 - y1, { seed: id + 1 });
      break;
    case TOOLS.CIRCLE: {
      let cx = (x1 + x2) / 2;
      let cy = (y1 + y2) / 2;
      newRoughElem = gen.ellipse(cx, cy, x2 - x1, y2 - y1, { seed: id + 1 });
      break;
    }
    case TOOLS.ARROW: {
      const { x3, y3, x4, y4 } = getArrowHeadsCoors(x1, y1, x2, y2);
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
  };
  return newElem;
};

