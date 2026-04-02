import { SECONDS_PER_DAY, TWO_PI } from '../core/constants';
import { addVec3, vec3 } from '../core/vector';
import { assert } from '../core/validation';
import { BodyDefinition, BodyId } from '../types/bodies';
import { EphemerisQueryResult, EphemerisSample, StateVector, Vec3Km } from '../types/ephemeris';
import { OrbitalElementsPlaceholder, PLACEHOLDER_ORBITAL_ELEMENTS } from '../data/placeholders/solarSystemCatalog';

export interface EphemerisProvider {
  getState(bodyId: BodyId, tdbS: number): EphemerisQueryResult;
  sampleOrbit(bodyId: BodyId, tdbS: number, sampleCount: number): EphemerisSample[];
}

function rotatePerifocalToInertial(
  position: Vec3Km,
  velocity: Vec3Km,
  elements: OrbitalElementsPlaceholder
): StateVector {
  const { ascendingNodeRad: om, inclinationRad: inc, argumentOfPeriapsisRad: w } = elements;
  const cosO = Math.cos(om);
  const sinO = Math.sin(om);
  const cosI = Math.cos(inc);
  const sinI = Math.sin(inc);
  const cosW = Math.cos(w);
  const sinW = Math.sin(w);

  const m11 = cosO * cosW - sinO * sinW * cosI;
  const m12 = -cosO * sinW - sinO * cosW * cosI;
  const m21 = sinO * cosW + cosO * sinW * cosI;
  const m22 = -sinO * sinW + cosO * cosW * cosI;
  const m31 = sinW * sinI;
  const m32 = cosW * sinI;

  return {
    posKm: [
      m11 * position[0] + m12 * position[1],
      m21 * position[0] + m22 * position[1],
      m31 * position[0] + m32 * position[1],
    ],
    velKms: [
      m11 * velocity[0] + m12 * velocity[1],
      m21 * velocity[0] + m22 * velocity[1],
      m31 * velocity[0] + m32 * velocity[1],
    ],
  };
}

function solveKepler(meanAnomaly: number, eccentricity: number): number {
  let eccentricAnomaly = meanAnomaly;
  for (let i = 0; i < 8; i += 1) {
    const f = eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly;
    const fp = 1 - eccentricity * Math.cos(eccentricAnomaly);
    eccentricAnomaly -= f / fp;
  }
  return eccentricAnomaly;
}

function computeOrbitalState(
  elements: OrbitalElementsPlaceholder,
  tdbS: number,
  parentGmKm3s2: number
): StateVector {
  const n = TWO_PI / (elements.periodDays * SECONDS_PER_DAY);
  const meanAnomaly = elements.meanAnomalyAtEpochRad + n * tdbS;
  const e = elements.eccentricity;
  const E = solveKepler(meanAnomaly, e);
  const a = elements.semiMajorAxisKm;
  const sqrtTerm = Math.sqrt(1 - e * e);
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const radiusFactor = 1 - e * cosE;
  const perifocalPos: Vec3Km = [a * (cosE - e), a * sqrtTerm * sinE, 0];
  const factor = Math.sqrt(parentGmKm3s2 * a) / (a * radiusFactor);
  const perifocalVel: Vec3Km = [-factor * sinE, factor * sqrtTerm * cosE, 0];
  return rotatePerifocalToInertial(perifocalPos, perifocalVel, elements);
}

export class PlaceholderEphemerisProvider implements EphemerisProvider {
  private readonly bodyMap = new Map<string, BodyDefinition>();

  public constructor(bodies: BodyDefinition[]) {
    bodies.forEach((body) => this.bodyMap.set(body.id, body));
  }

  public getState(bodyId: BodyId, tdbS: number): EphemerisQueryResult {
    return {
      bodyId,
      tdbS,
      state: this.computeAbsoluteState(bodyId, tdbS),
      frame: 'J2000_ECLIPTIC',
      interpolated: true,
    };
  }

  public sampleOrbit(bodyId: BodyId, tdbS: number, sampleCount: number): EphemerisSample[] {
    const elements = PLACEHOLDER_ORBITAL_ELEMENTS[bodyId];
    if (!elements) {
      return [];
    }
    const step = (elements.periodDays * SECONDS_PER_DAY) / sampleCount;
    const samples: EphemerisSample[] = [];
    for (let i = 0; i <= sampleCount; i += 1) {
      const sampleT = tdbS + step * i;
      samples.push({ tdbS: sampleT, state: this.computeAbsoluteState(bodyId, sampleT) });
    }
    return samples;
  }

  private computeAbsoluteState(bodyId: BodyId, tdbS: number): StateVector {
    if (bodyId === 'solar_system_barycenter' || bodyId === 'sun') {
      return { posKm: vec3(), velKms: vec3() };
    }
    const elements = PLACEHOLDER_ORBITAL_ELEMENTS[bodyId];
    assert(!!elements, `Missing placeholder elements for ${bodyId}`);
    const parent = this.bodyMap.get(elements.parentId);
    assert(!!parent, `Missing parent body ${elements.parentId} for ${bodyId}`);
    const parentState = this.computeAbsoluteState(elements.parentId, tdbS);
    const localState = computeOrbitalState(elements, tdbS, parent.physics.gmKm3s2 ?? 0);
    return {
      posKm: addVec3(parentState.posKm, localState.posKm),
      velKms: addVec3(parentState.velKms, localState.velKms),
    };
  }
}
