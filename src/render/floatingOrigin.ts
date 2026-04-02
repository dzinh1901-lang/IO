import { Vec3Km } from '../types/ephemeris';
import { ScaleContext } from '../types/render';
import { kmToWorldUnits, toOriginRelative } from '../core/referenceFrames';

export class FloatingOrigin {
  public toWorldPosition(
    truthPosKm: Vec3Km,
    scale: ScaleContext
  ): [number, number, number] {
    return kmToWorldUnits(toOriginRelative(truthPosKm, scale.originKm), scale.kmPerUnit);
  }
}
