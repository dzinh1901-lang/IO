import * as THREE from 'three';

export class CelestialBody {
  constructor({ name, size, texture, orbitalRadius, rotationSpeed, emissive = false, ring = null }) {
    this.name = name;
    this.rotationSpeed = rotationSpeed;
    this.orbitalRadius = orbitalRadius;

    this.orbitGroup = new THREE.Group();

    const loader = new THREE.TextureLoader();
    const geo = new THREE.SphereGeometry(size, 64, 64);

    const mat = emissive
      ? new THREE.MeshStandardMaterial({
          map: loader.load(texture),
          emissive: new THREE.Color(0xffa000),
          emissiveIntensity: 1.0
        })
      : new THREE.MeshStandardMaterial({ map: loader.load(texture) });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.x = orbitalRadius;
    this.orbitGroup.add(this.mesh);

    if (ring) {
      const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ring.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.5;
      ringMesh.position.x = orbitalRadius;
      this.orbitGroup.add(ringMesh);
    }

    if (orbitalRadius > 0) {
      const orbitGeo = new THREE.RingGeometry(orbitalRadius - 0.01, orbitalRadius + 0.01, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x444455,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      });
      const orbitLine = new THREE.Mesh(orbitGeo, orbitMat);
      orbitLine.rotation.x = Math.PI / 2;
      this.orbitGroup.add(orbitLine);
    }
  }

  update(delta) {
    this.mesh.rotation.y += this.rotationSpeed * delta;
    if (this.orbitalRadius > 0) {
      this.orbitGroup.rotation.y += this.rotationSpeed * 0.1 * delta;
    }
  }
}

export function createAsteroidBelt({ innerRadius, outerRadius, count }) {
  const belt = new THREE.Group();
  const geo = new THREE.SphereGeometry(0.05, 4, 4);
  const mat = new THREE.MeshStandardMaterial({ color: 0x888888 });

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = innerRadius + Math.random() * (outerRadius - innerRadius);
    const asteroid = new THREE.Mesh(geo, mat);
    asteroid.position.set(
      Math.cos(angle) * r,
      (Math.random() - 0.5) * 0.8,
      Math.sin(angle) * r
    );
    asteroid.userData.orbitSpeed = 0.0005 + Math.random() * 0.0005;
    asteroid.userData.orbitRadius = r;
    asteroid.userData.angle = angle;
    belt.add(asteroid);
  }

  function updateAsteroids(delta) {
    belt.children.forEach((asteroid) => {
      asteroid.userData.angle += asteroid.userData.orbitSpeed * delta;
      asteroid.position.x = Math.cos(asteroid.userData.angle) * asteroid.userData.orbitRadius;
      asteroid.position.z = Math.sin(asteroid.userData.angle) * asteroid.userData.orbitRadius;
    });
  }

  return { belt, updateAsteroids };
}
