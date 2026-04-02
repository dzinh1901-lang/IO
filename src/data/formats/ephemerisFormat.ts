import { EphemerisDataset } from '../../types/ephemeris';

export const EPHEMERIS_FORMAT_VERSION = 1;

export interface EphemerisChunkIndexEntry {
  chunkId: string;
  bodyId: string;
  startTdbS: number;
  endTdbS: number;
  byteLength: number;
  url: string;
}

export interface RuntimeDataManifest {
  version: number;
  bodyCatalogUrl: string;
  ephemerisChunks: EphemerisChunkIndexEntry[];
  notes?: string[];
}

export interface EphemerisFile extends EphemerisDataset {
  version: number;
}
