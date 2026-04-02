import { BodyDefinition, BodyId } from '../types/bodies';
import { EphemerisQueryResult, EphemerisSample } from '../types/ephemeris';
import { BodyCatalog } from './bodyCatalog';
import { EphemerisProvider } from './ephemerisProvider';

export class TruthStore {
  public readonly catalog: BodyCatalog;

  public constructor(
    definitions: BodyDefinition[],
    private readonly ephemerisProvider: EphemerisProvider
  ) {
    this.catalog = new BodyCatalog(definitions);
  }

  public getBodies(): BodyDefinition[] {
    return this.catalog.getAll();
  }

  public getBody(bodyId: BodyId): BodyDefinition | undefined {
    return this.catalog.get(bodyId);
  }

  public searchBodies(query: string): BodyDefinition[] {
    return this.catalog.search(query);
  }

  public getState(bodyId: BodyId, tdbS: number): EphemerisQueryResult {
    return this.ephemerisProvider.getState(bodyId, tdbS);
  }

  public sampleOrbit(bodyId: BodyId, tdbS: number, sampleCount: number): EphemerisSample[] {
    return this.ephemerisProvider.sampleOrbit(bodyId, tdbS, sampleCount);
  }
}
