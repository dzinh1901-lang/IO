class CelestialBody {
    constructor(name, size, texture, orbitalRadius, rotationSpeed) {
        this.name = name;
        this.size = size;
        this.texture = texture;
        this.orbitalRadius = orbitalRadius;
        this.rotationSpeed = rotationSpeed;
        // Additional properties for light, materials, etc., can be added here
    }

    create() {
        // Implement the creation of the celestial body in Three.js here
    }
}

// Creating instances of CelestialBody for Sun, Earth, Jupiter, and Saturn
const sun = new CelestialBody('Sun', 1.0, 'path/to/sun_texture.jpg', 0, 0);
const earth = new CelestialBody('Earth', 0.1, 'path/to/earth_texture.jpg', 3, 1);
const jupiter = new CelestialBody('Jupiter', 0.2, 'path/to/jupiter_texture.jpg', 5, 0.5);
const saturn = new CelestialBody('Saturn', 0.18, 'path/to/saturn_texture.jpg', 6, 0.4);

export { CelestialBody };