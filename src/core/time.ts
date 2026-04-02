/**
 * Simulation time system.
 *
 * Internally all time is stored as TDB seconds since J2000
 * (2000-Jan-01 12:00:00.000 TDB).  Wall-clock scaling is applied via a
 * reference point (wallBaseMs / simBaseS) so that pause/resume and speed
 * changes are exact without accumulated error.
 */

import {
  SimulationTimeState,
  TimeCommand,
  CalendarDate,
} from '../types/time';
import { SECONDS_PER_DAY, TDB_MINUS_UTC_APPROX_S } from './constants';

// J2000 epoch as a JS Date millisecond timestamp (UTC approximation).
// 2000-Jan-01 12:00:00 UTC ≈ TDB for display purposes.
const J2000_UTC_MS = Date.UTC(2000, 0, 1, 12, 0, 0, 0);

/**
 * Compute the current wall-clock TDB seconds since J2000.
 */
function nowTdbS(): number {
  const utcMs = Date.now();
  const utcS = (utcMs - J2000_UTC_MS) / 1_000;
  return utcS + TDB_MINUS_UTC_APPROX_S;
}

/**
 * Create the initial time state anchored to the current real-time clock.
 */
export function createInitialTimeState(): SimulationTimeState {
  const tdb = nowTdbS();
  return {
    tdbS: tdb,
    scale: 1.0,
    paused: false,
    wallBaseMs: Date.now(),
    simBaseS: tdb,
  };
}

/**
 * Advance the simulation time state by one wall-clock tick.
 * @param state Previous state (not mutated).
 * @returns Updated state with current tdbS.
 */
export function tickTimeState(
  state: SimulationTimeState
): SimulationTimeState {
  if (state.paused) {
    return state; // Nothing to update.
  }
  const wallDeltaS = (Date.now() - state.wallBaseMs) / 1_000;
  const tdbS = state.simBaseS + wallDeltaS * state.scale;
  return { ...state, tdbS };
}

/**
 * Apply a time command, returning the updated state.
 */
export function applyTimeCommand(
  state: SimulationTimeState,
  cmd: TimeCommand
): SimulationTimeState {
  switch (cmd.type) {
    case 'SET_SCALE': {
      // Re-anchor base points to current values before changing scale.
      const current = tickTimeState(state);
      return {
        ...current,
        scale: cmd.scale,
        paused: cmd.scale === 0,
        wallBaseMs: Date.now(),
        simBaseS: current.tdbS,
      };
    }
    case 'PAUSE': {
      const current = tickTimeState(state);
      return { ...current, paused: true };
    }
    case 'RESUME': {
      return {
        ...state,
        paused: false,
        wallBaseMs: Date.now(),
        simBaseS: state.tdbS,
      };
    }
    case 'SCRUB': {
      return {
        ...state,
        tdbS: cmd.tdbS,
        wallBaseMs: Date.now(),
        simBaseS: cmd.tdbS,
      };
    }
    case 'RESET_TO_NOW': {
      const tdb = nowTdbS();
      return {
        ...state,
        tdbS: tdb,
        wallBaseMs: Date.now(),
        simBaseS: tdb,
      };
    }
  }
}

/**
 * Convert TDB seconds since J2000 to a displayable CalendarDate.
 * NOTE: Uses simplified UTC approximation. For rigorous conversions, integrate ERFA/SOFA.
 */
export function tdbSToCalendarDate(tdbS: number): CalendarDate {
  const utcS = tdbS - TDB_MINUS_UTC_APPROX_S;
  const utcMs = J2000_UTC_MS + utcS * 1_000;
  const d = new Date(utcMs);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    iso: d.toISOString(),
  };
}

/**
 * Return TDB seconds since J2000 for a given UTC date.
 */
export function dateToTdbS(date: Date): number {
  const utcS = (date.getTime() - J2000_UTC_MS) / 1_000;
  return utcS + TDB_MINUS_UTC_APPROX_S;
}

/**
 * Return the number of Julian days since J2000 for a given TDB seconds value.
 */
export function tdbSToJulianDays(tdbS: number): number {
  return tdbS / SECONDS_PER_DAY;
}
