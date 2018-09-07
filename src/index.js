const express = require('express');
const api = express();

// Default data store when the aquarium starts.
const dataStore = {
  fishes: []
};

const { getFishes, putFish } = require('./fishes')(dataStore);

api.get('/', getFishes);
api.put('/', putFish);

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
