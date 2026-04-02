import { assert } from '../../core/validation';
import { EphemerisDataset } from '../../types/ephemeris';
import {
  EPHEMERIS_FORMAT_VERSION,
  EphemerisFile,
  RuntimeDataManifest,
} from '../formats/ephemerisFormat';

export async function loadRuntimeManifest(
  url: string
): Promise<RuntimeDataManifest> {
  const response = await fetch(url);
  assert(response.ok, `Failed to load runtime manifest: ${url}`);
  return (await response.json()) as RuntimeDataManifest;
}

export async function loadEphemerisDataset(
  url: string
): Promise<EphemerisDataset> {
  const response = await fetch(url);
  assert(response.ok, `Failed to load ephemeris dataset: ${url}`);
  const file = (await response.json()) as EphemerisFile;
  assert(
    file.version === EPHEMERIS_FORMAT_VERSION,
    `Unsupported ephemeris version ${file.version}`
  );
  return file;
}

export interface WorkerDecodedEphemerisChunk {
  bodyId: string;
  startTdbS: number;
  endTdbS: number;
  samples: Float64Array;
}

// TODO: Move binary ephemeris decoding into a Web Worker for streamed datasets.
