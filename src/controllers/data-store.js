const descriptions = require('../descriptions.json');
const { host } = require('../utils');
const { createFishTank } = require('../models/fish-tank');

module.exports = (dataStore) => {
  // Default properties and values of dataStore when the simulation starts.
  dataStore.logs = [];
  dataStore.fishes = [];
  dataStore.ticks = [{ id: 0, fishes: [] }];
  dataStore.fishTank = createFishTank(dataStore);

  return {
    getDataStore: (req, res) => {
      const _host = host(req.connection, req.headers);

      const totalLogs = dataStore.logs.length;
      const totalTicks = dataStore.ticks.length;
      const totalFishesCreated = dataStore.fishes.length;
      const currentFishesPopulation =  (totalFishesCreated) ?
        dataStore.ticks[totalTicks - 1].fishes.length : 0;

      res.status(200);
      res.json({
        description: descriptions.dataStore.get,
        totalLogs,
        totalTicks,
        totalFishesCreated,
        currentFishesPopulation,
        lastLog: (totalLogs) ? dataStore.logs[totalLogs - 1] : null,
        lastTick: (totalTicks) ? dataStore.ticks[totalTicks - 1] : null,
        lastFish: (totalFishesCreated) ? dataStore.fishes[totalFishesCreated - 1] : null,
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
          },
          {
            method: 'GET',
            url: `${_host}/logs`,
            description: descriptions.logs.get
          }
        ]
      });
    }
  };
};
