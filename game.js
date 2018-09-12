// Fish Tank Simulation.

// Web API.
const domain = 'https://fish-tank-simulation-ivxfzwdyav.now.sh';

let latestLog;

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

const callApi = (method = 'GET', endpoint) => {
  const url = `${domain}${endpoint}`;
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
      const response = JSON.parse(xhr.response);
      updateLogs(response.logs);
    }
  };
  xhr.send();
};

// First setup: start by creating a fish.
callApi('PUT', '/fishes');

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
floor.position.y = -1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// Skybox.
// Note: skybox works better for alpha blending with sprite images.
const skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
const skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x3c6478, side: THREE.BackSide });
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.add(skyBox);

// Underwater fog.
const fog = new THREE.FogExp2(0x3c6478, 0.0005);
scene.fog = fog;

// Particles setup.
const particleTexture = new THREE.TextureLoader().load('assets/spark.png');
const particleGroup = new THREE.Object3D();
particleGroup.position.y = 55;
const particleAttributes = { startSize: [], startPosition: [], randomness: [] };
let totalParticles = 18;
const radiusRange = 50;

for (let i = 0; i < totalParticles; i++) {
  const spriteMaterial = new THREE.SpriteMaterial({ map: particleTexture, color: 0xffffff });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
  sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
  sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));
  sprite.material.color.setHSL(Math.random(), 0.9, 0.7);
  sprite.material.blending = THREE.AdditiveBlending; // Glowing particles.
  particleGroup.add(sprite);

  // Add variable qualities to arrays, if they need to be accessed later.
  particleAttributes.startPosition.push(sprite.position.clone());
  particleAttributes.randomness.push(Math.random());
}
scene.add(particleGroup);

const animate = () => {
  const time = 4 * clock.getElapsedTime();
  
  for (let c = 0; c < particleGroup.children.length; c++) {
    const sprite = particleGroup.children[c];
    
    // Pulse away and towards center. Individual rates of movement.
    const a = particleAttributes.randomness[c] + 1;
    const pulseFactor = Math.sin(a * time) * 0.1 + 0.9;
    sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor;
    sprite.position.y = particleAttributes.startPosition[c].y * pulseFactor;
    sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor;	
  }

  // Rotate the entire group
  particleGroup.rotation.y = time * 0.75;
  
  controls.update();
};

// Render Loop.
let oneTick = 0;
let tenTicks = 0;
const render = () => {
  const delta = clock.getDelta(); // Calculate Delta.

  // Tick counters.
  oneTick += delta;
  tenTicks += delta;

  // Events happening every one tick.
  if (oneTick > 1) {
    callApi('PUT', '/ticks');
    oneTick = 0; // Reset tick counter.
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
