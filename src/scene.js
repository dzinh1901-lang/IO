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
  camera.position.set(0, 10, 42);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  appRoot.appendChild(renderer.domElement);

  const composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.1, 0.85, 0.15));

  const ambientLight = new THREE.AmbientLight(0x89aaff, 0.35);
  scene.add(ambientLight);

  const sunLight = new THREE.PointLight(0xffddaa, 3.8, 500, 2);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(40, 25, 10);
  scene.add(directionalLight);

  const rimLight = new THREE.DirectionalLight(0x4d79ff, 0.7);
  rimLight.position.set(-20, -10, -30);
  scene.add(rimLight);

  const controls = createControls(camera, renderer.domElement);
  controls.minDistance = 16;
  controls.maxDistance = 140;
  controls.target.set(0, 0, 0);
  controls.update();

  const { updatePlanet } = createPlanetSystem(scene, loading);
  const { updateStars } = createStars(scene);

  bindResize({ camera, renderer, composer });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta() * 60;
    const elapsed = clock.getElapsedTime();

    updatePlanet(delta);
    updateStars(delta);

    controls.target.x = Math.sin(elapsed * 0.04) * 1.2;
    controls.target.y = Math.cos(elapsed * 0.03) * 0.6;
    controls.update();
    composer.render();
  }

  animate();
}