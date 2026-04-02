/**
 * Unit conversion utilities.
 * All conversions are pure functions to enable easy testing and validation.
 */

import { AU_KM, LIGHT_YEAR_KM, PARSEC_KM } from './constants';

// ─── Distance ─────────────────────────────────────────────────────────────────

/** Convert kilometres to Astronomical Units. */
export function kmToAu(km: number): number {
  return km / AU_KM;
}

/** Convert Astronomical Units to kilometres. */
export function auToKm(au: number): number {
  return au * AU_KM;
}

/** Convert kilometres to light-years. */
export function kmToLightYears(km: number): number {
  return km / LIGHT_YEAR_KM;
}

/** Convert light-years to kilometres. */
export function lightYearsToKm(ly: number): number {
  return ly * LIGHT_YEAR_KM;
}

/** Convert kilometres to parsecs. */
export function kmToParsecs(km: number): number {
  return km / PARSEC_KM;
}

// ─── Formatting ───────────────────────────────────────────────────────────────

/**
 * Format a distance in km into the most appropriate unit for display.
 */
export function formatDistance(km: number): string {
  const absKm = Math.abs(km);
  if (absKm < 1_000) {
    return `${km.toFixed(1)} km`;
  }
  if (absKm < AU_KM * 0.01) {
    return `${(km / 1_000).toFixed(1)} Mm`;
  }
  if (absKm < LIGHT_YEAR_KM) {
    return `${kmToAu(km).toFixed(4)} AU`;
  }
  if (absKm < PARSEC_KM * 1_000) {
    return `${kmToLightYears(km).toFixed(2)} ly`;
  }
  return `${kmToParsecs(km).toFixed(2)} pc`;
}

// ─── Scale ────────────────────────────────────────────────────────────────────

/**
 * Convert a truth-layer position (km) to a render-layer unit distance.
 * @param km Distance in km.
 * @param kmPerUnit Current km-per-unit scale factor.
 */
export function kmToUnits(km: number, kmPerUnit: number): number {
  return km / kmPerUnit;
}

/**
 * Convert a render-layer unit distance back to km.
 */
export function unitsToKm(units: number, kmPerUnit: number): number {
  return units * kmPerUnit;
}

// ─── Angles ───────────────────────────────────────────────────────────────────

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}
