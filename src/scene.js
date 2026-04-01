import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { createControls } from './core/controls.js';
import { bindResize } from './core/resize.js';
import { createPlanetSystem } from './components/planet.js';
import { createStars } from './components/stars.js';

export function createSceneApp(appRoot) {
  const loading = document.createElement('div');
  loading.id = 'loading';
  loading.textContent = 'Loading galaxy experience...';
  document.body.appendChild(loading);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
  camera.position.set(0, 2, 14);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  appRoot.appendChild(renderer.domElement);

  const composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.9, 0.8, 0.2));

  const ambientLight = new THREE.AmbientLight(0x89aaff, 0.45);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.7);
  directionalLight.position.set(12, 8, 6);
  scene.add(directionalLight);

  const rimLight = new THREE.DirectionalLight(0x4d79ff, 1.2);
  rimLight.position.set(-10, -4, -12);
  scene.add(rimLight);

  const controls = createControls(camera, renderer.domElement);
  const { updatePlanet } = createPlanetSystem(scene, loading);
  const { updateStars } = createStars(scene);

  bindResize({ camera, renderer, composer });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    const driftX = Math.sin(elapsed * 0.12) * 0.18;
    const driftY = Math.cos(elapsed * 0.08) * 0.12;

    updatePlanet(elapsed);
    updateStars();

    controls.target.x = driftX;
    controls.target.y = driftY;
    controls.update();
    composer.render();
  }

  animate();
}
