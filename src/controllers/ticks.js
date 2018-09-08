const descriptions = require('../descriptions.json');
const { host } = require('../utils');
const { createTick } = require('../models/tick');

module.exports = (dataStore) => {
  return {
    getTicks: (req, res) => {
      const _host = host(req.connection, req.headers);

      res.status(200);
      res.json({
        description: descriptions.ticks.get,
        ticks: dataStore.ticks,
        links: [
          {
            method: 'PUT',
            url: `${_host}/ticks`,
            description: descriptions.ticks.put,
            payload: {
              tick: 'Integer'
            }
          }
        ]
      });
    },
    putTick: (req, res) => {
      const _host = host(req.connection, req.headers);
      const ticks = createTick(dataStore, req.body.tick);

      // Add a range of ticks (one or several) to the data store.
      dataStore.ticks = dataStore.ticks.concat(ticks);

      res.status(201);
      res.json({
        description: descriptions.ticks.put,
        ticks,
        links: [
          {
            method: 'GET',
            url: `${_host}/ticks`,
            description: descriptions.ticks.get
          }
        ]
      });
    }
  };
};
