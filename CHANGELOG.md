# Fish tank simulation changelog

## 1.6.0
- A very rare fish may spawn: the Blessed Fish, who refuses to attack other fishes. Instead he keeps on swimming when other fishes attack him. When the Blessed Fish gets bitten (successful attack), its attackers get healed with 1 life point each, and the Blessed Fish will take normal damage, as in any attack. There can be only one Blessed Fish in the whole aquarium. When the Blessed Fish dies, he will come back at some point in a future tick but no fish knows when exactly. This feature is inspired by a conversation I had with Gabriella.

## 1.5.0
- Replace all console.log messages with a new endpoint that can list all log messages.
- Setup deployment to `now` from https://zeit.co/

## 1.4.0
- Fishes attack each other.

## 1.3.0
- Fishes swim from tick to tick.

## 1.2.0
- When a tick is created, it needs to track which fish is where.

## 1.1.0
- List and create fishes.
- List and create ticks.

## 1.0.0
- Hello world.
