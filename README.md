# IO Spatial Engine

Scientific, modular spatial visualisation engine scaffolded with Vite, TypeScript, and Three.js.

## Scripts

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Architecture

- **Truth layer**: body definitions, ephemeris, physical units in km and km/s
- **Render layer**: floating-origin conversion, scale management, scene and camera systems
- **UI layer**: search, focus, time controls, scale indicators, and display toggles

## Data

The repository currently ships with a **provisional placeholder Solar System dataset** for local development.

TODO: replace placeholder catalogs and ephemerides with offline-generated SPICE-derived runtime files.
