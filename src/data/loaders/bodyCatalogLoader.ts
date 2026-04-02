import { BodyDefinition } from '../../types/bodies';
import { assert } from '../../core/validation';
import {
  BODY_CATALOG_FORMAT_VERSION,
  BodyCatalogFile,
} from '../formats/bodyCatalogFormat';

export async function loadBodyCatalog(url: string): Promise<BodyDefinition[]> {
  const response = await fetch(url);
  assert(response.ok, `Failed to load body catalog: ${url}`);
  const file = (await response.json()) as BodyCatalogFile;
  assert(
    file.version === BODY_CATALOG_FORMAT_VERSION,
    `Unsupported body catalog version ${file.version}`
  );
  return file.bodies;
}
