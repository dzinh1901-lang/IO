import * as THREE from 'three';
import { AU_KM, SECONDS_PER_DAY } from '../../core/constants';
import { kmToUnits } from '../../core/units';
import { RenderContext } from '../../types/render';

interface BeltBody {
  radiusKm: number;
  phaseRad: number;
  speedRadPerS: number;
  inclinationRad: number;
}

export class PointPopulationRenderer {
  private readonly group = new THREE.Group();
  private readonly geometry = new THREE.BufferGeometry();
  private readonly material = new THREE.PointsMaterial({
    color: 0xb7b7b7,
    size: 2,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.75,
  });
  private readonly points = new THREE.Points(this.geometry, this.material);
  private readonly positions: Float32Array;
  private readonly beltBodies: BeltBody[];

  public constructor(parent: THREE.Group, count = 2000) {
    this.positions = new Float32Array(count * 3);
    this.beltBodies = Array.from({ length: count }, (_, index) => {
      const t = index / count;
      return {
        radiusKm: AU_KM * (2.1 + 1.3 * t + (Math.sin(index * 12.7) + 1) * 0.03),
        phaseRad: t * Math.PI * 2 * 17.2,
        speedRadPerS: (Math.PI * 2) / ((4.8 + t * 1.5) * 365.25 * SECONDS_PER_DAY),
        inclinationRad: (Math.sin(index * 5.1) * Math.PI) / 180,
      };
    });
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.group.add(this.points);
    parent.add(this.group);
  }

  public update(context: RenderContext): void {
    const origin = context.scale.originKm;
    const scale = context.scale.kmPerUnit;
    for (let i = 0; i < this.beltBodies.length; i += 1) {
      const body = this.beltBodies[i];
      const angle = body.phaseRad + body.speedRadPerS * context.simTimeTdbS;
      const xKm = body.radiusKm * Math.cos(angle) - origin[0];
      const yKm = body.radiusKm * Math.sin(body.inclinationRad) - origin[1];
      const zKm = body.radiusKm * Math.sin(angle) - origin[2];
      this.positions[i * 3] = kmToUnits(xKm, scale);
      this.positions[i * 3 + 1] = kmToUnits(yKm, scale);
      this.positions[i * 3 + 2] = kmToUnits(zKm, scale);
    }
    this.geometry.attributes.position.needsUpdate = true;
  }
}
