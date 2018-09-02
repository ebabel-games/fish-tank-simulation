const express = require('express');
const app = express();

const fishes = [];



app.get('/fishes', (req, res) => res.send('Your aquarium fish population: ' + fishes.length));

app.get('/', (req, res) => res.send('Welcome to your virtual aquarium'));

app.listen(3000, () => console.log('App listening on port 3000'));

module.exports = app;
