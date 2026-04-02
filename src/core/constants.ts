/**
 * Physical and mathematical constants used throughout IO.
 * All values in SI-adjacent units: km, km/s, kg.
 */

// ─── Mathematical ─────────────────────────────────────────────────────────────

export const TWO_PI = Math.PI * 2;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

// ─── Time ─────────────────────────────────────────────────────────────────────

/** Seconds per day. */
export const SECONDS_PER_DAY = 86_400;
/** Seconds per Julian year (365.25 days). */
export const SECONDS_PER_JULIAN_YEAR = 365.25 * SECONDS_PER_DAY;
/**
 * Approximate offset between TDB and UTC in seconds.
 * TODO: Replace with full ERFA/SOFA delta-T table for rigorous conversions.
 */
export const TDB_MINUS_UTC_APPROX_S = 69.184;

// ─── Distance ─────────────────────────────────────────────────────────────────

/** 1 Astronomical Unit in km (IAU 2012 definition). */
export const AU_KM = 149_597_870.700;
/** 1 light-year in km. */
export const LIGHT_YEAR_KM = 9.460_730_472_580_8e12;
/** 1 parsec in km. */
export const PARSEC_KM = 3.085_677_581_491_4e13;

// ─── Speed ────────────────────────────────────────────────────────────────────

/** Speed of light in km/s. */
export const SPEED_OF_LIGHT_KMS = 299_792.458;

// ─── Solar System body radii (km) ─────────────────────────────────────────────
// Source: IAU Working Group on Cartographic Coordinates (2015).

export const RADIUS_SUN_KM = 695_700;
export const RADIUS_MERCURY_KM = 2_439.7;
export const RADIUS_VENUS_KM = 6_051.8;
export const RADIUS_EARTH_KM = 6_371.0;
export const RADIUS_MOON_KM = 1_737.4;
export const RADIUS_MARS_KM = 3_389.5;
export const RADIUS_JUPITER_KM = 69_911;
export const RADIUS_SATURN_KM = 58_232;
export const RADIUS_URANUS_KM = 25_362;
export const RADIUS_NEPTUNE_KM = 24_622;
export const RADIUS_PLUTO_KM = 1_188.3;

// ─── Gravitational parameters (km³/s²) ────────────────────────────────────────
// Source: DE440 / JPL Planetary Fact Sheet.

export const GM_SUN_KM3S2 = 1.327_124_400_41e11;
export const GM_EARTH_KM3S2 = 398_600.435_507;
export const GM_JUPITER_KM3S2 = 1.266_865_341_960e8;

// ─── Scale regime thresholds (km from focus) ──────────────────────────────────

/** Switch to solar-system regime below this distance from barycentre (km). */
export const REGIME_GALACTIC_TO_SOLAR_KM = LIGHT_YEAR_KM * 2;
/** Switch to planetary regime below this distance from planet surface (km). */
export const REGIME_SOLAR_TO_PLANETARY_KM = 1_500_000;
