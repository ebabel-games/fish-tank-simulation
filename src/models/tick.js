const { highestTick } = require('../utils');

const create = (dataStore, tick) => {
  const _highestTick = highestTick(dataStore.ticks);

  let ticksToCreate = 1;

  if (tick !== undefined && dataStore.ticks.length > 0 && tick > _highestTick) {
    ticksToCreate = tick - _highestTick;
  }

  if (tick !== undefined && tick <= _highestTick) {
    throw new Error('Tick already exists and cannot be created.');
  }

  let increment = 1;
  return new Array(ticksToCreate).fill({}).map((_tick) => {
    _tick.id = (dataStore.ticks.length === 0) ? 0 : _highestTick + increment;
    increment = increment + 1;
    return _tick;
  });
};

module.exports = {
  create
};
