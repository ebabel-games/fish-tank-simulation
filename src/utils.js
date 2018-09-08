const random = (max) => Math.ceil(Math.random() * (max || 100));
const dice = () => random(6);
const trait = () => dice() + dice() + dice();
const positive = (input) =>  Math.ceil(Math.abs(input));

const randomLocation = (dimensions) => {
  const width = dimensions[0];
  const height = dimensions[1];
  const depth = dimensions[2];

  return [
    Math.floor(random(width) - width / 2),
    Math.floor(random(height) - height / 2),
    Math.floor(random(depth) - depth / 2)
  ];
};

const highestTick = (ticks) => Math.max(...ticks.map(tick => tick.id));

const randomTick = (ticks, max = 10) => (!ticks || ticks.length === 0) ?
    random(max)
    : highestTick(ticks) + random(max);

const host = (connection, headers) => `${connection.encrypted ? 'https' : 'http'}://${headers.host}`;

const deepCopy = (input) => JSON.parse(JSON.stringify(input));

module.exports = {
  random,
  dice,
  trait,
  positive,
  randomLocation,
  highestTick,
  randomTick,
  host,
  deepCopy
};
