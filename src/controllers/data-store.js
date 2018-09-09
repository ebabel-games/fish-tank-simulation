const descriptions = require('../descriptions.json');
const { host } = require('../utils');

module.exports = (dataStore) => {
  // Aquarium.
  const GOLDEN_RATIO = 1.61803398875;
  const AQUARIUM_WIDTH = Math.ceil(GOLDEN_RATIO * 100) * 2; // x
  const AQUARIUM_HEIGHT = AQUARIUM_WIDTH / 2;               // y
  const AQUARIUM_DEPTH = AQUARIUM_HEIGHT;                   // z

  // Default properties and values of dataStore when the simulation starts.
  dataStore.fishes = [];
  dataStore.ticks = [{ id: 0, fishes: [] }];
  dataStore.aquarium = {
    tick: 0,
    location: [0, 0, 0],
    dimensions: [AQUARIUM_WIDTH, AQUARIUM_HEIGHT, AQUARIUM_DEPTH],
    minX: -(AQUARIUM_WIDTH / 2),
    maxX: AQUARIUM_WIDTH / 2,
    minY: -(AQUARIUM_HEIGHT / 2),
    maxY: AQUARIUM_HEIGHT / 2,
    minZ: -(AQUARIUM_DEPTH / 2),
    maxZ: AQUARIUM_DEPTH / 2
  };

  return {
    getDataStore: (req, res) => {
      const _host = host(req.connection, req.headers);

      res.status(200);
      res.json({
        description: descriptions.dataStore.get,
        dataStore,
        links: [
          {
            method: 'GET',
            url: `${_host}/fishes`,
            description: descriptions.fishes.get
          },
          {
            method: 'PUT',
            url: `${_host}/fishes`,
            description: descriptions.fishes.put
          },
          {
            method: 'GET',
            url: `${_host}/ticks`,
            description: descriptions.ticks.get
          },
          {
            method: 'PUT',
            url: `${_host}/ticks`,
            description: descriptions.ticks.put
          }
        ]
      });
    }
  };
};
