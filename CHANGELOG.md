# Fish tank simulation changelog

## 1.6.3
- Refactor code out of dataStore for the fishTank initial create.
- Refactor the fishTank into fishTank, to be consistent with the name of the project.
- Log the fishTank create event.
- Prepend each log message with a tick in square brackets to indicate when the event of that log message happened.
- Log when a fish spawns.
- Change the data-store endpoint ("/") to return a summary of the current state of the fish tank instead of all the data, because that's too much data and less useful than a snapshot.

## 1.6.2
- Add support for all HTTP verbs with CORS.

## 1.6.1
- Add support for CORS, so the web API can be used from other hosts, including localhost, when it's deployed to Production.

## 1.6.0
- A very rare fish may spawn: the Blessed Fish. He refuses to attack other fishes. Instead he sacrifices himself to his attackers, and heals them each time one of them tries to bite him. The Blessed Fish will not flee. There can be only one Blessed Fish in the whole fish tank. When the Blessed Fish dies, he will come back at some point in a future tick, but no fish knows when exactly. This feature is inspired by a conversation I had with Gabriella.

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
