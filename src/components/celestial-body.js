import * as THREE from 'three';

export class CelestialBody {
  constructor({ name, size, texture, orbitalRadius, rotationSpeed, emissive = false, ring = null }) {
    this.name = name;
    this.size = size;
    this.texture = texture;
    this.orbitalRadius = orbitalRadius;
    this.rotationSpeed = rotationSpeed;
    this.emissive = emissive;
    this.ring = ring;
    this.orbitSpeed = 0.02 / Math.max(orbitalRadius || 1, 1);
    this.orbitAngle = Math.random() * Math.PI * 2;

    this.orbitGroup = new THREE.Group();
    this.pivot = new THREE.Group();
    this.mesh = this.createMesh();

    this.pivot.add(this.mesh);
    this.mesh.position.x = orbitalRadius;
    this.orbitGroup.add(this.pivot);

    if (ring) {
      this.mesh.add(this.createRing(ring));
    }
  }

  createMesh() {
    const geometry = new THREE.SphereGeometry(this.size, 64, 64);
    const material = this.createMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = this.name;
    return mesh;
  }

  createMaterial() {
    const loader = new THREE.TextureLoader();
    const textureMap = this.texture ? loader.load(this.texture) : null;

    if (textureMap) {
      textureMap.colorSpace = THREE.SRGBColorSpace;
    }

    if (this.emissive) {
      return new THREE.MeshStandardMaterial({
        map: textureMap,
        emissive: new THREE.Color(0xffc76b),
        emissiveIntensity: 2.4,
        color: 0xffffff
      });
    }

    return new THREE.MeshStandardMaterial({
      map: textureMap,
      roughness: 1,
      metalness: 0
    });
  }

  createRing({ innerRadius, outerRadius, color = 0xd8c59f }) {
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      roughness: 1,
      metalness: 0
    });

    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = -Math.PI / 2.2;
    return ringMesh;
  }

  update(delta) {
    this.mesh.rotation.y += this.rotationSpeed * delta;

    if (this.orbitalRadius > 0) {
      this.orbitAngle += this.orbitSpeed * delta;
      this.pivot.position.set(
        Math.cos(this.orbitAngle) * this.orbitalRadius,
        0,
        Math.sin(this.orbitAngle) * this.orbitalRadius
      );
    }
  }
}

export function createAsteroidBelt({ innerRadius = 18, outerRadius = 24, count = 5000 }) {
  const geometries = [
    new THREE.DodecahedronGeometry(0.08, 0),
    new THREE.IcosahedronGeometry(0.09, 0),
    new THREE.BoxGeometry(0.12, 0.08, 0.1)
  ];

  const baseGeometry = geometries[0];
  const material = new THREE.MeshStandardMaterial({
    color: 0x8f8578,
    roughness: 1,
    metalness: 0
  });

  const belt = new THREE.InstancedMesh(baseGeometry, material, count);
  const dummy = new THREE.Object3D();
  const asteroidData = [];

  for (let i = 0; i < count; i += 1) {
    const radius = THREE.MathUtils.randFloat(innerRadius, outerRadius);
    const angle = Math.random() * Math.PI * 2;
    const y = THREE.MathUtils.randFloatSpread(1.2);
    const scale = THREE.MathUtils.randFloat(0.4, 1.8);
    const spin = THREE.MathUtils.randFloat(0.001, 0.008);
    const orbitSpeed = THREE.MathUtils.randFloat(0.0006, 0.0022);

    asteroidData.push({ radius, angle, y, scale, spin, orbitSpeed });

    dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    belt.setMatrixAt(i, dummy.matrix);
  }

  belt.instanceMatrix.needsUpdate = true;

  function updateAsteroids(delta) {
    for (let i = 0; i < asteroidData.length; i += 1) {
      const asteroid = asteroidData[i];
      asteroid.angle += asteroid.orbitSpeed * delta;

      dummy.position.set(
        Math.cos(asteroid.angle) * asteroid.radius,
        asteroid.y,
        Math.sin(asteroid.angle) * asteroid.radius
      );
      dummy.rotation.x += asteroid.spin * delta;
      dummy.rotation.y += asteroid.spin * 1.4 * delta;
      dummy.rotation.z += asteroid.spin * 0.8 * delta;
      dummy.scale.setScalar(asteroid.scale);
      dummy.updateMatrix();
      belt.setMatrixAt(i, dummy.matrix);
    }

    belt.instanceMatrix.needsUpdate = true;
  }

  return { belt, updateAsteroids };
}