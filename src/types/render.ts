/**
 * Types for the rendering layer.
 * These bridge the truth model to Three.js GPU coordinates.
 */

import * as THREE from 'three';
import { BodyId } from './bodies';
import { Vec3Km } from './ephemeris';

/**
 * Scale regime determines which dataset/detail level is active.
 * Regimes have overlapping distance ranges to allow smooth blending.
 */
export type ScaleRegime = 'galactic' | 'solar_system' | 'planetary';

/**
 * Active scale context computed each frame by the ScaleManager.
 * All render-layer code reads scale from this context, never from globals.
 */
export interface ScaleContext {
  /** Current regime. */
  regime: ScaleRegime;
  /** Kilometres per one Three.js world unit. */
  kmPerUnit: number;
  /** Camera near clipping plane in world units. */
  cameraNear: number;
  /** Camera far clipping plane in world units. */
  cameraFar: number;
  /**
   * World-space origin expressed in truth km.
   * All truth positions are offset by this before converting to world units.
   */
  originKm: Vec3Km;
}

/**
 * Per-frame render context passed to all rendering modules.
 */
export interface RenderContext {
  scale: ScaleContext;
  /** The Three.js scene graph root. */
  scene: THREE.Scene;
  /** Active camera. */
  camera: THREE.PerspectiveCamera;
  /** Current simulation time in TDB seconds since J2000. */
  simTimeTdbS: number;
  /** Wall-clock delta time in seconds since last frame. */
  deltaS: number;
  /** Currently focused body (null = free camera). */
  focusBodyId: BodyId | null;
}

/**
 * Camera state managed by the CameraController.
 */
export interface CameraState {
  /** ID of the body the camera is focused on. */
  targetBodyId: BodyId | null;
  /** Distance from the target body centre in km. */
  distanceKm: number;
  /** Camera azimuth angle in radians. */
  azimuth: number;
  /** Camera elevation angle in radians. */
  elevation: number;
  /** True while a fly-to animation is in progress. */
  flying: boolean;
}

/**
 * LOD (Level of Detail) level for a rendered body.
 */
export type LodLevel = 'point' | 'sphere_low' | 'sphere_high' | 'full';

/**
 * Per-body render state tracked by the BodyRenderer.
 */
export interface BodyRenderState {
  bodyId: BodyId;
  lod: LodLevel;
  /** Last computed world-space position (camera-relative). */
  worldPos: THREE.Vector3;
  /** True if visual size scaling is applied (size != physical). */
  isScaled: boolean;
  /** Current visual radius in world units. */
  visualRadiusUnits: number;
  /** Physical radius converted to world units at current scale. */
  physicalRadiusUnits: number;
}

/**
 * Options controlling how a body is rendered.
 */
export interface BodyRenderOptions {
  /** Minimum visual radius in pixels (prevents bodies from being invisible). */
  minVisualRadiusPx: number;
  /** When true, render bodies at strict physical scale only. */
  strictTrueScale: boolean;
}
