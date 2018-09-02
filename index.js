const express = require('express');
const api = express();

// Default data store when the aquarium starts.
const dataStore = {
  fishes: []
};

const { getFishes, postFish } = require('./src/fishes')(dataStore);

api.get('/', getFishes);
api.post('/', postFish);

api.listen(3000, () => console.log('API listening on port 3000.'));

module.exports = api;
