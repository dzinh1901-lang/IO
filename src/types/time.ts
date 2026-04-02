/**
 * Types for the simulation time system.
 */

/**
 * Immutable snapshot of the current simulation time state.
 */
export interface SimulationTimeState {
  /**
   * Current simulation time expressed as TDB seconds since J2000.
   * J2000 epoch: 2000-Jan-01 12:00:00.000 TDB = 0 s.
   */
  tdbS: number;
  /** Time scale factor: 1.0 = real-time, 0 = paused, >1 = accelerated. */
  scale: number;
  /** True if the simulation clock is paused. */
  paused: boolean;
  /** Wall-clock timestamp (ms) when the current scale was last applied. */
  wallBaseMs: number;
  /** TDB seconds at the time wallBaseMs was recorded. */
  simBaseS: number;
}

/** Commands the TimeController accepts. */
export type TimeCommand =
  | { type: 'SET_SCALE'; scale: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SCRUB'; tdbS: number }
  | { type: 'RESET_TO_NOW' };

/**
 * Human-readable calendar date derived from TDB seconds.
 * NOTE: TDB/UTC difference is ~65 s; for display purposes a simplified
 * conversion is used. TODO: Integrate full ERFA/SOFA for rigorous conversion.
 */
export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** ISO 8601 formatted string (UTC approximation). */
  iso: string;
}
