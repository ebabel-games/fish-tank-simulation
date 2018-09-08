const descriptions = require('../descriptions.json');
const { host } = require('../utils');

module.exports = (dataStore) => {
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
            description: descriptions.fishes.put,
            payload: {
              tick: 'Integer?'
            }
          },
          {
            method: 'GET',
            url: `${_host}/ticks`,
            description: descriptions.ticks.get
          },
          {
            method: 'PUT',
            url: `${_host}/ticks`,
            description: descriptions.ticks.put,
            payload: {
              tick: 'Integer?'
            }
          }
        ]
      });
    }
  };
};
