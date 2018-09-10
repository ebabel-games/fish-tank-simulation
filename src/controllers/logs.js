const descriptions = require('../descriptions.json');

module.exports = (dataStore) => {
  return {
    getLogs: (req, res) => {
      res.status(200);
      res.json({
        description: descriptions.dataStore.get,
        logs: dataStore.logs
      });
    }
  };
};
