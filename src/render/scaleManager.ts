import {
  REGIME_GALACTIC_TO_SOLAR_KM,
  REGIME_SOLAR_TO_PLANETARY_KM,
} from '../core/constants';
import { clamp } from '../core/vector';
import { Vec3Km } from '../types/ephemeris';
import { ScaleContext, ScaleRegime } from '../types/render';

export class ScaleManager {
  public compute(cameraTruthKm: Vec3Km, distanceKm: number): ScaleContext {
    const safeDistanceKm = Math.max(distanceKm, 1);
    const regime = this.selectRegime(safeDistanceKm);
    const kmPerUnit = Math.max(1, safeDistanceKm / 80);
    const near = Math.max(0.001, safeDistanceKm / kmPerUnit / 5000);
    const far = clamp((safeDistanceKm / kmPerUnit) * 2500, 200, 5_000_000);
    return {
      regime,
      kmPerUnit,
      cameraNear: near,
      cameraFar: far,
      originKm: [cameraTruthKm[0], cameraTruthKm[1], cameraTruthKm[2]],
    };
  }

  private selectRegime(distanceKm: number): ScaleRegime {
    if (distanceKm <= REGIME_SOLAR_TO_PLANETARY_KM) {
      return 'planetary';
    }
    if (distanceKm <= REGIME_GALACTIC_TO_SOLAR_KM) {
      return 'solar_system';
    }
    return 'galactic';
  }
}
