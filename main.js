import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Setup Scene, Camera, and Renderer
const canvas = document.getElementById('gl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
camera.position.set(0, 500, 1500);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Setup OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 10000;
controls.minDistance = 10;

// 3. Create the Starfield (Milky Way)
function createStarfield() {
    const starCount = 50000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorObj = new THREE.Color();

    for (let i = 0; i < starCount; i++) {
        const r = 2000 * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const y = (Math.random() - 0.5) * (200 - (r * 0.1));

        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const temp = Math.random();
        if (temp > 0.9) colorObj.setHSL(0.0, 0.8, 0.8);
        else if (temp > 0.6) colorObj.setHSL(0.6, 0.8, 0.9);
        else colorObj.setHSL(0.15, 0.5, 0.9);

        colors[i * 3] = colorObj.r;
        colors[i * 3 + 1] = colorObj.g;
        colors[i * 3 + 2] = colorObj.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starfield = new THREE.Points(geometry, material);
    scene.add(starfield);
    return starfield;
}

const galaxy = createStarfield();

// 4. Milestone 2: Planetary Systems
const solarSystem = new THREE.Group();
solarSystem.position.set(0, 0, 0);
scene.add(solarSystem);

// Central Star (Sun)
const sunGeometry = new THREE.SphereGeometry(50, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
solarSystem.add(sun);

const sunLight = new THREE.PointLight(0xffffff, 2, 2000);
sunLight.position.set(0, 0, 0);
solarSystem.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5); 
scene.add(ambientLight);

// Procedural Planets
const planets = [];
const planetData = [
    { name: "Inner Planet", radius: 8, distance: 150, speed: 0.02, color: 0x884422 },
    { name: "Habitable World", radius: 12, distance: 250, speed: 0.015, color: 0x2288cc },
    { name: "Gas Giant", radius: 30, distance: 500, speed: 0.008, color: 0xcc9966 },
    { name: "Outer Ice World", radius: 15, distance: 800, speed: 0.004, color: 0x88ccff }
];

planetData.forEach((data) => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
        color: data.color,
        roughness: 0.8,
        metalness: 0.2
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = data.distance;

    const orbitGeometry = new THREE.RingGeometry(data.distance, data.distance + 0.5, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    
    const pivot = new THREE.Group();
    pivot.add(planet);
    pivot.add(orbit);
    solarSystem.add(pivot);

    planets.push({
        mesh: planet,
        pivot: pivot,
        speed: data.speed
    });
});

// 5. Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6. Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    galaxy.rotation.y -= 0.05 * delta;
    sun.rotation.y += 0.1 * delta;

    planets.forEach((p) => {
        p.pivot.rotation.y += p.speed * delta;
        p.mesh.rotation.y += 0.5 * delta;
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();
