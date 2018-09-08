const descriptions = require('../descriptions.json');
const { host } = require('../utils');
const { createFish } = require('../models/fish');
const { createTick } = require('../models/tick');

module.exports = (dataStore) => {
  return {
    getFishes: (req, res) => {
      const _host = host(req.connection, req.headers);

      res.status(200);
      res.json({
        description: descriptions.fishes.get,
        fishes: dataStore.fishes,
        links: [
          {
            method: 'PUT',
            url: `${_host}/fishes`,
            description: descriptions.fishes.put
          }
        ]
      });
    },
    putFish: (req, res) => {
      const _host = host(req.connection, req.headers);
      const fish = createFish(dataStore);

      // Add a new fish to the data store.
      dataStore.fishes.push(fish);

      // Since a fish has been scheduled to spawn at a specific tick,
      // the simulation needs to make sure all intervening ticks are also created
      // until the tick when that fish spawns.
      createTick(dataStore, fish.tick);

      res.status(201);
      res.json({
        description: descriptions.fishes.put,
        fish,
        links: [
          {
            method: 'GET',
            url: `${_host}/fishes`,
            description: descriptions.fishes.get
          }
        ]
      });
    }
  };
};
