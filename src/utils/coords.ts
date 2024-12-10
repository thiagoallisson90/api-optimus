interface IEDCoords {
  x: number;
  y: number;
  z: number;
}

interface IRange {
  xLim: number;
  yLim: number;
}

export const genCoords = (
  n: number,
  lims: IRange = { xLim: 100, yLim: 100 }
): Array<IEDCoords> => {
  const coordinates: Array<IEDCoords> = [];

  for (let i = 0; i < n; i++) {
    coordinates.push({
      x: Math.random() * lims.xLim,
      y: Math.random() * lims.yLim,
      z: 1.5,
    });
  }

  return coordinates;
};
