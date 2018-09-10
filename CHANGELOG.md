# Fish tank simulation changelog

## 1.6.1
- Add support for CORS, so the web API can be used from other hosts, including localhost, when it's deployed to Production.

## 1.6.0
- A very rare fish may spawn: the Blessed Fish. He refuses to attack other fishes. Instead he sacrifices himself to his attackers, and heals them each time one of them tries to bite him. The Blessed Fish will not flee. There can be only one Blessed Fish in the whole aquarium. When the Blessed Fish dies, he will come back at some point in a future tick, but no fish knows when exactly. This feature is inspired by a conversation I had with Gabriella.

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
