const { trait, positive, randomLocation, randomTick, randomPosOrNeg } = require('../utils.js');

const createFish = (dataStore) => {
  const strength = trait();
  const stamina = trait();
  const agility = trait();
  const life = positive(stamina + agility - strength) || 1;

  return {
    strength,
    stamina,
    agility,
    life,
    attack: positive((strength * 3) - (agility * 1.5)),
    defence: positive((agility * 3) - (strength * 1.5)),
    tick: randomTick(dataStore.ticks),
    location: randomLocation(dataStore.aquarium.dimensions)
  };
};

// Take fishes in and make them swim to their next random location.
const swimFishes = (fishes, dataStore) => fishes.map((_fish) => {
  const nextLocation = [
    _fish.location[0] + randomPosOrNeg(4),
    _fish.location[1] + randomPosOrNeg(4),
    _fish.location[2] + randomPosOrNeg(4),
  ];

  // If the next location x coordinate would fall outside the bounding box of the aquarium,
  // restrain the next fish location to its current one.
  if (nextLocation[0] < dataStore.aquarium.minX || nextLocation[0] > dataStore.aquarium.maxX) {
    nextLocation[0] = _fish.location[0];
  }

  // y.
  if (nextLocation[1] < dataStore.aquarium.minY || nextLocation[1] > dataStore.aquarium.maxY) {
    nextLocation[1] = _fish.location[1];
  }

  // z.
  if (nextLocation[2] < dataStore.aquarium.minZ || nextLocation[2] > dataStore.aquarium.maxZ) {
    nextLocation[2] = _fish.location[2];
  }

  _fish.location = nextLocation;

  return _fish;
});

module.exports = {
  createFish,
  swimFishes
};
