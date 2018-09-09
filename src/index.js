const express = require('express');
const bodyParser = require('body-parser');
const api = express();

api.settings['x-powered-by'] = false;
api.use(bodyParser.json());

const dataStore = {};
const { getDataStore } = require('./controllers/data-store')(dataStore);  // First controller, it initializes dataStore.
const { getFishes, putFish } = require('./controllers/fishes')(dataStore);
const { getTicks, putTick } = require('./controllers/ticks')(dataStore);

// Routes.
api.get('/', getDataStore);
api.get('/fishes', getFishes);
api.put('/fishes', putFish);
api.get('/ticks', getTicks);
api.put('/ticks', putTick);

let port = 8080;  // default while developing.
if (process.env.NODE_ENV === 'test') port = 3000;
if (process.env.NODE_ENV === 'production') port = 80;
api.listen(port, () => console.log(`API listening on port ${port}`)); /* eslint no-console: 0 */

module.exports = api;
