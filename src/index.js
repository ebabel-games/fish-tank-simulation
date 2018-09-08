const express = require('express');
const bodyParser = require('body-parser');
const api = express();

// Aquarium.
const GOLDEN_RATIO = 1.61803398875;
const AQUARIUM_HEIGHT = Math.ceil(GOLDEN_RATIO * 1000);   // y
const AQUARIUM_WIDTH = AQUARIUM_HEIGHT * 2;               // x
const AQUARIUM_DEPTH = AQUARIUM_HEIGHT;                   // z

// Default data store when the simulation starts.
const dataStore = {
  fishes: [],
  ticks: [{ id: 0, fishes: [] }],
  aquarium: {
    tick: 0,
    location: [0, 0, 0],
    dimensions: [AQUARIUM_WIDTH, AQUARIUM_HEIGHT, AQUARIUM_DEPTH]
  }
};

api.settings['x-powered-by'] = false;
api.use(bodyParser.json());

const { getDataStore } = require('./controllers/data-store')(dataStore);
const { getFishes, putFish } = require('./controllers/fishes')(dataStore);
const { getTicks, putTick } = require('./controllers/ticks')(dataStore);

// Routes.
api.get('/', getDataStore);
api.get('/fishes', getFishes);
api.put('/fishes', putFish);
api.get('/ticks', getTicks);
api.put('/ticks', putTick);

let port = 8080;  // default while developing.
if (process.env.NODE_ENV === 'test') {
  port = 3000;
}
if (process.env.NODE_ENV === 'production') {
  port = 80;
}

api.listen(
  port,
  () => console.log('API listening on port %s', port) /* eslint no-console: 0 */
);

module.exports = api;
