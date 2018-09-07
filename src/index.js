const express = require('express');
const bodyParser = require('body-parser');
const api = express();

// Default data store when the simulation starts.
const dataStore = {
  fishes: [],
  ticks: []
};

const { getFishes, putFish } = require('./fishes')(dataStore);
const { getTicks } = require('./ticks')(dataStore);

api.use(bodyParser.json());
api.get('/', getFishes);
api.put('/', putFish);
api.get('/ticks', getTicks);

let port = 8080;  // default while developing.
if (process.env.NODE_ENV === 'test') {
  port = 3000;
}
if (process.env.NODE_ENV === 'production') {
  port = 80;
}

api.listen(
  port,
  () => console.log('API listening on port ' + port) /* eslint no-console: 0 */
);

module.exports = api;
