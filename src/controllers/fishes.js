const descriptions = require('../descriptions.json');
const { host } = require('../utils');
const { create } = require('../models/fish');

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
            description: descriptions.fishes.put,
            payload: {
              tick: 'Integer'
            }
          }
        ]
      });
    },
    putFish: (req, res) => {
      const _host = host(req.connection, req.headers);
      const fish = create(dataStore, req.body.tick);

      // Add new data to the store.
      dataStore.fishes.push(fish);

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
