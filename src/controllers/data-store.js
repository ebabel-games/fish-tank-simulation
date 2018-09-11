const descriptions = require('../descriptions.json');
const { host } = require('../utils');
const { createAquarium } = require('../models/aquarium');

module.exports = (dataStore) => {
  // Default properties and values of dataStore when the simulation starts.
  dataStore.logs = [];
  dataStore.fishes = [];
  dataStore.ticks = [{ id: 0, fishes: [] }];
  dataStore.aquarium = createAquarium(dataStore);

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
