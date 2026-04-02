import * as THREE from 'three';
import { LIGHT_YEAR_KM } from '../../core/constants';
import { kmToUnits } from '../../core/units';
import { RenderContext } from '../../types/render';

interface StarSample {
  xKm: number;
  yKm: number;
  zKm: number;
}

export class StarfieldRenderer {
  private readonly group = new THREE.Group();
  private readonly geometry = new THREE.BufferGeometry();
  private readonly material = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: false,
  });
  private readonly positions: Float32Array;
  private readonly colors: Float32Array;
  private readonly stars: StarSample[];
  private readonly points: THREE.Points;

  public constructor(parent: THREE.Group, count = 5000) {
    this.positions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);
    this.stars = Array.from({ length: count }, (_, index) => {
      const angle = index * 0.754877666;
      const radius = LIGHT_YEAR_KM * (150 + (index % 400) * 0.18);
      const armOffset = Math.sin(index * 1.73) * LIGHT_YEAR_KM * 8;
      const xKm = Math.cos(angle) * radius + armOffset;
      const zKm = Math.sin(angle) * radius;
      const yKm = Math.sin(index * 0.37) * LIGHT_YEAR_KM * 4;
      return { xKm, yKm, zKm };
    });

    for (let i = 0; i < count; i += 1) {
      const hue = 0.58 - (i % 7) * 0.03;
      const color = new THREE.Color().setHSL(hue, 0.6, 0.6);
      this.colors[i * 3] = color.r;
      this.colors[i * 3 + 1] = color.g;
      this.colors[i * 3 + 2] = color.b;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.points = new THREE.Points(this.geometry, this.material);
    this.group.add(this.points);
    parent.add(this.group);
  }

  public update(context: RenderContext): void {
    const origin = context.scale.originKm;
    const scale = context.scale.kmPerUnit;
    for (let i = 0; i < this.stars.length; i += 1) {
      const star = this.stars[i];
      this.positions[i * 3] = kmToUnits(star.xKm - origin[0], scale);
      this.positions[i * 3 + 1] = kmToUnits(star.yKm - origin[1], scale);
      this.positions[i * 3 + 2] = kmToUnits(star.zKm - origin[2], scale);
    }
    this.geometry.attributes.position.needsUpdate = true;
  }
}
