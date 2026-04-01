import * as THREE from 'three';

export function createPlanetSystem(scene, loadingOverlay) {
  const fallbackPlanetMaterial = new THREE.MeshStandardMaterial({
    color: 0x4060ff,
    roughness: 0.95,
    metalness: 0.02
  });

  const planetGroup = new THREE.Group();
  scene.add(planetGroup);

  const planet = new THREE.Mesh(new THREE.SphereGeometry(2.6, 128, 128), fallbackPlanetMaterial);
  planetGroup.add(planet);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 128, 128),
    new THREE.MeshBasicMaterial({
      color: 0x5d8bff,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide
    })
  );
  planetGroup.add(atmosphere);

  const cloudLayer = new THREE.Mesh(
    new THREE.SphereGeometry(2.66, 128, 128),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      roughness: 1,
      metalness: 0
    })
  );
  planetGroup.add(cloudLayer);

  const ringGlow = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.06, 16, 200),
    new THREE.MeshBasicMaterial({
      color: 0x6ea8ff,
      transparent: true,
      opacity: 0.18
    })
  );
  ringGlow.rotation.x = Math.PI / 2.6;
  planetGroup.add(ringGlow);

  const textureLoader = new THREE.TextureLoader();
  const urls = {
    color: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    cloud: 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
    bump: 'https://threejs.org/examples/textures/planets/earth_bump_2048.jpg',
    specular: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'
  };

  let loaded = 0;
  const total = 4;
  const markLoaded = () => {
    loaded += 1;
    if (loaded >= total) {
      loadingOverlay.classList.add('hidden');
      setTimeout(() => loadingOverlay.remove(), 700);
    }
  };

  const loadTexture = (url, applyTexture) => {
    textureLoader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        applyTexture(texture);
        markLoaded();
      },
      undefined,
      () => markLoaded()
    );
  };

  loadTexture(urls.color, (texture) => {
    planet.material.map = texture;
    planet.material.needsUpdate = true;
  });

  loadTexture(urls.bump, (texture) => {
    planet.material.bumpMap = texture;
    planet.material.bumpScale = 0.08;
    planet.material.needsUpdate = true;
  });

  loadTexture(urls.specular, (texture) => {
    planet.material.roughnessMap = texture;
    planet.material.needsUpdate = true;
  });

  loadTexture(urls.cloud, (texture) => {
    cloudLayer.material.map = texture;
    cloudLayer.material.needsUpdate = true;
  });

  function updatePlanet() {
    planet.rotation.y += 0.0016;
    cloudLayer.rotation.y += 0.0019;
    atmosphere.rotation.y -= 0.0004;
    ringGlow.rotation.z += 0.0008;
  }

  return { planetGroup, planet, atmosphere, cloudLayer, ringGlow, updatePlanet };
}
