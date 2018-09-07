const descriptions = require('./descriptions.json');

module.exports = (dataStore) => {
  return {
    getTicks: (req, res) => {
      res.status(200);
      res.json({
        description: descriptions.ticks.get,
        ticks: dataStore.ticks
      });
    }
  };
};
