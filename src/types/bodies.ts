/**
 * Types for celestial body definitions.
 * All distances in kilometres (km), velocities in km/s.
 */

/** Unique identifier for a celestial body. */
export type BodyId = string;

/** Classification of celestial body. */
export type BodyClass =
  | 'star'
  | 'planet'
  | 'dwarf_planet'
  | 'moon'
  | 'asteroid'
  | 'comet'
  | 'spacecraft'
  | 'barycenter'
  | 'galaxy';

/** Ring system definition (e.g. Saturn's rings). */
export interface RingDefinition {
  /** Inner radius in km. */
  innerRadiusKm: number;
  /** Outer radius in km. */
  outerRadiusKm: number;
  /** Colour hex value for rendering. */
  colour: number;
  /** Path to ring texture, if available. */
  texturePath?: string;
}

/** Physical properties of a celestial body. */
export interface BodyPhysics {
  /** Mean radius in km. */
  radiusKm: number;
  /** Mass in kg. */
  massKg?: number;
  /** Gravitational parameter GM in km³/s². */
  gmKm3s2?: number;
  /** Sidereal rotation period in seconds. */
  rotationPeriodS?: number;
  /** Axial tilt in radians (obliquity). */
  axialTiltRad?: number;
}

/** Visual / rendering hints for a body. */
export interface BodyVisuals {
  /** Diffuse texture path (relative to /public/textures/). */
  texturePath?: string;
  /** Whether the body is self-luminous (e.g. star). */
  emissive: boolean;
  /** Emissive hex colour for stars. */
  emissiveColour?: number;
  /** Base colour hex used when no texture is present. */
  baseColour: number;
  /** Ring system, if present. */
  rings?: RingDefinition;
}

/**
 * Static definition of a celestial body loaded from an external catalog.
 * All quantities are in SI-adjacent units: km, km/s, kg.
 */
export interface BodyDefinition {
  /** Unique body identifier (e.g. 'earth', 'mars', 'sun'). */
  id: BodyId;
  /** Human-readable display name. */
  name: string;
  /** Parent body id in the hierarchy (undefined for barycentre root). */
  parentId?: BodyId;
  /** Body classification. */
  class: BodyClass;
  /** Physical properties. */
  physics: BodyPhysics;
  /** Visual rendering hints. */
  visuals: BodyVisuals;
  /** NAIF SPICE integer ID, for ephemeris correlation. */
  naifId?: number;
  /**
   * TODO: Additional metadata (atmosphere, composition, missions, etc.)
   * to be added as data sources are integrated.
   */
}
