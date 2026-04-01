import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('gl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
camera.position.set(0, 500, 1500);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.05; controls.maxDistance = 10000; controls.minDistance = 10;

const starMaterial = new THREE.PointsMaterial({ size: 3, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true });
function createStarfield() {
    const starCount = 50000; const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3); const colors = new Float32Array(starCount * 3);
    const colorObj = new THREE.Color();
    for (let i = 0; i < starCount; i++) {
        const r = 2000 * Math.sqrt(Math.random()); const theta = Math.random() * 2 * Math.PI;
        const y = (Math.random() - 0.5) * (200 - (r * 0.1));
        positions[i * 3] = r * Math.cos(theta); positions[i * 3 + 1] = y; positions[i * 3 + 2] = r * Math.sin(theta);
        const temp = Math.random();
        if (temp > 0.9) colorObj.setHSL(0.0, 0.8, 0.8); else if (temp > 0.6) colorObj.setHSL(0.6, 0.8, 0.9); else colorObj.setHSL(0.15, 0.5, 0.9);
        colors[i * 3] = colorObj.r; colors[i * 3 + 1] = colorObj.g; colors[i * 3 + 2] = colorObj.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const starfield = new THREE.Points(geometry, starMaterial); scene.add(starfield); return starfield;
}
const galaxy = createStarfield();

const solarSystem = new THREE.Group(); scene.add(solarSystem);
const sun = new THREE.Mesh(new THREE.SphereGeometry(50, 64, 64), new THREE.MeshBasicMaterial({ color: 0xffcc00 }));
solarSystem.add(sun); solarSystem.add(new THREE.PointLight(0xffffff, 2, 2000)); scene.add(new THREE.AmbientLight(0x404040, 0.5));

const planets = []; const orbitMaterials = [];
const planetData = [
    { name: "Inner Planet", radius: 8, distance: 150, speed: 0.02, color: 0x884422, type: "Rocky", gravity: "0.8g" },
    { name: "Habitable World", radius: 12, distance: 250, speed: 0.015, color: 0x2288cc, type: "Terrestrial", gravity: "1.0g" },
    { name: "Gas Giant", radius: 30, distance: 500, speed: 0.008, color: 0xcc9966, type: "Gas", gravity: "2.4g" },
    { name: "Outer Ice World", radius: 15, distance: 800, speed: 0.004, color: 0x88ccff, type: "Ice", gravity: "1.1g" }
];

planetData.forEach((data) => {
    const planet = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.8 }));
    planet.position.x = data.distance; planet.userData = data;
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.0 });
    const orbit = new THREE.Mesh(new THREE.RingGeometry(data.distance, data.distance + 0.5, 64), orbitMat);
    orbit.rotation.x = Math.PI / 2; orbitMaterials.push(orbitMat);
    const pivot = new THREE.Group(); pivot.add(planet); pivot.add(orbit); solarSystem.add(pivot);
    planets.push({ mesh: planet, pivot: pivot, speed: data.speed });
});

const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();
const infoPanel = document.getElementById('info-panel'); const infoTitle = document.getElementById('info-title'); const infoData = document.getElementById('info-data');

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1; mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera); const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));
    if (intersects.length > 0) {
        const pData = intersects[0].object.userData; infoPanel.style.opacity = '1'; infoTitle.textContent = pData.name;
        infoData.innerHTML = `<strong>Type:</strong> ${pData.type}<br><strong>Radius:</strong> ${pData.radius},000 km<br><strong>Gravity:</strong> ${pData.gravity}<br><strong>Orbit:</strong> ${pData.distance}M km`;
    } else { infoPanel.style.opacity = '0'; }
});

window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

const clock = new THREE.Clock(); const viewStatus = document.getElementById('view-status');
function animate() {
    requestAnimationFrame(animate); const delta = clock.getDelta();
    galaxy.rotation.y -= 0.05 * delta; sun.rotation.y += 0.1 * delta;
    planets.forEach(p => { p.pivot.rotation.y += p.speed * delta; p.mesh.rotation.y += 0.5 * delta; });
    const camDist = camera.position.length();
    if (camDist > 1200) { viewStatus.textContent = "Macro view of the Milky Way"; starMaterial.opacity = 0.8; orbitMaterials.forEach(mat => mat.opacity = 0.0); } 
    else { viewStatus.textContent = "Micro view of Local Planetary System"; const fadeRatio = camDist / 1200; starMaterial.opacity = Math.max(0.1, fadeRatio * 0.8); orbitMaterials.forEach(mat => mat.opacity = Math.min(0.2, (1 - fadeRatio) * 0.5)); }
    controls.update(); renderer.render(scene, camera);
}
animate();