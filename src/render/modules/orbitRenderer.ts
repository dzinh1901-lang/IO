import * as THREE from 'three';
import { FloatingOrigin } from '../floatingOrigin';
import { RenderContext } from '../../types/render';
import { TruthStore } from '../../truth/truthStore';

export class OrbitRenderer {
  private readonly group = new THREE.Group();
  private readonly floatingOrigin = new FloatingOrigin();
  private readonly lines = new Map<string, THREE.Line>();

  public constructor(parent: THREE.Group) {
    parent.add(this.group);
  }

  public update(context: RenderContext, truthStore: TruthStore): void {
    for (const body of truthStore.getBodies()) {
      if (!body.parentId || body.id === 'sun' || body.id === 'solar_system_barycenter') {
        continue;
      }
      const samples = truthStore.sampleOrbit(body.id, context.simTimeTdbS, 128);
      if (!samples.length) {
        continue;
      }
      let line = this.lines.get(body.id);
      if (!line) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(new Float32Array(samples.length * 3), 3)
        );
        const material = new THREE.LineBasicMaterial({
          color: body.visuals.baseColour,
          transparent: true,
          opacity: 0.55,
        });
        line = new THREE.Line(geometry, material);
        this.lines.set(body.id, line);
        this.group.add(line);
      }
      const positionAttribute = line.geometry.getAttribute(
        'position'
      ) as THREE.BufferAttribute;
      const positions = positionAttribute.array as Float32Array;
      for (let i = 0; i < samples.length; i += 1) {
        const [x, y, z] = this.floatingOrigin.toWorldPosition(samples[i].state.posKm, context.scale);
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      positionAttribute.needsUpdate = true;
      line.geometry.computeBoundingSphere();
    }
  }
}
