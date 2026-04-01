import * as THREE from 'three';
import { CelestialBody, createAsteroidBelt } from './celestial-body.js';

export function createPlanetSystem(scene, loadingOverlay) {
  const planetGroup = new THREE.Group();
  scene.add(planetGroup);

  const bodies = [
    new CelestialBody({
      name: 'Sun',
      size: 3.8,
      texture: 'https://threejs.org/examples/textures/planets/sun.jpg',
      orbitalRadius: 0,
      rotationSpeed: 0.0018,
      emissive: true
    }),
    new CelestialBody({
      name: 'Earth',
      size: 1.15,
      texture: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
      orbitalRadius: 11,
      rotationSpeed: 0.01
    }),
    new CelestialBody({
      name: 'Jupiter',
      size: 2.35,
      texture: 'https://threejs.org/examples/textures/planets/jupiter.jpg',
      orbitalRadius: 18,
      rotationSpeed: 0.018
    }),
    new CelestialBody({
      name: 'Saturn',
      size: 2.1,
      texture: 'https://threejs.org/examples/textures/planets/saturn.jpg',
      orbitalRadius: 26,
      rotationSpeed: 0.016,
      ring: {
        innerRadius: 2.8,
        outerRadius: 4.4,
        color: 0xcdbb8f
      }
    })
  ];

  bodies.forEach((body) => {
    planetGroup.add(body.orbitGroup);
  });

  const { belt, updateAsteroids } = createAsteroidBelt({
    innerRadius: 13.5,
    outerRadius: 17,
    count: 5000
  });
  planetGroup.add(belt);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(4.7, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xffc76b,
      transparent: true,
      opacity: 0.08
    })
  );
  planetGroup.add(glow);

  loadingOverlay.classList.add('hidden');
  setTimeout(() => loadingOverlay.remove(), 700);

  function updatePlanet(delta) {
    bodies.forEach((body) => body.update(delta));
    glow.rotation.y += 0.0006 * delta;
    updateAsteroids(delta);
  }

  return {
    planetGroup,
    bodies,
    belt,
    updatePlanet
  };
}