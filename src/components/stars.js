import * as THREE from 'three';

export function createStars(scene) {
  const galaxyRadius = 900;

  const starfield = new THREE.Mesh(
    new THREE.SphereGeometry(galaxyRadius, 96, 96),
    new THREE.MeshBasicMaterial({
      color: 0x020611,
      side: THREE.BackSide
    })
  );
  scene.add(starfield);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      starfield.material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
      });
    },
    undefined,
    () => {}
  );

  const starCount = 5000;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const radius = THREE.MathUtils.randFloat(60, 820);
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.cos(phi);
    starPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    })
  );
  scene.add(stars);

  function updateStars() {
    stars.rotation.y += 0.00008;
    starfield.rotation.y += 0.00003;
  }

  return { starfield, stars, updateStars };
}