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

// THREE.js setup.
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 4;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#0e0727");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a Cube Mesh with basic material.
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#433F81" });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// First setup: start by creating a fish.
callApi('PUT', '/fishes');

// Render Loop.
let oneTick = 0;
let tenTicks = 0;
const render = () => {
  const delta = clock.getDelta(); // Calculate Delta.

  // Cube animation.
  const cubeSpeedInUnitsPerSecond = 2;
  cube.rotation.x += delta * cubeSpeedInUnitsPerSecond;
  cube.rotation.y += delta * cubeSpeedInUnitsPerSecond;

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
