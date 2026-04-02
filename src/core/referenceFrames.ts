/**
 * Reference frame definitions and coordinate transformations.
 *
 * The canonical truth frame for Solar System ephemerides is the
 * J2000 ecliptic heliocentric (or barycentre) frame.
 * TODO: Implement full ICRF / ecliptic / equatorial rotation matrices using
 *       rigorous ERFA routines once the dependency is available.
 */

import { Vec3Km } from '../types/ephemeris';

// ─── Rotation matrix helpers ──────────────────────────────────────────────────

/** Apply a 3×3 rotation matrix (row-major flat array of 9) to a Vec3Km. */
export function applyRotationMatrix(
  m: readonly number[],
  v: Vec3Km
): Vec3Km {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

/**
 * Rotation matrix from J2000 ecliptic to J2000 equatorial frame.
 * Obliquity of ecliptic at J2000: ε ≈ 23.439291111°.
 * TODO: Replace with rigorous ERFA precession/nutation for full accuracy.
 */
const OBLIQUITY_RAD = (23.439291111 * Math.PI) / 180;
const cosE = Math.cos(OBLIQUITY_RAD);
const sinE = Math.sin(OBLIQUITY_RAD);

/**
 * Row-major 3×3: ecliptic → equatorial (rotate about X axis by +ε).
 */
export const ECLIPTIC_TO_EQUATORIAL: readonly number[] = [
  1,    0,     0,
  0,  cosE, -sinE,
  0,  sinE,  cosE,
];

/**
 * Row-major 3×3: equatorial → ecliptic.
 */
export const EQUATORIAL_TO_ECLIPTIC: readonly number[] = [
  1,    0,    0,
  0,  cosE,  sinE,
  0, -sinE,  cosE,
];

// ─── Floating-origin offset ───────────────────────────────────────────────────

/**
 * Subtract the floating origin from a truth position to obtain a
 * camera-relative position vector (still in km).
 */
export function toOriginRelative(
  truthPosKm: Vec3Km,
  originKm: Vec3Km
): Vec3Km {
  return [
    truthPosKm[0] - originKm[0],
    truthPosKm[1] - originKm[1],
    truthPosKm[2] - originKm[2],
  ];
}

/**
 * Convert a camera-relative km vector to Three.js world units.
 */
export function kmToWorldUnits(
  relKm: Vec3Km,
  kmPerUnit: number
): [number, number, number] {
  return [
    relKm[0] / kmPerUnit,
    relKm[1] / kmPerUnit,
    relKm[2] / kmPerUnit,
  ];
}
