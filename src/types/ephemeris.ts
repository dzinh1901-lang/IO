/**
 * Types for ephemeris (positional/velocity) data.
 * All coordinates in km, velocities in km/s, time in TDB seconds past J2000.
 */

import { BodyId } from './bodies';

/**
 * A 3-component vector in km (position) or km/s (velocity).
 * Stored as a plain array for performance-critical hot paths.
 */
export type Vec3Km = [number, number, number];

/**
 * A state vector: position (km) + velocity (km/s) in a given reference frame.
 */
export interface StateVector {
  /** Position in km relative to reference frame origin. */
  posKm: Vec3Km;
  /** Velocity in km/s. */
  velKms: Vec3Km;
}

/**
 * Reference frame identifier.
 * J2000 ecliptic is the canonical frame for Solar System bodies.
 */
export type ReferenceFrame = 'J2000_ECLIPTIC' | 'J2000_EQUATORIAL' | 'ICRF';

/**
 * A single ephemeris sample (state + timestamp).
 * tdbS: seconds past J2000 epoch in Barycentric Dynamical Time.
 */
export interface EphemerisSample {
  /** TDB seconds since J2000 (2000-Jan-01 12:00:00 TDB). */
  tdbS: number;
  /** State in the dataset's reference frame. */
  state: StateVector;
}

/**
 * Header metadata for a loaded ephemeris dataset.
 */
export interface EphemerisDatasetMeta {
  /** Schema version for the IO ephemeris format. */
  version: number;
  /** Body this dataset describes. */
  bodyId: BodyId;
  /** Reference frame of all samples. */
  frame: ReferenceFrame;
  /** Origin body of the reference frame (e.g. 'solar_system_barycenter'). */
  originId: BodyId;
  /** TDB start epoch of the dataset. */
  startTdbS: number;
  /** TDB end epoch of the dataset. */
  endTdbS: number;
  /** Time step in seconds (0 = irregular). */
  stepS: number;
  /**
   * TODO: Source metadata (kernel file, generation timestamp, SpiceyPy version).
   */
}

/**
 * A complete ephemeris dataset for a single body.
 * TODO: For large datasets, this will be replaced with chunked streaming.
 */
export interface EphemerisDataset {
  meta: EphemerisDatasetMeta;
  /** Ordered samples (ascending tdbS). */
  samples: EphemerisSample[];
}

/**
 * Result of querying an ephemeris provider for a specific body at a time.
 */
export interface EphemerisQueryResult {
  bodyId: BodyId;
  tdbS: number;
  state: StateVector;
  frame: ReferenceFrame;
  /** True if the result was interpolated; false if it is a direct sample. */
  interpolated: boolean;
}
