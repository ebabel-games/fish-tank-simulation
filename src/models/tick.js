const { highestTick, deepCopy } = require('../utils');
const { swim, fight } = require('./fish');

const createTick = (dataStore, tick) => {
  const _highestTick = highestTick(dataStore.ticks);

  // Number of ticks to create. Default is 1.
  let ticksToCreate = 1;

  if (tick !== undefined && tick > _highestTick) {
    ticksToCreate = tick - _highestTick;
  }

  if (tick !== undefined && tick <= _highestTick) {
    throw new Error('Tick already exists and cannot be created.');
  }

  const logs = [];

  let increment = 1;
  const ticks = new Array(ticksToCreate).fill({}).map(() => {
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
    state.fishes = swim(state.fishes, dataStore);

    // Is a fish spawned in the current tick?
    const fish = dataStore.fishes.filter(fish => fish.tick === id);
    if (fish && fish.length > 0) {
      state.fishes.push(deepCopy(fish[0]));
      // Log the fact that fish has spawned.
      const message = `[${id}] ${fish[0].name} spawns with ${fish[0].life} life at ${JSON.stringify(fish[0].location)}.`;
      dataStore.logs.push(message);
      logs.push(message);
    }

    // All fishes that are near each other will fight (except the Blessed Fish, if present).
    const result = fight(state.fishes, dataStore, logs, id);
    state.fishes = result.fishes;
    logs.concat(result.logs);

    // Remove dead fishes.
    state.fishes = state.fishes.filter(fish => fish.life > 0);

    // Commit new tick state to the data store.
    dataStore.ticks[id] = deepCopy(state);

    return state;
  });

  return {
    ticks,
    logs
  };
};

module.exports = {
  createTick
};
