const random = max => Math.ceil(Math.random() * (max || 100));
const dice = () => random(6);
const trait = () => dice() + dice() + dice();
const positive = (input) =>  Math.ceil(Math.abs(input));

module.exports = (dataStore) => {
  return {
    getFishes: (req, res) => res.send({
      description: 'List all the fishes ever spawned, regardless of their current status, and with their default spawn values.',
      fishes: dataStore.fishes,
      links: [
        {
          method: 'POST',
          path: '/',
          description: 'Create a new fish. The fish is randomly generated, so there is no payload, but the response will return the fish that has just been created.'
        }
      ]
    }),
    postFish: (req, res) => {
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
        description: 'Create a new fish generated randomly.',
        newFish,
        links: [
          {
            method: 'GET',
            path: '/',
            description: 'List all the fishes ever spawned, regardless of their current status, and with their default spawn values.'
          }
        ]
      });
    }
  };
};
