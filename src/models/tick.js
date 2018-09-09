const { highestTick, deepCopy, distance, dice } = require('../utils');
const { swimFishes } = require('./fish');

const createTick = (dataStore, tick) => {
  const _highestTick = highestTick(dataStore.ticks);

  let ticksToCreate = 1;

  if (tick !== undefined && tick > _highestTick) {
    ticksToCreate = tick - _highestTick;
  }

  if (tick !== undefined && tick <= _highestTick) {
    throw new Error('Tick already exists and cannot be created.');
  }

  let increment = 1;
  return new Array(ticksToCreate).fill({}).map(() => {
    // Current tick id.
    const id = (dataStore.ticks.length === 0) ? 0 : _highestTick + increment;
    increment = increment + 1;

    let state = { id };

    // Copy the previous tick state if the current tick isn't 0.
    if (id > 0) {
      // Deep copy, so updating properties in "state" will not affect the previous tick.
      state = deepCopy(dataStore.ticks[id - 1]);
      state.id = id;
    }

    // All existing fishes should swim to a random point near them.
    state.fishes = swimFishes(state.fishes, dataStore);

    // Is a fish spawned in the current tick?
    const fish = dataStore.fishes.filter(fish => fish.tick === id);
    if (fish && fish.length > 0) {
      // When a fish is found, add it to the list of existing fishes.
      state.fishes.push(deepCopy(fish[0]));
    }

    for (let i = 0, l = state.fishes.length; i < l; i++) {
      const fish = state.fishes[i];

      if (fish.life <= 0) continue;

      for (let i2 = 0; i2 < l; i2++) {
        let otherFish = state.fishes[i2];

        if (otherFish.life <= 0) continue;

        if (fish.name === otherFish.name) continue; // a fish will not attack himself.

        const _distance = distance(fish.location, otherFish.location);
        if (_distance > 64) continue; // fishes that are too far appart to attack each other.

        // Set both fish and otherFish fightMode to true, so they stop swimming.
        fish.fightMode = true;
        otherFish.fightMode = true;

        let attackBonus = fish.attack - otherFish.defence;
        if (attackBonus < 2) attackBonus = 2;
        if (dice() <= attackBonus) {
          const damage = dice();
          otherFish.life -= damage;
          console.log(`${fish.name} bites ${otherFish.name} for ${damage} damage.`); /* eslint no-console: 0 */
        } else {
          console.log(`${fish.name} tries to bite ${otherFish.name} but misses.`); /* eslint no-console: 0 */
        }

        if (otherFish.life <= 0) {
          fish.fightMode = false;
          const bonusLife = dice() + dice() + dice();
          fish.life += bonusLife;
          fish.killList.push(otherFish.name);
          console.log(`${otherFish.name} has died, eaten by ${fish.name}.`); /* eslint no-console: 0 */
          console.log(`Kill list of ${fish.name}: ${fish.killList.join(', ')}.`); /* eslint no-console: 0 */
          console.log(`${fish.name} wins a bonus ${bonusLife} life!`); /* eslint no-console: 0 */
        }
      }
    }

    // Remove dead fishes.
    state.fishes = state.fishes.filter(fish => fish.life > 0);

    // Commit new tick state to the data store.
    dataStore.ticks[id] = deepCopy(state);

    return state;
  });
};

module.exports = {
  createTick
};
