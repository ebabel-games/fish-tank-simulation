// Fish Tank Simulation.

// Web API.
const domain = 'https://fish-tank-simulation-ivxfzwdyav.now.sh';

let latestLog;

// Collection of all fishes, updated by API calls.
let fishes = [];

const updateLogs = (logs) => {
  const logsWindow = document.getElementById('logsWindow');

  logs.map((log) => {
    const text = document.createTextNode(log);
    const p = document.createElement('p');
    p.appendChild(text);
    logsWindow.appendChild(p);
  });

  // Not to damage client-side performance, older messages are removed,
  // otherwise the number of elements keeps growing other time.
  if (logsWindow.childNodes.length > 12) {
    while (logsWindow.childNodes.length > 12) {
      logsWindow.removeChild(logsWindow.firstChild);
    }
  }

  // Scroll to the bottom of logsWindow.
  logsWindow.scrollTop = logsWindow.scrollHeight;
}

const callApi = (method = 'GET', endpoint, init = false) => {
  const url = `${domain}${endpoint}`;
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    let response;
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
      response = JSON.parse(xhr.response);
      updateLogs(response.logs);
    }

    if (xhr.readyState === 4 && xhr.status === 201 && endpoint === '/ticks') {
      fishes = response.ticks[0].fishes;
    }

    if (xhr.readyState === 4 && xhr.status === 201 && endpoint === '/ticks' && init) {
      fishes.map(fish => {
        const sprite = createFishSprite(fish);
        particleGroup.add(sprite);
        particleAttributes.startPosition.push(sprite.position.clone());
        particleAttributes.randomness.push(Math.random());
        scene.add(particleGroup);
      });
    }

    if (xhr.readyState === 4 && xhr.status === 201 && endpoint === '/fishes') {
      const sprite = createFishSprite(response.fish);
      particleGroup.add(sprite);
      particleAttributes.startPosition.push(sprite.position.clone());
      particleAttributes.randomness.push(Math.random());
      scene.add(particleGroup);
    }
  };
  xhr.send();
};

// First call: initialize and create multiple fishes, if any.
callApi('PUT', '/ticks', true);

// THREE.js setup.
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 20000);
camera.position.set(87, 25, 253);
camera.rotation.set(-0.098, 0.33, 0.031);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#0e0727");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const windowResize = new THREEx.WindowResize(renderer, camera);

// Light.
const light = new THREE.PointLight(0xffffff);
light.position.set(0, 250, 0);
scene.add(light);

// Ground.
const floorTexture = new THREE.TextureLoader().load('assets/soil-beach.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
const floorGeometry = new THREE.PlaneGeometry(10000, 10000, 100, 100);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -50;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// Skybox.
// Note: skybox works better for alpha blending with sprite images.
const skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
const skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x3c6478, side: THREE.BackSide });
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.add(skyBox);

// Underwater "fog".
const fog = new THREE.FogExp2(0x3c6478, 0.0005);
scene.fog = fog;

// Create a fish sprite and add it to the collection of fishSprites.
const createFishSprite = (fish) => {
  const spriteMaterial = new THREE.SpriteMaterial({ map: particleTexture, color: 0xffffff });
  const sprite = new THREE.Sprite(spriteMaterial);

  sprite.name = fish.name;
  sprite.visible = false;
  sprite.scale.set(fish.life, fish.life, 1.0);
  sprite.position.set(fish.location[0], fish.location[1], fish.location[1]);
  sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));
  sprite.material.color.setHSL(Math.random(), 0.9, 0.7);
  sprite.material.blending = THREE.AdditiveBlending;

  return sprite;
};

// Particles setup.
const particleTexture = new THREE.TextureLoader().load('assets/spark.png');
const particleGroup = new THREE.Object3D();
particleGroup.position.y = 55;
const particleAttributes = { startSize: [], startPosition: [], randomness: [] };
const radiusRange = 50;

const animate = () => {
  const time = 4 * clock.getElapsedTime();
  
  for (let c = 0; c < particleGroup.children.length; c++) {
    const sprite = particleGroup.children[c];
    const a = particleAttributes.randomness[c] + 1;
    const pulseFactor = Math.sin(a * time) * 0.1 + 0.9;

    // Get the latest state of each fish represented by a sprite.
    const fish = fishes.filter(f => f.name === sprite.name);

    if (fish && fish.length > 0) {
      sprite.position.set(
        fish[0].location[0] * pulseFactor,
        fish[0].location[1] * pulseFactor,
        fish[0].location[2] * pulseFactor
      )
      sprite.scale.set(fish[0].life, fish[0].life, 1.0);
      sprite.visible = true;
    } else {
      sprite.visible = false;
    }
  }
  
  controls.update();
};

// Render Loop.
let quarterTick = 0;
let tenTicks = 0;
const render = () => {
  const delta = clock.getDelta(); // Calculate Delta.

  // Tick counters.
  quarterTick += delta;
  tenTicks += delta;

  // Events happening every one tick.
  if (quarterTick > 0.25) {
    callApi('PUT', '/ticks');
    quarterTick = 0; // Reset tick counter.
  }

  // Events every ten ticks.
  if (tenTicks > 10) {
    callApi('PUT', '/fishes');
    tenTicks = 0;
  }

  // Animate the fishes.
  animate();

  // Render the scene.
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();
