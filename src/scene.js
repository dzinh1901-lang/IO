import * as THREE from 'three';
import { Tween, Easing, update as updateTween } from '@tweenjs/tween.js';
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
  controls.minDistance = 4;
  controls.maxDistance = 140;
  controls.target.set(0, 0, 0);
  controls.update();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let isFlying = false;

  const { updatePlanet, selectableMeshes } = createPlanetSystem(scene, loading);
  const { updateStars } = createStars(scene);

  function flyToBody(body) {
    if (!body || isFlying) {
      return;
    }

    const targetPosition = new THREE.Vector3();
    body.mesh.getWorldPosition(targetPosition);

    const radius = body.size;
    const distance = Math.max(radius * 4.5, radius + 2.5);
    const currentDirection = new THREE.Vector3()
      .subVectors(camera.position, controls.target)
      .normalize();

    if (currentDirection.lengthSq() === 0) {
      currentDirection.set(0.4, 0.25, 1).normalize();
    }

    const nextCameraPosition = targetPosition.clone().add(currentDirection.multiplyScalar(distance));

    const cameraTweenState = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    };

    const targetTweenState = {
      x: controls.target.x,
      y: controls.target.y,
      z: controls.target.z
    };

    isFlying = true;
    controls.enabled = false;

    new Tween(cameraTweenState)
      .to(
        {
          x: nextCameraPosition.x,
          y: nextCameraPosition.y,
          z: nextCameraPosition.z
        },
        1800
      )
      .easing(Easing.Cubic.InOut)
      .onUpdate(() => {
        camera.position.set(cameraTweenState.x, cameraTweenState.y, cameraTweenState.z);
      })
      .start();

    new Tween(targetTweenState)
      .to(
        {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z
        },
        1800
      )
      .easing(Easing.Cubic.InOut)
      .onUpdate(() => {
        controls.target.set(targetTweenState.x, targetTweenState.y, targetTweenState.z);
        controls.update();
      })
      .onComplete(() => {
        controls.enabled = true;
        isFlying = false;
      })
      .start();
  }

  function handlePointerDown(event) {
    if (isFlying) {
      return;
    }

    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(selectableMeshes, false);

    if (intersections.length > 0) {
      const selectedMesh = intersections[0].object;
      flyToBody(selectedMesh.userData.celestialBody);
    }
  }

  renderer.domElement.addEventListener('pointerdown', handlePointerDown);

  bindResize({ camera, renderer, composer });

  const clock = new THREE.Clock();

  function animate(time) {
    requestAnimationFrame(animate);

    const delta = clock.getDelta() * 60;
    const elapsed = clock.getElapsedTime();

    updateTween(time);
    updatePlanet(delta);
    updateStars(delta);

    if (!isFlying) {
      controls.target.x = Math.sin(elapsed * 0.04) * 1.2;
      controls.target.y = Math.cos(elapsed * 0.03) * 0.6;
    }

    controls.update();
    composer.render();
  }

  animate();
}