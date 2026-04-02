import { RAD_TO_DEG } from '../core/constants';
import { clamp, lerpVec3, logLerp, smoothstep } from '../core/vector';
import { BodyId } from '../types/bodies';
import { Vec3Km } from '../types/ephemeris';
import { TruthStore } from '../truth/truthStore';

interface FlightState {
  fromBodyId: BodyId | null;
  toBodyId: BodyId;
  elapsedS: number;
  durationS: number;
  fromDistanceKm: number;
  toDistanceKm: number;
}

export interface CameraViewSnapshot {
  focusBodyId: BodyId | null;
  targetTruthKm: Vec3Km;
  cameraTruthKm: Vec3Km;
  distanceKm: number;
  azimuthDeg: number;
  elevationDeg: number;
}

export class CameraController {
  private focusBodyId: BodyId | null = 'sun';
  private distanceKm = 4.5e8;
  private targetDistanceKm = 4.5e8;
  private azimuth = 0.8;
  private elevation = 0.35;
  private dragging = false;
  private lastPointer = { x: 0, y: 0 };
  private flight: FlightState | null = null;
  private lastTargetTruthKm: Vec3Km = [0, 0, 0];

  public constructor(private readonly domElement: HTMLElement) {
    this.attachEvents();
  }

  public flyTo(bodyId: BodyId, targetRadiusKm: number): void {
    this.flight = {
      fromBodyId: this.focusBodyId,
      toBodyId: bodyId,
      elapsedS: 0,
      durationS: 2.4,
      fromDistanceKm: this.distanceKm,
      toDistanceKm: Math.max(targetRadiusKm * 12, 50_000),
    };
    this.focusBodyId = bodyId;
    this.targetDistanceKm = this.flight.toDistanceKm;
  }

  public getFocusBodyId(): BodyId | null {
    return this.focusBodyId;
  }

  public update(deltaS: number, truthStore: TruthStore, tdbS: number): CameraViewSnapshot {
    let targetTruthKm = this.lastTargetTruthKm;
    if (this.flight) {
      this.flight.elapsedS += deltaS;
      const t = smoothstep(0, 1, this.flight.elapsedS / this.flight.durationS);
      const fromTarget = this.flight.fromBodyId
        ? truthStore.getState(this.flight.fromBodyId, tdbS).state.posKm
        : this.lastTargetTruthKm;
      const toTarget = truthStore.getState(this.flight.toBodyId, tdbS).state.posKm;
      targetTruthKm = lerpVec3(fromTarget, toTarget, t);
      this.distanceKm = logLerp(this.flight.fromDistanceKm, this.flight.toDistanceKm, t);
      if (t >= 1) {
        this.flight = null;
      }
    } else if (this.focusBodyId) {
      targetTruthKm = truthStore.getState(this.focusBodyId, tdbS).state.posKm;
      this.distanceKm = logLerp(this.distanceKm, this.targetDistanceKm, Math.min(deltaS * 4, 1));
    }
    this.lastTargetTruthKm = targetTruthKm;

    const cosElevation = Math.cos(this.elevation);
    const offset: Vec3Km = [
      this.distanceKm * Math.cos(this.azimuth) * cosElevation,
      this.distanceKm * Math.sin(this.elevation),
      this.distanceKm * Math.sin(this.azimuth) * cosElevation,
    ];

    return {
      focusBodyId: this.focusBodyId,
      targetTruthKm,
      cameraTruthKm: [
        targetTruthKm[0] + offset[0],
        targetTruthKm[1] + offset[1],
        targetTruthKm[2] + offset[2],
      ],
      distanceKm: this.distanceKm,
      azimuthDeg: this.azimuth * RAD_TO_DEG,
      elevationDeg: this.elevation * RAD_TO_DEG,
    };
  }

  private attachEvents(): void {
    this.domElement.addEventListener('pointerdown', (event) => {
      this.dragging = true;
      this.lastPointer = { x: event.clientX, y: event.clientY };
      this.domElement.setPointerCapture(event.pointerId);
    });
    this.domElement.addEventListener('pointermove', (event) => {
      if (!this.dragging) {
        return;
      }
      const dx = event.clientX - this.lastPointer.x;
      const dy = event.clientY - this.lastPointer.y;
      this.lastPointer = { x: event.clientX, y: event.clientY };
      this.azimuth -= dx * 0.004;
      this.elevation = clamp(this.elevation - dy * 0.004, -1.45, 1.45);
    });
    this.domElement.addEventListener('pointerup', (event) => {
      this.dragging = false;
      this.domElement.releasePointerCapture(event.pointerId);
    });
    this.domElement.addEventListener('wheel', (event) => {
      event.preventDefault();
      const zoom = Math.exp(event.deltaY * 0.0012);
      this.targetDistanceKm = clamp(this.targetDistanceKm * zoom, 5, 1e18);
    }, { passive: false });
  }
}
