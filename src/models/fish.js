const { trait, positive, random, randomLocation, randomTick, randomPosOrNeg, distance, dice } = require('../utils.js');

const createBlessedFish = (dataStore) => {
  return {
    name: 'Blessed Fish',
    strength: 1,
    stamina: 1,
    agility: 1,
    life: 12,
    attack: 1,
    defence: 1,
    tick: randomTick(dataStore.ticks),
    location: [0, 0, 0],
    fightMode: false,
    killList: []
  };
};

// Check whether the Blessed Fish is currently swimming in the fish tank.
const blessedFishIsPresent = (dataStore) =>
  dataStore.ticks[dataStore.ticks.length - 1].fishes
    .filter(fish => fish.name === 'Blessed Fish').length === 0;

const createFish = (dataStore) => {
  const strength = trait();
  const stamina = trait();
  const agility = trait();
  const life = positive(stamina + agility - strength) || 1;
  const tick = randomTick(dataStore.ticks);

  // Spawn the rare Blessed Fish?
  // There can be only one Blessed Fish, so check the last tick doesn't already have the Blessed Fish.
  if (random(999) === 333 && !blessedFishIsPresent()) {
    return createBlessedFish(dataStore);
  }

  return {
    name: `fish${tick}`,
    strength,
    stamina,
    agility,
    life,
    attack: positive((strength * 3) - (agility * 1.5)),
    defence: positive((agility * 3) - (strength * 1.5)),
    tick,
    location: randomLocation(dataStore.fishTank.dimensions),
    fightMode: false,
    killList: []
  };
};

// Take fishes in and make them swim to their next random location.
const swim = (fishes, dataStore) => fishes.map((_fish) => {
  // When a fish is engaged into a fight, it stops swimming.
  if (_fish.fightMode) return _fish;

  const nextLocation = [
    _fish.location[0] + randomPosOrNeg(4),
    _fish.location[1] + randomPosOrNeg(4),
    _fish.location[2] + randomPosOrNeg(4),
  ];

  // If the next location x coordinate would fall outside the bounding box of the fishTank,
  // restrain the next fish location to its current one.
  if (nextLocation[0] < dataStore.fishTank.minX || nextLocation[0] > dataStore.fishTank.maxX) {
    nextLocation[0] = _fish.location[0];
  }

  // y.
  if (nextLocation[1] < dataStore.fishTank.minY || nextLocation[1] > dataStore.fishTank.maxY) {
    nextLocation[1] = _fish.location[1];
  }

  // z.
  if (nextLocation[2] < dataStore.fishTank.minZ || nextLocation[2] > dataStore.fishTank.maxZ) {
    nextLocation[2] = _fish.location[2];
  }

  _fish.location = nextLocation;

  return _fish;
});

// fish attacks otherFish. In loop, all combinations are considered.
const fight = (fishes, dataStore, tick) => {
  for (let i = 0, l = fishes.length; i < l; i++) {
    const fish = fishes[i]; // Attacking fish.
    if (fish.life <= 0 || fish.name === 'Blessed Fish') continue;

    for (let i2 = 0; i2 < l; i2++) {
      let otherFish = fishes[i2]; // Defending fish.
      if (otherFish.life <= 0) continue;
      if (fish.name === otherFish.name) continue; // a fish will not attack himself.

      const _distance = distance(fish.location, otherFish.location);
      if (_distance > 32) continue; // fishes that are too far appart to attack each other.

      // Set both fish and otherFish fightMode to true, so they stop swimming.
      fish.fightMode = true;
      otherFish.fightMode = true;

      let attackBonus = fish.attack - otherFish.defence;
      if (attackBonus < 2) attackBonus = 2;
      if (dice() <= attackBonus) {
        const damage = dice();
        otherFish.life -= damage;
        dataStore.logs.push(`[${tick}] ${fish.name} bites ${otherFish.name} for ${damage} damage${damage > 1 ? 's' : ''}.`);
      } else {
        dataStore.logs.push(`[${tick}] ${fish.name} tries to bite ${otherFish.name} but misses.`);
      }

      // When the Blessed Fish gets attacked, if he still alive, he will heal the attacking fish.
      if (otherFish.name === 'Blessed Fish' && otherFish.life > 0) {
        const healing = random(3);
        fish.life += healing;
        dataStore.logs.push(`[${tick}] ${fish.name} is healed for ${healing} life by ${otherFish.name}!`);
      }

      if (otherFish.life <= 0) {
        fish.fightMode = false;
        const bonusLife = dice() + dice() + dice();
        fish.life += bonusLife;
        fish.killList.push(otherFish.name);
        dataStore.logs.push(`[${tick}] ${otherFish.name} has died, eaten by ${fish.name}.`);
        dataStore.logs.push(`[${tick}] ${fish.name} wins a bonus ${bonusLife} life!`);
      }
    }
  }

  return fishes;
};

module.exports = {
  createFish,
  swim,
  fight
};
