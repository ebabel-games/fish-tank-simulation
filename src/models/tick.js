const { highestTick, deepCopy } = require('../utils');
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
    // If a fish is found, add it to the list of existing fishes.
    if (fish && fish.length > 0) {
      state.fishes.push(deepCopy(fish[0]));
    }

    // Commit new tick state to the data store.
    dataStore.ticks[id] = deepCopy(state);

    return state;
  });
};

module.exports = {
  createTick
};
