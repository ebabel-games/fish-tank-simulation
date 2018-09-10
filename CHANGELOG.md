# Fish tank simulation changelog

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

# Features to add
- A very rare fish may spawn: a blessed fish, who refuses to attack other fishes. Instead he keeps on swimming when other fishes attack him. When the blessed fish gets bitten (successful attack), its attackers get healed with 1 life point each, and the blessed fish will take normal damage, as in any attack. There can be only one blessed fish in the whole aquarium. When a blessed fish dies, he will come back at some point in a future tick but no fish knows when exactly. This feature is inspired by a conversation I had with Gabriella.
