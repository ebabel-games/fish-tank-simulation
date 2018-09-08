const { trait, positive, randomLocation, randomTick } = require('../utils.js');

const create = (dataStore, tick) => {
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
    tick: (tick === undefined) ? randomTick(dataStore.ticks) : tick,
    location: randomLocation(dataStore.aquarium.dimensions),
    dimensions: [life * 2, life, life]
  };
};

module.exports = {
  create
};
