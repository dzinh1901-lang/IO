/**
 * Validation scaffolding for units, coordinate transforms, and data integrity.
 * All assertions throw a descriptive error in development; they are silent no-ops
 * when the VITE_DISABLE_VALIDATION environment variable is set.
 */

const VALIDATION_ENABLED = import.meta.env.DEV;

/** Throw an error if the condition is false (in dev only). */
export function assert(
  condition: boolean,
  message: string
): asserts condition {
  if (VALIDATION_ENABLED && !condition) {
    throw new Error(`[IO Validation] ${message}`);
  }
}

/** Assert that a value is a finite number. */
export function assertFinite(value: number, label: string): void {
  assert(Number.isFinite(value), `${label} must be finite, got ${value}`);
}

/** Assert that a distance (km) is non-negative. */
export function assertNonNegativeKm(value: number, label: string): void {
  assertFinite(value, label);
  assert(value >= 0, `${label} must be non-negative km, got ${value}`);
}

/** Assert that a Vec3Km contains only finite values. */
export function assertFiniteVec3(
  v: readonly number[],
  label: string
): void {
  assert(v.length === 3, `${label} must be length-3`);
  assertFinite(v[0], `${label}[0]`);
  assertFinite(v[1], `${label}[1]`);
  assertFinite(v[2], `${label}[2]`);
}

/** Assert that kmPerUnit is a positive finite number. */
export function assertValidScale(kmPerUnit: number): void {
  assertFinite(kmPerUnit, 'kmPerUnit');
  assert(kmPerUnit > 0, `kmPerUnit must be > 0, got ${kmPerUnit}`);
}

/**
 * Warn (console.warn) about a potential data integrity issue.
 * Use for non-fatal anomalies such as gaps in ephemeris data.
 */
export function warnIntegrity(message: string): void {
  if (VALIDATION_ENABLED) {
    // eslint-disable-next-line no-console
    console.warn(`[IO Integrity] ${message}`);
  }
}
