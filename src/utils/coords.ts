interface IEDCoords {
  x: number;
  y: number;
  z: number;
}

export const genCoords = (n: number): Array<IEDCoords> => {
  const coordinates: Array<IEDCoords> = [];

  for (let i = 0; i < n; i++) {
    coordinates.push({
      x: Math.random() * 10000, // Valor entre 0 e 10000
      y: Math.random() * 10000, // Valor entre 0 e 10000
      z: 1.5,
    });
  }

  return coordinates;
};
