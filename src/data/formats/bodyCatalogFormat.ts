import { BodyDefinition } from '../../types/bodies';

export const BODY_CATALOG_FORMAT_VERSION = 1;

export interface BodyCatalogFile {
  version: number;
  generatedAtIso: string;
  bodies: BodyDefinition[];
  notes?: string[];
}
