import { assertNonNegativeKm } from '../core/validation';
import { BodyDefinition, BodyId } from '../types/bodies';

export class BodyCatalog {
  private readonly bodies = new Map<BodyId, BodyDefinition>();

  public constructor(definitions: BodyDefinition[]) {
    definitions.forEach((definition) => {
      assertNonNegativeKm(definition.physics.radiusKm, `${definition.id}.radiusKm`);
      this.bodies.set(definition.id, definition);
    });
  }

  public getAll(): BodyDefinition[] {
    return Array.from(this.bodies.values());
  }

  public get(bodyId: BodyId): BodyDefinition | undefined {
    return this.bodies.get(bodyId);
  }

  public search(query: string): BodyDefinition[] {
    const lowered = query.trim().toLowerCase();
    if (!lowered) {
      return this.getAll();
    }
    return this.getAll().filter(
      (body) =>
        body.name.toLowerCase().includes(lowered) || body.id.includes(lowered)
    );
  }
}
