import { ELEMENT_ERASE_THRESHOLD, TOOLS } from "../constants";

export const getArrowHeadsCoors = (x1, y1, x2, y2, arrowDist) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
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

export const isPointCloseToLine = (x1, y1, x2, y2, pointX, pointY) => {
  const distToStart = distanceBetweenPoints(x1, y1, pointX, pointY);
  const distToEnd = distanceBetweenPoints(x2, y2, pointX, pointY);
  const distLine = distanceBetweenPoints(x1, y1, x2, y2);
  return Math.abs(distToStart + distToEnd - distLine) < ELEMENT_ERASE_THRESHOLD;
};

export const isNearPoint = (x, y, x1, y1) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5;
};

export const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

const distanceBetweenPoints = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

export const isPointNearElem = (element, pointX, pointY) => {
  const { x1, y1, x2, y2, options } = element;
  const context = document.getElementById("canvas").getContext("2d");
  switch (options.type) {
    case TOOLS.LINE:
    case TOOLS.ARROW:
      return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
    case TOOLS.RECTANGLE:
    case TOOLS.CIRCLE:
      return (
        isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
        isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
        isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
        isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
      );
    case TOOLS.BRUSH:
      return context.isPointInPath(element.path, pointX, pointY);
    default:
      throw new Error("Type not recognized");
  }
};

