const descriptions = require('./descriptions.json');

const random = max => Math.ceil(Math.random() * (max || 100));
const dice = () => random(6);
const trait = () => dice() + dice() + dice();
const positive = (input) =>  Math.ceil(Math.abs(input));

module.exports = (dataStore) => {
  return {
    getFishes: (req, res) => {
      res.status(200);
      res.json({
        description: descriptions.fishes.get,
        fishes: dataStore.fishes,
        links: [
          {
            method: 'PUT',
            path: '/',
            description: descriptions.fishes.put,
            payload: {
              spawnTick: 'Integer'
            }
          }
        ]
      });
    },
    putFish: (req, res) => {
      const strength = trait();
      const stamina = trait();
      const agility = trait();
      const spawnTick = (req.body.spawnTick === undefined)
        ? random(10000)
        : req.body.spawnTick;

      const newFish = {
        strength,
        stamina,
        agility,
        life: positive(stamina + agility - strength) || 1,
        attack: positive((strength * 3) - (agility * 1.5)),
        defence: positive((agility * 3) - (strength * 1.5)),
        spawnTick
      };

      dataStore.fishes.push(newFish);

      res.status(201);
      res.json({
        description: descriptions.fishes.put,
        newFish,
        links: [
          {
            method: 'GET',
            path: '/',
            description: descriptions.fishes.get
          }
        ]
      });
    }
  };
};
