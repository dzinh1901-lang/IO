import * as THREE from 'three';
import { FloatingOrigin } from '../floatingOrigin';
import { kmToUnits } from '../../core/units';
import { BodyDefinition } from '../../types/bodies';
import { BodyRenderOptions, BodyRenderState, RenderContext } from '../../types/render';
import { TruthStore } from '../../truth/truthStore';

interface BodyMeshes {
  body: THREE.Mesh<THREE.SphereGeometry, THREE.Material>;
  ring?: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
}

export class BodyRenderer {
  private readonly group = new THREE.Group();
  private readonly sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  private readonly meshes = new Map<string, BodyMeshes>();
  private readonly states = new Map<string, BodyRenderState>();
  private readonly floatingOrigin = new FloatingOrigin();

  public constructor(parent: THREE.Group, bodies: BodyDefinition[]) {
    parent.add(this.group);
    bodies.forEach((body) => this.createMeshes(body));
  }

  public update(
    context: RenderContext,
    truthStore: TruthStore,
    viewportHeightPx: number,
    options: BodyRenderOptions
  ): void {
    for (const body of truthStore.getBodies()) {
      const entry = this.meshes.get(body.id);
      if (!entry) {
        continue;
      }
      const state = truthStore.getState(body.id, context.simTimeTdbS).state;
      const [x, y, z] = this.floatingOrigin.toWorldPosition(state.posKm, context.scale);
      entry.body.position.set(x, y, z);
      const distanceUnits = Math.max(1e-6, Math.hypot(x, y, z));
      const physicalRadiusUnits = kmToUnits(body.physics.radiusKm, context.scale.kmPerUnit);
      const worldPerPixel = (2 * distanceUnits * Math.tan(THREE.MathUtils.degToRad(context.camera.fov / 2))) / viewportHeightPx;
      const minRadiusUnits = options.minVisualRadiusPx * worldPerPixel;
      const visualRadiusUnits = options.strictTrueScale
        ? physicalRadiusUnits
        : Math.max(physicalRadiusUnits, minRadiusUnits);
      entry.body.scale.setScalar(Math.max(visualRadiusUnits, 1e-6));

      if (entry.ring && body.visuals.rings) {
        const outerUnits = kmToUnits(body.visuals.rings.outerRadiusKm, context.scale.kmPerUnit);
        entry.ring.position.copy(entry.body.position);
        entry.ring.scale.setScalar(Math.max(outerUnits, 1e-6));
      }

      const existingState = this.states.get(body.id);
      if (existingState) {
        existingState.lod =
          visualRadiusUnits < 0.05
            ? 'point'
            : visualRadiusUnits < 0.4
              ? 'sphere_low'
              : 'sphere_high';
        existingState.worldPos.copy(entry.body.position);
        existingState.isScaled = visualRadiusUnits > physicalRadiusUnits * 1.001;
        existingState.visualRadiusUnits = visualRadiusUnits;
        existingState.physicalRadiusUnits = physicalRadiusUnits;
      } else {
        this.states.set(body.id, {
          bodyId: body.id,
          lod:
            visualRadiusUnits < 0.05
              ? 'point'
              : visualRadiusUnits < 0.4
                ? 'sphere_low'
                : 'sphere_high',
          worldPos: entry.body.position.clone(),
          isScaled: visualRadiusUnits > physicalRadiusUnits * 1.001,
          visualRadiusUnits,
          physicalRadiusUnits,
        });
      }
    }
  }

  public getBodyState(bodyId: string): BodyRenderState | undefined {
    return this.states.get(bodyId);
  }

  public getScaledBodies(): string[] {
    return Array.from(this.states.values())
      .filter((state) => state.isScaled)
      .map((state) => state.bodyId);
  }

  private createMeshes(body: BodyDefinition): void {
    if (body.class === 'barycenter') {
      return;
    }
    const material = body.visuals.emissive
      ? new THREE.MeshBasicMaterial({ color: body.visuals.baseColour })
      : new THREE.MeshStandardMaterial({
          color: body.visuals.baseColour,
          emissive: body.visuals.emissiveColour ?? 0x000000,
          emissiveIntensity: body.visuals.emissive ? 1 : 0,
          roughness: 1,
          metalness: 0,
        });
    const mesh = new THREE.Mesh(this.sphereGeometry, material);
    mesh.matrixAutoUpdate = true;
    this.group.add(mesh);

    const bodyMeshes: BodyMeshes = { body: mesh };
    if (body.visuals.rings) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.55, 1, 96),
        new THREE.MeshBasicMaterial({ color: body.visuals.rings.colour, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      );
      ring.rotation.x = Math.PI / 2;
      this.group.add(ring);
      bodyMeshes.ring = ring;
    }
    this.meshes.set(body.id, bodyMeshes);
  }
}
