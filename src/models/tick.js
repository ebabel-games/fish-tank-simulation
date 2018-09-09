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

    // Is there any fish nearby so they should switch their fightMode to true?
    state.fishes = state.fishes.map(fish => {
      // Since fish has died, it will be removed from state.
      if (fish.life <= 0) return undefined;

      // fish is still alive, so he will check if it is close enough to all other fishes,
      // and if so, try to not be eaten by otherFish.
      state.fishes.filter(otherFish => otherFish.name !== fish.name).map((otherFish) => {
        const _distance = distance(fish.location, otherFish.location);
        if (_distance > 64 || otherFish.life <= 0 || fish.life <= 0) return otherFish;
        
        // The fish and the otherFish are close enough to fight.
        fish.fightMode = true;

        // Add otherFish to fish agro list.
        if (!fish.agroList.includes(otherFish.name) && otherFish.life > 0)
          fish.agroList.push(otherFish.name);

        // If otherFish is dead, remove him from fish agroList.
        if (fish.agroList.includes(otherFish.name) && otherFish.life <= 0)
          fish.agroList.splice(fish.agroList.indexOf(otherFish.name), 1);

        // otherFish attacks fish, and may inflict damage.
        const attackBonus = (otherFish.attack > fish.defence) ? otherFish.attack - fish.defence : 1;
        if (dice() <= attackBonus) {
          const damage = dice();
          fish.life -= damage;
          console.log(`${otherFish.name} hits ${fish.name} for ${damage} damage.`); /* eslint no-console: 0 */
        }

        // Is fish still alive?
        if (fish.life <= 0) {
          console.log(`${fish.name} has died, killed by ${otherFish.name}.`); /* eslint no-console: 0 */
        }
      });

      return fish;
    }).filter(fish => fish && fish.life > 0);  // Remove dead fishes.

    // Commit new tick state to the data store.
    dataStore.ticks[id] = deepCopy(state);

    return state;
  });
};

module.exports = {
  createTick
};
