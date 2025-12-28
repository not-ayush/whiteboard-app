import { TOOLS } from "../constants";
import rough from "roughjs/bin/rough";

const gen = rough.generator();

export const createNewElement = (id, x1, y1, x2, y2, { type }) => {
  let newRoughElem;
  switch (type) {
    case TOOLS.LINE:
      newRoughElem = gen.line(x1, y1, x2, y2, { seed: id + 1 });
      break;
    case TOOLS.RECTANGLE:
      newRoughElem = gen.rectangle(x1, y1, x2 - x1, y2 - y1, { seed: id + 1 });
      break;
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

