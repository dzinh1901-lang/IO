import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Setup Scene, Camera, and Renderer
const canvas = document.querySelector('#gl-canvas') || document.querySelector('canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
camera.position.set(0, 500, 1500);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Setup OrbitControls (Pan, Zoom, Rotate)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 10000;
controls.minDistance = 10;

// 3. Generate Starfield (Galaxy)
const starCount = 50000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(starCount * 3);
const colors = new Float32Array(starCount * 3);

const colorObject = new THREE.Color();

for (let i = 0; i < starCount; i++) {
    const r = Math.random() * 2000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = (r * Math.cos(phi)) * 0.2;
    const z = r * Math.sin(phi) * Math.sin(theta);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const distanceToCenter = Math.sqrt(x*x + z*z);
    const normalizedDistance = distanceToCenter / 2000;
    
    colorObject.setHSL(0.6 - (normalizedDistance * 0.2), 0.8, 0.5 + (Math.random() * 0.5));
    
    colors[i * 3] = colorObject.r;
    colors[i * 3 + 1] = colorObject.g;
    colors[i * 3 + 2] = colorObject.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
});

const starfield = new THREE.Points(geometry, material);
scene.add(starfield);

// 4. Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    starfield.rotation.y = elapsedTime * 0.02;
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});