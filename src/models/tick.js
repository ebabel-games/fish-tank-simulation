const { highestTick, deepCopy, distance } = require('../utils');
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
      state.fishes.filter(otherFish => otherFish.name !== fish.name).map((otherFish) => {
        const _distance = distance(fish.location, otherFish.location);
        if (_distance > 64) return otherFish;
        
        // The fish and the otherFish are close enough to fight.
        fish.fightMode = true;
        if (!fish.fightTargets.includes(otherFish.name))
          fish.fightTargets.push(otherFish.name);
      });

      return fish;
    });

    // todo: Get one round of fighting for all fishes that are in fight mode. Inflict damage on each fish that gets hurt.


    // Commit new tick state to the data store.
    dataStore.ticks[id] = deepCopy(state);

    return state;
  });
};

module.exports = {
  createTick
};
