import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPlanetSystem } from './src/components/planet.js';

const canvas = document.getElementById('gl-canvas');
if (!canvas) {
  console.error('Canvas element #gl-canvas not found!');
  throw new Error('Canvas element not found');
}

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000005);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 40);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 200;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xfff4e0, 2.5, 200);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Stars
const starGeo = new THREE.BufferGeometry();
const starCount = 8000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 800;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.3 })));

// Loading overlay — removed automatically by createPlanetSystem once textures are loaded
const loadingOverlay = document.createElement('div');
loadingOverlay.id = 'loading';
loadingOverlay.textContent = 'Loading…';
document.body.appendChild(loadingOverlay);

// Planet system
const { updatePlanet } = createPlanetSystem(scene, loadingOverlay);

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta() * 60;
  updatePlanet(delta);
  controls.update();
  renderer.render(scene, camera);
}
animate();