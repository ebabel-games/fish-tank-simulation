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
  if (logsWindow.childNodes.length > 7) {
    while (logsWindow.childNodes.length > 7) {
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
      updateLogs(JSON.parse(xhr.response).logs);
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
camera.position.set(0, 150, 400);
camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#0e0727");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Light.
const light = new THREE.PointLight(0xffffff);
light.position.set(0,250,0);
scene.add(light);

// Floor
var floorTexture = new THREE.ImageUtils.loadTexture('assets/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set( 10, 10 );
var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.5;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

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

  // Render the scene.
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();
