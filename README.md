# Fish tank simulation
Node.js server-side simulation of an aquarium

## Install
You need Node.js and npm from https://nodejs.org/

```
npm install
```

## Test
```
npm test
```

Note: if a timeout occurs the first time the tests are run, try running again one more time. The timeout shouldn't occur a second time. If it does, maybe something is wrong indeed.

## Run locally in Development
```
npm start
```

Browse http://localhost:8080

## Deploy to Production
Any Node.js hosting will do, but I recommend free hosting, easy to deploy service "now", from https://zeit.co/
```
npm install -g now
```

You can deploy as many versions, each deployment is unique and kept published forever, for free.
```
now --public
```

Browse https://fish-tank-simulation-[UNIQUE_KEY].now.sh where [UNIQUE_KEY] is generated during the deployment in your terminal.

Note: If you never installed `now` before, the first time you do an e-mail challenge will run to setup a token on your machine. If that happens, run `now --public` again to deploy.

## Appendix - notes/gist for testing fish-tank-simulation 
https://gist.github.com/dgapitts/5127e58eab755ce8bd1b17327beb101e
