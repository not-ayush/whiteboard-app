import { TOOLS } from "../constants";
import rough from "roughjs/bin/rough";
import { getArrowHeadsCoors } from "./math";
import getStroke from "perfect-freehand";

const gen = rough.generator();

export function getSvgPathFromStroke(points, closed = true) {
  const average = (a, b) => (a + b) / 2;
  const len = points.length;

  if (len < 4) {
    return ``;
  }

  let a = points[0];
  let b = points[1];
  const c = points[2];

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
  }

  if (closed) {
    result += "Z";
  }

  return result;
}

export const createNewElement = (id, x1, y1, x2, y2, options) => {
  let newDrawableElem;
  switch (options.type) {
    case TOOLS.LINE:
      newDrawableElem = gen.line(x1, y1, x2, y2, { seed: id + 1, strokeWidth: options.size, stroke: options.stroke });
      break;
    case TOOLS.RECTANGLE:
      newDrawableElem = gen.rectangle(x1, y1, x2 - x1, y2 - y1, {
        seed: id + 1,
        strokeWidth: options.size,
        stroke: options.stroke,
        fill: options.fill,
      });
      break;
    case TOOLS.CIRCLE: {
      let cx = (x1 + x2) / 2;
      let cy = (y1 + y2) / 2;
      newDrawableElem = gen.ellipse(cx, cy, x2 - x1, y2 - y1, {
        seed: id + 1,
        strokeWidth: options.size,
        stroke: options.stroke,
        fill: options.fill,
      });
      break;
    }
    case TOOLS.ARROW: {
      const { x3, y3, x4, y4 } = getArrowHeadsCoors(x1, y1, x2, y2, 20);
      newDrawableElem = gen.linearPath(
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
    case TOOLS.BRUSH: {
      const outlinePoints = getStroke(options.points);
      const pathData = getSvgPathFromStroke(outlinePoints);
      newDrawableElem = new Path2D(pathData);
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
    drawableElem: newDrawableElem,
    options,
  };
  return newElem;
};

