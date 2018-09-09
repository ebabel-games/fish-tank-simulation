const { trait, positive, randomLocation, randomTick } = require('../utils.js');

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

module.exports = {
  createFish
};
