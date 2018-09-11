const goldenRatio = 1.61803398875;
const width = Math.ceil(goldenRatio * 100) * 2; // x
const height = width / 2;                       // y
const depth = height;                           // z

const createFishTank = (dataStore, tick = 0) => {
  dataStore.logs.push(`[${tick}] fish tank simulation starts.`);

  return {
    tick,
    location: [0, 0, 0],
    dimensions: [width, height, depth],
    minX: -(width / 2),
    maxX: width / 2,
    minY: -(height / 2),
    maxY: height / 2,
    minZ: -(depth / 2),
    maxZ: depth / 2
  };
};

module.exports = {
  createFishTank
};
