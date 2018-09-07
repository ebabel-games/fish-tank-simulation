const descriptions = require('./descriptions.json');

const random = max => Math.ceil(Math.random() * (max || 100));
const dice = () => random(6);
const trait = () => dice() + dice() + dice();
const positive = (input) =>  Math.ceil(Math.abs(input));

module.exports = (dataStore) => {
  return {
    getFishes: (req, res) => res.send({
      description: descriptions.fishes.get,
      fishes: dataStore.fishes,
      links: [
        {
          method: 'PUT',
          path: '/',
          description: descriptions.fishes.put
        }
      ]
    }),
    putFish: (req, res) => {
      const strength = trait();
      const stamina = trait();
      const agility = trait();
      const newFish = {
        strength,
        stamina,
        agility,
        life: positive(stamina + agility - strength) || 1,
        attack: positive((strength * 3) - (agility * 1.5)),
        defence: positive((agility * 3) - (strength * 1.5))
      };

      dataStore.fishes.push(newFish);

      res.send({
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
