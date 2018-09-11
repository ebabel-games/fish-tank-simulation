const domain = 'https://fish-tank-simulation-uczfxcqaxz.now.sh';

const callApi = (method = 'GET', url = domain) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
      console.log(xhr.responseText);
    }
  };
  xhr.send();  
};

document.getElementById('controls').addEventListener('submit', (e) => {
  e.preventDefault();
});

document.getElementById('putFishes').addEventListener('click', (e) => {
  callApi('PUT', `${domain}/fishes`);
});

document.getElementById('putTicks').addEventListener('click', (e) => {
  callApi('PUT', `${domain}/ticks`);
});

document.getElementById('getLogs').addEventListener('click', (e) => {
  callApi('GET', `${domain}/logs`);
});

document.getElementById('getDataStore').addEventListener('click', (e) => {
  callApi();
});

const clock = new THREE.Clock();

// Create an empty scene
const scene = new THREE.Scene();

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer with Antialiasing
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer clear color
renderer.setClearColor("#0e0727");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

// Create a Cube Mesh with basic material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#433F81" });
const cube = new THREE.Mesh(geometry, material);

// Add cube to Scene
scene.add(cube);

// Render Loop
const render = () => {
  // Calculate Delta.
  const delta = clock.getDelta();

  const speedInUnitsPerSecond = 2;

  cube.rotation.x += delta * speedInUnitsPerSecond;
  cube.rotation.y += delta * speedInUnitsPerSecond;

  console.log(delta, delta * speedInUnitsPerSecond);

  // Render the scene
  renderer.render(scene, camera);

  requestAnimationFrame(render);
};

render();
